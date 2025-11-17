/**
 * Toast Notification for Auth Pages
 * Simple and lightweight toast notification system
 */

function showToast(message, type = 'success', duration = 4000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Icon mapping
    const icons = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle',
        'primary': 'fa-info-circle'
    };
    
    const icon = icons[type] || icons['info'];
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
    
    return toastId;
}

function createToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    return container;
}

// Auto-show toast based on URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('registered')) {
        showToast('Registration successful! Please login with your credentials.', 'success');
    }
    
    if (urlParams.has('logout')) {
        showToast('You have been successfully logged out.', 'info');
    }
    
    if (urlParams.has('error')) {
        const errorMsg = urlParams.get('error');
        if (errorMsg === 'invalid') {
            showToast('Invalid credentials. Please try again.', 'danger');
        } else if (errorMsg === 'unauthorized') {
            showToast('Please login to access this page.', 'warning');
        } else {
            showToast('An error occurred. Please try again.', 'danger');
        }
    }
    
    if (urlParams.has('success')) {
        const successMsg = urlParams.get('success');
        if (successMsg === 'login') {
            showToast('Login successful! Redirecting...', 'success');
        } else {
            showToast('Operation successful!', 'success');
        }
    }
});
