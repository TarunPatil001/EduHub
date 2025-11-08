/**
 * Payment History Functions
 * Handles view, edit, delete, and refresh operations for payment history
 */

// Dummy payment data for each student
const studentPayments = {
    'STU001': [
        { receiptNumber: 'RCT-20251108-001', amount: 25000, date: 'Nov 8, 2025', method: 'Online Transfer', status: 'Completed' },
        { receiptNumber: 'RCT-20251105-018', amount: 25000, date: 'Nov 5, 2025', method: 'Cash', status: 'Completed' },
		{ receiptNumber: 'RCT-20251105-018', amount: 25000, date: 'Nov 5, 2025', method: 'Cash', status: 'Completed' },
		{ receiptNumber: 'RCT-20251105-018', amount: 25000, date: 'Nov 5, 2025', method: 'Cash', status: 'Completed' },
		{ receiptNumber: 'RCT-20251105-018', amount: 25000, date: 'Nov 5, 2025', method: 'Cash', status: 'Completed' }
    ],
    'STU002': [
        { receiptNumber: 'RCT-20251107-022', amount: 15000, date: 'Nov 7, 2025', method: 'Online Transfer', status: 'Completed' },
        { receiptNumber: 'RCT-20251103-012', amount: 15000, date: 'Nov 3, 2025', method: 'Debit Card', status: 'Completed' }
    ],
    'STU003': [
        { receiptNumber: 'RCT-20251101-005', amount: 20000, date: 'Nov 1, 2025', method: 'Cash', status: 'Completed' }
    ],
    'STU004': [],
    'STU005': [
        { receiptNumber: 'RCT-20251020-045', amount: 50000, date: 'Oct 20, 2025', method: 'Online Transfer', status: 'Completed' }
    ],
    'STU006': [
        { receiptNumber: 'RCT-20251106-025', amount: 20000, date: 'Nov 6, 2025', method: 'Cheque', status: 'Completed' },
        { receiptNumber: 'RCT-20251025-032', amount: 15000, date: 'Oct 25, 2025', method: 'Cash', status: 'Completed' }
    ],
    'STU007': [
        { receiptNumber: 'RCT-20251030-038', amount: 42000, date: 'Oct 30, 2025', method: 'Online Transfer', status: 'Completed' }
    ],
    'STU008': [
        { receiptNumber: 'RCT-20251028-035', amount: 25000, date: 'Oct 28, 2025', method: 'Debit Card', status: 'Completed' }
    ],
    'STU009': [],
    'STU010': [
        { receiptNumber: 'RCT-20251102-008', amount: 30000, date: 'Nov 2, 2025', method: 'Online Transfer', status: 'Completed' },
        { receiptNumber: 'RCT-20251015-020', amount: 30000, date: 'Oct 15, 2025', method: 'Cash', status: 'Completed' }
    ]
};

/**
 * Refresh payment history list for selected student
 */
function refreshPaymentHistory(studentId) {
    const historyList = document.getElementById('paymentHistoryList');
    const historyTitle = document.getElementById('paymentHistoryTitle');
    const refreshBtn = document.getElementById('refreshPaymentBtn');
    const viewAllBtn = document.getElementById('viewAllPaymentsBtn');
    
    if (!historyList) return;
    
    // Show loading state
    historyList.style.opacity = '0.5';
    
    // Simulate API call to refresh data
    setTimeout(() => {
        if (!studentId) {
            // No student selected - show message
            historyList.innerHTML = `
                <div class="alert alert-info mb-0" id="noStudentSelectedMsg">
                    <i class="bi bi-info-circle me-2"></i>
                    Please select a student to view their payment history
                </div>
            `;
            if (historyTitle) historyTitle.textContent = 'Select a Student';
            if (refreshBtn) refreshBtn.style.display = 'none';
            if (viewAllBtn) viewAllBtn.style.display = 'none';
        } else {
            // Load payment history for selected student
            loadStudentPaymentHistory(studentId);
            if (historyTitle) historyTitle.textContent = 'Payment History';
            if (refreshBtn) refreshBtn.style.display = 'block';
            if (viewAllBtn) viewAllBtn.style.display = 'block';
            Toast.success('Payment history refreshed');
        }
        
        historyList.style.opacity = '1';
    }, 500);
}

/**
 * Load payment history for a specific student
 */
function loadStudentPaymentHistory(studentId, showAll = false) {
    const historyList = document.getElementById('paymentHistoryList');
    if (!historyList) return;
    
    const payments = studentPayments[studentId] || [];
    
    if (payments.length === 0) {
        historyList.innerHTML = `
            <div class="alert alert-warning mb-0">
                <i class="bi bi-exclamation-triangle"></i>
                No payment records found
            </div>
        `;
        return;
    }
    
    // Determine how many payments to show
    const paymentsToShow = showAll ? payments : payments.slice(0, 3);
    const hasMore = payments.length > 3;
    
    // Build payment history HTML with payment app style structure
    let html = '';
    paymentsToShow.forEach(payment => {
        html += `
            <div class="payment-history-item">
                <div class="payment-item-main">
                    <div class="payment-icon"></div>
                    <div class="payment-info">
                        <div class="payment-top-row">
                            <div class="payment-student">${payment.method}</div>
                            <div class="payment-amount">₹${payment.amount.toLocaleString('en-IN')}</div>
                        </div>
                        <div class="payment-bottom-row">
                            <div class="payment-receipt">${payment.receiptNumber}</div>
                            <div class="payment-date">${payment.date}</div>
                        </div>
                    </div>
                </div>
                <div class="payment-actions">
                    <button class="btn-icon" onclick="viewPayment('${payment.receiptNumber}')" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editPayment('${payment.receiptNumber}')" title="Edit Payment">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-icon text-danger" onclick="deletePayment('${payment.receiptNumber}')" title="Delete Payment">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
    
    // Update toggle button visibility and state
    const viewAllBtn = document.getElementById('viewAllPaymentsBtn');
    const toggleBtn = document.getElementById('toggleHistoryBtn');
    const toggleText = document.getElementById('toggleHistoryText');
    const toggleIcon = document.getElementById('toggleHistoryIcon');
    
    if (hasMore && viewAllBtn) {
        viewAllBtn.style.display = 'block';
        if (toggleText && toggleIcon) {
            if (showAll) {
                toggleText.textContent = 'Show Less';
                toggleIcon.className = 'bi bi-chevron-up';
            } else {
                toggleText.textContent = `View All Payments (${payments.length})`;
                toggleIcon.className = 'bi bi-chevron-down';
            }
        }
    } else if (!hasMore && viewAllBtn) {
        viewAllBtn.style.display = 'none';
    }
}

/**
 * Toggle between showing limited and full payment history
 */
let isHistoryExpanded = false;

function toggleFullPaymentHistory() {
    const selectedStudentId = document.getElementById('selectedStudentId')?.value;
    
    if (!selectedStudentId) {
        Toast.warning('Please select a student first');
        return;
    }
    
    isHistoryExpanded = !isHistoryExpanded;
    
    // Add smooth transition
    const historyList = document.getElementById('paymentHistoryList');
    if (historyList) {
        historyList.style.opacity = '0.5';
    }
    
    setTimeout(() => {
        loadStudentPaymentHistory(selectedStudentId, isHistoryExpanded);
        if (historyList) {
            historyList.style.opacity = '1';
        }
    }, 200);
}

/**
 * View payment details
 */
function viewPayment(receiptNumber) {
    // Simulate fetching payment data
    const paymentData = {
        receiptNumber: receiptNumber,
        studentId: 'STU001',
        studentName: 'Aarav Sharma',
        amount: '₹5,000',
        date: 'Nov 8, 2025',
        method: 'Online Transfer',
        transactionId: 'TXN123456789',
        status: 'Completed'
    };
    
    showModal({
        title: `Payment Details - ${receiptNumber}`,
        message: `
            <div class="payment-details-modal">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="alert alert-success mb-3">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            <strong>Payment Completed Successfully</strong>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Receipt Number</label>
                        <p class="mb-0 fw-bold">${paymentData.receiptNumber}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Payment Date</label>
                        <p class="mb-0">${paymentData.date}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Student ID</label>
                        <p class="mb-0">${paymentData.studentId}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Student Name</label>
                        <p class="mb-0">${paymentData.studentName}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Amount</label>
                        <p class="mb-0 fw-bold text-success fs-5">${paymentData.amount}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Payment Method</label>
                        <p class="mb-0">${paymentData.method}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Transaction ID</label>
                        <p class="mb-0"><code>${paymentData.transactionId}</code></p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Status</label>
                        <p class="mb-0"><span class="badge bg-success">${paymentData.status}</span></p>
                    </div>
                </div>
                <hr>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-outline-primary" onclick="printReceipt('${receiptNumber}')">
                        <i class="bi bi-printer"></i> Print Receipt
                    </button>
                    <button class="btn btn-primary" onclick="downloadReceipt('${receiptNumber}')">
                        <i class="bi bi-download"></i> Download PDF
                    </button>
                </div>
            </div>
        `,
        size: 'lg'
    });
}

/**
 * Edit payment details
 */
function editPayment(receiptNumber) {
    showModal({
        title: `Edit Payment - ${receiptNumber}`,
        message: `
            <form id="editPaymentForm">
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Note:</strong> Editing payment records requires proper authorization.
                </div>
                <div class="mb-3">
                    <label class="form-label">Receipt Number</label>
                    <input type="text" class="form-control" value="${receiptNumber}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label">Amount <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="editAmount" value="5000" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Payment Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="editDate" value="2025-11-08" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Payment Method <span class="text-danger">*</span></label>
                    <select class="form-select" id="editMethod" required>
                        <option value="Cash">Cash</option>
                        <option value="Online Transfer" selected>Online Transfer</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Transaction ID</label>
                    <input type="text" class="form-control" id="editTransactionId" value="TXN123456789">
                </div>
                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="editNotes" rows="2"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Reason for Edit <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="editReason" rows="2" placeholder="Please provide a reason for editing this payment record..." required></textarea>
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-check-circle"></i> Update Payment
                    </button>
                </div>
            </form>
        `,
        size: 'md',
        showCloseButton: true
    });
    
    // Handle form submission
    setTimeout(() => {
        const form = document.getElementById('editPaymentForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                updatePayment(receiptNumber);
            });
        }
    }, 100);
}

/**
 * Update payment after editing
 */
function updatePayment(receiptNumber) {
    const amount = document.getElementById('editAmount').value;
    const reason = document.getElementById('editReason').value;
    
    if (!reason || reason.trim().length < 10) {
        Toast.error('Please provide a detailed reason for editing (minimum 10 characters)');
        return;
    }
    
    // Show loading
    showLoadingOverlay('Updating payment...');
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingOverlay();
        closeModal();
        Toast.success('Payment updated successfully');
        refreshPaymentHistory();
    }, 1000);
}

/**
 * Delete payment record
 */
function deletePayment(receiptNumber) {
    showConfirmationModal({
        title: 'Delete Payment Record',
        message: `
            <div class="alert alert-danger mb-3">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Warning:</strong> This action cannot be undone!
            </div>
            <p class="mb-2">Are you sure you want to delete this payment record?</p>
            <p class="mb-3"><strong>Receipt Number:</strong> <code class="text-danger">${receiptNumber}</code></p>
            <div class="mb-0">
                <label class="form-label fw-semibold">Reason for Deletion <span class="text-danger">*</span></label>
                <textarea class="form-control" id="deleteReason" rows="3" placeholder="Please provide a detailed reason for deleting this payment record (minimum 10 characters)..." required></textarea>
                <div class="invalid-feedback" id="deleteReasonError" style="display: none;">
                    Please provide a detailed reason for deletion (minimum 10 characters)
                </div>
            </div>
        `,
        confirmText: '<i class="bi bi-trash"></i> Delete Payment',
        cancelText: 'Cancel',
        confirmClass: 'btn-danger',
        icon: 'bi-trash-fill text-danger',
        onConfirm: function() {
            const reasonInput = document.getElementById('deleteReason');
            const reasonError = document.getElementById('deleteReasonError');
            const reason = reasonInput?.value || '';
            
            // Validate reason
            if (!reason || reason.trim().length < 10) {
                // Show validation error
                if (reasonInput) {
                    reasonInput.classList.add('is-invalid');
                    reasonInput.focus();
                }
                if (reasonError) {
                    reasonError.style.display = 'block';
                }
                Toast.error('Please provide a detailed reason for deletion (minimum 10 characters)');
                
                // Return false to prevent modal from closing
                return false;
            }
            
            // Clear validation state
            if (reasonInput) {
                reasonInput.classList.remove('is-invalid');
            }
            if (reasonError) {
                reasonError.style.display = 'none';
            }
            
            // Show loading
            showLoadingOverlay('Deleting payment...');
            
            // Simulate API call
            setTimeout(() => {
                hideLoadingOverlay();
                Toast.success('Payment record deleted successfully');
                
                // Refresh payment history with current student ID
                const selectedStudentId = document.getElementById('selectedStudentId')?.value;
                if (selectedStudentId && typeof refreshPaymentHistory === 'function') {
                    refreshPaymentHistory(selectedStudentId);
                }
            }, 1000);
            
            // Return true to allow modal to close
            return true;
        }
    });
}

/**
 * Print receipt
 */
function printReceipt(receiptNumber) {
    Toast.info('Opening print preview for ' + receiptNumber);
    // In production, this would open a print-formatted page
}

/**
 * Download receipt as PDF
 */
function downloadReceipt(receiptNumber) {
    Toast.success('Downloading ' + receiptNumber + '.pdf');
    // In production, this would generate and download a PDF
}

/**
 * Helper: Show loading overlay
 */
function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="mt-3 text-white">${message || 'Processing...'}</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Helper: Hide loading overlay
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300);
    }
}

/**
 * Helper: Close modal
 */
function closeModal() {
    const modal = document.querySelector('.modal.show');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    }
}
