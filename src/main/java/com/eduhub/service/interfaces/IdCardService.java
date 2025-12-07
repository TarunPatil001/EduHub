package com.eduhub.service.interfaces;

import com.eduhub.model.IdCard;
import java.util.List;

/**
 * Service interface for ID Card business logic.
 */
public interface IdCardService {
    
    /**
     * Generate and save a new ID card for a student
     */
    IdCard generateIdCard(String studentId, String instituteId, String generatedBy);
    
    /**
     * Generate ID cards for all students in a batch
     */
    List<IdCard> generateBatchIdCards(String batchId, String instituteId, String generatedBy);
    
    /**
     * Get ID card by ID
     */
    IdCard getIdCard(String idCardId);
    
    /**
     * Verify ID card by token (public API)
     */
    IdCard verifyIdCard(String verificationToken);
    
    /**
     * Get active ID card for a student
     */
    IdCard getActiveIdCard(String studentId, String instituteId);
    
    /**
     * Get all ID cards for a student (including history)
     */
    List<IdCard> getStudentIdCards(String studentId, String instituteId);
    
    /**
     * Get all ID cards for institute with pagination
     */
    List<IdCard> getInstituteIdCards(String instituteId, int page, int pageSize);
    
    /**
     * Get total ID card count
     */
    int getIdCardCount(String instituteId);
    
    /**
     * Deactivate an ID card
     */
    boolean deactivateIdCard(String idCardId, String reason);
    
    /**
     * Activate (reactivate) an ID card
     */
    boolean activateIdCard(String idCardId);
    
    /**
     * Regenerate ID card for a student (deactivates old one)
     */
    IdCard regenerateIdCard(String studentId, String instituteId, String generatedBy);
    
    /**
     * Delete an ID card
     */
    boolean deleteIdCard(String idCardId, String instituteId);
    
    /**
     * Check if active ID card already exists for student
     */
    boolean activeIdCardExists(String studentId, String instituteId);
    
    /**
     * Generate verification token for QR code
     */
    String generateVerificationToken(String idCardId, String studentId);
    
    /**
     * Check if ID card is valid (not expired and active)
     */
    boolean isIdCardValid(String verificationToken);
}
