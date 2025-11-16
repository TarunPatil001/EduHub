# DAO (Data Access Object) Package

This package contains interfaces and implementations for database operations.

## Structure
```
dao/
├── interfaces/     - DAO interfaces (contracts)
└── impl/          - DAO implementations (actual database code)
```

## Purpose
- Handle all database operations (CRUD)
- Separate data access logic from business logic
- Provide interface-based design for flexibility

## Interface Files to Create (dao/interfaces/)

- `UserDAO.java` - User database operations
- `StudentDAO.java` - Student database operations
- `StaffDAO.java` - Staff database operations
- `CourseDAO.java` - Course database operations
- `BatchDAO.java` - Batch database operations
- `AttendanceDAO.java` - Attendance database operations
- `StaffAttendanceDAO.java` - Staff attendance operations
- `FeeDAO.java` - Fee database operations
- `PaymentDAO.java` - Payment database operations
- `GradeDAO.java` - Grade database operations
- `NotificationDAO.java` - Notification database operations
- `ReportDAO.java` - Report data operations

## Implementation Files to Create (dao/impl/)

- `UserDAOImpl.java`
- `StudentDAOImpl.java`
- `StaffDAOImpl.java`
- `CourseDAOImpl.java`
- `BatchDAOImpl.java`
- `AttendanceDAOImpl.java`
- `StaffAttendanceDAOImpl.java`
- `FeeDAOImpl.java`
- `PaymentDAOImpl.java`
- `GradeDAOImpl.java`
- `NotificationDAOImpl.java`
- `ReportDAOImpl.java`

## Example Interface

```java
package com.eduhub.dao.interfaces;

import com.eduhub.model.Student;
import java.util.List;

public interface StudentDAO {
    // Create
    boolean save(Student student) throws Exception;
    
    // Read
    Student getById(String id) throws Exception;
    List<Student> getAll() throws Exception;
    List<Student> search(String keyword) throws Exception;
    
    // Update
    boolean update(Student student) throws Exception;
    
    // Delete
    boolean delete(String id) throws Exception;
    
    // Custom queries
    List<Student> getByCourse(String courseId) throws Exception;
    List<Student> getByStatus(String status) throws Exception;
    int getTotalCount() throws Exception;
}
```

## Example Implementation

```java
package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.model.Student;
import com.eduhub.util.DatabaseUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDAOImpl implements StudentDAO {
    
    @Override
    public boolean save(Student student) throws Exception {
        String sql = "INSERT INTO students (id, name, email, phone) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, student.getId());
            stmt.setString(2, student.getName());
            stmt.setString(3, student.getEmail());
            stmt.setString(4, student.getPhone());
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    @Override
    public Student getById(String id) throws Exception {
        String sql = "SELECT * FROM students WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                Student student = new Student();
                student.setId(rs.getString("id"));
                student.setName(rs.getString("name"));
                student.setEmail(rs.getString("email"));
                student.setPhone(rs.getString("phone"));
                return student;
            }
        }
        return null;
    }
    
    // ... implement other methods
}
```

## Best Practices
- Always use PreparedStatement to prevent SQL injection
- Close resources properly (use try-with-resources)
- Handle exceptions appropriately
- Return meaningful values (boolean for success, object for retrieval)
- Keep database logic only in DAO layer
