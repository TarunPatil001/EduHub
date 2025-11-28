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

        // Normalize path separators
        String normalizedPath = photoUrl.replace("/", File.separator).replace("\\", File.separator);

        // 1. Delete from Source Directory
        String baseSourceDir = "C:/Users/tarun/Desktop/FC-PP-138/Backend/Project/EduHub/src/main/webapp";
        File sourceFile = new File(baseSourceDir, normalizedPath);
        
        if (sourceFile.exists()) {
            if (sourceFile.delete()) {
                logger.info("Deleted old photo from source: {}", sourceFile.getAbsolutePath());
            } else {
                logger.warn("Failed to delete old photo from source: {}", sourceFile.getAbsolutePath());
            }
        } else {
             logger.warn("Old photo not found in source: {}", sourceFile.getAbsolutePath());
        }

        // 2. Delete from Runtime Directory
        if (appPath != null && !appPath.isEmpty()) {
            File runtimeFile = new File(appPath, normalizedPath);
            if (runtimeFile.exists()) {
                if (runtimeFile.delete()) {
                    logger.info("Deleted old photo from runtime: {}", runtimeFile.getAbsolutePath());
                } else {
                    logger.warn("Failed to delete old photo from runtime: {}", runtimeFile.getAbsolutePath());
                }
            }
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
            String instituteId = UUID.randomUUID().toString();
            institute.setInstituteId(instituteId);
            
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
    public String saveUserProfilePhoto(Part filePart, String userId, String appPath) throws IOException {
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // Sanitize
        String fileExtension = "";
        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            fileExtension = fileName.substring(i);
        }
        
        // Generate a unique file name to prevent conflicts
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Base upload directory
        String baseUploadDir = "C:/Users/tarun/Desktop/FC-PP-138/Backend/Project/EduHub/src/main/webapp/uploads";
        
        // 1. Save to Source Directory (Persistence)
        // Structure: uploads/users/{userId}/profile/
        String relativePath = "users" + File.separator + userId + File.separator + "profile";
        String sourceUploadDir = baseUploadDir + File.separator + relativePath;
        
        File sourceDirFile = new File(sourceUploadDir);
        if (!sourceDirFile.exists()) {
            sourceDirFile.mkdirs();
        }
        
        File sourceFile = new File(sourceUploadDir, uniqueFileName);
        
        // Create a temp file to hold the upload content
        java.nio.file.Path tempFile = Files.createTempFile("upload_", uniqueFileName);
        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, tempFile, StandardCopyOption.REPLACE_EXISTING);
        }
        
        // Copy from temp file to source directory
        Files.copy(tempFile, sourceFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        
        // 2. Save to Runtime Directory (Immediate Availability)
        if (appPath != null && !appPath.isEmpty()) {
            String runtimeUploadDir = appPath + File.separator + "uploads" + File.separator + relativePath;
            File runtimeDirFile = new File(runtimeUploadDir);
            if (!runtimeDirFile.exists()) {
                runtimeDirFile.mkdirs();
            }
            
            File runtimeFile = new File(runtimeUploadDir, uniqueFileName);
            Files.copy(tempFile, runtimeFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            logger.info("Saved photo to runtime path: {}", runtimeFile.getAbsolutePath());
        }
        
        // Clean up temp file
        try {
            Files.delete(tempFile);
        } catch (IOException e) {
            logger.warn("Failed to delete temp file: {}", tempFile);
        }
        
        // Return a web-accessible path (using forward slashes for URL)
        return "uploads/users/" + userId + "/profile/" + uniqueFileName;
    }
}