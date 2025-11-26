/**
 * Placement Reports - Comprehensive JavaScript
 * Full CRUD operations with edge case coverage
 */

// Sample placement data with diverse cases
const placementData = [
    {
        id: 1,
        studentName: "Aarav Sharma",
        studentId: "STU001",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        department: "Computer Science",
        batch: "2024-25",
        company: "Google India",
        designation: "Software Engineer",
        package: 18.5,
        jobType: "Full-Time",
        status: "joined",
        location: "Bangalore",
        offerDate: "2024-10-15",
        joiningDate: "2025-07-01",
        remarks: "Outstanding performance in technical interviews"
    },
    {
        id: 2,
        studentName: "Diya Patel",
        studentId: "STU002",
        email: "diya.patel@example.com",
        phone: "+91 98765 43211",
        department: "MBA",
        batch: "2024-25",
        company: "Deloitte",
        designation: "Business Analyst",
        package: 12.0,
        jobType: "Full-Time",
        status: "offered",
        location: "Mumbai",
        offerDate: "2024-10-20",
        joiningDate: "",
        remarks: ""
    },
    {
        id: 3,
        studentName: "Arjun Kumar",
        studentId: "STU003",
        email: "arjun.kumar@example.com",
        phone: "+91 98765 43212",
        department: "Mechanical",
        batch: "2024-25",
        company: "TCS",
        designation: "Systems Engineer",
        package: 7.5,
        jobType: "Full-Time",
        status: "offered",
        location: "Chennai",
        offerDate: "2024-11-05",
        joiningDate: "",
        remarks: ""
    },
    {
        id: 4,
        studentName: "Aisha Khan",
        studentId: "STU006",
        email: "aisha.khan@example.com",
        phone: "+91 98765 43213",
        department: "Computer Science",
        batch: "2024-25",
        company: "Amazon",
        designation: "Data Scientist",
        package: 22.0,
        jobType: "Full-Time",
        status: "joined",
        location: "Hyderabad",
        offerDate: "2024-09-10",
        joiningDate: "2025-06-01",
        remarks: "Highest package this year"
    },
    {
        id: 5,
        studentName: "Vihaan Mehta",
        studentId: "STU005",
        email: "vihaan.mehta@example.com",
        phone: "+91 98765 43214",
        department: "Computer Science",
        batch: "2024-25",
        company: "Microsoft",
        designation: "SDE",
        package: 20.0,
        jobType: "Full-Time",
        status: "placed",
        location: "Pune",
        offerDate: "2024-09-25",
        joiningDate: "",
        remarks: ""
    },
    {
        id: 6,
        studentName: "Myra Gupta",
        studentId: "STU010",
        email: "myra.gupta@example.com",
        phone: "+91 98765 43215",
        department: "Mechanical",
        batch: "2024-25",
        company: "Infosys",
        designation: "Technology Analyst",
        package: 9.5,
        jobType: "Internship",
        status: "declined",
        location: "Bangalore",
        offerDate: "2024-10-12",
        joiningDate: "",
        remarks: "Declined for better opportunity"
    },
    {
        id: 7,
        studentName: "Zara Iyer",
        studentId: "STU012",
        email: "zara.iyer@example.com",
        phone: "+91 98765 43216",
        department: "Civil",
        batch: "2024-25",
        company: "Goldman Sachs",
        designation: "Analyst",
        package: 25.0,
        jobType: "Full-Time",
        status: "joined",
        location: "Mumbai",
        offerDate: "2024-10-01",
        joiningDate: "2025-07-15",
        remarks: "Record breaking package"
    },
    {
        id: 8,
        studentName: "Rohan Verma",
        studentId: "STU007",
        email: "rohan.verma@example.com",
        phone: "+91 98765 43217",
        department: "Electronics",
        batch: "2024-25",
        company: "Wipro",
        designation: "Project Engineer",
        package: 6.5,
        jobType: "Full-Time",
        status: "pending",
        location: "Bangalore",
        offerDate: "",
        joiningDate: "",
        remarks: "Awaiting final confirmation"
    }
];

// Application state
const state = {
    allRecords: [...placementData],
    filteredRecords: [...placementData],
    allRows: [],
    currentPage: 1,
    itemsPerPage: 10,
    editingId: null,
    deletingId: null,
    selectedIds: new Set() // Track selected row IDs across renders
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
        setupKeyboardShortcuts();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize application');
    }
});

// Setup keyboard shortcuts with safety checks
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Prevent accidental deletion with Delete key
        if (e.key === 'Delete' && !e.target.matches('input, textarea')) {
            const selectedCount = document.querySelectorAll('.row-checkbox:checked').length;
            if (selectedCount > 0) {
                e.preventDefault();
                showConfirmationModal({
                    title: 'Delete Selected Records',
                    message: `
                        <p>Delete <strong>${selectedCount}</strong> selected record(s)?</p>
                        <p class="text-muted mb-0">Press OK to confirm or Cancel to abort.</p>
                    `,
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    confirmClass: 'btn-danger',
                    icon: 'bi-trash-fill text-danger',
                    onConfirm: () => handleBulkDelete()
                });
            }
        }
        
        // Ctrl+A to select all visible records
        if (e.ctrlKey && e.key === 'a' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            const selectAll = document.getElementById('selectAll');
            if (selectAll) {
                selectAll.checked = true;
                toggleSelectAll();
                showInfo(`${document.querySelectorAll('.row-checkbox:checked').length} records selected`);
            }
        }
        
        // Escape to clear selections
        if (e.key === 'Escape') {
            const selectedCount = document.querySelectorAll('.row-checkbox:checked').length;
            if (selectedCount > 0) {
                const selectAll = document.getElementById('selectAll');
                if (selectAll) {
                    selectAll.checked = false;
                    toggleSelectAll();
                    showInfo('Selection cleared');
                }
            }
        }
    });
}

// Setup form validation helpers
function setupFormValidation() {
    // Student Name: Auto-fill existing student data
    const studentNameInput = document.getElementById('studentName');
    if (studentNameInput) {
        let debounceTimer;
        studentNameInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            const searchName = this.value.trim().toLowerCase();
            
            if (searchName.length < 3) {
                // Clear auto-fill hints if name too short
                clearAutoFillHint();
                return;
            }
            
            debounceTimer = setTimeout(() => {
                // Search for existing student by name
                const existingStudent = state.allRecords.find(r => 
                    r.studentName.toLowerCase().includes(searchName) ||
                    r.studentName.toLowerCase() === searchName
                );
                
                if (existingStudent && !state.editingId) {
                    // Show auto-fill suggestion
                    showAutoFillSuggestion(existingStudent);
                } else {
                    clearAutoFillHint();
                }
            }, 300);
        });
        
        // Also trigger on blur for exact matches
        studentNameInput.addEventListener('blur', function() {
            const searchName = this.value.trim().toLowerCase();
            if (searchName.length >= 3) {
                const exactMatch = state.allRecords.find(r => 
                    r.studentName.toLowerCase() === searchName
                );
                if (exactMatch && !state.editingId) {
                    autoFillStudentData(exactMatch);
                }
            }
        });
    }
    
    // Student ID: Auto-uppercase and alphanumeric validation
    const studentIdInput = document.getElementById('studentId');
    if (studentIdInput) {
        studentIdInput.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }
    
    // Email: Real-time validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
    }
    
    // Phone: Format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Allow only numbers, spaces, +, -, ()
            this.value = this.value.replace(/[^0-9+\-() ]/g, '');
        });
    }
    
    // Package: Validate range
    const packageInput = document.getElementById('package');
    if (packageInput) {
        packageInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value < 0 || value > 999) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
    }
    
    // Remarks: Character counter
    const remarksInput = document.getElementById('remarks');
    if (remarksInput) {
        const updateCounter = () => {
            const current = remarksInput.value.length;
            const max = 500;
            let counterEl = remarksInput.parentElement.querySelector('.char-counter');
            
            if (!counterEl) {
                counterEl = document.createElement('small');
                counterEl.className = 'char-counter text-muted d-block mt-1';
                remarksInput.parentElement.querySelector('.text-muted').insertAdjacentElement('afterend', counterEl);
            }
            
            counterEl.textContent = `${current} / ${max} characters`;
            counterEl.className = current > max ? 'char-counter text-danger d-block mt-1' : 'char-counter text-muted d-block mt-1';
        };
        
        remarksInput.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    // Batch: Auto-format batch year
    const batchInput = document.getElementById('batch');
    if (batchInput) {
        batchInput.addEventListener('blur', function() {
            const value = this.value.trim();
            // Auto-format single year to year range (e.g., "2024" to "2024-25")
            if (/^\d{4}$/.test(value)) {
                const year = parseInt(value);
                const nextYear = (year + 1).toString().slice(-2);
                this.value = `${year}-${nextYear}`;
            }
        });
    }
    
    // Offer Date and Joining Date: Validate relationship
    const offerDateInput = document.getElementById('offerDate');
    const joiningDateInput = document.getElementById('joiningDate');
    
    if (offerDateInput && joiningDateInput) {
        const validateDates = () => {
            if (offerDateInput.value && joiningDateInput.value) {
                const offerDate = new Date(offerDateInput.value);
                const joiningDate = new Date(joiningDateInput.value);
                
                if (joiningDate < offerDate) {
                    joiningDateInput.classList.add('is-invalid');
                    joiningDateInput.classList.remove('is-valid');
                } else {
                    joiningDateInput.classList.add('is-valid');
                    joiningDateInput.classList.remove('is-invalid');
                }
            } else {
                joiningDateInput.classList.remove('is-invalid', 'is-valid');
            }
        };
        
        offerDateInput.addEventListener('change', validateDates);
        joiningDateInput.addEventListener('change', validateDates);
    }
    
    // Required fields: Visual feedback on blur
    const requiredFields = document.querySelectorAll('#recordForm [required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            }
        });
    });
}

// Auto-fill helper functions
function showAutoFillSuggestion(student) {
    clearAutoFillHint();
    
    const studentNameInput = document.getElementById('studentName');
    if (!studentNameInput) return;
    
    // Create suggestion hint
    const hint = document.createElement('div');
    hint.id = 'autoFillHint';
    hint.className = 'alert alert-info alert-dismissible fade show mt-2 p-2';
    hint.innerHTML = `
        <small>
            <i class="bi bi-info-circle"></i> 
            <strong>Student found:</strong> ${escapeHtml(student.studentName)} (${escapeHtml(student.studentId)})
            <button type="button" class="btn btn-sm btn-link p-0 ms-2" onclick="autoFillStudentData(${JSON.stringify(student).replace(/"/g, '&quot;')})">
                <i class="bi bi-arrow-down-circle"></i> Fill Details
            </button>
        </small>
        <button type="button" class="btn-close btn-close-sm" onclick="clearAutoFillHint()"></button>
    `;
    
    studentNameInput.parentElement.appendChild(hint);
}

function clearAutoFillHint() {
    const hint = document.getElementById('autoFillHint');
    if (hint) hint.remove();
}

function autoFillStudentData(student) {
    // Auto-fill known student information
    document.getElementById('studentId').value = student.studentId || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('department').value = student.department || '';
    document.getElementById('batch').value = student.batch || '';
    
    // Add visual feedback
    const fieldsToHighlight = ['studentId', 'email', 'phone', 'department', 'batch'];
    fieldsToHighlight.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value) {
            field.classList.add('is-valid');
            // Remove highlight after 2 seconds
            setTimeout(() => {
                field.classList.remove('is-valid');
            }, 2000);
        }
    });
    
    clearAutoFillHint();
    showInfo(`Student details auto-filled for ${student.studentName}`);
    
    // Focus on company field (next empty field)
    setTimeout(() => {
        document.getElementById('company')?.focus();
    }, 100);
}

function initializeApp() {
    attachEventListeners();
    populateCompanyFilter();
    updateStatistics();
    renderTable();
}

// Event Listeners
function attachEventListeners() {
    // Filter events
    document.getElementById('searchInput')?.addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
    document.getElementById('filterDepartment')?.addEventListener('change', applyFilters);
    document.getElementById('filterBatch')?.addEventListener('change', applyFilters);
    document.getElementById('filterCompany')?.addEventListener('change', applyFilters);
    document.getElementById('clearFilters')?.addEventListener('click', clearFilters);
    
    // Action buttons
    document.getElementById('addRecordBtn')?.addEventListener('click', openAddModal);
    document.getElementById('emptyAddBtn')?.addEventListener('click', openAddModal);
    document.getElementById('retryBtn')?.addEventListener('click', refreshData);
    document.getElementById('exportBtn')?.addEventListener('click', exportToCSV);
    document.getElementById('refreshBtn')?.addEventListener('click', refreshData);
    
    // Form events
    document.getElementById('recordForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('selectAll')?.addEventListener('change', toggleSelectAll);
    document.getElementById('entriesPerPage')?.addEventListener('change', changeEntriesPerPage);
    
    // Modal events
    document.getElementById('editFromView')?.addEventListener('click', handleEditFromView);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', handleBulkDelete);
    document.getElementById('confirmBulkDeleteBtn')?.addEventListener('click', confirmBulkDelete);
    
    // Real-time form validation helpers
    setupFormValidation();
    
    // Event delegation for table checkboxes and action buttons
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        // Handle checkbox changes with event delegation
        tableBody.addEventListener('change', function(e) {
            if (e.target.classList.contains('row-checkbox')) {
                const checkbox = e.target;
                const row = checkbox.closest('tr');
                const recordId = parseInt(checkbox.value);
                
                if (checkbox.checked) {
                    row.classList.add('row-selected');
                    state.selectedIds.add(recordId); // Save to state
                } else {
                    row.classList.remove('row-selected');
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                    state.selectedIds.delete(recordId); // Remove from state
                }
                
                updateSelectAllState();
                updateBulkDeleteButton();
            }
        });
        
        // Handle action button clicks with event delegation
        tableBody.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;
            
            const row = target.closest('tr');
            if (!row) return;
            
            // Get record ID from data attribute
            const recordId = parseInt(target.dataset.recordId);
            if (!recordId) return;
            
            if (target.classList.contains('view')) {
                e.preventDefault();
                viewRecord(recordId);
            } else if (target.classList.contains('edit')) {
                e.preventDefault();
                editRecord(recordId);
            } else if (target.classList.contains('delete')) {
                e.preventDefault();
                deleteRecord(recordId);
            }
        });
    }
}

// Populate company filter dynamically
function populateCompanyFilter() {
    const companies = [...new Set(state.allRecords.map(r => r.company))].sort();
    const filterCompany = document.getElementById('filterCompany');
    
    if (filterCompany) {
        // Save current selection
        const currentValue = filterCompany.value;
        
        // Clear existing options except the first "All Companies" option
        filterCompany.innerHTML = '<option value="">All Companies</option>';
        
        // Add company options
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            option.textContent = company;
            filterCompany.appendChild(option);
        });
        
        // Restore selection if still valid
        if (currentValue && companies.includes(currentValue)) {
            filterCompany.value = currentValue;
        } else if (currentValue) {
            // Company was deleted, clear filter and reapply
            filterCompany.value = '';
            applyFilters();
        }
    }
}

// Update statistics
function updateStatistics() {
    try {
        const joined = state.allRecords.filter(r => r.status === 'joined' || r.status === 'placed').length;
        const companies = new Set(state.allRecords.map(r => r.company)).size;
        const packages = state.allRecords.map(r => r.package).filter(p => p > 0);
        const avgPkg = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length) : 0;
        const maxPkg = packages.length > 0 ? Math.max(...packages) : 0;
        
        document.getElementById('statTotalPlaced').textContent = joined;
        document.getElementById('statCompanies').textContent = companies;
        document.getElementById('statAvgPackage').textContent = '₹' + avgPkg.toFixed(1);
        document.getElementById('statMaxPackage').textContent = '₹' + maxPkg.toFixed(1);
        
        // Calculate percentage change (mock data)
        const changePercent = Math.round((joined / state.allRecords.length) * 100);
        document.getElementById('statPlacedChange').textContent = '+' + changePercent + '%';
    } catch (error) {
        console.error('Statistics update error:', error);
    }
}

// Apply filters
function applyFilters() {
    try {
        const search = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
        const status = document.getElementById('filterStatus')?.value || '';
        const dept = document.getElementById('filterDepartment')?.value || '';
        const batch = document.getElementById('filterBatch')?.value || '';
        const company = document.getElementById('filterCompany')?.value || '';
        
        state.filteredRecords = state.allRecords.filter(record => {
            // Search filter
            const searchMatch = !search || 
                record.studentName.toLowerCase().includes(search) ||
                record.studentId.toLowerCase().includes(search) ||
                record.company.toLowerCase().includes(search) ||
                record.designation.toLowerCase().includes(search) ||
                (record.email && record.email.toLowerCase().includes(search));
            
            // Status filter
            const statusMatch = !status || record.status === status;
            
            // Department filter
            const deptMatch = !dept || record.department === dept;
            
            // Batch filter
            const batchMatch = !batch || record.batch === batch;
            
            // Company filter
            const companyMatch = !company || record.company === company;
            
            return searchMatch && statusMatch && deptMatch && batchMatch && companyMatch;
        });
        
        state.currentPage = 1;
        renderTable();
    } catch (error) {
        console.error('Filter error:', error);
        showError('Error applying filters');
    }
}

// Clear filters
function clearFilters() {
    try {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('filterBatch').value = '';
        document.getElementById('filterCompany').value = '';
        
        state.filteredRecords = [...state.allRecords];
        state.currentPage = 1;
        renderTable();
    } catch (error) {
        console.error('Clear filters error:', error);
    }
}

// Render table
function renderTable() {
    try {
        const tableBody = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const tableCard = document.querySelector('#placementTable').closest('.card');
        const recordCount = document.getElementById('recordCount');
        
        // Hide all states first
        if (emptyState) emptyState.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
        
        // Check if empty
        if (state.filteredRecords.length === 0) {
            if (tableBody) tableBody.innerHTML = '';
            if (tableCard) tableCard.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        // Show table card
        if (tableCard) tableCard.style.display = 'block';
        
        // Pagination
        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        const paginatedData = state.filteredRecords.slice(start, end);
        
        // Render table rows with Bootstrap styling
        if (tableBody) {
            tableBody.innerHTML = paginatedData.map(record => `
                <tr data-record-id="${record.id}">
                    <td>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input row-checkbox" value="${record.id}">
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="student-avatar">${getInitials(record.studentName)}</div>
                            <div class="ms-2">
                                <div class="student-name">${escapeHtml(record.studentName)}</div>
                                <small class="text-muted">${escapeHtml(record.studentId)}</small>
                            </div>
                        </div>
                    </td>
                    <td>${escapeHtml(record.department)}</td>
                    <td>${escapeHtml(record.batch)}</td>
                    <td><strong>${escapeHtml(record.company)}</strong></td>
                    <td>${escapeHtml(record.designation)}</td>
                    <td><span class="package-display">₹${record.package.toFixed(1)}</span></td>
                    <td><span class="badge status-${record.status}">${capitalizeFirst(record.status)}</span></td>
                    <td>
                        <small>
                            <span class="date-label">Offer:</span> ${formatDate(record.offerDate)}<br>
                            <span class="date-label">Join:</span> ${formatDate(record.joiningDate)}
                        </small>
                    </td>
                    <td class="sticky-column">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary view" data-record-id="${record.id}" title="View Details">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success edit" data-record-id="${record.id}" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete" data-record-id="${record.id}" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
        
        // Restore checkbox states and row highlighting from state
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            const recordId = parseInt(checkbox.value);
            if (state.selectedIds.has(recordId)) {
                checkbox.checked = true;
                const row = checkbox.closest('tr');
                if (row) {
                    row.classList.add('row-selected');
                }
            }
        });
        
        // Render pagination
        renderPagination();
        
        // Edge Case: Update select-all state after render
        updateSelectAllState();
        
        // Edge Case: Update bulk delete button visibility after render
        updateBulkDeleteButton();
    } catch (error) {
        console.error('Render table error:', error);
        showError('Error rendering table');
    }
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(state.filteredRecords.length / state.itemsPerPage);
    const paginationNav = document.getElementById('paginationNav');
    const paginationText = document.getElementById('paginationText');
    
    if (!paginationNav) return;
    
    const start = (state.currentPage - 1) * state.itemsPerPage + 1;
    const end = Math.min(start + state.itemsPerPage - 1, state.filteredRecords.length);
    
    if (paginationText) {
        paginationText.textContent = `Showing ${start} to ${end} of ${state.filteredRecords.length} entries`;
    }
    
    let html = '';
    
    // Previous button
    html += `<li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goToPage(${state.currentPage - 1}); return false;">
            <i class="bi bi-chevron-left"></i>
        </a>
    </li>`;
    
    // Page numbers with ellipsis
    const maxButtons = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // First page
    if (startPage > 1) {
        html += `<li class="page-item">
            <a class="page-link" href="#" onclick="goToPage(1); return false;">1</a>
        </li>`;
        if (startPage > 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === state.currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
        </li>`;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        html += `<li class="page-item">
            <a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;">${totalPages}</a>
        </li>`;
    }
    
    // Next button
    html += `<li class="page-item ${state.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goToPage(${state.currentPage + 1}); return false;">
            <i class="bi bi-chevron-right"></i>
        </a>
    </li>`;
    
    paginationNav.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(state.filteredRecords.length / state.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        state.currentPage = page;
        renderTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Modal operations
function openAddModal() {
    state.editingId = null;
    const modalLabel = document.getElementById('recordModalLabel');
    const form = document.getElementById('recordForm');
    
    if (modalLabel) modalLabel.textContent = 'Add Placement Record';
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
        
        // Set default values
        document.getElementById('jobType').value = 'Full-Time';
        
        // Clear any previous validation states
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }
    
    const modal = new bootstrap.Modal(document.getElementById('recordModal'));
    modal.show();
    
    // Focus on first input field
    setTimeout(() => {
        document.getElementById('studentName')?.focus();
    }, 300);
}

function editRecord(id) {
    const record = state.allRecords.find(r => r.id === id);
    if (!record) {
        showError('Record not found');
        return;
    }
    
    state.editingId = id;
    const modalLabel = document.getElementById('recordModalLabel');
    const form = document.getElementById('recordForm');
    
    if (modalLabel) modalLabel.textContent = 'Edit Placement Record';
    
    // Clear validation states
    if (form) {
        form.classList.remove('was-validated');
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }
    
    // Populate form with existing data
    document.getElementById('studentName').value = record.studentName || '';
    document.getElementById('studentId').value = record.studentId || '';
    document.getElementById('email').value = record.email || '';
    document.getElementById('phone').value = record.phone || '';
    document.getElementById('department').value = record.department || '';
    document.getElementById('batch').value = record.batch || '';
    document.getElementById('company').value = record.company || '';
    document.getElementById('designation').value = record.designation || '';
    document.getElementById('package').value = record.package || '';
    document.getElementById('jobType').value = record.jobType || 'Full-Time';
    document.getElementById('status').value = record.status || '';
    document.getElementById('location').value = record.location || '';
    document.getElementById('offerDate').value = record.offerDate || '';
    document.getElementById('joiningDate').value = record.joiningDate || '';
    document.getElementById('remarks').value = record.remarks || '';
    
    const modal = new bootstrap.Modal(document.getElementById('recordModal'));
    modal.show();
    
    // Focus on student name field
    setTimeout(() => {
        document.getElementById('studentName')?.focus();
    }, 300);
}

function viewRecord(id) {
    const record = state.allRecords.find(r => r.id === id);
    if (!record) {
        showError('Record not found');
        return;
    }
    
    const viewContent = document.getElementById('viewContent');
    if (viewContent) {
        viewContent.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6"><strong>Student Name:</strong><br>${escapeHtml(record.studentName)}</div>
                <div class="col-md-6"><strong>Student ID:</strong><br>${escapeHtml(record.studentId)}</div>
                <div class="col-md-6"><strong>Email:</strong><br>${escapeHtml(record.email || 'N/A')}</div>
                <div class="col-md-6"><strong>Phone:</strong><br>${escapeHtml(record.phone || 'N/A')}</div>
                <div class="col-md-6"><strong>Department:</strong><br>${escapeHtml(record.department)}</div>
                <div class="col-md-6"><strong>Batch:</strong><br>${escapeHtml(record.batch)}</div>
                <div class="col-md-6"><strong>Company:</strong><br>${escapeHtml(record.company)}</div>
                <div class="col-md-6"><strong>Designation:</strong><br>${escapeHtml(record.designation)}</div>
                <div class="col-md-6"><strong>Package:</strong><br><span class="package-display">₹${record.package.toFixed(1)} LPA</span></div>
                <div class="col-md-6"><strong>Job Type:</strong><br>${escapeHtml(record.jobType)}</div>
                <div class="col-md-6"><strong>Status:</strong><br><span class="status-badge status-${record.status}">${capitalizeFirst(record.status)}</span></div>
                <div class="col-md-6"><strong>Location:</strong><br>${escapeHtml(record.location || 'N/A')}</div>
                <div class="col-md-6"><strong>Offer Date:</strong><br>${formatDate(record.offerDate)}</div>
                <div class="col-md-6"><strong>Joining Date:</strong><br>${formatDate(record.joiningDate)}</div>
                ${record.remarks ? `<div class="col-12"><strong>Remarks:</strong><br>${escapeHtml(record.remarks)}</div>` : ''}
            </div>
        `;
    }
    
    state.editingId = id;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
}

function deleteRecord(id) {
    state.deletingId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    if (state.deletingId) {
        state.allRecords = state.allRecords.filter(r => r.id !== state.deletingId);
        state.filteredRecords = state.filteredRecords.filter(r => r.id !== state.deletingId);
        
        // Remove from selected IDs if it was selected
        state.selectedIds.delete(state.deletingId);
        
        updateStatistics();
        renderTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) modal.hide();
        
        showSuccess('Record deleted successfully');
        state.deletingId = null;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showWarning('Please fill in all required fields correctly');
        return;
    }
    
    try {
        const formData = {
            studentName: document.getElementById('studentName').value.trim(),
            studentId: document.getElementById('studentId').value.trim().toUpperCase(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            department: document.getElementById('department').value,
            batch: document.getElementById('batch').value.trim(),
            company: document.getElementById('company').value.trim(),
            designation: document.getElementById('designation').value.trim(),
            package: parseFloat(document.getElementById('package').value),
            jobType: document.getElementById('jobType').value,
            status: document.getElementById('status').value,
            location: document.getElementById('location').value.trim(),
            offerDate: document.getElementById('offerDate').value,
            joiningDate: document.getElementById('joiningDate').value,
            remarks: document.getElementById('remarks').value.trim()
        };
        
        // Additional validation
        if (formData.package < 0 || formData.package > 999) {
            showError('Package must be between 0 and 999 LPA');
            document.getElementById('package').focus();
            return;
        }
        
        // Email validation if provided
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showError('Please enter a valid email address');
                document.getElementById('email').focus();
                return;
            }
        }
        
        // Check for duplicate Student ID (only when adding new record)
        if (!state.editingId) {
            const duplicateStudent = state.allRecords.find(r => r.studentId === formData.studentId);
            if (duplicateStudent) {
                showWarning(`Student ID "${formData.studentId}" already exists for ${duplicateStudent.studentName}`);
                document.getElementById('studentId').focus();
                return;
            }
        } else {
            // When editing, check if Student ID is used by another record
            const duplicateStudent = state.allRecords.find(r => 
                r.studentId === formData.studentId && r.id !== state.editingId
            );
            if (duplicateStudent) {
                showWarning(`Student ID "${formData.studentId}" is already used by ${duplicateStudent.studentName}`);
                document.getElementById('studentId').focus();
                return;
            }
        }
        
        // Date validation
        if (formData.offerDate && formData.joiningDate) {
            const offerDate = new Date(formData.offerDate);
            const joiningDate = new Date(formData.joiningDate);
            if (joiningDate < offerDate) {
                showWarning('Joining date cannot be before offer date');
                document.getElementById('joiningDate').focus();
                return;
            }
        }
        
        if (state.editingId) {
            // Update existing record
            const index = state.allRecords.findIndex(r => r.id === state.editingId);
            if (index !== -1) {
                // Show loading toast
                const loadingToast = toast.loading('Updating record...');
                
                setTimeout(() => {
                    state.allRecords[index] = { ...state.allRecords[index], ...formData };
                    
                    // Dismiss loading toast
                    if (typeof loadingToast === 'function') loadingToast();
                    
                    toast.success(`Record updated successfully for ${formData.studentName}`);
                }, 500);
            }
        } else {
            // Add new record
            const newId = Math.max(...state.allRecords.map(r => r.id), 0) + 1;
            
            // Show loading toast
            const loadingToast = toast.loading('Adding new record...');
            
            setTimeout(() => {
                state.allRecords.push({ id: newId, ...formData });
                
                // Dismiss loading toast
                if (typeof loadingToast === 'function') loadingToast();
                
                toast.success(`New placement record added for ${formData.studentName}`);
            }, 500);
        }
        
        state.filteredRecords = [...state.allRecords];
        applyFilters();
        updateStatistics();
        populateCompanyFilter(); // Update company filter with any new companies
        renderTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('recordModal'));
        if (modal) modal.hide();
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        state.editingId = null;
    } catch (error) {
        console.error('Form submit error:', error);
        showError('Error saving record. Please try again.');
    }
}

function handleEditFromView() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
    if (modal) modal.hide();
    
    if (state.editingId) {
        editRecord(state.editingId);
    }
}

// Bulk Delete Functions
// Update Select All State
function updateSelectAllState() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    
    const visibleRows = Array.from(document.querySelectorAll('#tableBody tr'))
        .filter(row => row.style.display !== 'none');
    
    const visibleCheckboxes = visibleRows.map(row => row.querySelector('.row-checkbox')).filter(cb => cb);
    const checkedCheckboxes = visibleCheckboxes.filter(cb => cb.checked);

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

function updateBulkDeleteButton() {
    // Edge Case: Get only valid, visible checkboxes
    const allCheckboxes = document.querySelectorAll('.row-checkbox');
    const visibleCheckboxes = Array.from(allCheckboxes).filter(cb => {
        const row = cb.closest('tr');
        return row && row.style.display !== 'none' && row.offsetParent !== null;
    });
    
    const selectedCheckboxes = visibleCheckboxes.filter(cb => cb.checked);
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const selectedCountSpan = document.getElementById('selectedCount');
    
    if (!bulkDeleteBtn || !selectedCountSpan) return;
    
    const selectedCount = selectedCheckboxes.length;
    
    if (selectedCount > 0) {
        bulkDeleteBtn.style.display = 'inline-block';
        selectedCountSpan.textContent = selectedCount;
    } else {
        bulkDeleteBtn.style.display = 'none';
    }
}

function handleBulkDelete() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    
    // Edge Case 1: No records selected
    if (selectedCheckboxes.length === 0) {
        showWarning('Please select at least one record to delete');
        return;
    }
    
    // Edge Case 2: Validate all checkboxes have valid IDs
    const validCheckboxes = Array.from(selectedCheckboxes).filter(cb => cb.value && !isNaN(parseInt(cb.value)));
    if (validCheckboxes.length === 0) {
        showError('Invalid records selected. Please try again.');
        return;
    }
    
    // Edge Case 3: Check if filters are active - warn user they're only seeing filtered results
    const hasActiveFilters = 
        document.getElementById('searchInput')?.value.trim() ||
        document.getElementById('filterStatus')?.value ||
        document.getElementById('filterDepartment')?.value ||
        document.getElementById('filterBatch')?.value ||
        document.getElementById('filterCompany')?.value;
    
    if (hasActiveFilters && state.filteredRecords.length < state.allRecords.length) {
        const hiddenRecords = state.allRecords.length - state.filteredRecords.length;
        showConfirmationModal({
            title: '⚠️ Active Filters Detected',
            message: `
                <div class="alert alert-warning mb-0">
                    <p class="mb-2"><strong>You are viewing filtered results!</strong></p>
                    <ul class="mb-2">
                        <li>Viewing: <strong>${state.filteredRecords.length}</strong> filtered records</li>
                        <li>Total: <strong>${state.allRecords.length}</strong> records</li>
                        <li>Hidden by filters: <strong>${hiddenRecords}</strong> records</li>
                        <li>Selected for deletion: <strong>${validCheckboxes.length}</strong> record(s)</li>
                    </ul>
                    <p class="mb-0">Do you want to proceed with deleting only the selected visible records?</p>
                </div>
            `,
            confirmText: 'Yes, Delete Selected',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-triangle-fill text-warning',
            onConfirm: () => proceedWithBulkDelete(validCheckboxes)
        });
        return;
    }
    
    // Edge Case 4: Confirm if deleting all visible records
    const visibleRecordsCount = state.filteredRecords.length;
    if (validCheckboxes.length === visibleRecordsCount) {
        showConfirmationModal({
            title: 'Delete All Visible Records',
            message: `
                <div class="alert alert-danger mb-0">
                    <p class="mb-2"><i class="bi bi-exclamation-octagon-fill"></i> <strong>Warning!</strong></p>
                    <p>You are about to delete <strong>ALL ${visibleRecordsCount}</strong> currently visible records.</p>
                    <p class="mb-0 text-danger"><strong>This cannot be undone!</strong></p>
                </div>
            `,
            confirmText: 'Yes, Delete All Visible',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-triangle-fill text-danger',
            onConfirm: () => proceedWithBulkDelete(validCheckboxes)
        });
        return;
    }
    
    // Edge Case 5: Confirm if deleting all records in database
    if (validCheckboxes.length === state.allRecords.length) {
        showConfirmationModal({
            title: '🚨 CRITICAL: Delete ALL Records',
            message: `
                <div class="alert alert-danger mb-0">
                    <p class="mb-2"><i class="bi bi-exclamation-octagon-fill"></i> <strong>CRITICAL WARNING!</strong></p>
                    <p>You are about to delete <strong>ALL ${state.allRecords.length}</strong> placement records from the database.</p>
                    <p class="text-danger mb-2"><strong>This will permanently remove all placement data!</strong></p>
                    <p class="mb-0"><strong>This action CANNOT be undone. Are you absolutely sure?</strong></p>
                </div>
            `,
            confirmText: 'Yes, Delete Everything',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-octagon-fill text-danger',
            onConfirm: () => proceedWithBulkDelete(validCheckboxes)
        });
        return;
    }
    
    // Normal bulk delete - proceed to show modal
    proceedWithBulkDelete(validCheckboxes);
}

// Helper function to proceed with bulk delete after confirmation
function proceedWithBulkDelete(validCheckboxes) {
    const bulkDeleteCount = document.getElementById('bulkDeleteCount');
    if (bulkDeleteCount) {
        bulkDeleteCount.textContent = validCheckboxes.length;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('bulkDeleteModal'));
    modal.show();
}

function confirmBulkDelete() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes)
        .map(cb => parseInt(cb.value))
        .filter(id => !isNaN(id)); // Edge Case 4: Filter out invalid IDs
    
    // Edge Case 5: Double-check before deletion
    if (selectedIds.length === 0) {
        showWarning('No valid records to delete');
        const modal = bootstrap.Modal.getInstance(document.getElementById('bulkDeleteModal'));
        if (modal) modal.hide();
        return;
    }
    
    // Store count before deletion for success message
    const deleteCount = selectedIds.length;
    const totalBefore = state.allRecords.length;
    
    // Remove records from state
    state.allRecords = state.allRecords.filter(r => !selectedIds.includes(r.id));
    state.filteredRecords = state.filteredRecords.filter(r => !selectedIds.includes(r.id));
    
    // Edge Case 6: Verify deletion was successful
    const actualDeleted = totalBefore - state.allRecords.length;
    if (actualDeleted !== deleteCount) {
        console.warn(`Expected to delete ${deleteCount} but actually deleted ${actualDeleted}`);
    }
    
    // Edge Case 7: Reset pagination if current page is now invalid
    const maxPage = Math.ceil(state.filteredRecords.length / state.itemsPerPage);
    if (state.currentPage > maxPage && maxPage > 0) {
        state.currentPage = maxPage;
    } else if (state.filteredRecords.length === 0) {
        state.currentPage = 1;
    }
    
    // Update statistics and UI
    updateStatistics();
    populateCompanyFilter(); // Edge Case 8: Update company filter if companies removed
    renderTable();
    
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bulkDeleteModal'));
    if (modal) modal.hide();
    
    // Edge Case 9: Clear all selection states
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
    
    // Clear selectedIds from state
    selectedIds.forEach(id => state.selectedIds.delete(id));
    
    // Clear any lingering checkboxes (shouldn't exist but safety check)
    document.querySelectorAll('.row-checkbox:checked').forEach(cb => cb.checked = false);
    
    // Remove row-selected class from any rows
    document.querySelectorAll('tr.row-selected').forEach(row => {
        row.classList.remove('row-selected');
        row.style.backgroundColor = '';
        row.style.borderLeft = '';
    });
    
    // Hide bulk delete button
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.style.display = 'none';
    }
    
    // Edge Case 10: Show appropriate message based on result
    if (state.allRecords.length === 0) {
        showSuccess(`All ${actualDeleted} placement records deleted successfully`);
    } else {
        showSuccess(`${actualDeleted} record(s) deleted successfully. ${state.allRecords.length} remaining.`);
    }
}

// Utility functions
function toggleSelectAll() {
    const isChecked = document.getElementById('selectAll').checked;
    const visibleRows = Array.from(document.querySelectorAll('#tableBody tr'))
        .filter(row => row.style.display !== 'none');
    
    visibleRows.forEach(row => {
        const checkbox = row.querySelector('.row-checkbox');
        if (checkbox) {
            const recordId = parseInt(checkbox.value);
            checkbox.checked = isChecked;
            
            if (isChecked) {
                row.classList.add('row-selected');
                state.selectedIds.add(recordId); // Save to state
            } else {
                row.classList.remove('row-selected');
                row.style.backgroundColor = '';
                row.style.borderLeft = '';
                state.selectedIds.delete(recordId); // Remove from state
            }
        }
    });

    updateBulkDeleteButton();
}

function changeEntriesPerPage() {
    state.itemsPerPage = parseInt(document.getElementById('entriesPerPage').value);
    state.currentPage = 1;
    renderTable();
}

function exportToCSV() {
    try {
        const headers = ['Student Name', 'Student ID', 'Email', 'Phone', 'Department', 'Batch', 'Company', 'Designation', 'Package (LPA)', 'Job Type', 'Status', 'Location', 'Offer Date', 'Joining Date', 'Remarks'];
        const rows = state.filteredRecords.map(r => [
            r.studentName, r.studentId, r.email, r.phone, r.department, r.batch,
            r.company, r.designation, r.package, r.jobType, r.status, r.location,
            r.offerDate, r.joiningDate, r.remarks
        ]);
        
        // Show loading toast
        const loadingToast = toast.loading('Preparing CSV export...');
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `placement_records_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        // Dismiss loading toast
        if (typeof loadingToast === 'function') loadingToast();
        
        toast.success(`${state.filteredRecords.length} records exported successfully`);
    } catch (error) {
        console.error('Export error:', error);
        toast.error('Error exporting data');
    }
}

function refreshData() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    
    if (loadingState) loadingState.style.display = 'block';
    if (errorState) errorState.style.display = 'none';
    
    // Show loading toast
    const loadingToast = toast.loading('Refreshing placement data...');
    
    setTimeout(() => {
        if (loadingState) loadingState.style.display = 'none';
        renderTable();
        
        // Dismiss loading toast
        if (typeof loadingToast === 'function') loadingToast();
        
        toast.success('Data refreshed successfully');
    }, 1000);
}

function showError(message) {
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) errorMessage.textContent = message;
    if (errorState) {
        errorState.style.display = 'block';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('loadingState').style.display = 'none';
    }
}

function showSuccess(message) {
    console.log('Success:', message);
    toast.success(message);
}

function showWarning(message) {
    console.warn('Warning:', message);
    toast(message, { icon: '⚠️' });
}

function showError(message) {
    console.error('Error:', message);
    toast.error(message);
}

function showInfo(message) {
    console.info('Info:', message);
    toast(message, { icon: 'ℹ️' });
}

// Helper functions
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
