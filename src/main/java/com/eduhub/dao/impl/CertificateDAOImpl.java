package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.CertificateDAO;
import com.eduhub.model.Certificate;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of CertificateDAO interface.
 */
public class CertificateDAOImpl implements CertificateDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(CertificateDAOImpl.class);

    @Override
    public boolean addCertificate(Certificate cert) {
        // Note: course_name and student_name are NOT stored - they are fetched fresh from related tables
        String sql = "INSERT INTO certificates (certificate_id, student_id, institute_id, batch_id, course_id, " +
                     "certificate_type, description, issue_date, expiry_date, " +
                     "verification_token, verification_url, is_revoked, signatory_name, signatory_title, " +
                     "generated_by, download_count) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            int i = 1;
            pstmt.setString(i++, cert.getCertificateId());
            pstmt.setString(i++, cert.getStudentId());
            pstmt.setString(i++, cert.getInstituteId());
            pstmt.setString(i++, cert.getBatchId());
            pstmt.setString(i++, cert.getCourseId());
            pstmt.setString(i++, cert.getCertificateType());
            pstmt.setString(i++, cert.getDescription());
            pstmt.setDate(i++, cert.getIssueDate());
            pstmt.setDate(i++, cert.getExpiryDate());
            pstmt.setString(i++, cert.getVerificationToken());
            pstmt.setString(i++, cert.getVerificationUrl());
            pstmt.setBoolean(i++, cert.isRevoked());
            pstmt.setString(i++, cert.getSignatoryName());
            pstmt.setString(i++, cert.getSignatoryTitle());
            pstmt.setString(i++, cert.getGeneratedBy());
            pstmt.setInt(i++, 0);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error adding certificate: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public Certificate getCertificateById(String certificateId) {
        String sql = "SELECT * FROM certificates WHERE certificate_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certificateId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToCertificate(rs);
            }
        } catch (SQLException e) {
            logger.error("Error getting certificate by ID: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public Certificate getCertificateByToken(String verificationToken) {
        logger.info("[DB] Looking up certificate by token: {}", verificationToken);
        String sql = "SELECT * FROM certificates WHERE verification_token = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, verificationToken);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Certificate cert = mapResultSetToCertificate(rs);
                logger.info("[DB] Found certificate: {} for student: {}", cert.getCertificateId(), cert.getStudentId());
                return cert;
            } else {
                logger.info("[DB] No certificate found with token: {}", verificationToken);
            }
        } catch (SQLException e) {
            logger.error("[DB] Error getting certificate by token: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<Certificate> getCertificatesByStudent(String studentId, String instituteId) {
        List<Certificate> certificates = new ArrayList<>();
        String sql = "SELECT * FROM certificates WHERE student_id = ? AND institute_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                certificates.add(mapResultSetToCertificate(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting certificates by student: {}", e.getMessage(), e);
        }
        return certificates;
    }

    @Override
    public List<Certificate> getCertificatesByBatch(String batchId, String instituteId) {
        List<Certificate> certificates = new ArrayList<>();
        String sql = "SELECT * FROM certificates WHERE batch_id = ? AND institute_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, batchId);
            pstmt.setString(2, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                certificates.add(mapResultSetToCertificate(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting certificates by batch: {}", e.getMessage(), e);
        }
        return certificates;
    }

    @Override
    public List<Certificate> getCertificatesByInstitute(String instituteId) {
        List<Certificate> certificates = new ArrayList<>();
        String sql = "SELECT * FROM certificates WHERE institute_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                certificates.add(mapResultSetToCertificate(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting certificates by institute: {}", e.getMessage(), e);
        }
        return certificates;
    }

    @Override
    public List<Certificate> getCertificatesByInstitute(String instituteId, int page, int pageSize) {
        List<Certificate> certificates = new ArrayList<>();
        String sql = "SELECT * FROM certificates WHERE institute_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            pstmt.setInt(2, pageSize);
            pstmt.setInt(3, (page - 1) * pageSize);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                certificates.add(mapResultSetToCertificate(rs));
            }
        } catch (SQLException e) {
            logger.error("Error getting certificates with pagination: {}", e.getMessage(), e);
        }
        return certificates;
    }

    @Override
    public int getCertificateCount(String instituteId) {
        String sql = "SELECT COUNT(*) FROM certificates WHERE institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error getting certificate count: {}", e.getMessage(), e);
        }
        return 0;
    }

    @Override
    public boolean updateCertificate(Certificate cert) {
        String sql = "UPDATE certificates SET certificate_type = ?, course_name = ?, description = ?, " +
                     "issue_date = ?, expiry_date = ?, signatory_name = ?, signatory_title = ? " +
                     "WHERE certificate_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, cert.getCertificateType());
            pstmt.setString(2, cert.getCourseName());
            pstmt.setString(3, cert.getDescription());
            pstmt.setDate(4, cert.getIssueDate());
            pstmt.setDate(5, cert.getExpiryDate());
            pstmt.setString(6, cert.getSignatoryName());
            pstmt.setString(7, cert.getSignatoryTitle());
            pstmt.setString(8, cert.getCertificateId());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error updating certificate: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean revokeCertificate(String certificateId, String reason) {
        String sql = "UPDATE certificates SET is_revoked = true, revoke_reason = ?, revoked_at = CURRENT_TIMESTAMP " +
                     "WHERE certificate_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, reason);
            pstmt.setString(2, certificateId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error revoking certificate: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean restoreCertificate(String certificateId) {
        String sql = "UPDATE certificates SET is_revoked = false, revoke_reason = NULL, revoked_at = NULL " +
                     "WHERE certificate_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certificateId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error restoring certificate: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean incrementDownloadCount(String certificateId) {
        String sql = "UPDATE certificates SET download_count = download_count + 1, updated_at = CURRENT_TIMESTAMP " +
                     "WHERE certificate_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certificateId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error incrementing download count: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean certificateExists(String studentId, String courseId, String batchId) {
        String sql = "SELECT COUNT(*) FROM certificates WHERE student_id = ? AND " +
                     "(course_id = ? OR batch_id = ?) AND is_revoked = false";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, courseId);
            pstmt.setString(3, batchId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            logger.error("Error checking certificate existence: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean certificateExistsWithType(String studentId, String batchId, String certificateType, String instituteId) {
        String sql = "SELECT COUNT(*) FROM certificates WHERE student_id = ? AND batch_id = ? " +
                     "AND certificate_type = ? AND institute_id = ? AND is_revoked = false";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, batchId);
            pstmt.setString(3, certificateType);
            pstmt.setString(4, instituteId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            logger.error("Error checking certificate existence with type: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteCertificate(String certificateId, String instituteId) {
        String sql = "DELETE FROM certificates WHERE certificate_id = ? AND institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certificateId);
            pstmt.setString(2, instituteId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error deleting certificate: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean logCertificateAccess(String certificateId, String accessType, String accessedBy, String ipAddress, String userAgent) {
        String sql = "INSERT INTO certificate_access_log (certificate_id, access_type, accessed_by, ip_address, user_agent) " +
                     "VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certificateId);
            pstmt.setString(2, accessType);
            pstmt.setString(3, accessedBy);
            pstmt.setString(4, ipAddress);
            pstmt.setString(5, userAgent);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error logging certificate access: {}", e.getMessage(), e);
        }
        return false;
    }

    /**
     * Helper method to map ResultSet to Certificate object
     */
    private Certificate mapResultSetToCertificate(ResultSet rs) throws SQLException {
        Certificate cert = new Certificate();
        cert.setCertificateId(rs.getString("certificate_id"));
        cert.setStudentId(rs.getString("student_id"));
        cert.setInstituteId(rs.getString("institute_id"));
        cert.setBatchId(rs.getString("batch_id"));
        cert.setCourseId(rs.getString("course_id"));
        cert.setCertificateType(rs.getString("certificate_type"));
        // Note: course_name and student_name are NOT stored in DB
        // They are fetched fresh from related tables when displaying
        cert.setDescription(rs.getString("description"));
        cert.setIssueDate(rs.getDate("issue_date"));
        cert.setExpiryDate(rs.getDate("expiry_date"));
        cert.setVerificationToken(rs.getString("verification_token"));
        cert.setVerificationUrl(rs.getString("verification_url"));
        cert.setRevoked(rs.getBoolean("is_revoked"));
        cert.setRevokeReason(rs.getString("revoke_reason"));
        cert.setRevokedAt(rs.getTimestamp("revoked_at"));
        cert.setSignatoryName(rs.getString("signatory_name"));
        cert.setSignatoryTitle(rs.getString("signatory_title"));
        cert.setGeneratedBy(rs.getString("generated_by"));
        cert.setGeneratedAt(rs.getTimestamp("created_at"));
        cert.setDownloadCount(rs.getInt("download_count"));
        cert.setLastDownloadedAt(rs.getTimestamp("updated_at"));
        cert.setPdfStoragePath(rs.getString("pdf_storage_path"));
        return cert;
    }
}
