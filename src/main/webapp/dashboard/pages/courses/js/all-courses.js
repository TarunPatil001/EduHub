// All Courses Page - Complete Implementation
(function() {
    'use strict';

    // Demo Data - Replace with actual API calls
    const demoData = [
        { id: 1, code: 'CS-101', name: 'Computer Science', category: 'technology', level: 'beginner', duration: '6 months', maxStudents: 40, fee: 5000, modeOfConduct: 'online', startDate: '2025-12-01', endDate: '2026-06-01', teacher: 'Dr. Rajesh Kumar', status: 'active' },
        { id: 2, code: 'MATH-201', name: 'Advanced Mathematics', category: 'mathematics', level: 'advanced', duration: '5 months', maxStudents: 30, fee: 6000, modeOfConduct: 'offline', startDate: '2025-11-15', endDate: '2026-04-15', teacher: 'Prof. Anjali Singh', status: 'active' },
        { id: 3, code: 'PHY-101', name: 'Physics Fundamentals', category: 'science', level: 'beginner', duration: '6 months', maxStudents: 50, fee: 5500, modeOfConduct: 'hybrid', startDate: '2025-12-10', endDate: '2026-06-10', teacher: 'Dr. Priya Sharma', status: 'active' },
        { id: 4, code: 'ENG-101', name: 'English Literature', category: 'arts', level: 'intermediate', duration: '4 months', maxStudents: 40, fee: 4000, modeOfConduct: 'online', startDate: '2025-11-20', endDate: '2026-03-20', teacher: 'Ms. Kavita Desai', status: 'active' },
        { id: 5, code: 'CHEM-201', name: 'Organic Chemistry', category: 'science', level: 'advanced', duration: '6 months', maxStudents: 30, fee: 7000, modeOfConduct: 'offline', startDate: '2025-12-05', endDate: '2026-06-05', teacher: 'Dr. Suresh Reddy', status: 'active' },
        { id: 6, code: 'ACC-101', name: 'Accounting Principles', category: 'commerce', level: 'beginner', duration: '5 months', maxStudents: 40, fee: 4500, modeOfConduct: 'hybrid', startDate: '2025-11-25', endDate: '2026-04-25', teacher: 'CA. Neha Agarwal', status: 'active' },
        { id: 7, code: 'HIN-101', name: 'Hindi Language', category: 'language', level: 'beginner', duration: '4 months', maxStudents: 30, fee: 3000, modeOfConduct: 'online', startDate: '2025-12-01', endDate: '2026-04-01', teacher: 'Mrs. Sunita Verma', status: 'active' },
        { id: 8, code: 'BIO-201', name: 'Biology Advanced', category: 'science', level: 'advanced', duration: '6 months', maxStudents: 40, fee: 6500, modeOfConduct: 'offline', startDate: '2025-12-15', endDate: '2026-06-15', teacher: 'Dr. Sonal Kapoor', status: 'active' },
        { id: 9, code: 'ECO-101', name: 'Economics', category: 'commerce', level: 'intermediate', duration: '5 months', maxStudents: 50, fee: 5000, modeOfConduct: 'hybrid', startDate: '2025-11-18', endDate: '2026-04-18', teacher: 'Dr. Amit Verma', status: 'active' },
        { id: 10, code: 'ART-101', name: 'Fine Arts', category: 'arts', level: 'beginner', duration: '3 months', maxStudents: 20, fee: 3500, modeOfConduct: 'offline', startDate: '2025-11-10', endDate: '2026-02-10', teacher: 'Ms. Pooja Iyer', status: 'inactive' },
        { id: 11, code: 'HIST-201', name: 'World History', category: 'arts', level: 'intermediate', duration: '5 months', maxStudents: 30, fee: 4000, modeOfConduct: 'online', startDate: '2025-12-01', endDate: '2026-05-01', teacher: 'Mr. Ramesh Kumar', status: 'active' },
        { id: 12, code: 'GEO-101', name: 'Geography', category: 'science', level: 'beginner', duration: '4 months', maxStudents: 40, fee: 4500, modeOfConduct: 'hybrid', startDate: '2025-11-22', endDate: '2026-03-22', teacher: 'Dr. Meera Nair', status: 'active' }
    ];

    // State
    let allCourses = [...demoData];
    let filteredCourses = [];
    let currentPage = 1;
    let itemsPerPage = 10;

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const tableBody = document.getElementById('coursesTableBody');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const paginationContainer = document.getElementById('paginationContainer');
    const pageInfo = document.getElementById('pageInfo');

    // Stats elements
    const totalCoursesEl = document.getElementById('totalCourses');
    const activeCoursesEl = document.getElementById('activeCourses');
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalTeachersEl = document.getElementById('totalTeachers');

    // Initialize
    function init() {
        filteredCourses = [...allCourses];
        bindEvents();
        updateStats();
        renderTable();
        renderPagination();
    }

    // Bind Events
    function bindEvents() {
        searchInput.addEventListener('input', handleSearch);
        categoryFilter.addEventListener('change', applyFilters);
        levelFilter.addEventListener('change', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    }

    // Handle Search
    function handleSearch() {
        applyFilters();
    }

    // Apply Filters
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const level = levelFilter.value;
        const status = statusFilter.value;

        filteredCourses = allCourses.filter(course => {
            const matchesSearch = searchTerm === '' ||
                course.name.toLowerCase().includes(searchTerm) ||
                course.code.toLowerCase().includes(searchTerm) ||
                course.teacher.toLowerCase().includes(searchTerm);

            const matchesCategory = category === 'all' || course.category === category;
            const matchesLevel = level === 'all' || course.level === level;
            const matchesStatus = status === 'all' || course.status === status;

            return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // Update Stats
    function updateStats() {
        const totalCourses = allCourses.length;
        const activeCourses = allCourses.filter(c => c.status === 'active').length;
        const totalCapacity = allCourses.reduce((sum, c) => sum + c.maxStudents, 0);
        const uniqueTeachers = new Set(allCourses.map(c => c.teacher)).size;

        totalCoursesEl.textContent = totalCourses;
        activeCoursesEl.textContent = activeCourses;
        totalStudentsEl.textContent = totalCapacity;
        totalTeachersEl.textContent = uniqueTeachers;
    }

    // Render Table
    function renderTable() {
        if (filteredCourses.length === 0) {
            showEmptyState();
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        tableBody.innerHTML = paginatedCourses.map(course => `
            <tr>
                <td><span class="course-code">${course.code}</span></td>
                <td><span class="course-name">${course.name}</span></td>
                <td><span class="category-badge category-${course.category}">${capitalize(course.category)}</span></td>
                <td><span class="level-badge level-${course.level}">${capitalize(course.level)}</span></td>
                <td>${course.duration}</td>
                <td>${course.maxStudents}</td>
                <td>₹${course.fee.toLocaleString()}</td>
                <td><span class="mode-badge mode-${course.modeOfConduct}">${capitalize(course.modeOfConduct)}</span></td>
                <td>${formatDate(course.startDate)}</td>
                <td>${formatDate(course.endDate)}</td>
                <td>${course.teacher}</td>
                <td><span class="status-badge status-${course.status}">${capitalize(course.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewCourse(${course.id})" title="View Details">
                            <i class="bi bi-eye-fill"></i>
                        </button>
                        <button class="action-btn edit" onclick="editCourse(${course.id})" title="Edit Course">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteCourse(${course.id})" title="Delete Course">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Show Empty State
    function showEmptyState() {
        tableBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="13">
                    <div class="empty-content">
                        <i class="bi bi-inbox"></i>
                        <p>No courses found</p>
                    </div>
                </td>
            </tr>
        `;
        paginationContainer.innerHTML = '';
        pageInfo.textContent = '';
    }

    // Render Pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            pageInfo.textContent = '';
            return;
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredCourses.length);
        pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredCourses.length} courses`;

        let paginationHTML = '<ul class="pagination">';

        // Previous button
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

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

    // Go to Page
    function goToPage(page) {
        currentPage = page;
        renderTable();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle Items Per Page Change
    function handleItemsPerPageChange() {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // Reset Filters
    function resetFilters() {
        // Clear search input
        searchInput.value = '';
        
        // Reset dropdowns to default
        categoryFilter.value = 'all';
        levelFilter.value = 'all';
        statusFilter.value = 'all';
        
        // Reapply filters (which will show all courses)
        applyFilters();
        
        // Show toast notification
        showToast('Filters have been reset', 'success');
    }

    // Capitalize
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Format Date
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Course Actions
    window.viewCourse = function(courseId) {
        const course = allCourses.find(c => c.id === courseId);
        if (!course) return;

        showSuccessModal({
            title: 'Course Details',
            message: `
                <div style="text-align: left;">
                    <h4 style="color: #667eea; margin-bottom: 1rem;">${course.name}</h4>
                    <p><strong>Course Code:</strong> ${course.code}</p>
                    <p><strong>Category:</strong> ${capitalize(course.category)}</p>
                    <p><strong>Level:</strong> ${capitalize(course.level)}</p>
                    <p><strong>Duration:</strong> ${course.duration}</p>
                    <p><strong>Max Students:</strong> ${course.maxStudents}</p>
                    <p><strong>Fee:</strong> ₹${course.fee.toLocaleString()}</p>
                    <p><strong>Mode of Conduct:</strong> ${capitalize(course.modeOfConduct)}</p>
                    <p><strong>Start Date:</strong> ${formatDate(course.startDate)}</p>
                    <p><strong>End Date:</strong> ${formatDate(course.endDate)}</p>
                    <p><strong>Teacher:</strong> ${course.teacher}</p>
                    <p><strong>Status:</strong> ${capitalize(course.status)}</p>
                </div>
            `
        });
    };

    window.editCourse = function(courseId) {
        const course = allCourses.find(c => c.id === courseId);
        if (!course) return;

        // In production, redirect to edit page
        showToast(`Edit functionality for "${course.name}" will be implemented soon`, 'info');
    };

    window.deleteCourse = function(courseId) {
        const course = allCourses.find(c => c.id === courseId);
        if (!course) return;

        showConfirmationModal({
            title: 'Delete Course',
            message: `Are you sure you want to delete <strong>"${course.name}"</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            onConfirm: function() {
                const index = allCourses.findIndex(c => c.id === courseId);
                if (index !== -1) {
                    allCourses.splice(index, 1);
                    applyFilters();
                    updateStats();
                    showToast(`Course "${course.name}" deleted successfully`, 'success');
                }
            }
        });
    };

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
