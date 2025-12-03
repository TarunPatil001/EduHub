package com.eduhub.service.impl;

import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.exception.DatabaseException;
import com.eduhub.exception.DuplicateEmailException;
import com.eduhub.exception.RegistrationException;
import com.eduhub.model.Institute;
import com.eduhub.model.User;
import com.eduhub.service.interfaces.RegistrationService;
import com.eduhub.util.DBUtil;
import com.eduhub.util.CloudinaryUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

/**
 * Implementation of RegistrationService
 * Handles institute registration with transaction management
 */
public class RegistrationServiceImpl implements RegistrationService {
    
    private static final Logger logger = LoggerFactory.getLogger(RegistrationServiceImpl.class);
    
    private final InstituteDAO instituteDAO;
    private final UserDAO userDAO;
    
    public RegistrationServiceImpl() {
        this.instituteDAO = new InstituteDAOImpl();
        this.userDAO = new UserDAOImpl();
    }

    @Override
    public void deleteProfilePhoto(String photoUrl, String appPath) {
        if (photoUrl == null || photoUrl.isEmpty()) {
            return;
        }

        try {
            // Extract public_id from the URL
            // Example URL: https://res.cloudinary.com/demo/image/upload/v1570979139/eduhub/users/123/profile/abc.jpg
            // We need: eduhub/users/123/profile/abc
            
            String publicId = null;
            if (photoUrl.contains("/upload/")) {
                int uploadIndex = photoUrl.indexOf("/upload/");
                String pathAfterUpload = photoUrl.substring(uploadIndex + 8); // Skip "/upload/"
                
                // Skip version if present (e.g., v1570979139/)
                if (pathAfterUpload.startsWith("v")) {
                    int slashIndex = pathAfterUpload.indexOf("/");
                    if (slashIndex > 0) {
                        pathAfterUpload = pathAfterUpload.substring(slashIndex + 1);
                    }
                }
                
                // Remove extension
                int dotIndex = pathAfterUpload.lastIndexOf(".");
                if (dotIndex > 0) {
                    publicId = pathAfterUpload.substring(0, dotIndex);
                } else {
                    publicId = pathAfterUpload;
                }
            }

            if (publicId != null) {
                Cloudinary cloudinary = CloudinaryUtil.getCloudinary();
                if (cloudinary != null) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    logger.info("Deleted photo from Cloudinary: {}", publicId);
                } else {
                    logger.warn("Cloudinary not initialized, skipping delete for: {}", photoUrl);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to delete photo from Cloudinary: {}", photoUrl, e);
        }
    }

    @Override
    public RegistrationResult registerInstituteWithAdmin(Institute institute, User admin) throws RegistrationException {
        Connection conn = null;
        
        try {
            // Get connection and start transaction
            conn = DBUtil.getConnection();
            conn.setAutoCommit(false);
            
            logger.info("Starting institute registration for: {}", institute.getInstituteName());
            
            // Step 1: Validate emails don't exist
            validateRegistration(institute.getInstituteEmail(), admin.getEmail());
            
            // Step 2: Generate UUIDs and create institute
            String instituteId = institute.getInstituteId();
            if (instituteId == null || instituteId.isEmpty()) {
                instituteId = UUID.randomUUID().toString();
                institute.setInstituteId(instituteId);
            }
            
            String createdInstituteId = instituteDAO.createInstitute(institute);
            
            if (createdInstituteId == null || createdInstituteId.isEmpty()) {
                throw new DatabaseException("CREATE_INSTITUTE", "Failed to create institute - no ID generated");
            }
            
            // Step 3: Create admin user
            String userId = admin.getUserId();
            if (userId == null || userId.isEmpty()) {
                userId = UUID.randomUUID().toString();
                admin.setUserId(userId);
            }
            admin.setInstituteId(createdInstituteId);
            admin.setRole("admin");
            String createdUserId = userDAO.createUser(admin);
            
            if (createdUserId == null || createdUserId.isEmpty()) {
                throw new DatabaseException("CREATE_USER", "Failed to create admin user - no ID generated");
            }
            
            // Commit transaction
            conn.commit();
            
            logger.info("Institute registration successful and activated - Institute ID: {}, Admin ID: {}", 
                       createdInstituteId, createdUserId);
            
            return new RegistrationResult(
                createdInstituteId, 
                createdUserId, 
                true, 
                "Registration successful! You can now log in with your credentials."
            );
            
        } catch (DuplicateEmailException e) {
            // Rollback on duplicate email
            if (conn != null) {
                try {
                    conn.rollback();
                    logger.warn("Registration failed - duplicate email: {}", e.getMessage());
                } catch (SQLException rollbackEx) {
                    logger.error("Error during rollback", rollbackEx);
                }
            }
            throw e;
            
        } catch (SQLException e) {
            // Rollback on database error
            if (conn != null) {
                try {
                    conn.rollback();
                    logger.error("Transaction rolled back due to database error", e);
                } catch (SQLException rollbackEx) {
                    logger.error("Error during rollback", rollbackEx);
                }
            }
            throw new DatabaseException("TRANSACTION", "Database error during registration", e);
        } finally {
            // Restore auto-commit and close connection
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    logger.error("Error closing connection", e);
                }
            }
        }
    }
    
    // Note: Approval and rejection methods removed - institutes are automatically approved upon registration
    
    @Override
    public void validateRegistration(String instituteEmail, String adminEmail) throws RegistrationException {
        try {
            // Check if institute email already exists
            if (instituteDAO.emailExists(instituteEmail)) {
                logger.warn("Registration validation failed - institute email already exists: {}", instituteEmail);
                throw new DuplicateEmailException(instituteEmail, "institute");
            }
            
            // Check if admin email already exists
            if (userDAO.emailExists(adminEmail)) {
                logger.warn("Registration validation failed - admin email already exists: {}", adminEmail);
                throw new DuplicateEmailException(adminEmail, "admin");
            }
            
            logger.info("Registration validation passed for institute email: {}", instituteEmail);
            
        } catch (SQLException e) {
            logger.error("Database error during email validation", e);
            throw new DatabaseException("EMAIL_VALIDATION", "Error checking email uniqueness", e);
        }
    }

    @Override
    public String saveUserProfilePhoto(Part filePart, String userId, String instituteId, String appPath) throws IOException {
        // Security Check: Validate file type
        String contentType = filePart.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            logger.warn("Invalid file type uploaded: {}", contentType);
            throw new IOException("Invalid file type. Only images are allowed.");
        }

        Cloudinary cloudinary = CloudinaryUtil.getCloudinary();
        if (cloudinary == null) {
            logger.error("Cloudinary not configured. Cannot upload photo.");
            throw new IOException("Cloudinary configuration missing");
        }

        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // Sanitize
        
        // Create a temp file to hold the upload content
        java.nio.file.Path tempFile = Files.createTempFile("upload_", "_" + fileName);
        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, tempFile, StandardCopyOption.REPLACE_EXISTING);
        }
        
        try {
            // Upload to Cloudinary
            // Folder structure: eduhub/user_photos/{instituteId}
            String folderPath = "eduhub/user_photos/" + instituteId;
            
            Map uploadResult = cloudinary.uploader().upload(tempFile.toFile(), ObjectUtils.asMap(
                "folder", folderPath,
                "public_id", "user_" + userId + "_" + System.currentTimeMillis(),
                "overwrite", true,
                "resource_type", "auto"
            ));
            
            String secureUrl = (String) uploadResult.get("secure_url");
            logger.info("Photo uploaded to Cloudinary: {}", secureUrl);
            return secureUrl;
            
        } catch (Exception e) {
            logger.error("Failed to upload photo to Cloudinary", e);
            throw new IOException("Cloudinary upload failed", e);
        } finally {
            // Clean up temp file
            try {
                Files.delete(tempFile);
            } catch (IOException e) {
                logger.warn("Failed to delete temp file: {}", tempFile);
            }
        }
    }
}