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
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="performanceTable">
                                <thead class="table-light">
                                    <tr>
                                        <th>Roll No</th>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Batch</th>
                                        <th>Attendance</th>
                                        <th>Machine Test</th>
                                        <th>Viva</th>
                                        <th>Final Score</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="performanceTableBody">
                                    <!-- Table rows will be dynamically generated by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Table Footer with Pagination -->
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3 flex-wrap">
                                <div class="entries-info">
                                    Showing <span id="showingStart">1</span> to <span id="showingEnd">10</span> of <span id="totalEntries">12</span> entries
                                </div>
                                <div class="entries-selector-wrapper">
                                    <label for="itemsPerPage">Show:</label>
                                    <select class="form-select form-select-sm" id="itemsPerPage">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <nav>
                                <ul class="pagination mb-0" id="pagination">
                                    <li class="page-item disabled">
                                        <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
                                    </li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item">
                                        <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Student Performance Details Modal - Simplified -->
    <div class="modal fade" id="studentDetailsModal" tabindex="-1" aria-labelledby="studentDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="studentDetailsModalLabel">
                        <i class="bi bi-person-circle me-2"></i>
                        Student Performance Details
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Student Info Header -->
                    <div class="row mb-4">
                        <div class="col-md-8">
                            <div class="d-flex align-items-center gap-3">
                                <div class="student-avatar-large" id="modalStudentAvatar">JD</div>
                                <div>
                                    <h5 class="mb-1" id="modalStudentName">John Doe</h5>
                                    <div class="text-muted small">
                                        <span class="me-3"><i class="bi bi-hash"></i> <span id="modalStudentRoll">STD001</span></span>
                                        <span><i class="bi bi-book"></i> <span id="modalCourseName">Computer Science</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                            <div class="simple-grade-card">
                                <div class="text-muted small">Overall Grade</div>
                                <h2 class="mb-0" id="modalOverallGrade">A</h2>
                                <div class="text-muted" id="modalOverallPercentage">88.5%</div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Stats -->
                    <div class="row g-3 mb-4">
                        <div class="col-6 col-md-3">
                            <div class="simple-stat-box">
                                <i class="bi bi-calendar-check text-primary mb-2"></i>
                                <div class="fw-bold" id="modalAttendance">95%</div>
                                <small class="text-muted">Attendance</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="simple-stat-box">
                                <i class="bi bi-laptop text-success mb-2"></i>
                                <div class="fw-bold" id="modalMachineTest">45/50</div>
                                <small class="text-muted">Machine Test</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="simple-stat-box">
                                <i class="bi bi-mic text-warning mb-2"></i>
                                <div class="fw-bold" id="modalViva">85/100</div>
                                <small class="text-muted">Viva</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="simple-stat-box">
                                <i class="bi bi-trophy text-info mb-2"></i>
                                <div class="fw-bold" id="modalRank">#3</div>
                                <small class="text-muted">Class Rank</small>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Details -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-title mb-3">Performance Breakdown</h6>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Machine Test</span>
                                    <strong id="modalMachineTestPercent">90%</strong>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-success" id="modalMachineTestBar" role="progressbar" style="width: 90%"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Viva</span>
                                    <strong id="modalVivaPercent">85%</strong>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-info" id="modalVivaBar" role="progressbar" style="width: 85%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Overall Performance</span>
                                    <strong id="modalOverallPercent">88.5%</strong>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-primary" id="modalOverallBar" role="progressbar" style="width: 88.5%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title mb-3">Course Information</h6>
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr>
                                            <td class="text-muted">Batch:</td>
                                            <td id="modalStudentBatch">2024-25</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status:</td>
                                            <td><span class="badge bg-success" id="modalStudentStatus">Active</span></td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Enrolled:</td>
                                            <td id="modalEnrollDate">Jan 15, 2024</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title mb-3">Performance Summary</h6>
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr>
                                            <td class="text-muted">Final Score:</td>
                                            <td><strong id="modalFinalScore">88.5%</strong></td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Grade:</td>
                                            <td><span class="badge bg-primary" id="modalGradeBadge">A</span></td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Result:</td>
                                            <td><span class="badge bg-success" id="modalResultStatus">Pass</span></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/performance-reports.js"></script>
    
    <!-- Include Toast and Modal Components -->
    <jsp:include page="/components/toast-dependencies.jsp"/>
    <jsp:include page="/dashboard/components/modal.jsp"/>
</body>
</html>
