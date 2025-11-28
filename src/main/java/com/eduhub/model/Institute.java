package com.eduhub.model;

import java.sql.Timestamp;

/**
 * Institute Model - Represents an educational institute
 */
public class Institute {
    
    private String instituteId;
    private String instituteName;
    private String instituteType;
    private String instituteEmail;
    private String institutePhone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String registrationStatus; // pending, approved, rejected
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Timestamp approvedAt;
    private String approvedBy;
    private String rejectionReason;
    
    // Constructors
    public Institute() {}
    
    public Institute(String instituteName, String instituteType, String instituteEmail, 
                    String institutePhone, String address, String city, String state, 
                    String zipCode, String country) {
        this.instituteName = instituteName;
        this.instituteType = instituteType;
        this.instituteEmail = instituteEmail;
        this.institutePhone = institutePhone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.registrationStatus = "approved";
    }
    
    // Getters and Setters
    public String getInstituteId() {
        return instituteId;
    }
    
    public void setInstituteId(String instituteId) {
        this.instituteId = instituteId;
    }
    
    public String getInstituteName() {
        return instituteName;
    }
    
    public void setInstituteName(String instituteName) {
        this.instituteName = instituteName;
    }
    
    public String getInstituteType() {
        return instituteType;
    }
    
    public void setInstituteType(String instituteType) {
        this.instituteType = instituteType;
    }
    
    public String getInstituteEmail() {
        return instituteEmail;
    }
    
    public void setInstituteEmail(String instituteEmail) {
        this.instituteEmail = instituteEmail;
    }
    
    public String getInstitutePhone() {
        return institutePhone;
    }
    
    public void setInstitutePhone(String institutePhone) {
        this.institutePhone = institutePhone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getRegistrationStatus() {
        return registrationStatus;
    }
    
    public void setRegistrationStatus(String registrationStatus) {
        this.registrationStatus = registrationStatus;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    public Timestamp getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Timestamp getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(Timestamp approvedAt) {
        this.approvedAt = approvedAt;
    }
    
    public String getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    @Override
    public String toString() {
        return "Institute{" +
                "instituteId=" + instituteId +
                ", instituteName='" + instituteName + '\'' +
                ", instituteType='" + instituteType + '\'' +
                ", instituteEmail='" + instituteEmail + '\'' +
                ", registrationStatus='" + registrationStatus + '\'' +
                '}';
    }
}
