package com.eduhub.dao.interfaces;

import com.eduhub.model.User;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object Interface for User operations
 */
public interface UserDAO {
    
    /**
     * Create a new user (with active status - ready to login immediately)
     * @param user User object to create
     * @return Generated user ID
     * @throws SQLException if database error occurs
     */
    int createUser(User user) throws SQLException;
    
    /**
     * Get user by ID
     * @param userId User ID
     * @return User object or null if not found
     * @throws SQLException if database error occurs
     */
    User getUserById(int userId) throws SQLException;
    
    /**
     * Get user by email
     * @param email User email
     * @return User object or null if not found
     * @throws SQLException if database error occurs
     */
    User getUserByEmail(String email) throws SQLException;
    
    /**
     * Get admin user by institute ID
     * @param instituteId Institute ID
     * @return User object or null if not found
     * @throws SQLException if database error occurs
     */
    User getAdminByInstituteId(int instituteId) throws SQLException;
    
    /**
     * Get all admin accounts
     * @return List of admin users
     * @throws SQLException if database error occurs
     */
    List<User> getAllAdminAccounts() throws SQLException;
    
    // Note: Activation methods removed - users are automatically active upon creation
    
    /**
     * Validate user login credentials
     * @param email User email
     * @param passwordHash Hashed password
     * @return User object if valid, null otherwise
     * @throws SQLException if database error occurs
     */
    User validateLogin(String email, String passwordHash) throws SQLException;
    
    /**
     * Update last login timestamp
     * @param userId User ID
     * @throws SQLException if database error occurs
     */
    void updateLastLogin(int userId) throws SQLException;
    
    /**
     * Check if email already exists
     * @param email Email to check
     * @return true if exists
     * @throws SQLException if database error occurs
     */
    boolean emailExists(String email) throws SQLException;

    /**
     * Update user details
     * @param user User object with updated details
     * @throws SQLException if database error occurs
     */
    void updateUser(User user) throws SQLException;
}