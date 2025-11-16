# DAO Interfaces Package

This package contains all DAO interface definitions.

## Files to Create

1. **UserDAO.java** - User authentication and management
2. **StudentDAO.java** - Student CRUD operations
3. **StaffDAO.java** - Staff CRUD operations
4. **CourseDAO.java** - Course management
5. **BatchDAO.java** - Batch management
6. **AttendanceDAO.java** - Student attendance
7. **StaffAttendanceDAO.java** - Staff attendance
8. **FeeDAO.java** - Fee management
9. **PaymentDAO.java** - Payment processing
10. **GradeDAO.java** - Grade management
11. **NotificationDAO.java** - Notification system
12. **ReportDAO.java** - Report generation

## Standard Methods

Each DAO interface should include:
- `save(Entity entity)` - Create new record
- `update(Entity entity)` - Update existing record
- `delete(String id)` - Delete record
- `getById(String id)` - Get single record
- `getAll()` - Get all records
- `search(String keyword)` - Search records
- Custom query methods as needed
