package com.eduhub.model;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;

public class Batch {
    private String batchId;
    private String instituteId;
    private String branchId;
    private String courseId;
    private String instructorId;
    private String batchCode;
    private String batchName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int maxCapacity;
    private String classDays; // Stored as comma-separated string
    private String modeOfConduct;
    private String status;
    private String classroomLocation;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    // Transient fields (not in batches table)
    private String branchName;
    private String courseName;

    // Getters and Setters
    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getInstituteId() { return instituteId; }
    public void setInstituteId(String instituteId) { this.instituteId = instituteId; }

    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getInstructorId() { return instructorId; }
    public void setInstructorId(String instructorId) { this.instructorId = instructorId; }

    public String getBatchCode() { return batchCode; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public int getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(int maxCapacity) { this.maxCapacity = maxCapacity; }

    public String getClassDays() { return classDays; }
    public void setClassDays(String classDays) { this.classDays = classDays; }

    public String getModeOfConduct() { return modeOfConduct; }
    public void setModeOfConduct(String modeOfConduct) { this.modeOfConduct = modeOfConduct; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getClassroomLocation() { return classroomLocation; }
    public void setClassroomLocation(String classroomLocation) { this.classroomLocation = classroomLocation; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
}
