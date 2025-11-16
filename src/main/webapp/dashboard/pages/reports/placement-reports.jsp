<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/ui_component/head.jsp">
        <jsp:param name="title" value="Placement Records - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage student placement records and track employment"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/reports/css/placement-reports.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/ui_component/sidebar.jsp">
            <jsp:param name="activePage" value="placement-reports"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/ui_component/header.jsp">
                <jsp:param name="pageTitle" value="Placement Records"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Title Bar -->
                <div class="page-title-bar">
                    <div class="title-section">
                        <h1 class="page-title">
                            <i class="bi bi-briefcase-fill"></i> Placement Records
                        </h1>
                        <p class="page-subtitle">Track and manage student placements, job offers, and employment statistics</p>
                    </div>
                    <div class="action-section">
                        <button class="btn btn-primary" id="addRecordBtn">
                            <i class="bi bi-plus-circle"></i> Add Record
                        </button>
                        <button class="btn btn-secondary" id="exportBtn">
                            <i class="bi bi-download"></i> <span>Export</span>
                        </button>
                        <button class="btn btn-secondary" id="refreshBtn">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="stats-container">
                    <div class="stat-card stat-primary">
                        <div class="stat-icon-wrapper"><i class="bi bi-people-fill"></i></div>
                        <div class="stat-details">
                            <p class="stat-label">Total Placed</p>
                            <h3 class="stat-value" id="statTotalPlaced">0</h3>
                            <span class="stat-change positive" id="statPlacedChange">+0%</span>
                        </div>
                    </div>
                    <div class="stat-card stat-success">
                        <div class="stat-icon-wrapper"><i class="bi bi-building"></i></div>
                        <div class="stat-details">
                            <p class="stat-label">Companies</p>
                            <h3 class="stat-value" id="statCompanies">0</h3>
                            <span class="stat-change" id="statCompaniesChange">Active</span>
                        </div>
                    </div>
                    <div class="stat-card stat-warning">
                        <div class="stat-icon-wrapper"><i class="bi bi-cash-coin"></i></div>
                        <div class="stat-details">
                            <p class="stat-label">Avg Package</p>
                            <h3 class="stat-value" id="statAvgPackage">₹0</h3>
                            <span class="stat-change" id="statAvgChange">LPA</span>
                        </div>
                    </div>
                    <div class="stat-card stat-info">
                        <div class="stat-icon-wrapper"><i class="bi bi-trophy-fill"></i></div>
                        <div class="stat-details">
                            <p class="stat-label">Highest Package</p>
                            <h3 class="stat-value" id="statMaxPackage">₹0</h3>
                            <span class="stat-change positive" id="statMaxChange">Record</span>
                        </div>
                    </div>
                </div>

                <!-- Filters and Search -->
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3 align-items-end">
                            <div class="col-lg-3 col-md-6">
                                <label for="searchInput" class="form-label fw-semibold">Search Records</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-search text-muted"></i>
                                    </span>
                                    <input type="text" class="form-control border-start-0 ps-0" id="searchInput"
                                        placeholder="Student, Company, Designation..." aria-label="Search records">
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-6">
                                <label for="filterStatus" class="form-label fw-semibold">Status</label>
                                <select class="form-select" id="filterStatus" aria-label="Filter by status">
                                    <option value="">All Status</option>
                                    <option value="placed">Placed</option>
                                    <option value="offered">Offered</option>
                                    <option value="joined">Joined</option>
                                    <option value="declined">Declined</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div class="col-lg-2 col-md-6">
                                <label for="filterDepartment" class="form-label fw-semibold">Department</label>
                                <select class="form-select" id="filterDepartment" aria-label="Filter by department">
                                    <option value="">All Departments</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Civil">Civil</option>
                                    <option value="MBA">MBA</option>
                                </select>
                            </div>
                            <div class="col-lg-2 col-md-6">
                                <label for="filterBatch" class="form-label fw-semibold">Batch</label>
                                <select class="form-select" id="filterBatch" aria-label="Filter by batch">
                                    <option value="">All Years</option>
                                    <option value="2025-26">2025-26</option>
                                    <option value="2024-25">2024-25</option>
                                    <option value="2023-24">2023-24</option>
                                    <option value="2022-23">2022-23</option>
                                </select>
                            </div>
                            <div class="col-lg-2 col-md-6">
                                <label for="filterCompany" class="form-label fw-semibold">Company</label>
                                <select class="form-select" id="filterCompany" aria-label="Filter by company">
                                    <option value="">All Companies</option>
                                </select>
                            </div>
                            <div class="col-lg-1 col-md-6">
                                <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                                    id="clearFilters" type="button" aria-label="Reset filters" title="Clear Filters">
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Placement Records Table -->
                <div class="card shadow-sm">
                    <div class="card-header bg-white border-bottom py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-semibold">Placement Records</h6>
                            <button class="btn btn-danger btn-sm" id="bulkDeleteBtn" style="display: none;">
                                <i class="bi bi-trash"></i> Delete Selected (<span id="selectedCount">0</span>)
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="placementTable">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="selectAll">
                                            </div>
                                        </th>
                                        <th>Student</th>
                                        <th>Department</th>
                                        <th>Batch</th>
                                        <th>Company</th>
                                        <th>Designation</th>
                                        <th>Package</th>
                                        <th>Status</th>
                                        <th>Dates</th>
                                        <th class="sticky-column">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination Footer -->
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3 flex-wrap">
                                <div class="entries-info">
                                    <span id="paginationText">Showing 0 to 0 of 0 entries</span>
                                </div>
                                <div class="entries-selector-wrapper">
                                    <label for="entriesPerPage" class="me-2">Show:</label>
                                    <select class="form-select form-select-sm" id="entriesPerPage">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <nav>
                                <ul class="pagination mb-0" id="paginationNav"></ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div class="card shadow-sm" id="emptyState" style="display: none;">
                    <div class="card-body text-center py-5">
                        <div class="empty-illustration mb-3">
                            <i class="bi bi-inbox" style="font-size: 4rem; color: #dee2e6;"></i>
                        </div>
                        <h4 class="empty-title text-muted">No Records Found</h4>
                        <p class="empty-text text-muted">No placement records match your filters. Try adjusting your search criteria or add a new record.</p>
                        <button class="btn btn-primary mt-3" id="emptyAddBtn">
                            <i class="bi bi-plus-circle"></i> Add First Record
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div class="card shadow-sm" id="loadingState" style="display: none;">
                    <div class="card-body text-center py-5">
                        <div class="spinner-border text-primary mb-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted">Loading placement records...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div class="card shadow-sm" id="errorState" style="display: none;">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-exclamation-triangle text-danger mb-3" style="font-size: 4rem;"></i>
                        <h4 class="text-muted">Error Loading Data</h4>
                        <p class="text-muted" id="errorMessage">An error occurred while loading placement records.</p>
                        <button class="btn btn-primary btn-sm mt-3" id="retryBtn">
                            <i class="bi bi-arrow-clockwise"></i> Retry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="recordModal" tabindex="-1" aria-labelledby="recordModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="recordModalLabel">Add Placement Record</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="recordForm" novalidate>
                    <div class="modal-body">
                        <div class="row g-3">
                            <!-- Student Information -->
                            <div class="col-12">
                                <h6 class="border-bottom pb-2 mb-3">Student Information</h6>
                            </div>
                            <div class="col-md-6">
                                <label for="studentName" class="form-label">Student Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="studentName" required placeholder="Enter student name">
                                <div class="invalid-feedback">Please enter student name</div>
                            </div>
                            <div class="col-md-6">
                                <label for="studentId" class="form-label">Student ID <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="studentId" required placeholder="e.g., STU001">
                                <div class="invalid-feedback">Please enter student ID</div>
                            </div>
                            <div class="col-md-6">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" placeholder="student@example.com">
                                <div class="invalid-feedback">Please enter a valid email</div>
                            </div>
                            <div class="col-md-6">
                                <label for="phone" class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="phone" placeholder="+91 98765 43210">
                            </div>
                            <div class="col-md-6">
                                <label for="department" class="form-label">Department <span class="text-danger">*</span></label>
                                <select class="form-select" id="department" required>
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Civil">Civil</option>
                                    <option value="MBA">MBA</option>
                                </select>
                                <div class="invalid-feedback">Please select department</div>
                            </div>
                            <div class="col-md-6">
                                <label for="batch" class="form-label">Batch <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="batch" required placeholder="2024-25">
                                <div class="invalid-feedback">Please enter batch</div>
                            </div>
                            
                            <!-- Placement Details -->
                            <div class="col-12 mt-4">
                                <h6 class="border-bottom pb-2 mb-3">Placement Details</h6>
                            </div>
                            <div class="col-md-6">
                                <label for="company" class="form-label">Company <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="company" required placeholder="Company name">
                                <div class="invalid-feedback">Please enter company</div>
                            </div>
                            <div class="col-md-6">
                                <label for="designation" class="form-label">Designation <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="designation" required placeholder="Job role">
                                <div class="invalid-feedback">Please enter designation</div>
                            </div>
                            <div class="col-md-4">
                                <label for="package" class="form-label">Package (LPA) <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="package" step="0.1" min="0" max="999" required placeholder="12.5">
                                <div class="invalid-feedback">Enter package (0-999)</div>
                            </div>
                            <div class="col-md-4">
                                <label for="jobType" class="form-label">Job Type</label>
                                <select class="form-select" id="jobType">
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                                <select class="form-select" id="status" required>
                                    <option value="">Select Status</option>
                                    <option value="placed">Placed</option>
                                    <option value="offered">Offered</option>
                                    <option value="joined">Joined</option>
                                    <option value="declined">Declined</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <div class="invalid-feedback">Please select status</div>
                            </div>
                            <div class="col-md-4">
                                <label for="location" class="form-label">Location</label>
                                <input type="text" class="form-control" id="location" placeholder="City">
                            </div>
                            <div class="col-md-4">
                                <label for="offerDate" class="form-label">Offer Date</label>
                                <input type="date" class="form-control" id="offerDate">
                            </div>
                            <div class="col-md-4">
                                <label for="joiningDate" class="form-label">Joining Date</label>
                                <input type="date" class="form-control" id="joiningDate">
                                <div class="invalid-feedback">Must be after offer date</div>
                            </div>
                            <div class="col-12">
                                <label for="remarks" class="form-label">Remarks</label>
                                <textarea class="form-control" id="remarks" rows="2" maxlength="500" placeholder="Additional notes (optional)"></textarea>
                                <small class="text-muted">Max 500 characters</small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- View Modal -->
    <div class="modal fade" id="viewModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Placement Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="viewContent"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="editFromView">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-danger">
                        <i class="bi bi-exclamation-triangle"></i> Confirm Delete
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this placement record?</p>
                    <p class="text-muted mb-0">This action cannot be undone.</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bulk Delete Modal -->
    <div class="modal fade" id="bulkDeleteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-danger">
                        <i class="bi bi-exclamation-triangle"></i> Confirm Bulk Delete
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong><span id="bulkDeleteCount">0</span> placement record(s)</strong>?</p>
                    <p class="text-muted mb-0">This action cannot be undone.</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmBulkDeleteBtn">
                        <i class="bi bi-trash"></i> Delete All
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Component -->
    <jsp:include page="/dashboard/components/ui_component/toast-notification.jsp"/>
    
    <!-- Modal Component -->
    <jsp:include page="/dashboard/components/ui_component/modal.jsp"/>

    <jsp:include page="/dashboard/components/ui_component/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/reports/js/placement-reports.js"></script>
</body>
</html>
