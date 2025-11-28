package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.model.Institute;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of InstituteDAO interface
 */
public class InstituteDAOImpl implements InstituteDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(InstituteDAOImpl.class);
    
    @Override
    public String createInstitute(Institute institute) throws SQLException {
        String sql = "INSERT INTO institutes (institute_id, institute_name, institute_type, institute_email, " +
                    "institute_phone, address, city, state, zip_code, country, registration_status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, institute.getInstituteId());
            pstmt.setString(2, institute.getInstituteName());
            pstmt.setString(3, institute.getInstituteType());
            pstmt.setString(4, institute.getInstituteEmail());
            pstmt.setString(5, institute.getInstitutePhone());
            pstmt.setString(6, institute.getAddress());
            pstmt.setString(7, institute.getCity());
            pstmt.setString(8, institute.getState());
            pstmt.setString(9, institute.getZipCode());
            pstmt.setString(10, institute.getCountry());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Creating institute failed, no rows affected.");
            }
            
            logger.info("Institute created successfully with ID: {}", institute.getInstituteId());
            return institute.getInstituteId();
        }
    }
    
    @Override
    public Institute getInstituteById(String instituteId) throws SQLException {
        String sql = "SELECT * FROM institutes WHERE institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToInstitute(rs);
                }
            }
        }
        return null;
    }
    
    @Override
    public Institute getInstituteByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM institutes WHERE institute_email = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, email);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToInstitute(rs);
                }
            }
        }
        return null;
    }
    
    // Note: Approval methods removed - institutes are now automatically approved upon registration
    
    @Override
    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT COUNT(*) FROM institutes WHERE institute_email = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, email);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
    
    @Override
    public boolean updateInstitute(Institute institute) throws SQLException {
        String sql = "UPDATE institutes SET institute_name = ?, institute_type = ?, institute_email = ?, " +
                    "institute_phone = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, " +
                    "updated_at = CURRENT_TIMESTAMP WHERE institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, institute.getInstituteName());
            pstmt.setString(2, institute.getInstituteType());
            pstmt.setString(3, institute.getInstituteEmail());
            pstmt.setString(4, institute.getInstitutePhone());
            pstmt.setString(5, institute.getAddress());
            pstmt.setString(6, institute.getCity());
            pstmt.setString(7, institute.getState());
            pstmt.setString(8, institute.getZipCode());
            pstmt.setString(9, institute.getCountry());
            pstmt.setString(10, institute.getInstituteId());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        }
    }
    
    /**
     * Helper method to map ResultSet to Institute object
     */
    private Institute mapResultSetToInstitute(ResultSet rs) throws SQLException {
        Institute institute = new Institute();
        institute.setInstituteId(rs.getString("institute_id"));
        institute.setInstituteName(rs.getString("institute_name"));
        institute.setInstituteType(rs.getString("institute_type"));
        institute.setInstituteEmail(rs.getString("institute_email"));
        institute.setInstitutePhone(rs.getString("institute_phone"));
        institute.setAddress(rs.getString("address"));
        institute.setCity(rs.getString("city"));
        institute.setState(rs.getString("state"));
        institute.setZipCode(rs.getString("zip_code"));
        institute.setCountry(rs.getString("country"));
        institute.setRegistrationStatus(rs.getString("registration_status"));
        institute.setCreatedAt(rs.getTimestamp("created_at"));
        institute.setUpdatedAt(rs.getTimestamp("updated_at"));
        institute.setApprovedAt(rs.getTimestamp("approved_at"));
        
        String approvedBy = rs.getString("approved_by");
        if (!rs.wasNull()) {
            institute.setApprovedBy(approvedBy);
        }
        
        institute.setRejectionReason(rs.getString("rejection_reason"));
        return institute;
    }
}
