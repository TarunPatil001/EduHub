package com.eduhub.service.interfaces;

import com.eduhub.exception.RegistrationException;
import com.eduhub.model.Institute;
import com.eduhub.model.User;

import javax.servlet.http.Part;
import java.io.IOException;

/**
 * Service interface for Institute Registration operations
 */
public interface RegistrationService {
    
    /**
     * Register a new institute with admin user (both immediately active - no approval needed)
     * This method handles the complete registration in a transaction
     * 
     * @param institute Institute data
     * @param admin Admin user data
     * @return Registration result with institute and user IDs
     * @throws RegistrationException if registration fails
     */
    RegistrationResult registerInstituteWithAdmin(Institute institute, User admin) throws RegistrationException;
    
    /**
     * Saves the user's profile photo to a specific application path with hierarchical structure.
     *
     * @param filePart The file part from the multipart request.
     * @param userId The ID of the user (used for folder structure).
     * @param instituteId The ID of the institute (used for folder structure).
     * @param appPath The real path of the application context.
     * @return The URL or path to the saved photo.
     * @throws IOException If an I/O error occurs.
     */
    String saveUserProfilePhoto(Part filePart, String userId, String instituteId, String appPath) throws IOException;

    /**
     * Deletes the admin's profile photo.
     *
     * @param photoUrl The URL or path of the photo to delete.
     * @param appPath The real path of the application context.
     */
    void deleteProfilePhoto(String photoUrl, String appPath);


    // Note: Approval and rejection methods removed - institutes are automatically approved upon registration
    
    /**
     * Validate that institute and admin emails don't already exist
     * 
     * @param instituteEmail Institute email to check
     * @param adminEmail Admin email to check
     * @throws RegistrationException if validation fails (DuplicateEmailException or DatabaseException)
     */
    void validateRegistration(String instituteEmail, String adminEmail) throws RegistrationException;
    
    /**
     * Inner class to hold registration result
     */
    class RegistrationResult {
        private String instituteId;
        private String userId;
        private boolean success;
        private String message;
        
        public RegistrationResult(String instituteId, String userId, boolean success, String message) {
            this.instituteId = instituteId;
            this.userId = userId;
            this.success = success;
            this.message = message;
        }
        
        public String getInstituteId() {
            return instituteId;
        }
        
        public String getUserId() {
            return userId;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
    }
}