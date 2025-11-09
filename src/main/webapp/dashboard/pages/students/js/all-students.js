/**
 * All Students Page JavaScript
 * Handles filtering, searching, pagination, and student management
 */

(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const entriesPerPage = document.getElementById('entriesPerPage');
    const resetFilters = document.getElementById('resetFilters');
    const selectAll = document.getElementById('selectAll');
    const studentsTable = document.getElementById('studentsTable');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const exportBtn = document.getElementById('exportBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

    // State
    let currentPage = 1;
    let filteredStudents = [];
    let allRows = [];

    // Initialize
    function init() {
        allRows = Array.from(studentsTable.querySelectorAll('tbody tr'));
        filteredStudents = [...allRows];
        
        attachEventListeners();
        updatePagination();
    }

    // Event Listeners
    function attachEventListeners() {
        // Search
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Filters
        if (courseFilter) {
            courseFilter.addEventListener('change', handleFilter);
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', handleFilter);
        }

        if (entriesPerPage) {
            entriesPerPage.addEventListener('change', () => {
                currentPage = 1;
                updatePagination();
            });
        }

        // Reset Filters
        if (resetFilters) {
            resetFilters.addEventListener('click', handleResetFilters);
        }

        // Select All Checkbox
        if (selectAll) {
            selectAll.addEventListener('change', handleSelectAll);
        }

        // Student Checkboxes - using event delegation
        studentsTable.addEventListener('change', function(e) {
            if (e.target.classList.contains('student-checkbox')) {
                const checkbox = e.target;
                const row = checkbox.closest('tr');
                
                if (checkbox.checked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                    // Clear any inline styles
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
                
                updateSelectAllState();
                updateBulkActionButtons();
            }
        });

        // Action Buttons - using event delegation
        studentsTable.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;
            
            const studentId = target.dataset.studentId;
            if (!studentId) return;
            
            if (target.classList.contains('view-btn')) {
                handleViewStudent(studentId);
            } else if (target.classList.contains('edit-btn')) {
                handleEditStudent(studentId);
            } else if (target.classList.contains('delete-btn')) {
                handleDeleteStudent(studentId);
            }
        });

        // Add Student
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', handleAddStudent);
        }

        // Export
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExport);
        }

        // Bulk Delete
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', handleBulkDelete);
        }
    }

    // Removed attachActionButtons - now using event delegation

    // Search Handler
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        filteredStudents = allRows.filter(row => {
            const text = row.textContent.toLowerCase();
            return text.includes(searchTerm);
        });

        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Filter Handler
    function handleFilter() {
        const courseValue = courseFilter ? courseFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        filteredStudents = allRows.filter(row => {
            const rowCourse = row.dataset.course || '';
            const rowStatus = row.dataset.status || '';

            const courseMatch = !courseValue || rowCourse === courseValue;
            const statusMatch = !statusValue || rowStatus === statusValue;

            return courseMatch && statusMatch;
        });

        // Apply search if active
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredStudents = filteredStudents.filter(row => {
                return row.textContent.toLowerCase().includes(searchTerm);
            });
        }

        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Apply Filters and Display
    function applyFiltersAndDisplay() {
        // Hide all rows first
        allRows.forEach(row => {
            row.style.display = 'none';
            // Maintain row highlighting if checkbox is checked
            const checkbox = row.querySelector('.student-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            }
        });

        // Show filtered rows
        filteredStudents.forEach(row => row.style.display = '');

        updatePagination();
        showEmptyState();
        updateSelectAllState();
        updateBulkActionButtons();
    }

    // Reset Filters
    function handleResetFilters() {
        if (searchInput) searchInput.value = '';
        if (courseFilter) courseFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        filteredStudents = [...allRows];
        currentPage = 1;
        applyFiltersAndDisplay();
    }

    // Select All Handler
    function handleSelectAll() {
        const isChecked = selectAll.checked;
        const visibleRows = Array.from(studentsTable.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        visibleRows.forEach(row => {
            const checkbox = row.querySelector('.student-checkbox');
            if (checkbox) {
                checkbox.checked = isChecked;
                
                if (isChecked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                    row.style.backgroundColor = '';
                    row.style.borderLeft = '';
                }
            }
        });

        updateBulkActionButtons();
    }

    // Update Select All State
    function updateSelectAllState() {
        const visibleRows = Array.from(studentsTable.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none' && !row.classList.contains('empty-state-row'));
        
        const visibleCheckboxes = visibleRows.map(row => row.querySelector('.student-checkbox')).filter(cb => cb);
        const checkedCheckboxes = visibleCheckboxes.filter(cb => cb.checked);

        if (selectAll) {
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
    }

    // Update Bulk Action Buttons
    function updateBulkActionButtons() {
        const checkedCount = document.querySelectorAll('.student-checkbox:checked').length;
        const selectedCountSpan = document.getElementById('selectedCount');
        
        if (bulkDeleteBtn && selectedCountSpan) {
            if (checkedCount > 0) {
                bulkDeleteBtn.style.display = 'inline-block';
                selectedCountSpan.textContent = checkedCount;
            } else {
                bulkDeleteBtn.style.display = 'none';
            }
        }
    }

    // Pagination
    function updatePagination() {
        const perPage = parseInt(entriesPerPage ? entriesPerPage.value : 10);
        const totalEntries = filteredStudents.length;
        const totalPages = Math.ceil(totalEntries / perPage);

        // Hide all rows and maintain selection state
        allRows.forEach(row => {
            row.style.display = 'none';
            // Maintain row highlighting if checkbox is checked
            const checkbox = row.querySelector('.student-checkbox');
            if (checkbox && checkbox.checked) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
            }
        });

        // Show current page rows
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageRows = filteredStudents.slice(start, end);
        
        pageRows.forEach(row => row.style.display = '');

        // Update pagination info
        updatePaginationInfo(start, end, totalEntries);
        renderPaginationButtons(totalPages);
        
        // Update select all state
        updateSelectAllState();
    }

    // Update Pagination Info
    function updatePaginationInfo(start, end, total) {
        const showingStart = document.getElementById('showingStart');
        const showingEnd = document.getElementById('showingEnd');
        const totalEntriesEl = document.getElementById('totalEntries');

        if (showingStart) showingStart.textContent = total > 0 ? start + 1 : 0;
        if (showingEnd) showingEnd.textContent = Math.min(end, total);
        if (totalEntriesEl) totalEntriesEl.textContent = total;
    }

    // Render Pagination Buttons
    function renderPaginationButtons(totalPages) {
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
                updatePagination();
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
                updatePagination();
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
                updatePagination();
            }
        });
        pagination.appendChild(nextLi);
    }

    // Show Empty State
    function showEmptyState() {
        const tbody = studentsTable.querySelector('tbody');
        let emptyRow = tbody.querySelector('.empty-state-row');

        if (filteredStudents.length === 0) {
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-state-row';
                emptyRow.innerHTML = `
                    <td colspan="10">
                        <div class="empty-state">
                            <i class="bi bi-inbox"></i>
                            <h4>No Students Found</h4>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    </td>
                `;
                tbody.appendChild(emptyRow);
            }
            emptyRow.style.display = '';
        } else if (emptyRow) {
            emptyRow.style.display = 'none';
        }
    }

    // View Student Details
    function handleViewStudent(studentId) {
        console.log('Viewing student:', studentId);
        
        // Get student row
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (!row) return;

        // Extract student data
        const cells = row.querySelectorAll('td');
        const studentName = row.querySelector('.student-name')?.textContent || '';
        const email = cells[3]?.textContent || '';
        const phone = cells[4]?.textContent || '';
        const course = row.dataset.course || '';
        const status = row.dataset.status || '';

        // Populate modal
        const modalContent = document.getElementById('studentDetailsContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="row g-3">
                    <div class="col-md-6">
                        <h6 class="text-muted">Student ID</h6>
                        <p class="fw-bold">${studentId}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Name</h6>
                        <p class="fw-bold">${studentName}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Email</h6>
                        <p>${email}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Phone</h6>
                        <p>${phone}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Course</h6>
                        <p>${course}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Status</h6>
                        <p><span class="badge status-${status.toLowerCase()}">${status}</span></p>
                    </div>
                </div>
            `;
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('studentDetailsModal'));
        modal.show();
    }

    // Edit Student
    function handleEditStudent(studentId) {
        console.log('Editing student:', studentId);
        // Redirect to edit page or show edit modal
        window.location.href = `edit-student.jsp?id=${studentId}`;
    }

    // Delete Student
    function handleDeleteStudent(studentId) {
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        const studentName = row ? row.querySelector('.student-name')?.textContent || 'this student' : 'this student';
        
        showConfirmationModal({
            title: 'Delete Student',
            message: `Are you sure you want to delete <strong>${studentName}</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            onConfirm: function() {
                // Remove row from table
                if (row) {
                    row.remove();
                    
                    // Update arrays
                    allRows = Array.from(studentsTable.querySelectorAll('tbody tr:not(.empty-state-row)'));
                    filteredStudents = filteredStudents.filter(r => r !== row);
                    
                    // Reset select all checkbox
                    if (selectAll) {
                        selectAll.checked = false;
                        selectAll.indeterminate = false;
                    }
                    
                    // Update view
                    updatePagination();
                    updateBulkActionButtons();
                    showEmptyState();
                    
                    showToast(`Student "${studentName}" deleted successfully`, 'success');
                }
            }
        });
    }

    // Bulk Delete Students
    function handleBulkDelete() {
        const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            showToast('Please select students to delete', 'warning');
            return;
        }

        const studentCount = selectedCheckboxes.length;
        const studentNames = [];
        
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const nameEl = row.querySelector('.student-name');
            if (nameEl) {
                studentNames.push(nameEl.textContent);
            }
        });

        const studentList = studentNames.length <= 5 
            ? studentNames.map(name => `<li>${name}</li>`).join('')
            : studentNames.slice(0, 5).map(name => `<li>${name}</li>`).join('') + 
              `<li><em>...and ${studentNames.length - 5} more</em></li>`;

        showConfirmationModal({
            title: 'Delete Multiple Students',
            message: `Are you sure you want to delete <strong>${studentCount} student(s)</strong>?<br><br>
                     <div style="text-align: left; max-height: 200px; overflow-y: auto;">
                         <ul style="margin: 10px 0; padding-left: 20px;">
                             ${studentList}
                         </ul>
                     </div>
                     <br>This action cannot be undone.`,
            confirmText: 'Yes, Delete All',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            onConfirm: function() {
                // Remove all selected rows
                selectedCheckboxes.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    if (row) {
                        row.remove();
                    }
                });
                
                // Update arrays
                allRows = Array.from(studentsTable.querySelectorAll('tbody tr:not(.empty-state-row)'));
                filteredStudents = [...allRows];
                
                // Reset checkboxes
                if (selectAll) {
                    selectAll.checked = false;
                    selectAll.indeterminate = false;
                }
                
                // Hide bulk delete button
                if (bulkDeleteBtn) {
                    bulkDeleteBtn.style.display = 'none';
                }
                
                // Update view
                currentPage = 1;
                updatePagination();
                showEmptyState();
                
                showToast(`${studentCount} student(s) deleted successfully`, 'success');
            }
        });
    }

    // Add Student
    function handleAddStudent() {
        console.log('Adding new student');
        // Redirect to add student page
        window.location.href = 'add-student.jsp';
    }

    // Export Data
    function handleExport() {
        console.log('Exporting student data');
        
        // Get visible students
        const visibleRows = Array.from(
            studentsTable.querySelectorAll('tbody tr:not([style*="display: none"]):not(.empty-state-row)')
        );

        if (visibleRows.length === 0) {
            showToast('Warning', 'No data to export', 'warning');
            return;
        }

        // Create CSV
        let csv = 'Student ID,Name,Email,Phone,Course,Grade,Attendance,Status\n';
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const id = cells[1]?.textContent.trim() || '';
            const name = row.querySelector('.student-name')?.textContent.trim() || '';
            const email = cells[3]?.textContent.trim() || '';
            const phone = cells[4]?.textContent.trim() || '';
            const course = row.dataset.course || '';
            const grade = cells[6]?.textContent.trim() || '';
            const attendance = cells[7]?.querySelector('small')?.textContent.trim() || '';
            const status = row.dataset.status || '';
            
            csv += `"${id}","${name}","${email}","${phone}","${course}","${grade}","${attendance}","${status}"\n`;
        });

        // Download CSV
        downloadCSV(csv, 'students-export.csv');
        showToast('Success', 'Data exported successfully', 'success');
    }

    // Download CSV
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Debounce Helper
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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
