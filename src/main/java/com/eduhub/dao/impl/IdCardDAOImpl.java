package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.IdCardDAO;
import com.eduhub.model.IdCard;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of IdCardDAO interface.
 */
public class IdCardDAOImpl implements IdCardDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(IdCardDAOImpl.class);

    @Override
    public boolean addIdCard(IdCard idCard) {
        // Note: student_name, department, batch_name, profile_photo_url are NOT stored
        // They are fetched fresh from related tables (students, batches, branches) when displaying
        String sql = "INSERT INTO id_cards (id_card_id, student_id, institute_id, " +
                     "issue_date, valid_until, is_active, verification_token, " +
                     "qr_code_data, generated_by, regeneration_count) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            int i = 1;
            pstmt.setString(i++, idCard.getIdCardId());
            pstmt.setString(i++, idCard.getStudentId());
            pstmt.setString(i++, idCard.getInstituteId());
            pstmt.setDate(i++, idCard.getIssueDate());
            pstmt.setDate(i++, idCard.getValidUntil());
            pstmt.setBoolean(i++, idCard.isActive());
            pstmt.setString(i++, idCard.getVerificationToken());
            pstmt.setString(i++, idCard.getQrCodeData());
            pstmt.setString(i++, idCard.getGeneratedBy());
            pstmt.setInt(i++, 0);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error adding ID card: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public IdCard getIdCardById(String idCardId) {
        String sql = "SELECT * FROM id_cards WHERE id_card_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idCardId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToIdCard(rs);
            }
        } catch (SQLException e) {
            logger.error("Error getting ID card by ID: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public IdCard getIdCardByToken(String verificationToken) {
        String sql = "SELECT * FROM id_cards WHERE verification_token = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, verificationToken);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToIdCard(rs);
            }
        } catch (SQLException e) {
            logger.error("Error getting ID card by token: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public IdCard getActiveIdCardByStudent(String studentId, String instituteId) {
        String sql = "SELECT * FROM id_cards WHERE student_id = ? AND institute_id = ? AND is_active = true " +
                     "ORDER BY created_at DESC LIMIT 1";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToIdCard(rs);
            }
        } catch (SQLException e) {
            logger.error("Error getting active ID card by student: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<IdCard> getIdCardsByStudent(String studentId, String instituteId) {
        List<IdCard> idCards = new ArrayList<>();
        String sql = "SELECT * FROM id_cards WHERE student_id = ? AND institute_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                idCards.add(mapResultSetToIdCard(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting ID cards by student: {}", e.getMessage(), e);
        }
        return idCards;
    }

    @Override
    public List<IdCard> getIdCardsByInstitute(String instituteId) {
        List<IdCard> idCards = new ArrayList<>();
        String sql = "SELECT * FROM id_cards WHERE institute_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                idCards.add(mapResultSetToIdCard(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting ID cards by institute: {}", e.getMessage(), e);
        }
        return idCards;
    }

    @Override
    public List<IdCard> getIdCardsByInstitute(String instituteId, int page, int pageSize) {
        List<IdCard> idCards = new ArrayList<>();
        String sql = "SELECT * FROM id_cards WHERE institute_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            pstmt.setInt(2, pageSize);
            pstmt.setInt(3, (page - 1) * pageSize);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                idCards.add(mapResultSetToIdCard(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting ID cards with pagination: {}", e.getMessage(), e);
        }
        return idCards;
    }

    @Override
    public int getIdCardCount(String instituteId) {
        String sql = "SELECT COUNT(*) FROM id_cards WHERE institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error getting ID card count: {}", e.getMessage(), e);
        }
        return 0;
    }

    @Override
    public boolean updateIdCard(IdCard idCard) {
        String sql = "UPDATE id_cards SET student_name = ?, department = ?, batch_name = ?, profile_photo_url = ?, " +
                     "valid_until = ? WHERE id_card_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idCard.getStudentName());
            pstmt.setString(2, idCard.getDepartment());
            pstmt.setString(3, idCard.getBatchName());
            pstmt.setString(4, idCard.getProfilePhotoUrl());
            pstmt.setDate(5, idCard.getValidUntil());
            pstmt.setString(6, idCard.getIdCardId());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error updating ID card: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deactivateIdCard(String idCardId, String reason) {
        String sql = "UPDATE id_cards SET is_active = false, deactivation_reason = ?, deactivated_at = CURRENT_TIMESTAMP " +
                     "WHERE id_card_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, reason);
            pstmt.setString(2, idCardId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error deactivating ID card: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean activateIdCard(String idCardId) {
        String sql = "UPDATE id_cards SET is_active = true, deactivation_reason = NULL, deactivated_at = NULL " +
                     "WHERE id_card_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idCardId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error activating ID card: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean incrementRegenerationCount(String idCardId) {
        String sql = "UPDATE id_cards SET regeneration_count = regeneration_count + 1 " +
                     "WHERE id_card_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idCardId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error incrementing regeneration count: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean activeIdCardExists(String studentId, String instituteId) {
        String sql = "SELECT COUNT(*) FROM id_cards WHERE student_id = ? AND institute_id = ? AND is_active = true";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            logger.error("Error checking active ID card existence: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteIdCard(String idCardId, String instituteId) {
        String sql = "DELETE FROM id_cards WHERE id_card_id = ? AND institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idCardId);
            pstmt.setString(2, instituteId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error deleting ID card: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deactivateAllForStudent(String studentId, String instituteId) {
        String sql = "UPDATE id_cards SET is_active = false, deactivation_reason = 'New ID card generated', " +
                     "deactivated_at = CURRENT_TIMESTAMP WHERE student_id = ? AND institute_id = ? AND is_active = true";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            
            pstmt.executeUpdate();
            return true; // Return true even if no rows affected (no active cards)
        } catch (SQLException e) {
            logger.error("Error deactivating all ID cards for student: {}", e.getMessage(), e);
        }
        return false;
    }

    /**
     * Helper method to map ResultSet to IdCard object
     */
    private IdCard mapResultSetToIdCard(ResultSet rs) throws SQLException {
        IdCard idCard = new IdCard();
        idCard.setIdCardId(rs.getString("id_card_id"));
        idCard.setStudentId(rs.getString("student_id"));
        idCard.setInstituteId(rs.getString("institute_id"));
        // Note: student_name, department, batch_name, profile_photo_url are NOT stored in DB
        // They are fetched fresh from related tables (students, batches, branches) when displaying
        idCard.setIssueDate(rs.getDate("issue_date"));
        idCard.setValidUntil(rs.getDate("valid_until"));
        idCard.setActive(rs.getBoolean("is_active"));
        idCard.setDeactivateReason(rs.getString("deactivation_reason"));
        idCard.setDeactivatedAt(rs.getTimestamp("deactivated_at"));
        idCard.setVerificationToken(rs.getString("verification_token"));
        idCard.setQrCodeData(rs.getString("qr_code_data"));
        idCard.setGeneratedBy(rs.getString("generated_by"));
        idCard.setGeneratedAt(rs.getTimestamp("created_at"));
        idCard.setRegenerationCount(rs.getInt("regeneration_count"));
        idCard.setLastRegeneratedAt(rs.getTimestamp("updated_at"));
        return idCard;
    }
}
