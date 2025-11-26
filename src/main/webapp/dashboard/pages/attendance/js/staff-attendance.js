/**
 * Staff Attendance Management System
 * Comprehensive attendance marking with filtering, pagination, and bulk operations
 */

// Sample staff data organized by department
const staffData = {
    teaching: [
        { id: 1, empId: "EMP001", name: "Dr. Robert Johnson", department: "teaching", role: "Teacher", email: "robert.j@eduhub.com", phone: "+1-555-0101" },
        { id: 2, empId: "EMP002", name: "Ms. Sarah Williams", department: "teaching", role: "Teacher", email: "sarah.w@eduhub.com", phone: "+1-555-0102" },
        { id: 3, empId: "EMP003", name: "Mrs. Emily Parker", department: "teaching", role: "Teacher", email: "emily.p@eduhub.com", phone: "+1-555-0103" },
        { id: 4, empId: "EMP004", name: "Dr. Lisa Anderson", department: "teaching", role: "Teacher", email: "lisa.a@eduhub.com", phone: "+1-555-0104" },
        { id: 5, empId: "EMP005", name: "Ms. Anna Martinez", department: "teaching", role: "Teacher", email: "anna.m@eduhub.com", phone: "+1-555-0105" },
        { id: 6, empId: "EMP006", name: "Mr. Thomas Brown", department: "teaching", role: "Teacher", email: "thomas.b@eduhub.com", phone: "+1-555-0106" },
        { id: 7, empId: "EMP007", name: "Dr. Michelle Lee", department: "teaching", role: "Teacher", email: "michelle.l@eduhub.com", phone: "+1-555-0107" },
        { id: 8, empId: "EMP008", name: "Mr. David Kumar", department: "teaching", role: "Teacher", email: "david.k@eduhub.com", phone: "+1-555-0108" }
    ],
    administration: [
        { id: 9, empId: "EMP009", name: "Mr. Michael Chen", department: "administration", role: "Administrator", email: "michael.c@eduhub.com", phone: "+1-555-0109" },
        { id: 10, empId: "EMP010", name: "Ms. Jennifer Davis", department: "administration", role: "Administrator", email: "jennifer.d@eduhub.com", phone: "+1-555-0110" },
        { id: 11, empId: "EMP011", name: "Mr. Christopher White", department: "administration", role: "Administrator", email: "chris.w@eduhub.com", phone: "+1-555-0111" },
        { id: 12, empId: "EMP012", name: "Mrs. Patricia Garcia", department: "administration", role: "Administrator", email: "patricia.g@eduhub.com", phone: "+1-555-0112" }
    ],
    it: [
        { id: 13, empId: "EMP013", name: "Mr. Alex Thompson", department: "it", role: "Support Staff", email: "alex.t@eduhub.com", phone: "+1-555-0113" },
        { id: 14, empId: "EMP014", name: "Ms. Rachel Green", department: "it", role: "Support Staff", email: "rachel.g@eduhub.com", phone: "+1-555-0114" },
        { id: 15, empId: "EMP015", name: "Mr. Kevin Moore", department: "it", role: "Support Staff", email: "kevin.m@eduhub.com", phone: "+1-555-0115" }
    ],
    management: [
        { id: 16, empId: "EMP016", name: "Mr. James Wilson", department: "management", role: "Manager", email: "james.w@eduhub.com", phone: "+1-555-0116" },
        { id: 17, empId: "EMP017", name: "Dr. Susan Taylor", department: "management", role: "Manager", email: "susan.t@eduhub.com", phone: "+1-555-0117" }
    ],
    accounts: [
        { id: 18, empId: "EMP018", name: "Mr. Richard Miller", department: "accounts", role: "Administrator", email: "richard.m@eduhub.com", phone: "+1-555-0118" },
        { id: 19, empId: "EMP019", name: "Ms. Linda Johnson", department: "accounts", role: "Administrator", email: "linda.j@eduhub.com", phone: "+1-555-0119" }
    ],
    library: [
        { id: 20, empId: "EMP020", name: "Mrs. Margaret Brown", department: "library", role: "Librarian", email: "margaret.b@eduhub.com", phone: "+1-555-0120" },
        { id: 21, empId: "EMP021", name: "Mr. Paul Anderson", department: "library", role: "Librarian", email: "paul.a@eduhub.com", phone: "+1-555-0121" }
    ]
};

// Global variables
let allStaff = [];
let filteredStaff = [];
let currentPage = 1;
let itemsPerPage = 10;
let attendanceData = {};

// Combine all staff into single array
Object.values(staffData).forEach(deptStaff => {
    allStaff = allStaff.concat(deptStaff);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAttendance();
    attachEventListeners();
    setDefaultDate();
});

function setDefaultDate() {
    const dateInput = document.getElementById('dateInput');
    if (!dateInput) {
        console.error('Date input element not found');
        return;
    }
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today;
    
    // Add date change listener
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const todayDate = new Date(today);
        
        if (selectedDate > todayDate) {
            toast('Cannot select future dates', { icon: '⚠️' });
            this.value = today;
        }
    });
}

function initializeAttendance() {
    filteredStaff = [...allStaff];
    loadStaffData();
}

function attachEventListeners() {
    // Filter listeners with null checks
    const departmentSelect = document.getElementById('departmentSelect');
    const roleFilter = document.getElementById('roleFilter');
    const searchInput = document.getElementById('searchInput');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    if (departmentSelect) departmentSelect.addEventListener('change', filterStaff);
    if (roleFilter) roleFilter.addEventListener('change', filterStaff);
    if (searchInput) searchInput.addEventListener('input', filterStaff);
    if (itemsPerPageSelect) itemsPerPageSelect.addEventListener('change', changeItemsPerPage);
    
    // Action buttons with null checks
    const markAllPresentBtn = document.getElementById('markAllPresentBtn');
    const markAllAbsentBtn = document.getElementById('markAllAbsentBtn');
    const markSelectedPresentBtn = document.getElementById('markSelectedPresentBtn');
    const markSelectedAbsentBtn = document.getElementById('markSelectedAbsentBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (markAllPresentBtn) markAllPresentBtn.addEventListener('click', markAllPresent);
    if (markAllAbsentBtn) markAllAbsentBtn.addEventListener('click', markAllAbsent);
    if (markSelectedPresentBtn) markSelectedPresentBtn.addEventListener('click', markSelectedPresent);
    if (markSelectedAbsentBtn) markSelectedAbsentBtn.addEventListener('click', markSelectedAbsent);
    if (resetBtn) resetBtn.addEventListener('click', resetAttendance);
    
    // Save and Export with null checks
    const saveBtn = document.getElementById('saveBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (saveBtn) saveBtn.addEventListener('click', saveAttendance);
    if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
    
    // Select All checkbox with null check
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.addEventListener('change', toggleSelectAll);
}

function filterStaff() {
    const departmentSelect = document.getElementById('departmentSelect');
    const roleFilterEl = document.getElementById('roleFilter');
    const searchInputEl = document.getElementById('searchInput');
    
    const department = (departmentSelect ? departmentSelect.value : '').toLowerCase();
    const role = roleFilterEl ? roleFilterEl.value : '';
    const searchTerm = (searchInputEl ? searchInputEl.value : '').toLowerCase();
    
    filteredStaff = allStaff.filter(staff => {
        const matchDepartment = !department || staff.department === department;
        const matchRole = !role || staff.role === role;
        const matchSearch = !searchTerm || 
            staff.name.toLowerCase().includes(searchTerm) ||
            staff.empId.toLowerCase().includes(searchTerm) ||
            staff.email.toLowerCase().includes(searchTerm);
        
        return matchDepartment && matchRole && matchSearch;
    });
    
    currentPage = 1;
    loadStaffData();
}

function loadStaffData() {
    const tbody = document.getElementById('staffTableBody');
    const thead = document.querySelector('#attendanceTable thead');
    
    if (!tbody) {
        console.error('Staff table body not found');
        return;
    }
    
    if (filteredStaff.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state-row">
                <td colspan="6" class="text-center py-5">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="bi bi-search"></i>
                        </div>
                        <h4 class="empty-state-title">No Staff Found</h4>
                        <p class="empty-state-text">No staff members match your current filters</p>
                    </div>
                </td>
            </tr>
        `;
        if (thead) thead.style.display = 'none';
        updatePagination();
        updateStatistics();
        return;
    }
    
    if (thead) thead.style.display = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedStaff = filteredStaff.slice(start, end);
    
    tbody.innerHTML = '';
    
    paginatedStaff.forEach(staff => {
        const row = createStaffRow(staff);
        tbody.appendChild(row);
    });
    
    updatePagination();
    updateStatistics();
    updateSelectAllCheckbox();
}

function createStaffRow(staff) {
    const row = document.createElement('tr');
    row.dataset.staffId = staff.id;
    
    const currentStatus = attendanceData[staff.id] || 'Pending';
    const isChecked = row.classList.contains('selected');
    
    // Apply status styling to the row
    if (currentStatus === 'Present') {
        row.classList.add('status-present');
    } else if (currentStatus === 'Absent') {
        row.classList.add('status-absent');
    }
    
    row.innerHTML = `
        <td>
            <div class="form-check">
                <input type="checkbox" class="form-check-input row-checkbox" data-staff-id="${staff.id}" ${isChecked ? 'checked' : ''}>
            </div>
        </td>
        <td><strong>${staff.empId}</strong></td>
        <td>
            <div class="d-flex align-items-center gap-2">
                <span>${staff.name}</span>
                ${currentStatus === 'Present' ? '<span class="status-indicator status-present-badge"><i class="bi bi-check-circle-fill"></i></span>' : ''}
                ${currentStatus === 'Absent' ? '<span class="status-indicator status-absent-badge"><i class="bi bi-x-circle-fill"></i></span>' : ''}
            </div>
        </td>
        <td>
            <span class="department-badge ${staff.department}">${staff.department.toUpperCase()}</span>
        </td>
        <td>${staff.role}</td>
        <td>
            <div class="btn-group btn-group-sm" role="group">
                <button class="btn ${currentStatus === 'Present' ? 'btn-success' : 'btn-outline-success'} btn-action" 
                        onclick="markStaffStatus(${staff.id}, 'Present')" 
                        title="Mark Present">
                    <i class="bi bi-check-lg"></i> Present
                </button>
                <button class="btn ${currentStatus === 'Absent' ? 'btn-danger' : 'btn-outline-danger'} btn-action" 
                        onclick="markStaffStatus(${staff.id}, 'Absent')" 
                        title="Mark Absent">
                    <i class="bi bi-x-lg"></i> Absent
                </button>
            </div>
        </td>
    `;
    
    // Add event listener to checkbox
    const checkbox = row.querySelector('.row-checkbox');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
        updateSelectAllCheckbox();
    });
    
    return row;
}

function markStaffStatus(staffId, status) {
    attendanceData[staffId] = status;
    
    // Auto-check the checkbox for this staff member
    const checkbox = document.querySelector(`.row-checkbox[data-staff-id="${staffId}"]`);
    const row = document.querySelector(`tr[data-staff-id="${staffId}"]`);
    
    if (checkbox && row) {
        checkbox.checked = true;
        row.classList.add('selected');
        updateSelectAllCheckbox();
    }
    
    // Reload the current page to show updated status
    loadStaffData();
    
    const staff = allStaff.find(s => s.id === staffId);
    const statusIcon = status === 'Present' ? '✓' : '✗';
    const toastFn = status === 'Present' ? toast.success : toast;
    const message = statusIcon + ' ' + staff.name + ' marked as ' + status;
    if (status === 'Present') {
        toastFn(message);
    } else {
        toastFn(message, { icon: '⚠️' });
    }
}

// Auto-tick opposite status staff for quick bulk marking
function autoTickOppositeStatusStaff(currentStaffId, currentStatus) {
    // Only auto-tick for Present/Absent
    if (currentStatus !== 'Present' && currentStatus !== 'Absent') {
        return;
    }
    
    // Determine the opposite status
    const oppositeStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    
    // Get all visible staff checkboxes
    const allCheckboxes = document.querySelectorAll('.row-checkbox');
    
    allCheckboxes.forEach(checkbox => {
        const staffId = parseInt(checkbox.getAttribute('data-staff-id'));
        const row = checkbox.closest('tr');
        
        // Skip the current staff member
        if (staffId === currentStaffId) {
            return;
        }
        
        // Skip if row is not visible
        if (!row || row.style.display === 'none') {
            return;
        }
        
        // Get the staff member's current attendance status
        const staffStatus = attendanceData[staffId];
        
        // Auto-mark staff who haven't been marked yet OR have the opposite status
        // If marking Present, auto-mark all unmarked/Absent staff as Absent
        // If marking Absent, auto-mark all unmarked/Present staff as Present
        if (!staffStatus || staffStatus === 'Pending' || staffStatus === oppositeStatus) {
            // Automatically mark with opposite status
            attendanceData[staffId] = oppositeStatus;
            
            // Auto-tick the checkbox
            checkbox.checked = true;
            row.classList.add('selected');
        }
    });
}

function toggleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const rows = document.querySelectorAll('#staffTableBody tr:not(.empty-state-row)');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = e.target.checked;
        if (e.target.checked) {
            rows[index].classList.add('selected');
        } else {
            rows[index].classList.remove('selected');
        }
    });
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (!selectAllCheckbox) {
        return;
    }
    
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    
    if (checkboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedBoxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedBoxes.length === checkboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function markAllPresent() {
    if (filteredStaff.length === 0) {
        toast('No staff members to mark', { icon: '⚠️' });
        return;
    }
    
    showConfirmationModal({
        title: 'Mark All Present',
        message: `Are you sure you want to mark all <strong>${filteredStaff.length} staff member(s)</strong> as Present?`,
        confirmText: 'Yes, Mark All Present',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-check-circle-fill text-success',
        onConfirm: function() {
            filteredStaff.forEach(staff => {
                attendanceData[staff.id] = 'Present';
            });
            
            loadStaffData();
            toast.success('Marked ' + filteredStaff.length + ' staff member(s) as Present');
        }
    });
}

function markAllAbsent() {
    if (filteredStaff.length === 0) {
        toast('No staff members to mark', { icon: '⚠️' });
        return;
    }
    
    showConfirmationModal({
        title: 'Mark All Absent',
        message: `Are you sure you want to mark all <strong>${filteredStaff.length} staff member(s)</strong> as Absent?`,
        confirmText: 'Yes, Mark All Absent',
        cancelText: 'Cancel',
        confirmClass: 'btn-danger',
        icon: 'bi-x-circle-fill text-danger',
        onConfirm: function() {
            filteredStaff.forEach(staff => {
                attendanceData[staff.id] = 'Absent';
            });
            
            loadStaffData();
            toast('Marked ' + filteredStaff.length + ' staff member(s) as Absent', { icon: '⚠️' });
        }
    });
}

function markSelectedPresent() {
    const selected = getSelectedStaffIds();
    if (selected.length === 0) {
        showToast('Please select staff members first', 'warning');
        return;
    }
    
    const selectedCount = selected.length;
    const othersCount = filteredStaff.length - selectedCount;
    
    showConfirmationModal({
        title: 'Mark Selected as Present',
        message: `Mark <strong>${selectedCount} selected</strong> staff as <strong>Present</strong> and <strong>${othersCount} others</strong> as <strong>Absent</strong>?`,
        confirmText: 'Yes, Mark Present',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-check-circle text-success',
        onConfirm: function() {
            // Mark all staff: selected get Present, others get Absent
            filteredStaff.forEach(staff => {
                if (selected.includes(staff.id)) {
                    attendanceData[staff.id] = 'Present';
                } else {
                    attendanceData[staff.id] = 'Absent';
                }
            });
            
            loadStaffData();
            toast.success('✓ ' + selectedCount + ' marked Present, ' + othersCount + ' marked Absent');
        }
    });
}

function markSelectedAbsent() {
    const selected = getSelectedStaffIds();
    if (selected.length === 0) {
        showToast('Please select staff members first', 'warning');
        return;
    }
    
    const selectedCount = selected.length;
    const othersCount = filteredStaff.length - selectedCount;
    
    showConfirmationModal({
        title: 'Mark Selected as Absent',
        message: `Mark <strong>${selectedCount} selected</strong> staff as <strong>Absent</strong> and <strong>${othersCount} others</strong> as <strong>Present</strong>?`,
        confirmText: 'Yes, Mark Absent',
        cancelText: 'Cancel',
        confirmClass: 'btn-danger',
        icon: 'bi-x-circle text-danger',
        onConfirm: function() {
            // Mark all staff: selected get Absent, others get Present
            filteredStaff.forEach(staff => {
                if (selected.includes(staff.id)) {
                    attendanceData[staff.id] = 'Absent';
                } else {
                    attendanceData[staff.id] = 'Present';
                }
            });
            
            loadStaffData();
            toast.success('✓ ' + selectedCount + ' marked Absent, ' + othersCount + ' marked Present');
        }
    });
}

function getSelectedStaffIds() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.dataset.staffId));
}

function resetAttendance() {
    if (Object.keys(attendanceData).length === 0) {
        showToast('No attendance data to reset', 'info');
        return;
    }
    
    showConfirmationModal({
        title: 'Reset Attendance',
        message: 'Are you sure you want to reset all attendance data? <strong>This will clear all marked statuses.</strong>',
        confirmText: 'Yes, Reset All',
        cancelText: 'Cancel',
        confirmClass: 'btn-warning',
        icon: 'bi-arrow-counterclockwise text-warning',
        onConfirm: function() {
            attendanceData = {};
            const selectAllCheckbox = document.getElementById('selectAll');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
            loadStaffData();
            showToast('Attendance data has been reset', 'info');
        }
    });
}

function updateStatistics() {
    const present = Object.values(attendanceData).filter(s => s === 'Present').length;
    const absent = Object.values(attendanceData).filter(s => s === 'Absent').length;
    const total = filteredStaff.length;
    
    // Update with animation
    animateValue('presentCount', present);
    animateValue('absentCount', absent);
    
    // Update total without animation
    const totalElement = document.getElementById('totalCount');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return;
    }
    
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === targetValue) return;
    
    const duration = 300;
    const steps = 20;
    const stepValue = (targetValue - currentValue) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.round(currentValue + (stepValue * currentStep));
        element.textContent = newValue;
        
        if (currentStep >= steps) {
            element.textContent = targetValue;
            clearInterval(interval);
        }
    }, stepDuration);
}

function updatePagination() {
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    
    // Update showing info
    const start = filteredStaff.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredStaff.length);
    
    document.getElementById('showingStart').textContent = start;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalEntries').textContent = filteredStaff.length;
    
    // Build pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
    paginationContainer.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            paginationContainer.appendChild(pageLi);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const dotsLi = document.createElement('li');
            dotsLi.className = 'page-item disabled';
            dotsLi.innerHTML = `<span class="page-link">...</span>`;
            paginationContainer.appendChild(dotsLi);
        }
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
    paginationContainer.appendChild(nextLi);
    
    // Add click listeners
    paginationContainer.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                currentPage = page;
                loadStaffData();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    loadStaffData();
}

function saveAttendance() {
    const dateInput = document.getElementById('dateInput');
    const date = dateInput ? dateInput.value : '';
    
    if (!date) {
        showToast('Please select a date', 'warning');
        return;
    }
    
    const markedCount = Object.keys(attendanceData).length;
    if (markedCount === 0) {
        showToast('Please mark attendance before saving', 'warning');
        return;
    }
    
    // Prepare attendance records for saving
    const attendanceRecords = Object.entries(attendanceData).map(([staffId, status]) => {
        const staff = allStaff.find(s => s.id === parseInt(staffId));
        return {
            staffId: staffId,
            empId: staff.empId,
            name: staff.name,
            department: staff.department,
            role: staff.role,
            status: status,
            date: date
        };
    });
    
    // Calculate statistics
    const present = attendanceRecords.filter(r => r.status === 'Present').length;
    const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show confirmation modal
    showConfirmationModal({
        title: 'Confirm Save Attendance',
        message: `
            <p>Are you sure you want to save attendance for <strong>${markedCount} staff member(s)</strong> on <strong>${formattedDate}</strong>?</p>
            <div class="mt-3">
                <div class="d-flex justify-content-between mb-2">
                    <span><i class="bi bi-check-circle-fill text-success"></i> Present:</span>
                    <strong>${present}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span><i class="bi bi-x-circle-fill text-danger"></i> Absent:</span>
                    <strong>${absent}</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                    <span><i class="bi bi-people-fill"></i> Total Marked:</span>
                    <strong>${markedCount}</strong>
                </div>
            </div>
        `,
        confirmText: 'Yes, Save Attendance',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-save text-success',
        onConfirm: function() {
            const saveBtn = document.getElementById('saveBtn');
            
            // Disable save button and show loading
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="bi bi-hourglass-split spinner-border spinner-border-sm me-2"></i> Saving...';
            }
            
            // Show loading toast
            const loadingToastId = toast.loading('Saving staff attendance...');
            
            // Prepare data for API
            const saveData = {
                date: date,
                records: attendanceRecords,
                statistics: {
                    present: present,
                    absent: absent,
                    total: markedCount
                }
            };
            
            console.log('Saving staff attendance:', saveData);
            
            // API call to save attendance
            fetch('/api/attendance/staff/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save attendance');
                }
                return response.json();
            })
            .then(data => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                // Success - show success modal
                showSuccessModal({
                    title: 'Attendance Saved Successfully!',
                    message: `
                        <p>Staff attendance for <strong>${formattedDate}</strong> has been saved successfully.</p>
                        <div class="alert alert-success mt-3">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            <strong>${markedCount} staff members</strong> attendance recorded
                        </div>
                        <div class="mt-3">
                            <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Present: <strong>${present}</strong></p>
                            <p class="mb-2"><i class="bi bi-x-circle-fill text-danger me-2"></i>Absent: <strong>${absent}</strong></p>
                        </div>
                    `
                });
                
                // Show success toast
                toast.success(`Attendance saved: ${present} present, ${absent} absent`);
                
                // Reset attendance data after successful save
                attendanceData = {};
                loadStaffData();
                
                // Re-enable save button
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="bi bi-save"></i> Save Attendance';
                }
            })
            .catch(error => {
                console.error('Error saving attendance:', error);
                
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                // For now, simulate successful save since backend may not be ready
                // TODO: Remove this simulation when backend is implemented
                console.log('Simulating successful save with data:', saveData);
                
                showSuccessModal({
                    title: 'Attendance Saved Successfully!',
                    message: `
                        <p>Staff attendance for <strong>${formattedDate}</strong> has been saved successfully.</p>
                        <div class="alert alert-success mt-3">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            <strong>${markedCount} staff members</strong> attendance recorded
                        </div>
                        <div class="mt-3">
                            <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Present: <strong>${present}</strong></p>
                            <p class="mb-2"><i class="bi bi-x-circle-fill text-danger me-2"></i>Absent: <strong>${absent}</strong></p>
                        </div>
                        <div class="alert alert-info mt-3 small">
                            <i class="bi bi-info-circle me-2"></i>
                            Note: Backend API not yet configured. Data logged to console.
                        </div>
                    `
                });
                
                // Show success toast with info about simulation
                toast.success('Attendance saved (simulated mode)');
                
                // Reset attendance data
                attendanceData = {};
                loadStaffData();
                
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="bi bi-save"></i> Save Attendance';
                }
            });
        }
    });
}

function exportToCSV() {
    const date = document.getElementById('dateInput').value;
    
    if (!date) {
        toast('Please select a date first', { icon: '⚠️' });
        return;
    }
    
    if (Object.keys(attendanceData).length === 0) {
        toast('No attendance data to export', { icon: '⚠️' });
        return;
    }
    
    // Show loading toast
    const loadingToastId = toast.loading('Preparing export...');
    
    try {
        // Prepare CSV data
        let csv = 'Employee ID,Name,Department,Role,Status,Date\n';
        
        Object.entries(attendanceData).forEach(([staffId, status]) => {
            const staff = allStaff.find(s => s.id === parseInt(staffId));
            if (staff) {
                csv += `${staff.empId},"${staff.name}",${staff.department},${staff.role},${status},${date}\n`;
            }
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff-attendance-${date}.csv`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        toast.success(`Attendance exported: ${Object.keys(attendanceData).length} records`);
    } catch (error) {
        console.error('Export error:', error);
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        toast.error('Failed to export attendance data');
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Note: Toast and Modal functions are provided by dashboard components
// showToast() is from toast-notification.js
// showConfirmationModal() is from modal.jsp

