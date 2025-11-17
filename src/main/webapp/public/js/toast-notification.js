/**
 * ============================================================================
 * EduHub Toast Notification System
 * ============================================================================
 * 
 * Purpose: Provides toast notifications for user feedback on authentication pages
 * 
 * Features:
 * - Auto-detection of URL parameters (registered, logout, error, success)
 * - Multiple toast types (success, danger, warning, info, primary)
 * - Font Awesome icons for visual clarity
 * - Auto-dismiss after configurable duration
 * - Bootstrap 5 Toast component integration
 * - Console logging for debugging
 * 
 * Usage:
 *   showToast('Message here', 'success', 4000);
 *   showToast('Error occurred', 'danger');
 *   showToast('Please wait...', 'info');
 * 
 * Toast Types:
 *   - success: Green background with check icon
 *   - danger: Red background with exclamation icon
 *   - warning: Yellow background with triangle icon
 *   - info: Blue background with info icon
 *   - primary: Purple background with info icon
 * 
 * Dependencies:
 *   - Bootstrap 5 (for Toast component)
 *   - Font Awesome 6 (for icons)
 * ============================================================================
 */

/**
 * Display a toast notification
 * 
 * @param {string} message - The message to display in the toast
 * @param {string} type - Toast type: 'success', 'danger', 'warning', 'info', or 'primary'
 * @param {number} duration - How long the toast should be visible in milliseconds (default: 4000ms)
 * @returns {string} The unique ID of the created toast element
 * 
 * @example
 * // Show a success message
 * showToast('Registration successful!', 'success');
 * 
 * @example
 * // Show an error with custom duration
 * showToast('Login failed', 'danger', 5000);
 */
function showToast(message, type = 'success', duration = 4000) {
    console.log('showToast called:', message, type, duration);
    
    // Ensure Bootstrap is loaded before proceeding
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded!');
        return;
    }
    
    // Get or create the toast container
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    // Generate unique ID for this toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Map toast types to Font Awesome icons
    const icons = {
        'success': 'fa-check-circle',      // Checkmark for success
        'danger': 'fa-exclamation-circle',  // Exclamation for errors
        'warning': 'fa-exclamation-triangle', // Triangle for warnings
        'info': 'fa-info-circle',          // Info icon for information
        'primary': 'fa-info-circle'        // Same as info for primary
    };
    
    const icon = icons[type] || icons['info'];
    
    // Build toast HTML with icon and message
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    try {
        // Initialize and show the Bootstrap Toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: duration
        });
        bsToast.show();
        console.log('Toast shown successfully');
        
        // Clean up: Remove toast element from DOM after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    } catch (error) {
        console.error('Error showing toast:', error);
    }
    
    return toastId;
}

/**
 * Create the toast container element if it doesn't exist
 * 
 * @returns {HTMLElement} The toast container element
 * 
 * @description
 * Creates a fixed-position container at the top-right of the screen
 * where all toasts will be displayed. Only creates it once per page.
 */
function createToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999'; // Ensure toasts appear above everything
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Auto-show toast based on URL parameters
 * 
 * @description
 * Automatically detects URL parameters and displays appropriate toasts:
 * - ?registered=true -> Success toast for registration
 * - ?logout=true -> Info toast for logout
 * - ?error=invalid -> Danger toast for invalid credentials
 * - ?error=unauthorized -> Warning toast for unauthorized access
 * - ?success=login -> Success toast for login
 * 
 * This runs automatically when the page loads (DOMContentLoaded event)
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Toast notification script loaded');
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL params:', window.location.search);
    
    // Check for registration success
    if (urlParams.has('registered')) {
        console.log('Showing registered toast');
        showToast('Registration successful! Please login with your credentials.', 'success');
    }
    
    // Check for logout
    if (urlParams.has('logout')) {
        console.log('Showing logout toast');
        showToast('You have been successfully logged out.', 'info');
    }
    
    // Check for errors
    if (urlParams.has('error')) {
        const errorMsg = urlParams.get('error');
        console.log('Showing error toast:', errorMsg);
        if (errorMsg === 'invalid') {
            showToast('Invalid credentials. Please try again.', 'danger');
        } else if (errorMsg === 'unauthorized') {
            showToast('Please login to access this page.', 'warning');
        } else {
            showToast('An error occurred. Please try again.', 'danger');
        }
    }
    
    // Check for success messages
    if (urlParams.has('success')) {
        const successMsg = urlParams.get('success');
        console.log('Showing success toast:', successMsg);
        if (successMsg === 'login') {
            showToast('Login successful! Redirecting...', 'success');
        } else {
            showToast('Operation successful!', 'success');
        }
    }
});

/* ============================================================================
   END OF FILE
   ============================================================================ */
