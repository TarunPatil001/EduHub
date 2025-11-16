<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.time.LocalDate"%>
<%@ page import="java.time.format.DateTimeFormatter"%>
<%!
// Helper method to format date to DD-MM-YYYY
public String formatDate(String dateStr) {
    try {
        if (dateStr != null && !dateStr.isEmpty() && !"-".equals(dateStr)) {
            LocalDate date = LocalDate.parse(dateStr);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return date.format(formatter);
        }
    } catch (Exception e) {
        // Return original if parsing fails
    }
    return dateStr;
}
%>
<%
// Dummy fee data
class FeeRecord {
    String studentId, studentName, course, totalFee, paidAmount, pendingAmount, status, lastPaymentDate, dueDate;
    
    public FeeRecord(String studentId, String studentName, String course, String totalFee, 
                     String paidAmount, String pendingAmount, String status, 
                     String lastPaymentDate, String dueDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.course = course;
        this.totalFee = totalFee;
        this.paidAmount = paidAmount;
        this.pendingAmount = pendingAmount;
        this.status = status;
        this.lastPaymentDate = lastPaymentDate;
        this.dueDate = dueDate;
    }
}

List<FeeRecord> feeRecords = Arrays.asList(
	    new FeeRecord("STU001", "Aarav Sharma", "Computer Science", "₹50,000", "₹50,000", "₹0", "Paid", "2024-03-15", "-"),
	    new FeeRecord("STU002", "Diya Patel", "Business Administration", "₹45,000", "₹30,000", "₹15,000", "Partial", "2024-03-10", "2024-04-10"),
	    new FeeRecord("STU003", "Arjun Kumar", "Engineering", "₹60,000", "₹20,000", "₹40,000", "Pending", "2024-02-20", "2024-04-05"),
	    new FeeRecord("STU004", "Ananya Singh", "Mathematics", "₹40,000", "₹0", "₹40,000", "Unpaid", "-", "2024-03-25"),
	    new FeeRecord("STU005", "Vihaan Mehta", "Computer Science", "₹50,000", "₹50,000", "₹0", "Paid", "2024-03-18", "-"),
	    new FeeRecord("STU006", "Aarav Khan", "Data Science", "₹55,000", "₹35,000", "₹20,000", "Partial", "2024-03-12", "2024-04-12"),
	    new FeeRecord("STU007", "Rohan Verma", "Physics", "₹42,000", "₹42,000", "₹0", "Paid", "2024-03-20", "-"),
	    new FeeRecord("STU008", "Sara Ali", "Chemistry", "₹43,000", "₹25,000", "₹18,000", "Pending", "2024-03-08", "2024-04-08"),
	    new FeeRecord("STU009", "Kabir Reddy", "Business Administration", "₹45,000", "₹0", "₹45,000", "Overdue", "-", "2024-03-01"),
	    new FeeRecord("STU010", "Myra Gupta", "Engineering", "₹60,000", "₹60,000", "₹0", "Paid", "2024-03-22", "-")
);

pageContext.setAttribute("feeRecords", feeRecords);

// Calculate statistics
int totalStudents = feeRecords.size();
int paidCount = 0;
int partialCount = 0;
int pendingCount = 0;
int overdueCount = 0;
double totalCollected = 0;
double totalPending = 0;

for (FeeRecord record : feeRecords) {
    if ("Paid".equals(record.status)) paidCount++;
    else if ("Partial".equals(record.status)) partialCount++;
    else if ("Pending".equals(record.status)) pendingCount++;
    else if ("Overdue".equals(record.status)) overdueCount++;
    
    String paidStr = record.paidAmount.replace("₹", "").replace(",", "");
    String pendingStr = record.pendingAmount.replace("₹", "").replace(",", "");
    if (!paidStr.isEmpty()) totalCollected += Double.parseDouble(paidStr);
    if (!pendingStr.isEmpty()) totalPending += Double.parseDouble(pendingStr);
}

pageContext.setAttribute("totalStudents", totalStudents);
pageContext.setAttribute("paidCount", paidCount);
pageContext.setAttribute("partialCount", partialCount);
pageContext.setAttribute("pendingCount", pendingCount);
pageContext.setAttribute("overdueCount", overdueCount);
pageContext.setAttribute("totalCollected", String.format("%.0f", totalCollected));
pageContext.setAttribute("totalPending", String.format("%.0f", totalPending));
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/ui_component/head.jsp">
        <jsp:param name="title" value="Fees Management - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage student fees in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/fees-management.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/ui_component/sidebar.jsp">
            <jsp:param name="activePage" value="fees-management"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/ui_component/header.jsp">
                <jsp:param name="pageTitle" value="Fees Management"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2 class="mb-1">Fees Management</h2>
                        <p class="text-muted mb-0">Track and manage student fee payments</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="back-button-container">
                        <div class="d-flex gap-2 flex-wrap">
                            <!-- Bulk Delete Button (hidden by default) -->
                            <button class="btn btn-danger" id="bulkDeleteBtn" style="display: none;">
                                <i class="bi bi-trash me-2"></i>Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                            <button class="btn btn-outline-primary" id="exportBtn">
                                <i class="bi bi-download me-1"></i>Export
                            </button>
                            <button class="btn btn-outline-primary" id="sendReminderBtn">
                                <i class="bi bi-envelope me-1"></i>Send Reminders
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="btn btn-success">
                                <i class="bi bi-plus-lg me-1"></i>Record Payment
                            </a>
                        </div>
                    </div>
                </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stats-card stats-success">
                    <div class="stats-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div class="stats-info">
                        <h3><%= paidCount %></h3>
                        <p>Fully Paid</p>
                        <span class="stats-badge success">₹<%= totalCollected %></span>
                    </div>
                </div>
                <div class="stats-card stats-warning">
                    <div class="stats-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="stats-info">
                        <h3><%= partialCount %></h3>
                        <p>Partial Payment</p>
                        <span class="stats-badge warning">In Progress</span>
                    </div>
                </div>
                <div class="stats-card stats-info">
                    <div class="stats-icon">
                        <i class="bi bi-hourglass-split"></i>
                    </div>
                    <div class="stats-info">
                        <h3><%= pendingCount %></h3>
                        <p>Pending Payment</p>
                        <span class="stats-badge info">₹<%= totalPending %></span>
                    </div>
                </div>
                <div class="stats-card stats-danger">
                    <div class="stats-icon">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div class="stats-info">
                        <h3><%= overdueCount %></h3>
                        <p>Overdue</p>
                        <span class="stats-badge danger">Action Required</span>
                    </div>
                </div>
            </div>

                <!-- Filters and Search -->
                <div class="card-custom mb-4">
                    <div class="row g-3 align-items-end">
                        <div class="col-lg-4 col-md-6">
                            <label class="form-label">Search Student</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control" id="searchInput" placeholder="Search by name, email, or ID...">
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <label class="form-label">Course</label>
                            <select class="form-select" id="courseFilter">
                                <option value="">All Courses</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Business Administration">Business Administration</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <label class="form-label">Payment Status</label>
                            <select class="form-select" id="statusFilter">
                                <option value="">All Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                                <option value="Pending">Pending</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-md-12">
                            <button class="btn btn-outline-secondary w-100" id="resetFilters">
                                <i class="bi bi-arrow-clockwise"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Fee Records Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="feesTable">
                            <thead class="table-light">
                                <tr>
                                    <th class="col-checkbox">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="selectAll">
                                        </div>
                                    </th>
                                    <th class="col-id">Student ID</th>
                                    <th class="col-name">Student Name</th>
                                    <th class="col-course">Course</th>
                                    <th class="col-fee">Total Fee</th>
                                    <th class="col-fee">Paid Amount</th>
                                    <th class="col-fee">Pending</th>
                                    <th class="col-status">Status</th>
                                    <th class="col-date">Last Payment</th>
                                    <th class="col-date">Due Date</th>
                                    <th class="col-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <%
                                for (FeeRecord record : feeRecords) {
                                    String statusClass = "";
                                    if ("Paid".equals(record.status)) statusClass = "status-paid";
                                    else if ("Partial".equals(record.status)) statusClass = "status-partial";
                                    else if ("Pending".equals(record.status)) statusClass = "status-pending";
                                    else if ("Unpaid".equals(record.status)) statusClass = "status-unpaid";
                                    else if ("Overdue".equals(record.status)) statusClass = "status-overdue";
                                %>
                                <tr data-student-id="<%= record.studentId %>" data-course="<%= record.course %>" data-status="<%= record.status %>">
                                    <td>
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input fee-checkbox" value="<%= record.studentId %>">
                                        </div>
                                    </td>
                                    <td><strong><%= record.studentId %></strong></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="student-avatar"><%= record.studentName.substring(0, 2).toUpperCase() %></div>
                                            <div class="ms-2">
                                                <div class="student-name"><%= record.studentName %></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="course-badge"><%= record.course %></span></td>
                                    <td class="text-end"><strong class="text-dark"><%= record.totalFee %></strong></td>
                                    <td class="text-end text-success"><strong><%= record.paidAmount %></strong></td>
                                    <td class="text-end text-danger"><strong><%= record.pendingAmount %></strong></td>
                                    <td><span class="badge <%= statusClass %>"><%= record.status %></span></td>
                                    <td>
                                        <% if (!"-".equals(record.lastPaymentDate)) { %>
                                            <div class="date-cell">
                                                <i class="bi bi-calendar-check text-muted"></i>
                                                <span><%= formatDate(record.lastPaymentDate) %></span>
                                            </div>
                                        <% } else { %>
                                            <span class="text-muted">-</span>
                                        <% } %>
                                    </td>
                                    <td>
                                        <% if (!"-".equals(record.dueDate)) { %>
                                            <div class="due-date-cell <%= "Overdue".equals(record.status) ? "overdue" : "upcoming" %>">
                                                <i class="bi bi-calendar-event"></i>
                                                <span><%= formatDate(record.dueDate) %></span>
                                            </div>
                                        <% } else { %>
                                            <span class="text-muted">-</span>
                                        <% } %>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-1">
                                            <button type="button" class="btn btn-sm btn-outline-primary view-btn" 
                                                    data-student-id="<%= record.studentId %>" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="top" 
                                                    title="View Details">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                            <% if (!"Paid".equals(record.status)) { %>
                                            <button type="button" class="btn btn-sm btn-outline-success payment-btn" 
                                                    data-student-id="<%= record.studentId %>" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="top" 
                                                    title="Record Payment">
                                                <i class="bi bi-cash"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-warning reminder-btn" 
                                                    data-student-id="<%= record.studentId %>" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="top" 
                                                    title="Send Reminder">
                                                <i class="bi bi-bell"></i>
                                            </button>
                                            <% } %>
                                        </div>
                                    </td>
                                </tr>
                                <% } %>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3 flex-wrap">
                                <div class="entries-info">
                                    Showing <span id="showingStart">1</span> to <span id="showingEnd">10</span> of <span id="totalEntries"><%= totalStudents %></span> entries
                                </div>
                                <div class="entries-selector-wrapper">
                                    <label>Show</label>
                                    <select class="form-select" id="entriesPerPage">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <nav>
                                <ul class="pagination mb-0" id="pagination">
                                    <!-- Pagination buttons will be generated by JavaScript -->
                                </ul>
                            </nav>
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
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="feeDetailsModalLabel">
                        <i class="bi bi-receipt-cutoff me-2"></i>Fee Details
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4" id="feeDetailsContent">
                    <!-- Details will be loaded here dynamically -->
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted mt-3">Loading fee details...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-1"></i>Close
                    </button>
                    <button type="button" class="btn btn-primary" onclick="window.print()">
                        <i class="bi bi-printer me-1"></i>Print
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Components -->
    <jsp:include page="/dashboard/components/ui_component/modal.jsp"/>
    <jsp:include page="/dashboard/components/ui_component/toast-notification.jsp"/>
    
    <jsp:include page="/dashboard/components/ui_component/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/fees-management.js"></script>
</body>
</html>
