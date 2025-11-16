# Exception Package

Contains custom exception classes for error handling.

## Purpose
- Define application-specific exceptions
- Better error handling and debugging
- Meaningful error messages
- Exception hierarchy

## Files to Create

1. **DAOException.java**
   - Database operation failures
   - Connection errors
   - SQL errors

2. **ServiceException.java**
   - Business logic failures
   - Validation errors
   - Processing errors

3. **ValidationException.java**
   - Input validation failures
   - Data constraint violations
   - Format errors

4. **AuthenticationException.java**
   - Login failures
   - Invalid credentials
   - Session errors

5. **AuthorizationException.java**
   - Permission denied
   - Role mismatch
   - Access denied

6. **NotFoundException.java**
   - Record not found
   - Resource not found

7. **DuplicateException.java**
   - Duplicate entry
   - Unique constraint violation

8. **FileUploadException.java**
   - File upload failures
   - Invalid file type
   - Size exceeded

## Example Exception Class

```java
package com.eduhub.exception;

public class DAOException extends Exception {
    
    private static final long serialVersionUID = 1L;
    
    public DAOException(String message) {
        super(message);
    }
    
    public DAOException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public DAOException(Throwable cause) {
        super(cause);
    }
}
```

```java
package com.eduhub.exception;

public class ValidationException extends Exception {
    
    private static final long serialVersionUID = 1L;
    private String fieldName;
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }
    
    public String getFieldName() {
        return fieldName;
    }
}
```

## Usage Example

```java
// In DAO
public Student getById(String id) throws DAOException {
    try {
        // database code
    } catch (SQLException e) {
        throw new DAOException("Failed to retrieve student", e);
    }
}

// In Service
public void enrollStudent(StudentDTO dto) throws ValidationException {
    if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
        throw new ValidationException("email", "Email is required");
    }
}

// In Controller
try {
    studentService.enrollStudent(dto);
} catch (ValidationException e) {
    request.setAttribute("error", e.getMessage());
    request.setAttribute("field", e.getFieldName());
}
```
