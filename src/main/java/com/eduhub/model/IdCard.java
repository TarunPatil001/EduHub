package com.eduhub.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model class representing an ID Card issued to a student.
 * Supports verification, tracking, and validity management.
 */
public class IdCard {
    
    private String idCardId;            // Unique ID card identifier
    private String studentId;           // Reference to student
    private String instituteId;         // Reference to institute
    
    // Student Details (denormalized for display on card)
    private String studentName;         // Full name
    private String department;          // Department/Branch
    private String batchName;           // Batch name
    private String profilePhotoUrl;     // Photo URL
    
    // Validity
    private Date issueDate;             // Date of issue
    private Date validUntil;            // Expiry date
    private boolean isActive;           // Whether card is active
    private String deactivateReason;    // Reason for deactivation
    private Timestamp deactivatedAt;    // When deactivated
    
    // Verification
    private String verificationToken;   // Encrypted token for QR code
    private String qrCodeData;          // QR code verification URL
    
    // Metadata
    private String generatedBy;         // User ID who generated
    private Timestamp generatedAt;      // Generation timestamp
    private int regenerationCount;      // Number of times regenerated
    private Timestamp lastRegeneratedAt; // Last regeneration timestamp
    
    public IdCard() {
        this.isActive = true;
        this.regenerationCount = 0;
    }

    // Getters and Setters
    public String getIdCardId() { return idCardId; }
    public void setIdCardId(String idCardId) { this.idCardId = idCardId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getInstituteId() { return instituteId; }
    public void setInstituteId(String instituteId) { this.instituteId = instituteId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public Date getValidUntil() { return validUntil; }
    public void setValidUntil(Date validUntil) { this.validUntil = validUntil; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getDeactivateReason() { return deactivateReason; }
    public void setDeactivateReason(String deactivateReason) { this.deactivateReason = deactivateReason; }

    public Timestamp getDeactivatedAt() { return deactivatedAt; }
    public void setDeactivatedAt(Timestamp deactivatedAt) { this.deactivatedAt = deactivatedAt; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public Timestamp getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Timestamp generatedAt) { this.generatedAt = generatedAt; }

    public int getRegenerationCount() { return regenerationCount; }
    public void setRegenerationCount(int regenerationCount) { this.regenerationCount = regenerationCount; }

    public Timestamp getLastRegeneratedAt() { return lastRegeneratedAt; }
    public void setLastRegeneratedAt(Timestamp lastRegeneratedAt) { this.lastRegeneratedAt = lastRegeneratedAt; }

    /**
     * Check if the ID card is currently valid
     */
    public boolean isValid() {
        if (!isActive) return false;
        if (validUntil == null) return true;
        return validUntil.after(new java.util.Date()) || validUntil.equals(new java.sql.Date(System.currentTimeMillis()));
    }

    @Override
    public String toString() {
        return "IdCard{" +
                "idCardId='" + idCardId + '\'' +
                ", studentId='" + studentId + '\'' +
                ", studentName='" + studentName + '\'' +
                ", validUntil=" + validUntil +
                ", isActive=" + isActive +
                '}';
    }
}
