/**
 * all-staff.js
 * Handles staff page interactions including search, filtering, pagination, and CRUD operations.
 * Uses server-side pagination and filtering.
 */

document.addEventListener('DOMContentLoaded', function() {
    init();
});

// State variables
let staffData = []; // Used for View Modal (contains current page data)
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    roleFilter: document.getElementById('roleFilter'),
    statusFilter: document.getElementById('statusFilter'),
    resetBtn: document.getElementById('resetFilters'),
    itemsPerPageSelect: document.getElementById('itemsPerPage'),
    tableBody: document.getElementById('staffTableBody'),
    tableContainer: document.getElementById('staffTableContainer'),
    emptyState: document.getElementById('emptyState'),
    paginationFooter: document.getElementById('paginationFooter'),
    selectAllCheckbox: document.getElementById('selectAllStaff'),
    bulkDeleteBtn: document.getElementById('bulkDeleteBtn'),
    selectedCountSpan: document.getElementById('selectedCount'),
    paginationContainer: document.getElementById('paginationContainer')
};

/**
 * Initialize the page
 */
function init() {
    // Load server-side pagination data if available
    if (typeof serverPagination !== 'undefined') {
        currentPage = serverPagination.currentPage;
        itemsPerPage = serverPagination.itemsPerPage;
        totalPages = serverPagination.totalPages;
    }

    loadStaffDataFromDOM();
    setupEventListeners();
    renderPagination();
    
    // Check empty state
    if (typeof serverPagination !== 'undefined' && serverPagination.totalItems === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const hasFilters = urlParams.has('search') || urlParams.has('role') || urlParams.has('status');
        showEmptyState(true, hasFilters);
    } else {
        showEmptyState(false);
    }
}

/**
 * Load staff data from the server-rendered table (for Modal View)
 */
function loadStaffDataFromDOM() {
    const rows = document.querySelectorAll('#staffTableBody tr');
    staffData = Array.from(rows).map(row => {
        const cells = row.cells;
        const getText = (index) => cells[index] ? cells[index].textContent.trim() : '';
        const getHtml = (index) => cells[index] ? cells[index].innerHTML : '';
        
        const avatarContainer = row.querySelector('.staff-avatar');
        const avatarHtml = avatarContainer ? avatarContainer.innerHTML : '';
        
        const nameElement = row.querySelector('.staff-name');
        const name = nameElement ? nameElement.textContent.trim() : getText(2);
        
        return {
            element: row,
            id: row.getAttribute('data-staff-id'),
            role: row.getAttribute('data-role'),
            status: row.getAttribute('data-status'),
            branch: row.getAttribute('data-branch'),
            employeeId: getText(1),
            name: name,
            avatarHtml: avatarHtml,
            department: getText(3),
            email: getText(5),
            phone: getText(6),
            gender: getText(7),
            dob: getText(8),
            nationality: getText(9),
            maritalStatus: getText(10),
            workShift: getText(11),
            reportingManager: getText(12),
            qualification: getText(13),
            specialization: getText(14),
            certificationsHtml: getHtml(15),
            documentsHtml: getHtml(16),
            experience: getText(17),
            employmentType: getText(18),
            joinDate: getText(19),
            salary: getText(20),
            address: getText(21),
            city: getText(22),
            state: getText(23),
            postalCode: getText(24),
            emergencyContact: getText(25),
            emergencyPhone: getText(26),
            emergencyRelation: getText(27)
        };
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Search and Filter
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
        // Debounce input for smoother experience
        elements.searchInput.addEventListener('input', debounce(applyFilters, 800));
    }
    
    if (elements.roleFilter) {
        elements.roleFilter.addEventListener('change', applyFilters);
    }
    
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', applyFilters);
    }
    
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', resetFilters);
    }
    
    // Pagination Limit
    if (elements.itemsPerPageSelect) {
        elements.itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            reloadPage();
        });
    }
    
    // Bulk Selection
    if (elements.selectAllCheckbox) {
        elements.selectAllCheckbox.addEventListener('change', toggleAllSelection);
    }
    
    // Table Actions
    if (elements.tableBody) {
        elements.tableBody.addEventListener('change', function(e) {
            if (e.target.classList.contains('staff-checkbox')) {
                const row = e.target.closest('tr');
                if (row) {
                    if (e.target.checked) {
                        row.classList.add('row-selected');
                    } else {
                        row.classList.remove('row-selected');
                        row.style.backgroundColor = '';
                        row.style.borderLeft = '';
                    }
                }
                updateBulkActionState();
            }
        });
        
        elements.tableBody.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;
            
            const staffId = target.getAttribute('data-staff-id');
            
            if (target.classList.contains('view-btn')) {
                viewStaffDetails(staffId);
            } else if (target.classList.contains('edit-btn')) {
                window.location.href = `${contextPath}/dashboard/pages/staff/edit-staff.jsp?id=${staffId}`;
            } else if (target.classList.contains('delete-btn')) {
                confirmDelete(staffId);
            }
        });
    }
    
    // Bulk Delete
    if (elements.bulkDeleteBtn) {
        elements.bulkDeleteBtn.addEventListener('click', confirmBulkDelete);
    }
}

/**
 * Apply filters by reloading the page with query params
 */
function applyFilters() {
    currentPage = 1;
    reloadPage();
}

/**
 * Reset all filters
 */
function resetFilters() {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.roleFilter) elements.roleFilter.value = '';
    if (elements.statusFilter) elements.statusFilter.value = '';
    applyFilters();
}

/**
 * Reload page with current state
 */
function reloadPage() {
    const params = new URLSearchParams();
    
    if (elements.searchInput && elements.searchInput.value.trim()) {
        params.set('search', elements.searchInput.value.trim());
    }
    if (elements.roleFilter && elements.roleFilter.value) {
        params.set('role', elements.roleFilter.value);
    }
    if (elements.statusFilter && elements.statusFilter.value) {
        params.set('status', elements.statusFilter.value);
    }
    
    params.set('page', currentPage);
    params.set('limit', itemsPerPage);
    
    window.location.href = `${window.location.pathname}?${params.toString()}`;
}

/**
 * Change page
 */
function changePage(page) {
    currentPage = page;
    reloadPage();
}

/**
 * Render pagination buttons
 */
function renderPagination() {
    if (!elements.paginationContainer) return;
    
    if (totalPages <= 1) {
        elements.paginationContainer.innerHTML = '';
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
    elements.paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners
    elements.paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.disabled || this.classList.contains('disabled')) return;
            
            const page = parseInt(this.dataset.page);
            if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                changePage(page);
            }
        });
    });
}

/**
 * Toggle visibility of empty state and table
 */
function showEmptyState(show, isSearch = false) {
    if (show) {
        if (elements.tableContainer) elements.tableContainer.style.display = 'none';
        if (elements.paginationFooter) elements.paginationFooter.style.display = 'none';
        if (elements.emptyState) {
            elements.emptyState.style.display = 'block';
            
            const title = elements.emptyState.querySelector('.empty-state-title');
            const text = elements.emptyState.querySelector('.empty-state-text');
            const btn = elements.emptyState.querySelector('.btn-primary');
            
            if (isSearch) {
                if (title) title.textContent = 'No Staff Found';
                if (text) text.textContent = 'No staff members match your search criteria. Try adjusting your filters.';
                if (btn) btn.style.display = 'none';
            } else {
                if (title) title.textContent = 'No Staff Yet';
                if (text) text.textContent = 'Get started by adding your first staff member to the system';
                if (btn) btn.style.display = 'inline-block';
            }
        }
    } else {
        if (elements.tableContainer) elements.tableContainer.style.display = 'block';
        if (elements.paginationFooter) elements.paginationFooter.style.display = 'block';
        if (elements.emptyState) elements.emptyState.style.display = 'none';
    }
}

/**
 * Toggle all checkboxes
 */
function toggleAllSelection() {
    const isChecked = elements.selectAllCheckbox.checked;
    const checkboxes = document.querySelectorAll('.staff-checkbox');
    
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const row = cb.closest('tr');
        if (row) {
            if (isChecked) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
            }
        }
    });
    
    updateBulkActionState();
}

/**
 * Update bulk action button state
 */
function updateBulkActionState() {
    const allCheckboxes = document.querySelectorAll('.staff-checkbox');
    const checkedBoxes = document.querySelectorAll('.staff-checkbox:checked');
    const count = checkedBoxes.length;
    
    if (elements.selectedCountSpan) elements.selectedCountSpan.textContent = count;
    
    // Update "Select All" checkbox state
    if (elements.selectAllCheckbox) {
        if (allCheckboxes.length > 0 && count === allCheckboxes.length) {
            elements.selectAllCheckbox.checked = true;
            elements.selectAllCheckbox.indeterminate = false;
        } else if (count > 0) {
            elements.selectAllCheckbox.checked = false;
            elements.selectAllCheckbox.indeterminate = true;
        } else {
            elements.selectAllCheckbox.checked = false;
            elements.selectAllCheckbox.indeterminate = false;
        }
    }
    
    // Update bulk delete button visibility
    if (count > 0) {
        if (elements.bulkDeleteBtn) elements.bulkDeleteBtn.style.display = 'inline-block';
    } else {
        if (elements.bulkDeleteBtn) elements.bulkDeleteBtn.style.display = 'none';
    }
}

/**
 * View Staff Details
 */
function viewStaffDetails(staffId) {
    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return;
    
    const modalContent = document.getElementById('staffDetailsContent');
    if (modalContent) {
        const modalDialog = document.querySelector('#viewStaffModal .modal-dialog');
        if (modalDialog) {
            modalDialog.classList.add('staff-details-modal');
        }

        modalContent.innerHTML = `
            <div class="staff-details-header">
                <div class="staff-details-avatar">
                    ${staff.avatarHtml}
                </div>
                <div class="staff-details-title">
                    <h3>${staff.name}</h3>
                    <div class="staff-details-meta">
                        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">
                            <i class="bi bi-person-badge me-1"></i> ${staff.role}
                        </span>
                        <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-10">
                            <i class="bi bi-building me-1"></i> ${staff.branch}
                        </span>
                        <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10">
                            <i class="bi bi-card-text me-1"></i> ${staff.employeeId}
                        </span>
                        <span class="badge ${staff.status === 'Active' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${staff.status === 'Active' ? 'text-success' : 'text-danger'} border ${staff.status === 'Active' ? 'border-success' : 'border-danger'} border-opacity-10">
                            <i class="bi bi-circle-fill me-1" style="font-size: 0.6rem;"></i> ${staff.status}
                        </span>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-person-lines-fill"></i> Personal Information
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-envelope"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Email Address</div>
                        <div class="detail-value">${staff.email}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-telephone"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Phone Number</div>
                        <div class="detail-value">${staff.phone}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-gender-ambiguous"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Gender</div>
                        <div class="detail-value">${staff.gender}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-calendar-event"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Date of Birth</div>
                        <div class="detail-value">${staff.dob}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-flag"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Nationality</div>
                        <div class="detail-value">${staff.nationality}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-heart"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Marital Status</div>
                        <div class="detail-value">${staff.maritalStatus}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-briefcase"></i> Employment Details
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-building"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Department/Role</div>
                        <div class="detail-value">${staff.department} / ${staff.role}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-clock"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Work Shift</div>
                        <div class="detail-value">${staff.workShift}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-person-workspace"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Reporting Manager</div>
                        <div class="detail-value">${staff.reportingManager}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Joining Date</div>
                        <div class="detail-value">${staff.joinDate}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-briefcase-fill"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Employment Type</div>
                        <div class="detail-value">${staff.employmentType}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-star"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Experience</div>
                        <div class="detail-value">${staff.experience}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-mortarboard"></i> Qualification & Skills
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-book"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Highest Qualification</div>
                        <div class="detail-value">${staff.qualification}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-lightbulb"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Specialization</div>
                        <div class="detail-value">${staff.specialization}</div>
                    </div>
                </div>
            </div>
            
            ${(staff.certificationsHtml && staff.certificationsHtml.trim() !== '-' && staff.certificationsHtml.trim() !== '') || (staff.documentsHtml && staff.documentsHtml.trim() !== '-' && staff.documentsHtml.trim() !== '') ? `
            <div class="detail-section-title">
                <i class="bi bi-file-earmark-text"></i> Documents & Certifications
            </div>
            <div class="detail-grid">
                ${staff.certificationsHtml && staff.certificationsHtml.trim() !== '-' && staff.certificationsHtml.trim() !== '' ? `
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-award"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Certifications</div>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                            ${staff.certificationsHtml}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${staff.documentsHtml && staff.documentsHtml.trim() !== '-' && staff.documentsHtml.trim() !== '' ? `
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-folder2-open"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Documents</div>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                            ${staff.documentsHtml}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <div class="detail-section-title">
                <i class="bi bi-geo-alt"></i> Address & Emergency
            </div>
            <div class="detail-grid">
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-map"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Address</div>
                        <div class="detail-value">${staff.address}, ${staff.city}, ${staff.state} - ${staff.postalCode}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-telephone-plus"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Emergency Contact</div>
                        <div class="detail-value">${staff.emergencyContact} (${staff.emergencyRelation})</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-phone"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Emergency Phone</div>
                        <div class="detail-value">${staff.emergencyPhone}</div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('viewStaffModal'));
        modal.show();
    }
}

/**
 * Confirm Delete
 */
function confirmDelete(staffId) {
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Delete Staff Member',
            message: 'Are you sure you want to delete this staff member? This action cannot be undone.',
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                deleteStaff(staffId);
            }
        });
    } else {
        if (confirm('Are you sure you want to delete this staff member?')) {
            deleteStaff(staffId);
        }
    }
}

/**
 * Confirm Bulk Delete
 */
function confirmBulkDelete() {
    const checkedBoxes = document.querySelectorAll('.staff-checkbox:checked');
    const ids = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (ids.length === 0) return;
    
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Delete Selected Staff',
            message: `Are you sure you want to delete ${ids.length} staff member${ids.length > 1 ? 's' : ''}? This action cannot be undone.`,
            confirmText: 'Delete All',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                deleteStaffBulk(ids);
            }
        });
    } else {
        if (confirm(`Are you sure you want to delete ${ids.length} staff members?`)) {
            deleteStaffBulk(ids);
        }
    }
}

/**
 * Delete Staff (API call)
 */
function deleteStaff(staffId) {
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${contextPath}/staff/delete`;
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'staffId';
    input.value = staffId;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

/**
 * Bulk Delete Staff (API call)
 */
function deleteStaffBulk(ids) {
    if (ids.length === 0) return;
    
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${contextPath}/staff/deleteBulk`;
    
    ids.forEach(id => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'staffIds[]';
        input.value = id;
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
