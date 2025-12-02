<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%
    // We can fetch distinct cities/states here if needed, similar to courses
    // For now, we'll use static or empty lists and let JS populate if dynamic
    List<String> statusOptions = new ArrayList<>();
    statusOptions.add("Active");
    statusOptions.add("Inactive");
    statusOptions.add("Under Maintenance");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="All Branches - Dashboard - EduHub"/>
        <jsp:param name="description" value="View and manage all branches in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/branches/css/all-branches.css?v=1.0">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-branches"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="All Branches"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>All Branches</h2>
                        <p class="text-muted">View and manage all institute branches</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger shadow-sm" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/branches/create-branch.jsp" class="btn btn-primary shadow-sm">
                                <i class="bi bi-plus-circle"></i> Add New Branch
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="bi bi-building"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalBranches">0</h4>
                            <p>Total Branches</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="activeBranches">0</h4>
                            <p>Active Branches</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon students">
                            <i class="bi bi-people-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalStaff">0</h4>
                            <p>Total Staff</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon teachers">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="totalCities">0</h4>
                            <p>Cities Covered</p>
                        </div>
                    </div>
                </div>
                
                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">Search Branches</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput"
                                        placeholder="Search by name, code, or city...">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">City</label>
                                <select class="form-select" id="cityFilter">
                                    <option value="all">All Cities</option>
                                    <!-- Options populated by JS -->
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">State</label>
                                <select class="form-select" id="stateFilter">
                                    <option value="all">All States</option>
                                    <!-- Options populated by JS -->
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="all">All Status</option>
                                    <% for(String status : statusOptions) { %>
                                        <option value="<%= status %>"><%= status %></option>
                                    <% } %>
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
                
                <!-- Branches Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Show when no data -->
                        <div id="emptyState" class="empty-state-container">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-building-add"></i>
                                </div>
                                <h4 class="empty-state-title">No Branches Yet</h4>
                                <p class="empty-state-text">Get started by adding your first branch to the system</p>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/branches/create-branch.jsp" class="btn btn-primary mt-3">
                                    <i class="bi bi-plus-circle"></i> Add First Branch
                                </a>
                            </div>
                        </div>
                        
                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="branchesTableContainer" style="display: none;">
                            <table class="table table-hover mb-0" id="branchesTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAllBranches" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Branch Code</th>
                                        <th>Branch Name</th>
                                        <th>Manager</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="branchesTableBody">
                                    <!-- Branch rows will be dynamically added here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer - Show only when data exists -->
                    <div class="card-footer py-3 bg-white" id="paginationFooter" style="display: none;">
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
    <script src="${pageContext.request.contextPath}/dashboard/pages/branches/js/all-branches.js"></script>
    
    <%-- Toast Notification Logic --%>
    <%
        String statusParam = request.getParameter("status");
        String messageParam = request.getParameter("message");
        if (statusParam != null && messageParam != null) {
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            <% if ("success".equals(statusParam)) { %>
                if (typeof toast !== 'undefined') toast.success("<%= messageParam %>");
            <% } else if ("error".equals(statusParam)) { %>
                if (typeof toast !== 'undefined') toast.error("<%= messageParam %>");
            <% } %>
            
            // Clean URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        });
    </script>
    <% } %>
</body>
</html>
