// All Courses Page - Complete Implementation
(function() {
    'use strict';

    // State
    let allCourses = [];
    let filteredCourses = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalItems = 0;

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
        bindEvents();
        fetchCourses();
        fetchStats(); // Fetch stats separately
        handleURLParameters(); // Handle URL parameters for notifications
    }

    // Fetch Stats from API
    function fetchStats() {
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        // Add timestamp to prevent caching
        const apiUrl = `${basePath}/api/courses/stats?t=${new Date().getTime()}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch stats');
                return response.json();
            })
            .then(data => {
                if (totalCoursesEl) totalCoursesEl.textContent = data.totalCourses || 0;
                if (activeCoursesEl) activeCoursesEl.textContent = data.activeCourses || 0;
                if (totalStudentsEl) totalStudentsEl.textContent = data.totalStudents || 0;
                if (totalTeachersEl) totalTeachersEl.textContent = data.totalTeachers || 0;
            })
            .catch(error => {
                console.error('Error fetching stats:', error);
            });
    }

    // Fetch Courses from API
    function fetchCourses(page = 1, limit = 10) {
        // Use contextPath defined in JSP if available, otherwise fallback to relative path logic
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        // Get filter values
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const level = levelFilter ? levelFilter.value : 'all';
        const status = statusFilter ? statusFilter.value : 'all';
        
        const queryParams = new URLSearchParams({
            page: page,
            limit: limit,
            search: searchTerm,
            category: category,
            level: level,
            status: status,
            t: new Date().getTime() // Prevent caching
        });
        
        const apiUrl = `${basePath}/api/courses/list?${queryParams.toString()}`;

        console.log('Fetching courses from:', apiUrl);

        fetch(apiUrl)
            .then(response => {
                console.log('Response status:', response.status);
                if (response.status === 401) {
                    // Session expired or not logged in
                    window.location.href = `${basePath}/public/login.jsp?error=session_expired`;
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Courses data received:', data);
                
                // Handle new response structure
                if (data.courses && data.pagination) {
                    allCourses = data.courses;
                    currentPage = data.pagination.currentPage;
                    itemsPerPage = data.pagination.itemsPerPage;
                    totalItems = data.pagination.totalItems;
                } else {
                    // Fallback for backward compatibility or if structure is different
                    allCourses = Array.isArray(data) ? data : [];
                    totalItems = allCourses.length;
                }
                
                filteredCourses = [...allCourses];
                // updateStats(); // Removed client-side stats update
                renderTable();
                renderPagination();
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                
                // Don't show toast if we're redirecting
                if (error.message === 'Unauthorized') return;

                if (typeof toast !== 'undefined') {
                    toast.error(`Failed to load courses: ${error.message}`);
                }
                
                // Show empty state if fetch fails
                const emptyState = document.getElementById('emptyState');
                const tableContainer = document.getElementById('coursesTableContainer');
                const paginationFooter = document.getElementById('paginationFooter');
                
                if (emptyState) emptyState.style.display = 'block';
                if (tableContainer) tableContainer.style.display = 'none';
                if (paginationFooter) paginationFooter.style.display = 'none';
            });
    }
    
    // Handle URL Parameters for Toast Notifications
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Success messages
        if (urlParams.has('success')) {
            const successType = urlParams.get('success');
            
            if (successType === 'created') {
                toast.success('Course created successfully!');
            } else if (successType === 'updated') {
                toast.success('Course updated successfully!');
            } else if (successType === 'deleted') {
                toast.success('Course deleted successfully!');
            } else if (successType === 'published') {
                toast.success('Course published successfully!');
            }
            
            // Clean URL
            urlParams.delete('success');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);

            // Update stats immediately as data has changed
            fetchStats();
        }
        
        // Error messages
        if (urlParams.has('error')) {
            const errorType = urlParams.get('error');
            
            if (errorType === 'notfound') {
                toast.error('Course not found');
            } else if (errorType === 'failed') {
                toast.error('Operation failed. Please try again.');
            } else if (errorType === 'duplicate') {
                toast.error('Course with this code already exists');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            
            // Clean URL
            urlParams.delete('error');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
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
        // Debounce search to avoid too many requests
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    }

    // Apply Filters
    function applyFilters() {
        // Reset to first page when filters change
        currentPage = 1;
        
        // Clear selections when filters change
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
        
        fetchCourses(currentPage, itemsPerPage);
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

        // With server-side pagination, filteredCourses IS the current page data
        // No need to slice
        const paginatedCourses = filteredCourses;

        tableBody.innerHTML = paginatedCourses.map(course => {
            // Safely escape and validate all course properties
            const safeId = course.id || 0;
            const safeCode = escapeHtml(course.code || 'N/A');
            const safeName = escapeHtml(course.name || 'Unnamed Course');
            const safeCategory = course.category || 'unknown';
            const safeLevel = course.level || 'unknown';
            const safeDuration = escapeHtml(course.duration || 'N/A');
            const safeFee = course.fee || 0;
            const safeStatus = course.status || 'inactive';
            const safeCertificate = course.certificateOffered ? 'Yes' : 'No';
            
            // Generate class names (lowercase and hyphenated)
            const categoryClass = safeCategory.toLowerCase().replace(/\s+/g, '-');
            const levelClass = safeLevel.toLowerCase().replace(/\s+/g, '-');
            const statusClass = safeStatus.toLowerCase().replace(/\s+/g, '-');

            return `
            <tr data-course-id="${safeId}">
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input course-checkbox" data-course-id="${safeId}">
                    </div>
                </td>
                <td><span class="course-code">${safeCode}</span></td>
                <td><span class="course-name">${safeName}</span></td>
                <td><span class="category-badge category-${categoryClass}">${capitalize(safeCategory)}</span></td>
                <td><span class="level-badge level-${levelClass}">${capitalize(safeLevel)}</span></td>
                <td>${safeDuration}</td>
                <td>₹${safeFee.toLocaleString()}</td>
                <td>${safeCertificate}</td>
                <td><span class="status-badge status-${statusClass}">${capitalize(safeStatus)}</span></td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm view-btn" onclick="viewCourse('${safeId}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-btn" onclick="editCourse('${safeId}')" title="Edit Course">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="handleDeleteCourse('${safeId}')" title="Delete Course">
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
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        showingStartEl.textContent = startItem.toString();
        showingEndEl.textContent = endItem.toString();
        totalEntriesEl.textContent = totalItems.toString();
    }

    // Render Pagination
    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        if (pageInfo) {
            pageInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} courses`;
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
        paginationContainer.innerHTML = paginationHTML;

        paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.disabled || this.classList.contains('disabled')) return;
                
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
        fetchCourses(page, itemsPerPage);
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

        itemsPerPage = newItemsPerPage;
        currentPage = 1; // Reset to first page
        
        fetchCourses(currentPage, itemsPerPage);
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
        if (typeof toast !== 'undefined') {
            toast.success('Filters have been reset');
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
            if (typeof toast !== 'undefined') {
                toast.error('Course not found');
            }
            return;
        }

        const safeCategory = course.category || 'unknown';
        const safeLevel = course.level || 'unknown';
        const safeStatus = course.status || 'inactive';
        
        const categoryClass = safeCategory.toLowerCase().replace(/\s+/g, '-');
        const levelClass = safeLevel.toLowerCase().replace(/\s+/g, '-');
        const statusClass = safeStatus.toLowerCase().replace(/\s+/g, '-');

        if (typeof showDetailsModal === 'function') {
            showDetailsModal({
                title: 'Course Details',
                size: 'modal-lg',
                content: `
                    <div class="course-details-container">
                        <!-- Compact Header -->
                        <div class="compact-header">
                            <div class="compact-title">
                                <h3>${escapeHtml(course.name || 'N/A')}</h3>
                                <span class="compact-code"><i class="bi bi-upc-scan me-2"></i>${escapeHtml(course.code || 'N/A')}</span>
                            </div>
                            <span class="status-badge status-${statusClass} px-3 py-2" style="font-size: 0.85rem;">
                                ${capitalize(safeStatus)}
                            </span>
                        </div>

                        <!-- Detail Grid -->
                        <div class="detail-grid">
                            <!-- Category -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-primary">
                                    <i class="bi bi-folder2-open"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Category</div>
                                    <div class="detail-value">
                                        <span class="category-badge category-${categoryClass} border-0 p-0 bg-transparent text-dark">
                                            ${capitalize(safeCategory)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Level -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-info">
                                    <i class="bi bi-bar-chart"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Level</div>
                                    <div class="detail-value">
                                        <span class="level-badge level-${levelClass} border-0 p-0 bg-transparent text-dark">
                                            ${capitalize(safeLevel)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Duration -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-warning">
                                    <i class="bi bi-clock"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Duration</div>
                                    <div class="detail-value">${escapeHtml(course.duration || 'N/A')}</div>
                                </div>
                            </div>

                            <!-- Fee -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-success">
                                    <i class="bi bi-currency-rupee"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Course Fee</div>
                                    <div class="detail-value">₹${(course.fee || 0).toLocaleString()}</div>
                                </div>
                            </div>

                            <!-- Certificate -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-danger">
                                    <i class="bi bi-award"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Certificate</div>
                                    <div class="detail-value ${course.certificateOffered ? 'text-success' : 'text-muted'}">
                                        ${course.certificateOffered ? 'Available' : 'Not Available'}
                                    </div>
                                </div>
                            </div>

                            <!-- Status (Redundant but fills grid) -->
                            <div class="detail-card">
                                <div class="detail-icon-box text-secondary">
                                    <i class="bi bi-activity"></i>
                                </div>
                                <div class="detail-info">
                                    <div class="detail-label">Current Status</div>
                                    <div class="detail-value">${capitalize(safeStatus)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
        } else if (typeof showSuccessModal === 'function') {
            // Fallback to old modal if new one isn't available yet (caching issues)
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
            if (typeof toast !== 'undefined') {
                toast.error('Course not found');
            }
            return;
        }

        // Use contextPath defined in JSP if available, otherwise fallback to relative path logic
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        window.location.href = `${basePath}/dashboard/pages/courses/edit-course.jsp?id=${courseId}`;
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

        // Provide feedback to user
        if (isChecked && checkboxes.length > 0) {
            if (typeof toast !== 'undefined') {
                toast.info(`Selected all ${checkboxes.length} courses on this page`);
            }
        }
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
            .map(cb => cb.dataset.courseId)
            .filter(id => id);
        
        if (courseIds.length === 0) {
            if (typeof toast !== 'undefined') {
                toast.error('Please select courses to delete');
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
                    
                    // Use contextPath defined in JSP if available, otherwise fallback to relative path logic
                    const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
                    const apiUrl = `${basePath}/api/courses/delete`;
                    
                    // Show loading state if possible, or just proceed
                    
                    fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `ids=${courseIds.join(',')}`
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            // Re-fetch courses to update the list and pagination
                            fetchCourses(currentPage, itemsPerPage);
                            // Update stats immediately
                            fetchStats();
                            
                            if (typeof toast !== 'undefined') {
                                toast.success(data.message || 'Courses deleted successfully');
                            }
                        } else {
                            throw new Error(data.message || 'Failed to delete courses');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting courses:', error);
                        if (typeof toast !== 'undefined') {
                            toast.error('Failed to delete courses. Please try again.');
                        } else {
                            alert('Failed to delete courses. Please try again.');
                        }
                    });
                }
            });
        } else {
            // Fallback to confirm dialog
            if (confirm('Are you sure you want to delete ' + courseIds.length + ' course(s)? This action cannot be undone.')) {
                // Use contextPath defined in JSP if available, otherwise fallback to relative path logic
                const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
                const apiUrl = `${basePath}/api/courses/delete`;

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `ids=${courseIds.join(',')}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchCourses(currentPage, itemsPerPage);
                        fetchStats(); // Update stats immediately
                        if (typeof toast !== 'undefined') {
                            toast.success(data.message);
                        } else {
                            alert(data.message);
                        }
                    } else {
                        alert('Failed to delete courses');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting courses');
                });
            }
        }
    }



    // Handle Single Delete
    window.handleDeleteCourse = function(courseId) {
        const course = allCourses.find(c => c && String(c.id) === String(courseId));
        if (!course) {
            if (typeof toast !== 'undefined') {
                toast.error('Course not found');
            }
            return;
        }

        const deleteAction = function() {
            // Use contextPath defined in JSP if available, otherwise fallback to relative path logic
            const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
            const apiUrl = `${basePath}/api/courses/delete`;

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `ids=${courseId}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Re-fetch courses to update the list and pagination
                    fetchCourses(currentPage, itemsPerPage);
                    // Update stats immediately
                    fetchStats();
                    
                    if (typeof toast !== 'undefined') {
                        toast.success(data.message || `Course deleted successfully`);
                    } else {
                        alert(data.message || 'Course deleted successfully');
                    }
                } else {
                    throw new Error(data.message || 'Failed to delete course');
                }
            })
            .catch(error => {
                console.error('Error deleting course:', error);
                if (typeof toast !== 'undefined') {
                    toast.error('Failed to delete course. Please try again.');
                } else {
                    alert('Failed to delete course. Please try again.');
                }
            });
        };

        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Delete Course',
                message: `Are you sure you want to delete <strong>${escapeHtml(course.name)}</strong>?<br><br>This action cannot be undone.`,
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                confirmClass: 'btn-danger',
                onConfirm: function() {
                    closeConfirmationModal();
                    deleteAction();
                }
            });
        } else {
            if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                deleteAction();
            }
        }
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
    // - showToast() for toast notifications (deprecated, use toast.success/error)

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
