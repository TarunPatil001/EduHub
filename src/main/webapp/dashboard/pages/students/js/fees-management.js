/**
 * Fees Management Page - JavaScript Functions
 */

(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const itemsPerPage = document.getElementById('itemsPerPage');
    const resetFilters = document.getElementById('resetFilters');
    const selectAll = document.getElementById('selectAll');
    const feesTable = document.getElementById('feesTable');
    const exportBtn = document.getElementById('exportBtn');
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const sendReminderBtn = document.getElementById('sendReminderBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const paginationContainer = document.getElementById('paginationContainer');

    // State from server
    const state = typeof serverPagination !== 'undefined' ? serverPagination : {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
    };

    // Initialize
    function init() {
        attachEventListeners();
        renderPagination();
        updateBulkActionButtons();
        initializeTooltips();
    }

    // Initialize Bootstrap Tooltips
    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Event Listeners
    function attachEventListeners() {
        // Search
        if (searchInput) {
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
            // Optional: Search on blur or with a button, currently Enter key triggers it
        }

        // Filters
        if (courseFilter) {
            courseFilter.addEventListener('change', () => applyFilters(1));
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => applyFilters(1));
        }

        if (itemsPerPage) {
            itemsPerPage.addEventListener('change', () => applyFilters(1));
        }

        // Reset Filters
        if (resetFilters) {
            resetFilters.addEventListener('click', handleResetFilters);
        }

        // Select All Checkbox
        if (selectAll) {
            selectAll.addEventListener('change', handleSelectAll);
        }

        // Fee Checkboxes - using event delegation
        if (feesTable) {
            feesTable.addEventListener('change', function(e) {
                if (e.target.classList.contains('fee-checkbox')) {
                    const checkbox = e.target;
                    const row = checkbox.closest('tr');
                    
                    if (checkbox.checked) {
                        row.classList.add('row-selected');
                    } else {
                        row.classList.remove('row-selected');
                        row.style.backgroundColor = '';
                        row.style.borderLeft = '';
                    }
                    
                    updateSelectAllState();
                    updateBulkActionButtons();
                }
            });
        }

        // Export
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExport);
        }

        // Send Reminders
        if (sendReminderBtn) {
            sendReminderBtn.addEventListener('click', handleSendReminders);
        }

        // Bulk Delete
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', handleBulkDelete);
        }

        // Action Buttons
        attachActionButtons();
    }

    // Attach action button listeners
    function attachActionButtons() {
        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = e.currentTarget.dataset.studentId;
                handleViewDetails(studentId);
            });
        });

        // Payment buttons
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = e.currentTarget.dataset.studentId;
                // Navigate to record payment page with student ID parameter
                window.location.href = `${contextPath}/dashboard/pages/students/record-payment.jsp?studentId=${studentId}`;
            });
        });

        // Reminder buttons
        document.querySelectorAll('.reminder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = e.currentTarget.dataset.studentId;
                handleSendReminder(studentId);
            });
        });
    }

    // Apply Filters (Reload page with params)
    function applyFilters(page) {
        const search = searchInput ? searchInput.value.trim() : '';
        const course = courseFilter ? courseFilter.value : '';
        const status = statusFilter ? statusFilter.value : '';
        const limit = itemsPerPage ? itemsPerPage.value : 10;
        const targetPage = page || state.currentPage;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (course) params.append('course', course);
        if (status) params.append('status', status);
        if (limit != 10) params.append('limit', limit);
        if (targetPage > 1) params.append('page', targetPage);

        window.location.href = `${window.location.pathname}?${params.toString()}`;
    }

    // Reset Filters
    function handleResetFilters() {
        window.location.href = window.location.pathname;
    }

    // Select All Handler
    function handleSelectAll() {
        const isChecked = selectAll.checked;
        const checkboxes = document.querySelectorAll('.fee-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            const row = checkbox.closest('tr');
            if (isChecked) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
                row.style.backgroundColor = '';
                row.style.borderLeft = '';
            }
        });

        updateBulkActionButtons();
    }

    // Update Select All State
    function updateSelectAllState() {
        const checkboxes = Array.from(document.querySelectorAll('.fee-checkbox'));
        const checkedCheckboxes = checkboxes.filter(cb => cb.checked);

        if (selectAll) {
            if (checkboxes.length === 0) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            } else if (checkedCheckboxes.length === 0) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            } else if (checkedCheckboxes.length === checkboxes.length) {
                selectAll.checked = true;
                selectAll.indeterminate = false;
            } else {
                selectAll.checked = false;
                selectAll.indeterminate = true;
            }
        }
    }

    // Update Bulk Action Buttons
    function updateBulkActionButtons() {
        const checkedCount = document.querySelectorAll('.fee-checkbox:checked').length;
        const selectedCountSpan = document.getElementById('selectedCount');
        
        if (!bulkDeleteBtn || !selectedCountSpan) return;
        
        if (checkedCount > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            selectedCountSpan.textContent = checkedCount;
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }

    // Bulk Delete Fee Records
    function handleBulkDelete() {
        const selectedCheckboxes = document.querySelectorAll('.fee-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            if (typeof toast !== 'undefined') toast.warning('Please select fee records to delete');
            return;
        }

        const recordCount = selectedCheckboxes.length;
        
        if (confirm(`Are you sure you want to delete ${recordCount} fee record(s)? This action cannot be undone.`)) {
            // In a real application, you would send an AJAX request to delete the records
            // For now, we'll just reload the page to simulate
            alert(`${recordCount} fee record(s) deleted successfully`);
            window.location.reload();
        }
    }

    // Render Pagination Buttons
    function renderPagination() {
        if (!paginationContainer || state.totalPages <= 1) return;

        let html = '<div class="btn-group" role="group" aria-label="Pagination">';

        // Previous button
        html += `
            <button type="button" class="btn btn-outline-secondary btn-sm ${state.currentPage === 1 ? 'disabled' : ''}" 
                data-page="${state.currentPage - 1}" ${state.currentPage === 1 ? 'disabled' : ''}>
                <i class="bi bi-chevron-left"></i>
            </button>
        `;

        const maxButtons = 5;
        let startPage = Math.max(1, state.currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(state.totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        if (startPage > 1) {
            html += `<button type="button" class="btn btn-outline-primary btn-sm" data-page="1">1</button>`;
            if (startPage > 2) {
                html += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === state.currentPage ? 'btn-primary' : 'btn-outline-primary';
            html += `<button type="button" class="btn ${activeClass} btn-sm" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < state.totalPages) {
            if (endPage < state.totalPages - 1) {
                html += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
            }
            html += `<button type="button" class="btn btn-outline-primary btn-sm" data-page="${state.totalPages}">${state.totalPages}</button>`;
        }

        // Next button
        html += `
            <button type="button" class="btn btn-outline-secondary btn-sm ${state.currentPage === state.totalPages ? 'disabled' : ''}" 
                data-page="${state.currentPage + 1}" ${state.currentPage === state.totalPages ? 'disabled' : ''}>
                <i class="bi bi-chevron-right"></i>
            </button>
        `;

        html += '</div>';
        paginationContainer.innerHTML = html;

        // Add click listeners
        paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.disabled || btn.classList.contains('disabled')) return;
                
                const page = parseInt(btn.dataset.page);
                if (page > 0 && page <= state.totalPages && page !== state.currentPage) {
                    applyFilters(page);
                }
            });
        });
    }

    // View Fee Details
    function handleViewDetails(studentId) {
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (!row) return;

        const cells = row.querySelectorAll('td');
        
        const studentName = cells[1]?.querySelector('.student-name')?.textContent.trim() || '';
        const batchId = cells[2]?.querySelector('.course-badge')?.textContent.trim() || cells[2]?.textContent.trim() || '';
        const totalFeeText = cells[3]?.querySelector('strong')?.textContent.trim() || '₹0';
        const paidAmountText = cells[4]?.querySelector('strong')?.textContent.trim() || '₹0';
        const pendingAmountText = cells[5]?.querySelector('strong')?.textContent.trim() || '₹0';
        const status = cells[6]?.querySelector('.badge')?.textContent.trim() || '';
        const lastPayment = cells[7]?.querySelector('.date-cell span')?.textContent.trim() || cells[7]?.textContent.trim() || '-';
        const dueDate = cells[8]?.querySelector('.due-date-cell span')?.textContent.trim() || cells[8]?.textContent.trim() || '-';

        // Parse amounts for calculations
        const totalFee = parseFloat(totalFeeText.replace(/[₹,]/g, '')) || 0;
        const paidAmount = parseFloat(paidAmountText.replace(/[₹,]/g, '')) || 0;
        const pendingAmount = parseFloat(pendingAmountText.replace(/[₹,]/g, '')) || 0;

        const modalContent = document.getElementById('feeDetailsContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <style>
                    /* Screen Styles */
                    .fee-details-container {
                        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        color: var(--text-primary, #333);
                    }
                    .fee-modal-student-header {
                        border-bottom: 1px solid var(--border-color, #eee);
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .student-info h4 { margin: 0; font-weight: 700; color: var(--text-primary, #2c3e50); }
                    .student-info p { margin: 5px 0 0; color: var(--text-secondary, #7f8c8d); }
                    
                    .fee-modal-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin-bottom: 25px;
                    }
                    .fee-modal-stat-box {
                        background: var(--bg-color, #f8f9fa);
                        border: 1px solid var(--border-color, #e9ecef);
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    }
                    .stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary, #7f8c8d); letter-spacing: 0.5px; margin-bottom: 5px; }
                    .stat-value { font-size: 1.4rem; font-weight: 600; color: var(--text-primary, #2c3e50); }
                    .text-success { color: #10B981 !important; }
                    .text-danger { color: #EF4444 !important; }

                    .payment-history-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 0.9rem;
                    }
                    .payment-history-table th {
                        text-align: left;
                        padding: 10px;
                        background-color: var(--bg-color, #f8f9fa);
                        border-bottom: 2px solid var(--border-color, #dee2e6);
                        color: var(--text-secondary, #495057);
                        font-weight: 600;
                    }
                    .payment-history-table td {
                        padding: 10px;
                        border-bottom: 1px solid var(--border-color, #dee2e6);
                        vertical-align: middle;
                        color: var(--text-primary, #333);
                    }
                    .status-badge {
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }
                    .status-success { background-color: rgba(16, 185, 129, 0.1); color: #10B981; }
                    .status-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; }
                    .status-failed { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; }
                    
                    /* Print Styles */
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #feeDetailsModal, #feeDetailsModal * {
                            visibility: visible;
                        }
                        .modal {
                            position: absolute;
                            left: 0;
                            top: 0;
                            margin: 0;
                            padding: 0;
                            min-height: 100%;
                            width: 100%;
                            background: white;
                            color: black;
                        }
                        .fee-details-container, .student-info h4, .stat-value, .payment-history-table td {
                            color: black !important;
                        }
                        .modal-dialog {
                            max-width: 100%;
                            margin: 0;
                            box-shadow: none;
                        }
                        .modal-content {
                            border: none;
                            box-shadow: none;
                            background: white !important;
                        }
                        .modal-header, .modal-footer, .btn-close, .print-hide {
                            display: none !important;
                        }
                        .modal-body {
                            padding: 0;
                        }
                        #paymentHistoryContainer {
                            max-height: none !important;
                            overflow: visible !important;
                        }
                        .fee-modal-stat-box {
                            border: 1px solid #ccc;
                            background: none !important;
                        }
                        .payment-history-table th {
                            background-color: #f0f0f0 !important;
                            color: black !important;
                            -webkit-print-color-adjust: exact;
                        }
                        /* Add print header */
                        .print-only-header {
                            display: block !important;
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                        }
                        .print-only-header h2 { margin: 0; font-size: 24px; }
                        .print-only-header p { margin: 5px 0 0; color: #666; }
                    }
                    .print-only-header { display: none; }
                </style>

                <div class="fee-details-container">
                    <!-- Print Header -->
                    <div class="print-only-header">
                        <h2>Fee Statement</h2>
                        <p>EduHub Institute Management System</p>
                        <p style="font-size: 0.9rem; margin-top: 5px;">Date: ${new Date().toLocaleDateString()}</p>
                    </div>

                    <!-- Student Header -->
                    <div class="fee-modal-student-header">
                        <div class="student-info">
                            <h4>${studentName}</h4>
                            <p>${batchId}</p>
                        </div>
                        <div class="text-end">
                            <div style="font-size: 0.9rem; color: #7f8c8d;">Payment Status</div>
                            <div class="badge ${pendingAmount <= 0 ? 'bg-success' : 'bg-warning text-dark'}" style="font-size: 0.9rem;">
                                ${pendingAmount <= 0 ? 'Fully Paid' : 'Balance Due'}
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="fee-modal-stats-grid">
                        <div class="fee-modal-stat-box">
                            <div class="stat-label">Total Fee</div>
                            <div class="stat-value">${totalFeeText}</div>
                        </div>
                        <div class="fee-modal-stat-box">
                            <div class="stat-label">Paid Amount</div>
                            <div class="stat-value text-success">${paidAmountText}</div>
                        </div>
                        <div class="fee-modal-stat-box">
                            <div class="stat-label">Pending Balance</div>
                            <div class="stat-value text-danger">${pendingAmountText}</div>
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="row mb-4">
                        <div class="col-6">
                            <small class="text-muted d-block">Last Payment Date</small>
                            <strong>${lastPayment}</strong>
                        </div>
                        <div class="col-6 text-end">
                            <small class="text-muted d-block">Due Date</small>
                            <strong class="${dueDate !== '-' ? 'text-danger' : ''}">${dueDate}</strong>
                        </div>
                    </div>

                    <!-- History Table -->
                    <div>
                        <h5 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; color: #2c3e50;">Payment History</h5>
                        <div id="paymentHistoryContainer" style="max-height: 300px; overflow-y: auto;">
                            <div class="text-center py-3 text-muted">
                                <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                                <p class="small mb-0">Loading history...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Fetch and display payment history
            fetchPaymentHistory(studentId);
        }

        const modal = new bootstrap.Modal(document.getElementById('feeDetailsModal'));
        modal.show();
    }

    // Fetch Payment History for Student
    function fetchPaymentHistory(studentId) {
        const historyContainer = document.getElementById('paymentHistoryContainer');
        if (!historyContainer) return;

        fetch(`${contextPath}/fees/history?studentId=${studentId}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch payment history');
                return response.json();
            })
            .then(response => {
                console.log('Payment history response:', response); // Debug log
                if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
                    renderPaymentHistoryInModal(response.data);
                } else {
                    historyContainer.innerHTML = `
                        <div class="text-center py-4 text-muted">
                            <i class="bi bi-receipt" style="font-size: 1.5rem; opacity: 0.5;"></i>
                            <p class="small mb-0 mt-2">No payment history found</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching payment history:', error);
                historyContainer.innerHTML = `
                    <div class="alert alert-danger border-0 shadow-sm m-3">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-exclamation-circle me-2"></i>
                            <small>Failed to load history</small>
                        </div>
                    </div>
                `;
            });
    }

    // Render Payment History in Modal
    function renderPaymentHistoryInModal(transactions) {
        const historyContainer = document.getElementById('paymentHistoryContainer');
        if (!historyContainer) return;

        let html = `
            <table class="payment-history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Receipt No</th>
                        <th>Mode</th>
                        <th class="text-end">Amount</th>
                        <th class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        transactions.forEach((txn) => {
            const date = new Date(txn.transactionDate);
            const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            
            let statusClass = 'status-pending';
            if (txn.status === 'Success') statusClass = 'status-success';
            else if (txn.status === 'Failed') statusClass = 'status-failed';
            
            // Display full receipt number if it's a custom RCT ID, otherwise truncate UUID
            const displayId = txn.transactionId.startsWith('RCT') ? txn.transactionId : '#' + txn.transactionId.substring(0, 8);
            
            html += `
                <tr>
                    <td>${formattedDate}</td>
                    <td>${displayId}</td>
                    <td>${txn.paymentMode}</td>
                    <td class="text-end" style="font-weight: 600;">₹${txn.amount.toLocaleString('en-IN')}</td>
                    <td class="text-center">
                        <span class="status-badge ${statusClass}">${txn.status}</span>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="mt-3 text-muted small fst-italic print-hide">
                * This is a computer generated statement.
            </div>
        `;

        historyContainer.innerHTML = html;
    }

    // Send Reminder to Student
    function handleSendReminder(studentId) {
        if (confirm(`Send payment reminder to student?`)) {
            // In a real app, send AJAX request
            if (typeof toast !== 'undefined') toast.success('Payment reminder sent successfully');
        }
    }

    // Send Reminders to All Pending
    function handleSendReminders() {
        if (confirm(`Are you sure you want to send payment reminders to all students with pending payments?`)) {
            // In a real app, send AJAX request
            if (typeof toast !== 'undefined') toast.success('Payment reminders sent successfully');
        }
    }

    // Export Data
    function handleExport() {
        const visibleRows = Array.from(feesTable.querySelectorAll('tbody tr'));

        if (visibleRows.length === 0) {
            if (typeof toast !== 'undefined') toast.warning('No data to export');
            return;
        }

        // Create CSV
        let csv = 'Student Name,Batch ID,Total Fee,Paid Amount,Pending,Status,Last Payment,Due Date\n';
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            // Adjusted indices
            const name = cells[1]?.querySelector('.student-name')?.textContent.trim() || '';
            const batchId = cells[2]?.textContent.trim() || '';
            const totalFee = cells[3]?.textContent.trim() || '';
            const paidAmount = cells[4]?.textContent.trim() || '';
            const pending = cells[5]?.textContent.trim() || '';
            const status = cells[6]?.textContent.trim() || '';
            const lastPayment = cells[7]?.textContent.trim() || '';
            const dueDate = cells[8]?.textContent.trim() || '';
            
            csv += `"${name}","${batchId}","${totalFee}","${paidAmount}","${pending}","${status}","${lastPayment}","${dueDate}"\n`;
        });

        downloadCSV(csv, 'fees-management-export.csv');
    }

    // Download CSV
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
