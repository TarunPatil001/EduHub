/**
 * Student Performance Reports JavaScript
 * Handles filtering, sorting, searching, exporting, and detailed views
 */

(function() {
    'use strict';

    // State management
    let currentData = [];
    let filteredData = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let sortColumn = 'rollNo';
    let sortDirection = 'asc';

    // Sample data (replace with actual API calls)
    const sampleStudents = [
        { rollNo: 'CS001', name: 'John Doe', department: 'Computer Science', semester: 3, batch: '2024', machineTest: 45, machineTestMax: 50, viva: 85, vivaMax: 100, percentage: 86.7, grade: 'A', status: 'Pass' },
        { rollNo: 'EC002', name: 'Jane Smith', department: 'Electronics', semester: 2, batch: '2024', machineTest: 40, machineTestMax: 50, viva: 75, vivaMax: 100, percentage: 76.7, grade: 'B', status: 'Pass' },
        { rollNo: 'ME003', name: 'Mike Johnson', department: 'Mechanical', semester: 4, batch: '2023', machineTest: 32, machineTestMax: 50, viva: 68, vivaMax: 100, percentage: 66.7, grade: 'C', status: 'Pass' },
        { rollNo: 'CS004', name: 'Sarah Williams', department: 'Computer Science', semester: 1, batch: '2024', machineTest: 48, machineTestMax: 50, viva: 92, vivaMax: 100, percentage: 93.3, grade: 'A+', status: 'Pass' },
        { rollNo: 'CE005', name: 'David Brown', department: 'Civil', semester: 3, batch: '2023', machineTest: 20, machineTestMax: 50, viva: 45, vivaMax: 100, percentage: 43.3, grade: 'D', status: 'Fail' },
        { rollNo: 'EC006', name: 'Emily Davis', department: 'Electronics', semester: 2, batch: '2024', machineTest: 43, machineTestMax: 50, viva: 88, vivaMax: 100, percentage: 87.3, grade: 'A', status: 'Pass' },
        { rollNo: 'CS007', name: 'Rajesh Kumar', department: 'Computer Science', semester: 3, batch: '2024', machineTest: 47, machineTestMax: 50, viva: 95, vivaMax: 100, percentage: 94.7, grade: 'A+', status: 'Pass' },
        { rollNo: 'ME008', name: 'Priya Sharma', department: 'Mechanical', semester: 2, batch: '2023', machineTest: 38, machineTestMax: 50, viva: 78, vivaMax: 100, percentage: 77.3, grade: 'B', status: 'Pass' },
        { rollNo: 'CE009', name: 'Amit Patel', department: 'Civil', semester: 4, batch: '2022', machineTest: 35, machineTestMax: 50, viva: 72, vivaMax: 100, percentage: 71.3, grade: 'B', status: 'Pass' },
        { rollNo: 'EC010', name: 'Sneha Reddy', department: 'Electronics', semester: 1, batch: '2024', machineTest: 42, machineTestMax: 50, viva: 86, vivaMax: 100, percentage: 85.3, grade: 'A', status: 'Pass' },
        { rollNo: 'CS011', name: 'Vikram Singh', department: 'Computer Science', semester: 3, batch: '2023', machineTest: 25, machineTestMax: 50, viva: 55, vivaMax: 100, percentage: 53.3, grade: 'D', status: 'Pass' },
        { rollNo: 'ME012', name: 'Kavita Jain', department: 'Mechanical', semester: 2, batch: '2024', machineTest: 44, machineTestMax: 50, viva: 87, vivaMax: 100, percentage: 87.3, grade: 'A', status: 'Pass' },
    ];

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        initializeData();
        setupEventListeners();
        renderTable();
        updateStatistics();
    });

    /**
     * Initialize data
     */
    function initializeData() {
        currentData = [...sampleStudents];
        filteredData = [...currentData];
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Export button - now in page header with btn-success class
        const exportBtn = Array.from(document.querySelectorAll('.btn-success, .btn-outline-primary')).find(btn => 
            btn.innerHTML.includes('bi-download')
        );
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }

        // Setup filter listeners
        setupFilterListeners();

        // Setup search listener
        setupSearchListener();

        // Setup reset button
        setupResetButton();

        // Table sorting
        setupTableSorting();

        // Items per page selector
        addItemsPerPageSelector();
    }

    /**
     * Setup filter listeners for automatic application
     */
    function setupFilterListeners() {
        // Get filter elements by ID - matching the JSP IDs
        const filterCourse = document.getElementById('filterCourse');
        const filterBatch = document.getElementById('filterBatch');
        const filterGrade = document.getElementById('filterGrade');
        const filterStatus = document.getElementById('filterStatus');

        // Add change listeners to each filter
        [filterCourse, filterBatch, filterGrade, filterStatus].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', function() {
                    applyFilters();
                    showResetButton();
                });
            }
        });
    }

    /**
     * Setup search listener
     */
    function setupSearchListener() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                searchStudents(e.target.value);
                if (e.target.value.trim()) {
                    showResetButton();
                }
            });
        }
    }

    /**
     * Setup reset button
     */
    function setupResetButton() {
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
    }

    /**
     * Show reset button
     */
    function showResetButton() {
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.style.display = 'inline-block';
        }
    }

    /**
     * Hide reset button
     */
    function hideResetButton() {
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.style.display = 'none';
        }
    }

    /**
     * Add items per page selector
     */
    function addItemsPerPageSelector() {
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        
        // If selector already exists in JSP, just attach event listener
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', function(e) {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderTable();
            });
        }
    }

    /**
     * Setup table sorting
     */
    function setupTableSorting() {
        const headers = document.querySelectorAll('#performanceTable thead th');
        headers.forEach((header, index) => {
            const columnMap = ['rollNo', 'name', 'department', 'batch', 'attendance', 'machineTest', 'viva', 'percentage', 'grade', 'status'];
            if (index < columnMap.length) {
                header.style.cursor = 'pointer';
                header.style.userSelect = 'none';
                header.innerHTML += ' <i class="bi bi-arrow-down-up" style="font-size: 0.75rem; opacity: 0.5;"></i>';
                
                header.addEventListener('click', function() {
                    sortTable(columnMap[index], header);
                });
            }
        });
    }

    /**
     * Sort table
     */
    function sortTable(column, headerElement) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        // Update header icons
        const allHeaders = document.querySelectorAll('#performanceTable thead th');
        allHeaders.forEach(h => {
            const icon = h.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-arrow-down-up';
                icon.style.opacity = '0.5';
            }
        });

        const icon = headerElement.querySelector('i');
        if (icon) {
            icon.className = sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
            icon.style.opacity = '1';
        }

        // Sort data
        filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        renderTable();
    }

    /**
     * Search students
     */
    function searchStudents(query) {
        query = query.toLowerCase().trim();
        
        // Start with base filtered data from dropdown filters
        const baseFilteredData = applyCurrentFilters(currentData);
        
        if (query === '') {
            // If no search query, show data filtered by dropdowns only
            filteredData = baseFilteredData;
        } else {
            // Search within the dropdown-filtered data
            filteredData = baseFilteredData.filter(student => 
                student.name.toLowerCase().includes(query) ||
                student.rollNo.toLowerCase().includes(query) ||
                student.department.toLowerCase().includes(query)
            );
        }

        currentPage = 1;
        renderTable();
        updateStatistics();
    }

    /**
     * Apply filters
     */
    function applyFilters(showNotification = false) {
        const baseData = applyCurrentFilters(currentData);
        
        // Apply search on top of filters if search exists
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            const query = searchInput.value.toLowerCase().trim();
            filteredData = baseData.filter(student => 
                student.name.toLowerCase().includes(query) ||
                student.rollNo.toLowerCase().includes(query) ||
                student.department.toLowerCase().includes(query)
            );
        } else {
            filteredData = baseData;
        }

        currentPage = 1;
        renderTable();
        updateStatistics();
        
        if (showNotification) {
            showToast('Filters applied successfully!', 'success');
        }
    }

    /**
     * Reset filters
     */
    function resetFilters() {
        // Reset all filter dropdowns by ID - matching JSP IDs
        const filterCourse = document.getElementById('filterCourse');
        const filterBatch = document.getElementById('filterBatch');
        const filterGrade = document.getElementById('filterGrade');
        const filterStatus = document.getElementById('filterStatus');

        if (filterCourse) filterCourse.selectedIndex = 0;
        if (filterBatch) filterBatch.selectedIndex = 0;
        if (filterGrade) filterGrade.selectedIndex = 0;
        if (filterStatus) filterStatus.selectedIndex = 0;

        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset data to original
        filteredData = [...currentData];
        currentPage = 1;
        
        // Reset sorting
        sortColumn = 'rollNo';
        sortDirection = 'asc';
        
        // Update UI
        renderTable();
        updateStatistics();
        
        // Reset table headers
        const allHeaders = document.querySelectorAll('#performanceTable thead th');
        allHeaders.forEach(h => {
            const icon = h.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-arrow-down-up';
                icon.style.opacity = '0.5';
            }
        });

        // Hide reset button
        hideResetButton();

        toast('Filters reset successfully!', { icon: 'ℹ️' });
    }

    /**
     * Apply current filter values
     */
    function applyCurrentFilters(data) {
        const filterCourse = document.getElementById('filterCourse');
        const filterBatch = document.getElementById('filterBatch');
        const filterGrade = document.getElementById('filterGrade');
        const filterStatus = document.getElementById('filterStatus');

        const course = filterCourse ? filterCourse.value : '';
        const batch = filterBatch ? filterBatch.value : '';
        const grade = filterGrade ? filterGrade.value : '';
        const status = filterStatus ? filterStatus.value : '';

        return data.filter(student => {
            let match = true;
            
            if (course && course !== '') {
                match = match && student.department === course;
            }
            
            if (batch && batch !== '') {
                match = match && student.batch === batch;
            }
            
            if (grade && grade !== '') {
                match = match && student.grade === grade;
            }
            
            if (status && status !== '') {
                match = match && student.status === status;
            }
            
            return match;
        });
    }

    /**
     * Refresh data
     */
    function refreshData() {
        // Show loading state
        const refreshBtn = event.target.closest('button');
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise spinner-border spinner-border-sm"></i> Refreshing...';
        refreshBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            initializeData();
            applyFilters(false);
            
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;
            
            // Show toast notification using component
            toast.success('Data refreshed successfully!');
        }, 1000);
    }

    /**
     * Render table
     */
    function renderTable() {
        const tbody = document.getElementById('performanceTableBody');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                        <p class="text-muted mt-2 mb-0">No records found</p>
                    </td>
                </tr>
            `;
            updatePagination();
            updateRecordInfo();
            return;
        }

        tbody.innerHTML = pageData.map(student => {
            const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const avatarColors = ['bg-primary-subtle text-primary', 'bg-success-subtle text-success', 'bg-warning-subtle text-warning', 'bg-info-subtle text-info', 'bg-danger-subtle text-danger'];
            const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
            
            return `
                <tr>
                    <td><strong>${escapeHtml(student.rollNo)}</strong></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm ${avatarColor} me-2">${initials}</div>
                            <span>${escapeHtml(student.name)}</span>
                        </div>
                    </td>
                    <td>${escapeHtml(student.department)}</td>
                    <td><span class="badge bg-secondary">${student.batch}</span></td>
                    <td>
                        <span class="badge ${getAttendanceBadgeClass(95)}">
                            <i class="bi bi-calendar-check me-1"></i>95%
                        </span>
                    </td>
                    <td><span class="badge ${getScoreBadgeClass(student.machineTest, student.machineTestMax)}">${student.machineTest}/${student.machineTestMax}</span></td>
                    <td><span class="badge ${getScoreBadgeClass(student.viva, student.vivaMax)}">${student.viva}/${student.vivaMax}</span></td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <strong class="${getPercentageColorClass(student.percentage)}">${student.percentage.toFixed(1)}%</strong>
                        </div>
                    </td>
                    <td><span class="badge ${getGradeBadgeClass(student.grade)}">${escapeHtml(student.grade)}</span></td>
                    <td><span class="badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}">${escapeHtml(student.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('${escapeHtml(student.rollNo)}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        updatePagination();
        updateRecordInfo();
    }

    /**
     * Update pagination - Matching all-students table implementation
     */
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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
                renderTable();
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
                renderTable();
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
                renderTable();
            }
        });
        pagination.appendChild(nextLi);
    }

    /**
     * Update record info
     */
    function updateRecordInfo() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
        
        // Update the spans matching all-students table structure
        const showingStartEl = document.getElementById('showingStart');
        const showingEndEl = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');
        
        if (showingStartEl && showingEndEl && totalEntriesEl) {
            if (filteredData.length > 0) {
                showingStartEl.textContent = startIndex + 1;
                showingEndEl.textContent = endIndex;
                totalEntriesEl.textContent = filteredData.length;
            } else {
                showingStartEl.textContent = '0';
                showingEndEl.textContent = '0';
                totalEntriesEl.textContent = '0';
            }
        }
    }

    /**
     * View detailed student performance in modal
     */
    window.viewDetails = function(rollNo) {
        const student = currentData.find(s => s.rollNo === rollNo);
        if (!student) {
            console.error('Student not found:', rollNo);
            return;
        }

        // Populate modal with student data
        populateStudentModal(student);

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('studentDetailsModal'));
        modal.show();
    };

    /**
     * Populate student performance modal - Simplified
     */
    function populateStudentModal(student) {
        // Generate initials for avatar
        const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        // Update student header
        document.getElementById('modalStudentAvatar').textContent = initials;
        document.getElementById('modalStudentName').textContent = student.name;
        document.getElementById('modalStudentRoll').textContent = student.rollNo;
        document.getElementById('modalCourseName').textContent = student.department;
        
        // Update grade display
        document.getElementById('modalOverallGrade').textContent = student.grade;
        document.getElementById('modalOverallPercentage').textContent = student.percentage.toFixed(1) + '%';
        
        // Update quick stats
        const attendance = Math.floor(Math.random() * 20) + 80;
        document.getElementById('modalAttendance').textContent = attendance + '%';
        document.getElementById('modalMachineTest').textContent = `${student.machineTest}/${student.machineTestMax}`;
        document.getElementById('modalViva').textContent = `${student.viva}/${student.vivaMax}`;
        document.getElementById('modalRank').textContent = '#' + calculateRank(student);
        
        // Calculate percentages
        const machineTestPercent = ((student.machineTest / student.machineTestMax) * 100).toFixed(1);
        const vivaPercent = ((student.viva / student.vivaMax) * 100).toFixed(1);
        
        // Update performance breakdown
        document.getElementById('modalMachineTestPercent').textContent = machineTestPercent + '%';
        document.getElementById('modalMachineTestBar').style.width = machineTestPercent + '%';
        document.getElementById('modalVivaPercent').textContent = vivaPercent + '%';
        document.getElementById('modalVivaBar').style.width = vivaPercent + '%';
        document.getElementById('modalOverallPercent').textContent = student.percentage.toFixed(1) + '%';
        document.getElementById('modalOverallBar').style.width = student.percentage.toFixed(1) + '%';
        
        // Update course information
        document.getElementById('modalStudentBatch').textContent = student.batch + '-' + (parseInt(student.batch) + 1);
        document.getElementById('modalStudentStatus').textContent = student.status;
        document.getElementById('modalStudentStatus').className = `badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}`;
        document.getElementById('modalEnrollDate').textContent = 'Jan 15, ' + student.batch;
        
        // Update performance summary
        document.getElementById('modalFinalScore').textContent = student.percentage.toFixed(1) + '%';
        document.getElementById('modalGradeBadge').textContent = student.grade;
        document.getElementById('modalGradeBadge').className = `badge ${getGradeBadgeClass(student.grade)}`;
        document.getElementById('modalResultStatus').textContent = student.status;
        document.getElementById('modalResultStatus').className = `badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}`;
    }

    /**
     * Export student data to PDF (mock)
     */
    window.exportStudentData = function() {
        toast('PDF export feature coming soon!', { icon: 'ℹ️' });
    };

    /**
     * View student details (legacy function for compatibility)
     */
    window.viewStudentDetails = function(rollNo) {
        const student = currentData.find(s => s.rollNo === rollNo);
        if (!student) return;

        const modalContent = `
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Personal Information</h6>
                            <p class="mb-1"><strong>Roll No:</strong> ${escapeHtml(student.rollNo)}</p>
                            <p class="mb-1"><strong>Name:</strong> ${escapeHtml(student.name)}</p>
                            <p class="mb-1"><strong>Department:</strong> ${escapeHtml(student.department)}</p>
                            <p class="mb-0"><strong>Batch:</strong> ${student.batch}-${parseInt(student.batch) + 1}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Academic Information</h6>
                            <p class="mb-1"><strong>Semester:</strong> ${student.semester}</p>
                            <p class="mb-1"><strong>Overall Percentage:</strong> <span class="badge ${getPercentageBadgeClass(student.percentage)}">${student.percentage.toFixed(1)}%</span></p>
                            <p class="mb-1"><strong>Grade:</strong> <span class="badge ${getGradeBadgeClass(student.grade)}">${escapeHtml(student.grade)}</span></p>
                            <p class="mb-0"><strong>Status:</strong> <span class="badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}">${escapeHtml(student.status)}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-3">
                <div class="card-body">
                    <h6 class="mb-3">Performance Breakdown</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span><i class="bi bi-laptop"></i> Machine Test</span>
                                <strong>${student.machineTest}/${student.machineTestMax}</strong>
                            </div>
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar ${getProgressBarClass(student.machineTest, student.machineTestMax)}" 
                                     style="width: ${(student.machineTest / student.machineTestMax * 100)}%">
                                    ${((student.machineTest / student.machineTestMax) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span><i class="bi bi-mic"></i> Viva</span>
                                <strong>${student.viva}/${student.vivaMax}</strong>
                            </div>
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar ${getProgressBarClass(student.viva, student.vivaMax)}" 
                                     style="width: ${(student.viva / student.vivaMax * 100)}%">
                                    ${((student.viva / student.vivaMax) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <h6 class="mb-3">Performance Analysis</h6>
                    <div class="row g-3">
                        <div class="col-md-4 text-center">
                            <i class="bi bi-trophy-fill text-warning" style="font-size: 2rem;"></i>
                            <p class="mb-0 mt-2 small text-muted">Rank</p>
                            <h5>${calculateRank(student)}</h5>
                        </div>
                        <div class="col-md-4 text-center">
                            <i class="bi bi-graph-up-arrow text-success" style="font-size: 2rem;"></i>
                            <p class="mb-0 mt-2 small text-muted">Percentile</p>
                            <h5>${calculatePercentile(student)}%</h5>
                        </div>
                        <div class="col-md-4 text-center">
                            <i class="bi bi-bar-chart-fill text-info" style="font-size: 2rem;"></i>
                            <p class="mb-0 mt-2 small text-muted">Class Average</p>
                            <h5>${calculateClassAverage().toFixed(1)}%</h5>
                        </div>
                    </div>
                </div>
            </div>

            ${student.status === 'Fail' ? `
                <div class="alert alert-warning mt-3 mb-0">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <strong>Attention Required:</strong> Student needs improvement. Consider remedial classes or additional support.
                </div>
            ` : student.percentage >= 90 ? `
                <div class="alert alert-success mt-3 mb-0">
                    <i class="bi bi-star-fill"></i>
                    <strong>Outstanding Performance!</strong> This student is among the top performers.
                </div>
            ` : ''}
            
            <div class="text-end mt-3">
                <button type="button" class="btn btn-primary" onclick="printStudentReport('${escapeHtml(student.rollNo)}')">
                    <i class="bi bi-printer"></i> Print Report
                </button>
            </div>
        `;

        // Use the existing modal component with custom configuration
        showConfirmationModal({
            title: `Student Performance Details - ${escapeHtml(student.name)}`,
            message: modalContent,
            confirmText: 'Close',
            cancelText: '',
            confirmClass: 'btn-secondary',
            icon: 'bi-person-circle text-primary',
            onConfirm: function() {
                // Just close the modal
                return true;
            }
        });

        // Hide the cancel button since we only need close
        setTimeout(() => {
            const cancelBtn = document.getElementById('modalCancelBtn');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }, 100);
    };

    /**
     * Print student report
     */
    window.printStudentReport = function(rollNo) {
        const student = currentData.find(s => s.rollNo === rollNo);
        if (!student) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Performance Report - ${escapeHtml(student.name)}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                    .info-section { margin-bottom: 20px; }
                    .info-label { font-weight: bold; display: inline-block; width: 150px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>EduHub</h1>
                    <h2>Student Performance Report</h2>
                </div>
                <div class="info-section">
                    <p><span class="info-label">Roll Number:</span> ${escapeHtml(student.rollNo)}</p>
                    <p><span class="info-label">Name:</span> ${escapeHtml(student.name)}</p>
                    <p><span class="info-label">Department:</span> ${escapeHtml(student.department)}</p>
                    <p><span class="info-label">Semester:</span> ${student.semester}</p>
                    <p><span class="info-label">Batch:</span> ${student.batch}-${parseInt(student.batch) + 1}</p>
                </div>
                <table>
                    <tr>
                        <th>Assessment Type</th>
                        <th>Marks Obtained</th>
                        <th>Maximum Marks</th>
                        <th>Percentage</th>
                    </tr>
                    <tr>
                        <td>Machine Test</td>
                        <td>${student.machineTest}</td>
                        <td>${student.machineTestMax}</td>
                        <td>${((student.machineTest / student.machineTestMax) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Viva</td>
                        <td>${student.viva}</td>
                        <td>${student.vivaMax}</td>
                        <td>${((student.viva / student.vivaMax) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td><strong>Overall</strong></td>
                        <td><strong>${student.machineTest + student.viva}</strong></td>
                        <td><strong>${student.machineTestMax + student.vivaMax}</strong></td>
                        <td><strong>${student.percentage.toFixed(1)}%</strong></td>
                    </tr>
                </table>
                <div class="info-section" style="margin-top: 30px;">
                    <p><span class="info-label">Grade:</span> ${escapeHtml(student.grade)}</p>
                    <p><span class="info-label">Status:</span> ${escapeHtml(student.status)}</p>
                    <p><span class="info-label">Rank:</span> ${calculateRank(student)}</p>
                    <p><span class="info-label">Percentile:</span> ${calculatePercentile(student)}%</p>
                </div>
                <div class="footer">
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>This is a computer-generated document. No signature required.</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    /**
     * Export to CSV
     */
    function exportToCSV() {
        const headers = ['Roll No', 'Name', 'Department', 'Semester', 'Batch', 'Machine Test', 'Viva', 'Percentage', 'Grade', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(student => [
                student.rollNo,
                `"${student.name}"`,
                `"${student.department}"`,
                student.semester,
                student.batch,
                `${student.machineTest}/${student.machineTestMax}`,
                `${student.viva}/${student.vivaMax}`,
                student.percentage.toFixed(1),
                student.grade,
                student.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `performance_reports_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Data exported successfully!');
    }

    /**
     * Update statistics
     */
    function updateStatistics() {
        const totalStudents = filteredData.length;
        const avgScore = filteredData.reduce((sum, s) => sum + s.percentage, 0) / totalStudents || 0;
        const topPerformers = filteredData.filter(s => s.percentage >= 90).length;
        const needAttention = filteredData.filter(s => s.percentage < 60).length;

        // Update stat cards - using the correct selector
        const statCards = document.querySelectorAll('.card-custom h3');
        if (statCards.length >= 4) {
            statCards[0].textContent = totalStudents;
            statCards[1].textContent = avgScore.toFixed(1) + '%';
            statCards[2].textContent = topPerformers;
            statCards[3].textContent = needAttention;
        }
    }

    /**
     * Helper functions
     */
    function getScoreBadgeClass(score, max) {
        const percentage = (score / max) * 100;
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 60) return 'bg-info';
        if (percentage >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    function getPercentageBadgeClass(percentage) {
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 60) return 'bg-info';
        if (percentage >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    function getAttendanceBadgeClass(attendance) {
        if (attendance >= 90) return 'bg-success';
        if (attendance >= 75) return 'bg-info';
        if (attendance >= 60) return 'bg-warning';
        return 'bg-danger';
    }

    function getGradeBadgeClass(grade) {
        if (grade === 'A+' || grade === 'A') return 'bg-primary';
        if (grade === 'B') return 'bg-info';
        if (grade === 'C') return 'bg-warning';
        return 'bg-danger';
    }

    function getProgressBarClass(score, max) {
        const percentage = (score / max) * 100;
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 60) return 'bg-info';
        if (percentage >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    function calculateRank(student) {
        const sorted = [...currentData].sort((a, b) => b.percentage - a.percentage);
        return sorted.findIndex(s => s.rollNo === student.rollNo) + 1;
    }

    function calculatePercentile(student) {
        const rank = calculateRank(student);
        const percentile = ((currentData.length - rank) / currentData.length * 100);
        return percentile.toFixed(1);
    }

    function calculateClassAverage() {
        return currentData.reduce((sum, s) => sum + s.percentage, 0) / currentData.length;
    }

    function getGradeFromPercentage(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        return 'D';
    }

    function getPercentageColorClass(percentage) {
        if (percentage >= 80) return 'text-success';
        if (percentage >= 60) return 'text-info';
        if (percentage >= 50) return 'text-warning';
        return 'text-danger';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Print report (global function for page header button)
     */
    window.printReport = function() {
        window.print();
    };

})();