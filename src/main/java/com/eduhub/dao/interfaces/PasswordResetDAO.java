package com.eduhub.dao.interfaces;

import java.sql.SQLException;

public interface PasswordResetDAO {
    /**
     * Saves a new OTP for a user
     * @param userId The user ID
     * @param otp The 6-digit OTP
     * @param refId The reference ID for email tracking
     * @throws SQLException if database error occurs
     */
    void saveOtp(String userId, String otp, String refId) throws SQLException;

    /**
     * Validates the OTP for a user
     * @param userId The user ID (optional, if we verify by email flow) or we can verify by OTP + Email
     * @param otp The OTP provided by user
     * @return true if valid and not expired
     * @throws SQLException
     */
    boolean validateOtp(String userId, String otp) throws SQLException;

    /**
     * Marks the OTP as used
     * @param userId The user ID
     * @param otp The OTP
     * @throws SQLException
     */
    void markOtpAsUsed(String userId, String otp) throws SQLException;
}
