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

import java.sql.Connection;
import java.sql.SQLException;

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
    public RegistrationResult registerInstituteWithAdmin(Institute institute, User admin) throws RegistrationException {
        Connection conn = null;
        
        try {
            // Get connection and start transaction
            conn = DBUtil.getConnection();
            conn.setAutoCommit(false);
            
            logger.info("Starting institute registration for: {}", institute.getInstituteName());
            
            // Step 1: Validate emails don't exist
            validateRegistration(institute.getInstituteEmail(), admin.getEmail());
            
            // Step 2: Create institute (status = approved - ready to use immediately)
            int instituteId = instituteDAO.createInstitute(institute);
            
            if (instituteId <= 0) {
                throw new DatabaseException("CREATE_INSTITUTE", "Failed to create institute - no ID generated");
            }
            
            // Step 3: Create admin user (status = active - ready to use immediately)
            admin.setInstituteId(instituteId);
            admin.setRole("admin");
            int userId = userDAO.createUser(admin);
            
            if (userId <= 0) {
                throw new DatabaseException("CREATE_USER", "Failed to create admin user - no ID generated");
            }
            
            // Commit transaction
            conn.commit();
            
            logger.info("Institute registration successful and activated - Institute ID: {}, Admin ID: {}", 
                       instituteId, userId);
            
            return new RegistrationResult(
                instituteId, 
                userId, 
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
}
