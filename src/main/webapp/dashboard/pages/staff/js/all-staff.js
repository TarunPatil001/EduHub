/**
 * All Staff Page JavaScript
 * Handles filtering, searching, pagination, and staff management with comprehensive edge case handling
 */

(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const entriesPerPage = document.getElementById('entriesPerPage');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const selectAllCheckbox = document.getElementById('selectAllStaff');
    const staffTable = document.getElementById('staffTable');
    const staffTableBody = document.getElementById('staffTableBody');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const exportBtn = document.getElementById('exportBtn');

    // State
    let currentPage = 1;
    let filteredStaff = [];
    let allRows = [];

    // Initialize
    function init() {
        allRows = Array.from(staffTableBody.querySelectorAll('tr:not(.empty-state-row)'));
        filteredStaff = [...allRows];
        
        attachEventListeners();
        updatePagination();
        updateStatistics();
        showEmptyState();
    }

    // Event Listeners
    function attachEventListeners() {
        // Search
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Filters
        if (roleFilter) {
            roleFilter.addEventListener('change', handleFilter);
        }
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', handleFilter);
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
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', handleResetFilters);
        }

        // Select All Checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', handleSelectAll);
        }

        // Staff Checkboxes - using event delegation for better performance
        staffTable.addEventListener('change', function(e) {
            if (e.target.classList.contains('staff-checkbox')) {
                const checkbox = e.target;
                const row = checkbox.closest('tr');
                
                if (checkbox.checked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                    // Clear any inline styles
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
                
                updateSelectAllState();
                updateBulkActionButtons();
            }
        });

        // Action Buttons - using event delegation
        staffTable.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;
            
            const staffId = target.dataset.staffId;
            if (!staffId) return;
            
            if (target.classList.contains('view-btn')) {
                handleViewStaff(staffId);
            } else if (target.classList.contains('edit-btn')) {
                handleEditStaff(staffId);
            } else if (target.classList.contains('delete-btn')) {
                handleDeleteStaff(staffId);
            }
        });

        // Bulk Delete
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', handleBulkDelete);
        }

        // Export
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExport);
        }
    }

    // Search Handler
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        filteredStaff = allRows.filter(row => {
            const text = row.textContent.toLowerCase();
            return text.includes(searchTerm);
        });

        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Filter Handler
    function handleFilter() {
        const roleValue = roleFilter ? roleFilter.value : '';
        const departmentValue = departmentFilter ? departmentFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        filteredStaff = allRows.filter(row => {
            const rowRole = row.dataset.role || '';
            const rowDepartment = row.dataset.department || '';
            const rowStatus = row.dataset.status || '';

            const roleMatch = !roleValue || rowRole === roleValue;
            const departmentMatch = !departmentValue || rowDepartment === departmentValue;
            const statusMatch = !statusValue || rowStatus === statusValue;

            return roleMatch && departmentMatch && statusMatch;
        });

        // Apply search if active
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredStaff = filteredStaff.filter(row => {
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
            const checkbox = row.querySelector('.staff-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            }
        });

        // Show filtered rows
        filteredStaff.forEach(row => row.style.display = '');

        updatePagination();
        updateStatistics();
        showEmptyState();
        updateSelectAllState();
        updateBulkActionButtons();
    }

    // Reset Filters
    function handleResetFilters() {
        if (searchInput) searchInput.value = '';
        if (roleFilter) roleFilter.value = '';
        if (departmentFilter) departmentFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        filteredStaff = [...allRows];
        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Select All Handler
    function handleSelectAll() {
        const isChecked = selectAllCheckbox.checked;
        const visibleRows = Array.from(staffTableBody.querySelectorAll('tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        visibleRows.forEach(row => {
            const checkbox = row.querySelector('.staff-checkbox');
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
        const visibleRows = Array.from(staffTableBody.querySelectorAll('tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        const visibleCheckboxes = visibleRows.map(row => row.querySelector('.staff-checkbox')).filter(cb => cb);
        const checkedCheckboxes = visibleCheckboxes.filter(cb => cb.checked);

        if (selectAllCheckbox) {
            if (visibleCheckboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCheckboxes.length === visibleCheckboxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }
    }

    // Update Bulk Action Buttons
    function updateBulkActionButtons() {
        // Only count visible checkboxes (not hidden by pagination or filters)
        const visibleRows = Array.from(staffTableBody.querySelectorAll('tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        const checkedCount = visibleRows.filter(row => {
            const checkbox = row.querySelector('.staff-checkbox');
            return checkbox && checkbox.checked;
        }).length;
        
        const selectedCountSpan = document.getElementById('selectedCount');
        
        if (!bulkDeleteBtn || !selectedCountSpan) return;
        
        if (checkedCount > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            selectedCountSpan.textContent = checkedCount;
        } else {
            bulkDeleteBtn.style.display = 'none';
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            }
        }
    }

    // Pagination
    function updatePagination() {
        const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
        const totalEntries = filteredStaff.length;
        const totalPages = Math.ceil(totalEntries / perPage);

        // Ensure current page is valid
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (currentPage < 1) {
            currentPage = 1;
        }

        // Hide all rows and maintain selection state
        allRows.forEach(row => {
            row.style.display = 'none';
            // Maintain row highlighting if checkbox is checked
            const checkbox = row.querySelector('.staff-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
            }
        });

        // Show current page rows
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageRows = filteredStaff.slice(start, end);
        
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
            pageLi.innerHTML = `<a class="page-link" href="#"></a>`;
            pageLi.querySelector('a').textContent = i;
            
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
        const tbody = staffTableBody;
        const thead = staffTable.querySelector('thead');
        const tableResponsive = staffTable.closest('.table-responsive');
        let emptyRow = tbody.querySelector('.empty-state-row');

        if (filteredStaff.length === 0) {
            // Check if it's a completely empty table or just filtered results
            const isCompletelyEmpty = allRows.length === 0;
            const hasActiveFilters = (searchInput && searchInput.value.trim()) || 
                                    (roleFilter && roleFilter.value) || 
                                    (departmentFilter && departmentFilter.value) ||
                                    (statusFilter && statusFilter.value);
            
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-state-row';
                tbody.appendChild(emptyRow);
            }
            
            // Update content based on whether table is empty or just filtered
            if (isCompletelyEmpty) {
                // Hide table header and remove scroll container when completely empty
                if (thead) thead.style.display = 'none';
                if (tableResponsive) {
                    tableResponsive.style.overflowX = 'visible';
                    tableResponsive.style.overflowY = 'visible';
                }
                
                emptyRow.innerHTML = `
                    <td colspan="14" class="text-center py-5">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="bi bi-person-plus"></i>
                            </div>
                            <h4 class="empty-state-title">No Staff Yet</h4>
                            <p class="empty-state-text">Get started by adding your first staff member to the system</p>
                            <a href="${getContextPath()}/dashboard/pages/staff/add-staff.jsp" class="btn btn-primary mt-3">
                                <i class="bi bi-plus-lg me-2"></i>Add First Staff Member
                            </a>
                        </div>
                    </td>
                `;
            } else if (hasActiveFilters) {
                // Hide table header and remove scroll for filtered empty results
                if (thead) thead.style.display = 'none';
                if (tableResponsive) {
                    tableResponsive.style.overflowX = 'visible';
                    tableResponsive.style.overflowY = 'visible';
                }
                
                emptyRow.innerHTML = `
                    <td colspan="14" class="text-center py-5">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="bi bi-search"></i>
                            </div>
                            <h4 class="empty-state-title">No Staff Found</h4>
                            <p class="empty-state-text">No staff members match your current search or filter criteria</p>
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
            // Show table header and restore scroll when there are staff
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

    // Update Statistics
    function updateStatistics() {
        const totalStaff = allRows.length;
        const activeStaff = allRows.filter(row => row.dataset.status === 'Active').length;
        const teachers = allRows.filter(row => row.dataset.role === 'Teacher').length;
        const supportStaff = totalStaff - teachers;

        const totalStaffEl = document.getElementById('totalStaff');
        const activeStaffEl = document.getElementById('activeStaff');
        const totalTeachersEl = document.getElementById('totalTeachers');
        const supportStaffEl = document.getElementById('supportStaff');

        if (totalStaffEl) totalStaffEl.textContent = totalStaff;
        if (activeStaffEl) activeStaffEl.textContent = activeStaff;
        if (totalTeachersEl) totalTeachersEl.textContent = teachers;
        if (supportStaffEl) supportStaffEl.textContent = supportStaff;
    }

    // View Staff Details
    function handleViewStaff(staffId) {
        const row = document.querySelector(`tr[data-staff-id="${staffId}"]`);
        if (!row) return;

        // Extract staff data from row
        const cells = row.querySelectorAll('td');
        const staffName = row.querySelector('.staff-name')?.textContent || '';
        const avatar = row.querySelector('.staff-avatar')?.textContent || '';
        
        const staffData = {
            id: cells[1]?.textContent.trim(),
            name: staffName,
            email: cells[3]?.textContent || 'N/A',
            phone: cells[4]?.textContent || 'N/A',
            role: row.dataset.role || 'N/A',
            department: row.dataset.department || 'N/A',
            qualification: cells[7]?.textContent || 'N/A',
            experience: cells[8]?.textContent || 'N/A',
            employmentType: cells[9]?.textContent || 'N/A',
            joinDate: cells[10]?.textContent || 'N/A',
            salary: cells[11]?.textContent || 'N/A',
            status: row.dataset.status || 'N/A'
        };

        // Populate modal
        const modalBody = document.getElementById('staffDetailsContent');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="staff-details-modal">
                    <!-- Staff Header -->
                    <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                        <div class="staff-avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">
                            ${avatar}
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="mb-1">${staffData.name}</h5>
                            <div class="d-flex gap-2 align-items-center flex-wrap">
                                <span class="badge bg-secondary">${staffData.id}</span>
                                <span class="role-badge">${staffData.role}</span>
                                <span class="badge status-${staffData.status.toLowerCase().replace(' ', '')}">${staffData.status}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Compact Info Grid -->
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-building text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Department</small>
                                    <strong>${staffData.department}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-envelope text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Email</small>
                                    <strong><a href="mailto:${staffData.email}" class="text-decoration-none">${staffData.email}</a></strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-telephone text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Phone</small>
                                    <strong>${staffData.phone}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-mortarboard text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Qualification</small>
                                    <strong>${staffData.qualification}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-clock-history text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Experience</small>
                                    <strong>${staffData.experience}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-briefcase text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Employment Type</small>
                                    <strong>${staffData.employmentType}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-calendar-check text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Join Date</small>
                                    <strong>${staffData.joinDate}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <i class="bi bi-cash-coin text-primary me-2"></i>
                                <div>
                                    <small class="text-muted d-block">Salary</small>
                                    <strong>${staffData.salary}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewStaffModal'));
        modal.show();
    }

    // Edit Staff
    function handleEditStaff(staffId) {
        console.log('Editing staff:', staffId);
        window.location.href = `${getContextPath()}/dashboard/pages/staff/add-staff.jsp?id=${staffId}&mode=edit`;
    }

    // Delete Staff with edge case handling
    function handleDeleteStaff(staffId) {
        const row = document.querySelector(`tr[data-staff-id="${staffId}"]`);
        const staffName = row ? row.querySelector('.staff-name')?.textContent || 'this staff member' : 'this staff member';
        
        showConfirmationModal({
            title: 'Delete Staff Member',
            message: `Are you sure you want to delete <strong>${staffName}</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-triangle-fill text-danger',
            onConfirm: function() {
                // Save the state of other checked checkboxes BEFORE deletion
                const checkedStaffIds = Array.from(document.querySelectorAll('.staff-checkbox:checked'))
                    .map(cb => cb.closest('tr')?.dataset.staffId)
                    .filter(id => id && id !== staffId); // Exclude the staff being deleted
                
                // Remove row from table
                if (row) {
                    row.remove();
                    
                    // Update arrays
                    allRows = Array.from(staffTableBody.querySelectorAll('tr:not(.empty-state-row)'));
                    filteredStaff = filteredStaff.filter(r => r !== row);
                    
                    // If current page is now empty, go to previous page
                    const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
                    const totalPages = Math.ceil(filteredStaff.length / perPage);
                    if (currentPage > totalPages && totalPages > 0) {
                        currentPage = totalPages;
                    }
                    
                    // Update view
                    updatePagination();
                    updateStatistics();
                    showEmptyState();
                    
                    // Restore the checked state of other staff after re-render
                    setTimeout(() => {
                        checkedStaffIds.forEach(id => {
                            const staffRow = document.querySelector(`tr[data-staff-id="${id}"]`);
                            if (staffRow) {
                                const checkbox = staffRow.querySelector('.staff-checkbox');
                                if (checkbox) {
                                    checkbox.checked = true;
                                    staffRow.classList.add('row-selected');
                                }
                            }
                        });
                        
                        // Update bulk action buttons and select all state
                        updateBulkActionButtons();
                        updateSelectAllState();
                    }, 50);
                    
                    toast.success(staffName + ' deleted successfully');
                }
            }
        });
    }

    // Bulk Delete Staff with comprehensive edge case handling
    function handleBulkDelete() {
        const selectedCheckboxes = Array.from(document.querySelectorAll('.staff-checkbox:checked'));
        
        // Edge Case 1: No selection
        if (selectedCheckboxes.length === 0) {
            toast('Please select staff members to delete', { icon: '⚠️' });
            return;
        }

        const staffCount = selectedCheckboxes.length;
        const staffNames = [];
        
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const nameEl = row.querySelector('.staff-name');
            if (nameEl) {
                staffNames.push(nameEl.textContent.trim());
            }
        });

        // Edge Case 2: Confirmation with modal
        showConfirmationModal({
            title: 'Delete Staff',
            message: `Are you sure you want to delete <strong>${staffCount} staff member(s)</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-triangle-fill text-danger',
            onConfirm: function() {
                // Remove all selected rows
                selectedCheckboxes.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    if (row) {
                        row.remove();
                    }
                });
                
                // Edge Case 3: Update data structures
                allRows = Array.from(staffTableBody.querySelectorAll('tr:not(.empty-state-row)'));
                
                // Edge Case 4: Reapply filters after deletion
                if (searchInput && searchInput.value.trim()) {
                    handleSearch();
                } else if ((roleFilter && roleFilter.value) || (departmentFilter && departmentFilter.value) || (statusFilter && statusFilter.value)) {
                    handleFilter();
                } else {
                    filteredStaff = [...allRows];
                }
                
                // Edge Case 5: Reset checkboxes
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                }
                
                // Edge Case 6: Hide bulk delete button
                if (bulkDeleteBtn) {
                    bulkDeleteBtn.style.display = 'none';
                }
                
                // Edge Case 7: Adjust pagination if current page is empty
                const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
                const totalPages = Math.ceil(filteredStaff.length / perPage);
                if (currentPage > totalPages && totalPages > 0) {
                    currentPage = totalPages;
                } else if (totalPages === 0) {
                    currentPage = 1;
                }
                
                // Edge Case 8: Update all UI elements
                updatePagination();
                updateStatistics();
                showEmptyState();
                updateBulkActionButtons();
                updateSelectAllState();
                
                toast.success(staffCount + ' staff member(s) deleted successfully');
            }
        });
    }

    // Export Data
    function handleExport() {
        // Get visible staff
        const visibleRows = Array.from(
            staffTableBody.querySelectorAll('tr:not([style*="display: none"]):not(.empty-state-row)')
        );

        if (visibleRows.length === 0) {
            toast('No data to export', { icon: '⚠️' });
            return;
        }

        // Show loading toast
        const loadingToastId = toast.loading('Preparing export...');

        // Create CSV
        let csv = 'Staff ID,Name,Email,Phone,Role,Department,Qualification,Experience,Employment Type,Join Date,Salary,Status\n';
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const id = cells[1]?.textContent.trim() || '';
            const name = row.querySelector('.staff-name')?.textContent.trim() || '';
            const email = cells[3]?.textContent.trim() || '';
            const phone = cells[4]?.textContent.trim() || '';
            const role = row.dataset.role || '';
            const department = row.dataset.department || '';
            const qualification = cells[7]?.textContent.trim() || '';
            const experience = cells[8]?.textContent.trim() || '';
            const employmentType = cells[9]?.textContent.trim() || '';
            const joinDate = cells[10]?.textContent.trim() || '';
            const salary = cells[11]?.textContent.trim() || '';
            const status = row.dataset.status || '';
            
            csv += `"${id}","${name}","${email}","${phone}","${role}","${department}","${qualification}","${experience}","${employmentType}","${joinDate}","${salary}","${status}"\n`;
        });

        // Download CSV with slight delay to show loading
        setTimeout(() => {
            downloadCSV(csv, `staff-export-${new Date().toISOString().split('T')[0]}.csv`);
            
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            toast.success(`${visibleRows.length} staff records exported successfully`);
        }, 500);
    }

    // Download CSV Helper
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

    // Toast notifications are now handled by the hot-toast library
    // Functions available: toast.success(), toast.error(), toast.loading(), etc.

    // Get Context Path
    function getContextPath() {
        return window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2)) || '';
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
