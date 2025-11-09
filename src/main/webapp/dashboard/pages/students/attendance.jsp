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
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Student Attendance</h2>
                            <p class="text-muted">Mark attendance for entire class in seconds</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button id="saveBtn" class="btn btn-primary">
                                <i class="bi bi-save"></i> Save Attendance
                            </button>
                            <button id="exportBtn" class="btn btn-outline-secondary">
                                <i class="bi bi-download"></i> Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Controls -->
                <div class="card-custom mb-4">
                    <h5 class="mb-4"><i class="bi bi-funnel-fill"></i> Filter Options</h5>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="classSelect" class="form-label">Class / Section <span class="required-star">*</span></label>
                            <select id="classSelect" class="form-select">
                                <option value="">Select Class</option>
                                <option value="class-10a">Class 10-A</option>
                                <option value="class-10b">Class 10-B</option>
                                <option value="class-11a">Class 11-A</option>
                                <option value="class-11b">Class 11-B</option>
                                <option value="class-12a">Class 12-A</option>
                                <option value="class-12b">Class 12-B</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="dateInput" class="form-label">Date <span class="required-star">*</span></label>
                            <input type="date" id="dateInput" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label for="searchInput" class="form-label">Search Students</label>
                            <input type="text" id="searchInput" class="form-control" placeholder="Search by name or roll...">
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="card-custom mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div class="d-flex gap-2 flex-wrap">
                            <button id="markAllPresentBtn" class="btn btn-success btn-sm">
                                <i class="bi bi-check-all"></i> All Present
                            </button>
                            <button id="markAllAbsentBtn" class="btn btn-danger btn-sm">
                                <i class="bi bi-x-circle"></i> All Absent
                            </button>
                            <button id="markSelectedAbsentBtn" class="btn btn-warning btn-sm">
                                <i class="bi bi-person-x"></i> Selected Absent
                            </button>
                            <button id="markSelectedPresentBtn" class="btn btn-info btn-sm">
                                <i class="bi bi-person-check"></i> Selected Present
                            </button>
                            <button id="resetBtn" class="btn btn-secondary btn-sm">
                                <i class="bi bi-arrow-counterclockwise"></i> Reset
                            </button>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="badge bg-success fs-6">
                                <i class="bi bi-check-circle-fill"></i> Present: <strong id="presentCount">0</strong>
                            </span>
                            <span class="badge bg-danger fs-6">
                                <i class="bi bi-x-circle-fill"></i> Absent: <strong id="absentCount">0</strong>
                            </span>
                            <span class="badge bg-secondary fs-6">
                                <i class="bi bi-people-fill"></i> Total: <strong id="totalCount">0</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Attendance Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="attendanceTable">
                                <thead class="table-light" style="display: none;">
                                    <tr>
                                        <th style="width: 50px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAll" class="form-check-input">
                                            </div>
                                        </th>
                                        <th style="width: 100px;">Roll No</th>
                                        <th>Student Name</th>
                                        <th style="width: 180px;">Status</th>
                                        <th style="width: 150px;">Quick Action</th>
                                    </tr>
                                </thead>
                                <tbody id="studentTableBody">
                                    <tr class="empty-state-row">
                                        <td colspan="5" class="text-center py-5">
                                            <div class="empty-state">
                                                <div class="empty-state-icon">
                                                    <i class="bi bi-calendar-check"></i>
                                                </div>
                                                <h4 class="empty-state-title">No Class Selected</h4>
                                                <p class="empty-state-text">Please select a class and date to mark attendance</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div class="card-footer">
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
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/attendance.js"></script>
</body>
</html>
