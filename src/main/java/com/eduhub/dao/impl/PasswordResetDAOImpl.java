package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.PasswordResetDAO;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class PasswordResetDAOImpl implements PasswordResetDAO {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetDAOImpl.class);
    private static final int OTP_VALIDITY_MINUTES = 1;

    @Override
    public void saveOtp(String userId, String otp, String refId) throws SQLException {
        String sql = "INSERT INTO password_reset_tokens (user_id, otp, expiry_date, ref_id) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, userId);
            pstmt.setString(2, otp);
            pstmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES)));
            pstmt.setString(4, refId);
            
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean validateOtp(String userId, String otp) throws SQLException {
        String sql = "SELECT id, expiry_date, is_used FROM password_reset_tokens " +
                     "WHERE user_id = ? AND otp = ? AND is_used = FALSE " +
                     "ORDER BY created_at DESC LIMIT 1";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, userId);
            pstmt.setString(2, otp);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Timestamp expiryDate = rs.getTimestamp("expiry_date");
                    if (expiryDate.toLocalDateTime().isAfter(LocalDateTime.now())) {
                        return true;
                    } else {
                        logger.warn("OTP expired for user: {}", userId);
                    }
                }
            }
        }
        return false;
    }

    @Override
    public void markOtpAsUsed(String userId, String otp) throws SQLException {
        String sql = "UPDATE password_reset_tokens SET is_used = TRUE " +
                     "WHERE user_id = ? AND otp = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, userId);
            pstmt.setString(2, otp);
            
            pstmt.executeUpdate();
        }
    }
}
