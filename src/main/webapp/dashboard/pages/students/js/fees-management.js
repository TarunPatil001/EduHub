/**
 * Fees Management Page - JavaScript Functions
 */

(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const entriesPerPage = document.getElementById('entriesPerPage');
    const resetFilters = document.getElementById('resetFilters');
    const feesTable = document.getElementById('feesTable');
    const exportBtn = document.getElementById('exportBtn');
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const sendReminderBtn = document.getElementById('sendReminderBtn');

    // State
    let currentPage = 1;
    let filteredRows = [];
    let allRows = [];

    // Initialize
    function init() {
        allRows = Array.from(feesTable.querySelectorAll('tbody tr'));
        filteredRows = [...allRows];
        
        attachEventListeners();
        updatePagination();
    }

    // Event Listeners
    function attachEventListeners() {
        // Search
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Filters
        if (courseFilter) {
            courseFilter.addEventListener('change', handleFilter);
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', handleFilter);
        }

        if (entriesPerPage) {
            entriesPerPage.addEventListener('change', () => {
                currentPage = 1;
                updatePagination();
            });
        }

        // Reset Filters
        if (resetFilters) {
            resetFilters.addEventListener('click', handleResetFilters);
        }

        // Export
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExport);
        }

        // Send Reminders
        if (sendReminderBtn) {
            sendReminderBtn.addEventListener('click', handleSendReminders);
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
                window.location.href = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/record-payment.jsp?studentId=${studentId}`;
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

    // Search Handler
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        filteredRows = allRows.filter(row => {
            const text = row.textContent.toLowerCase();
            return text.includes(searchTerm);
        });

        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Filter Handler
    function handleFilter() {
        const courseValue = courseFilter ? courseFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        filteredRows = allRows.filter(row => {
            const rowCourse = row.dataset.course || '';
            const rowStatus = row.dataset.status || '';

            const courseMatch = !courseValue || rowCourse === courseValue;
            const statusMatch = !statusValue || rowStatus === statusValue;

            return courseMatch && statusMatch;
        });

        // Apply search if active
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredRows = filteredRows.filter(row => {
                return row.textContent.toLowerCase().includes(searchTerm);
            });
        }

        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Apply Filters and Display
    function applyFiltersAndDisplay() {
        // Hide all rows first
        allRows.forEach(row => row.style.display = 'none');

        // Show filtered rows
        filteredRows.forEach(row => row.style.display = '');

        updatePagination();
        showEmptyState();
    }

    // Reset Filters
    function handleResetFilters() {
        if (searchInput) searchInput.value = '';
        if (courseFilter) courseFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        filteredRows = [...allRows];
        currentPage = 1;
        applyFiltersAndDisplay();
        
        Toast.info('Filters reset successfully');
    }

    // Pagination
    function updatePagination() {
        const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
        const totalEntries = filteredRows.length;
        const totalPages = Math.ceil(totalEntries / perPage);

        // Hide all rows
        allRows.forEach(row => row.style.display = 'none');

        // Show current page rows
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageRows = filteredRows.slice(start, end);
        
        pageRows.forEach(row => row.style.display = '');

        // Update pagination info
        updatePaginationInfo(start, end, totalEntries);
        renderPaginationButtons(totalPages);
    }

    // Update Pagination Info
    function updatePaginationInfo(start, end, total) {
        const showingStart = document.getElementById('showingStart');
        const showingEnd = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');

        if (showingStart) showingStart.textContent = total > 0 ? start + 1 : 0;
        if (showingEnd) showingEnd.textContent = Math.min(end, total);
        if (totalEntriesEl) totalEntriesEl.textContent = total;
    }

    // Render Pagination Buttons
    function renderPaginationButtons(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        pagination.innerHTML = '';

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
        pagination.appendChild(prevLi);

        // Page numbers
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                updatePagination();
            });
            
            pagination.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
        pagination.appendChild(nextLi);
    }

    // Show Empty State
    function showEmptyState() {
        const tbody = feesTable.querySelector('tbody');
        let emptyRow = tbody.querySelector('.empty-state-row');

        if (filteredRows.length === 0) {
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-state-row';
                emptyRow.innerHTML = `
                    <td colspan="10">
                        <div class="empty-state">
                            <i class="bi bi-inbox"></i>
                            <h4>No Records Found</h4>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    </td>
                `;
                tbody.appendChild(emptyRow);
            }
            emptyRow.style.display = '';
        } else if (emptyRow) {
            emptyRow.style.display = 'none';
        }
    }

    // View Fee Details
    function handleViewDetails(studentId) {
        const row = document.querySelector(`[data-student-id="${studentId}"]`)?.closest('tr');
        if (!row) return;

        const cells = row.querySelectorAll('td');
        const studentName = row.querySelector('.student-info span')?.textContent || '';
        const course = cells[2]?.textContent || '';
        const totalFee = cells[3]?.textContent || '';
        const paidAmount = cells[4]?.textContent || '';
        const pendingAmount = cells[5]?.textContent || '';
        const status = cells[6]?.textContent || '';
        const lastPayment = cells[7]?.textContent || '';
        const dueDate = cells[8]?.textContent || '';

        const modalContent = document.getElementById('feeDetailsContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="row g-3">
                    <div class="col-md-6">
                        <h6 class="text-muted">Student ID</h6>
                        <p class="fw-bold">${studentId}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Student Name</h6>
                        <p class="fw-bold">${studentName}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Course</h6>
                        <p>${course}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Status</h6>
                        <p>${status}</p>
                    </div>
                    <div class="col-md-4">
                        <h6 class="text-muted">Total Fee</h6>
                        <p class="fw-bold">${totalFee}</p>
                    </div>
                    <div class="col-md-4">
                        <h6 class="text-muted">Paid Amount</h6>
                        <p class="text-success fw-bold">${paidAmount}</p>
                    </div>
                    <div class="col-md-4">
                        <h6 class="text-muted">Pending Amount</h6>
                        <p class="text-danger fw-bold">${pendingAmount}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Last Payment Date</h6>
                        <p>${lastPayment}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Due Date</h6>
                        <p class="text-warning">${dueDate}</p>
                    </div>
                </div>
            `;
        }

        const modal = new bootstrap.Modal(document.getElementById('feeDetailsModal'));
        modal.show();
    }

    // Send Reminder to Student
    function handleSendReminder(studentId) {
        showConfirmationModal({
            title: 'Send Payment Reminder',
            message: `Send fee payment reminder to student ${studentId}?`,
            confirmText: 'Send Reminder',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            icon: 'bi-envelope text-primary',
            onConfirm: function() {
                Toast.success(`Payment reminder sent to ${studentId}`);
            }
        });
    }

    // Send Reminders to All Pending
    function handleSendReminders() {
        const pendingCount = filteredRows.filter(row => {
            const status = row.dataset.status;
            return status === 'Pending' || status === 'Partial' || status === 'Overdue' || status === 'Unpaid';
        }).length;

        if (pendingCount === 0) {
            Toast.warning('No students with pending payments found');
            return;
        }

        showConfirmationModal({
            title: 'Send Payment Reminders',
            message: `Send payment reminders to ${pendingCount} student${pendingCount > 1 ? 's' : ''} with pending payments?`,
            confirmText: 'Send All',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            icon: 'bi-envelope text-primary',
            onConfirm: function() {
                Toast.success(`Payment reminders sent to ${pendingCount} student${pendingCount > 1 ? 's' : ''}`);
            }
        });
    }

    // Export Data
    function handleExport() {
        const visibleRows = Array.from(
            feesTable.querySelectorAll('tbody tr:not([style*="display: none"]):not(.empty-state-row)')
        );

        if (visibleRows.length === 0) {
            Toast.warning('No data to export');
            return;
        }

        // Create CSV
        let csv = 'Student ID,Student Name,Course,Total Fee,Paid Amount,Pending,Status,Last Payment,Due Date\n';
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const id = cells[0]?.textContent.trim() || '';
            const name = row.querySelector('.student-info span')?.textContent.trim() || '';
            const course = cells[2]?.textContent.trim() || '';
            const totalFee = cells[3]?.textContent.trim() || '';
            const paidAmount = cells[4]?.textContent.trim() || '';
            const pending = cells[5]?.textContent.trim() || '';
            const status = cells[6]?.textContent.trim() || '';
            const lastPayment = cells[7]?.textContent.trim() || '';
            const dueDate = cells[8]?.textContent.trim() || '';
            
            csv += `"${id}","${name}","${course}","${totalFee}","${paidAmount}","${pending}","${status}","${lastPayment}","${dueDate}"\n`;
        });

        // Download CSV
        downloadCSV(csv, 'fees-management-export.csv');
        Toast.success('Fee data exported successfully');
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

    // Debounce Helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
