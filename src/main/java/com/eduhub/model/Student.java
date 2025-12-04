package com.eduhub.model;

import java.sql.Date;
import java.sql.Timestamp;

public class Student {
    private String studentId;
    private String instituteId;
    private String studentName;
    private String fatherName;
    private String surname;
    private Date dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String mobileNumber;
    private String whatsappNumber;
    private String parentMobile;
    private String emailId;
    private String instagramId;
    private String linkedinId;
    private String permanentAddress;
    private String currentAddress;
    private String collegeName;
    private String educationQualification;
    private String specialization;
    private String passingYear;
    private String batchId;
    private String studentStatus;
    private String feesAllowed;
    private boolean medicalHistory;
    private String medicalCondition;
    private String medicineName;
    private boolean studentDeclaration;
    private String profilePhotoUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Student() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getInstituteId() { return instituteId; }
    public void setInstituteId(String instituteId) { this.instituteId = instituteId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public Date getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public String getParentMobile() { return parentMobile; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }

    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public String getInstagramId() { return instagramId; }
    public void setInstagramId(String instagramId) { this.instagramId = instagramId; }

    public String getLinkedinId() { return linkedinId; }
    public void setLinkedinId(String linkedinId) { this.linkedinId = linkedinId; }

    public String getPermanentAddress() { return permanentAddress; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }

    public String getCurrentAddress() { return currentAddress; }
    public void setCurrentAddress(String currentAddress) { this.currentAddress = currentAddress; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getEducationQualification() { return educationQualification; }
    public void setEducationQualification(String educationQualification) { this.educationQualification = educationQualification; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPassingYear() { return passingYear; }
    public void setPassingYear(String passingYear) { this.passingYear = passingYear; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getStudentStatus() { return studentStatus; }
    public void setStudentStatus(String studentStatus) { this.studentStatus = studentStatus; }

    public String getFeesAllowed() { return feesAllowed; }
    public void setFeesAllowed(String feesAllowed) { this.feesAllowed = feesAllowed; }

    public boolean isMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(boolean medicalHistory) { this.medicalHistory = medicalHistory; }

    public String getMedicalCondition() { return medicalCondition; }
    public void setMedicalCondition(String medicalCondition) { this.medicalCondition = medicalCondition; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public boolean isStudentDeclaration() { return studentDeclaration; }
    public void setStudentDeclaration(boolean studentDeclaration) { this.studentDeclaration = studentDeclaration; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}
