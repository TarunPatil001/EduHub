# DTO (Data Transfer Object) Package

Contains classes for transferring data between layers.

## Purpose
- Transfer data between presentation and service layers
- Avoid exposing entity classes to views
- Include only necessary fields
- Add computed/derived fields
- Flatten complex objects

## Files to Create

1. **UserDTO.java** - User data transfer
2. **StudentDTO.java** - Student data transfer
3. **StaffDTO.java** - Staff data transfer
4. **CourseDTO.java** - Course data transfer
5. **BatchDTO.java** - Batch data transfer
6. **AttendanceDTO.java** - Attendance data
7. **FeeDTO.java** - Fee information
8. **PaymentDTO.java** - Payment data
9. **GradeDTO.java** - Grade data
10. **ReportDTO.java** - Report data
11. **DashboardDTO.java** - Dashboard statistics

## Example DTO

```java
package com.eduhub.dto;

public class StudentDTO {
    
    // Basic fields
    private String id;
    private String name;
    private String email;
    private String phone;
    private String status;
    
    // Computed fields
    private String courseName;
    private String batchName;
    private double attendancePercentage;
    private double feesPending;
    
    // Display fields
    private String enrollDateFormatted;
    private String statusBadgeClass;
    
    // Constructors
    public StudentDTO() {}
    
    public StudentDTO(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    // ... more getters/setters
    
    public String getStatusBadgeClass() {
        if ("Active".equals(status)) {
            return "badge-success";
        } else if ("Suspended".equals(status)) {
            return "badge-danger";
        } else {
            return "badge-secondary";
        }
    }
}
```

## Benefits
- Separation between database entities and presentation
- Can combine data from multiple entities
- Add display-specific formatting
- Reduce data transfer overhead
- Version compatibility
