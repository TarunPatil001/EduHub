<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Security Check - Prevent unauthorized access
    if (session == null || session.getAttribute("userId") == null) {
        // User is not logged in, redirect to login page
        response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=unauthorized");
        return;
    }
    
    // Get user information from session
    Integer userId = (Integer) session.getAttribute("userId");
    String userName = (String) session.getAttribute("userName");
    String userEmail = (String) session.getAttribute("userEmail");
    String userRole = (String) session.getAttribute("userRole");
    Integer instituteId = (Integer) session.getAttribute("instituteId");
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
                            <jsp:param name="title" value="Total Students"/>
                            <jsp:param name="value" value="1,234"/>
                            <jsp:param name="icon" value="bi-people-fill"/>
                            <jsp:param name="color" value="primary"/>
                            <jsp:param name="change" value="12.5"/>
                        </jsp:include>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <jsp:include page="/dashboard/components/stats-card.jsp">
                            <jsp:param name="title" value="Total Staff"/>
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
                            <jsp:param name="title" value="Today's Attendance"/>
                            <jsp:param name="value" value="94.2%"/>
                            <jsp:param name="icon" value="bi-calendar-check-fill"/>
                            <jsp:param name="color" value="info"/>
                            <jsp:param name="change" value="2.3"/>
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
                            <h6 class="text-muted mb-1">Pending Fees</h6>
                            <h3 class="mb-0">₹2,45,000</h3>
                            <small class="text-muted">From 156 students</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-success bg-opacity-10 text-success mb-2">
                                <i class="bi bi-cash-stack fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Revenue (This Month)</h6>
                            <h3 class="mb-0">₹8,95,000</h3>
                            <small class="text-success">+15% from last month</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-primary bg-opacity-10 text-primary mb-2">
                                <i class="bi bi-clipboard-check fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Active Batches</h6>
                            <h3 class="mb-0">28</h3>
                            <small class="text-muted">Across all courses</small>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-warning bg-opacity-10 text-warning mb-2">
                                <i class="bi bi-trophy-fill fs-3"></i>
                            </div>
                            <h6 class="text-muted mb-1">Placements (This Year)</h6>
                            <h3 class="mb-0">342</h3>
                            <small class="text-success">87% placement rate</small>
                        </div>
                    </div>
                </div>
                
                <!-- Alerts & Critical Information -->
                <div class="row g-3 mb-4">
                    <div class="col-12">
                        <div class="card-custom bg-warning bg-opacity-10 border-warning">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-bell-fill text-warning fs-3 me-3"></i>
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">⚠️ Important Alerts</h6>
                                    <div class="d-flex flex-wrap gap-3">
                                        <span class="badge bg-danger">12 Students - Low Attendance (<75%)</span>
                                        <span class="badge bg-warning text-dark">5 Pending ID Certificate Requests</span>
                                        <span class="badge bg-info">3 Staff Payroll Due Tomorrow</span>
                                        <span class="badge bg-primary">8 Performance Reports Pending Review</span>
                                    </div>
                                </div>
                            </div>
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
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-person-plus-fill text-primary me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">New Student Registration</h6>
                                                <p class="mb-1 small text-muted">Rahul Sharma enrolled in Full Stack Development</p>
                                            </div>
                                        </div>
                                        <small class="text-muted">2h ago</small>
                                    </div>
                                </div>
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-cash-coin text-success me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">Fee Payment Received</h6>
                                                <p class="mb-1 small text-muted">₹45,000 received from Batch CS-2024-A</p>
                                            </div>
                                        </div>
                                        <small class="text-muted">3h ago</small>
                                    </div>
                                </div>
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-calendar-check text-info me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">Attendance Marked</h6>
                                                <p class="mb-1 small text-muted">Batch DS-2024-B - 28/30 students present</p>
                                            </div>
                                        </div>
                                        <small class="text-muted">4h ago</small>
                                    </div>
                                </div>
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-file-earmark-text text-warning me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">ID Certificate Generated</h6>
                                                <p class="mb-1 small text-muted">Student ID card issued for Priya Patel</p>
                                            </div>
                                        </div>
                                        <small class="text-muted">5h ago</small>
                                    </div>
                                </div>
                                <div class="list-group-item">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            <i class="bi bi-person-badge text-success me-2 fs-5"></i>
                                            <div>
                                                <h6 class="mb-1">New Staff Added</h6>
                                                <p class="mb-1 small text-muted">Dr. Amit Kumar joined as Senior Faculty</p>
                                            </div>
                                        </div>
                                        <small class="text-muted">1d ago</small>
                                    </div>
                                </div>
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
                        
                        <!-- Upcoming Events -->
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-calendar-event"></i> Upcoming Events & Deadlines</h5>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-marker bg-danger"></div>
                                    <div class="timeline-content">
                                        <h6 class="mb-1">Fee Payment Deadline</h6>
                                        <p class="small text-muted mb-1">Q4 fees due for 156 students</p>
                                        <small class="text-danger fw-bold">Tomorrow</small>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-marker bg-warning"></div>
                                    <div class="timeline-content">
                                        <h6 class="mb-1">Staff Payroll Processing</h6>
                                        <p class="small text-muted mb-1">Monthly salary disbursement</p>
                                        <small class="text-warning fw-bold">Nov 15, 2025</small>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-marker bg-primary"></div>
                                    <div class="timeline-content">
                                        <h6 class="mb-1">Batch Completion</h6>
                                        <p class="small text-muted mb-1">Web Development Batch WD-2024-A</p>
                                        <small class="text-primary fw-bold">Nov 20, 2025</small>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-marker bg-success"></div>
                                    <div class="timeline-content">
                                        <h6 class="mb-1">Placement Drive</h6>
                                        <p class="small text-muted mb-1">Campus recruitment - TCS & Infosys</p>
                                        <small class="text-success fw-bold">Nov 25, 2025</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts & Analytics Section -->
                <div class="row g-3 mb-4">
                    <!-- Attendance Trends -->
                    <div class="col-lg-8">
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-graph-up"></i> Attendance Trends (Last 7 Days)</h5>
                            <canvas id="attendanceChart" height="80"></canvas>
                        </div>
                    </div>
                    
                    <!-- Course Distribution -->
                    <div class="col-lg-4">
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-pie-chart-fill"></i> Student Distribution by Course</h5>
                            <canvas id="courseDistributionChart"></canvas>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small">Full Stack Development</span>
                                    <span class="small fw-bold">425 (34%)</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small">Data Science</span>
                                    <span class="small fw-bold">320 (26%)</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small">Digital Marketing</span>
                                    <span class="small fw-bold">289 (23%)</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="small">Others</span>
                                    <span class="small fw-bold">200 (17%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom Section - Performance & Financial Overview -->
                <div class="row g-3 mb-4">
                    <!-- Top Performing Students -->
                    <div class="col-lg-4">
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-star-fill text-warning"></i> Top Performing Students</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-warning rounded-circle me-2">1</span>
                                        <div>
                                            <h6 class="mb-0">Ananya Reddy</h6>
                                            <small class="text-muted">Full Stack Development</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success">98.5%</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-secondary rounded-circle me-2">2</span>
                                        <div>
                                            <h6 class="mb-0">Vikram Singh</h6>
                                            <small class="text-muted">Data Science</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success">97.2%</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-secondary rounded-circle me-2">3</span>
                                        <div>
                                            <h6 class="mb-0">Sneha Kapoor</h6>
                                            <small class="text-muted">Full Stack Development</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success">96.8%</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-secondary rounded-circle me-2">4</span>
                                        <div>
                                            <h6 class="mb-0">Arjun Mehta</h6>
                                            <small class="text-muted">Digital Marketing</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success">95.5%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fee Collection Status -->
                    <div class="col-lg-4">
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-wallet2"></i> Fee Collection Status</h5>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="small">Total Expected</span>
                                    <span class="small fw-bold">₹12,50,000</span>
                                </div>
                                <div class="progress" style="height: 25px;">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 80%">80% Collected</div>
                                </div>
                                <div class="d-flex justify-content-between mt-1">
                                    <span class="small text-success">Collected: ₹10,05,000</span>
                                    <span class="small text-danger">Pending: ₹2,45,000</span>
                                </div>
                            </div>
                            <hr>
                            <div class="mb-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="small">Full Stack Development</span>
                                    <div>
                                        <small class="text-muted me-2">85%</small>
                                        <i class="bi bi-check-circle-fill text-success"></i>
                                    </div>
                                </div>
                                <div class="progress mt-1" style="height: 5px;">
                                    <div class="progress-bar bg-success" style="width: 85%"></div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="small">Data Science</span>
                                    <div>
                                        <small class="text-muted me-2">78%</small>
                                        <i class="bi bi-exclamation-circle-fill text-warning"></i>
                                    </div>
                                </div>
                                <div class="progress mt-1" style="height: 5px;">
                                    <div class="progress-bar bg-warning" style="width: 78%"></div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="small">Digital Marketing</span>
                                    <div>
                                        <small class="text-muted me-2">72%</small>
                                        <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                                    </div>
                                </div>
                                <div class="progress mt-1" style="height: 5px;">
                                    <div class="progress-bar bg-danger" style="width: 72%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Low Attendance Alerts -->
                    <div class="col-lg-4">
                        <div class="card-custom">
                            <h5 class="mb-3"><i class="bi bi-exclamation-triangle-fill text-danger"></i> Students Requiring Attention</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">Rohit Kumar</h6>
                                            <small class="text-muted">CS-2024-B</small>
                                        </div>
                                        <span class="badge bg-danger">65% Attendance</span>
                                    </div>
                                </div>
                                <div class="list-group-item px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">Meera Joshi</h6>
                                            <small class="text-muted">DS-2024-A</small>
                                        </div>
                                        <span class="badge bg-danger">58% Attendance</span>
                                    </div>
                                </div>
                                <div class="list-group-item px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">Karan Malhotra</h6>
                                            <small class="text-muted">DM-2024-C</small>
                                        </div>
                                        <span class="badge bg-warning text-dark">72% Attendance</span>
                                    </div>
                                </div>
                                <div class="list-group-item px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">Pooja Sharma</h6>
                                            <small class="text-muted">WD-2024-A</small>
                                        </div>
                                        <span class="badge bg-warning text-dark">74% Attendance</span>
                                    </div>
                                </div>
                            </div>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/reports/attendance-reports.jsp" class="btn btn-sm btn-outline-danger w-100 mt-2">
                                View Detailed Report
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    
    <!-- Toast Notification Component -->
    <!-- Centralized Toast Notification Component -->
    <jsp:include page="/common/toast-notification.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
