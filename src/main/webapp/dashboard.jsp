<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
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
                    <p>Overview of your educational management system</p>
                </div>
                
                <!-- Stats Cards Row -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Total Students"/>
                            <jsp:param name="value" value="1,234"/>
                            <jsp:param name="icon" value="bi-people-fill"/>
                            <jsp:param name="color" value="primary"/>
                            <jsp:param name="change" value="12.5"/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Total Teachers"/>
                            <jsp:param name="value" value="87"/>
                            <jsp:param name="icon" value="bi-person-badge-fill"/>
                            <jsp:param name="color" value="success"/>
                            <jsp:param name="change" value="5.2"/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Active Courses"/>
                            <jsp:param name="value" value="42"/>
                            <jsp:param name="icon" value="bi-book-fill"/>
                            <jsp:param name="color" value="warning"/>
                            <jsp:param name="change" value="8.1"/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Attendance Rate"/>
                            <jsp:param name="value" value="94.2%"/>
                            <jsp:param name="icon" value="bi-calendar-check-fill"/>
                            <jsp:param name="color" value="info"/>
                            <jsp:param name="change" value="2.3"/>
                        </jsp:include>
                    </div>
                </div>
                
                <!-- Recent Activity and Quick Actions -->
                <div class="row g-3">
                    <div class="col-lg-8">
                        <div class="card-custom">
                            <h5><i class="bi bi-clock-history"></i> Recent Activity</h5>
                            <div class="list-group list-group-flush">
                                <a href="#" class="list-group-item list-group-item-action">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">New Student Registration</h6>
                                        <small class="text-muted">2 hours ago</small>
                                    </div>
                                    <p class="mb-1 small text-muted">John Doe registered for Computer Science</p>
                                </a>
                                <a href="#" class="list-group-item list-group-item-action">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">Attendance Updated</h6>
                                        <small class="text-muted">5 hours ago</small>
                                    </div>
                                    <p class="mb-1 small text-muted">Class 10-A attendance marked for today</p>
                                </a>
                                <a href="#" class="list-group-item list-group-item-action">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">New Assignment Posted</h6>
                                        <small class="text-muted">1 day ago</small>
                                    </div>
                                    <p class="mb-1 small text-muted">Mathematics assignment posted for Grade 12</p>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card-custom">
                            <h5><i class="bi bi-lightning-fill"></i> Quick Actions</h5>
                            <div class="d-grid gap-2">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students.jsp" class="btn btn-outline-primary">
                                    <i class="bi bi-person-plus"></i> Add Student
                                </a>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/teachers.jsp" class="btn btn-outline-success">
                                    <i class="bi bi-person-badge"></i> Add Teacher
                                </a>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/attendance.jsp" class="btn btn-outline-info">
                                    <i class="bi bi-calendar-check"></i> Mark Attendance
                                </a>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/courses.jsp" class="btn btn-outline-warning">
                                    <i class="bi bi-book"></i> Manage Courses
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
