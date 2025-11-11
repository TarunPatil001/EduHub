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
    const selectAllCheckbox = document.getElementById('selectAllCourses');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const selectedCountEl = document.getElementById('selectedCount');

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
        if (searchInput) searchInput.addEventListener('input', handleSearch);
        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (levelFilter) levelFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
        if (itemsPerPageSelect) itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
        if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', handleSelectAll);
        if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', handleBulkDelete);
    }

    // Handle Search
    function handleSearch() {
        applyFilters();
    }

    // Apply Filters
    function applyFilters() {
        if (!searchInput || !categoryFilter || !levelFilter || !statusFilter) {
            console.error('Filter elements not found');
            return;
        }

        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const level = levelFilter.value;
        const status = statusFilter.value;

        filteredCourses = allCourses.filter(course => {
            const matchesSearch = searchTerm === '' ||
                (course.name && course.name.toLowerCase().includes(searchTerm)) ||
                (course.code && course.code.toLowerCase().includes(searchTerm)) ||
                (course.teacher && course.teacher.toLowerCase().includes(searchTerm));

            const matchesCategory = category === 'all' || course.category === category;
            const matchesLevel = level === 'all' || course.level === level;
            const matchesStatus = status === 'all' || course.status === status;

            return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
        });

        // Reset to first page
        currentPage = 1;
        
        // Clear selections when filters change
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
        
        renderTable();
        renderPagination();
    }

    // Update Stats
    function updateStats() {
        if (!totalCoursesEl || !activeCoursesEl || !totalStudentsEl || !totalTeachersEl) {
            return;
        }

        const totalCourses = allCourses.length;
        const activeCourses = allCourses.filter(c => c && c.status === 'active').length;
        const totalCapacity = allCourses.reduce((sum, c) => sum + (c && c.maxStudents ? c.maxStudents : 0), 0);
        const uniqueTeachers = new Set(allCourses.filter(c => c && c.teacher).map(c => c.teacher)).size;

        totalCoursesEl.textContent = totalCourses;
        activeCoursesEl.textContent = activeCourses;
        totalStudentsEl.textContent = totalCapacity;
        totalTeachersEl.textContent = uniqueTeachers;
    }

    // Render Table
    function renderTable() {
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }

        const emptyState = document.getElementById('emptyState');
        const tableContainer = document.getElementById('coursesTableContainer');
        const paginationFooter = document.getElementById('paginationFooter');

        if (filteredCourses.length === 0) {
            // Show empty state, hide table and pagination
            if (emptyState) emptyState.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            if (paginationFooter) paginationFooter.style.display = 'none';
            
            updatePaginationInfo();
            return;
        }

        // Show table, hide empty state
        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'block';
        if (paginationFooter) paginationFooter.style.display = 'block';

        // Validate current page is within bounds
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        tableBody.innerHTML = paginatedCourses.map(course => {
            // Safely escape and validate all course properties
            const safeId = course.id || 0;
            const safeCode = escapeHtml(course.code || 'N/A');
            const safeName = escapeHtml(course.name || 'Unnamed Course');
            const safeCategory = course.category || 'unknown';
            const safeLevel = course.level || 'unknown';
            const safeDuration = escapeHtml(course.duration || 'N/A');
            const safeMaxStudents = course.maxStudents || 0;
            const safeFee = course.fee || 0;
            const safeMode = course.modeOfConduct || 'unknown';
            const safeTeacher = escapeHtml(course.teacher || 'Not Assigned');
            const safeStatus = course.status || 'inactive';

            return `
            <tr data-course-id="${safeId}">
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input course-checkbox" data-course-id="${safeId}">
                    </div>
                </td>
                <td><span class="course-code">${safeCode}</span></td>
                <td><span class="course-name">${safeName}</span></td>
                <td><span class="category-badge category-${safeCategory}">${capitalize(safeCategory)}</span></td>
                <td><span class="level-badge level-${safeLevel}">${capitalize(safeLevel)}</span></td>
                <td>${safeDuration}</td>
                <td>${safeMaxStudents}</td>
                <td>₹${safeFee.toLocaleString()}</td>
                <td><span class="mode-badge mode-${safeMode}">${capitalize(safeMode)}</span></td>
                <td>${formatDate(course.startDate)}</td>
                <td>${formatDate(course.endDate)}</td>
                <td>${safeTeacher}</td>
                <td><span class="status-badge status-${safeStatus}">${capitalize(safeStatus)}</span></td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary view-btn" onclick="viewCourse(${safeId})" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-btn" onclick="editCourse(${safeId})" title="Edit Course">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="handleDeleteCourse(${safeId})" title="Delete Course">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        // Add event listeners to checkboxes
        document.querySelectorAll('.course-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const row = this.closest('tr');
                
                if (this.checked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
                
                updateBulkDeleteButton();
                updateSelectAllState();
            });
        });

        // Update pagination info
        updatePaginationInfo();
        
        // Update bulk delete button to reflect current selection
        updateBulkDeleteButton();
        updateSelectAllState();
    }

    // Update Pagination Info
    function updatePaginationInfo() {
        const showingStartEl = document.getElementById('showingStart');
        const showingEndEl = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');

        if (!showingStartEl || !showingEndEl || !totalEntriesEl) {
            return;
        }

        if (filteredCourses.length === 0) {
            showingStartEl.textContent = '0';
            showingEndEl.textContent = '0';
            totalEntriesEl.textContent = '0';
            return;
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredCourses.length);

        showingStartEl.textContent = startItem.toString();
        showingEndEl.textContent = endItem.toString();
        totalEntriesEl.textContent = filteredCourses.length.toString();
    }

    // Render Pagination
    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            if (pageInfo) pageInfo.textContent = '';
            return;
        }

        // Ensure current page is valid
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredCourses.length);
        if (pageInfo) {
            pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredCourses.length} courses`;
        }

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
        if (!itemsPerPageSelect) return;

        const newItemsPerPage = parseInt(itemsPerPageSelect.value);
        if (isNaN(newItemsPerPage) || newItemsPerPage < 1) {
            console.error('Invalid items per page value');
            return;
        }

        // Calculate which item the user is currently viewing
        const currentFirstItem = (currentPage - 1) * itemsPerPage + 1;
        
        // Update items per page
        itemsPerPage = newItemsPerPage;
        
        // Calculate new page to maintain roughly the same position
        currentPage = Math.ceil(currentFirstItem / itemsPerPage);
        
        // Validate new page is within bounds
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }

        renderTable();
        renderPagination();
    }

    // Reset Filters
    function resetFilters() {
        // Clear search input
        if (searchInput) searchInput.value = '';
        
        // Reset dropdowns to default
        if (categoryFilter) categoryFilter.value = 'all';
        if (levelFilter) levelFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        
        // Reapply filters (which will show all courses)
        applyFilters();
        
        // Show toast notification
        if (typeof showToast === 'function') {
            showToast('Filters have been reset', 'success');
        }
    }

    // Capitalize
    function capitalize(str) {
        if (!str || typeof str !== 'string') return 'Unknown';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Format Date
    function formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return '-';
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Course Actions
    window.viewCourse = function(courseId) {
        const course = allCourses.find(c => c && c.id === courseId);
        if (!course) {
            if (typeof showToast === 'function') {
                showToast('Course not found', 'error');
            }
            return;
        }

        if (typeof showSuccessModal === 'function') {
            showSuccessModal({
                title: 'Course Details',
                message: `
                    <div style="text-align: left;">
                        <h4 style="color: #667eea; margin-bottom: 1rem;">${escapeHtml(course.name || 'N/A')}</h4>
                        <p><strong>Course Code:</strong> ${escapeHtml(course.code || 'N/A')}</p>
                        <p><strong>Category:</strong> ${capitalize(course.category)}</p>
                        <p><strong>Level:</strong> ${capitalize(course.level)}</p>
                        <p><strong>Duration:</strong> ${escapeHtml(course.duration || 'N/A')}</p>
                        <p><strong>Max Students:</strong> ${course.maxStudents || 0}</p>
                        <p><strong>Fee:</strong> ₹${(course.fee || 0).toLocaleString()}</p>
                        <p><strong>Mode of Conduct:</strong> ${capitalize(course.modeOfConduct)}</p>
                        <p><strong>Start Date:</strong> ${formatDate(course.startDate)}</p>
                        <p><strong>End Date:</strong> ${formatDate(course.endDate)}</p>
                        <p><strong>Teacher:</strong> ${escapeHtml(course.teacher || 'Not Assigned')}</p>
                        <p><strong>Status:</strong> ${capitalize(course.status)}</p>
                    </div>
                `
            });
        }
    };

    window.editCourse = function(courseId) {
        const course = allCourses.find(c => c && c.id === courseId);
        if (!course) {
            if (typeof showToast === 'function') {
                showToast('Course not found', 'error');
            }
            return;
        }

        // In production, redirect to edit page
        if (typeof showToast === 'function') {
            showToast(`Edit functionality for "${escapeHtml(course.name)}" will be implemented soon`, 'info');
        }
    };

    // Handle Select All Checkbox
    function handleSelectAll() {
        const checkboxes = document.querySelectorAll('.course-checkbox');
        const isChecked = selectAllCheckbox.checked;
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            const row = checkbox.closest('tr');
            
            if (isChecked) {
                if (row) row.classList.add('row-selected');
            } else {
                if (row) {
                    row.classList.remove('row-selected');
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
            }
        });
        
        updateBulkDeleteButton();
    }

    // Update Bulk Delete Button
    function updateBulkDeleteButton() {
        if (!bulkDeleteBtn || !selectedCountEl) return;
        
        // Count checked checkboxes directly from DOM
        const checkedCheckboxes = document.querySelectorAll('.course-checkbox:checked');
        const count = checkedCheckboxes.length;
        
        if (count > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            selectedCountEl.textContent = count;
        } else {
            bulkDeleteBtn.style.display = 'none';
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            }
        }
    }
    
    // Update Select All State
    function updateSelectAllState() {
        if (!selectAllCheckbox) return;
        
        const allCheckboxes = document.querySelectorAll('.course-checkbox');
        const checkedBoxes = document.querySelectorAll('.course-checkbox:checked');
        const count = checkedBoxes.length;
        
        if (count === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (count === allCheckboxes.length && allCheckboxes.length > 0) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    // Handle Bulk Delete
    function handleBulkDelete() {
        // Get checked course IDs directly from DOM
        const checkedCheckboxes = document.querySelectorAll('.course-checkbox:checked');
        const courseIds = Array.from(checkedCheckboxes)
            .map(cb => parseInt(cb.dataset.courseId))
            .filter(id => !isNaN(id));
        
        if (courseIds.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Please select courses to delete', 'warning');
            } else {
                alert('Please select courses to delete');
            }
            return;
        }

        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Delete Courses',
                message: `Are you sure you want to delete <strong>${courseIds.length} course(s)</strong>?<br><br>This action cannot be undone.`,
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                confirmClass: 'btn-danger',
                onConfirm: function() {
                    // Close the modal manually
                    closeConfirmationModal();
                    
                    // Remove courses from data
                    allCourses = allCourses.filter(course => course && !courseIds.includes(course.id));
                    
                    // Reapply filters to update filteredCourses
                    applyFilters();
                    
                    // Adjust current page if needed
                    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
                    if (currentPage > totalPages && totalPages > 0) {
                        currentPage = totalPages;
                    }
                    if (currentPage < 1 && filteredCourses.length > 0) {
                        currentPage = 1;
                    }
                    
                    // Update view
                    updateStats();
                    renderTable();
                    renderPagination();
                    
                    if (typeof showToast === 'function') {
                        showToast(`${courseIds.length} course(s) deleted successfully`, 'success');
                    }
                }
            });
        } else {
            // Fallback to confirm dialog
            if (confirm(`Are you sure you want to delete ${courseIds.length} course(s)? This action cannot be undone.`)) {
                allCourses = allCourses.filter(course => course && !courseIds.includes(course.id));
                applyFilters();
                updateStats();
                renderTable();
                renderPagination();
                alert(`${courseIds.length} course(s) deleted successfully`);
            }
        }
    }

    // Handle Single Delete
    window.handleDeleteCourse = function(courseId) {
        const course = allCourses.find(c => c && c.id === courseId);
        if (!course) {
            if (typeof showToast === 'function') {
                showToast('Course not found', 'error');
            }
            return;
        }

        if (typeof showConfirmationModal !== 'function') {
            if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                const index = allCourses.findIndex(c => c && c.id === courseId);
                if (index !== -1) {
                    allCourses.splice(index, 1);
                    applyFilters();
                    updateStats();
                    renderTable();
                    renderPagination();
                    alert(`Course deleted successfully`);
                }
            }
            return;
        }

        showConfirmationModal({
            title: 'Delete Course',
            message: `Are you sure you want to delete <strong>${escapeHtml(course.name)}</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            onConfirm: function() {
                // Close the modal manually first
                closeConfirmationModal();
                
                // STEP 1: Save the IDs of currently checked courses (excluding the one being deleted)
                const checkedCourseIds = Array.from(document.querySelectorAll('.course-checkbox:checked'))
                    .map(cb => parseInt(cb.dataset.courseId))
                    .filter(id => !isNaN(id) && id !== courseId);
                
                // STEP 2: Remove the course from data
                const index = allCourses.findIndex(c => c && c.id === courseId);
                if (index !== -1) {
                    const deletedCourseName = allCourses[index].name;
                    allCourses.splice(index, 1);
                    
                    // STEP 3: Reapply filters to update filteredCourses
                    applyFilters();
                    
                    // STEP 4: Check if current page is now empty and adjust if needed
                    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
                    if (currentPage > totalPages && totalPages > 0) {
                        currentPage = totalPages;
                    }
                    if (currentPage < 1 && filteredCourses.length > 0) {
                        currentPage = 1;
                    }
                    
                    // STEP 5: Update stats and re-render
                    updateStats();
                    renderTable();
                    renderPagination();
                    
                    // STEP 6: After DOM updates, restore the checked state of remaining courses
                    setTimeout(() => {
                        checkedCourseIds.forEach(id => {
                            const checkbox = document.querySelector(`.course-checkbox[data-course-id="${id}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                                const row = checkbox.closest('tr');
                                if (row) {
                                    row.classList.add('row-selected');
                                }
                            }
                        });
                        
                        // STEP 7: Update the button count to reflect the remaining checked items
                        updateBulkDeleteButton();
                        updateSelectAllState();
                    }, 100);
                    
                    if (typeof showToast === 'function') {
                        showToast(`Course "${escapeHtml(deletedCourseName)}" deleted successfully`, 'success');
                    }
                }
            }
        });
    };
    
    // Helper function to manually close confirmation modal
    function closeConfirmationModal() {
        const modalElement = document.getElementById('confirmationModal');
        if (!modalElement) return;
        
        // Try multiple methods to close the modal
        
        // Method 1: Use Bootstrap Modal instance
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
                return;
            }
        }
        
        // Method 2: Use stored global instance
        if (window.currentConfirmationModal) {
            try {
                window.currentConfirmationModal.hide();
                return;
            } catch (e) {
                console.log('Stored modal instance failed:', e);
            }
        }
        
        // Method 3: Manual DOM manipulation
        const backdrop = document.querySelector('.modal-backdrop');
        
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
        modalElement.removeAttribute('role');
        
        if (backdrop) {
            backdrop.classList.remove('show');
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 150);
        }
        
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
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
