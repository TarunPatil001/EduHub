package com.eduhub.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Course Model - Represents a course offered by an institute
 */
public class Course {
    
    private String courseId;
    private String instituteId;
    private String courseCode;
    private String courseName;
    private String category;
    private String level;
    private String description;
    private String modules;
    private int durationValue;
    private String durationUnit;
    private BigDecimal fee;
    private String status; // Active, Inactive, Draft, Archived
    private boolean certificateOffered;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    // Constructors
    public Course() {}
    
    public Course(String instituteId, String courseCode, String courseName, String category, 
                 String level, String description, String modules, int durationValue, String durationUnit, 
                 BigDecimal fee, String status, boolean certificateOffered) {
        this.instituteId = instituteId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.category = category;
        this.level = level;
        this.description = description;
        this.modules = modules;
        this.durationValue = durationValue;
        this.durationUnit = durationUnit;
        this.fee = fee;
        this.status = status;
        this.certificateOffered = certificateOffered;
    }
    
    // Getters and Setters
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getInstituteId() {
        return instituteId;
    }

    public void setInstituteId(String instituteId) {
        this.instituteId = instituteId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModules() {
        return modules;
    }

    public void setModules(String modules) {
        this.modules = modules;
    }

    public int getDurationValue() {
        return durationValue;
    }

    public void setDurationValue(int durationValue) {
        this.durationValue = durationValue;
    }

    public String getDurationUnit() {
        return durationUnit;
    }

    public void setDurationUnit(String durationUnit) {
        this.durationUnit = durationUnit;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isCertificateOffered() {
        return certificateOffered;
    }

    public void setCertificateOffered(boolean certificateOffered) {
        this.certificateOffered = certificateOffered;
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

    @Override
    public String toString() {
        return "Course{" +
                "courseId=" + courseId +
                ", instituteId='" + instituteId + '\'' +
                ", courseCode='" + courseCode + '\'' +
                ", courseName='" + courseName + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
