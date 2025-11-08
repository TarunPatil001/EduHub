<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
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
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Fees Management - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage student fees in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/fees-management.css">
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
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2 class="mb-1">Fees Management</h2>
                            <p class="text-muted mb-0">Track and manage student fee payments</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" id="sendReminderBtn">
                                <i class="bi bi-envelope"></i> Send Reminders
                            </button>
                            <a href="${pageContext.request.contextPath}/dashboard/pages/students/record-payment.jsp" class="btn btn-success">
                                <i class="bi bi-plus-lg"></i> Record Payment
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-xl-3 col-md-6">
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
                    </div>
                    <div class="col-xl-3 col-md-6">
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
                    </div>
                    <div class="col-xl-3 col-md-6">
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
                    </div>
                    <div class="col-xl-3 col-md-6">
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
                </div>

                <!-- Filters and Search -->
                <div class="card-custom mb-4">
                    <div class="row g-3 align-items-end">
                        <div class="col-lg-3 col-md-6">
                            <label class="form-label">Search Student</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control" id="searchInput" placeholder="Name or ID...">
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
                        <div class="col-lg-2 col-md-6">
                            <label class="form-label">Entries</label>
                            <select class="form-select" id="entriesPerPage">
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                        <div class="col-lg-3 col-md-12">
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary flex-fill" id="resetFilters">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button class="btn btn-outline-primary flex-fill" id="exportBtn">
                                    <i class="bi bi-download"></i> Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fee Records Table -->
                <div class="card-custom">
                    <div class="table-responsive">
                        <table class="table table-hover" id="feesTable">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Total Fee</th>
                                    <th>Paid Amount</th>
                                    <th>Pending</th>
                                    <th>Status</th>
                                    <th>Last Payment</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
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
                                <tr data-course="<%= record.course %>" data-status="<%= record.status %>">
                                    <td><strong><%= record.studentId %></strong></td>
                                    <td>
                                        <div class="student-info">
                                            <div class="avatar-circle"><%= record.studentName.substring(0, 2).toUpperCase() %></div>
                                            <span><%= record.studentName %></span>
                                        </div>
                                    </td>
                                    <td><%= record.course %></td>
                                    <td><strong><%= record.totalFee %></strong></td>
                                    <td class="text-success"><%= record.paidAmount %></td>
                                    <td class="text-danger"><strong><%= record.pendingAmount %></strong></td>
                                    <td><span class="badge <%= statusClass %>"><%= record.status %></span></td>
                                    <td><small><%= record.lastPaymentDate %></small></td>
                                    <td>
                                        <% if (!"-".equals(record.dueDate)) { %>
                                            <small class="text-warning"><i class="bi bi-calendar-event"></i> <%= record.dueDate %></small>
                                        <% } else { %>
                                            <small class="text-muted">-</small>
                                        <% } %>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-sm btn-outline-primary view-btn" data-student-id="<%= record.studentId %>" title="View Details">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                            <% if (!"Paid".equals(record.status)) { %>
                                            <button class="btn btn-sm btn-success payment-btn" data-student-id="<%= record.studentId %>" title="Add Payment">
                                                <i class="bi bi-credit-card"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary reminder-btn" data-student-id="<%= record.studentId %>" title="Send Reminder">
                                                <i class="bi bi-envelope"></i>
                                            </button>
                                            <% } %>
                                        </div>
                                    </td>
                                </tr>
                                <% } %>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                        <div class="text-muted">
                            Showing <span id="showingStart">1</span> to <span id="showingEnd">10</span> of <span id="totalEntries"><%= totalStudents %></span> entries
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

    <!-- Student Fee Details Modal -->
    <div class="modal fade" id="feeDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="bi bi-receipt"></i> Fee Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="feeDetailsContent">
                    <!-- Details will be loaded here -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/fees-management.js"></script>
</body>
</html>
