<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="com.eduhub.dao.interfaces.BatchDAO" %>
<%@ page import="com.eduhub.dao.impl.BatchDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.CourseDAO" %>
<%@ page import="com.eduhub.dao.impl.CourseDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO" %>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.BranchDAO" %>
<%@ page import="com.eduhub.dao.impl.BranchDAOImpl" %>
<%@ page import="com.eduhub.model.Batch" %>
<%@ page import="com.eduhub.model.Course" %>
<%@ page import="com.eduhub.model.Staff" %>
<%@ page import="com.eduhub.model.Branch" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%
    String instituteId = (String) session.getAttribute("instituteId");
    if (instituteId == null) {
        response.sendRedirect(request.getContextPath() + "/public/login.jsp");
        return;
    }

    BatchDAO batchDAO = new BatchDAOImpl();
    CourseDAO courseDAO = new CourseDAOImpl();
    StaffDAO staffDAO = new StaffDAOImpl();
    BranchDAO branchDAO = new BranchDAOImpl();

    // Fetch auxiliary data for name mapping and dropdowns
    List<Course> courses = courseDAO.getAllCourses(instituteId);
    Map<String, String> courseMap = new HashMap<>();
    for(Course c : courses) courseMap.put(c.getCourseId(), c.getCourseName());

    List<Branch> branchesList = branchDAO.getAllBranches(instituteId);
    Map<String, String> branchMap = new HashMap<>();
    for(Branch b : branchesList) branchMap.put(b.getBranchId(), b.getBranchName());

    List<Staff> trainers = staffDAO.getStaffByDepartment(instituteId, "Trainer");
    Map<String, String> trainerMap = new HashMap<>();
    for(Staff s : trainers) trainerMap.put(s.getStaffId(), s.getFirstName() + " " + s.getLastName());
    
    // Calculate stats (initial load)
    List<Batch> allBatches = batchDAO.getAllBatches(instituteId);
    int totalBatches = allBatches.size();
    int activeBatches = 0;
    int upcomingBatches = 0;
    int completedBatches = 0;
    
    for(Batch b : allBatches) {
        if("Active".equalsIgnoreCase(b.getStatus())) activeBatches++;
        else if("Upcoming".equalsIgnoreCase(b.getStatus())) upcomingBatches++;
        else if("Completed".equalsIgnoreCase(b.getStatus())) completedBatches++;
    }

    // Manual JSON serialization for maps to pass to JS
    StringBuilder courseMapJson = new StringBuilder("{");
    for(Map.Entry<String, String> entry : courseMap.entrySet()) {
        courseMapJson.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue().replace("\"", "\\\"")).append("\",");
    }
    if(courseMapJson.length() > 1) courseMapJson.setLength(courseMapJson.length() - 1);
    courseMapJson.append("}");

    StringBuilder branchMapJson = new StringBuilder("{");
    for(Map.Entry<String, String> entry : branchMap.entrySet()) {
        branchMapJson.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue().replace("\"", "\\\"")).append("\",");
    }
    if(branchMapJson.length() > 1) branchMapJson.setLength(branchMapJson.length() - 1);
    branchMapJson.append("}");

    StringBuilder trainerMapJson = new StringBuilder("{");
    for(Map.Entry<String, String> entry : trainerMap.entrySet()) {
        trainerMapJson.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue().replace("\"", "\\\"")).append("\",");
    }
    if(trainerMapJson.length() > 1) trainerMapJson.setLength(trainerMapJson.length() - 1);
    trainerMapJson.append("}");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Manage Batches - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage course batches in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/manage-batches.css?v=1.0">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
        var courseMap = <%= courseMapJson.toString() %>;
        var branchMap = <%= branchMapJson.toString() %>;
        var trainerMap = <%= trainerMapJson.toString() %>;
    </script>
    <style>
        /* Custom styles for the wide table */
        .table-responsive {
            overflow-x: auto;
        }
        #batchesTable th, #batchesTable td {
            white-space: nowrap;
            vertical-align: middle;
        }
        .col-min-width {
            min-width: 150px;
            max-width: 200px;
        }
        .col-small {
            min-width: 100px;
        }
        .text-truncate-custom {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 180px;
            display: inline-block;
            vertical-align: middle;
        }
        .day-badge {
            font-size: 0.7rem;
            padding: 4px 8px;
            background-color: rgba(99, 102, 241, 0.1);
            color: var(--primary-color);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 6px;
            display: inline-block;
            font-weight: 600;
            letter-spacing: 0.02em;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="manage-batches"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Manage Batches"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Manage Batches</h2>
                        <p class="text-muted">View and manage all course batches</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger shadow-sm" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="btn btn-primary shadow-sm">
                                <i class="bi bi-plus-circle"></i> Create New Batch
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="bi bi-layers"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalBatches"><%= totalBatches %></h4>
                            <p>Total Batches</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="bi bi-play-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="activeBatches"><%= activeBatches %></h4>
                            <p>Active Batches</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon students">
                            <i class="bi bi-calendar-event"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="upcomingBatches"><%= upcomingBatches %></h4>
                            <p>Upcoming</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon teachers">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="completedBatches"><%= completedBatches %></h4>
                            <p>Completed</p>
                        </div>
                    </div>
                </div>
                
                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-3">
                                <label class="form-label">Search Batches</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchBatch"
                                        placeholder="Search by name, code...">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Course</label>
                                <select class="form-select" id="courseFilter">
                                    <option value="all">All Courses</option>
                                    <% for(Course c : courses) { %>
                                        <option value="<%= c.getCourseId() %>"><%= c.getCourseName() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Branch</label>
                                <select class="form-select" id="branchFilter">
                                    <option value="all">All Branches</option>
                                    <% for(Branch b : branchesList) { %>
                                        <option value="<%= b.getBranchId() %>"><%= b.getBranchName() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="all">All Status</option>
                                    <% for(String status : DropdownData.BATCH_STATUSES) { %>
                                        <option value="<%= status %>"><%= status %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-3">
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
                
                <!-- Batches Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Hidden by default, shown by JS if needed -->
                        <div id="emptyState" class="empty-state-container" style="display: none;">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-inbox"></i>
                                </div>
                                <h4 class="empty-state-title">No Batches Found</h4>
                                <p class="empty-state-text">Try adjusting your filters or create a new batch</p>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="btn btn-primary mt-3">
                                    <i class="bi bi-plus-circle"></i> Create New Batch
                                </a>
                            </div>
                        </div>

                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="batchesTableContainer">
                            <table class="table table-hover mb-0" id="batchesTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAllBatches" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Batch Code</th>
                                        <th class="col-min-width">Batch Name</th>
                                        <th class="col-min-width">Course</th>
                                        <th class="col-min-width">Branch</th>
                                        <th class="col-min-width">Instructor</th>
                                        <th class="col-small">Start Date</th>
                                        <th class="col-small">End Date</th>
                                        <th class="col-small">Start Time</th>
                                        <th class="col-small">End Time</th>
                                        <th>Capacity</th>
                                        <th class="col-min-width">Class Days</th>
                                        <th>Mode</th>
                                        <th>Status</th>
                                        <th class="col-min-width">Location</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="batchesTableBody">
                                    <!-- Rows will be populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div class="card-footer py-3 bg-white" id="paginationFooter">
                        <div class="row align-items-center gy-3">
                            <div class="col-sm-12 col-md-5">
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 text-muted small">
                                    <span>Show</span>
                                    <select class="form-select form-select-sm w-auto border-light bg-light" id="itemsPerPage" style="min-width: 70px;">
                                        <option value="10" selected>10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <span>entries</span>
                                    <div class="vr mx-2"></div>
                                    <span class="entries-info">
                                        Showing <span id="showingStart" class="fw-bold text-dark">0</span> - <span id="showingEnd" class="fw-bold text-dark">0</span> of <span id="totalEntries" class="fw-bold text-dark">0</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-7">
                                <div id="paginationContainer" class="d-flex justify-content-center justify-content-md-end">
                                    <!-- Pagination buttons will be generated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Modal Component -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    
    <!-- Include Toast Notification Component -->
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/manage-batches.js"></script>
</body>
</html>
