/**
 * Manage Batches - JavaScript
 * Handles filtering, searching, and batch management functionality
 */

// Handle URL Parameters for Toast Notifications on Page Load
(function() {
    'use strict';
    
    // Check for URL parameters when page loads
    document.addEventListener('DOMContentLoaded', function() {
        handleURLParameters();
    });
    
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Success messages
        if (urlParams.has('success')) {
            const successType = urlParams.get('success');
            
            if (successType === 'created') {
                toast.success('Batch created successfully!');
            } else if (successType === 'updated') {
                toast.success('Batch updated successfully!');
            } else if (successType === 'deleted') {
                toast.success('Batch deleted successfully!');
            } else if (successType === 'started') {
                toast.success('Batch started successfully!');
            } else if (successType === 'completed') {
                toast.success('Batch marked as completed!');
            }
            
            // Clean URL
            urlParams.delete('success');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
        
        // Error messages
        if (urlParams.has('error')) {
            const errorType = urlParams.get('error');
            
            if (errorType === 'notfound') {
                toast.error('Batch not found');
            } else if (errorType === 'failed') {
                toast.error('Operation failed. Please try again.');
            } else if (errorType === 'duplicate') {
                toast.error('Batch with this code already exists');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            
            // Clean URL
            urlParams.delete('error');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
    }
})();

 // Filter batches based on status, search, course, and instructor
function applyFilters() {
    const statusFilter = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
    const searchTerm = document.getElementById('searchBatch').value.toLowerCase();
    const courseFilter = document.getElementById('filterCourse').value.toLowerCase();
    const instructorFilter = document.getElementById('filterInstructor').value.toLowerCase();
    
    const batchCardsContainer = document.getElementById('batchesContainer');
    const emptyState = document.getElementById('emptyState');
    
    batchCardsContainer.style.display = '';
    
    const batchCards = document.querySelectorAll('#batchesContainer > div[data-status]');
    let visibleCount = 0;
    
    batchCards.forEach(card => {
        const status = card.getAttribute('data-status');
        const course = card.getAttribute('data-course') || '';
        const instructor = card.getAttribute('data-instructor') || '';
        const text = card.textContent.toLowerCase();
        
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        const matchesSearch = searchTerm === '' || text.includes(searchTerm);
        const matchesCourse = courseFilter === '' || course === courseFilter;
        const matchesInstructor = instructorFilter === '' || instructor === instructorFilter;
        
        if (matchesStatus && matchesSearch && matchesCourse && matchesInstructor) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (emptyState) {
        emptyState.classList.toggle('d-none', visibleCount > 0);
    }
}

// Clear all filters
document.getElementById('clearFiltersBtn').addEventListener('click', function() {
    document.getElementById('searchBatch').value = '';
    document.getElementById('filterCourse').value = '';
    document.getElementById('filterInstructor').value = '';
    applyFilters();
});

// Filter batches by status (All, Upcoming, Active, Completed)
document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Reset all filters when tab is changed
        document.getElementById('searchBatch').value = '';
        document.getElementById('filterCourse').value = '';
        document.getElementById('filterInstructor').value = '';
        
        applyFilters();
    });
});

// Search functionality
const searchInput = document.getElementById('searchBatch');
if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

// Course filter
const courseSelect = document.getElementById('filterCourse');
if (courseSelect) {
    courseSelect.addEventListener('change', applyFilters);
}

// Instructor filter
const instructorSelect = document.getElementById('filterInstructor');
if (instructorSelect) {
    instructorSelect.addEventListener('change', applyFilters);
}

// Delete confirmation for batch cards
document.querySelectorAll('.btn-outline-danger').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.col-lg-6');
        const batchTitle = card.querySelector('.batch-title')?.textContent || 'this batch';
        const batchCode = card.querySelector('.batch-code')?.textContent || '';
        
        let message = 'Are you sure you want to delete <strong>' + batchTitle + '</strong>';
        if (batchCode) {
            message += ' (' + batchCode + ')';
        }
        message += '?<br><br>This action cannot be undone.';
        
        showConfirmationModal({
            title: 'Delete Batch',
            message: message,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                // Show loading toast
                const loadingToastId = toast.loading('Deleting batch...');
                
                card.style.opacity = '0.5';
                setTimeout(function() {
                    try {
                        card.remove();
                        
                        // Update tab counts if function exists
                        if (typeof updateTabCounts === 'function') {
                            updateTabCounts();
                        }
                        
                        applyFilters();
                        
                        toast.success(`Batch "${batchTitle}" deleted successfully`);
                    } catch (error) {
                        console.error('Error deleting batch:', error);
                        toast.error('Error deleting batch. Please try again.');
                        card.style.opacity = '1';
                    } finally {
                        // Always dismiss loading toast, regardless of success or failure
                        toast.dismiss(loadingToastId);
                    }
                }, 800);
            }
        });
    });
});