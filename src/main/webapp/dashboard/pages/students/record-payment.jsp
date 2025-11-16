<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/ui_component/head.jsp">
        <jsp:param name="title" value="Record Payment - Dashboard - EduHub"/>
        <jsp:param name="description" value="Record student fee payment in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/record-payment.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/payment-history.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/ui_component/sidebar.jsp">
            <jsp:param name="activePage" value="record-payment"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/ui_component/header.jsp">
                <jsp:param name="pageTitle" value="Record Payment"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <!-- Page Header -->
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2 class="mb-1">Record Payment</h2>
                        <p class="text-muted mb-0">Record student fee payment transactions</p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/ui_component/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/students/fees-management.jsp"/>
                            <jsp:param name="text" value="Back to Fees"/>
                        </jsp:include>
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
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="paymentAmount"/>
                                        <jsp:param name="label" value="Payment Amount"/>
                                        <jsp:param name="placeholder" value="Enter amount"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="0.01"/>
                                        <jsp:param name="step" value="0.01"/>
                                        <jsp:param name="max" value="9999999"/>
                                        <jsp:param name="prepend" value="₹"/>
                                        <jsp:param name="errorText" value="Please enter a valid payment amount"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="paymentDate"/>
                                        <jsp:param name="label" value="Payment Date"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="max" value=""/>
                                        <jsp:param name="helperText" value="Cannot be a future date"/>
                                        <jsp:param name="errorText" value="Please select a valid date"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="paymentMethod"/>
                                        <jsp:param name="label" value="Payment Method"/>
                                        <jsp:param name="placeholder" value="Select payment method"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="Cash|Cash,Online Transfer|Online Transfer (UPI/NEFT/IMPS),Credit Card|Credit Card,Debit Card|Debit Card,Cheque|Cheque,Demand Draft|Demand Draft"/>
                                        <jsp:param name="errorText" value="Please select a payment method"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="receiptNumber"/>
                                        <jsp:param name="label" value="Receipt Number"/>
                                        <jsp:param name="placeholder" value="Auto-generated"/>
                                        <jsp:param name="readonly" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                            </div>

                            <!-- Transaction Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-receipt"></i> Transaction Details</h5>
                                
                                <div class="row g-3">
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="transactionId"/>
                                        <jsp:param name="label" value="Transaction ID / Reference Number"/>
                                        <jsp:param name="placeholder" value="For online/card payments"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="bankName"/>
                                        <jsp:param name="label" value="Bank Name"/>
                                        <jsp:param name="placeholder" value="If applicable"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="textarea"/>
                                        <jsp:param name="id" value="paymentNotes"/>
                                        <jsp:param name="label" value="Payment Notes"/>
                                        <jsp:param name="placeholder" value="Add any additional notes or remarks..."/>
                                        <jsp:param name="rows" value="3"/>
                                        <jsp:param name="class" value="col-md-12"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/ui_component/input-field.jsp">
                                        <jsp:param name="type" value="file"/>
                                        <jsp:param name="id" value="paymentProof"/>
                                        <jsp:param name="label" value="Attach Receipt/Proof (Optional)"/>
                                        <jsp:param name="accept" value="image/*,.pdf"/>
                                        <jsp:param name="helperText" value="Supported formats: JPG, PNG, PDF (Max 5MB)"/>
                                        <jsp:param name="class" value="col-md-12"/>
                                    </jsp:include>
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
    <jsp:include page="/dashboard/components/ui_component/modal.jsp"/>
    <jsp:include page="/dashboard/components/ui_component/toast-notification.jsp"/>
    
    <jsp:include page="/dashboard/components/ui_component/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/record-payment.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/payment-history.js"></script>
</body>
</html>
