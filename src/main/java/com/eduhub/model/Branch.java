package com.eduhub.model;

import java.sql.Timestamp;

public class Branch {
    private String branchId;
    private String instituteId;
    private String branchCode;
    private String branchName;
    private String branchManagerId;
    private String branchManagerName; // Transient field for display
    private String status;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Getters and Setters
    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }

    public String getInstituteId() { return instituteId; }
    public void setInstituteId(String instituteId) { this.instituteId = instituteId; }

    public String getBranchCode() { return branchCode; }
    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getBranchManagerId() { return branchManagerId; }
    public void setBranchManagerId(String branchManagerId) { this.branchManagerId = branchManagerId; }

    public String getBranchManagerName() { return branchManagerName; }
    public void setBranchManagerName(String branchManagerName) { this.branchManagerName = branchManagerName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}
