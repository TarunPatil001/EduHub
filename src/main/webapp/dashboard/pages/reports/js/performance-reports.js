/**
 * Performance Reports JavaScript
 * Handles data visualization, filtering, and interactivity
 */

(function() {
    'use strict';

    // Chart instances
    let performanceTrendChart = null;
    let gradeDistributionChart = null;
    let subjectPerformanceChart = null;
    let attendanceCorrelationChart = null;
    let comparisonChart = null;

    // Sample data (replace with actual API calls)
    const sampleData = {
        statistics: {
            totalStudents: 450,
            avgPerformance: 76.5,
            topPerformers: 85,
            needAttention: 42
        },
        trends: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [
                {
                    label: 'Average Score',
                    data: [72, 75, 74, 78, 77, 80],
                    borderColor: '#0D6EFD',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Attendance %',
                    data: [85, 87, 86, 88, 89, 90],
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.4
                }
            ]
        },
        gradeDistribution: {
            labels: ['A+ (90-100)', 'A (80-89)', 'B (70-79)', 'C (60-69)', 'D (50-59)', 'F (<50)'],
            data: [85, 120, 145, 65, 25, 10],
            colors: ['#198754', '#0DCAF0', '#0D6EFD', '#FFC107', '#FD7E14', '#DC3545']
        },
        subjectPerformance: {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'English', 'Data Structures'],
            data: [78, 72, 75, 85, 80, 82]
        },
        topPerformers: [
            { rank: 1, name: 'Rajesh Kumar', department: 'Computer Science', score: 95.8 },
            { rank: 2, name: 'Priya Sharma', department: 'Electronics', score: 94.2 },
            { rank: 3, name: 'Amit Patel', department: 'Computer Science', score: 93.5 },
            { rank: 4, name: 'Sneha Reddy', department: 'Mechanical', score: 92.8 },
            { rank: 5, name: 'Vikram Singh', department: 'Civil', score: 91.5 }
        ],
        needAttention: [
            { name: 'Arjun Mehta', department: 'Electronics', score: 48.5 },
            { name: 'Kavita Jain', department: 'Mechanical', score: 52.3 },
            { name: 'Rohit Verma', department: 'Computer Science', score: 55.8 },
            { name: 'Anita Das', department: 'Civil', score: 57.2 }
        ]
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        initializeCharts();
        loadStatistics();
        loadTopPerformers();
        loadAttentionList();
        setupEventListeners();
    });

    /**
     * Initialize all charts
     */
    function initializeCharts() {
        initPerformanceTrendChart();
        initGradeDistributionChart();
        initSubjectPerformanceChart();
        initAttendanceCorrelationChart();
    }

    /**
     * Performance Trend Chart
     */
    function initPerformanceTrendChart() {
        const ctx = document.getElementById('performanceTrendChart');
        if (!ctx) return;

        performanceTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleData.trends.labels,
                datasets: sampleData.trends.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Grade Distribution Chart (Doughnut)
     */
    function initGradeDistributionChart() {
        const ctx = document.getElementById('gradeDistributionChart');
        if (!ctx) return;

        gradeDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sampleData.gradeDistribution.labels,
                datasets: [{
                    data: sampleData.gradeDistribution.data,
                    backgroundColor: sampleData.gradeDistribution.colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Subject-wise Performance Chart (Bar)
     */
    function initSubjectPerformanceChart() {
        const ctx = document.getElementById('subjectPerformanceChart');
        if (!ctx) return;

        subjectPerformanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sampleData.subjectPerformance.labels,
                datasets: [{
                    label: 'Average Score',
                    data: sampleData.subjectPerformance.data,
                    backgroundColor: [
                        'rgba(13, 110, 253, 0.8)',
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(13, 202, 240, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(111, 66, 193, 0.8)'
                    ],
                    borderColor: [
                        '#0D6EFD',
                        '#198754',
                        '#0DCAF0',
                        '#FFC107',
                        '#DC3545',
                        '#6F42C1'
                    ],
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Score: ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Attendance vs Performance Correlation Chart (Scatter)
     */
    function initAttendanceCorrelationChart() {
        const ctx = document.getElementById('attendanceCorrelationChart');
        if (!ctx) return;

        // Generate sample scatter data
        const scatterData = [];
        for (let i = 0; i < 50; i++) {
            const attendance = Math.random() * 40 + 60; // 60-100%
            const performance = attendance * 0.8 + Math.random() * 15; // Correlation with some variance
            scatterData.push({ x: attendance, y: Math.min(performance, 100) });
        }

        attendanceCorrelationChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Students',
                    data: scatterData,
                    backgroundColor: 'rgba(13, 110, 253, 0.6)',
                    borderColor: '#0D6EFD',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Attendance: ' + context.parsed.x.toFixed(1) + '%, Performance: ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Attendance %'
                        },
                        min: 0,
                        max: 100
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Performance %'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    /**
     * Load and display statistics
     */
    function loadStatistics() {
        // Animate counters
        animateCounter('statTotalStudents', 0, sampleData.statistics.totalStudents, 1000);
        animateCounter('statTopPerformers', 0, sampleData.statistics.topPerformers, 1000);
        animateCounter('statNeedAttention', 0, sampleData.statistics.needAttention, 1000);
        
        // Animate percentage
        animateCounter('statAvgPerformance', 0, sampleData.statistics.avgPerformance, 1000, true);

        // Animate changes with delay
        setTimeout(() => {
            const avgChange = document.getElementById('statAvgChange');
            if (avgChange) {
                avgChange.innerHTML = '<i class="bi bi-arrow-up-short"></i> <span class="trend-indicator up">+5.2%</span>';
            }
            
            const attentionChange = document.getElementById('statAttentionChange');
            if (attentionChange) {
                attentionChange.innerHTML = '<i class="bi bi-arrow-down-short"></i> <span class="trend-indicator down">-8%</span>';
            }
        }, 800);
    }

    /**
     * Animate counter from start to end value
     */
    function animateCounter(elementId, start, end, duration, isPercentage = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const counterElement = element.querySelector('.counter') || element;
        const increment = (end - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            counterElement.textContent = Math.floor(current) + (isPercentage && !counterElement.classList.contains('counter') ? '' : '');
        }, 16);
    }

    /**
     * Load top performers table
     */
    function loadTopPerformers() {
        const tbody = document.querySelector('#topPerformersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = sampleData.topPerformers.map(student => `
            <tr>
                <td>
                    <span class="rank-badge rank-${student.rank <= 3 ? student.rank : 'other'}">
                        ${student.rank}
                    </span>
                </td>
                <td class="fw-semibold">${student.name}</td>
                <td>${student.department}</td>
                <td>
                    <span class="score-display excellent">${student.score}%</span>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Load students needing attention
     */
    function loadAttentionList() {
        const tbody = document.querySelector('#attentionTable tbody');
        if (!tbody) return;

        tbody.innerHTML = sampleData.needAttention.map(student => `
            <tr>
                <td class="fw-semibold">${student.name}</td>
                <td>${student.department}</td>
                <td>
                    <span class="score-display poor">${student.score}%</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewStudentDetails('${student.name}')">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                this.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i>';
                setTimeout(() => {
                    location.reload();
                }, 500);
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                const modal = new bootstrap.Modal(document.getElementById('exportModal'));
                modal.show();
            });
        }

        // Confirm export
        const confirmExport = document.getElementById('confirmExport');
        if (confirmExport) {
            confirmExport.addEventListener('click', handleExport);
        }

        // Apply filters
        const applyFilters = document.getElementById('applyFilters');
        if (applyFilters) {
            applyFilters.addEventListener('click', applyFilterSettings);
        }

        // Trend period toggle
        document.querySelectorAll('input[name="trendPeriod"]').forEach(radio => {
            radio.addEventListener('change', updateTrendChart);
        });

        // Comparison tool
        const compareBy = document.getElementById('compareBy');
        if (compareBy) {
            compareBy.addEventListener('change', handleCompareByChange);
        }

        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', performComparison);
        }

        // Search functionality
        const searchStudents = document.getElementById('searchStudents');
        if (searchStudents) {
            searchStudents.addEventListener('input', handleSearch);
        }

        // Generate report
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', generateReport);
        }
    }

    /**
     * Handle export
     */
    function handleExport() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const includeCharts = document.getElementById('includeCharts').checked;
        const includeStats = document.getElementById('includeStats').checked;
        const includeDetails = document.getElementById('includeDetails').checked;

        console.log('Exporting report...', { format, includeCharts, includeStats, includeDetails });

        // Simulate export
        showToast('Success', `Report exported as ${format.toUpperCase()}`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
    }

    /**
     * Apply filter settings
     */
    function applyFilterSettings() {
        const filters = {
            department: document.getElementById('filterDepartment').value,
            batch: document.getElementById('filterBatch').value,
            semester: document.getElementById('filterSemester').value,
            course: document.getElementById('filterCourse').value,
            period: document.getElementById('filterPeriod').value
        };

        console.log('Applying filters:', filters);
        showToast('Info', 'Filters applied successfully', 'info');
        
        // Reload data with filters (implement API call here)
    }

    /**
     * Update trend chart based on period selection
     */
    function updateTrendChart(event) {
        const period = event.target.value;
        console.log('Updating trend chart for period:', period);
        
        // Update chart data based on period (implement actual logic)
        showToast('Info', `Chart updated for ${period} view`, 'info');
    }

    /**
     * Handle comparison type change
     */
    function handleCompareByChange(event) {
        const compareItems = document.getElementById('compareItems');
        const compareBtn = document.getElementById('compareBtn');
        const type = event.target.value;

        if (!type) {
            compareItems.disabled = true;
            compareBtn.disabled = true;
            return;
        }

        compareItems.disabled = false;
        compareBtn.disabled = false;

        // Populate comparison items based on type
        const options = {
            'department': ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'MBA'],
            'batch': ['2025-26', '2024-25', '2023-24', '2022-23'],
            'semester': ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
            'course': ['Mathematics', 'Physics', 'Programming', 'Data Structures'],
            'students': ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy']
        };

        compareItems.innerHTML = (options[type] || []).map(item => 
            `<option value="${item}">${item}</option>`
        ).join('');
    }

    /**
     * Perform comparison
     */
    function performComparison() {
        const compareBy = document.getElementById('compareBy').value;
        const selectedItems = Array.from(document.getElementById('compareItems').selectedOptions).map(o => o.value);

        if (selectedItems.length < 2) {
            showToast('Warning', 'Please select at least 2 items to compare', 'warning');
            return;
        }

        document.getElementById('comparisonResult').style.display = 'block';

        // Generate comparison chart
        if (comparisonChart) {
            comparisonChart.destroy();
        }

        const ctx = document.getElementById('comparisonChart');
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: selectedItems,
                datasets: [{
                    label: 'Average Performance',
                    data: selectedItems.map(() => Math.random() * 30 + 60),
                    backgroundColor: 'rgba(13, 110, 253, 0.6)',
                    borderColor: '#0D6EFD',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => value + '%'
                        }
                    }
                }
            }
        });
    }

    /**
     * Handle search
     */
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        // Implement search logic
    }

    /**
     * Generate custom report
     */
    function generateReport() {
        showToast('Info', 'Generating custom report...', 'info');
        // Implement report generation
    }

    /**
     * Show toast notification
     */
    function showToast(title, message, type = 'info') {
        // Create toast notification (requires toast component)
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        
        // You can also use Bootstrap toast if available
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'primary'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}:</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Show notification in console for now
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    }

    /**
     * Load detailed performance records
     */
    function loadPerformanceRecords() {
        const tbody = document.querySelector('#performanceTable tbody');
        if (!tbody) return;

        // Sample performance records
        const records = generateSampleRecords(20);
        
        if (records.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="text-center py-5">
                        <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
                        <p class="text-muted mt-2 mb-0">No performance records found</p>
                        <small class="text-muted">Apply filters or refresh data to view records</small>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = records.map((record, index) => `
            <tr>
                <td><input type="checkbox" class="form-check-input"></td>
                <td>${record.rollNo}</td>
                <td>
                    <div class="student-name">
                        <div class="student-avatar">${record.name.charAt(0)}</div>
                        <span class="fw-semibold">${record.name}</span>
                    </div>
                </td>
                <td>${record.department}</td>
                <td>${record.batch}</td>
                <td>${record.semester}</td>
                <td>
                    <span class="score-display ${getScoreClass(record.percentage)}">${record.percentage}%</span>
                    <div class="progress mt-1" style="height: 4px;">
                        <div class="progress-bar bg-${getScoreClass(record.percentage) === 'excellent' ? 'success' : getScoreClass(record.percentage) === 'good' ? 'info' : getScoreClass(record.percentage) === 'average' ? 'warning' : 'danger'}" 
                             style="width: ${record.percentage}%"></div>
                    </div>
                </td>
                <td><span class="badge bg-${getGradeBadgeClass(record.grade)}">${record.grade}</span></td>
                <td>
                    <span class="${record.attendance >= 75 ? 'text-success' : 'text-danger'} fw-semibold">
                        ${record.attendance}%
                    </span>
                </td>
                <td>
                    <span class="performance-badge ${getPerformanceStatus(record.percentage)}">
                        ${getPerformanceStatus(record.percentage)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudentDetails('${record.name}')" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="downloadReport('${record.rollNo}')" title="Download Report">
                        <i class="bi bi-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Update record count
        document.getElementById('recordsShown').textContent = records.length;
        document.getElementById('recordsTotal').textContent = records.length;
    }

    /**
     * Generate sample records
     */
    function generateSampleRecords(count) {
        const names = ['Rahul Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 
                       'Ananya Das', 'Rohan Gupta', 'Kavya Iyer', 'Arjun Mehta', 'Ishita Joshi',
                       'Karthik Nair', 'Divya Pillai', 'Aditya Verma', 'Sanya Kapoor', 'Varun Rao'];
        const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'MBA'];
        const batches = ['2024-25', '2023-24', '2022-23'];
        const grades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
        
        const records = [];
        for (let i = 0; i < count; i++) {
            const percentage = Math.floor(Math.random() * 50 + 40);
            records.push({
                rollNo: `CS${2024}${String(i + 1).padStart(3, '0')}`,
                name: names[i % names.length],
                department: departments[Math.floor(Math.random() * departments.length)],
                batch: batches[Math.floor(Math.random() * batches.length)],
                semester: Math.floor(Math.random() * 8 + 1),
                percentage: percentage,
                grade: getGradeFromPercentage(percentage),
                attendance: Math.floor(Math.random() * 40 + 60)
            });
        }
        return records;
    }

    /**
     * Get grade from percentage
     */
    function getGradeFromPercentage(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    }

    /**
     * Get score class based on percentage
     */
    function getScoreClass(percentage) {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 60) return 'average';
        return 'poor';
    }

    /**
     * Get performance status
     */
    function getPerformanceStatus(percentage) {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 60) return 'average';
        return 'poor';
    }

    /**
     * Get grade badge class
     */
    function getGradeBadgeClass(grade) {
        const gradeMap = {
            'A+': 'success',
            'A': 'info',
            'B+': 'primary',
            'B': 'primary',
            'C': 'warning',
            'D': 'warning',
            'F': 'danger'
        };
        return gradeMap[grade] || 'secondary';
    }

    // Make functions globally accessible
    window.viewStudentDetails = function(studentName) {
        const modal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
        
        // Update modal content with student details
        const modalBody = document.querySelector('#studentDetailModal .modal-body');
        modalBody.innerHTML = `
            <div class="student-detail-view">
                <div class="text-center mb-4">
                    <div class="student-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                        ${studentName.charAt(0)}
                    </div>
                    <h5 class="mb-1">${studentName}</h5>
                    <p class="text-muted">Computer Science • Batch 2024-25</p>
                </div>
                
                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <div class="text-center p-3 border rounded">
                            <h3 class="mb-1 text-success">85.5%</h3>
                            <small class="text-muted">Overall Score</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="text-center p-3 border rounded">
                            <h3 class="mb-1 text-info">92%</h3>
                            <small class="text-muted">Attendance</small>
                        </div>
                    </div>
                </div>
                
                <h6 class="mb-3">Subject-wise Performance</h6>
                <div class="subject-performance">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Mathematics</span>
                        <span class="fw-semibold">88%</span>
                    </div>
                    <div class="progress mb-3" style="height: 6px;">
                        <div class="progress-bar bg-success" style="width: 88%"></div>
                    </div>
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span>Programming</span>
                        <span class="fw-semibold">92%</span>
                    </div>
                    <div class="progress mb-3" style="height: 6px;">
                        <div class="progress-bar bg-success" style="width: 92%"></div>
                    </div>
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span>Data Structures</span>
                        <span class="fw-semibold">85%</span>
                    </div>
                    <div class="progress mb-3" style="height: 6px;">
                        <div class="progress-bar bg-info" style="width: 85%"></div>
                    </div>
                </div>
            </div>
        `;
        
        modal.show();
    };

    window.downloadReport = function(rollNo) {
        showToast('Success', `Downloading report for ${rollNo}`, 'success');
        console.log('Downloading report for:', rollNo);
    };

    // Initialize performance records on load
    document.addEventListener('DOMContentLoaded', function() {
        // Load performance records after other initializations
        setTimeout(loadPerformanceRecords, 500);
    });

})();
