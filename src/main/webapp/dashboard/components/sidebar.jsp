<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Dashboard Sidebar Component
  
  Purpose: 
    - Provides navigation menu for dashboard with nested submenus
    - Shows active page highlighting
  
  Parameters:
    - activePage (optional): Current active page name
--%>

<aside class="dashboard-sidebar" id="dashboardSidebar">
    <div class="sidebar-header">
        <h4><i class="bi bi-grid-fill"></i><span class="mb-0">EDUHUB</span></h4>
        <button class="btn-close-sidebar d-md-none" id="closeSidebar">
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
    
    <nav class="sidebar-nav">
        <ul class="nav flex-column">
            <!-- Dashboard -->
            <li class="nav-item">
                <a href="${pageContext.request.contextPath}/dashboard" 
                   class="nav-link ${param.activePage == 'home' ? 'active' : ''}">
                    <i class="bi bi-house-door"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            
            <!-- Students -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu ${param.activePage == 'students' || param.activePage == 'add-student' || param.activePage == 'all-students' || param.activePage == 'fees-management' || param.activePage == 'record-payment' || param.activePage == 'performance-reports' || param.activePage == 'id-certificates' ? 'active' : ''}" data-bs-toggle="collapse" data-bs-target="#studentsMenu">
                    <i class="bi bi-mortarboard"></i>
                    <span>Students</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse ${param.activePage == 'students' || param.activePage == 'add-student' || param.activePage == 'all-students' || param.activePage == 'fees-management' || param.activePage == 'record-payment' || param.activePage == 'performance-reports' || param.activePage == 'id-certificates' ? 'show' : ''}" id="studentsMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/add-student.jsp" class="nav-link ${param.activePage == 'add-student' ? 'active' : ''}"><i class="bi bi-plus-circle"></i><span>Add Student</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp" class="nav-link ${param.activePage == 'all-students' ? 'active' : ''}"><i class="bi bi-people"></i><span>All Students</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp" class="nav-link ${param.activePage == 'fees-management' ? 'active' : ''}"><i class="bi bi-currency-dollar"></i><span>Fees Management</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="nav-link ${param.activePage == 'record-payment' ? 'active' : ''}"><i class="bi bi-credit-card"></i><span>Record Payment</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/performance-reports.jsp" class="nav-link ${param.activePage == 'performance-reports' ? 'active' : ''}"><i class="bi bi-graph-up"></i><span>Performance Reports</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/id-certificates.jsp" class="nav-link ${param.activePage == 'id-certificates' ? 'active' : ''}"><i class="bi bi-card-heading"></i><span>ID Card / Certificates</span></a></li>
                </ul>
            </li>
            
            <!-- Courses & Batches -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu ${param.activePage == 'courses' || param.activePage == 'create-course' || param.activePage == 'all-courses' || param.activePage == 'manage-batches' || param.activePage == 'create-batch' ? 'active' : ''}" data-bs-toggle="collapse" data-bs-target="#coursesMenu">
                    <i class="bi bi-book"></i>
                    <span>Courses & Batches</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse ${param.activePage == 'courses' || param.activePage == 'create-course' || param.activePage == 'all-courses' || param.activePage == 'manage-batches' || param.activePage == 'create-batch' ? 'show' : ''}" id="coursesMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="nav-link ${param.activePage == 'create-course' ? 'active' : ''}"><i class="bi bi-plus-circle"></i><span>Create Course</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp" class="nav-link ${param.activePage == 'all-courses' ? 'active' : ''}"><i class="bi bi-journal-text"></i><span>All Courses</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="nav-link ${param.activePage == 'create-batch' ? 'active' : ''}"><i class="bi bi-plus-square"></i><span>Create Batch</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp" class="nav-link ${param.activePage == 'manage-batches' ? 'active' : ''}"><i class="bi bi-calendar3"></i><span>Manage Batches</span></a></li>
                </ul>
            </li>
            
            <!-- Attendance -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu ${param.activePage == 'attendance' || param.activePage == 'student-attendance-mark' || param.activePage == 'staff-attendance' ? 'active' : ''}" data-bs-toggle="collapse" data-bs-target="#attendanceMenu">
                    <i class="bi bi-calendar-check"></i>
                    <span>Attendance</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse ${param.activePage == 'attendance' || param.activePage == 'student-attendance-mark' || param.activePage == 'staff-attendance' ? 'show' : ''}" id="attendanceMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/attendance/student-attendance.jsp" class="nav-link ${param.activePage == 'student-attendance-mark' ? 'active' : ''}"><i class="bi bi-person-check"></i><span>Student Attendance</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/attendance/staff-attendance.jsp" class="nav-link ${param.activePage == 'staff-attendance' ? 'active' : ''}"><i class="bi bi-person-workspace"></i><span>Staff Attendance</span></a></li>
                </ul>
            </li>
            
            <!-- Staff Management -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu ${param.activePage == 'staff' || param.activePage == 'add-staff' || param.activePage == 'all-staff' || param.activePage == 'payroll' ? 'active' : ''}" data-bs-toggle="collapse" data-bs-target="#staffMenu">
                    <i class="bi bi-people-fill"></i>
                    <span>Staff Management</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse ${param.activePage == 'staff' || param.activePage == 'add-staff' || param.activePage == 'all-staff' || param.activePage == 'payroll' ? 'show' : ''}" id="staffMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="nav-link ${param.activePage == 'add-staff' ? 'active' : ''}"><i class="bi bi-plus-circle"></i><span>Add Staff</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp" class="nav-link ${param.activePage == 'all-staff' ? 'active' : ''}"><i class="bi bi-person-lines-fill"></i><span>All Staff</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/payroll.jsp" class="nav-link ${param.activePage == 'payroll' ? 'active' : ''}"><i class="bi bi-cash-stack"></i><span>Payroll & Salary</span></a></li>
                </ul>
            </li>
            
            <!-- Communication -->
            <li class="nav-item">
                <a href="${pageContext.request.contextPath}/dashboard/pages/communication/notice-board.jsp" 
                   class="nav-link ${param.activePage == 'notice-board' ? 'active' : ''}">
                    <i class="bi bi-megaphone"></i>
                    <span>Notice Board</span>
                </a>
            </li>
            
            <!-- Reports & Analytics -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu ${param.activePage == 'reports' || param.activePage == 'fees-report' || param.activePage == 'placement-reports' ? 'active' : ''}" data-bs-toggle="collapse" data-bs-target="#reportsMenu">
                    <i class="bi bi-graph-up-arrow"></i>
                    <span>Reports & Analytics</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse ${param.activePage == 'reports' || param.activePage == 'fees-report' || param.activePage == 'placement-reports' ? 'show' : ''}" id="reportsMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/reports/fees-collection.jsp" class="nav-link ${param.activePage == 'fees-report' ? 'active' : ''}"><i class="bi bi-cash-coin"></i><span>Fees Collection Reports</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/reports/placement-reports.jsp" class="nav-link ${param.activePage == 'placement-reports' ? 'active' : ''}"><i class="bi bi-briefcase"></i><span>Placement Reports</span></a></li>
                </ul>
            </li>
            
            <!-- Settings -->
            <li class="nav-item">
                <a href="${pageContext.request.contextPath}/dashboard/pages/settings.jsp" 
                   class="nav-link ${param.activePage == 'settings' ? 'active' : ''}">
                    <i class="bi bi-gear"></i>
                    <span>Settings</span>
                </a>
            </li>
        </ul>
    </nav>
    
    <div class="sidebar-footer">
        <a href="${pageContext.request.contextPath}/" class="nav-link text-danger">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
        </a>
    </div>
</aside>