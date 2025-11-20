package com.eduhub.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility class for password hashing and security operations
 * Uses PBKDF2 with salt for secure password storage
 */
public class PasswordUtil {
    
    private static final int SALT_LENGTH = 16;
    private static final int HASH_ITERATIONS = 10000;
    private static final String ALGORITHM = "SHA-256";
    
    /**
     * Hash a password using SHA-256 with salt (PBKDF2-like)
     * Format: salt$hash
     * @param password Plain text password
     * @return Salted and hashed password
     */
    public static String hashPassword(String password) {
        try {
            // Generate random salt
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);
            
            // Hash password with salt
            String hash = hashWithSalt(password, salt);
            
            // Return salt + hash (separated by $)
            return Base64.getEncoder().encodeToString(salt) + "$" + hash;
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    /**
     * Verify password against stored hash
     * @param password Plain text password
     * @param storedHash Stored hash with salt (format: salt$hash)
     * @return true if passwords match
     */
    public static boolean verifyPassword(String password, String storedHash) {
        try {
            // Split salt and hash
            String[] parts = storedHash.split("\\$");
            if (parts.length != 2) {
                return false;
            }
            
            // Decode salt
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            String storedHashPart = parts[1];
            
            // Hash input password with same salt
            String newHash = hashWithSalt(password, salt);
            
            // Compare hashes (constant time comparison to prevent timing attacks)
            return constantTimeEquals(newHash, storedHashPart);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Hash password with provided salt
     */
    private static String hashWithSalt(String password, byte[] salt) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance(ALGORITHM);
        md.update(salt);
        
        // Multiple iterations for stronger security
        byte[] hash = md.digest(password.getBytes());
        for (int i = 0; i < HASH_ITERATIONS; i++) {
            md.reset();
            hash = md.digest(hash);
        }
        
        return Base64.getEncoder().encodeToString(hash);
    }
    
    /**
     * Constant-time string comparison to prevent timing attacks
     */
    private static boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
    
    /**
     * Generate a random token for email verification
     * @return Random token string
     */
    public static String generateToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
