package com.eduhub.service.interfaces;

import com.eduhub.model.Certificate;
import java.util.List;

/**
 * Service interface for Certificate business logic.
 */
public interface CertificateService {
    
    /**
     * Generate and save a new certificate for a student
     */
    Certificate generateCertificate(String studentId, String instituteId, String batchId, 
                                    String courseName, String certificateType, String generatedBy);
    
    /**
     * Generate certificates for all students in a batch
     */
    List<Certificate> generateBatchCertificates(String batchId, String instituteId, 
                                                 String certificateType, String generatedBy);
    
    /**
     * Get certificate by ID
     */
    Certificate getCertificate(String certificateId);
    
    /**
     * Verify certificate by token (public API)
     */
    Certificate verifyCertificate(String verificationToken);
    
    /**
     * Get all certificates for a student
     */
    List<Certificate> getStudentCertificates(String studentId, String instituteId);
    
    /**
     * Get all certificates for a batch
     */
    List<Certificate> getBatchCertificates(String batchId, String instituteId);
    
    /**
     * Get all certificates for institute with pagination
     */
    List<Certificate> getInstituteCertificates(String instituteId, int page, int pageSize);
    
    /**
     * Get total certificate count
     */
    int getCertificateCount(String instituteId);
    
    /**
     * Revoke a certificate
     */
    boolean revokeCertificate(String certificateId, String reason);
    
    /**
     * Restore (un-revoke) a certificate
     */
    boolean restoreCertificate(String certificateId);
    
    /**
     * Record a download
     */
    boolean recordDownload(String certificateId, String downloadedBy, String ipAddress, String userAgent);
    
    /**
     * Delete a certificate
     */
    boolean deleteCertificate(String certificateId, String instituteId);
    
    /**
     * Check if certificate already exists for student with same type and batch
     */
    boolean certificateExists(String studentId, String batchId, String certificateType, String instituteId);
    
    /**
     * Generate verification token for QR code
     */
    String generateVerificationToken(String certificateId, String studentId);
    
    /**
     * Generate unique certificate ID
     */
    String generateCertificateId(String instituteId, String courseName);
}
