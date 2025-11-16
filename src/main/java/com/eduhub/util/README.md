# Utility Package

Contains helper classes and utility methods used across the application.

## Files to Create

1. **Constants.java**
   - Application-wide constants
   - Configuration keys
   - Status values
   - Messages

2. **DatabaseUtil.java**
   - Database connection management
   - Connection pooling
   - Resource cleanup

3. **DateUtil.java**
   - Date formatting
   - Date parsing
   - Date calculations
   - Age calculation

4. **ValidationUtil.java**
   - Email validation
   - Phone validation
   - Password strength check
   - Input sanitization

5. **EncryptionUtil.java**
   - Password hashing
   - Encryption/Decryption
   - Token generation

6. **EmailUtil.java**
   - Send emails
   - Email templates
   - SMTP configuration

7. **FileUploadUtil.java**
   - Handle file uploads
   - Validate file types
   - Save files
   - Generate file names

8. **StringUtil.java**
   - String manipulation
   - Format strings
   - Sanitize input

9. **NumberUtil.java**
   - Number formatting
   - Currency formatting
   - Calculations

10. **PDFUtil.java**
    - Generate PDF reports
    - PDF receipts
    - Certificates

11. **ExcelUtil.java**
    - Export to Excel
    - Import from Excel
    - Data formatting

12. **SessionUtil.java**
    - Session management helpers
    - Get current user
    - Check permissions

## Example Utility Class

```java
package com.eduhub.util;

public class Constants {
    
    // Database
    public static final String DB_DRIVER = "com.mysql.cj.jdbc.Driver";
    public static final String DB_URL_KEY = "db.url";
    
    // Session
    public static final String SESSION_USER = "currentUser";
    public static final String SESSION_USER_ID = "userId";
    public static final String SESSION_USER_ROLE = "userRole";
    
    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_TEACHER = "TEACHER";
    public static final String ROLE_STUDENT = "STUDENT";
    
    // Status
    public static final String STATUS_ACTIVE = "Active";
    public static final String STATUS_INACTIVE = "Inactive";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 10;
    
    private Constants() {
        // Prevent instantiation
    }
}
```
