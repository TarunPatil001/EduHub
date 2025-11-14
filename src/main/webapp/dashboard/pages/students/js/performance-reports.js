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
        { rollNo: 'CS001', name: 'John Doe', department: 'Computer Science', semester: 3, batch: '2024', machineTest: 45, machineTestMax: 50, viva: 18, vivaMax: 20, percentage: 85.5, grade: 'A', status: 'Pass' },
        { rollNo: 'EC002', name: 'Jane Smith', department: 'Electronics', semester: 2, batch: '2024', machineTest: 40, machineTestMax: 50, viva: 15, vivaMax: 20, percentage: 78.2, grade: 'B', status: 'Pass' },
        { rollNo: 'ME003', name: 'Mike Johnson', department: 'Mechanical', semester: 4, batch: '2023', machineTest: 32, machineTestMax: 50, viva: 13, vivaMax: 20, percentage: 65.8, grade: 'C', status: 'Pass' },
        { rollNo: 'CS004', name: 'Sarah Williams', department: 'Computer Science', semester: 1, batch: '2024', machineTest: 48, machineTestMax: 50, viva: 19, vivaMax: 20, percentage: 92.0, grade: 'A+', status: 'Pass' },
        { rollNo: 'CE005', name: 'David Brown', department: 'Civil', semester: 3, batch: '2023', machineTest: 20, machineTestMax: 50, viva: 9, vivaMax: 20, percentage: 45.5, grade: 'D', status: 'Fail' },
        { rollNo: 'EC006', name: 'Emily Davis', department: 'Electronics', semester: 2, batch: '2024', machineTest: 43, machineTestMax: 50, viva: 17, vivaMax: 20, percentage: 88.3, grade: 'A', status: 'Pass' },
        { rollNo: 'CS007', name: 'Rajesh Kumar', department: 'Computer Science', semester: 3, batch: '2024', machineTest: 47, machineTestMax: 50, viva: 19, vivaMax: 20, percentage: 94.2, grade: 'A+', status: 'Pass' },
        { rollNo: 'ME008', name: 'Priya Sharma', department: 'Mechanical', semester: 2, batch: '2023', machineTest: 38, machineTestMax: 50, viva: 16, vivaMax: 20, percentage: 77.1, grade: 'B', status: 'Pass' },
        { rollNo: 'CE009', name: 'Amit Patel', department: 'Civil', semester: 4, batch: '2022', machineTest: 35, machineTestMax: 50, viva: 14, vivaMax: 20, percentage: 70.0, grade: 'B', status: 'Pass' },
        { rollNo: 'EC010', name: 'Sneha Reddy', department: 'Electronics', semester: 1, batch: '2024', machineTest: 42, machineTestMax: 50, viva: 18, vivaMax: 20, percentage: 85.7, grade: 'A', status: 'Pass' },
        { rollNo: 'CS011', name: 'Vikram Singh', department: 'Computer Science', semester: 3, batch: '2023', machineTest: 25, machineTestMax: 50, viva: 10, vivaMax: 20, percentage: 50.0, grade: 'D', status: 'Pass' },
        { rollNo: 'ME012', name: 'Kavita Jain', department: 'Mechanical', semester: 2, batch: '2024', machineTest: 44, machineTestMax: 50, viva: 17, vivaMax: 20, percentage: 87.1, grade: 'A', status: 'Pass' },
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
        // Get filter elements by ID for precise control
        const filterDepartment = document.getElementById('filterDepartment');
        const filterBatch = document.getElementById('filterBatch');
        const filterSemester = document.getElementById('filterSemester');
        const filterStatus = document.getElementById('filterStatus');

        // Add change listeners to each filter
        [filterDepartment, filterBatch, filterSemester, filterStatus].forEach(filter => {
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
        const headers = document.querySelectorAll('.table-custom thead th');
        headers.forEach((header, index) => {
            const columnMap = ['rollNo', 'name', 'department', 'semester', 'machineTest', 'viva', 'percentage', 'grade', 'status'];
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
        const allHeaders = document.querySelectorAll('.table-custom thead th');
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
        // Reset all filter dropdowns by ID
        const filterDepartment = document.getElementById('filterDepartment');
        const filterBatch = document.getElementById('filterBatch');
        const filterSemester = document.getElementById('filterSemester');
        const filterStatus = document.getElementById('filterStatus');

        if (filterDepartment) filterDepartment.selectedIndex = 0;
        if (filterBatch) filterBatch.selectedIndex = 0;
        if (filterSemester) filterSemester.selectedIndex = 0;
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
        const allHeaders = document.querySelectorAll('.table-custom thead th');
        allHeaders.forEach(h => {
            const icon = h.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-arrow-down-up';
                icon.style.opacity = '0.5';
            }
        });

        // Hide reset button
        hideResetButton();

        Toast.info('Filters reset successfully!');
    }

    /**
     * Apply current filter values
     */
    function applyCurrentFilters(data) {
        const filterDepartment = document.getElementById('filterDepartment');
        const filterBatch = document.getElementById('filterBatch');
        const filterSemester = document.getElementById('filterSemester');
        const filterStatus = document.getElementById('filterStatus');

        const department = filterDepartment ? filterDepartment.value : '';
        const batch = filterBatch ? filterBatch.value : '';
        const semester = filterSemester ? filterSemester.value : '';
        const status = filterStatus ? filterStatus.value : '';

        return data.filter(student => {
            let match = true;
            
            if (department && department !== '') {
                match = match && student.department === department;
            }
            
            if (batch && batch !== '') {
                match = match && student.batch === batch;
            }
            
            if (semester && semester !== '') {
                match = match && student.semester === parseInt(semester);
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
            Toast.success('Data refreshed successfully!');
        }, 1000);
    }

    /**
     * Render table
     */
    function renderTable() {
        const tbody = document.querySelector('.table-custom tbody');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                        <p class="text-muted mt-2 mb-0">No records found</p>
                    </td>
                </tr>
            `;
            updatePagination();
            updateRecordInfo();
            return;
        }

        tbody.innerHTML = pageData.map(student => `
            <tr>
                <td><strong>${escapeHtml(student.rollNo)}</strong></td>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.department)}</td>
                <td>${student.semester}</td>
                <td><span class="badge ${getScoreBadgeClass(student.machineTest, student.machineTestMax)}">${student.machineTest}/${student.machineTestMax}</span></td>
                <td><span class="badge ${getScoreBadgeClass(student.viva, student.vivaMax)}">${student.viva}/${student.vivaMax}</span></td>
                <td><span class="badge ${getPercentageBadgeClass(student.percentage)}">${student.percentage.toFixed(1)}%</span></td>
                <td><span class="badge ${getGradeBadgeClass(student.grade)}">${escapeHtml(student.grade)}</span></td>
                <td><span class="badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}">${escapeHtml(student.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewStudentDetails('${escapeHtml(student.rollNo)}')" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        updatePagination();
        updateRecordInfo();
    }

    /**
     * Update pagination
     */
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
            </li>
        `;

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1); return false;">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a></li>`;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
            </li>
        `;

        pagination.innerHTML = paginationHtml;
    }

    /**
     * Update record info
     */
    function updateRecordInfo() {
        const recordInfo = document.getElementById('recordInfo');
        if (recordInfo) {
            const startIndex = (currentPage - 1) * itemsPerPage + 1;
            const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
            recordInfo.textContent = filteredData.length > 0 
                ? `Showing ${startIndex}-${endIndex} of ${filteredData.length} records`
                : 'No records to display';
        }
    }

    /**
     * Change page
     */
    window.changePage = function(page) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable();
        
        // Scroll to top of table
        document.querySelector('.table-responsive')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /**
     * View student details
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

        Toast.success('Data exported successfully!');
    }

    /**
     * Update statistics
     */
    function updateStatistics() {
        const totalStudents = filteredData.length;
        const avgScore = filteredData.reduce((sum, s) => sum + s.percentage, 0) / totalStudents || 0;
        const topPerformers = filteredData.filter(s => s.percentage >= 90).length;
        const needAttention = filteredData.filter(s => s.percentage < 60).length;

        // Update stat cards
        const statCards = document.querySelectorAll('.card h3');
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

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();
