# Service Package

This package contains business logic layer - the brain of your application.

## Structure
```
service/
├── interfaces/     - Service interfaces
└── impl/          - Service implementations
```

## Purpose
- Implement business logic and rules
- Coordinate between controllers and DAOs
- Handle transactions
- Validate data
- Process complex operations

## Interface Files to Create (service/interfaces/)

- `AuthService.java` - Authentication and authorization
- `StudentService.java` - Student business logic
- `StaffService.java` - Staff business logic
- `CourseService.java` - Course management logic
- `BatchService.java` - Batch management logic
- `AttendanceService.java` - Attendance processing
- `FeeService.java` - Fee calculation and management
- `PaymentService.java` - Payment processing
- `GradeService.java` - Grade calculation
- `NotificationService.java` - Notification handling
- `ReportService.java` - Report generation

## Implementation Files to Create (service/impl/)

- `AuthServiceImpl.java`
- `StudentServiceImpl.java`
- `StaffServiceImpl.java`
- `CourseServiceImpl.java`
- `BatchServiceImpl.java`
- `AttendanceServiceImpl.java`
- `FeeServiceImpl.java`
- `PaymentServiceImpl.java`
- `GradeServiceImpl.java`
- `NotificationServiceImpl.java`
- `ReportServiceImpl.java`

## Example Interface

```java
package com.eduhub.service.interfaces;

import com.eduhub.model.Student;
import com.eduhub.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    // Business operations
    boolean enrollStudent(StudentDTO studentDTO) throws Exception;
    boolean updateStudent(StudentDTO studentDTO) throws Exception;
    boolean removeStudent(String studentId) throws Exception;
    
    // Retrieval
    StudentDTO getStudentById(String id) throws Exception;
    List<StudentDTO> getAllStudents() throws Exception;
    List<StudentDTO> searchStudents(String keyword) throws Exception;
    
    // Business logic
    boolean promoteStudent(String studentId, String newBatchId) throws Exception;
    boolean suspendStudent(String studentId, String reason) throws Exception;
    double calculateAttendancePercentage(String studentId) throws Exception;
    boolean isEligibleForExam(String studentId) throws Exception;
}
```

## Example Implementation

```java
package com.eduhub.service.impl;

import com.eduhub.service.interfaces.StudentService;
import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.dao.impl.StudentDAOImpl;
import com.eduhub.model.Student;
import com.eduhub.dto.StudentDTO;
import com.eduhub.util.ValidationUtil;

public class StudentServiceImpl implements StudentService {
    
    private StudentDAO studentDAO = new StudentDAOImpl();
    
    @Override
    public boolean enrollStudent(StudentDTO dto) throws Exception {
        // 1. Validate input
        if (!ValidationUtil.isValidEmail(dto.getEmail())) {
            throw new Exception("Invalid email format");
        }
        
        // 2. Check business rules
        if (studentDAO.existsByEmail(dto.getEmail())) {
            throw new Exception("Email already exists");
        }
        
        // 3. Convert DTO to Entity
        Student student = convertToEntity(dto);
        student.setStatus("Active");
        student.setEnrollDate(LocalDate.now());
        
        // 4. Save to database
        boolean result = studentDAO.save(student);
        
        // 5. Send notification
        if (result) {
            sendEnrollmentNotification(student);
        }
        
        return result;
    }
    
    @Override
    public double calculateAttendancePercentage(String studentId) throws Exception {
        Student student = studentDAO.getById(studentId);
        if (student == null) {
            throw new Exception("Student not found");
        }
        
        int totalDays = student.getTotalDays();
        int presentDays = student.getAttendanceDays();
        
        if (totalDays == 0) return 0.0;
        
        return (presentDays * 100.0) / totalDays;
    }
    
    private Student convertToEntity(StudentDTO dto) {
        // Convert DTO to entity
        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        // ... set other fields
        return student;
    }
    
    private void sendEnrollmentNotification(Student student) {
        // Send notification logic
    }
}
```

## Best Practices
- Keep business logic in service layer, not in controllers or DAOs
- Validate all inputs before processing
- Use DTOs for data transfer between layers
- Handle transactions properly
- Return meaningful error messages
- Keep methods focused on single responsibility
