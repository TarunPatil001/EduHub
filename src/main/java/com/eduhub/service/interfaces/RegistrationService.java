package com.eduhub.service.interfaces;

import com.eduhub.exception.RegistrationException;
import com.eduhub.model.Institute;
import com.eduhub.model.User;

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
        private int instituteId;
        private int userId;
        private boolean success;
        private String message;
        
        public RegistrationResult(int instituteId, int userId, boolean success, String message) {
            this.instituteId = instituteId;
            this.userId = userId;
            this.success = success;
            this.message = message;
        }
        
        public int getInstituteId() {
            return instituteId;
        }
        
        public int getUserId() {
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
