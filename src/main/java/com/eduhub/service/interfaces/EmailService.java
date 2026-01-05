package com.eduhub.service.interfaces;

public interface EmailService {
    /**
     * Sends a simple HTML email
     * @param to Recipient email address
     * @param subject Email subject
     * @param content HTML content of the email
     * @return true if sent successfully, false otherwise
     */
    boolean sendEmail(String to, String subject, String content);

    /**
     * Sends an OTP email for password reset
     * @param to Recipient email address
     * @param otp The One-Time Password
     * @param refId The Reference ID for the email
     * @return true if sent successfully
     */
    boolean sendPasswordResetOtp(String to, String otp, String refId);
}
