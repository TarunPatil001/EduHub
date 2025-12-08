package com.eduhub.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AES-256-GCM Token Utility for secure QR code verification
 * 
 * Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - Base64URL encoding (URL-safe)
 * - Time-limited tokens with expiry
 * - Random IV for each token (prevents pattern analysis)
 * 
 * Token Structure (before Base64URL encoding):
 * [IV (12 bytes)][Encrypted Data][Auth Tag (16 bytes)]
 * 
 * Encrypted Data contains:
 * - For ID Cards: "ID|studentId|expiryTimestamp"
 * - For Certificates: "CERT|studentId|certId|courseName|expiryTimestamp"
 */
public class AESTokenUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(AESTokenUtil.class);
    
    // AES-256-GCM parameters
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;  // 96 bits - recommended for GCM
    private static final int GCM_TAG_LENGTH = 128; // 128 bits - authentication tag
    private static final int KEY_SIZE = 256; // AES-256
    
    // Token validity period (default: 1 year)
    private static final long TOKEN_VALIDITY_SECONDS = 365L * 24 * 60 * 60;
    
    // Secret key - Should be stored in environment variable in production
    // Must be exactly 32 bytes (256 bits) for AES-256
    private static final String SECRET_KEY_ENV = System.getenv("AES_SECRET_KEY");
    private static final byte[] SECRET_KEY_BYTES;
    
    // Token type prefixes
    private static final String ID_CARD_PREFIX = "ID";
    private static final String CERTIFICATE_PREFIX = "CERT";
    
    static {
        if (SECRET_KEY_ENV != null && SECRET_KEY_ENV.length() >= 32) {
            // Use first 32 bytes of environment key
            SECRET_KEY_BYTES = SECRET_KEY_ENV.substring(0, 32).getBytes(StandardCharsets.UTF_8);
            logger.info("AESTokenUtil initialized with environment secret key");
        } else {
            // Default key for development - CHANGE IN PRODUCTION!
            SECRET_KEY_BYTES = "EduHub-AES256-Secret-Key-32Byte!".getBytes(StandardCharsets.UTF_8);
            logger.warn("AESTokenUtil using default secret key - SET AES_SECRET_KEY environment variable in production!");
        }
    }
    
    private static final SecureRandom secureRandom = new SecureRandom();
    
    /**
     * Generate a secure AES-256-GCM encrypted token for ID card verification
     * 
     * @param studentId The student ID
     * @return Base64URL encoded encrypted token, or null on error
     */
    public static String generateIdToken(String studentId) {
        try {
            long expiryTimestamp = Instant.now().getEpochSecond() + TOKEN_VALIDITY_SECONDS;
            String plaintext = ID_CARD_PREFIX + "|" + studentId + "|" + expiryTimestamp;
            
            String token = encrypt(plaintext);
            logger.info("Generated AES-256-GCM ID token for student: {} (expires in {} days)", 
                maskId(studentId), TOKEN_VALIDITY_SECONDS / (24 * 60 * 60));
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate ID token for student: {}", maskId(studentId), e);
            return null;
        }
    }
    
    /**
     * Generate a secure AES-256-GCM encrypted token for certificate verification
     * 
     * @param studentId The student ID
     * @param certId The certificate ID
     * @param courseName The course name
     * @return Base64URL encoded encrypted token, or null on error
     */
    public static String generateCertificateToken(String studentId, String certId, String courseName) {
        try {
            long expiryTimestamp = Instant.now().getEpochSecond() + TOKEN_VALIDITY_SECONDS;
            String plaintext = CERTIFICATE_PREFIX + "|" + studentId + "|" + certId + "|" + 
                              (courseName != null ? courseName : "") + "|" + expiryTimestamp;
            
            String token = encrypt(plaintext);
            logger.info("Generated AES-256-GCM certificate token for student: {}, cert: {}", 
                maskId(studentId), certId);
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate certificate token for student: {}", maskId(studentId), e);
            return null;
        }
    }
    
    /**
     * Validate and extract student ID from an ID card token
     * 
     * @param token The encrypted token
     * @return Student ID if valid and not expired, null otherwise
     */
    public static String validateIdToken(String token) {
        try {
            String plaintext = decrypt(token);
            if (plaintext == null) {
                return null;
            }
            
            String[] parts = plaintext.split("\\|");
            if (parts.length != 3 || !ID_CARD_PREFIX.equals(parts[0])) {
                logger.warn("Invalid ID token format");
                return null;
            }
            
            String studentId = parts[1];
            long expiryTimestamp = Long.parseLong(parts[2]);
            
            // Check expiry
            if (Instant.now().getEpochSecond() > expiryTimestamp) {
                logger.warn("ID token expired for student: {}", maskId(studentId));
                return null;
            }
            
            logger.info("ID token validated successfully for student: {}", maskId(studentId));
            return studentId;
        } catch (Exception e) {
            logger.error("Error validating ID token: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Validate and extract certificate details from a certificate token
     * 
     * @param token The encrypted token
     * @return String array [studentId, certId, courseName] if valid, null otherwise
     */
    public static String[] validateCertificateToken(String token) {
        try {
            String plaintext = decrypt(token);
            if (plaintext == null) {
                return null;
            }
            
            String[] parts = plaintext.split("\\|");
            if (parts.length != 5 || !CERTIFICATE_PREFIX.equals(parts[0])) {
                logger.warn("Invalid certificate token format");
                return null;
            }
            
            String studentId = parts[1];
            String certId = parts[2];
            String courseName = parts[3];
            long expiryTimestamp = Long.parseLong(parts[4]);
            
            // Check expiry
            if (Instant.now().getEpochSecond() > expiryTimestamp) {
                logger.warn("Certificate token expired for student: {}", maskId(studentId));
                return null;
            }
            
            logger.info("Certificate token validated successfully for student: {}, cert: {}", 
                maskId(studentId), certId);
            return new String[] { studentId, certId, courseName };
        } catch (Exception e) {
            logger.error("Error validating certificate token: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Get remaining validity period in days for a token
     * 
     * @param token The encrypted token
     * @return Days remaining, or -1 if invalid/expired
     */
    public static long getRemainingDays(String token) {
        try {
            String plaintext = decrypt(token);
            if (plaintext == null) {
                return -1;
            }
            
            String[] parts = plaintext.split("\\|");
            if (parts.length < 3) {
                return -1;
            }
            
            // Expiry is always the last part
            long expiryTimestamp = Long.parseLong(parts[parts.length - 1]);
            long currentTimestamp = Instant.now().getEpochSecond();
            
            if (currentTimestamp > expiryTimestamp) {
                return -1; // Expired
            }
            
            return (expiryTimestamp - currentTimestamp) / (24 * 60 * 60);
        } catch (Exception e) {
            return -1;
        }
    }
    
    /**
     * Check if a token looks like an AES encrypted token (for detection)
     * AES tokens are longer and have specific Base64URL characteristics
     * 
     * @param token The token to check
     * @return true if it appears to be an AES token
     */
    public static boolean isAESToken(String token) {
        if (token == null || token.length() < 50) {
            return false;
        }
        // AES-GCM tokens are at least 50+ chars due to IV + data + auth tag
        // They use Base64URL encoding (no +, /, = characters, uses - and _)
        return token.matches("^[A-Za-z0-9_-]+$");
    }
    
    // ==================== Private Encryption Methods ====================
    
    /**
     * Encrypt plaintext using AES-256-GCM
     * 
     * @param plaintext The data to encrypt
     * @return Base64URL encoded ciphertext with IV prepended
     */
    private static String encrypt(String plaintext) throws Exception {
        // Generate random IV
        byte[] iv = new byte[GCM_IV_LENGTH];
        secureRandom.nextBytes(iv);
        
        // Create cipher and initialize for encryption
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY_BYTES, ALGORITHM);
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);
        
        // Encrypt
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
        
        // Combine IV + ciphertext (auth tag is appended by GCM)
        ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + ciphertext.length);
        byteBuffer.put(iv);
        byteBuffer.put(ciphertext);
        
        // Base64URL encode (URL-safe, no padding)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(byteBuffer.array());
    }
    
    /**
     * Decrypt ciphertext using AES-256-GCM
     * 
     * @param encryptedToken Base64URL encoded ciphertext with IV
     * @return Decrypted plaintext, or null on error
     */
    private static String decrypt(String encryptedToken) {
        try {
            // Base64URL decode
            byte[] decoded = Base64.getUrlDecoder().decode(encryptedToken);
            
            if (decoded.length < GCM_IV_LENGTH + 16) { // Minimum: IV + auth tag
                logger.warn("Token too short to be valid AES-GCM ciphertext");
                return null;
            }
            
            // Extract IV and ciphertext
            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            byte[] ciphertext = new byte[byteBuffer.remaining()];
            byteBuffer.get(ciphertext);
            
            // Create cipher and initialize for decryption
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY_BYTES, ALGORITHM);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);
            
            // Decrypt
            byte[] plaintext = cipher.doFinal(ciphertext);
            return new String(plaintext, StandardCharsets.UTF_8);
            
        } catch (javax.crypto.AEADBadTagException e) {
            logger.warn("Token authentication failed - tampered or invalid token");
            return null;
        } catch (IllegalArgumentException e) {
            logger.debug("Token is not valid Base64URL: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.debug("Decryption failed: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Mask ID for logging (show first 8 chars + ...)
     */
    private static String maskId(String id) {
        if (id == null) return "null";
        if (id.length() <= 8) return id;
        return id.substring(0, 8) + "...";
    }
}
