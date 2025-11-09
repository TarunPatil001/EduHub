<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
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
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>All Courses</h2>
                            <p class="text-muted">View and manage all available courses</p>
                        </div>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-course.jsp" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Add New Course
                        </a>
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

                <!-- Search and Filter -->
                <div class="controls-section">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" id="searchInput" placeholder="Search courses by name, code, or teacher...">
                    </div>
                    <div class="filter-group">
                        <select id="categoryFilter" class="filter-select">
                            <option value="all">All Categories</option>
                            <option value="science">Science</option>
                            <option value="technology">Technology</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="arts">Arts</option>
                            <option value="commerce">Commerce</option>
                            <option value="language">Language</option>
                        </select>
                        <select id="levelFilter" class="filter-select">
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <select id="statusFilter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button id="resetFilters" class="btn-reset" title="Reset all filters">
                            <i class="bi bi-arrow-clockwise"></i> Reset
                        </button>
                    </div>
                </div>

                <!-- Courses Table -->
                <div class="table-wrapper">
                    <table class="courses-table">
                        <colgroup>
                            <col style="min-width: 120px;"><!-- Course Code -->
                            <col style="min-width: 200px;"><!-- Course Name -->
                            <col style="min-width: 120px;"><!-- Category -->
                            <col style="min-width: 110px;"><!-- Level -->
                            <col style="min-width: 100px;"><!-- Duration -->
                            <col style="min-width: 120px;"><!-- Max Students -->
                            <col style="min-width: 90px;"><!-- Fee -->
                            <col style="min-width: 100px;"><!-- Mode -->
                            <col style="min-width: 120px;"><!-- Start Date -->
                            <col style="min-width: 120px;"><!-- End Date -->
                            <col style="min-width: 180px;"><!-- Teacher -->
                            <col style="min-width: 90px;"><!-- Status -->
                            <col style="min-width: 130px;"><!-- Actions -->
                        </colgroup>
                        <thead>
                            <tr>
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
                            <tr class="empty-state">
                                <td colspan="13">
                                    <div class="empty-content">
                                        <i class="bi bi-inbox"></i>
                                        <p>No courses found</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        <div class="items-per-page">
                            <label for="itemsPerPage">Show:</label>
                            <select id="itemsPerPage" class="form-control-sm">
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <div class="page-info" id="pageInfo"></div>
                    </div>
                    <div id="paginationContainer"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/all-courses.js"></script>
</body>
</html>
