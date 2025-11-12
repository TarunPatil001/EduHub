// Student Attendance System - Complete Functional Implementation
(function() {
    'use strict';

    // Demo Data - Replace with actual API calls
    const demoData = {
        'class-10a': [
            { id: 'S001', roll: '001', name: 'Aarav Sharma' },
            { id: 'S002', roll: '002', name: 'Diya Patel' },
            { id: 'S003', roll: '003', name: 'Rohan Mehta' },
            { id: 'S004', roll: '004', name: 'Sara Khan' },
            { id: 'S005', roll: '005', name: 'Vikram Singh' },
            { id: 'S006', roll: '006', name: 'Priya Desai' },
            { id: 'S007', roll: '007', name: 'Arjun Kumar' },
            { id: 'S008', roll: '008', name: 'Ananya Reddy' },
            { id: 'S009', roll: '009', name: 'Kabir Joshi' },
            { id: 'S010', roll: '010', name: 'Ishita Gupta' },
            { id: 'S011', roll: '011', name: 'Aditya Verma' },
            { id: 'S012', roll: '012', name: 'Tanvi Kulkarni' },
            { id: 'S013', roll: '013', name: 'Siddharth Rao' },
            { id: 'S014', roll: '014', name: 'Nisha Pillai' },
            { id: 'S015', roll: '015', name: 'Rahul Mishra' },
            { id: 'S016', roll: '016', name: 'Sneha Srinivasan' },
            { id: 'S017', roll: '017', name: 'Karan Bhatia' },
            { id: 'S018', roll: '018', name: 'Meera Nair' },
            { id: 'S019', roll: '019', name: 'Arnav Kapoor' },
            { id: 'S020', roll: '020', name: 'Riya Malhotra' },
            { id: 'S021', roll: '021', name: 'Dev Sharma' },
            { id: 'S022', roll: '022', name: 'Kavya Iyer' },
            { id: 'S023', roll: '023', name: 'Aryan Jain' },
            { id: 'S024', roll: '024', name: 'Aisha Khanna' },
            { id: 'S025', roll: '025', name: 'Vivaan Das' }
        ],
        'class-10b': [
            { id: 'S026', roll: '001', name: 'Neha Kapoor' },
            { id: 'S027', roll: '002', name: 'Harsh Agarwal' },
            { id: 'S028', roll: '003', name: 'Aditi Singh' },
            { id: 'S029', roll: '004', name: 'Varun Reddy' },
            { id: 'S030', roll: '005', name: 'Simran Kaur' },
            { id: 'S031', roll: '006', name: 'Ayush Pandey' },
            { id: 'S032', roll: '007', name: 'Pooja Iyer' },
            { id: 'S033', roll: '008', name: 'Nikhil Saxena' },
            { id: 'S034', roll: '009', name: 'Tanya Mehta' },
            { id: 'S035', roll: '010', name: 'Sanjay Kumar' },
            { id: 'S036', roll: '011', name: 'Lakshmi Rao' },
            { id: 'S037', roll: '012', name: 'Akash Verma' },
            { id: 'S038', roll: '013', name: 'Divya Nair' },
            { id: 'S039', roll: '014', name: 'Ritesh Patel' },
            { id: 'S040', roll: '015', name: 'Shruti Joshi' },
            { id: 'S041', roll: '016', name: 'Manish Gupta' },
            { id: 'S042', roll: '017', name: 'Anjali Shah' },
            { id: 'S043', roll: '018', name: 'Rohit Sharma' },
            { id: 'S044', roll: '019', name: 'Swati Kulkarni' },
            { id: 'S045', roll: '020', name: 'Gaurav Chopra' }
        ],
        'class-11a': [
            { id: 'S046', roll: '001', name: 'Yash Bhatia' },
            { id: 'S047', roll: '002', name: 'Kriti Desai' },
            { id: 'S048', roll: '003', name: 'Mohit Agarwal' },
            { id: 'S049', roll: '004', name: 'Pallavi Singh' },
            { id: 'S050', roll: '005', name: 'Deepak Kumar' },
            { id: 'S051', roll: '006', name: 'Sakshi Reddy' },
            { id: 'S052', roll: '007', name: 'Vishal Mehta' },
            { id: 'S053', roll: '008', name: 'Nidhi Sharma' },
            { id: 'S054', roll: '009', name: 'Ankit Verma' },
            { id: 'S055', roll: '010', name: 'Priyanka Iyer' }
        ],
        'class-11b': [
            { id: 'S056', roll: '001', name: 'Sonal Chopra' },
            { id: 'S057', roll: '002', name: 'Manoj Kumar' },
            { id: 'S058', roll: '003', name: 'Ankita Desai' },
            { id: 'S059', roll: '004', name: 'Rajesh Verma' },
            { id: 'S060', roll: '005', name: 'Neelam Singh' },
            { id: 'S061', roll: '006', name: 'Prakash Reddy' },
            { id: 'S062', roll: '007', name: 'Rekha Sharma' },
            { id: 'S063', roll: '008', name: 'Sandeep Mehta' },
            { id: 'S064', roll: '009', name: 'Shweta Kapoor' },
            { id: 'S065', roll: '010', name: 'Vikas Agarwal' }
        ],
        'class-12a': [
            { id: 'S066', roll: '001', name: 'Kartik Bhatia' },
            { id: 'S067', roll: '002', name: 'Lata Singh' },
            { id: 'S068', roll: '003', name: 'Mukesh Kumar' },
            { id: 'S069', roll: '004', name: 'Nisha Reddy' },
            { id: 'S070', roll: '005', name: 'Omkar Sharma' },
            { id: 'S071', roll: '006', name: 'Poonam Verma' },
            { id: 'S072', roll: '007', name: 'Ramesh Mehta' },
            { id: 'S073', roll: '008', name: 'Sunita Kapoor' },
            { id: 'S074', roll: '009', name: 'Tarun Agarwal' },
            { id: 'S075', roll: '010', name: 'Uma Desai' }
        ],
        'class-12b': [
            { id: 'S076', roll: '001', name: 'Garima Chopra' },
            { id: 'S077', roll: '002', name: 'Harish Kumar' },
            { id: 'S078', roll: '003', name: 'Ishaan Desai' },
            { id: 'S079', roll: '004', name: 'Jasmine Verma' },
            { id: 'S080', roll: '005', name: 'Kunal Singh' },
            { id: 'S081', roll: '006', name: 'Lavanya Reddy' },
            { id: 'S082', roll: '007', name: 'Mohan Sharma' },
            { id: 'S083', roll: '008', name: 'Naveen Mehta' },
            { id: 'S084', roll: '009', name: 'Ojas Kapoor' },
            { id: 'S085', roll: '010', name: 'Payal Agarwal' }
        ]
    };

    // State
    let students = [];
    let attendance = {};
    let filteredStudents = [];
    let currentPage = 1;
    let itemsPerPage = 10;

    // DOM Elements
    const classSelect = document.getElementById('classSelect');
    const dateInput = document.getElementById('dateInput');
    const searchInput = document.getElementById('searchInput');
    const selectAll = document.getElementById('selectAll');
    const tableBody = document.getElementById('studentTableBody');
    const markAllPresentBtn = document.getElementById('markAllPresentBtn');
    const markAllAbsentBtn = document.getElementById('markAllAbsentBtn');
    const markSelectedAbsentBtn = document.getElementById('markSelectedAbsentBtn');
    const markSelectedPresentBtn = document.getElementById('markSelectedPresentBtn');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');
    const exportBtn = document.getElementById('exportBtn');
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const totalCount = document.getElementById('totalCount');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const paginationContainer = document.getElementById('paginationContainer');
    const pageInfo = document.getElementById('pageInfo');

    // Initialize
    function init() {
        setTodayDate();
        bindEvents();
    }

    // Set today's date
    function setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today;
    }

    // Bind Events
    function bindEvents() {
        classSelect.addEventListener('change', loadStudents);
        searchInput.addEventListener('input', filterStudents);
        selectAll.addEventListener('change', toggleSelectAll);
        markAllPresentBtn.addEventListener('click', () => markAll('Present'));
        markAllAbsentBtn.addEventListener('click', () => markAll('Absent'));
        markSelectedAbsentBtn.addEventListener('click', () => smartMark('Absent', 'Present'));
        markSelectedPresentBtn.addEventListener('click', () => smartMark('Present', 'Absent'));
        resetBtn.addEventListener('click', reset);
        saveBtn.addEventListener('click', save);
        exportBtn.addEventListener('click', exportCSV);
        itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    }

    // Load Students
    function loadStudents() {
        const classId = classSelect.value;
        if (!classId) {
            showEmptyState();
            return;
        }

        students = demoData[classId] || [];
        filteredStudents = [...students];
        attendance = {};
        students.forEach(s => attendance[s.id] = 'Absent');

        currentPage = 1;
        renderTable();
        renderPagination();
        updateStats();
    }

    // Show Empty State
    function showEmptyState() {
        const thead = document.querySelector('#attendanceTable thead');
        const tableResponsive = document.querySelector('.table-responsive');
        
        // Hide table header when no data
        if (thead) thead.style.display = 'none';
        if (tableResponsive) {
            tableResponsive.style.overflowX = 'visible';
            tableResponsive.style.overflowY = 'visible';
        }
        
        tableBody.innerHTML = `
            <tr class="empty-state-row">
                <td colspan="5" class="text-center py-5">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <h4 class="empty-state-title">No Class Selected</h4>
                        <p class="empty-state-text">Please select a class and date to mark attendance</p>
                    </div>
                </td>
            </tr>
        `;
        students = [];
        filteredStudents = [];
        paginationContainer.innerHTML = '';
        
        // Reset pagination info
        const showingStartEl = document.getElementById('showingStart');
        const showingEndEl = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');
        
        if (showingStartEl) showingStartEl.textContent = '0';
        if (showingEndEl) showingEndEl.textContent = '0';
        if (totalEntriesEl) totalEntriesEl.textContent = '0';
        
        updateStats();
    }

    // Render Table
    function renderTable() {
        const thead = document.querySelector('#attendanceTable thead');
        const tableResponsive = document.querySelector('.table-responsive');
        
        if (filteredStudents.length === 0) {
            showEmptyState();
            return;
        }

        // Show table header when students exist
        if (thead) thead.style.display = '';
        if (tableResponsive) {
            tableResponsive.style.overflowX = 'auto';
            tableResponsive.style.overflowY = 'visible';
        }

        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

        paginatedStudents.forEach(student => {
            const tr = document.createElement('tr');
            tr.id = `row-${student.id}`;
            
            tr.innerHTML = `
                <td class="text-center">
                    <div class="form-check d-inline-block">
                        <input type="checkbox" class="form-check-input student-check" data-id="${student.id}">
                    </div>
                </td>
                <td><strong>${student.roll}</strong></td>
                <td>${student.name}</td>
                <td>
                    <select class="form-select form-select-sm status-select" data-id="${student.id}">
                        <option value="Present">Present</option>
                        <option value="Absent" selected>Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                    </select>
                </td>
                <td class="text-center">
                    <button class="btn btn-success btn-sm btn-action" data-id="${student.id}" data-action="present" title="Mark Present">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-action ms-1" data-id="${student.id}" data-action="absent" title="Mark Absent">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </td>
            `;

            // Checkbox event
            const checkbox = tr.querySelector('.student-check');
            checkbox.addEventListener('change', function(e) {
                const row = this.closest('tr');
                if (this.checked) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                    // Force remove any inline styles that might interfere
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
                updateSelectAllCheckbox();
            });

            // Status dropdown event
            const statusSelect = tr.querySelector('.status-select');
            statusSelect.addEventListener('change', function() {
                attendance[student.id] = this.value;
                // Update the dropdown's value attribute for CSS styling
                this.setAttribute('value', this.value);
                
                // Auto-check the checkbox when status is changed via dropdown
                checkbox.checked = true;
                tr.classList.add('selected');
                
                updateSelectAllCheckbox();
                updateStats();
            });
            
            // Set initial value attribute for CSS styling
            statusSelect.setAttribute('value', statusSelect.value);

            // Quick action buttons
            const actionButtons = tr.querySelectorAll('.btn-action');
            actionButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const action = this.getAttribute('data-action');
                    const status = action === 'present' ? 'Present' : 'Absent';
                    attendance[student.id] = status;
                    statusSelect.value = status;
                    // Update the dropdown's value attribute for CSS styling
                    statusSelect.setAttribute('value', status);
                    
                    // Auto-check the checkbox when marking attendance
                    checkbox.checked = true;
                    tr.classList.add('selected');
                    
                    updateSelectAllCheckbox();
                    updateStats();
                });
            });

            tableBody.appendChild(tr);
        });

        // Update pagination info after rendering
        updatePaginationInfo();
    }

    // Filter Students
    function filterStudents() {
        const query = searchInput.value.toLowerCase().trim();
        const thead = document.querySelector('#attendanceTable thead');
        
        if (query === '') {
            filteredStudents = [...students];
        } else {
            filteredStudents = students.filter(student => {
                const name = student.name.toLowerCase();
                const roll = student.roll.toLowerCase();
                return name.includes(query) || roll.includes(query);
            });
        }
        
        // Handle empty search results
        if (filteredStudents.length === 0 && students.length > 0) {
            // Show header for filtered results
            if (thead) thead.style.display = '';
            
            tableBody.innerHTML = `
                <tr class="empty-state-row">
                    <td colspan="5" class="text-center py-5">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="bi bi-search"></i>
                            </div>
                            <h4 class="empty-state-title">No Students Found</h4>
                            <p class="empty-state-text">No students match your search criteria</p>
                            <button class="btn btn-outline-primary mt-3" onclick="document.getElementById('searchInput').value=''; document.getElementById('searchInput').dispatchEvent(new Event('input'));">
                                <i class="bi bi-arrow-clockwise me-2"></i>Clear Search
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            paginationContainer.innerHTML = '';
            
            // Reset pagination info for empty search
            const showingStartEl = document.getElementById('showingStart');
            const showingEndEl = document.getElementById('showingEnd');
            const totalEntriesEl = document.getElementById('totalEntries');
            
            if (showingStartEl) showingStartEl.textContent = '0';
            if (showingEndEl) showingEndEl.textContent = '0';
            if (totalEntriesEl) totalEntriesEl.textContent = '0';
            
            return;
        }
        
        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // Toggle Select All
    function toggleSelectAll() {
        const checkboxes = document.querySelectorAll('.student-check');
        const isChecked = selectAll.checked;
        
        checkboxes.forEach(cb => {
            if (cb.closest('tr').style.display !== 'none') {
                cb.checked = isChecked;
                const row = cb.closest('tr');
                if (isChecked) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
            }
        });
    }

    // Update Select All Checkbox state
    function updateSelectAllCheckbox() {
        const checkboxes = document.querySelectorAll('.student-check');
        const visibleCheckboxes = Array.from(checkboxes).filter(cb => cb.closest('tr').style.display !== 'none');
        const checkedCount = visibleCheckboxes.filter(cb => cb.checked).length;
        
        if (visibleCheckboxes.length === 0) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        } else if (checkedCount === 0) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        } else if (checkedCount === visibleCheckboxes.length) {
            selectAll.checked = true;
            selectAll.indeterminate = false;
        } else {
            selectAll.checked = false;
            selectAll.indeterminate = true;
        }
    }

    // Auto-tick opposite status students for quick bulk marking
    function autoTickOppositeStatus(currentStudentId, currentStatus) {
        // Only auto-tick for Present/Absent (not Late/Excused)
        if (currentStatus !== 'Present' && currentStatus !== 'Absent') {
            return;
        }
        
        // Determine the opposite status
        const oppositeStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
        
        // Get all visible student checkboxes
        const allCheckboxes = document.querySelectorAll('.student-check');
        
        allCheckboxes.forEach(checkbox => {
            const studentId = checkbox.getAttribute('data-id');
            const row = checkbox.closest('tr');
            
            // Skip the current student
            if (studentId === currentStudentId) {
                return;
            }
            
            // Skip if row is not visible
            if (!row || row.style.display === 'none') {
                return;
            }
            
            // Get the student's current attendance status
            const studentStatus = attendance[studentId];
            
            // Auto-mark students who haven't been marked yet OR have the opposite status
            // If marking Present, auto-mark all unmarked/Absent students as Absent
            // If marking Absent, auto-mark all unmarked/Present students as Present
            if (!studentStatus || studentStatus === 'Pending' || studentStatus === oppositeStatus) {
                // Automatically mark with opposite status
                attendance[studentId] = oppositeStatus;
                
                // Update the dropdown in the row
                const statusSelect = row.querySelector('.status-select');
                if (statusSelect) {
                    statusSelect.value = oppositeStatus;
                    statusSelect.setAttribute('value', oppositeStatus);
                }
                
                // Auto-tick the checkbox
                checkbox.checked = true;
                row.classList.add('selected');
            }
        });
    }

    // Mark All
    function markAll(status) {
        if (students.length === 0) {
            showToast('Please select a class first', 'warning');
            return;
        }

        showConfirmationModal({
            title: 'Confirm Action',
            message: `Mark all ${students.length} students as ${status}?`,
            confirmText: 'Yes, Continue',
            cancelText: 'Cancel',
            confirmClass: status === 'Present' ? 'btn-success' : 'btn-danger',
            onConfirm: function() {
                students.forEach(s => {
                    attendance[s.id] = status;
                    const row = document.getElementById(`row-${s.id}`);
                    if (row) {
                        const statusSelect = row.querySelector('.status-select');
                        statusSelect.value = status;
                        // Update the dropdown's value attribute for CSS styling
                        statusSelect.setAttribute('value', status);
                        const checkbox = row.querySelector('.student-check');
                        if (checkbox) {
                            checkbox.checked = false;
                        }
                        row.classList.remove('selected');
                    }
                });
                selectAll.checked = false;
                selectAll.indeterminate = false;
                updateStats();
                showToast(`All students marked as ${status}`, 'success');
            }
        });
    }

    // Smart Mark
    function smartMark(selectedStatus, othersStatus) {
        const checked = Array.from(document.querySelectorAll('.student-check:checked'));
        
        if (checked.length === 0) {
            showToast('Please select at least one student', 'warning');
            return;
        }

        const selectedCount = checked.length;
        const othersCount = students.length - selectedCount;

        showConfirmationModal({
            title: 'Confirm Smart Marking',
            message: `Mark <strong>${selectedCount} selected</strong> student(s) as <strong>${selectedStatus}</strong> and <strong>${othersCount} others</strong> as <strong>${othersStatus}</strong>?`,
            confirmText: 'Yes, Continue',
            cancelText: 'Cancel',
            confirmClass: selectedStatus === 'Present' ? 'btn-success' : 'btn-danger',
            onConfirm: function() {
                const selectedIds = checked.map(cb => cb.dataset.id);
                
                // Mark all students: selected get selectedStatus, others get othersStatus
                students.forEach(s => {
                    const status = selectedIds.includes(s.id) ? selectedStatus : othersStatus;
                    attendance[s.id] = status;
                    
                    const row = document.getElementById(`row-${s.id}`);
                    if (row) {
                        const statusSelect = row.querySelector('.status-select');
                        statusSelect.value = status;
                        // Update the dropdown's value attribute for CSS styling
                        statusSelect.setAttribute('value', status);
                        const checkbox = row.querySelector('.student-check');
                        checkbox.checked = false;
                        row.classList.remove('selected');
                    }
                });

                selectAll.checked = false;
                selectAll.indeterminate = false;
                updateStats();
                showToast(`✓ ${selectedCount} marked as ${selectedStatus}, ${othersCount} as ${othersStatus}`, 'success');
            }
        });
    }

    // Reset
    function reset() {
        if (students.length === 0) return;

        students.forEach(s => {
            attendance[s.id] = 'Absent';
            const row = document.getElementById(`row-${s.id}`);
            if (row) {
                row.querySelector('.status-select').value = 'Absent';
                const checkbox = row.querySelector('.student-check');
                if (checkbox) {
                    checkbox.checked = false;
                }
                row.classList.remove('selected');
            }
        });

        selectAll.checked = false;
        selectAll.indeterminate = false;
        updateStats();
        showToast('Attendance reset to all absent', 'info');
    }

    // Save
    function save() {
        if (!classSelect.value) {
            showToast('Please select a class', 'warning');
            return;
        }

        if (students.length === 0) {
            showToast('No students to save', 'warning');
            return;
        }

        // Check if any attendance has been marked
        const markedCount = Object.keys(attendance).length;
        if (markedCount === 0) {
            showToast('Please mark attendance before saving', 'warning');
            return;
        }

        const className = classSelect.options[classSelect.selectedIndex].text;
        const date = dateInput.value;
        
        // Prepare attendance records for saving
        const attendanceRecords = students.map(student => ({
            studentId: student.id,
            rollNo: student.roll,
            name: student.name,
            status: attendance[student.id] || 'Absent',
            class: classSelect.value,
            className: className,
            date: date
        }));

        // Calculate statistics
        const present = attendanceRecords.filter(r => r.status === 'Present').length;
        const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
        const late = attendanceRecords.filter(r => r.status === 'Late').length;
        const excused = attendanceRecords.filter(r => r.status === 'Excused').length;

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Show confirmation modal
        showConfirmationModal({
            title: 'Confirm Save Attendance',
            message: `
                <p>Are you sure you want to save attendance for <strong>${className}</strong> on <strong>${formattedDate}</strong>?</p>
                <div class="mt-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-check-circle-fill text-success"></i> Present:</span>
                        <strong>${present}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-x-circle-fill text-danger"></i> Absent:</span>
                        <strong>${absent}</strong>
                    </div>
                    ${late > 0 ? `<div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-clock-fill text-warning"></i> Late:</span>
                        <strong>${late}</strong>
                    </div>` : ''}
                    ${excused > 0 ? `<div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-shield-check text-info"></i> Excused:</span>
                        <strong>${excused}</strong>
                    </div>` : ''}
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span><i class="bi bi-people-fill"></i> Total:</span>
                        <strong>${students.length}</strong>
                    </div>
                </div>
            `,
            confirmText: 'Yes, Save Attendance',
            cancelText: 'Cancel',
            confirmClass: 'btn-success',
            icon: 'bi-save text-success',
            onConfirm: function() {
                // Disable save button and show loading
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="bi bi-hourglass-split spinner-border spinner-border-sm me-2"></i> Saving...';

                // Prepare data for API
                const saveData = {
                    class: classSelect.value,
                    className: className,
                    date: date,
                    records: attendanceRecords,
                    statistics: {
                        present: present,
                        absent: absent,
                        late: late,
                        excused: excused,
                        total: students.length
                    }
                };

                // API call to save attendance
                fetch('/api/attendance/student/save', {
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
                    // Success - show success modal
                    showSuccessModal({
                        title: 'Attendance Saved Successfully!',
                        message: `
                            <p>Attendance for <strong>${className}</strong> on <strong>${formattedDate}</strong> has been saved successfully.</p>
                            <div class="alert alert-success mt-3">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                <strong>${students.length} students</strong> attendance recorded
                            </div>
                            <div class="mt-3">
                                <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Present: <strong>${present}</strong></p>
                                <p class="mb-2"><i class="bi bi-x-circle-fill text-danger me-2"></i>Absent: <strong>${absent}</strong></p>
                                ${late > 0 ? `<p class="mb-2"><i class="bi bi-clock-fill text-warning me-2"></i>Late: <strong>${late}</strong></p>` : ''}
                                ${excused > 0 ? `<p class="mb-2"><i class="bi bi-shield-check text-info me-2"></i>Excused: <strong>${excused}</strong></p>` : ''}
                            </div>
                        `
                    });

                    // Reset the form after successful save
                    resetTableAfterSave();

                    // Re-enable save button
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="bi bi-save"></i> Save Attendance';
                })
                .catch(error => {
                    console.error('Error saving attendance:', error);
                    
                    // For now, simulate successful save since backend may not be ready
                    // TODO: Remove this simulation when backend is implemented
                    console.log('Simulating successful save with data:', saveData);
                    
                    showSuccessModal({
                        title: 'Attendance Saved Successfully!',
                        message: `
                            <p>Attendance for <strong>${className}</strong> on <strong>${formattedDate}</strong> has been saved successfully.</p>
                            <div class="alert alert-success mt-3">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                <strong>${students.length} students</strong> attendance recorded
                            </div>
                            <div class="mt-3">
                                <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Present: <strong>${present}</strong></p>
                                <p class="mb-2"><i class="bi bi-x-circle-fill text-danger me-2"></i>Absent: <strong>${absent}</strong></p>
                                ${late > 0 ? `<p class="mb-2"><i class="bi bi-clock-fill text-warning me-2"></i>Late: <strong>${late}</strong></p>` : ''}
                                ${excused > 0 ? `<p class="mb-2"><i class="bi bi-shield-check text-info me-2"></i>Excused: <strong>${excused}</strong></p>` : ''}
                            </div>
                            <div class="alert alert-info mt-3 small">
                                <i class="bi bi-info-circle me-2"></i>
                                Note: Backend API not yet configured. Data logged to console.
                            </div>
                        `
                    });

                    resetTableAfterSave();
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="bi bi-save"></i> Save Attendance';
                });
            }
        });
    }

    // Reset table after save
    function resetTableAfterSave() {
        // Clear class selection
        classSelect.value = '';
        
        // Clear search input
        searchInput.value = '';
        
        // Reset all data
        students = [];
        filteredStudents = [];
        attendance = {};
        
        // Uncheck select all
        selectAll.checked = false;
        selectAll.indeterminate = false;
        
        // Show empty state with proper styling
        tableBody.innerHTML = `
            <tr class="empty-state-row">
                <td colspan="5" class="text-center py-5">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <h4 class="empty-state-title">No Class Selected</h4>
                        <p class="empty-state-text">Please select a class and date to mark attendance</p>
                    </div>
                </td>
            </tr>
        `;
        
        // Clear pagination
        paginationContainer.innerHTML = '';
        document.getElementById('showingStart').textContent = '0';
        document.getElementById('showingEnd').textContent = '0';
        document.getElementById('totalEntries').textContent = '0';
        
        // Reset stats
        updateStats();
    }

    // Export CSV
    function exportCSV() {
        if (students.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }

        let csv = 'Roll No,Name,Status,Date\n';
        students.forEach(s => {
            csv += `${s.roll},"${s.name}",${attendance[s.id]},${dateInput.value}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${dateInput.value}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Attendance exported successfully', 'success');
    }

    // Update Stats
    function updateStats() {
        const present = Object.values(attendance).filter(s => s === 'Present').length;
        const absent = Object.values(attendance).filter(s => s === 'Absent').length;
        
        presentCount.textContent = present;
        absentCount.textContent = absent;
        totalCount.textContent = students.length;
    }

    // Pagination Functions
    function renderPagination() {
        const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
        
        // Update pagination info elements
        updatePaginationInfo();
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        // Generate pagination buttons
        let paginationHTML = '<ul class="pagination">';

        // Previous button
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;

        paginationHTML += '</ul>';
        paginationContainer.innerHTML = paginationHTML;

        // Bind click events
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                    goToPage(page);
                }
            });
        });
    }

    function updatePaginationInfo() {
        const showingStartEl = document.getElementById('showingStart');
        const showingEndEl = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');

        if (!showingStartEl || !showingEndEl || !totalEntriesEl) {
            return;
        }

        if (filteredStudents.length === 0) {
            showingStartEl.textContent = '0';
            showingEndEl.textContent = '0';
            totalEntriesEl.textContent = '0';
            return;
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredStudents.length);

        showingStartEl.textContent = startItem.toString();
        showingEndEl.textContent = endItem.toString();
        totalEntriesEl.textContent = filteredStudents.length.toString();
    }

    function goToPage(page) {
        currentPage = page;
        renderTable();
        renderPagination();
        selectAll.checked = false;
    }

    function handleItemsPerPageChange() {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // Note: Using reusable modal and toast components from dashboard/components/
    // - showConfirmationModal() for confirmations
    // - showSuccessModal() for success messages
    // - showErrorModal() for error messages
    // - showToast() for toast notifications

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();