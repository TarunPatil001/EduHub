package com.eduhub.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for generating and validating secure QR code tokens
 * Implements time-limited tokens with HMAC-SHA256 digital signature
 */
public class QRTokenUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(QRTokenUtil.class);
    
    // Secret key for signing tokens - Should be stored in environment variable in production
    private static final String SECRET_KEY = System.getenv("QR_SECRET_KEY") != null 
        ? System.getenv("QR_SECRET_KEY") 
        : "EduHub-QR-Secret-Key-Change-In-Production-2024";
    
    // Token validity period in seconds (default: 1 year)
    private static final long TOKEN_VALIDITY_SECONDS = 365L * 24 * 60 * 60; // 1 year
    
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    
    /**
     * Generate a secure token for QR code
     * Format: studentId.expiryTimestamp.signature
     * 
     * @param studentId The student ID
     * @return Base64 encoded secure token
     */
    public static String generateToken(String studentId) {
        try {
            long expiryTimestamp = Instant.now().getEpochSecond() + TOKEN_VALIDITY_SECONDS;
            String payload = studentId + "." + expiryTimestamp;
            String signature = generateSignature(payload);
            String token = payload + "." + signature;
            
            // Base64 URL-safe encoding
            String encodedToken = Base64.getUrlEncoder().withoutPadding().encodeToString(token.getBytes(StandardCharsets.UTF_8));
            logger.info("Generated secure token for student: {} (expires in {} days)", 
                studentId.substring(0, Math.min(8, studentId.length())) + "...", 
                TOKEN_VALIDITY_SECONDS / (24 * 60 * 60));
            return encodedToken;
        } catch (Exception e) {
            logger.error("Failed to generate token for student: {}", studentId, e);
            return null;
        }
    }
    
    /**
     * Validate and extract student ID from token
     * 
     * @param token The encoded token from QR code
     * @return Student ID if valid, null if invalid or expired
     */
    public static String validateToken(String token) {
        try {
            // Decode Base64
            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = decoded.split("\\.");
            
            if (parts.length != 3) {
                logger.warn("Invalid token format - expected 3 parts, got {}", parts.length);
                return null; // Invalid format
            }
            
            String studentId = parts[0];
            long expiryTimestamp = Long.parseLong(parts[1]);
            String providedSignature = parts[2];
            
            // Check expiry
            if (Instant.now().getEpochSecond() > expiryTimestamp) {
                logger.warn("Token expired for student: {}", studentId.substring(0, Math.min(8, studentId.length())) + "...");
                return null; // Token expired
            }
            
            // Verify signature
            String payload = studentId + "." + expiryTimestamp;
            String expectedSignature = generateSignature(payload);
            
            if (!expectedSignature.equals(providedSignature)) {
                logger.error("SECURITY ALERT: Invalid signature detected for student: {}", 
                    studentId.substring(0, Math.min(8, studentId.length())) + "...");
                return null; // Invalid signature
            }
            
            logger.debug("Token validated successfully for student: {}", 
                studentId.substring(0, Math.min(8, studentId.length())) + "...");
            return studentId;
        } catch (Exception e) {
            logger.error("Error validating token", e);
            return null;
        }
    }
    
    /**
     * Generate HMAC-SHA256 signature for the payload
     * 
     * @param payload The data to sign
     * @return Hex string of the signature
     */
    private static String generateSignature(String payload) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance(HMAC_ALGORITHM);
        SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
        mac.init(secretKeySpec);
        byte[] signatureBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        
        // Convert to hex string
        StringBuilder hexString = new StringBuilder();
        for (byte b : signatureBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    /**
     * Get remaining validity period in days for a token
     * 
     * @param token The encoded token
     * @return Days remaining, or -1 if invalid/expired
     */
    public static long getRemainingDays(String token) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = decoded.split("\\.");
            
            if (parts.length != 3) {
                return -1;
            }
            
            long expiryTimestamp = Long.parseLong(parts[1]);
            long currentTimestamp = Instant.now().getEpochSecond();
            
            if (currentTimestamp > expiryTimestamp) {
                return -1; // Expired
            }
            
            long secondsRemaining = expiryTimestamp - currentTimestamp;
            return secondsRemaining / (24 * 60 * 60); // Convert to days
        } catch (Exception e) {
            return -1;
        }
    }
}
