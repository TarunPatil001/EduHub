package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.FeeDAO;
import com.eduhub.model.Fee;
import com.eduhub.model.Transaction;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FeeDAOImpl implements FeeDAO {
    private static final Logger logger = LoggerFactory.getLogger(FeeDAOImpl.class);

    @Override
    public boolean addFee(Fee fee) {
        String sql = "INSERT INTO fees (fee_id, institute_id, student_id, total_fee, paid_amount, pending_amount, status, last_payment_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, fee.getFeeId());
            pstmt.setString(2, fee.getInstituteId());
            pstmt.setString(3, fee.getStudentId());
            pstmt.setBigDecimal(4, fee.getTotalFee());
            pstmt.setBigDecimal(5, fee.getPaidAmount());
            pstmt.setBigDecimal(6, fee.getPendingAmount());
            pstmt.setString(7, fee.getStatus());
            pstmt.setDate(8, fee.getLastPaymentDate());
            pstmt.setDate(9, fee.getDueDate());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error adding fee", e);
        }
        return false;
    }

    @Override
    public boolean addTransaction(Transaction transaction) {
        String sql = "INSERT INTO transactions (transaction_id, fee_id, institute_id, student_id, amount, payment_mode, transaction_date, status, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, transaction.getTransactionId());
            pstmt.setString(2, transaction.getFeeId());
            pstmt.setString(3, transaction.getInstituteId());
            pstmt.setString(4, transaction.getStudentId());
            pstmt.setBigDecimal(5, transaction.getAmount());
            pstmt.setString(6, transaction.getPaymentMode());
            pstmt.setTimestamp(7, transaction.getTransactionDate());
            pstmt.setString(8, transaction.getStatus());
            pstmt.setString(9, transaction.getRemarks());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error adding transaction", e);
        }
        return false;
    }

    @Override
    public List<Transaction> getTransactionsByStudentId(String studentId) {
        List<Transaction> transactions = new ArrayList<>();
        String sql = "SELECT * FROM transactions WHERE student_id = ? ORDER BY transaction_date DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Transaction t = new Transaction();
                    t.setTransactionId(rs.getString("transaction_id"));
                    t.setFeeId(rs.getString("fee_id"));
                    t.setInstituteId(rs.getString("institute_id"));
                    t.setStudentId(rs.getString("student_id"));
                    t.setAmount(rs.getBigDecimal("amount"));
                    t.setPaymentMode(rs.getString("payment_mode"));
                    t.setTransactionDate(rs.getTimestamp("transaction_date"));
                    t.setStatus(rs.getString("status"));
                    t.setRemarks(rs.getString("remarks"));
                    t.setCreatedAt(rs.getTimestamp("created_at"));
                    transactions.add(t);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting transactions by student id", e);
        }
        return transactions;
    }

    @Override
    public boolean updateFee(Fee fee) {
        String sql = "UPDATE fees SET total_fee=?, paid_amount=?, pending_amount=?, status=?, last_payment_date=?, due_date=? WHERE fee_id=?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setBigDecimal(1, fee.getTotalFee());
            pstmt.setBigDecimal(2, fee.getPaidAmount());
            pstmt.setBigDecimal(3, fee.getPendingAmount());
            pstmt.setString(4, fee.getStatus());
            pstmt.setDate(5, fee.getLastPaymentDate());
            pstmt.setDate(6, fee.getDueDate());
            pstmt.setString(7, fee.getFeeId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error updating fee", e);
        }
        return false;
    }

    @Override
    public Fee getFeeByStudentId(String studentId) {
        String sql = "SELECT * FROM fees WHERE student_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToFee(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting fee by student id", e);
        }
        return null;
    }

    @Override
    public List<Fee> getAllFees(String instituteId) {
        // This might not be used directly, usually filtered
        return getFeesByFilters(instituteId, null, null, null, 1, 1000);
    }

    @Override
    public List<Fee> getFeesByFilters(String instituteId, String courseId, String status, String search, int page, int pageSize) {
        List<Fee> fees = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT s.student_id, s.student_name, s.surname, s.batch_id, s.profile_photo_url, " +
            "b.batch_name, b.course_id, c.course_name, c.fee as course_fee, " +
            "f.fee_id, f.total_fee, f.paid_amount, f.pending_amount, f.status, f.last_payment_date, f.due_date, f.created_at, f.updated_at " +
            "FROM students s " +
            "LEFT JOIN fees f ON s.student_id = f.student_id " +
            "LEFT JOIN batches b ON s.batch_id = b.batch_id " +
            "LEFT JOIN courses c ON b.course_id = c.course_id " +
            "WHERE s.institute_id = ? "
        );

        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty()) {
            sql.append(" AND b.course_id = ?");
            params.add(courseId);
        }

        if (status != null && !status.isEmpty()) {
            if ("Unpaid".equalsIgnoreCase(status)) {
                // Unpaid means no fee record or status is Pending/Unpaid
                sql.append(" AND (f.status IS NULL OR f.status = 'Pending' OR f.status = 'Unpaid')");
            } else {
                sql.append(" AND f.status = ?");
                params.add(status);
            }
        }

        if (search != null && !search.isEmpty()) {
            sql.append(" AND (LOWER(s.student_name) LIKE ? OR LOWER(s.surname) LIKE ? OR s.student_id LIKE ?)");
            String searchPattern = "%" + search.toLowerCase() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        sql.append(" ORDER BY s.student_name LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add((page - 1) * pageSize);

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Fee fee = new Fee();
                    BigDecimal courseFee = rs.getBigDecimal("course_fee");
                    if (courseFee == null) courseFee = BigDecimal.ZERO;

                    // Populate from fees table if exists
                    String feeId = rs.getString("fee_id");
                    if (feeId != null) {
                        fee.setFeeId(feeId);
                        // Use total_fee from DB if set, otherwise fallback to course fee
                        BigDecimal dbTotalFee = rs.getBigDecimal("total_fee");
                        fee.setTotalFee((dbTotalFee != null && dbTotalFee.compareTo(BigDecimal.ZERO) > 0) ? dbTotalFee : courseFee);
                        
                        fee.setPaidAmount(rs.getBigDecimal("paid_amount"));
                        fee.setPendingAmount(rs.getBigDecimal("pending_amount"));
                        fee.setStatus(rs.getString("status"));
                        fee.setLastPaymentDate(rs.getDate("last_payment_date"));
                        fee.setDueDate(rs.getDate("due_date"));
                        fee.setCreatedAt(rs.getTimestamp("created_at"));
                        fee.setUpdatedAt(rs.getTimestamp("updated_at"));
                    } else {
                        // Default values for students without fee records
                        fee.setTotalFee(courseFee);
                        fee.setPaidAmount(BigDecimal.ZERO);
                        fee.setPendingAmount(courseFee);
                        fee.setStatus("Pending");
                    }
                    
                    // Populate transient fields
                    fee.setStudentId(rs.getString("student_id"));
                    String fullName = rs.getString("student_name");
                    if (rs.getString("surname") != null) {
                        fullName += " " + rs.getString("surname");
                    }
                    fee.setStudentName(fullName);
                    fee.setBatchId(rs.getString("batch_id"));
                    fee.setBatchName(rs.getString("batch_name"));
                    fee.setCourseName(rs.getString("course_name"));
                    fee.setProfilePhotoUrl(rs.getString("profile_photo_url"));
                    
                    fees.add(fee);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting fees by filters", e);
        }
        return fees;
    }

    @Override
    public int getFeeCountByFilters(String instituteId, String courseId, String status, String search) {
        StringBuilder sql = new StringBuilder(
            "SELECT COUNT(*) " +
            "FROM students s " +
            "LEFT JOIN fees f ON s.student_id = f.student_id " +
            "LEFT JOIN batches b ON s.batch_id = b.batch_id " +
            "WHERE s.institute_id = ? "
        );

        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty()) {
            sql.append(" AND b.course_id = ?");
            params.add(courseId);
        }

        if (status != null && !status.isEmpty()) {
            if ("Unpaid".equalsIgnoreCase(status)) {
                sql.append(" AND (f.status IS NULL OR f.status = 'Pending' OR f.status = 'Unpaid')");
            } else {
                sql.append(" AND f.status = ?");
                params.add(status);
            }
        }

        if (search != null && !search.isEmpty()) {
            sql.append(" AND (LOWER(s.student_name) LIKE ? OR LOWER(s.surname) LIKE ? OR s.student_id LIKE ?)");
            String searchPattern = "%" + search.toLowerCase() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting fee count", e);
        }
        return 0;
    }

    @Override
    public int getPaidCount(String instituteId) {
        return getCountByStatus(instituteId, "Paid");
    }

    @Override
    public int getPartialCount(String instituteId) {
        return getCountByStatus(instituteId, "Partial");
    }

    @Override
    public int getPendingCount(String instituteId) {
        // Includes NULL status (no record) as Pending
        String sql = "SELECT COUNT(*) FROM students s LEFT JOIN fees f ON s.student_id = f.student_id WHERE s.institute_id = ? AND (f.status = 'Pending' OR f.status IS NULL)";
        return executeCountQuery(sql, instituteId);
    }

    @Override
    public int getOverdueCount(String instituteId) {
        return getCountByStatus(instituteId, "Overdue");
    }

    private int getCountByStatus(String instituteId, String status) {
        String sql = "SELECT COUNT(*) FROM fees f JOIN students s ON f.student_id = s.student_id WHERE s.institute_id = ? AND f.status = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            pstmt.setString(2, status);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error getting count by status", e);
        }
        return 0;
    }
    
    private int executeCountQuery(String sql, String instituteId) {
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error executing count query", e);
        }
        return 0;
    }

    @Override
    public double getTotalCollected(String instituteId) {
        String sql = "SELECT SUM(paid_amount) FROM fees f JOIN students s ON f.student_id = s.student_id WHERE s.institute_id = ?";
        return executeSumQuery(sql, instituteId);
    }

    @Override
    public double getTotalPending(String instituteId) {
        String sql = "SELECT SUM(pending_amount) FROM fees f JOIN students s ON f.student_id = s.student_id WHERE s.institute_id = ?";
        return executeSumQuery(sql, instituteId);
    }
    
    private double executeSumQuery(String sql, String instituteId) {
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) return rs.getDouble(1);
            }
        } catch (SQLException e) {
            logger.error("Error executing sum query", e);
        }
        return 0.0;
    }

    private Fee mapResultSetToFee(ResultSet rs) throws SQLException {
        Fee fee = new Fee();
        fee.setFeeId(rs.getString("fee_id"));
        fee.setStudentId(rs.getString("student_id"));
        fee.setTotalFee(rs.getBigDecimal("total_fee"));
        fee.setPaidAmount(rs.getBigDecimal("paid_amount"));
        fee.setPendingAmount(rs.getBigDecimal("pending_amount"));
        fee.setStatus(rs.getString("status"));
        fee.setLastPaymentDate(rs.getDate("last_payment_date"));
        fee.setDueDate(rs.getDate("due_date"));
        fee.setCreatedAt(rs.getTimestamp("created_at"));
        fee.setUpdatedAt(rs.getTimestamp("updated_at"));
        return fee;
    }
}
