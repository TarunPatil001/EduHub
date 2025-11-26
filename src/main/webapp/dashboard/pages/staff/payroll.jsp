<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Payroll & Salary - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage staff payroll and salary in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/staff/css/payroll.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="payroll"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Payroll & Salary Management"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2>Payroll & Salary Management</h2>
                            <p class="text-muted">Process salaries, manage deductions, and generate payslips</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button id="generatePayslipsBtn" class="btn btn-success">
                                <i class="bi bi-file-earmark-text"></i> Generate Payslips
                            </button>
                            <button id="exportPayrollBtn" class="btn btn-outline-secondary">
                                <i class="bi bi-download"></i> Export Report
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Payroll Statistics -->
                <div class="row g-4 mb-4">
                    <div class="col-md-3">
                        <div class="stat-card stat-primary">
                            <div class="stat-icon">
                                <i class="bi bi-people-fill"></i>
                            </div>
                            <div class="stat-details">
                                <h3 id="totalStaffCount">0</h3>
                                <p>Total Staff</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card stat-success">
                            <div class="stat-icon">
                                <i class="bi bi-cash-stack"></i>
                            </div>
                            <div class="stat-details">
                                <h3 id="totalPayroll">₹0</h3>
                                <p>Total Payroll</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card stat-warning">
                            <div class="stat-icon">
                                <i class="bi bi-hourglass-split"></i>
                            </div>
                            <div class="stat-details">
                                <h3 id="pendingCount">0</h3>
                                <p>Pending Payments</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card stat-info">
                            <div class="stat-icon">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>
                            <div class="stat-details">
                                <h3 id="paidCount">0</h3>
                                <p>Paid This Month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Controls -->
                <div class="card-custom mb-4">
                    <h5 class="mb-4"><i class="bi bi-funnel-fill"></i> Filter Options</h5>
                    
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label for="monthSelect" class="form-label">Month <span class="required-star">*</span></label>
                            <select id="monthSelect" class="form-select">
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11" selected>November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="yearSelect" class="form-label">Year <span class="required-star">*</span></label>
                            <select id="yearSelect" class="form-select">
                                <option value="2024">2024</option>
                                <option value="2025" selected>2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="departmentFilter" class="form-label">Department</label>
                            <select id="departmentFilter" class="form-select">
                                <option value="">All Departments</option>
                                <option value="teaching">Teaching</option>
                                <option value="administration">Administration</option>
                                <option value="it">IT & Support</option>
                                <option value="management">Management</option>
                                <option value="accounts">Accounts</option>
                                <option value="library">Library</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="statusFilter" class="form-label">Payment Status</label>
                            <select id="statusFilter" class="form-select">
                                <option value="">All Status</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="pending" selected>Pending</option>
                                <option value="processing">Processing</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div class="col-md-10">
                            <label for="searchInput" class="form-label">Search Staff</label>
                            <input type="text" id="searchInput" class="form-control" placeholder="Search by name, employee ID...">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label d-block">&nbsp;</label>
                            <button id="clearFiltersBtn" class="btn btn-outline-secondary w-100">
                                <i class="bi bi-x-circle"></i> Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Bulk Actions -->
                <div class="card-custom mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div class="d-flex gap-2 flex-wrap">
                            <button id="markAsPaidBtn" class="btn btn-success btn-sm">
                                <i class="bi bi-check-circle"></i> Mark Selected as Paid
                            </button>
                            <button id="sendPayslipsBtn" class="btn btn-info btn-sm">
                                <i class="bi bi-envelope"></i> Send Payslips
                            </button>
                            <button id="processPayrollBtn" class="btn btn-primary btn-sm">
                                <i class="bi bi-arrow-repeat"></i> Process Payroll
                            </button>
                        </div>
                        <div>
                            <span class="badge bg-secondary fs-6">
                                <i class="bi bi-check-square me-1"></i>Selected: <strong id="selectedCount" class="ms-1">0</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Payroll Table -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="payrollTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 50px;">
                                            <div class="form-check">
                                                <input type="checkbox" id="selectAll" class="form-check-input">
                                            </div>
                                        </th>
                                        <th style="width: 100px;">Emp ID</th>
                                        <th>Staff Name</th>
                                        <th style="width: 130px;">Department</th>
                                        <th style="width: 120px;">Designation</th>
                                        <th style="width: 120px;">Basic Salary</th>
                                        <th style="width: 100px;">Allowances</th>
                                        <th style="width: 100px;">Deductions</th>
                                        <th style="width: 120px;">Net Salary</th>
                                        <th style="width: 120px;">Status</th>
                                        <th style="width: 150px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="payrollTableBody">
                                    <tr class="empty-state-row">
                                        <td colspan="11" class="text-center py-5">
                                            <div class="empty-state">
                                                <div class="empty-state-icon">
                                                    <i class="bi bi-cash-stack"></i>
                                                </div>
                                                <h4 class="empty-state-title">Loading Payroll Data...</h4>
                                                <p class="empty-state-text">Please wait while we fetch the payroll information</p>
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
                                    <!-- Pagination buttons generated by JavaScript -->
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payslip Details Modal -->
    <div class="modal fade" id="payslipModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content payslip-modal-content">
                <div class="modal-body p-0" id="payslipContent">
                    <!-- Payslip content will be dynamically loaded here -->
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle"></i> Close
                    </button>
                    <button type="button" class="btn btn-primary" id="downloadPayslipBtn">
                        <i class="bi bi-download"></i> Download PDF
                    </button>
                    <button type="button" class="btn btn-info" id="emailPayslipBtn">
                        <i class="bi bi-envelope"></i> Send via Email
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Salary Modal -->
    <div class="modal fade" id="editSalaryModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Salary Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editSalaryForm">
                        <input type="hidden" id="editStaffId">
                        <div class="mb-3">
                            <label class="form-label">Staff Name</label>
                            <input type="text" class="form-control" id="editStaffName" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Basic Salary (₹) <span class="required-star">*</span></label>
                            <input type="number" class="form-control" id="editBasicSalary" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Allowances (₹)</label>
                            <input type="number" class="form-control" id="editAllowances" value="0">
                            <small class="text-muted">HRA, DA, Transport, etc.</small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Deductions (₹)</label>
                            <input type="number" class="form-control" id="editDeductions" value="0">
                            <small class="text-muted">Tax, PF, Insurance, etc.</small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Net Salary (₹)</label>
                            <input type="text" class="form-control" id="editNetSalary" readonly>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveSalaryBtn">
                        <i class="bi bi-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/staff/js/payroll.js"></script>
</body>
</html>
