/**
 * all-students.js
 * Handles student page interactions including search, filtering, pagination, and CRUD operations.
 * Uses server-side pagination and filtering.
 */

document.addEventListener('DOMContentLoaded', function() {
    init();
});

// State variables
let studentData = []; // Used for View Modal (contains current page data)
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    courseFilter: document.getElementById('courseFilter'),
    branchFilter: document.getElementById('branchFilter'),
    batchFilter: document.getElementById('batchFilter'),
    statusFilter: document.getElementById('statusFilter'),
    resetBtn: document.getElementById('resetFilters'),
    itemsPerPageSelect: document.getElementById('itemsPerPage'),
    tableBody: document.getElementById('studentTableBody'),
    tableContainer: document.getElementById('studentTableContainer'),
    emptyState: document.getElementById('emptyState'),
    paginationFooter: document.getElementById('paginationFooter'),
    selectAllCheckbox: document.getElementById('selectAllStudents'),
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

    loadStudentDataFromDOM();
    setupEventListeners();
    renderPagination();
    
    // Check empty state
    if (typeof serverPagination !== 'undefined' && serverPagination.totalItems === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const hasFilters = urlParams.has('search') || urlParams.has('course') || urlParams.has('branch') || urlParams.has('batch') || urlParams.has('status');
        showEmptyState(true, hasFilters);
    } else {
        showEmptyState(false);
    }
}

/**
 * Load student data from the server-rendered table (for Modal View)
 */
function loadStudentDataFromDOM() {
    const rows = document.querySelectorAll('#studentTableBody tr');
    studentData = Array.from(rows).map(row => {
        const cells = row.cells;
        const getText = (index) => cells[index] ? cells[index].textContent.trim() : '';
        const getHtml = (index) => cells[index] ? cells[index].innerHTML : '';
        
        const avatarContainer = row.querySelector('.student-avatar');
        const avatarHtml = avatarContainer ? avatarContainer.innerHTML : '';
        
        const nameElement = row.querySelector('.student-name');
        const name = nameElement ? nameElement.textContent.trim() : getText(1);
        
        const fullId = row.getAttribute('data-student-id') || '';
        
        return {
            element: row,
            id: fullId,
            course: row.getAttribute('data-course'),
            status: row.getAttribute('data-status'),
            branch: row.getAttribute('data-branch'),
            name: name,
            avatarHtml: avatarHtml,
            courseName: row.getAttribute('data-course') || '-',
            branchName: getText(4),
            email: getText(5),
            phone: getText(6),
            whatsapp: getText(7),
            parentMobile: getText(8),
            gender: getText(9),
            bloodGroup: getText(10),
            dob: getText(11),
            qualification: getText(12),
            specialization: getText(13),
            college: getText(14),
            passingYear: getText(15),
            batchCode: getText(2),
            batchName: getText(3),
            instagram: getText(16),
            linkedin: getText(17),
            permanentAddress: getText(18),
            currentAddress: getText(19),
            medicalHistory: getText(20),
            declaration: getText(21),
            documentsHtml: getHtml(22),
            feesAllowed: getText(23)
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
    
    if (elements.courseFilter) {
        elements.courseFilter.addEventListener('change', applyFilters);
    }
    
    if (elements.branchFilter) {
        elements.branchFilter.addEventListener('change', applyFilters);
    }

    if (elements.batchFilter) {
        elements.batchFilter.addEventListener('change', applyFilters);
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
            if (e.target.classList.contains('student-checkbox')) {
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
            
            const studentId = target.getAttribute('data-student-id');
            
            if (target.classList.contains('view-btn')) {
                viewStudentDetails(studentId);
            } else if (target.classList.contains('edit-btn')) {
                window.location.href = `${contextPath}/dashboard/pages/students/add-student.jsp?id=${studentId}`;
            } else if (target.classList.contains('delete-btn')) {
                confirmDelete(studentId);
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
    if (elements.courseFilter) elements.courseFilter.value = '';
    if (elements.branchFilter) elements.branchFilter.value = '';
    if (elements.batchFilter) elements.batchFilter.value = '';
    if (elements.statusFilter) elements.statusFilter.value = '';
    applyFilters();
}

/**
 * Reload page with current state
 */
function reloadPage() {
    fetchStudents();
}

function fetchStudents() {
    const params = new URLSearchParams();
    
    // Map JSP params to API params
    if (elements.searchInput && elements.searchInput.value.trim()) {
        params.set('search', elements.searchInput.value.trim());
    }
    if (elements.courseFilter && elements.courseFilter.value) {
        params.set('courseId', elements.courseFilter.value);
    }
    if (elements.branchFilter && elements.branchFilter.value) {
        params.set('branchId', elements.branchFilter.value);
    }
    if (elements.batchFilter && elements.batchFilter.value) {
        params.set('batchId', elements.batchFilter.value);
    }
    if (elements.statusFilter && elements.statusFilter.value) {
        params.set('status', elements.statusFilter.value);
    }
    
    params.set('page', currentPage);
    params.set('pageSize', itemsPerPage);

    // Update URL for history
    const urlParams = new URLSearchParams();
    if (elements.courseFilter.value) urlParams.set('course', elements.courseFilter.value);
    if (elements.branchFilter.value) urlParams.set('branch', elements.branchFilter.value);
    if (elements.batchFilter.value) urlParams.set('batch', elements.batchFilter.value);
    if (elements.statusFilter.value) urlParams.set('status', elements.statusFilter.value);
    if (elements.searchInput.value.trim()) urlParams.set('search', elements.searchInput.value.trim());
    urlParams.set('page', currentPage);
    urlParams.set('limit', itemsPerPage);
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({path: newUrl}, '', newUrl);

    // Call API
    fetch(`${contextPath}/api/students/list?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            renderTable(data);
            updatePaginationInfo(data.totalCount);
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally show toast
        });
}

function updatePaginationInfo(total) {
    if (typeof serverPagination !== 'undefined') {
        serverPagination.totalItems = total;
        serverPagination.totalPages = Math.ceil(total / itemsPerPage);
        totalPages = serverPagination.totalPages;
    } else {
        totalPages = Math.ceil(total / itemsPerPage);
    }
    
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    
    const showStartEl = document.getElementById('showingStart');
    const showEndEl = document.getElementById('showingEnd');
    const totalEl = document.getElementById('totalEntries');
    
    if(showStartEl) showStartEl.textContent = start;
    if(showEndEl) showEndEl.textContent = end;
    if(totalEl) totalEl.textContent = total;
    
    renderPagination();
}

function renderTable(data) {
    const tbody = elements.tableBody;
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (!data.students || data.students.length === 0) {
        if(elements.tableContainer) elements.tableContainer.style.display = 'none';
        if(elements.emptyState) elements.emptyState.style.display = 'block';
        if(elements.paginationFooter) elements.paginationFooter.style.display = 'none';
        return;
    }
    
    if(elements.tableContainer) elements.tableContainer.style.display = 'block';
    if(elements.emptyState) elements.emptyState.style.display = 'none';
    if(elements.paginationFooter) elements.paginationFooter.style.display = 'block';
    
    const getInitials = (fname, lname) => {
        return ((fname ? fname.charAt(0) : '') + (lname ? lname.charAt(0) : '')).toUpperCase();
    };

    data.students.forEach(student => {
        const batch = (typeof batchMap !== 'undefined' && batchMap[student.batchId]) ? batchMap[student.batchId] : {};
        const courseName = batch.courseId ? ((typeof courseMap !== 'undefined' && courseMap[batch.courseId]) || '-') : '-';
        const branchName = batch.branchId ? ((typeof branchMap !== 'undefined' && branchMap[batch.branchId]) || '-') : '-';
        const batchCode = batch.code || '-';
        const batchName = batch.name || '-';
        
        const fullName = `${student.studentName} ${student.surname}`;
        
        const tr = document.createElement('tr');
        tr.dataset.studentId = student.studentId;
        tr.dataset.course = courseName;
        tr.dataset.status = student.studentStatus;
        tr.dataset.branch = branchName;
        
        let avatarContent = getInitials(student.studentName, student.surname);
        if (student.profilePhotoUrl) {
            avatarContent = `<img src="${student.profilePhotoUrl}" alt="${fullName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        }

        let statusBadge = '';
        const st = student.studentStatus || '';
        if (st.toLowerCase() === 'active') statusBadge = `<span class="badge status-active">${st}</span>`;
        else if (st.toLowerCase() === 'pending') statusBadge = `<span class="badge status-pending">${st}</span>`;
        else if (st.toLowerCase() === 'graduated') statusBadge = `<span class="badge status-graduated">${st}</span>`;
        else statusBadge = `<span class="badge status-inactive">${st}</span>`;

        const declBadge = student.studentDeclaration 
            ? `<span class="badge bg-success bg-opacity-10 text-success">Signed</span>`
            : `<span class="badge bg-warning bg-opacity-10 text-warning">Pending</span>`;

        const feesBadge = (student.feesAllowed && student.feesAllowed.toLowerCase() === 'yes')
            ? `<span class="badge bg-success bg-opacity-10 text-success">Yes</span>`
            : `<span class="badge bg-danger bg-opacity-10 text-danger">No</span>`;

        let docsHtml = '';
        if (student.documents && student.documents.length > 0) {
            student.documents.forEach(doc => {
                docsHtml += `<a href="${doc.documentUrl}" target="_blank" class="badge bg-secondary text-decoration-none mb-1 me-1">${doc.documentType}</a>`;
            });
        } else {
            docsHtml = '-';
        }

        const truncate = (str, n) => (str && str.length > n) ? str.substr(0, n-1) + '...' : (str || '-');
        const pAddr = truncate(student.permanentAddress, 20);
        const cAddr = truncate(student.currentAddress, 20);
        
        // Date formatting YYYY-MM-DD -> DD-MM-YYYY
        let dob = '-';
        if(student.dateOfBirth) {
            try {
                const parts = student.dateOfBirth.split(' ')[0].split('-');
                if(parts.length === 3) dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
                else dob = student.dateOfBirth;
            } catch(e) { dob = student.dateOfBirth; }
        }

        tr.innerHTML = `
            <td>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input student-checkbox" value="${student.studentId}">
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="student-avatar">${avatarContent}</div>
                    <div>
                        <div class="student-name">${fullName}</div>
                        <small class="text-muted">Father: ${student.fatherName || '-'}</small>
                    </div>
                </div>
            </td>
            <td>${batchCode}</td>
            <td><span class="course-badge">${batchName}</span></td>
            <td>${branchName}</td>
            <td>${student.emailId || '-'}</td>
            <td>${student.mobileNumber || '-'}</td>
            <td>${student.whatsappNumber || '-'}</td>
            <td>${student.parentMobile || '-'}</td>
            <td>${student.gender || '-'}</td>
            <td>${student.bloodGroup || '-'}</td>
            <td>${dob}</td>
            <td>${student.educationQualification || '-'}</td>
            <td>${student.specialization || '-'}</td>
            <td>${student.collegeName || '-'}</td>
            <td>${student.passingYear || '-'}</td>
            <td>${student.instagramId || '-'}</td>
            <td>${student.linkedinId || '-'}</td>
            <td title="${student.permanentAddress || ''}">${pAddr}</td>
            <td title="${student.currentAddress || ''}">${cAddr}</td>
            <td>${student.medicalHistory ? 'Yes' : 'No'}</td>
            <td>${declBadge}</td>
            <td>${docsHtml}</td>
            <td>${feesBadge}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm view-btn" data-student-id="${student.studentId}" title="View Details"><i class="bi bi-eye"></i></button>
                    <button type="button" class="btn btn-sm btn-outline-success edit-btn" data-student-id="${student.studentId}" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-student-id="${student.studentId}" title="Delete"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (elements.selectAllCheckbox) elements.selectAllCheckbox.checked = false;
    updateBulkActionState();
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
                if (title) title.textContent = 'No Students Found';
                if (text) text.textContent = 'No students match your search criteria. Try adjusting your filters.';
                if (btn) btn.style.display = 'none';
            } else {
                if (title) title.textContent = 'No Students Yet';
                if (text) text.textContent = 'Get started by adding your first student to the system';
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
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
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
    const allCheckboxes = document.querySelectorAll('.student-checkbox');
    const checkedBoxes = document.querySelectorAll('.student-checkbox:checked');
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
 * View Student Details
 */
function viewStudentDetails(studentId) {
    const student = studentData.find(s => s.id === studentId);
    if (!student) return;
    
    const modalContent = document.getElementById('studentDetailsContent');
    if (modalContent) {
        const modalDialog = document.querySelector('#viewStudentModal .modal-dialog');
        if (modalDialog) {
            modalDialog.classList.add('student-details-modal');
        }

        modalContent.innerHTML = `
            <div class="student-details-header">
                <div class="student-details-avatar">
                    ${student.avatarHtml}
                </div>
                <div class="student-details-title">
                    <h3>${student.name}</h3>
                    <div class="student-details-meta">
                        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">
                            <i class="bi bi-book me-1"></i> ${student.courseName}
                        </span>
                        <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-10">
                            <i class="bi bi-building me-1"></i> ${student.branchName}
                        </span>
                        <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10">
                            <i class="bi bi-upc-scan me-1"></i> ${student.batchCode}
                        </span>
                        <span class="badge ${student.status === 'Active' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${student.status === 'Active' ? 'text-success' : 'text-danger'} border ${student.status === 'Active' ? 'border-success' : 'border-danger'} border-opacity-10">
                            <i class="bi bi-circle-fill me-1" style="font-size: 0.6rem;"></i> ${student.status}
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
                        <div class="detail-value">${student.email}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-telephone"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Phone Number</div>
                        <div class="detail-value">${student.phone}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-whatsapp"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">WhatsApp</div>
                        <div class="detail-value">${student.whatsapp}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-telephone-forward"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Parent's Mobile</div>
                        <div class="detail-value">${student.parentMobile}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-gender-ambiguous"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Gender</div>
                        <div class="detail-value">${student.gender}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-droplet"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Blood Group</div>
                        <div class="detail-value">${student.bloodGroup}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-calendar-event"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Date of Birth</div>
                        <div class="detail-value">${student.dob}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-instagram"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Instagram</div>
                        <div class="detail-value">${student.instagram}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-linkedin"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">LinkedIn</div>
                        <div class="detail-value">${student.linkedin}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-geo-alt"></i> Address Information
            </div>
            <div class="detail-grid">
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-house-door"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Permanent Address</div>
                        <div class="detail-value">${student.permanentAddress}</div>
                    </div>
                </div>
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-geo"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Current Address</div>
                        <div class="detail-value">${student.currentAddress}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-mortarboard"></i> Educational Details
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-building"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">College Name</div>
                        <div class="detail-value">${student.college}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-book"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Qualification</div>
                        <div class="detail-value">${student.qualification}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-lightbulb"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Specialization</div>
                        <div class="detail-value">${student.specialization}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Passing Year</div>
                        <div class="detail-value">${student.passingYear}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section-title">
                <i class="bi bi-journal-check"></i> Enrollment & Medical
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-upc-scan"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Batch Code</div>
                        <div class="detail-value">${student.batchCode}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-bookmark"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Batch Name</div>
                        <div class="detail-value">${student.batchName}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-heart-pulse"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Medical History</div>
                        <div class="detail-value">${student.medicalHistory}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-file-earmark-check"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Declaration</div>
                        <div class="detail-value">${student.declaration}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="bi bi-cash-coin"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Fees Allowed</div>
                        <div class="detail-value">${student.feesAllowed}</div>
                    </div>
                </div>
            </div>
            
            ${(student.documentsHtml && student.documentsHtml.trim() !== '-' && student.documentsHtml.trim() !== '') ? `
            <div class="detail-section-title">
                <i class="bi bi-file-earmark-text"></i> Documents
            </div>
            <div class="detail-grid">
                <div class="detail-item full-width">
                    <div class="detail-icon">
                        <i class="bi bi-folder2-open"></i>
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Uploaded Documents</div>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                            ${student.documentsHtml}
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('viewStudentModal'));
        modal.show();
    }
}

/**
 * Confirm Delete
 */
function confirmDelete(studentId) {
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Delete Student',
            message: 'Are you sure you want to delete this student? This action cannot be undone.',
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                deleteStudent(studentId);
            }
        });
    } else {
        if (confirm('Are you sure you want to delete this student?')) {
            deleteStudent(studentId);
        }
    }
}

/**
 * Confirm Bulk Delete
 */
function confirmBulkDelete() {
    const checkedBoxes = document.querySelectorAll('.student-checkbox:checked');
    const ids = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (ids.length === 0) return;
    
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Delete Selected Students',
            message: `Are you sure you want to delete ${ids.length} student${ids.length > 1 ? 's' : ''}? This action cannot be undone.`,
            confirmText: 'Delete All',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                deleteStudentBulk(ids);
            }
        });
    } else {
        if (confirm(`Are you sure you want to delete ${ids.length} students?`)) {
            deleteStudentBulk(ids);
        }
    }
}

/**
 * Delete Student (API call)
 */
function deleteStudent(studentId) {
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${contextPath}/api/students/delete`;
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'studentId';
    input.value = studentId;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

/**
 * Bulk Delete Student (API call)
 */
function deleteStudentBulk(ids) {
    if (ids.length === 0) return;
    
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${contextPath}/api/students/delete`;
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'studentIds';
    input.value = ids.join(',');
    form.appendChild(input);
    
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
