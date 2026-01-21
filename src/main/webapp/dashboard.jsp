<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.eduhub.model.Student" %>
<%
    // Security Check - Prevent unauthorized access
    if (session == null || session.getAttribute("userId") == null) {
        // User is not logged in, redirect to login page
        response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=unauthorized");
        return;
    }
    
    // Get user information from session
    String userId = (String) session.getAttribute("userId");
    String userName = (String) session.getAttribute("userName");
    String userEmail = (String) session.getAttribute("userEmail");
    String userRole = (String) session.getAttribute("userRole");
    String instituteId = (String) session.getAttribute("instituteId");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Dashboard - EduHub"/>
        <jsp:param name="description" value="EduHub Dashboard - Manage your educational institution"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="home"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Dashboard Overview"/>
            </jsp:include>
            
            <!-- Content -->
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Welcome to EduHub Dashboard</h2>
                    <p>Overview of your educational management system - <%= new java.text.SimpleDateFormat("EEEE, MMMM dd, yyyy").format(new java.util.Date()) %></p>
                </div>
                
                <!-- Stats Cards Row - Primary Metrics -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Total Active Students"/>
                            <jsp:param name="value" value="${activeStudents != null ? activeStudents : '0'}"/>
                            <jsp:param name="icon" value="bi-people-fill"/>
                            <jsp:param name="color" value="primary"/>
                            <jsp:param name="change" value=""/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Total Staff"/>
                            <jsp:param name="value" value="${totalStaff != null ? totalStaff : '0'}"/>
                            <jsp:param name="icon" value="bi-person-badge-fill"/>
                            <jsp:param name="color" value="success"/>
                            <jsp:param name="change" value=""/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Active Courses"/>
                            <jsp:param name="value" value="${activeCourses != null ? activeCourses : '0'}"/>
                            <jsp:param name="icon" value="bi-book-fill"/>
                            <jsp:param name="color" value="warning"/>
                            <jsp:param name="change" value=""/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Attendance Est."/>
                            <jsp:param name="value" value="${attendancePercentage != null ? attendancePercentage : '0'}%"/>
                            <jsp:param name="icon" value="bi-calendar-check-fill"/>
                            <jsp:param name="color" value="info"/>
                            <jsp:param name="change" value=""/>
                        </jsp:include>
                    </div>
                </div>
                
                <!-- Secondary Metrics Row -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-danger bg-opacity-10 text-danger mb-2">
                                <i class="bi bi-exclamation-triangle-fill fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Pending Fees (Students)</h6>
                            <h3 class="mb-0">${pendingFeesCount != null ? pendingFeesCount : '0'}</h3>
                            <small class="text-muted">Students with dues</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-success bg-opacity-10 text-success mb-2">
                                <i class="bi bi-cash-stack fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Total Collected</h6>
                            <h3 class="mb-0">Rs. ${totalRevenue != null ? totalRevenue : '0.0'}</h3>
                            <small class="text-success">Total Fees Collected</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-primary bg-opacity-10 text-primary mb-2">
                                <i class="bi bi-clipboard-check fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Active Batches</h6>
                            <h3 class="mb-0">${activeBatches != null ? activeBatches : '0'}</h3>
                            <small class="text-muted">Currently Running</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-warning bg-opacity-10 text-warning mb-2">
                                <i class="bi bi-diagram-3-fill fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Total Branches</h6>
                            <h3 class="mb-0">${totalBranches != null ? totalBranches : '0'}</h3>
                            <small class="text-muted">Across Institute</small>
                        </div>
                    </div>
                </div>
                
                <!-- Main Dashboard Grid -->
                <div class="row g-3 mb-4">
                    <!-- Recent Activity -->
                    <div class="col-lg-6">
                        <div class="card-custom" style="height: 100%;">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0"><i class="bi bi-clock-history"></i> Recent Activity</h5>
                                <a href="#" class="btn btn-sm btn-outline-primary">View All</a>
                            </div>
                            <div class="list-group list-group-flush">
                                <%
                                    List<Student> recentStudents = (List<Student>) request.getAttribute("recentStudents");
                                    if (recentStudents != null && !recentStudents.isEmpty()) {
                                        for (Student student : recentStudents) {
                                %>
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-person-plus-fill text-primary me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">New Student: <%= student.getStudentName() %> <%= student.getSurname() %></h6>
                                                <p class="mb-1 small text-muted">Mobile: <%= student.getMobileNumber() %></p>
                                            </div>
                                        </div>
                                        <small class="text-muted">Recent</small>
                                    </div>
                                </div>
                                <%
                                        }
                                    } else {
                                %>
                                <div class="list-group-item text-center text-muted">
                                    No recent activity found.
                                </div>
                                <%
                                    }
                                %>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions & Upcoming Events -->
                    <div class="col-lg-6">
                        <!-- Quick Actions -->
                        <div class="card-custom mb-3">
                            <h5 class="mb-3"><i class="bi bi-lightning-fill"></i> Quick Actions</h5>
                            <div class="row g-2">
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/students/add-student.jsp" class="btn btn-outline-primary w-100">
                                        <i class="bi bi-person-plus"></i> Add Student
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/staff/add-staff.jsp" class="btn btn-outline-success w-100">
                                        <i class="bi bi-person-badge"></i> Add Staff
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="btn btn-outline-warning w-100">
                                        <i class="bi bi-book"></i> Create Course
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/attendance/student-attendance.jsp" class="btn btn-outline-info w-100">
                                        <i class="bi bi-calendar-check"></i> Mark Attendance
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="btn btn-outline-danger w-100">
                                        <i class="bi bi-cash"></i> Record Payment
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/reports/attendance-reports.jsp" class="btn btn-outline-secondary w-100">
                                        <i class="bi bi-file-earmark-bar-graph"></i> View Reports
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts & Analytics Section Removed -->
                
                <!-- Bottom Section - Performance & Financial Overview Removed -->
                
            </div>
        </div>
    </div>
    
    <!-- Toast Notification Component -->
    <!-- Centralized Toast Notification Component -->
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
