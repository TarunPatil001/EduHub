/**
 * Toast Notification Component
 * 
 * Purpose:
 * - Display toast notifications for user feedback
 * - Supports multiple notification types
 * - Auto-dismisses after a specified duration
 * 
 * Usage:
 * showToast('Message here', 'success');
 * showToast('Error message', 'danger', 3000);
 * showToastWithIcon('Success!', 'success');
 */

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} type - Toast type (success, danger, warning, info, primary, secondary)
 * @param {number} duration - Auto-hide duration in milliseconds (default: 5000)
 */
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-bs-autohide', 'true');
    toast.setAttribute('data-bs-delay', duration.toString());
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
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

/**
 * Show toast notification with icon
 * @param {string} message - The message to display
 * @param {string} type - Toast type (success, danger, warning, info)
 * @param {number} duration - Auto-hide duration in milliseconds (default: 5000)
 */
function showToastWithIcon(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast toast-with-icon align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-bs-autohide', 'true');
    toast.setAttribute('data-bs-delay', duration.toString());
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <span class="toast-icon"></span>
                <span>${message}</span>
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

/**
 * Show toast with progress bar
 * @param {string} message - The message to display
 * @param {string} type - Toast type
 * @param {number} duration - Auto-hide duration in milliseconds (default: 5000)
 */
function showToastWithProgress(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-relative`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-bs-autohide', 'true');
    toast.setAttribute('data-bs-delay', duration.toString());
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
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

/**
 * Create toast container if it doesn't exist
 */
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

/**
 * Dismiss a specific toast by ID
 * @param {string} toastId - The ID of the toast to dismiss
 */
function dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        const bsToast = bootstrap.Toast.getInstance(toast);
        if (bsToast) {
            bsToast.hide();
        }
    }
}

/**
 * Dismiss all active toasts
 */
function dismissAllToasts() {
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => {
            const bsToast = bootstrap.Toast.getInstance(toast);
            if (bsToast) {
                bsToast.hide();
            }
        });
    }
}

/**
 * Predefined toast helpers for common scenarios
 */
const Toast = {
    success: function(message, duration = 5000) {
        return showToastWithIcon(message, 'success', duration);
    },
    error: function(message, duration = 5000) {
        return showToastWithIcon(message, 'danger', duration);
    },
    warning: function(message, duration = 5000) {
        return showToastWithIcon(message, 'warning', duration);
    },
    info: function(message, duration = 5000) {
        return showToastWithIcon(message, 'info', duration);
    },
    loading: function(message = 'Loading...') {
        return showToast(message, 'primary', 999999); // Long duration for loading
    },
    dismiss: function(toastId) {
        dismissToast(toastId);
    },
    dismissAll: function() {
        dismissAllToasts();
    }
};
