package com.eduhub.dao.interfaces;

import com.eduhub.model.IdCard;
import java.util.List;

/**
 * Data Access Object interface for ID Card operations.
 */
public interface IdCardDAO {
    
    /**
     * Add a new ID card to the database
     */
    boolean addIdCard(IdCard idCard);
    
    /**
     * Get ID card by ID
     */
    IdCard getIdCardById(String idCardId);
    
    /**
     * Get ID card by verification token (for public verification)
     */
    IdCard getIdCardByToken(String verificationToken);
    
    /**
     * Get active ID card for a student
     */
    IdCard getActiveIdCardByStudent(String studentId, String instituteId);
    
    /**
     * Get all ID cards for a student (including history)
     */
    List<IdCard> getIdCardsByStudent(String studentId, String instituteId);
    
    /**
     * Get all ID cards for an institute
     */
    List<IdCard> getIdCardsByInstitute(String instituteId);
    
    /**
     * Get all ID cards for an institute with pagination
     */
    List<IdCard> getIdCardsByInstitute(String instituteId, int page, int pageSize);
    
    /**
     * Get total ID card count for institute
     */
    int getIdCardCount(String instituteId);
    
    /**
     * Update ID card details
     */
    boolean updateIdCard(IdCard idCard);
    
    /**
     * Deactivate an ID card
     */
    boolean deactivateIdCard(String idCardId, String reason);
    
    /**
     * Activate (reactivate) an ID card
     */
    boolean activateIdCard(String idCardId);
    
    /**
     * Increment regeneration count
     */
    boolean incrementRegenerationCount(String idCardId);
    
    /**
     * Check if active ID card exists for student
     */
    boolean activeIdCardExists(String studentId, String instituteId);
    
    /**
     * Delete an ID card
     */
    boolean deleteIdCard(String idCardId, String instituteId);
    
    /**
     * Deactivate all ID cards for a student (used before generating new one)
     */
    boolean deactivateAllForStudent(String studentId, String instituteId);
}
