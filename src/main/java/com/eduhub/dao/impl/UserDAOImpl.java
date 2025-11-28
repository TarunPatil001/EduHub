package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of UserDAO interface
 */
public class UserDAOImpl implements UserDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);
    
    @Override
    public String createUser(User user) throws SQLException {
        String sql = "INSERT INTO users (user_id, institute_id, full_name, email, password_hash, " +
                    "phone, role, status, profile_photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, user.getUserId());
            pstmt.setString(2, user.getInstituteId());
            pstmt.setString(3, user.getFullName());
            pstmt.setString(4, user.getEmail());
            pstmt.setString(5, user.getPasswordHash());
            pstmt.setString(6, user.getPhone());
            pstmt.setString(7, user.getRole());
            
            if (user.getProfilePhotoUrl() != null) {
                pstmt.setString(8, user.getProfilePhotoUrl());
            } else {
                pstmt.setNull(8, java.sql.Types.VARCHAR);
            }
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }
            
            logger.info("User created successfully with ID: {} for institute: {}", 
                       user.getUserId(), user.getInstituteId());
            return user.getUserId();
        }
    }
    
    @Override
    public User getUserById(String userId) throws SQLException {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, userId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        return null;
    }
    
    @Override
    public User getUserByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, email);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        return null;
    }
    
    @Override
    public User getAdminByInstituteId(String instituteId) throws SQLException {
        String sql = "SELECT * FROM users WHERE institute_id = ? AND role = 'admin' LIMIT 1";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        return null;
    }
    
    @Override
    public List<User> getAllAdminAccounts() throws SQLException {
        String sql = "SELECT * FROM users WHERE role = 'admin'";
        List<User> adminUsers = new ArrayList<>();
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                adminUsers.add(mapResultSetToUser(rs));
            }
        }
        return adminUsers;
    }
    
    // Note: Activation methods removed - users are automatically active upon creation
    
    @Override
    public User validateLogin(String email, String password) throws SQLException {
        // First, get the user by email to retrieve the stored hash
        User user = getUserByEmail(email);

        if (user != null) {
            // Now, verify the provided password against the stored hash
            if (PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
                // Before returning the user, check if their institute is approved
                String sql = "SELECT i.registration_status FROM institutes i WHERE i.institute_id = ?";
                try (Connection conn = DBUtil.getConnection();
                     PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    
                    pstmt.setString(1, user.getInstituteId());
                    try (ResultSet rs = pstmt.executeQuery()) {
                        if (rs.next()) {
                            String registrationStatus = rs.getString("registration_status");
                            if ("approved".equalsIgnoreCase(registrationStatus)) {
                                logger.info("Login validated for user: {}", email);
                                return user; // Password is correct and institute is approved
                            } else {
                                logger.warn("Login failed for user {}: Institute not approved (status: {})", email, registrationStatus);
                            }
                        }
                    }
                }
            } else {
                logger.warn("Login validation failed for user {}: Incorrect password.", email);
            }
        } else {
            logger.warn("Login validation failed: No user found with email {}", email);
        }

        return null; // Return null if user not found, password incorrect, or institute not approved
    }
    
    @Override
    public void updateLastLogin(String userId) throws SQLException {
        String sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, userId);
            pstmt.executeUpdate();
            logger.info("Last login updated for user: {}", userId);
        }
    }
    
    @Override
    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        
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
    public boolean updateUser(User user) throws SQLException {
        String sql = "UPDATE users SET full_name = ?, phone = ?, profile_photo_url = ? WHERE user_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, user.getFullName());
            pstmt.setString(2, user.getPhone());
            pstmt.setString(3, user.getProfilePhotoUrl());
            pstmt.setString(4, user.getUserId());
            
            int affectedRows = pstmt.executeUpdate();
            logger.info("User update attempted for user ID: {}. Rows affected: {}", user.getUserId(), affectedRows);
            return affectedRows > 0;
        }
    }

    @Override
    public boolean updatePassword(String userId, String newPasswordHash) throws SQLException {
        String sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, newPasswordHash);
            pstmt.setString(2, userId);
            
            int affectedRows = pstmt.executeUpdate();
            logger.info("Password update attempted for user ID: {}. Rows affected: {}", userId, affectedRows);
            return affectedRows > 0;
        }
    }

    /**
     * Helper method to map ResultSet to User object
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getString("user_id"));
        user.setInstituteId(rs.getString("institute_id"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setPhone(rs.getString("phone"));
        user.setRole(rs.getString("role"));
        user.setStatus(rs.getString("status"));
        user.setProfilePhotoUrl(rs.getString("profile_photo_url"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));
        user.setLastLogin(rs.getTimestamp("last_login"));
        return user;
    }
}