package com.eduhub.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for logging QR code verification attempts
 * Provides audit trail for security monitoring
 */
public class VerificationLogger {
    
    private static final Logger logger = LoggerFactory.getLogger(VerificationLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Log successful verification
     */
    public static void logSuccess(HttpServletRequest request, String studentId, String studentName) {
        String logMessage = String.format(
            "[VERIFICATION SUCCESS] Time: %s | IP: %s | Student ID: %s | Name: %s | User-Agent: %s",
            LocalDateTime.now().format(formatter),
            getClientIpAddress(request),
            studentId,
            studentName,
            request.getHeader("User-Agent")
        );
        logger.info(logMessage);
    }
    
    /**
     * Log failed verification attempt
     */
    public static void logFailure(HttpServletRequest request, String token, String reason) {
        String logMessage = String.format(
            "[VERIFICATION FAILED] Time: %s | IP: %s | Token: %s | Reason: %s | User-Agent: %s",
            LocalDateTime.now().format(formatter),
            getClientIpAddress(request),
            token != null ? token.substring(0, Math.min(20, token.length())) + "..." : "null",
            reason,
            request.getHeader("User-Agent")
        );
        logger.warn(logMessage);
    }
    
    /**
     * Log token expiry
     */
    public static void logExpiredToken(HttpServletRequest request, String token) {
        String logMessage = String.format(
            "[TOKEN EXPIRED] Time: %s | IP: %s | Token: %s",
            LocalDateTime.now().format(formatter),
            getClientIpAddress(request),
            token.substring(0, Math.min(20, token.length())) + "..."
        );
        logger.warn(logMessage);
    }
    
    /**
     * Log invalid signature
     */
    public static void logInvalidSignature(HttpServletRequest request, String token) {
        String logMessage = String.format(
            "[INVALID SIGNATURE] Time: %s | IP: %s | Token: %s | SECURITY ALERT: Possible tampering detected",
            LocalDateTime.now().format(formatter),
            getClientIpAddress(request),
            token.substring(0, Math.min(20, token.length())) + "..."
        );
        logger.error(logMessage);
    }
    
    /**
     * Get client IP address considering proxy headers
     */
    private static String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Handle multiple IPs (take the first one)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
    
    /**
     * Log general verification event
     */
    public static void logEvent(String message) {
        logger.info("[VERIFICATION] " + message);
    }
}
