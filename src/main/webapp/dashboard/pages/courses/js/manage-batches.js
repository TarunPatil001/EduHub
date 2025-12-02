/**
 * Manage Batches - JavaScript
 * Handles filtering, searching, pagination and batch management functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFilters();
    initPagination();
    initDeleteHandlers();
    initSelectionHandlers();
    handleURLParameters();
    
    // Initial load
    loadBatches();
});

// State management
const state = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    allBatches: [], // Stores all batches fetched from server
    filteredBatches: [] // Stores batches after client-side processing (if any)
};

/**
 * Initialize search and filter functionality
 */
function initFilters() {
    const searchInput = document.getElementById('searchBatch');
    const courseFilter = document.getElementById('courseFilter');
    const branchFilter = document.getElementById('branchFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetBtn = document.getElementById('resetFilters');
    
    // Event listeners
    if (searchInput) searchInput.addEventListener('input', debounce(() => { state.currentPage = 1; loadBatches(); }, 500));
    if (courseFilter) courseFilter.addEventListener('change', () => { state.currentPage = 1; loadBatches(); });
    if (branchFilter) branchFilter.addEventListener('change', () => { state.currentPage = 1; loadBatches(); });
    if (statusFilter) statusFilter.addEventListener('change', () => { state.currentPage = 1; loadBatches(); });
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

/**
 * Load batches from the server based on filters
 */
function loadBatches() {
    const search = document.getElementById('searchBatch').value;
    const courseId = document.getElementById('courseFilter').value;
    const branchId = document.getElementById('branchFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    // Build query string
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (courseId && courseId !== 'all') params.append('courseId', courseId);
    if (branchId && branchId !== 'all') params.append('branchId', branchId);
    if (status && status !== 'all') params.append('status', status);
    
    params.append('page', state.currentPage);
    params.append('pageSize', state.itemsPerPage);
    
    console.log('Fetching batches with params:', params.toString());

    // Show loading state (optional)
    const tableBody = document.getElementById('batchesTableBody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="16" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
    }

    fetch(`${contextPath}/api/batches/list?${params.toString()}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Batches response:', data);
            state.allBatches = data.batches;
            state.filteredBatches = data.batches; // Server does the filtering
            state.totalItems = data.totalCount;
            
            // updateStats(data.batches); // Stats might need a separate API or be returned in the response if we want total stats, not just current page
            renderTable();
            updatePagination();
        })
        .catch(error => {
            console.error('Error loading batches:', error);
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="16" class="text-center text-danger py-4">Error loading data. Please try again.</td></tr>';
            }
            toast.error('Failed to load batches');
        });
}

/**
 * Render the table based on current state (pagination)
 */
function renderTable() {
    const tableBody = document.getElementById('batchesTableBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('batchesTableContainer');
    const paginationFooter = document.getElementById('paginationFooter');
    
    if (!tableBody) return;

    // Calculate range for display text
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, state.totalItems);
    
    if (state.totalItems === 0) {
        // Show empty state
        if (tableContainer) tableContainer.style.display = 'none';
        if (paginationFooter) paginationFooter.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    // Show table and pagination
    if (tableContainer) tableContainer.style.display = 'block';
    if (paginationFooter) paginationFooter.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    // Data is already paginated from server
    const pageItems = state.filteredBatches;
    
    let html = '';
    
    pageItems.forEach(batch => {
        const courseName = courseMap[batch.courseId] || 'Unknown Course';
        const branchName = branchMap[batch.branchId] || 'Unknown Branch';
        const trainerName = trainerMap[batch.instructorId] || 'Unknown Trainer';
        
        let statusClass = "status-active";
        if(batch.status === "Upcoming") statusClass = "status-upcoming";
        else if(batch.status === "Completed") statusClass = "status-completed";
        else if(batch.status === "Inactive") statusClass = "status-inactive";
        
        // Format class days with better styling (single row)
        let classDaysHtml = "<span class='text-muted'>-</span>";
        if(batch.classDays) {
            const days = batch.classDays.split(',').map(day => day.trim()).filter(day => day);
            if(days.length > 0) {
                classDaysHtml = '<div class="d-flex flex-nowrap gap-1">' + days.map(day => {
                    const shortDay = day.length > 3 ? day.substring(0, 3) : day;
                    return `<span class='day-badge'>${shortDay}</span>`;
                }).join('') + '</div>';
            }
        }
        
        html += `
            <tr data-id="${batch.batchId}">
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input batch-checkbox" value="${batch.batchId}">
                    </div>
                </td>
                <td><span class="batch-code">${batch.batchCode || '-'}</span></td>
                <td><div class="fw-bold text-truncate-custom" title="${batch.batchName}">${batch.batchName}</div></td>
                <td><span class="text-truncate-custom" title="${courseName}">${courseName}</span></td>
                <td><span class="text-truncate-custom" title="${branchName}">${branchName}</span></td>
                <td><span class="text-truncate-custom" title="${trainerName}">${trainerName}</span></td>
                <td>${formatDate(batch.startDate)}</td>
                <td>${formatDate(batch.endDate)}</td>
                <td>${formatTime(batch.startTime)}</td>
                <td>${formatTime(batch.endTime)}</td>
                <td class="text-center">
                    <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary" style="min-width: 45px; font-weight: 600;">
                        <i class="bi bi-people-fill me-1" style="font-size: 0.75rem;"></i>${batch.maxCapacity}
                    </span>
                </td>
                <td>${classDaysHtml}</td>
                <td><span class="badge bg-info bg-opacity-10 text-info">${batch.modeOfConduct}</span></td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${batch.status}
                    </span>
                </td>
                <td><span class="text-truncate-custom" title="${batch.classroomLocation || ''}">${batch.classroomLocation || '-'}</span></td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn view-btn" title="View Details" onclick="viewBatch('${batch.batchId}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="btn edit-btn" title="Edit Batch" onclick="editBatch('${batch.batchId}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn delete-btn" title="Delete Batch" 
                                onclick="deleteBatch('${batch.batchId}', '${batch.batchName.replace(/'/g, "\\'")}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Update counts
    document.getElementById('showingStart').textContent = startIndex + 1;
    document.getElementById('showingEnd').textContent = endIndex;
    document.getElementById('totalEntries').textContent = state.totalItems;
    
    // Re-bind events
    bindCheckboxEvents();
    updateSelectAllState();
}

/**
 * Helper to format date (YYYY-MM-DD -> DD MMM YYYY)
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Helper to format time (HH:MM:SS -> hh:mm a)
 */
function formatTime(timeStr) {
    if (!timeStr) return '-';
    // Handle HH:MM or HH:MM:SS
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
    if (!str || typeof str !== 'string') return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * View batch details
 * @param {string} batchId - ID of the batch to view
 */
window.viewBatch = function(batchId) {
    const batch = state.allBatches.find(b => b.batchId === batchId);
    if (!batch) {
        toast.error('Batch not found');
        return;
    }

    const courseName = courseMap[batch.courseId] || 'Unknown Course';
    const branchName = branchMap[batch.branchId] || 'Unknown Branch';
    const trainerName = trainerMap[batch.instructorId] || 'Unknown Trainer';
    
    let statusClass = "status-active";
    if(batch.status === "Upcoming") statusClass = "status-upcoming";
    else if(batch.status === "Completed") statusClass = "status-completed";
    else if(batch.status === "Inactive") statusClass = "status-inactive";

    // Format class days
    let classDaysHtml = "None";
    if(batch.classDays) {
        classDaysHtml = batch.classDays.split(',').map(day => {
            return `<span class="badge bg-light text-dark border me-1">${day.trim()}</span>`;
        }).join('');
    }

    const content = `
        <div class="course-details-container">
            <!-- Compact Header -->
            <div class="compact-header">
                <div class="compact-title">
                    <h3>${escapeHtml(batch.batchName)}</h3>
                    <span class="compact-code"><i class="bi bi-upc-scan me-2"></i>${escapeHtml(batch.batchCode)}</span>
                </div>
                <span class="status-badge ${statusClass} px-3 py-2" style="font-size: 0.85rem;">
                    ${batch.status}
                </span>
            </div>

            <!-- Detail Grid -->
            <div class="detail-grid">
                <!-- Course -->
                <div class="detail-card">
                    <div class="detail-icon-box text-primary">
                        <i class="bi bi-book"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Course</div>
                        <div class="detail-value">${escapeHtml(courseName)}</div>
                    </div>
                </div>

                <!-- Branch -->
                <div class="detail-card">
                    <div class="detail-icon-box text-info">
                        <i class="bi bi-building"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Branch</div>
                        <div class="detail-value">${escapeHtml(branchName)}</div>
                    </div>
                </div>

                <!-- Instructor -->
                <div class="detail-card">
                    <div class="detail-icon-box text-success">
                        <i class="bi bi-person-badge"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Instructor</div>
                        <div class="detail-value">${escapeHtml(trainerName)}</div>
                    </div>
                </div>

                <!-- Schedule -->
                <div class="detail-card">
                    <div class="detail-icon-box text-warning">
                        <i class="bi bi-calendar-range"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">
                            ${formatDate(batch.startDate)} - ${formatDate(batch.endDate)}
                        </div>
                    </div>
                </div>

                <!-- Timing -->
                <div class="detail-card">
                    <div class="detail-icon-box text-danger">
                        <i class="bi bi-clock"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Timing</div>
                        <div class="detail-value">
                            ${formatTime(batch.startTime)} - ${formatTime(batch.endTime)}
                        </div>
                    </div>
                </div>

                <!-- Capacity -->
                <div class="detail-card">
                    <div class="detail-icon-box text-secondary">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Capacity</div>
                        <div class="detail-value">${batch.maxCapacity} Students</div>
                    </div>
                </div>
                
                <!-- Mode -->
                <div class="detail-card">
                    <div class="detail-icon-box text-primary">
                        <i class="bi bi-laptop"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Mode</div>
                        <div class="detail-value">${escapeHtml(batch.modeOfConduct)}</div>
                    </div>
                </div>

                <!-- Location -->
                <div class="detail-card">
                    <div class="detail-icon-box text-dark">
                        <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="detail-info">
                        <div class="detail-label">Location</div>
                        <div class="detail-value">${escapeHtml(batch.classroomLocation || 'N/A')}</div>
                    </div>
                </div>
            </div>
            
            <!-- Class Days -->
            <div class="mt-4">
                <h6 class="text-muted mb-2">Class Days</h6>
                <div>${classDaysHtml}</div>
            </div>
        </div>
    `;

    if (typeof showDetailsModal === 'function') {
        showDetailsModal({
            title: 'Batch Details',
            size: 'modal-lg',
            content: content
        });
    } else if (typeof showSuccessModal === 'function') {
        showSuccessModal({
            title: 'Batch Details',
            message: content
        });
    } else {
        // Fallback if no modal function is available
        alert(`Batch: ${batch.batchName}\nCode: ${batch.batchCode}\nStatus: ${batch.status}`);
    }
};

/**
 * Reset all filters
 */
function resetFilters() {
    document.getElementById('searchBatch').value = '';
    document.getElementById('courseFilter').value = 'all';
    document.getElementById('branchFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    loadBatches();
}

/**
 * Initialize pagination controls
 */
function initPagination() {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            state.itemsPerPage = parseInt(this.value);
            state.currentPage = 1;
            loadBatches();
        });
    }
}

/**
 * Update pagination buttons
 */
function updatePagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    
    const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="btn-group" role="group" aria-label="Pagination">';

    // Previous button
    html += `
        <button type="button" class="btn btn-outline-secondary btn-sm ${state.currentPage === 1 ? 'disabled' : ''}" 
            onclick="changePage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>
            <i class="bi bi-chevron-left"></i>
        </button>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        html += `<button type="button" class="btn btn-outline-primary btn-sm" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            html += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === state.currentPage ? 'btn-primary' : 'btn-outline-primary';
        html += `
            <button type="button" class="btn ${activeClass} btn-sm" onclick="changePage(${i})">${i}</button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<button type="button" class="btn btn-outline-secondary btn-sm disabled" disabled>...</button>`;
        }
        html += `<button type="button" class="btn btn-outline-primary btn-sm" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    html += `
        <button type="button" class="btn btn-outline-secondary btn-sm ${state.currentPage === totalPages ? 'disabled' : ''}" 
            onclick="changePage(${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>
            <i class="bi bi-chevron-right"></i>
        </button>
    `;

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Change current page
 * @param {number} page - Page number to switch to
 */
window.changePage = function(page) {
    const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    state.currentPage = page;
    loadBatches();
};

/**
 * Initialize delete handlers
 */
function initDeleteHandlers() {
    // This function is called on load, but we also expose deleteBatch globally
    // for the onclick handlers in the HTML
}

/**
 * Initialize selection handlers (Select All, Individual Checkboxes)
 */
function initSelectionHandlers() {
    const selectAllCheckbox = document.getElementById('selectAllBatches');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }
    
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', handleBulkDelete);
    }
}

/**
 * Bind change events to row checkboxes
 */
function bindCheckboxEvents() {
    const checkboxes = document.querySelectorAll('.batch-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', handleRowSelection);
        checkbox.addEventListener('change', handleRowSelection);
    });
}

/**
 * Handle Select All checkbox change
 */
function handleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllBatches');
    const isChecked = selectAllCheckbox.checked;
    
    const tableBody = document.getElementById('batchesTableBody');
    if (!tableBody) return;
    
    // Get all checkboxes in the table
    const checkboxes = tableBody.querySelectorAll('.batch-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        updateRowStyle(checkbox.closest('tr'), isChecked);
    });
    
    updateBulkDeleteButton();
}

/**
 * Handle individual row selection
 */
function handleRowSelection() {
    const row = this.closest('tr');
    updateRowStyle(row, this.checked);
    updateBulkDeleteButton();
    updateSelectAllState();
}

/**
 * Update row style based on selection
 */
function updateRowStyle(row, isSelected) {
    if (isSelected) {
        row.classList.add('row-selected');
    } else {
        row.classList.remove('row-selected');
    }
}

/**
 * Update Bulk Delete Button visibility and count
 */
function updateBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const selectedCountEl = document.getElementById('selectedCount');
    
    if (!bulkDeleteBtn || !selectedCountEl) return;
    
    const checkedCheckboxes = document.querySelectorAll('.batch-checkbox:checked');
    const count = checkedCheckboxes.length;
    
    if (count > 0) {
        bulkDeleteBtn.style.display = 'inline-block';
        selectedCountEl.textContent = count;
    } else {
        bulkDeleteBtn.style.display = 'none';
    }
}

/**
 * Update Select All checkbox state
 */
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAllBatches');
    if (!selectAllCheckbox) return;
    
    const tableBody = document.getElementById('batchesTableBody');
    if (!tableBody) return;
    
    const checkboxes = Array.from(tableBody.querySelectorAll('.batch-checkbox'));
    
    if (checkboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
    }
    
    const checkedCount = checkboxes.filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

/**
 * Handle Bulk Delete action
 */
function handleBulkDelete() {
    const checkedCheckboxes = document.querySelectorAll('.batch-checkbox:checked');
    const batchIds = Array.from(checkedCheckboxes).map(cb => cb.value);
    
    if (batchIds.length === 0) return;
    
    showConfirmationModal({
        title: 'Delete Batches',
        message: `Are you sure you want to delete <strong>${batchIds.length}</strong> batches?<br>This action cannot be undone.`,
        confirmText: 'Delete',
        confirmClass: 'btn-danger',
        onConfirm: function() {
           const form = document.createElement('form');
           form.method = 'POST';
           form.action = `${contextPath}/api/batches/delete`;
           
           const idsInput = document.createElement('input');
           idsInput.type = 'hidden';
           idsInput.name = 'batchIds';
           idsInput.value = batchIds.join(',');
           
           form.appendChild(idsInput);
           document.body.appendChild(form);
           form.submit();
        }
    });
}

/**
 * Delete a batch
 * @param {string} batchId - ID of the batch to delete
 * @param {string} batchName - Name of the batch for display
 */
window.deleteBatch = function(batchId, batchName) {
    showConfirmationModal({
        title: 'Delete Batch',
        message: `Are you sure you want to delete batch <strong>${batchName}</strong>?<br>This action cannot be undone.`,
        confirmText: 'Delete',
        confirmClass: 'btn-danger',
        onConfirm: function() {
           const form = document.createElement('form');
           form.method = 'POST';
           form.action = `${contextPath}/api/batches/delete`;
           
           const idInput = document.createElement('input');
           idInput.type = 'hidden';
           idInput.name = 'batchId';
           idInput.value = batchId;
           
           form.appendChild(idInput);
           document.body.appendChild(form);
           form.submit();
        }
    });
};

/**
 * Edit a batch
 * @param {string} batchId - ID of the batch to edit
 */
window.editBatch = function(batchId) {
    window.location.href = `${contextPath}/dashboard/pages/courses/create-batch.jsp?id=${batchId}`;
};

/**
 * Handle URL parameters for toast notifications
 */
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('success')) {
        const success = urlParams.get('success');
        const message = urlParams.get('message');
        
        if (success === 'true' && message) {
            toast.success(message);
        } else if (success === 'created') {
            toast.success('Batch created successfully');
        } else if (success === 'updated') {
            toast.success('Batch updated successfully');
        } else if (success === 'deleted') {
            toast.success('Batch deleted successfully');
        }
        
        // Clean URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    if (urlParams.has('error')) {
        toast.error(urlParams.get('message') || 'An error occurred');
        
        // Clean URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

/**
 * Utility: Debounce function
 */
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

/**
 * Update stats cards based on visible rows
 */
function updateStats(batches) {
    let active = 0;
    let upcoming = 0;
    let completed = 0;
    
    batches.forEach(b => {
        if(b.status === 'Active') active++;
        else if(b.status === 'Upcoming') upcoming++;
        else if(b.status === 'Completed') completed++;
    });
    
    document.getElementById('totalBatches').textContent = batches.length;
    document.getElementById('activeBatches').textContent = active;
    document.getElementById('upcomingBatches').textContent = upcoming;
    document.getElementById('completedBatches').textContent = completed;
}
