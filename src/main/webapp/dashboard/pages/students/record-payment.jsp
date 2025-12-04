<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Record Payment - Dashboard - EduHub"/>
        <jsp:param name="description" value="Record student fee payment in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/record-payment.css">
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
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>Record Fee Payment</h2>
                        <p class="text-muted">Record and track student fee payment transactions</p>
                    </div>
                    
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp"/>
                            <jsp:param name="text" value="Back to Fees"/>
                        </jsp:include>
                    </div>
                </div>

                <!-- Main Layout: Form + Sidebar -->
                <div class="record-payment-layout">
                    <!-- Payment Form Column -->
                    <div class="payment-form-column">
                        <form id="recordPaymentForm" method="POST">
                            <!-- Student Selection Section -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-circle"></i> Student Information</h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label class="form-label">Search Student <span class="required-star">*</span></label>
                                        <div class="student-search-wrapper position-relative">
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                                <input type="text" class="form-control" id="studentSearch" placeholder="Enter Name or Mobile Number" required autocomplete="off">
                                            </div>
                                            <div class="search-results-dropdown" id="searchResults" style="display: none;"></div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="selectedStudentId" name="studentId">
                                </div>

                                <!-- Student Details Card (Shows after selection) -->
                                <div id="studentDetailsCard" class="student-info-display mt-4" style="display: none;">
                                    <div class="student-avatar-section">
                                        <div class="student-avatar-large" id="detailAvatar">
                                            <i class="bi bi-person-fill"></i>
                                        </div>
                                        <div class="student-info-text">
                                            <h5 class="mb-1" id="detailName">-</h5>
                                            <p class="text-muted mb-0" id="detailEmail">-</p>
                                        </div>
                                    </div>
                                    
                                    <hr class="my-3">
                                    
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label><i class="bi bi-book"></i> Course</label>
                                                <p id="detailCourse" class="fw-semibold">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label><i class="bi bi-calendar3"></i> Batch</label>
                                                <p id="detailBatch" class="fw-semibold">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="detail-item">
                                                <label><i class="bi bi-check-circle"></i> Status</label>
                                                <p id="detailStatus">-</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Fee Summary Cards -->
                                    <div class="fee-summary-cards mt-3">
                                        <div class="fee-card fee-total">
                                            <div class="fee-icon"><i class="bi bi-currency-rupee"></i></div>
                                            <div class="fee-details">
                                                <label>Total Fee</label>
                                                <h4 id="detailTotalFee">₹0</h4>
                                            </div>
                                        </div>
                                        <div class="fee-card fee-paid">
                                            <div class="fee-icon"><i class="bi bi-check-circle-fill"></i></div>
                                            <div class="fee-details">
                                                <label>Paid Amount</label>
                                                <h4 id="detailPaidAmount" class="text-success">₹0</h4>
                                            </div>
                                        </div>
                                        <div class="fee-card fee-pending">
                                            <div class="fee-icon"><i class="bi bi-clock-fill"></i></div>
                                            <div class="fee-details">
                                                <label>Pending Amount</label>
                                                <h4 id="detailPendingAmount" class="text-danger">₹0</h4>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- View Details Button -->
                                    <div class="text-center mt-3">
                                        <button type="button" class="btn btn-outline-primary btn-sm" id="viewFeeDetailsBtn" onclick="showFeeDetailsModal()">
                                            <i class="bi bi-eye"></i> View Complete Fee Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Details Section -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-credit-card-fill"></i> Payment Details</h5>
                                
                                <div class="row g-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="paymentAmount"/>
                                        <jsp:param name="name" value="paymentAmount"/>
                                        <jsp:param name="label" value="Payment Amount"/>
                                        <jsp:param name="placeholder" value="Enter amount"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="1"/>
                                        <jsp:param name="step" value="0.01"/>
                                        <jsp:param name="prepend" value="₹"/>
                                        <jsp:param name="helperText" value="Maximum payable: Pending amount"/>
                                        <jsp:param name="errorText" value="Please enter a valid payment amount"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="paymentDate"/>
                                        <jsp:param name="name" value="paymentDate"/>
                                        <jsp:param name="label" value="Payment Date"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="helperText" value="Cannot be a future date"/>
                                        <jsp:param name="errorText" value="Please select a valid date"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="paymentMethod"/>
                                        <jsp:param name="name" value="paymentMethod"/>
                                        <jsp:param name="label" value="Payment Method"/>
                                        <jsp:param name="placeholder" value="Select payment method"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="Cash|Cash,UPI|UPI,Online Transfer|Online Transfer (NEFT/IMPS/RTGS),Credit Card|Credit Card,Debit Card|Debit Card,Cheque|Cheque,Demand Draft|Demand Draft"/>
                                        <jsp:param name="errorText" value="Please select a payment method"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="receiptNumber"/>
                                        <jsp:param name="name" value="receiptNumber"/>
                                        <jsp:param name="label" value="Receipt Number"/>
                                        <jsp:param name="placeholder" value="Auto-generated"/>
                                        <jsp:param name="readonly" value="true"/>
                                        <jsp:param name="helperText" value="System generated receipt number"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <!-- Quick Amount Buttons -->
                                <div class="quick-amounts mt-3">
                                    <label class="form-label small text-muted mb-2">Quick Select:</label>
                                    <div class="d-flex gap-2 flex-wrap">
                                        <button type="button" class="btn btn-sm btn-outline-primary quick-amt-btn" data-amount="5000">₹5,000</button>
                                        <button type="button" class="btn btn-sm btn-outline-primary quick-amt-btn" data-amount="10000">₹10,000</button>
                                        <button type="button" class="btn btn-sm btn-outline-primary quick-amt-btn" data-amount="25000">₹25,000</button>
                                        <button type="button" class="btn btn-sm btn-outline-success quick-amt-btn" data-amount="full">Full Pending</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Transaction Details Section -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-receipt"></i> Transaction Details (Optional)</h5>
                                
                                <div class="row g-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="transactionId"/>
                                        <jsp:param name="name" value="transactionId"/>
                                        <jsp:param name="label" value="Transaction ID / UTR Number"/>
                                        <jsp:param name="placeholder" value="For online/UPI payments"/>
                                        <jsp:param name="helperText" value="12-digit reference number"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="bankName"/>
                                        <jsp:param name="name" value="bankName"/>
                                        <jsp:param name="label" value="Bank Name"/>
                                        <jsp:param name="placeholder" value="e.g., HDFC, SBI, ICICI"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="chequeNumber"/>
                                        <jsp:param name="name" value="chequeNumber"/>
                                        <jsp:param name="label" value="Cheque/DD Number"/>
                                        <jsp:param name="placeholder" value="If payment by cheque or DD"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="chequeDate"/>
                                        <jsp:param name="name" value="chequeDate"/>
                                        <jsp:param name="label" value="Cheque/DD Date"/>
                                        <jsp:param name="placeholder" value="Date on cheque/DD"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="textarea"/>
                                        <jsp:param name="id" value="paymentNotes"/>
                                        <jsp:param name="name" value="paymentNotes"/>
                                        <jsp:param name="label" value="Payment Notes / Remarks"/>
                                        <jsp:param name="placeholder" value="Add any additional notes or special instructions..."/>
                                        <jsp:param name="rows" value="3"/>
                                        <jsp:param name="class" value="col-md-12"/>
                                    </jsp:include>
                                </div>
                            </div>

                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex justify-content-end gap-3 mt-4">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" id="resetFormBtn">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Record Payment
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Payment History Sidebar -->
                    <div class="payment-sidebar-column">
                        <!-- Payment History Card -->
                        <div class="card-custom mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h6 class="mb-0">
                                    <i class="bi bi-clock-history me-2"></i>
                                    <span id="paymentHistoryTitle">Payment History</span>
                                </h6>
                                <button class="btn btn-sm btn-outline-primary" id="refreshHistoryBtn" style="display:none;" title="Refresh">
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                            
                            <div id="paymentHistoryContainer">
                                <div class="empty-history-state text-center py-5">
                                    <div class="empty-icon mb-3">
                                        <i class="bi bi-receipt-cutoff"></i>
                                    </div>
                                    <p class="text-muted mb-0">Select a student to view<br/>payment history</p>
                                </div>
                            </div>
                            
                            <!-- Payment History List (populated dynamically) -->
                            <div id="paymentHistoryList" style="display: none;">
                                <!-- Items will be inserted here -->
                            </div>
                            
                            <div class="text-center mt-3" id="viewAllHistoryBtn" style="display:none;">
                                <button class="btn btn-sm btn-link" id="toggleHistoryBtn">
                                    <span id="toggleHistoryText">View All</span> <i class="bi bi-chevron-down" id="toggleHistoryIcon"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Today's Statistics Card -->
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-graph-up-arrow me-2"></i>Today's Statistics
                            </h6>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-icon stat-icon-primary">
                                        <i class="bi bi-receipt"></i>
                                    </div>
                                    <div class="stat-content">
                                        <label>Payments Recorded</label>
                                        <h5 class="text-primary mb-0" id="todayPaymentsCount">0</h5>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon stat-icon-success">
                                        <i class="bi bi-cash-stack"></i>
                                    </div>
                                    <div class="stat-content">
                                        <label>Total Collected</label>
                                        <h5 class="text-success mb-0" id="todayTotalAmount">₹0</h5>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon stat-icon-info">
                                        <i class="bi bi-people-fill"></i>
                                    </div>
                                    <div class="stat-content">
                                        <label>Students Paid</label>
                                        <h5 class="text-info mb-0" id="todayStudentsCount">0</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Guidelines -->
                        <div class="card-custom">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Payment Guidelines
                            </h6>
                            <ul class="guidelines-list small text-muted ps-3 mb-0">
                                <li>Verify student details before recording payment</li>
                                <li>For cheque payments, mention cheque number & date</li>
                                <li>Receipt number is auto-generated</li>
                                <li>Payment date cannot be in future</li>
                                <li>Add transaction ID for UPI/NEFT payments</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Include Reusable Components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <!-- SweetAlert2 for modern modals -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        const CONTEXT_PATH = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/record-payment.js?v=<%= System.currentTimeMillis() %>"></script>
</body>
</html>
