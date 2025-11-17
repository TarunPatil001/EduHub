<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Performance Reports - Dashboard - EduHub"/>
        <jsp:param name="description" value="View student performance reports in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
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
                <div class="page-header d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2>Student Performance Reports</h2>
                        <p class="mb-0">View and analyze student performance data</p>
                    </div>
                    <button class="btn btn-success">
                        <i class="bi bi-download"></i> Export to CSV
                    </button>
                </div>

                <!-- Quick Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6 col-lg-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-people-fill text-primary" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">156</h3>
                                <p class="text-muted mb-0 small">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-trophy-fill text-success" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">78.5%</h3>
                                <p class="text-muted mb-0 small">Average Score</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-star-fill text-warning" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">23</h3>
                                <p class="text-muted mb-0 small">Top Performers</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">12</h3>
                                <p class="text-muted mb-0 small">Need Attention</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters Card -->
                <div class="card-custom mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0"><i class="bi bi-funnel"></i> Filter & Search</h5>
                        <button class="btn btn-outline-secondary btn-sm d-flex align-items-center" id="resetFiltersBtn" type="button" style="display: none;">
                            <i class="bi bi-arrow-clockwise me-2"></i>
                            <span>Reset Filters</span>
                        </button>
                    </div>
                    
                    <!-- Search Box -->
                    <div class="row g-3 mb-3">
                        <div class="col-12">
                            <label class="form-label fw-semibold">Search Students</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control" id="searchInput" placeholder="Search by name, roll number, or department...">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Filter Dropdowns -->
                    <div class="row g-3 align-items-end">
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label mb-1">Department</label>
                            <select class="form-select" id="filterDepartment">
                                <option value="">All Departments</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Civil">Civil</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label mb-1">Batch</label>
                            <select class="form-select" id="filterBatch">
                                <option value="">All Batches</option>
                                <option value="2024">2024-25</option>
                                <option value="2023">2023-24</option>
                                <option value="2022">2022-23</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label mb-1">Semester</label>
                            <select class="form-select" id="filterSemester">
                                <option value="">All Semesters</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                                <option value="3">Semester 3</option>
                                <option value="4">Semester 4</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <label class="form-label mb-1">Status</label>
                            <select class="form-select" id="filterStatus">
                                <option value="">All Status</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Performance Table -->
                <div class="card-custom">
                    <h5 class="mb-3">Student Performance</h5>
                    
                    <div class="table-responsive">
                        <table class="table table-custom">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>Semester</th>
                                    <th>Machine Test</th>
                                    <th>Viva</th>
                                    <th>Final Score</th>
                                    <th>Grade</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>CS001</td>
                                    <td>John Doe</td>
                                    <td>Computer Science</td>
                                    <td>3</td>
                                    <td><span class="badge bg-success">45/50</span></td>
                                    <td><span class="badge bg-success">18/20</span></td>
                                    <td><span class="badge bg-success">85.5%</span></td>
                                    <td><span class="badge bg-primary">A</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>EC002</td>
                                    <td>Jane Smith</td>
                                    <td>Electronics</td>
                                    <td>2</td>
                                    <td><span class="badge bg-info">40/50</span></td>
                                    <td><span class="badge bg-info">15/20</span></td>
                                    <td><span class="badge bg-info">78.2%</span></td>
                                    <td><span class="badge bg-info">B</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>ME003</td>
                                    <td>Mike Johnson</td>
                                    <td>Mechanical</td>
                                    <td>4</td>
                                    <td><span class="badge bg-warning">32/50</span></td>
                                    <td><span class="badge bg-warning">13/20</span></td>
                                    <td><span class="badge bg-warning">65.8%</span></td>
                                    <td><span class="badge bg-warning">C</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>CS004</td>
                                    <td>Sarah Williams</td>
                                    <td>Computer Science</td>
                                    <td>1</td>
                                    <td><span class="badge bg-success">48/50</span></td>
                                    <td><span class="badge bg-success">19/20</span></td>
                                    <td><span class="badge bg-success">92.0%</span></td>
                                    <td><span class="badge bg-primary">A+</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>CE005</td>
                                    <td>David Brown</td>
                                    <td>Civil</td>
                                    <td>3</td>
                                    <td><span class="badge bg-danger">20/50</span></td>
                                    <td><span class="badge bg-danger">9/20</span></td>
                                    <td><span class="badge bg-danger">45.5%</span></td>
                                    <td><span class="badge bg-danger">D</span></td>
                                    <td><span class="badge bg-danger">Fail</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>EC006</td>
                                    <td>Emily Davis</td>
                                    <td>Electronics</td>
                                    <td>2</td>
                                    <td><span class="badge bg-success">43/50</span></td>
                                    <td><span class="badge bg-success">17/20</span></td>
                                    <td><span class="badge bg-success">88.3%</span></td>
                                    <td><span class="badge bg-primary">A</span></td>
                                    <td><span class="badge bg-success">Pass</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <!-- Record info and items per page on the left -->
                        <div class="d-flex align-items-center gap-3 flex-wrap">
                            <span class="small text-muted" id="recordInfo">Showing 1-10 of 12 records</span>
                            <div class="d-flex align-items-center gap-2">
                                <label class="mb-0 small text-muted">Show:</label>
                                <select id="itemsPerPage" class="form-select form-select-sm">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Pagination on the right -->
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1">Previous</a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#">Next</a>
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
