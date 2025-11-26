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
    const selectAll = document.getElementById('selectAll');
    const feesTable = document.getElementById('feesTable');
    const exportBtn = document.getElementById('exportBtn');
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const sendReminderBtn = document.getElementById('sendReminderBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

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
        showEmptyState(); // Show empty state if no records
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

        // Select All Checkbox
        if (selectAll) {
            selectAll.addEventListener('change', handleSelectAll);
        }

        // Fee Checkboxes - using event delegation
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
        allRows.forEach(row => {
            row.style.display = 'none';
            // Maintain row highlighting if checkbox is checked
            const checkbox = row.querySelector('.fee-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            }
        });

        // Show filtered rows
        filteredRows.forEach(row => row.style.display = '');

        updatePagination();
        showEmptyState();
        updateSelectAllState();
        updateBulkActionButtons();
    }

    // Reset Filters
    function handleResetFilters() {
        if (searchInput) searchInput.value = '';
        if (courseFilter) courseFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        filteredRows = [...allRows];
        currentPage = 1;
        applyFiltersAndDisplay();
        
        toast('Filters reset successfully', { icon: 'ℹ️' });
    }

    // Select All Handler
    function handleSelectAll() {
        const isChecked = selectAll.checked;
        const visibleRows = Array.from(feesTable.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        visibleRows.forEach(row => {
            const checkbox = row.querySelector('.fee-checkbox');
            if (checkbox) {
                checkbox.checked = isChecked;
                
                if (isChecked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
            }
        });

        updateBulkActionButtons();
    }

    // Update Select All State
    function updateSelectAllState() {
        const visibleRows = Array.from(feesTable.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        const visibleCheckboxes = visibleRows.map(row => row.querySelector('.fee-checkbox')).filter(cb => cb);
        const checkedCheckboxes = visibleCheckboxes.filter(cb => cb.checked);

        if (selectAll) {
            if (visibleCheckboxes.length === 0) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            } else if (checkedCheckboxes.length === 0) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            } else if (checkedCheckboxes.length === visibleCheckboxes.length) {
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
        // Only count visible checkboxes (not hidden by pagination or filters)
        const visibleRows = Array.from(feesTable.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        const checkedCount = visibleRows.filter(row => {
            const checkbox = row.querySelector('.fee-checkbox');
            return checkbox && checkbox.checked;
        }).length;
        
        const selectedCountSpan = document.getElementById('selectedCount');
        
        if (!bulkDeleteBtn || !selectedCountSpan) return;
        
        if (checkedCount > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            selectedCountSpan.textContent = checkedCount;
        } else {
            bulkDeleteBtn.style.display = 'none';
            if (selectAll) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            }
        }
    }

    // Bulk Delete Fee Records
    function handleBulkDelete() {
        const selectedCheckboxes = document.querySelectorAll('.fee-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            toast('Please select fee records to delete', { icon: '⚠️' });
            return;
        }

        const recordCount = selectedCheckboxes.length;
        const studentNames = [];
        
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const nameEl = row.querySelector('.student-info span');
            if (nameEl) {
                studentNames.push(nameEl.textContent.trim());
            }
        });

        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Delete Fee Records',
                message: `Are you sure you want to delete <strong>${recordCount} fee record(s)</strong>?<br><br>This action cannot be undone.`,
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                confirmClass: 'btn-danger',
                icon: 'bi-trash text-danger',
                onConfirm: function() {
                    // Remove all selected rows
                    selectedCheckboxes.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        if (row) {
                            row.remove();
                        }
                    });
                    
                    // Update arrays
                    allRows = Array.from(feesTable.querySelectorAll('tbody tr:not(.empty-state-row)'));
                    filteredRows = [...allRows];
                    
                    // Reset checkboxes
                    if (selectAll) {
                        selectAll.checked = false;
                        selectAll.indeterminate = false;
                    }
                    
                    // Hide bulk delete button
                    if (bulkDeleteBtn) {
                        bulkDeleteBtn.style.display = 'none';
                    }
                    
                    // Reset to page 1 if current page is now empty
                    const totalPages = Math.ceil(filteredRows.length / entriesPerPage);
                    if (currentPage > totalPages) {
                        currentPage = Math.max(1, totalPages);
                    }
                    
                    // Update view
                    updatePagination();
                    showEmptyState();
                    
                    toast.success(recordCount + ' fee record(s) deleted successfully');
                }
            });
        } else {
            // Fallback to confirm dialog
            if (confirm(`Are you sure you want to delete ${recordCount} fee record(s)? This action cannot be undone.`)) {
                selectedCheckboxes.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    if (row) row.remove();
                });
                allRows = Array.from(feesTable.querySelectorAll('tbody tr:not(.empty-state-row)'));
                filteredRows = [...allRows];
                if (selectAll) {
                    selectAll.checked = false;
                    selectAll.indeterminate = false;
                }
                if (bulkDeleteBtn) {
                    bulkDeleteBtn.style.display = 'none';
                }
                updatePagination();
                showEmptyState();
                alert(`${recordCount} fee record(s) deleted successfully`);
            }
        }
    }

    // Pagination
    function updatePagination() {
        const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
        const totalEntries = filteredRows.length;
        const totalPages = Math.ceil(totalEntries / perPage);

        // Hide all rows and maintain selection state
        allRows.forEach(row => {
            row.style.display = 'none';
            // Maintain row highlighting if checkbox is checked
            const checkbox = row.querySelector('.fee-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
            }
        });

        // Show current page rows
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageRows = filteredRows.slice(start, end);
        
        pageRows.forEach(row => row.style.display = '');

        // Update pagination info
        updatePaginationInfo(start, end, totalEntries);
        renderPaginationButtons(totalPages);
        
        // Update select all state
        updateSelectAllState();
        
        // Update bulk action buttons to reflect current state
        updateBulkActionButtons();
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
        const thead = feesTable.querySelector('thead');
        const tableResponsive = feesTable.closest('.table-responsive');
        let emptyRow = tbody.querySelector('.empty-state-row');

        if (filteredRows.length === 0) {
            // Check if it's a completely empty table or just filtered results
            const isCompletelyEmpty = allRows.length === 0;
            const hasActiveFilters = (searchInput && searchInput.value.trim()) || 
                                    (courseFilter && courseFilter.value) || 
                                    (statusFilter && statusFilter.value);
            
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-state-row';
                tbody.appendChild(emptyRow);
            }
            
            // Hide table header for both empty table and no search results
            if (thead) thead.style.display = 'none';
            if (tableResponsive) {
                tableResponsive.style.overflowX = 'visible';
                tableResponsive.style.overflowY = 'visible';
            }
            
            // Update content based on whether table is empty or just filtered
            if (isCompletelyEmpty) {
                emptyRow.innerHTML = `
                    <td colspan="11" class="text-center py-5">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="bi bi-cash-coin"></i>
                            </div>
                            <h4 class="empty-state-title">No Fee Records Yet</h4>
                            <p class="empty-state-text">Start by recording your first student fee payment</p>
                            <a href="${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/record-payment.jsp" class="btn btn-success mt-3">
                                <i class="bi bi-plus-lg me-2"></i>Record First Payment
                            </a>
                        </div>
                    </td>
                `;
            } else if (hasActiveFilters) {
                emptyRow.innerHTML = `
                    <td colspan="11" class="text-center py-5">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="bi bi-search"></i>
                            </div>
                            <h4 class="empty-state-title">No Fee Records Found</h4>
                            <p class="empty-state-text">No records match your current search or filter criteria</p>
                            <button class="btn btn-outline-primary mt-3" id="emptyResetBtn">
                                <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
                            </button>
                        </div>
                    </td>
                `;
                
                // Attach click handler to reset button in empty state
                const emptyResetBtn = emptyRow.querySelector('#emptyResetBtn');
                if (emptyResetBtn) {
                    emptyResetBtn.addEventListener('click', handleResetFilters);
                }
            }
            
            emptyRow.style.display = '';
        } else {
            // Show table header and restore scroll when there are records
            if (thead) thead.style.display = '';
            if (tableResponsive) {
                tableResponsive.style.overflowX = 'auto';
                tableResponsive.style.overflowY = 'visible';
            }
            if (emptyRow) {
                emptyRow.style.display = 'none';
            }
        }
    }

    // View Fee Details
    function handleViewDetails(studentId) {
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (!row) return;

        const cells = row.querySelectorAll('td');
        // Account for checkbox column (index 0)
        const studentIdText = cells[1]?.querySelector('strong')?.textContent || studentId;
        const studentName = cells[2]?.querySelector('.student-name')?.textContent || '';
        const course = cells[3]?.querySelector('.course-badge')?.textContent || '';
        const totalFee = cells[4]?.querySelector('strong')?.textContent || '';
        const paidAmount = cells[5]?.querySelector('strong')?.textContent || '';
        const pendingAmount = cells[6]?.querySelector('strong')?.textContent || '';
        const status = cells[7]?.querySelector('.badge')?.textContent || '';
        const lastPayment = cells[8]?.querySelector('.date-cell span')?.textContent || cells[8]?.textContent.trim() || '-';
        const dueDate = cells[9]?.querySelector('.due-date-cell span')?.textContent || cells[9]?.textContent.trim() || '-';

        const modalContent = document.getElementById('feeDetailsContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="container-fluid">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Student ID</span>
                                <h5 class="mb-0 fw-bold">${studentIdText}</h5>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Student Name</span>
                                <h5 class="mb-0 fw-bold">${studentName}</h5>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Course</span>
                                <h6 class="mb-0 fw-semibold">${course}</h6>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Payment Status</span>
                                <h6 class="mb-0 fw-semibold">${status}</h6>
                            </div>
                        </div>
                        <div class="col-12"><hr class="my-2"></div>
                        <div class="col-md-4">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Total Fee</span>
                                <h4 class="mb-0 fw-bold text-dark">${totalFee}</h4>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Paid Amount</span>
                                <h4 class="mb-0 fw-bold text-success">${paidAmount}</h4>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;">Pending Amount</span>
                                <h4 class="mb-0 fw-bold text-danger">${pendingAmount}</h4>
                            </div>
                        </div>
                        <div class="col-12"><hr class="my-2"></div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;"><i class="bi bi-calendar-check me-1"></i>Last Payment Date</span>
                                <h6 class="mb-0 fw-semibold">${lastPayment}</h6>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <span class="text-secondary text-uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px;"><i class="bi bi-calendar-event me-1"></i>Due Date</span>
                                <h6 class="mb-0 fw-semibold ${dueDate !== '-' ? 'text-warning' : ''}">${dueDate}</h6>
                            </div>
                        </div>
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
            message: `Are you sure you want to send a fee payment reminder?`,
            confirmText: 'Send Reminder',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            icon: 'bi-envelope text-primary',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading('Sending payment reminder...');
            
            // Simulate sending reminder
            setTimeout(() => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                    
                    toast.success('Payment reminder sent to ' + studentId);
                }, 1000);
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
            toast('No students with pending payments found', { icon: '⚠️' });
            return;
        }

        showConfirmationModal({
            title: 'Send Payment Reminders',
            message: `Are you sure you want to send payment reminders to all students with pending payments?`,
            confirmText: 'Send All',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            icon: 'bi-envelope text-primary',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading(`Sending reminders to ${pendingCount} student${pendingCount > 1 ? 's' : ''}...`);
            
            // Simulate sending reminders
            setTimeout(() => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                    
                    toast.success('Payment reminders sent to ' + pendingCount + ' student' + (pendingCount > 1 ? 's' : ''));
                }, 1500);
            }
        });
    }

    // Export Data
    function handleExport() {
        const visibleRows = Array.from(
            feesTable.querySelectorAll('tbody tr:not([style*="display: none"]):not(.empty-state-row)')
        );

        if (visibleRows.length === 0) {
            toast('No data to export', { icon: '⚠️' });
            return;
        }

        // Show loading toast
        const loadingToastId = toast.loading('Preparing fee data export...');

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

        // Download CSV with delay to show loading
        setTimeout(() => {
            downloadCSV(csv, 'fees-management-export.csv');
            
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            toast.success(`${visibleRows.length} fee records exported successfully`);
        }, 500);
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
