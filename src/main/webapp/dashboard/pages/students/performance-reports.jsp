<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Performance Reports - Dashboard - EduHub"/>
        <jsp:param name="description" value="View student performance reports in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/performance-reports.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="performance-reports"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Performance Reports"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>Student Performance Reports</h2>
                        <p class="text-muted">View and analyze comprehensive student performance data</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary" onclick="printReport()">
                            <i class="bi bi-printer"></i> Print
                        </button>
                        <button class="btn btn-success">
                            <i class="bi bi-download"></i> Export
                        </button>
                    </div>
                </div>

                <!-- Performance Overview Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-primary-subtle">
                                <i class="bi bi-people-fill text-primary"></i>
                            </div>
                            <h3 class="mb-1">156</h3>
                            <p class="text-muted mb-0">Total Students</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-success-subtle">
                                <i class="bi bi-trophy-fill text-success"></i>
                            </div>
                            <h3 class="mb-1">78.5%</h3>
                            <p class="text-muted mb-0">Average Score</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-warning-subtle">
                                <i class="bi bi-star-fill text-warning"></i>
                            </div>
                            <h3 class="mb-1">23</h3>
                            <p class="text-muted mb-0">Top Performers</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card-custom text-center">
                            <div class="stat-icon bg-danger-subtle">
                                <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                            </div>
                            <h3 class="mb-1">12</h3>
                            <p class="text-muted mb-0">Need Attention</p>
                        </div>
                    </div>
                </div>

                <!-- Filters & Search Card -->
                <div class="card-custom mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0"><i class="bi bi-funnel-fill"></i> Filter & Search</h5>
                        <button class="btn btn-sm btn-outline-secondary" id="resetFiltersBtn" onclick="resetFilters()" style="display: none;">
                            <i class="bi bi-arrow-clockwise"></i> Reset
                        </button>
                    </div>
                    
                    <!-- Search Box -->
                    <div class="mb-3">
                        <label class="form-label">Search Students</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input type="text" class="form-control" id="searchInput" placeholder="Search by name, roll number, or course...">
                        </div>
                    </div>
                    
                    <!-- Filter Dropdowns -->
                    <div class="row g-3">
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label">Course</label>
                            <select class="form-select" id="filterCourse">
                                <option value="">All Courses</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label">Batch</label>
                            <select class="form-select" id="filterBatch">
                                <option value="">All Batches</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label">Grade</label>
                            <select class="form-select" id="filterGrade">
                                <option value="">All Grades</option>
                                <option value="A+">A+ (90-100%)</option>
                                <option value="A">A (80-89%)</option>
                                <option value="B">B (70-79%)</option>
                                <option value="C">C (60-69%)</option>
                                <option value="D">D (Below 60%)</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="filterStatus">
                                <option value="">All Status</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                                <option value="In Progress">In Progress</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Performance Table -->
                <div class="card-custom">
                    <h5 class="mb-3"><i class="bi bi-table"></i> Student Performance Details</h5>
                    
                    <div class="table-responsive">
                        <table class="table table-hover table-custom">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Batch</th>
                                    <th>Attendance</th>
                                    <th>Assignments</th>
                                    <th>Tests</th>
                                    <th>Final Score</th>
                                    <th>Grade</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>STD001</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-primary-subtle text-primary me-2">JD</div>
                                            <span>John Doe</span>
                                        </div>
                                    </td>
                                    <td>Web Development</td>
                                    <td>2024-25</td>
                                    <td><span class="badge bg-success">95%</span></td>
                                    <td><span class="badge bg-success">45/50</span></td>
                                    <td><span class="badge bg-success">38/40</span></td>
                                    <td><strong class="text-success">88.5%</strong></td>
                                    <td><span class="badge bg-primary">A</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD001')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>STD002</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-success-subtle text-success me-2">JS</div>
                                            <span>Jane Smith</span>
                                        </div>
                                    </td>
                                    <td>Data Science</td>
                                    <td>2024-25</td>
                                    <td><span class="badge bg-success">92%</span></td>
                                    <td><span class="badge bg-info">40/50</span></td>
                                    <td><span class="badge bg-info">32/40</span></td>
                                    <td><strong class="text-info">78.2%</strong></td>
                                    <td><span class="badge bg-info">B</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD002')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>STD003</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-warning-subtle text-warning me-2">MJ</div>
                                            <span>Mike Johnson</span>
                                        </div>
                                    </td>
                                    <td>Mobile Development</td>
                                    <td>2023-24</td>
                                    <td><span class="badge bg-warning">78%</span></td>
                                    <td><span class="badge bg-warning">35/50</span></td>
                                    <td><span class="badge bg-warning">28/40</span></td>
                                    <td><strong class="text-warning">68.5%</strong></td>
                                    <td><span class="badge bg-warning">C</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD003')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>STD004</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-info-subtle text-info me-2">SW</div>
                                            <span>Sarah Williams</span>
                                        </div>
                                    </td>
                                    <td>Web Development</td>
                                    <td>2024-25</td>
                                    <td><span class="badge bg-success">98%</span></td>
                                    <td><span class="badge bg-success">48/50</span></td>
                                    <td><span class="badge bg-success">39/40</span></td>
                                    <td><strong class="text-success">95.2%</strong></td>
                                    <td><span class="badge bg-primary">A+</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD004')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>STD005</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-danger-subtle text-danger me-2">DB</div>
                                            <span>David Brown</span>
                                        </div>
                                    </td>
                                    <td>Digital Marketing</td>
                                    <td>2023-24</td>
                                    <td><span class="badge bg-danger">62%</span></td>
                                    <td><span class="badge bg-danger">25/50</span></td>
                                    <td><span class="badge bg-danger">20/40</span></td>
                                    <td><strong class="text-danger">52.5%</strong></td>
                                    <td><span class="badge bg-danger">D</span></td>
                                    <td><span class="badge bg-danger">Fail</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD005')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>STD006</strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-success-subtle text-success me-2">ED</div>
                                            <span>Emily Davis</span>
                                        </div>
                                    </td>
                                    <td>Data Science</td>
                                    <td>2024-25</td>
                                    <td><span class="badge bg-success">90%</span></td>
                                    <td><span class="badge bg-success">43/50</span></td>
                                    <td><span class="badge bg-success">35/40</span></td>
                                    <td><strong class="text-success">85.3%</strong></td>
                                    <td><span class="badge bg-primary">A</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('STD006')" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-wrap gap-3">
                        <div class="d-flex align-items-center gap-3">
                            <span class="text-muted" id="recordInfo">Showing 1-6 of 156 students</span>
                            <div class="d-flex align-items-center gap-2">
                                <label class="mb-0 text-muted">Show:</label>
                                <select id="itemsPerPage" class="form-select form-select-sm" style="width: auto;">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1">
                                        <i class="bi bi-chevron-left"></i>
                                    </a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#">
                                        <i class="bi bi-chevron-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/performance-reports.js"></script>
    
    <!-- Include Toast and Modal Components -->
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    <jsp:include page="/dashboard/components/modal.jsp"/>
</body>
</html>
