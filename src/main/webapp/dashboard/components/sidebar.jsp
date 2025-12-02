<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Get active page parameter
    String activePage = request.getParameter("activePage");
    if (activePage == null) activePage = "";
    
    // Define active states for each menu section
    boolean studentsActive = activePage.equals("students") || activePage.equals("add-student") || 
                             activePage.equals("all-students") || activePage.equals("fees-management") || 
                             activePage.equals("record-payment") || activePage.equals("performance-reports") || 
                             activePage.equals("id-certificates");
    
    boolean coursesActive = activePage.equals("courses") || activePage.equals("create-course") || 
                           activePage.equals("all-courses") || activePage.equals("manage-batches") || 
                           activePage.equals("create-batch");
    
    boolean attendanceActive = activePage.equals("attendance") || activePage.equals("student-attendance-mark") || 
                              activePage.equals("staff-attendance");
    
    boolean staffActive = activePage.equals("staff") || activePage.equals("add-staff") || 
                         activePage.equals("all-staff") || activePage.equals("payroll");
    
    boolean branchesActive = activePage.equals("branches") || activePage.equals("create-branch") || 
                            activePage.equals("all-branches");

    boolean reportsActive = activePage.equals("reports") || activePage.equals("placement-reports");
%>
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
                   class="nav-link <%= activePage.equals("home") ? "active" : "" %>">
                    <i class="bi bi-house-door"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            
            <!-- Students -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= studentsActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#studentsMenu" 
                   aria-expanded="<%= studentsActive ? "true" : "false" %>">
                    <i class="bi bi-mortarboard"></i>
                    <span>Students</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= studentsActive ? "show" : "" %>" id="studentsMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/add-student.jsp" class="nav-link <%= activePage.equals("add-student") ? "active" : "" %>"><i class="bi bi-plus-circle"></i><span>Add Student</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp" class="nav-link <%= activePage.equals("all-students") ? "active" : "" %>"><i class="bi bi-people"></i><span>All Students</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp" class="nav-link <%= activePage.equals("fees-management") ? "active" : "" %>"><i class="bi bi-currency-dollar"></i><span>Fees Management</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="nav-link <%= activePage.equals("record-payment") ? "active" : "" %>"><i class="bi bi-credit-card"></i><span>Record Payment</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/performance-reports.jsp" class="nav-link <%= activePage.equals("performance-reports") ? "active" : "" %>"><i class="bi bi-graph-up"></i><span>Performance Reports</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/students/id-certificates.jsp" class="nav-link <%= activePage.equals("id-certificates") ? "active" : "" %>"><i class="bi bi-card-heading"></i><span>ID Card / Certificates</span></a></li>
                </ul>
            </li>
            
            <!-- Courses & Batches -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= coursesActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#coursesMenu" 
                   aria-expanded="<%= coursesActive ? "true" : "false" %>">
                    <i class="bi bi-book"></i>
                    <span>Courses & Batches</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= coursesActive ? "show" : "" %>" id="coursesMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="nav-link <%= activePage.equals("create-course") ? "active" : "" %>"><i class="bi bi-plus-circle"></i><span>Create Course</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp" class="nav-link <%= activePage.equals("all-courses") ? "active" : "" %>"><i class="bi bi-journal-text"></i><span>All Courses</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="nav-link <%= activePage.equals("create-batch") ? "active" : "" %>"><i class="bi bi-plus-square"></i><span>Create Batch</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp" class="nav-link <%= activePage.equals("manage-batches") ? "active" : "" %>"><i class="bi bi-calendar3"></i><span>Manage Batches</span></a></li>
                </ul>
            </li>
            
            <!-- Attendance -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= attendanceActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#attendanceMenu" 
                   aria-expanded="<%= attendanceActive ? "true" : "false" %>">
                    <i class="bi bi-calendar-check"></i>
                    <span>Attendance</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= attendanceActive ? "show" : "" %>" id="attendanceMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/attendance/student-attendance.jsp" class="nav-link <%= activePage.equals("student-attendance-mark") ? "active" : "" %>"><i class="bi bi-person-check"></i><span>Student Attendance</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/attendance/staff-attendance.jsp" class="nav-link <%= activePage.equals("staff-attendance") ? "active" : "" %>"><i class="bi bi-person-workspace"></i><span>Staff Attendance</span></a></li>
                </ul>
            </li>
            
            <!-- Staff Management -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= staffActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#staffMenu" 
                   aria-expanded="<%= staffActive ? "true" : "false" %>">
                    <i class="bi bi-people-fill"></i>
                    <span>Staff Management</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= staffActive ? "show" : "" %>" id="staffMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="nav-link <%= activePage.equals("add-staff") ? "active" : "" %>"><i class="bi bi-plus-circle"></i><span>Add Staff</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp" class="nav-link <%= activePage.equals("all-staff") ? "active" : "" %>"><i class="bi bi-person-lines-fill"></i><span>All Staff</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/staff/payroll.jsp" class="nav-link <%= activePage.equals("payroll") ? "active" : "" %>"><i class="bi bi-cash-stack"></i><span>Payroll & Salary</span></a></li>
                </ul>
            </li>
            
            <!-- Branch Management -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= branchesActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#branchesMenu" 
                   aria-expanded="<%= branchesActive ? "true" : "false" %>">
                    <i class="bi bi-diagram-3"></i>
                    <span>Branch Management</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= branchesActive ? "show" : "" %>" id="branchesMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/branches/create-branch.jsp" class="nav-link <%= activePage.equals("create-branch") ? "active" : "" %>"><i class="bi bi-plus-circle"></i><span>Create Branch</span></a></li>
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/branches/all-branches.jsp" class="nav-link <%= activePage.equals("all-branches") ? "active" : "" %>"><i class="bi bi-list-ul"></i><span>All Branches</span></a></li>
                </ul>
            </li>
            
            <!-- Reports & Analytics -->
            <li class="nav-item">
                <a href="#" class="nav-link has-submenu <%= reportsActive ? "active" : "" %>" 
                   data-bs-toggle="collapse" data-bs-target="#reportsMenu" 
                   aria-expanded="<%= reportsActive ? "true" : "false" %>">
                    <i class="bi bi-graph-up-arrow"></i>
                    <span>Reports & Analytics</span>
                    <i class="bi bi-chevron-down submenu-arrow"></i>
                </a>
                <ul class="submenu collapse <%= reportsActive ? "show" : "" %>" id="reportsMenu">
                    <li><a href="${pageContext.request.contextPath}/dashboard/pages/reports/placement-reports.jsp" class="nav-link <%= activePage.equals("placement-reports") ? "active" : "" %>"><i class="bi bi-briefcase"></i><span>Placement Reports</span></a></li>
                </ul>
            </li>
            
            <!-- Settings -->
            <li class="nav-item">
                <a href="${pageContext.request.contextPath}/dashboard/pages/settings.jsp" 
                   class="nav-link <%= activePage.equals("settings") ? "active" : "" %>">
                    <i class="bi bi-gear"></i>
                    <span>Settings</span>
                </a>
            </li>
        </ul>
    </nav>
    
    <div class="sidebar-footer">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a href="${pageContext.request.contextPath}/auth/logout" class="nav-link text-danger" id="sidebarLogoutBtn">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    </div>
</aside>
