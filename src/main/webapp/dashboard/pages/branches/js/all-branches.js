// All Branches Page - Complete Implementation
(function() {
    'use strict';

    // State
    let allBranches = [];
    let filteredBranches = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalItems = 0;

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const cityFilter = document.getElementById('cityFilter');
    const stateFilter = document.getElementById('stateFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const tableBody = document.getElementById('branchesTableBody');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const paginationContainer = document.getElementById('paginationContainer');
    const pageInfo = document.getElementById('pageInfo');
    const selectAllCheckbox = document.getElementById('selectAllBranches');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const selectedCountEl = document.getElementById('selectedCount');

    // Stats elements
    const totalBranchesEl = document.getElementById('totalBranches');
    const activeBranchesEl = document.getElementById('activeBranches');
    const totalStaffEl = document.getElementById('totalStaff');
    const totalCitiesEl = document.getElementById('totalCities');

    // Initialize
    function init() {
        bindEvents();
        fetchBranches();
        // fetchStats(); // Stats endpoint not yet implemented, will calculate from list for now
        handleURLParameters(); // Handle URL parameters for notifications
    }

    // Fetch Stats from API (Placeholder)
    function fetchStats() {
        // If we had an endpoint:
        /*
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        const apiUrl = `${basePath}/api/branches/stats?t=${new Date().getTime()}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (totalBranchesEl) totalBranchesEl.textContent = data.totalBranches || 0;
                if (activeBranchesEl) activeBranchesEl.textContent = data.activeBranches || 0;
                if (totalStaffEl) totalStaffEl.textContent = data.totalStaff || 0;
                if (totalCitiesEl) totalCitiesEl.textContent = data.totalCities || 0;
            })
            .catch(error => console.error('Error fetching stats:', error));
        */
    }

    // Fetch Branches from API
    function fetchBranches(page = 1, limit = 10) {
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        // Get filter values
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const city = cityFilter ? cityFilter.value : 'all';
        const state = stateFilter ? stateFilter.value : 'all';
        const status = statusFilter ? statusFilter.value : 'all';
        
        // Build API URL with server-side filtering and pagination
        const params = new URLSearchParams({
            page: page,
            limit: limit,
            t: new Date().getTime()
        });
        
        if (searchTerm) params.append('search', searchTerm);
        if (city && city !== 'all') params.append('city', city);
        if (state && state !== 'all') params.append('state', state);
        if (status && status !== 'all') params.append('status', status);
        
        const apiUrl = `${basePath}/api/branches/list?${params.toString()}`;

        console.log('Fetching branches from:', apiUrl);

        fetch(apiUrl)
            .then(response => {
                if (response.status === 401) {
                    window.location.href = `${basePath}/public/login.jsp?error=session_expired`;
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Branches data received:', data);
                
                // Handle paginated response structure
                allBranches = data.branches || [];
                filteredBranches = allBranches; // Server already filtered
                totalItems = data.totalCount || 0;
                currentPage = data.currentPage || page;
                itemsPerPage = data.pageSize || limit;
                
                // Populate filter dropdowns if needed (fetch all for dropdowns on first load)
                if (page === 1) {
                    fetchAllForFilters();
                }
                
                renderTable();
                renderPagination();
                updateStatsFromData();
            })
            .catch(error => {
                console.error('Error fetching branches:', error);
                
                if (error.message === 'Unauthorized') return;

                if (typeof toast !== 'undefined') {
                    toast.error(`Failed to load branches: ${error.message}`);
                }
                
                // Show empty state if fetch fails
                const emptyState = document.getElementById('emptyState');
                const tableContainer = document.getElementById('branchesTableContainer');
                const paginationFooter = document.getElementById('paginationFooter');
                
                if (emptyState) emptyState.style.display = 'block';
                if (tableContainer) tableContainer.style.display = 'none';
                if (paginationFooter) paginationFooter.style.display = 'none';
            });
    }
    
    function fetchAllForFilters() {
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        const apiUrl = `${basePath}/api/branches/list?page=1&limit=1000&t=${new Date().getTime()}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const allBranchesForFilter = data.branches || [];
                populateFilters(allBranchesForFilter);
            })
            .catch(error => console.error('Error fetching branches for filters:', error));
    }

    function populateFilters(branches) {
        if (!cityFilter || !stateFilter) return;
        
        // Get unique cities and states
        const cities = [...new Set(branches.map(b => b.city).filter(Boolean))].sort();
        const states = [...new Set(branches.map(b => b.state).filter(Boolean))].sort();
        
        // Save current selection
        const currentCity = cityFilter.value;
        const currentState = stateFilter.value;
        
        // Populate City Filter
        let cityOptions = '<option value="all">All Cities</option>';
        cities.forEach(city => {
            cityOptions += `<option value="${city}">${city}</option>`;
        });
        cityFilter.innerHTML = cityOptions;
        cityFilter.value = currentCity; // Restore selection if possible
        if (cityFilter.value !== currentCity) cityFilter.value = 'all'; // Reset if option no longer exists

        // Populate State Filter
        let stateOptions = '<option value="all">All States</option>';
        states.forEach(state => {
            stateOptions += `<option value="${state}">${state}</option>`;
        });
        stateFilter.innerHTML = stateOptions;
        stateFilter.value = currentState;
        if (stateFilter.value !== currentState) stateFilter.value = 'all';
    }

    // Handle URL Parameters for Toast Notifications
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('success')) {
            // Handled by toast-dependencies.jsp mostly, but we can add custom logic here
            // Clean URL
            urlParams.delete('success');
            urlParams.delete('message');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
    }

    // Bind Events
    function bindEvents() {
        if (searchInput) searchInput.addEventListener('input', handleSearch);
        if (cityFilter) cityFilter.addEventListener('change', applyFilters);
        if (stateFilter) stateFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
        if (itemsPerPageSelect) itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
        if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', handleSelectAll);
        if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', handleBulkDelete);
    }

    // Handle Search
    function handleSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    }

    // Apply Filters (Wrapper)
    function applyFilters() {
        currentPage = 1;
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
        fetchBranches(currentPage, itemsPerPage);
    }

    // Update Stats from Data
    function updateStatsFromData() {
        if (!totalBranchesEl || !activeBranchesEl || !totalCitiesEl) return;

        // Use totalItems for accurate count from server
        totalBranchesEl.textContent = totalItems;
        
        // For active branches and cities, we need to fetch all or calculate from current data
        // Using current filtered data as approximation
        const activeBranches = filteredBranches.filter(b => b.status && b.status.toLowerCase() === 'active').length;
        const uniqueCities = new Set(filteredBranches.map(b => b.city).filter(Boolean)).size;

        activeBranchesEl.textContent = activeBranches;
        totalCitiesEl.textContent = uniqueCities;
    }

    // Render Table
    function renderTable() {
        if (!tableBody) return;

        const emptyState = document.getElementById('emptyState');
        const tableContainer = document.getElementById('branchesTableContainer');
        const paginationFooter = document.getElementById('paginationFooter');

        if (filteredBranches.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            if (paginationFooter) paginationFooter.style.display = 'none';
            updatePaginationInfo();
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'block';
        if (paginationFooter) paginationFooter.style.display = 'block';

        // Server-side pagination - no need to slice, already paginated
        tableBody.innerHTML = filteredBranches.map(branch => {
            const safeId = branch.branchId || '';
            const safeCode = escapeHtml(branch.branchCode || 'N/A');
            const safeName = escapeHtml(branch.branchName || 'Unnamed Branch');
            const safeManager = escapeHtml(branch.branchManagerName || branch.branchManagerId || 'Not Assigned');
            const safeCity = escapeHtml(branch.city || '-');
            const safeState = escapeHtml(branch.state || '-');
            const safePhone = escapeHtml(branch.phone || '-');
            const safeStatus = branch.status || 'Inactive';
            
            const statusClass = safeStatus.toLowerCase().replace(/\s+/g, '-');

            return `
            <tr data-branch-id="${safeId}">
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input branch-checkbox" data-branch-id="${safeId}">
                    </div>
                </td>
                <td><span class="course-code">${safeCode}</span></td>
                <td><span class="fw-bold text-dark">${safeName}</span></td>
                <td>${safeManager}</td>
                <td>${safeCity}</td>
                <td>${safeState}</td>
                <td>${safePhone}</td>
                <td><span class="status-badge status-${statusClass}">${capitalize(safeStatus)}</span></td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm view-btn" onclick="viewBranch('${safeId}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-btn" onclick="editBranch('${safeId}')" title="Edit Branch">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="handleDeleteBranch('${safeId}')" title="Delete Branch">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        // Add event listeners to checkboxes
        document.querySelectorAll('.branch-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const row = this.closest('tr');
                if (this.checked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                }
                updateBulkDeleteButton();
                updateSelectAllState();
            });
        });

        updatePaginationInfo();
        updateBulkDeleteButton();
        updateSelectAllState();
    }

    // Update Pagination Info
    function updatePaginationInfo() {
        const showingStartEl = document.getElementById('showingStart');
        const showingEndEl = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');

        if (!showingStartEl || !showingEndEl || !totalEntriesEl) return;

        if (filteredBranches.length === 0) {
            showingStartEl.textContent = '0';
            showingEndEl.textContent = '0';
            totalEntriesEl.textContent = '0';
            return;
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        showingStartEl.textContent = startItem.toString();
        showingEndEl.textContent = endItem.toString();
        totalEntriesEl.textContent = totalItems.toString();
    }

    // Render Pagination
    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="btn-group" role="group" aria-label="Pagination">';

        // Previous button
        paginationHTML += `
            <button type="button" class="btn btn-outline-secondary btn-sm ${currentPage === 1 ? 'disabled' : ''}" 
                data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="bi bi-chevron-left"></i>
            </button>
        `;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button type="button" class="btn btn-outline-primary btn-sm" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'btn-primary' : 'btn-outline-primary';
            paginationHTML += `
                <button type="button" class="btn ${activeClass} btn-sm" data-page="${i}">${i}</button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
            }
            paginationHTML += `<button type="button" class="btn btn-outline-primary btn-sm" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button type="button" class="btn btn-outline-secondary btn-sm ${currentPage === totalPages ? 'disabled' : ''}" 
                data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="bi bi-chevron-right"></i>
            </button>
        `;

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;

        paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.disabled || this.classList.contains('disabled')) return;
                const page = parseInt(this.dataset.page);
                if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                    goToPage(page);
                }
            });
        });
    }

    function goToPage(page) {
        currentPage = page;
        fetchBranches(currentPage, itemsPerPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleItemsPerPageChange() {
        if (!itemsPerPageSelect) return;
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        fetchBranches(currentPage, itemsPerPage);
    }

    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (cityFilter) cityFilter.value = 'all';
        if (stateFilter) stateFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        currentPage = 1;
        fetchBranches(currentPage, itemsPerPage);
        if (typeof toast !== 'undefined') toast.success('Filters have been reset');
    }

    function capitalize(str) {
        if (!str || typeof str !== 'string') return 'Unknown';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Branch Actions
    window.viewBranch = function(branchId) {
        const branch = allBranches.find(b => b.branchId === branchId);
        if (!branch) return;

        if (typeof showDetailsModal === 'function') {
            showDetailsModal({
                title: 'Branch Details',
                size: 'modal-lg',
                content: `
                    <div class="course-details-container">
                        <div class="compact-header">
                            <div class="compact-title">
                                <h3>${escapeHtml(branch.branchName)}</h3>
                                <span class="compact-code"><i class="bi bi-upc-scan me-2"></i>${escapeHtml(branch.branchCode)}</span>
                            </div>
                            <span class="status-badge status-${branch.status.toLowerCase()} px-3 py-2">
                                ${capitalize(branch.status)}
                            </span>
                        </div>
                        <div class="detail-grid">
                            <div class="detail-card">
                                <div class="detail-icon-box text-primary"><i class="bi bi-person-badge"></i></div>
                                <div class="detail-info">
                                    <div class="detail-label">Manager</div>
                                    <div class="detail-value">${escapeHtml(branch.branchManagerName || branch.branchManagerId || 'Not Assigned')}</div>
                                </div>
                            </div>
                            <div class="detail-card">
                                <div class="detail-icon-box text-info"><i class="bi bi-geo-alt"></i></div>
                                <div class="detail-info">
                                    <div class="detail-label">Location</div>
                                    <div class="detail-value">${escapeHtml(branch.city)}, ${escapeHtml(branch.state)}</div>
                                </div>
                            </div>
                            <div class="detail-card">
                                <div class="detail-icon-box text-warning"><i class="bi bi-telephone"></i></div>
                                <div class="detail-info">
                                    <div class="detail-label">Phone</div>
                                    <div class="detail-value">${escapeHtml(branch.phone)}</div>
                                </div>
                            </div>
                            <div class="detail-card">
                                <div class="detail-icon-box text-success"><i class="bi bi-envelope"></i></div>
                                <div class="detail-info">
                                    <div class="detail-label">Email</div>
                                    <div class="detail-value">${escapeHtml(branch.email)}</div>
                                </div>
                            </div>
                            <div class="detail-card" style="grid-column: span 2;">
                                <div class="detail-icon-box text-secondary"><i class="bi bi-map"></i></div>
                                <div class="detail-info">
                                    <div class="detail-label">Address</div>
                                    <div class="detail-value">${escapeHtml(branch.address)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
        }
    };

    window.editBranch = function(branchId) {
        // Redirect to edit page (not yet created, but placeholder)
        // window.location.href = `${contextPath}/dashboard/pages/branches/edit-branch.jsp?id=${branchId}`;
        if (typeof toast !== 'undefined') toast.info('Edit functionality coming soon');
    };

    // Handle Select All
    function handleSelectAll() {
        const checkboxes = document.querySelectorAll('.branch-checkbox');
        const isChecked = selectAllCheckbox.checked;
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            const row = cb.closest('tr');
            if (isChecked) row.classList.add('row-selected');
            else row.classList.remove('row-selected');
        });
        updateBulkDeleteButton();
    }

    function updateBulkDeleteButton() {
        if (!bulkDeleteBtn || !selectedCountEl) return;
        const count = document.querySelectorAll('.branch-checkbox:checked').length;
        if (count > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            selectedCountEl.textContent = count;
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }

    function updateSelectAllState() {
        if (!selectAllCheckbox) return;
        const all = document.querySelectorAll('.branch-checkbox');
        const checked = document.querySelectorAll('.branch-checkbox:checked');
        if (checked.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checked.length === all.length && all.length > 0) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    function handleBulkDelete() {
        const checked = document.querySelectorAll('.branch-checkbox:checked');
        const ids = Array.from(checked).map(cb => cb.dataset.branchId);
        
        if (ids.length === 0) return;

        const message = `Are you sure you want to delete <strong>${ids.length}</strong> branch(es)? This action cannot be undone.`;
        
        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Delete Multiple Branches',
                message: message,
                confirmText: 'Delete All',
                cancelText: 'Cancel',
                confirmClass: 'btn-danger',
                icon: 'bi-trash text-danger',
                onConfirm: function() {
                    performBulkDelete(ids);
                }
            });
        } else {
            if (confirm(`Are you sure you want to delete ${ids.length} branch(es)? This action cannot be undone.`)) {
                performBulkDelete(ids);
            }
        }
    }
    
    function performBulkDelete(ids) {
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        let deletedCount = 0;
        let failedCount = 0;
        
        // Delete branches sequentially
        const deletePromises = ids.map(id => 
            fetch(`${basePath}/api/branches/delete?id=${id}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        deletedCount++;
                        return true;
                    } else {
                        failedCount++;
                        return false;
                    }
                })
                .catch(error => {
                    console.error('Error deleting branch:', error);
                    failedCount++;
                    return false;
                })
        );
        
        Promise.all(deletePromises).then(() => {
            // Clear all checkboxes immediately before showing feedback
            document.querySelectorAll('.branch-checkbox').forEach(cb => {
                cb.checked = false;
                const row = cb.closest('tr');
                if (row) row.classList.remove('row-selected');
            });
            
            // Clear select all checkbox
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            }
            
            // Hide bulk delete button immediately
            if (bulkDeleteBtn) {
                bulkDeleteBtn.style.display = 'none';
            }
            
            // Show toast feedback
            if (typeof toast !== 'undefined') {
                if (deletedCount > 0 && failedCount === 0) {
                    toast.success(`Successfully deleted ${deletedCount} branch(es)`);
                } else if (deletedCount > 0 && failedCount > 0) {
                    toast.warning(`Deleted ${deletedCount} branch(es), failed to delete ${failedCount}`);
                } else {
                    toast.error(`Failed to delete branches`);
                }
            }
            
            // Reload data to refresh the table
            fetchBranches(currentPage, itemsPerPage);
        });
    }

    window.handleDeleteBranch = function(branchId) {
        const branch = filteredBranches.find(b => b.branchId === branchId);
        const branchName = branch ? branch.branchName : 'this branch';
        
        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Delete Branch',
                message: `Are you sure you want to delete <strong>${escapeHtml(branchName)}</strong>? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                confirmClass: 'btn-danger',
                icon: 'bi-trash text-danger',
                onConfirm: function() {
                    performDelete(branchId);
                }
            });
        } else {
            if (confirm(`Are you sure you want to delete ${branchName}? This action cannot be undone.`)) {
                performDelete(branchId);
            }
        }
    };
    
    function performDelete(branchId) {
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        fetch(`${basePath}/api/branches/delete?id=${branchId}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json ? response.json() : { status: 'success' };
                } else if (response.status === 401) {
                    window.location.href = `${basePath}/public/login.jsp?error=session_expired`;
                    throw new Error('Unauthorized');
                } else if (response.status === 404) {
                    throw new Error('Branch not found');
                } else {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to delete branch');
                    });
                }
            })
            .then(data => {
                if (typeof toast !== 'undefined') {
                    toast.success('Branch deleted successfully');
                }
                // Reload current page or go to previous page if current page is now empty
                const remainingItems = totalItems - 1;
                const maxPage = Math.ceil(remainingItems / itemsPerPage);
                const pageToLoad = currentPage > maxPage ? Math.max(1, maxPage) : currentPage;
                fetchBranches(pageToLoad, itemsPerPage);
            })
            .catch(error => {
                console.error('Delete error:', error);
                if (error.message !== 'Unauthorized') {
                    if (typeof toast !== 'undefined') {
                        toast.error(error.message || 'Failed to delete branch');
                    }
                    // Reload table to restore state
                    fetchBranches(currentPage, itemsPerPage);
                }
            });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
