/**
 * Manage Batches - JavaScript
 * Handles filtering, searching, and batch management functionality
 */

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
                card.style.opacity = '0.5';
                setTimeout(function() {
                    card.remove();
                    updateTabCounts();
                    applyFilters();
                    showToastWithIcon('Batch deleted successfully', 'success', 3000);
                }, 300);
            }
        });
    });
});
