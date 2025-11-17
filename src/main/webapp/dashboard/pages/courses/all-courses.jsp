<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="All Courses - Dashboard - EduHub"/>
        <jsp:param name="description" value="View all courses in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/all-courses.css?v=2.0">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-courses"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="All Courses"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>All Courses</h2>
                        <p class="text-muted">View and manage all available courses</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="btn btn-primary">
                                <i class="bi bi-plus-circle"></i> Add New Course
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="bi bi-journal-text"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalCourses">0</h4>
                            <p>Total Courses</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="activeCourses">0</h4>
                            <p>Active Courses</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon students">
                            <i class="bi bi-people-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalStudents">0</h4>
                            <p>Total Students</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon teachers">
                            <i class="bi bi-person-badge-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalTeachers">0</h4>
                            <p>Total Teachers</p>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">Search Courses</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput"
                                        placeholder="Search by name, code, or teacher...">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Category</label>
                                <select class="form-select" id="categoryFilter">
                                    <option value="all">All Categories</option>
                                    <option value="science">Science</option>
                                    <option value="technology">Technology</option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="arts">Arts</option>
                                    <option value="commerce">Commerce</option>
                                    <option value="language">Language</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Level</label>
                                <select class="form-select" id="levelFilter">
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                                    id="resetFilters" type="button" aria-label="Reset filters">
                                    <i class="bi bi-arrow-clockwise me-2"></i>
                                    <span>Reset Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Courses Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Show when no data -->
                        <div id="emptyState" class="empty-state-container">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-journal-plus"></i>
                                </div>
                                <h4 class="empty-state-title">No Courses Yet</h4>
                                <p class="empty-state-text">Get started by adding your first course to the system</p>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="btn btn-primary mt-3">
                                    <i class="bi bi-plus-circle"></i> Add First Course
                                </a>
                            </div>
                        </div>
                        
                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="coursesTableContainer" style="display: none;">
                            <table class="table table-hover mb-0" id="coursesTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAllCourses" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Category</th>
                                        <th>Level</th>
                                        <th>Duration</th>
                                        <th>Max Students</th>
                                        <th>Fee</th>
                                        <th>Mode</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Teacher</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="coursesTableBody">
                                    <!-- Course rows will be dynamically added here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer - Show only when data exists -->
                    <div class="card-footer" id="paginationFooter" style="display: none;">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3 flex-wrap">
                                <div class="entries-info">
                                    Showing <span id="showingStart">0</span> to <span id="showingEnd">0</span> of <span id="totalEntries">0</span> entries
                                </div>
                                <div class="entries-selector-wrapper">
                                    <label>Show</label>
                                    <select class="form-select" id="itemsPerPage">
                                        <option value="10" selected>10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <nav>
                                <ul class="pagination mb-0" id="paginationContainer">
                                    <!-- Pagination buttons will be generated by JavaScript -->
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/all-courses.js"></script>
</body>
</html>
