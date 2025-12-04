<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.math.BigDecimal"%>
<%@ page import="java.time.LocalDate"%>
<%@ page import="java.time.format.DateTimeFormatter"%>
<%@ page import="com.eduhub.dao.interfaces.FeeDAO"%>
<%@ page import="com.eduhub.dao.impl.FeeDAOImpl"%>
<%@ page import="com.eduhub.model.Fee"%>
<%@ page import="com.eduhub.dao.interfaces.StudentDAO"%>
<%@ page import="com.eduhub.dao.impl.StudentDAOImpl"%>
<%@ page import="com.eduhub.model.Course"%>
<%!
// Helper method to format date to DD-MM-YYYY
public String formatDate(java.sql.Date date) {
    try {
        if (date != null) {
            LocalDate localDate = date.toLocalDate();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return localDate.format(formatter);
        }
    } catch (Exception e) {
        // Return empty if parsing fails
    }
    return "-";
}

public String formatCurrency(BigDecimal amount) {
    if (amount == null) return "₹0";
    return "₹" + amount.stripTrailingZeros().toPlainString();
}

// Helper to get initials
public String getInitials(String name) {
    if (name == null || name.isEmpty()) return "?";
    String[] parts = name.split("\\s+");
    String initials = "";
    if (parts.length > 0 && !parts[0].isEmpty()) initials += parts[0].charAt(0);
    if (parts.length > 1 && !parts[1].isEmpty()) initials += parts[1].charAt(0);
    return initials.toUpperCase();
}
%>
<%
    String instituteId = (String) session.getAttribute("instituteId");
    if (instituteId == null) instituteId = "INST001"; // Fallback

    FeeDAO feeDAO = new FeeDAOImpl();
    StudentDAO studentDAO = new StudentDAOImpl();
    
    // Pagination and Filter Parameters
    String searchQuery = request.getParameter("search");
    String courseFilter = request.getParameter("course");
    String statusFilter = request.getParameter("status");
    
    int currentPage = 1;
    int limit = 10;
    
    try {
        if (request.getParameter("page") != null) {
            currentPage = Integer.parseInt(request.getParameter("page"));
        }
        if (request.getParameter("limit") != null) {
            limit = Integer.parseInt(request.getParameter("limit"));
        }
    } catch (NumberFormatException e) {
        // Default values
    }
    
    // Fetch data
    List<Fee> feeRecords = feeDAO.getFeesByFilters(instituteId, courseFilter, statusFilter, searchQuery, currentPage, limit);
    int totalFilteredRecords = feeDAO.getFeeCountByFilters(instituteId, courseFilter, statusFilter, searchQuery);
    
    // Fetch statistics
    int paidCount = feeDAO.getPaidCount(instituteId);
    int partialCount = feeDAO.getPartialCount(instituteId);
    int pendingCount = feeDAO.getPendingCount(instituteId);
    int overdueCount = feeDAO.getOverdueCount(instituteId);
    double totalCollected = feeDAO.getTotalCollected(instituteId);
    double totalPending = feeDAO.getTotalPending(instituteId);
    
    // Fetch courses for filter
    List<Course> courses = studentDAO.getDistinctCourses(instituteId);
    
    int offset = (currentPage - 1) * limit;
    boolean hasRecords = totalFilteredRecords > 0;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Fees Management - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage student fees in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/fees-management.css">
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="fees-management"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Fees Management"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Fees Management</h2>
                        <p class="text-muted">Track and manage student fee payments</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2">
                            <button id="bulkDeleteBtn" class="btn btn-danger shadow-sm" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <button class="btn btn-outline-primary shadow-sm" id="exportBtn">
                                <i class="bi bi-download"></i> Export
                            </button>
                            <button class="btn btn-outline-primary shadow-sm" id="sendReminderBtn">
                                <i class="bi bi-envelope"></i> Send Reminders
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="btn btn-primary shadow-sm">
                                <i class="bi bi-plus-circle"></i> Record Payment
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="paidCount"><%= paidCount %></h4>
                            <p>Fully Paid</p>
                            <span class="badge bg-success bg-opacity-10 text-success mt-1">₹<%= String.format("%.0f", totalCollected) %></span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="bi bi-clock-history"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="partialCount"><%= partialCount %></h4>
                            <p>Partial Payment</p>
                            <span class="badge bg-warning bg-opacity-10 text-warning mt-1">In Progress</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon placed">
                            <i class="bi bi-hourglass-split"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="pendingCount"><%= pendingCount %></h4>
                            <p>Pending Payment</p>
                            <span class="badge bg-info bg-opacity-10 text-info mt-1">₹<%= String.format("%.0f", totalPending) %></span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active" style="background: rgba(239, 68, 68, 0.1); color: #EF4444;">
                            <i class="bi bi-exclamation-triangle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <h4 id="overdueCount"><%= overdueCount %></h4>
                            <p>Overdue</p>
                            <span class="badge bg-danger bg-opacity-10 text-danger mt-1">Action Required</span>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">Search Student</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="searchInput" 
                                           placeholder="Search by name..." 
                                           value="<%= searchQuery != null ? searchQuery : "" %>">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Course</label>
                                <select class="form-select" id="courseFilter">
                                    <option value="">All Courses</option>
                                    <% for(Course c : courses) { %>
                                        <option value="<%= c.getCourseId() %>" <%= c.getCourseId().equals(courseFilter) ? "selected" : "" %>><%= c.getCourseName() %></option>
                                    <% } %>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Payment Status</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">All Status</option>
                                    <option value="Paid" <%= "Paid".equals(statusFilter) ? "selected" : "" %>>Paid</option>
                                    <option value="Partial" <%= "Partial".equals(statusFilter) ? "selected" : "" %>>Partial</option>
                                    <option value="Pending" <%= "Pending".equals(statusFilter) ? "selected" : "" %>>Pending</option>
                                    <option value="Unpaid" <%= "Unpaid".equals(statusFilter) ? "selected" : "" %>>Unpaid</option>
                                    <option value="Overdue" <%= "Overdue".equals(statusFilter) ? "selected" : "" %>>Overdue</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                                    id="resetFilters" type="button" aria-label="Reset filters" title="Reset Filters">
                                    <i class="bi bi-arrow-clockwise me-2"></i>
                                    <span>Reset Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fee Records Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <!-- Empty State - Show when no data -->
                        <div id="emptyState" class="empty-state-container" style="<%= hasRecords ? "display: none;" : "" %>">
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="bi bi-cash-coin"></i>
                                </div>
                                <h4 class="empty-state-title">No Fee Records Found</h4>
                                <p class="empty-state-text">No records match your current search or filter criteria</p>
                                <% if (searchQuery != null || courseFilter != null || statusFilter != null) { %>
                                    <button class="btn btn-outline-primary mt-3" onclick="window.location.href='fees-management.jsp'">
                                        <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
                                    </button>
                                <% } else { %>
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="btn btn-success mt-3">
                                        <i class="bi bi-plus-lg me-2"></i>Record First Payment
                                    </a>
                                <% } %>
                            </div>
                        </div>

                        <!-- Table - Show when data exists -->
                        <div class="table-responsive" id="feesTableContainer" style="<%= !hasRecords ? "display: none;" : "" %>">
                            <table class="table table-hover mb-0" id="feesTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAll" class="form-check-input">
                                            </div>
                                        </th>
                                        <th>Student Name</th>
                                        <th>Batch ID</th>
                                        <th class="text-end">Total Fee</th>
                                        <th class="text-end">Paid Amount</th>
                                        <th class="text-end">Pending</th>
                                        <th>Status</th>
                                        <th>Last Payment</th>
                                        <th>Due Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="feesTableBody">
                                    <%
                                    if (hasRecords) {
                                        for (Fee record : feeRecords) {
                                            String statusClass = "";
                                            String status = record.getStatus() != null ? record.getStatus() : "Pending";
                                            if ("Paid".equals(status)) statusClass = "status-paid";
                                            else if ("Partial".equals(status)) statusClass = "status-partial";
                                            else if ("Pending".equals(status)) statusClass = "status-pending";
                                            else if ("Unpaid".equals(status)) statusClass = "status-unpaid";
                                            else if ("Overdue".equals(status)) statusClass = "status-overdue";
                                            
                                            String initials = getInitials(record.getStudentName());
                                    %>
                                    <tr data-student-id="<%= record.getStudentId() %>" data-status="<%= status %>">
                                        <td>
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input fee-checkbox" value="<%= record.getStudentId() %>">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="student-avatar">
                                                    <% if (record.getProfilePhotoUrl() != null && !record.getProfilePhotoUrl().isEmpty()) { %>
                                                        <img src="<%= record.getProfilePhotoUrl() %>" alt="<%= initials %>" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                                                    <% } else { %>
                                                        <%= initials %>
                                                    <% } %>
                                                </div>
                                                <div class="student-name"><%= record.getStudentName() %></div>
                                            </div>
                                        </td>
                                        <td><span class="course-badge"><%= record.getBatchName() != null ? record.getBatchName() : "-" %></span></td>
                                        <td class="text-end"><strong><%= formatCurrency(record.getTotalFee()) %></strong></td>
                                        <td class="text-end text-success"><strong><%= formatCurrency(record.getPaidAmount()) %></strong></td>
                                        <td class="text-end text-danger"><strong><%= formatCurrency(record.getPendingAmount()) %></strong></td>
                                        <td><span class="badge <%= statusClass %>"><%= status %></span></td>
                                        <td>
                                            <% if (record.getLastPaymentDate() != null) { %>
                                                <div class="date-cell">
                                                    <i class="bi bi-calendar-check"></i>
                                                    <span><%= formatDate(record.getLastPaymentDate()) %></span>
                                                </div>
                                            <% } else { %>
                                                <span class="text-muted">-</span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <% if (record.getDueDate() != null) { %>
                                                <div class="due-date-cell <%= "Overdue".equals(status) ? "overdue" : "upcoming" %>">
                                                    <i class="bi bi-calendar-event"></i>
                                                    <span><%= formatDate(record.getDueDate()) %></span>
                                                </div>
                                            <% } else { %>
                                                <span class="text-muted">-</span>
                                            <% } %>
                                        </td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm view-btn" 
                                                        data-student-id="<%= record.getStudentId() %>" title="View Details">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <% if (!"Paid".equals(status)) { %>
                                                <button type="button" class="btn btn-sm payment-btn" 
                                                        data-student-id="<%= record.getStudentId() %>" title="Record Payment">
                                                    <i class="bi bi-cash"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm reminder-btn" 
                                                        data-student-id="<%= record.getStudentId() %>" title="Send Reminder">
                                                    <i class="bi bi-bell"></i>
                                                </button>
                                                <% } %>
                                            </div>
                                        </td>
                                    </tr>
                                    <% 
                                        }
                                    } 
                                    %>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div class="card-footer py-3 bg-white" id="paginationFooter" style="<%= !hasRecords ? "display: none;" : "" %>">
                        <div class="row align-items-center gy-3">
                            <div class="col-sm-12 col-md-5">
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 text-muted small">
                                    <span>Show</span>
                                    <select class="form-select form-select-sm w-auto border-light bg-light" id="itemsPerPage" style="min-width: 70px;">
                                        <option value="10" <%= limit == 10 ? "selected" : "" %>>10</option>
                                        <option value="25" <%= limit == 25 ? "selected" : "" %>>25</option>
                                        <option value="50" <%= limit == 50 ? "selected" : "" %>>50</option>
                                        <option value="100" <%= limit == 100 ? "selected" : "" %>>100</option>
                                    </select>
                                    <span>entries</span>
                                    <div class="vr mx-2"></div>
                                    <span class="entries-info">
                                        Showing <span id="showingStart" class="fw-bold text-dark"><%= totalFilteredRecords > 0 ? offset + 1 : 0 %></span> - <span id="showingEnd" class="fw-bold text-dark"><%= Math.min(offset + limit, totalFilteredRecords) %></span> of <span id="totalEntries" class="fw-bold text-dark"><%= totalFilteredRecords %></span>
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

    <!-- Student Fee Details Modal -->
    <div class="modal fade" id="feeDetailsModal" tabindex="-1" aria-labelledby="feeDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="feeDetailsModalLabel">Fee Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="feeDetailsContent">
                    <!-- Details will be loaded here dynamically -->
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted mt-3">Loading fee details...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="window.print()">
                        <i class="bi bi-printer me-1"></i> Print
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Server-side pagination data
        var serverPagination = {
            currentPage: <%= currentPage %>,
            itemsPerPage: <%= limit %>,
            totalItems: <%= totalFilteredRecords %>,
            totalPages: <%= (int) Math.ceil((double) totalFilteredRecords / limit) %>
        };
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/fees-management.js?v=<%= System.currentTimeMillis() %>"></script>

    <%-- Toast Notification Logic --%>
    <%
        String successMessage = (String) session.getAttribute("successMessage");
        if (successMessage != null) {
            session.removeAttribute("successMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.success("<%= successMessage %>");
        });
    </script>
    <% } %>
    
    <%
        String errorMessage = (String) session.getAttribute("errorMessage");
        if (errorMessage != null) {
            session.removeAttribute("errorMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.error("<%= errorMessage %>");
        });
    </script>
    <% } %>
</body>
</html>
