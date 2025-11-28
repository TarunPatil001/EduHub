package com.eduhub.model;

import java.sql.Timestamp;

/**
 * User Model - Represents a user in the system
 */
public class User {
    
    private String userId;
    private String instituteId;
    private String fullName;
    private String email;
    private String passwordHash;
    private String phone;
    private String role; // super_admin, admin, teacher, student, staff
    private String status; // pending, active, inactive, suspended
    private String profilePhotoUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Timestamp lastLogin;
    
    // Constructors
    public User() {}
    
    public User(String instituteId, String fullName, String email, String passwordHash, 
                String phone, String role) {
        this.instituteId = instituteId;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.role = role;
        this.status = "active";
    }
    
    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getInstituteId() {
        return instituteId;
    }
    
    public void setInstituteId(String instituteId) {
        this.instituteId = instituteId;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPasswordHash() {
        return passwordHash;
    }
    
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
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
    
    public Timestamp getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(Timestamp lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", instituteId=" + instituteId +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", status='" + status + '\'' +
                ", profilePhotoUrl='" + profilePhotoUrl + '\'' +
                '}';
    }
}