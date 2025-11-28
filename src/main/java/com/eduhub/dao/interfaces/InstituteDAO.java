package com.eduhub.dao.interfaces;

import com.eduhub.model.Institute;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object Interface for Institute operations
 */
public interface InstituteDAO {
    
    /**
     * Create a new institute (with approved status - ready to use immediately)
     * @param institute Institute object to create
     * @return Generated institute ID
     * @throws SQLException if database error occurs
     */
    String createInstitute(Institute institute) throws SQLException;
    
    /**
     * Get institute by ID
     * @param instituteId Institute ID
     * @return Institute object or null if not found
     * @throws SQLException if database error occurs
     */
    Institute getInstituteById(String instituteId) throws SQLException;
    
    /**
     * Get institute by email
     * @param email Institute email
     * @return Institute object or null if not found
     * @throws SQLException if database error occurs
     */
    Institute getInstituteByEmail(String email) throws SQLException;
    
    // Note: Approval/rejection methods removed - institutes are automatically approved upon registration
    
    /**
     * Check if institute email already exists
     * @param email Email to check
     * @return true if exists
     * @throws SQLException if database error occurs
     */
    boolean emailExists(String email) throws SQLException;
    
    /**
     * Update institute details
     * @param institute Institute object with updated details
     * @return true if update successful
     * @throws SQLException if database error occurs
     */
    boolean updateInstitute(Institute institute) throws SQLException;
}
