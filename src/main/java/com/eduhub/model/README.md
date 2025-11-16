# Model Package

This package contains Entity/Model classes (POJOs - Plain Old Java Objects) that represent your database tables.

## Purpose
- Represent database entities
- Define object structure with properties/fields
- Include getters, setters, and business methods
- No database or business logic here

## Files to Create

### Core Entities
- `User.java` - User authentication and base user data
- `Student.java` - Student information
- `Staff.java` - Staff/Teacher information
- `Course.java` - Course details
- `Batch.java` - Batch/Class information
- `Institute.java` - Institute details

### Attendance
- `Attendance.java` - Student attendance records
- `StaffAttendance.java` - Staff attendance records

### Financial
- `Fee.java` - Fee structure
- `Payment.java` - Payment records
- `Payroll.java` - Staff payroll

### Academic
- `Grade.java` - Student grades/marks
- `Subject.java` - Subject/topic information
- `Exam.java` - Exam details

### Communication
- `Notification.java` - System notifications
- `Message.java` - Messages between users

### Reporting
- `Report.java` - Base report class
- `AttendanceReport.java` - Attendance reports
- `PerformanceReport.java` - Performance reports

## Example Structure

```java
package com.eduhub.model;

import java.time.LocalDate;

public class Student {
    // Properties
    private String id;
    private String name;
    private String email;
    private String phone;
    private LocalDate enrollDate;
    private String status;
    
    // Constructors
    public Student() {}
    
    public Student(String id, String name, String email) {
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
    
    // ... more getters/setters
    
    // Business methods
    public String getFullName() {
        return name;
    }
    
    @Override
    public String toString() {
        return "Student{id='" + id + "', name='" + name + "'}";
    }
}
```

## Best Practices
- Use private fields with public getters/setters
- Include constructors (default and parameterized)
- Override toString() for debugging
- Add business helper methods when needed
- Keep it simple - no database or service logic
