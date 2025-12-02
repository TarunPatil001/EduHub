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
        String sql = "INSERT INTO batches (batch_id, institute_id, course_id, instructor_id, batch_code, batch_name, " +
                     "start_date, end_date, start_time, end_time, max_capacity, class_days, mode_of_conduct, " +
                     "status, classroom_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batch.getBatchId());
            pstmt.setString(2, batch.getInstituteId());
            pstmt.setString(3, batch.getCourseId());
            pstmt.setString(4, batch.getInstructorId());
            pstmt.setString(5, batch.getBatchCode());
            pstmt.setString(6, batch.getBatchName());
            pstmt.setDate(7, java.sql.Date.valueOf(batch.getStartDate()));
            pstmt.setDate(8, batch.getEndDate() != null ? java.sql.Date.valueOf(batch.getEndDate()) : null);
            pstmt.setTime(9, java.sql.Time.valueOf(batch.getStartTime()));
            pstmt.setTime(10, java.sql.Time.valueOf(batch.getEndTime()));
            pstmt.setInt(11, batch.getMaxCapacity());
            pstmt.setString(12, batch.getClassDays());
            pstmt.setString(13, batch.getModeOfConduct());
            pstmt.setString(14, batch.getStatus());
            pstmt.setString(15, batch.getClassroomLocation());
            
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
        String sql = "UPDATE batches SET course_id=?, instructor_id=?, batch_code=?, batch_name=?, " +
                     "start_date=?, end_date=?, start_time=?, end_time=?, max_capacity=?, class_days=?, " +
                     "mode_of_conduct=?, status=?, classroom_location=? WHERE batch_id=? AND institute_id=?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batch.getCourseId());
            pstmt.setString(2, batch.getInstructorId());
            pstmt.setString(3, batch.getBatchCode());
            pstmt.setString(4, batch.getBatchName());
            pstmt.setDate(5, java.sql.Date.valueOf(batch.getStartDate()));
            pstmt.setDate(6, batch.getEndDate() != null ? java.sql.Date.valueOf(batch.getEndDate()) : null);
            pstmt.setTime(7, java.sql.Time.valueOf(batch.getStartTime()));
            pstmt.setTime(8, java.sql.Time.valueOf(batch.getEndTime()));
            pstmt.setInt(9, batch.getMaxCapacity());
            pstmt.setString(10, batch.getClassDays());
            pstmt.setString(11, batch.getModeOfConduct());
            pstmt.setString(12, batch.getStatus());
            pstmt.setString(13, batch.getClassroomLocation());
            pstmt.setString(14, batch.getBatchId());
            pstmt.setString(15, batch.getInstituteId());
            
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

    private Batch mapResultSetToBatch(ResultSet rs) throws SQLException {
        Batch batch = new Batch();
        batch.setBatchId(rs.getString("batch_id"));
        batch.setInstituteId(rs.getString("institute_id"));
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
