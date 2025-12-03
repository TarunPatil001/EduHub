package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.BatchDAO;
import com.eduhub.model.Batch;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BatchDAOImpl implements BatchDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(BatchDAOImpl.class);

    @Override
    public boolean createBatch(Batch batch) {
        String sql = "INSERT INTO batches (batch_id, institute_id, branch_id, course_id, instructor_id, batch_code, batch_name, " +
                     "start_date, end_date, start_time, end_time, max_capacity, class_days, mode_of_conduct, " +
                     "status, classroom_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batch.getBatchId());
            pstmt.setString(2, batch.getInstituteId());
            pstmt.setString(3, batch.getBranchId());
            pstmt.setString(4, batch.getCourseId());
            pstmt.setString(5, batch.getInstructorId());
            pstmt.setString(6, batch.getBatchCode());
            pstmt.setString(7, batch.getBatchName());
            pstmt.setDate(8, java.sql.Date.valueOf(batch.getStartDate()));
            pstmt.setDate(9, batch.getEndDate() != null ? java.sql.Date.valueOf(batch.getEndDate()) : null);
            pstmt.setTime(10, java.sql.Time.valueOf(batch.getStartTime()));
            pstmt.setTime(11, java.sql.Time.valueOf(batch.getEndTime()));
            pstmt.setInt(12, batch.getMaxCapacity());
            pstmt.setString(13, batch.getClassDays());
            pstmt.setString(14, batch.getModeOfConduct());
            pstmt.setString(15, batch.getStatus());
            pstmt.setString(16, batch.getClassroomLocation());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error creating batch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public Batch getBatchById(String batchId, String instituteId) {
        String sql = "SELECT * FROM batches WHERE batch_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batchId);
            pstmt.setString(2, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBatch(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting batch by ID: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<Batch> getBatchesByCourseId(String courseId, String instituteId) {
        List<Batch> batches = new ArrayList<>();
        String sql = "SELECT * FROM batches WHERE course_id = ? AND institute_id = ? ORDER BY start_date DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, courseId);
            pstmt.setString(2, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    batches.add(mapResultSetToBatch(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting batches by course ID: {}", e.getMessage(), e);
        }
        return batches;
    }

    @Override
    public List<Batch> getAllBatches(String instituteId) {
        List<Batch> batches = new ArrayList<>();
        String sql = "SELECT * FROM batches WHERE institute_id = ? ORDER BY created_at DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    batches.add(mapResultSetToBatch(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting all batches: {}", e.getMessage(), e);
        }
        return batches;
    }

    @Override
    public boolean updateBatch(Batch batch) {
        String sql = "UPDATE batches SET branch_id=?, course_id=?, instructor_id=?, batch_code=?, batch_name=?, " +
                     "start_date=?, end_date=?, start_time=?, end_time=?, max_capacity=?, class_days=?, " +
                     "mode_of_conduct=?, status=?, classroom_location=? WHERE batch_id=? AND institute_id=?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batch.getBranchId());
            pstmt.setString(2, batch.getCourseId());
            pstmt.setString(3, batch.getInstructorId());
            pstmt.setString(4, batch.getBatchCode());
            pstmt.setString(5, batch.getBatchName());
            pstmt.setDate(6, java.sql.Date.valueOf(batch.getStartDate()));
            pstmt.setDate(7, batch.getEndDate() != null ? java.sql.Date.valueOf(batch.getEndDate()) : null);
            pstmt.setTime(8, java.sql.Time.valueOf(batch.getStartTime()));
            pstmt.setTime(9, java.sql.Time.valueOf(batch.getEndTime()));
            pstmt.setInt(10, batch.getMaxCapacity());
            pstmt.setString(11, batch.getClassDays());
            pstmt.setString(12, batch.getModeOfConduct());
            pstmt.setString(13, batch.getStatus());
            pstmt.setString(14, batch.getClassroomLocation());
            pstmt.setString(15, batch.getBatchId());
            pstmt.setString(16, batch.getInstituteId());
            
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error updating batch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteBatch(String batchId, String instituteId) {
        String sql = "DELETE FROM batches WHERE batch_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batchId);
            pstmt.setString(2, instituteId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting batch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean isBatchCodeExists(String instituteId, String batchCode) {
        String sql = "SELECT COUNT(*) FROM batches WHERE institute_id = ? AND batch_code = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            pstmt.setString(2, batchCode);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            logger.error("Error checking batch code existence: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery) {
        return getBatchesByFilters(instituteId, courseId, branchId, status, searchQuery, 0, Integer.MAX_VALUE);
    }

    @Override
    public List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery, int offset, int limit) {
        List<Batch> batches = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT b.*, br.branch_name, c.course_name FROM batches b ");
        sql.append("LEFT JOIN branches br ON b.branch_id = br.branch_id ");
        sql.append("LEFT JOIN courses c ON b.course_id = c.course_id ");
        sql.append("WHERE b.institute_id = ?");
        
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) {
            sql.append(" AND b.course_id = ?");
            params.add(courseId);
        }
        
        if (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId)) {
            sql.append(" AND b.branch_id = ?");
            params.add(branchId);
        }
        
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND b.status = ?");
            params.add(status);
        }
        
        if (searchQuery != null && !searchQuery.isEmpty()) {
            sql.append(" AND (LOWER(b.batch_name) LIKE ? OR LOWER(b.batch_code) LIKE ?)");
            String searchPattern = "%" + searchQuery.toLowerCase() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }
        
        sql.append(" ORDER BY b.created_at DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Batch batch = mapResultSetToBatch(rs);
                    // Map joined fields
                    batch.setBranchName(rs.getString("branch_name"));
                    batch.setCourseName(rs.getString("course_name"));
                    batches.add(batch);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting batches by filters: {}", e.getMessage(), e);
        }
        return batches;
    }

    @Override
    public int getBatchCountByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM batches WHERE institute_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) {
            sql.append(" AND course_id = ?");
            params.add(courseId);
        }
        
        if (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId)) {
            sql.append(" AND branch_id = ?");
            params.add(branchId);
        }
        
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND status = ?");
            params.add(status);
        }
        
        if (searchQuery != null && !searchQuery.isEmpty()) {
            sql.append(" AND (LOWER(batch_name) LIKE ? OR LOWER(batch_code) LIKE ?)");
            String searchPattern = "%" + searchQuery.toLowerCase() + "%";
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
            logger.error("Error getting batch count by filters: {}", e.getMessage(), e);
        }
        return 0;
    }

    private Batch mapResultSetToBatch(ResultSet rs) throws SQLException {
        Batch batch = new Batch();
        batch.setBatchId(rs.getString("batch_id"));
        batch.setInstituteId(rs.getString("institute_id"));
        batch.setBranchId(rs.getString("branch_id"));
        batch.setCourseId(rs.getString("course_id"));
        batch.setInstructorId(rs.getString("instructor_id"));
        batch.setBatchCode(rs.getString("batch_code"));
        batch.setBatchName(rs.getString("batch_name"));
        batch.setStartDate(rs.getDate("start_date").toLocalDate());
        if (rs.getDate("end_date") != null) {
            batch.setEndDate(rs.getDate("end_date").toLocalDate());
        }
        batch.setStartTime(rs.getTime("start_time").toLocalTime());
        batch.setEndTime(rs.getTime("end_time").toLocalTime());
        batch.setMaxCapacity(rs.getInt("max_capacity"));
        batch.setClassDays(rs.getString("class_days"));
        batch.setModeOfConduct(rs.getString("mode_of_conduct"));
        batch.setStatus(rs.getString("status"));
        batch.setClassroomLocation(rs.getString("classroom_location"));
        batch.setCreatedAt(rs.getTimestamp("created_at"));
        batch.setUpdatedAt(rs.getTimestamp("updated_at"));
        return batch;
    }
}
