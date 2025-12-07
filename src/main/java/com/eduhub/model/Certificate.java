package com.eduhub.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model class representing a Certificate issued to a student.
 * Supports verification, tracking, and audit trail.
 */
public class Certificate {
    
    private String certificateId;       // Unique certificate ID (e.g., "INST-JAVA-2025-001")
    private String studentId;           // Reference to student
    private String instituteId;         // Reference to institute
    private String batchId;             // Reference to batch (optional)
    private String courseId;            // Reference to course (optional)
    
    // Certificate Details
    private String certificateType;     // 'completion', 'excellence', 'participation'
    private String courseName;          // Name of course/program
    private String studentName;         // Student's full name (denormalized for display)
    private String description;         // Certificate description text
    private Date issueDate;             // Date of issue
    private Date expiryDate;            // Expiry date (null if no expiry)
    
    // Verification
    private String verificationToken;   // Encrypted token for QR code
    private String verificationUrl;     // Full verification URL
    private boolean isRevoked;          // Whether certificate is revoked
    private String revokeReason;        // Reason for revocation
    private Timestamp revokedAt;        // When revoked
    
    // Signatory Information
    private String signatoryName;       // Name of signatory
    private String signatoryTitle;      // Title of signatory
    
    // Metadata
    private String generatedBy;         // User ID who generated
    private Timestamp generatedAt;      // Generation timestamp
    private int downloadCount;          // Number of times downloaded
    private Timestamp lastDownloadedAt; // Last download timestamp
    
    // Optional: PDF Storage
    private String pdfStoragePath;      // Cloud storage path for PDF
    
    public Certificate() {
        this.isRevoked = false;
        this.downloadCount = 0;
    }

    // Getters and Setters
    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getInstituteId() { return instituteId; }
    public void setInstituteId(String instituteId) { this.instituteId = instituteId; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public String getVerificationUrl() { return verificationUrl; }
    public void setVerificationUrl(String verificationUrl) { this.verificationUrl = verificationUrl; }

    public boolean isRevoked() { return isRevoked; }
    public void setRevoked(boolean revoked) { isRevoked = revoked; }

    public String getRevokeReason() { return revokeReason; }
    public void setRevokeReason(String revokeReason) { this.revokeReason = revokeReason; }

    public Timestamp getRevokedAt() { return revokedAt; }
    public void setRevokedAt(Timestamp revokedAt) { this.revokedAt = revokedAt; }

    public String getSignatoryName() { return signatoryName; }
    public void setSignatoryName(String signatoryName) { this.signatoryName = signatoryName; }

    public String getSignatoryTitle() { return signatoryTitle; }
    public void setSignatoryTitle(String signatoryTitle) { this.signatoryTitle = signatoryTitle; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public Timestamp getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Timestamp generatedAt) { this.generatedAt = generatedAt; }

    public int getDownloadCount() { return downloadCount; }
    public void setDownloadCount(int downloadCount) { this.downloadCount = downloadCount; }

    public Timestamp getLastDownloadedAt() { return lastDownloadedAt; }
    public void setLastDownloadedAt(Timestamp lastDownloadedAt) { this.lastDownloadedAt = lastDownloadedAt; }

    public String getPdfStoragePath() { return pdfStoragePath; }
    public void setPdfStoragePath(String pdfStoragePath) { this.pdfStoragePath = pdfStoragePath; }

    @Override
    public String toString() {
        return "Certificate{" +
                "certificateId='" + certificateId + '\'' +
                ", studentId='" + studentId + '\'' +
                ", courseName='" + courseName + '\'' +
                ", issueDate=" + issueDate +
                ", isRevoked=" + isRevoked +
                '}';
    }
}
