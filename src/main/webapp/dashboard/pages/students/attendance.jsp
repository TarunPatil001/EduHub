<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Student Attendance - EduHub"/>
        <jsp:param name="description" value="Fast and efficient attendance marking system"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/attendance.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="student-attendance"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Student Attendance"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="attendance-header">
                    <div class="header-content">
                        <div class="header-left">
                            <h2 class="page-title">
                                <i class="bi bi-calendar-check-fill"></i>
                                Student Attendance
                            </h2>
                            <p class="page-subtitle">Mark attendance for entire class in seconds</p>
                        </div>
                        <div class="header-right">
                            <button id="saveBtn" class="btn btn-primary btn-lg">
                                <i class="bi bi-save"></i> Save Attendance
                            </button>
                            <button id="exportBtn" class="btn btn-outline-secondary btn-lg">
                                <i class="bi bi-download"></i> Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Controls -->
                <div class="attendance-controls">
                    <div class="control-row">
                        <div class="control-group">
                            <label class="control-label">Class / Section</label>
                            <select id="classSelect" class="form-control">
                                <option value="">Select Class</option>
                                <option value="class-10a">Class 10-A</option>
                                <option value="class-10b">Class 10-B</option>
                                <option value="class-11a">Class 11-A</option>
                                <option value="class-11b">Class 11-B</option>
                                <option value="class-12a">Class 12-A</option>
                                <option value="class-12b">Class 12-B</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Date</label>
                            <input type="date" id="dateInput" class="form-control">
                        </div>
                        <div class="control-group">
                            <label class="control-label">Search Students</label>
                            <input type="text" id="searchInput" class="form-control" placeholder="Search by name or roll...">
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="attendance-actions">
                    <div class="action-buttons">
                        <button id="markAllPresentBtn" class="btn btn-success">
                            <i class="bi bi-check-all"></i> All Present
                        </button>
                        <button id="markAllAbsentBtn" class="btn btn-danger">
                            <i class="bi bi-x-circle"></i> All Absent
                        </button>
                        <button id="markSelectedAbsentBtn" class="btn btn-warning">
                            <i class="bi bi-person-x"></i> Selected Absent, Others Present
                        </button>
                        <button id="markSelectedPresentBtn" class="btn btn-info">
                            <i class="bi bi-person-check"></i> Selected Present, Others Absent
                        </button>
                        <button id="resetBtn" class="btn btn-secondary">
                            <i class="bi bi-arrow-counterclockwise"></i> Reset
                        </button>
                    </div>
                    <div class="attendance-stats">
                        <span class="stat-badge stat-present">
                            <i class="bi bi-check-circle-fill"></i> Present: <strong id="presentCount">0</strong>
                        </span>
                        <span class="stat-badge stat-absent">
                            <i class="bi bi-x-circle-fill"></i> Absent: <strong id="absentCount">0</strong>
                        </span>
                        <span class="stat-badge stat-total">
                            <i class="bi bi-people-fill"></i> Total: <strong id="totalCount">0</strong>
                        </span>
                    </div>
                </div>

                <!-- Attendance Table -->
                <div class="attendance-table-wrapper">
                    <table class="attendance-table" id="attendanceTable">
                        <thead>
                            <tr>
                                <th class="col-checkbox">
                                    <input type="checkbox" id="selectAll" class="checkbox-input">
                                </th>
                                <th class="col-roll">Roll No</th>
                                <th class="col-name">Student Name</th>
                                <th class="col-status">Status</th>
                                <th class="col-action">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody id="studentTableBody">
                            <tr class="empty-state">
                                <td colspan="5">
                                    <div class="empty-content">
                                        <i class="bi bi-inbox"></i>
                                        <p>Select a class to view students</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Controls -->
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        <div class="items-per-page">
                            <label for="itemsPerPage">Show:</label>
                            <select id="itemsPerPage" class="form-control form-control-sm">
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <div class="page-info" id="pageInfo"></div>
                    </div>
                    <div id="paginationContainer"></div>
                </div>

                <!-- Help Info -->
                <div class="help-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Quick Guide:</strong> Select students by clicking checkboxes, then use action buttons. 
                    Example: Select 3 absent students → Click "Selected Absent, Others Present" → Done in seconds!
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/attendance.js"></script>
</body>
</html>
