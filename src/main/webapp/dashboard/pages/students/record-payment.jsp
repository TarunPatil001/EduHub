<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Record Payment - Dashboard - EduHub"/>
        <jsp:param name="description" value="Record student fee payment in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/record-payment.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/payment-history.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="record-payment"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Record Payment"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2 class="mb-1">Record Payment</h2>
                            <p class="text-muted mb-0">Record student fee payment transactions</p>
                        </div>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Fees
                        </a>
                    </div>
                </div>

                <div class="row">
                    <!-- Payment Form -->
                    <div class="col-lg-8">
                        <form id="recordPaymentForm">
                            <!-- Student Selection -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-circle"></i> Student Information</h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Search Student <span class="required-star">*</span></label>
                                        <div class="student-search-wrapper">
                                            <input type="text" class="form-control" id="studentSearch" placeholder="Enter Student ID or Name" required autocomplete="off">
                                            <div class="search-results" id="searchResults"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Student ID</label>
                                        <input type="text" class="form-control" id="selectedStudentId" readonly placeholder="Auto-filled">
                                    </div>
                                </div>

                                <!-- Student Details Card (Hidden initially) -->
                                <div id="studentDetailsCard" class="student-details-card mt-4" style="display: none;">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Student Name</label>
                                                <p id="detailName">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Course</label>
                                                <p id="detailCourse">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Current Status</label>
                                                <p id="detailStatus">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Total Fee</label>
                                                <p class="fw-bold" id="detailTotalFee">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Paid Amount</label>
                                                <p class="text-success fw-bold" id="detailPaidAmount">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label>Pending Amount</label>
                                                <p class="text-danger fw-bold" id="detailPendingAmount">-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-credit-card"></i> Payment Details</h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Payment Amount <span class="required-star">*</span></label>
                                        <div class="input-group">
                                            <span class="input-group-text">₹</span>
                                            <input type="number" class="form-control" id="paymentAmount" placeholder="Enter amount" required min="0.01" step="0.01" max="9999999">
                                        </div>
                                        <small class="text-muted" id="amountHelper"></small>
                                        <div class="invalid-feedback">Please enter a valid payment amount</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Payment Date <span class="required-star">*</span></label>
                                        <input type="date" class="form-control" id="paymentDate" required max="">
                                        <small class="text-muted">Cannot be a future date</small>
                                        <div class="invalid-feedback">Please select a valid date</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Payment Method <span class="required-star">*</span></label>
                                        <select class="form-select" id="paymentMethod" required>
                                            <option value="">Select payment method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Online Transfer">Online Transfer (UPI/NEFT/IMPS)</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Demand Draft">Demand Draft</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a payment method</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Receipt Number</label>
                                        <input type="text" class="form-control" id="receiptNumber" placeholder="Auto-generated" readonly>
                                    </div>
                                </div>
                            </div>

                            <!-- Transaction Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-receipt"></i> Transaction Details</h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Transaction ID / Reference Number</label>
                                        <input type="text" class="form-control" id="transactionId" placeholder="For online/card payments">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Bank Name</label>
                                        <input type="text" class="form-control" id="bankName" placeholder="If applicable">
                                    </div>
                                    <div class="col-md-12">
                                        <label class="form-label">Payment Notes</label>
                                        <textarea class="form-control" id="paymentNotes" rows="3" placeholder="Add any additional notes or remarks..."></textarea>
                                    </div>
                                    <div class="col-md-12">
                                        <label class="form-label">Attach Receipt/Proof (Optional)</label>
                                        <input type="file" class="form-control" id="paymentProof" accept="image/*,.pdf">
                                        <small class="text-muted">Supported formats: JPG, PNG, PDF (Max 5MB)</small>
                                    </div>
                                </div>
                            </div>



                            <!-- Form Actions -->
                            <div class="d-flex gap-2 mb-4">
                                <button type="submit" class="btn btn-success">
                                    <i class="bi bi-check-circle me-1"></i>Record Payment
                                </button>
                                <button type="button" class="btn btn-outline-secondary" id="resetBtn">
                                    <i class="bi bi-arrow-clockwise me-1"></i>Reset Form
                                </button>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp" class="btn btn-outline-danger">
                                    <i class="bi bi-x-circle me-1"></i>Cancel
                                </a>
                            </div>
                        </form>
                    </div>

                    <!-- Sidebar Info -->
                    <div class="col-lg-4">
                        <!-- Payment History -->
                        <div class="card-custom mb-3 payment-history-card">
                            <div class="payment-history-header">
                                <h6 class="payment-history-title">
                                    <i class="bi bi-clock-history"></i>
                                    <span id="paymentHistoryTitle">Select a Student</span>
                                </h6>
                                <button class="btn btn-sm btn-outline-primary" onclick="handleRefreshPaymentHistory()" id="refreshPaymentBtn" style="display:none;" title="Refresh">
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                            
                            <div id="paymentHistoryList">
                                <!-- Payment history items will be dynamically loaded -->
                                <div class="empty-state" id="emptyPaymentHistory">
                                    <div class="empty-state-icon">
                                        <i class="bi bi-clock-history"></i>
                                    </div>
                                    <p class="empty-state-text">No payment history</p>
                                </div>
                            </div>

                            <div class="text-end mt-3" id="viewAllPaymentsBtn" style="display:none;">
                                <button class="btn btn-sm btn-outline-primary" onclick="toggleFullPaymentHistory()" id="toggleHistoryBtn">
                                    <span id="toggleHistoryText">View All Payments</span> <i class="bi bi-chevron-down" id="toggleHistoryIcon"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="card-custom">
                            <h6><i class="bi bi-graph-up"></i> Today's Statistics</h6>
                            <div class="quick-stat">
                                <span class="stat-label">Payments Recorded</span>
                                <span class="stat-value text-primary">12</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-label">Total Collected</span>
                                <span class="stat-value text-success">₹2,45,000</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-label">Pending Receipts</span>
                                <span class="stat-value text-warning">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/record-payment.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/payment-history.js"></script>
</body>
</html>
