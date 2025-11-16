# Controller Package

This package contains Servlets that handle HTTP requests and responses.

## Structure
```
controller/
├── auth/          - Authentication controllers
├── student/       - Student management controllers
├── staff/         - Staff management controllers
├── course/        - Course management controllers
├── attendance/    - Attendance controllers
├── fee/           - Fee and payment controllers
└── report/        - Report controllers
```

## Purpose
- Handle HTTP requests (GET, POST, PUT, DELETE)
- Call service layer for business logic
- Forward to JSP views
- Send JSON responses for AJAX
- Handle form submissions

## Controllers to Create

### auth/ (Authentication)
- `LoginServlet.java` - Handle login
- `LogoutServlet.java` - Handle logout
- `RegisterServlet.java` - Handle registration
- `ForgotPasswordServlet.java` - Password reset

### student/ (Student Management)
- `StudentListServlet.java` - Display all students
- `AddStudentServlet.java` - Add new student
- `EditStudentServlet.java` - Edit student details
- `DeleteStudentServlet.java` - Delete student
- `StudentDetailsServlet.java` - View student details
- `StudentAttendanceServlet.java` - Student attendance
- `StudentFeesServlet.java` - Student fees

### staff/ (Staff Management)
- `StaffListServlet.java` - Display all staff
- `AddStaffServlet.java` - Add new staff
- `EditStaffServlet.java` - Edit staff details
- `DeleteStaffServlet.java` - Delete staff
- `StaffPayrollServlet.java` - Staff payroll

### course/ (Course Management)
- `CourseListServlet.java` - Display all courses
- `CreateCourseServlet.java` - Create new course
- `EditCourseServlet.java` - Edit course
- `DeleteCourseServlet.java` - Delete course
- `BatchManagementServlet.java` - Manage batches
- `CreateBatchServlet.java` - Create new batch

### attendance/ (Attendance)
- `MarkAttendanceServlet.java` - Mark attendance
- `ViewAttendanceServlet.java` - View attendance
- `AttendanceReportServlet.java` - Attendance reports

### fee/ (Fees & Payments)
- `FeeManagementServlet.java` - Manage fees
- `RecordPaymentServlet.java` - Record payment
- `PaymentHistoryServlet.java` - View payment history
- `GenerateReceiptServlet.java` - Generate receipt

### report/ (Reports)
- `AttendanceReportServlet.java` - Attendance reports
- `PerformanceReportServlet.java` - Performance reports
- `FinancialReportServlet.java` - Financial reports
- `PlacementReportServlet.java` - Placement reports

## Example Servlet

```java
package com.eduhub.controller.student;

import com.eduhub.service.interfaces.StudentService;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.dto.StudentDTO;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

public class StudentListServlet extends HttpServlet {
    
    private StudentService studentService = new StudentServiceImpl();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
            // Get parameters
            String searchKeyword = request.getParameter("search");
            String status = request.getParameter("status");
            
            // Get data from service
            List<StudentDTO> students;
            if (searchKeyword != null && !searchKeyword.isEmpty()) {
                students = studentService.searchStudents(searchKeyword);
            } else if (status != null) {
                students = studentService.getStudentsByStatus(status);
            } else {
                students = studentService.getAllStudents();
            }
            
            // Set attributes for JSP
            request.setAttribute("students", students);
            request.setAttribute("totalCount", students.size());
            
            // Forward to JSP
            RequestDispatcher dispatcher = request.getRequestDispatcher(
                "/views/students/list.jsp"
            );
            dispatcher.forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", e.getMessage());
            request.getRequestDispatcher("/views/errors/500.jsp")
                   .forward(request, response);
        }
    }
}
```

## Example POST Handler

```java
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    
    try {
        // Get form data
        StudentDTO dto = new StudentDTO();
        dto.setName(request.getParameter("name"));
        dto.setEmail(request.getParameter("email"));
        dto.setPhone(request.getParameter("phone"));
        // ... set other fields
        
        // Call service
        boolean result = studentService.enrollStudent(dto);
        
        if (result) {
            // Success - redirect to list
            response.sendRedirect(request.getContextPath() + 
                "/students/list?success=Student added successfully");
        } else {
            // Failure - show error
            request.setAttribute("error", "Failed to add student");
            request.getRequestDispatcher("/views/students/add.jsp")
                   .forward(request, response);
        }
        
    } catch (Exception e) {
        request.setAttribute("error", e.getMessage());
        request.getRequestDispatcher("/views/students/add.jsp")
               .forward(request, response);
    }
}
```

## Best Practices
- Keep controllers thin - delegate to service layer
- Don't put business logic in controllers
- Use proper HTTP methods (GET for retrieval, POST for submission)
- Always validate user input
- Handle exceptions gracefully
- Set proper response codes
- Use RequestDispatcher for forwarding
- Use sendRedirect for redirects
