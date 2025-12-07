package com.eduhub.dao.interfaces;

import com.eduhub.model.Certificate;
import java.util.List;

/**
 * Data Access Object interface for Certificate operations.
 */
public interface CertificateDAO {
    
    /**
     * Add a new certificate to the database
     */
    boolean addCertificate(Certificate certificate);
    
    /**
     * Get certificate by ID
     */
    Certificate getCertificateById(String certificateId);
    
    /**
     * Get certificate by verification token (for public verification)
     */
    Certificate getCertificateByToken(String verificationToken);
    
    /**
     * Get all certificates for a student
     */
    List<Certificate> getCertificatesByStudent(String studentId, String instituteId);
    
    /**
     * Get all certificates for a batch
     */
    List<Certificate> getCertificatesByBatch(String batchId, String instituteId);
    
    /**
     * Get all certificates for an institute
     */
    List<Certificate> getCertificatesByInstitute(String instituteId);
    
    /**
     * Get all certificates for an institute with pagination
     */
    List<Certificate> getCertificatesByInstitute(String instituteId, int page, int pageSize);
    
    /**
     * Get total certificate count for institute
     */
    int getCertificateCount(String instituteId);
    
    /**
     * Update certificate details
     */
    boolean updateCertificate(Certificate certificate);
    
    /**
     * Revoke a certificate
     */
    boolean revokeCertificate(String certificateId, String reason);
    
    /**
     * Restore (un-revoke) a certificate
     */
    boolean restoreCertificate(String certificateId);
    
    /**
     * Increment download count
     */
    boolean incrementDownloadCount(String certificateId);
    
    /**
     * Check if certificate exists for student and course
     */
    boolean certificateExists(String studentId, String courseId, String batchId);
    
    /**
     * Check if certificate exists for student with specific type and batch (for duplicate detection)
     */
    boolean certificateExistsWithType(String studentId, String batchId, String certificateType, String instituteId);
    
    /**
     * Delete a certificate
     */
    boolean deleteCertificate(String certificateId, String instituteId);
    
    /**
     * Log certificate access (view/download/verify)
     */
    boolean logCertificateAccess(String certificateId, String accessType, String accessedBy, String ipAddress, String userAgent);
}
