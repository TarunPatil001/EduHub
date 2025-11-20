/**
 * ============================================================================
 * EduHub Centralized Toast Notification System (iziToast)
 * ============================================================================
 * 
 * Purpose: Unified toast notifications for entire application using iziToast
 * Location: /common/js/toast-notification.js
 * 
 * Features:
 * - Beautiful, modern toast notifications with iziToast
 * - URL parameter auto-detection for login/logout/registration messages
 * - Multiple toast types (success, error, warning, info, question)
 * - Mobile responsive with smooth animations
 * - Consistent styling across all pages
 * 
 * Usage:
 *   Simple: showToast('Message', 'success');
 *   With Duration: showToast('Message', 'info', 3000);
 *   Object API: Toast.success('Message'), Toast.error('Message')
 *   With Options: Toast.success('Message', { timeout: 5000, position: 'topRight' })
 * 
 * Dependencies:
 *   - iziToast (loaded from CDN via toast-notification.jsp)
 * ============================================================================
 */

// Configuration - All toasts at top center
var TOAST_CONFIG = {
    defaultDuration: 3000,
    position: 'topCenter',
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOut',
    progressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    resetOnHover: false,
    displayMode: 'replace',
    animateInside: false,
    icon: true,
    iconColor: '',
    backgroundColor: '#fff',
    messageColor: '#363636',
    progressBarColor: '',
    close: true,
    closeOnEscape: true,
    rtl: false,
    balloon: false,
    drag: true,
    maxWidth: 500,
    theme: 'light',
    layout: 1
};

// Set global iziToast defaults to top center
if (typeof iziToast !== 'undefined') {
    iziToast.settings({
        position: 'topCenter',
        transitionIn: 'fadeInDown',
        transitionOut: 'fadeOut'
    });
}

/**
 * Main toast function - uses iziToast
 */
function showToast(message, type, durationOrOptions) {
    type = type || 'info';
    durationOrOptions = durationOrOptions || TOAST_CONFIG.defaultDuration;
    
    if (typeof iziToast === 'undefined') {
        console.error('iziToast is not loaded! Falling back to alert.');
        alert(message);
        return;
    }
    
    if (type === 'danger') type = 'error';
    
    var options = {};
    if (typeof durationOrOptions === 'number') {
        options.timeout = durationOrOptions;
    } else if (typeof durationOrOptions === 'object') {
        options = durationOrOptions;
    }
    
    var finalOptions = {
        title: '',
        message: message,
        position: options.position || TOAST_CONFIG.position,
        timeout: options.timeout || TOAST_CONFIG.defaultDuration,
        transitionIn: options.transitionIn || TOAST_CONFIG.transitionIn,
        transitionOut: options.transitionOut || TOAST_CONFIG.transitionOut,
        progressBar: options.progressBar !== undefined ? options.progressBar : TOAST_CONFIG.progressBar,
        closeOnClick: options.closeOnClick !== undefined ? options.closeOnClick : TOAST_CONFIG.closeOnClick,
        pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : TOAST_CONFIG.pauseOnHover,
        resetOnHover: options.resetOnHover !== undefined ? options.resetOnHover : TOAST_CONFIG.resetOnHover,
        displayMode: options.displayMode || TOAST_CONFIG.displayMode
    };
    
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            finalOptions[key] = options[key];
        }
    }
    
    try {
        switch(type) {
            case 'success':
                iziToast.success(finalOptions);
                break;
            case 'error':
                iziToast.error(finalOptions);
                break;
            case 'warning':
                iziToast.warning(finalOptions);
                break;
            case 'info':
                iziToast.info(finalOptions);
                break;
            case 'question':
                iziToast.question(finalOptions);
                break;
            default:
                iziToast.show(finalOptions);
        }
        console.log('iziToast displayed:', type, message);
    } catch (error) {
        console.error('Error showing iziToast:', error);
        alert(message);
    }
}

/**
 * Toast Object API - Convenience methods with advanced features
 */
var Toast = {
    success: function(message, durationOrOptions) {
        return showToast(message, 'success', durationOrOptions);
    },
    
    error: function(message, durationOrOptions) {
        return showToast(message, 'error', durationOrOptions);
    },
    
    warning: function(message, durationOrOptions) {
        return showToast(message, 'warning', durationOrOptions);
    },
    
    info: function(message, durationOrOptions) {
        return showToast(message, 'info', durationOrOptions);
    },
    
    question: function(message, durationOrOptions) {
        return showToast(message, 'question', durationOrOptions);
    },
    
    danger: function(message, durationOrOptions) {
        return showToast(message, 'error', durationOrOptions);
    },
    
    /**
     * Show toast with action buttons
     * @param {string} message - Message to display
     * @param {object} options - Configuration with buttons array
     * Example: Toast.withButtons('Delete this?', {
     *   buttons: [
     *     ['<button>Yes</button>', function(instance, toast) { instance.hide({}, toast, 'button'); }],
     *     ['<button>No</button>', function(instance, toast) { instance.hide({}, toast, 'button'); }]
     *   ]
     * })
     */
    withButtons: function(message, options) {
        if (typeof iziToast === 'undefined') return;
        
        var config = {
            message: message,
            position: options.position || TOAST_CONFIG.position,
            timeout: options.timeout || false,
            close: options.close !== undefined ? options.close : true,
            overlay: options.overlay || false,
            displayMode: options.displayMode || 'once',
            buttons: options.buttons || [],
            backgroundColor: options.backgroundColor || '#fff',
            messageColor: options.messageColor || '#363636',
            progressBar: options.progressBar !== undefined ? options.progressBar : false
        };
        
        var type = options.type || 'info';
        iziToast[type](config);
    },
    
    /**
     * Show confirmation toast with Yes/No buttons
     */
    confirm: function(message, onConfirm, onCancel) {
        if (typeof iziToast === 'undefined') return;
        
        iziToast.question({
            timeout: false,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Confirm',
            message: message,
            position: 'center',
            backgroundColor: '#fff',
            titleColor: '#363636',
            messageColor: '#363636',
            icon: 'question',
            iconColor: '#8b5cf6',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    if (onConfirm) onConfirm();
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    if (onCancel) onCancel();
                }]
            ]
        });
    },
    
    /**
     * Show toast with input field
     */
    prompt: function(message, onSubmit, options) {
        if (typeof iziToast === 'undefined') return;
        
        options = options || {};
        
        iziToast.question({
            timeout: false,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'prompt',
            zindex: 999,
            title: options.title || 'Input Required',
            message: message,
            position: options.position || 'center',
            backgroundColor: '#fff',
            titleColor: '#363636',
            messageColor: '#363636',
            icon: 'question',
            iconColor: '#3b82f6',
            inputs: [
                ['<input type="text" placeholder="' + (options.placeholder || 'Enter value') + '">', 'keyup', function (instance, toast, input, e) {
                    // Optional validation on keyup
                }, true]
            ],
            buttons: [
                ['<button><b>SUBMIT</b></button>', function (instance, toast) {
                    var inputValue = toast.querySelector('input').value;
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    if (onSubmit) onSubmit(inputValue);
                }, true],
                ['<button>CANCEL</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
        });
    },
    
    /**
     * Show balloon style toast (speech bubble)
     */
    balloon: function(message, type, options) {
        if (typeof iziToast === 'undefined') return;
        
        type = type || 'info';
        options = options || {};
        
        var config = {
            message: message,
            balloon: true,
            position: options.position || 'bottomRight',
            timeout: options.timeout || 5000,
            backgroundColor: '#fff',
            messageColor: '#363636'
        };
        
        iziToast[type](config);
    },
    
    /**
     * Show toast with custom image/icon
     */
    withImage: function(message, imageUrl, options) {
        if (typeof iziToast === 'undefined') return;
        
        options = options || {};
        
        iziToast.show({
            message: message,
            image: imageUrl,
            imageWidth: options.imageWidth || 50,
            position: options.position || TOAST_CONFIG.position,
            timeout: options.timeout || 5000,
            backgroundColor: '#fff',
            messageColor: '#363636',
            close: true,
            progressBar: true
        });
    },
    
    /**
     * Show loading toast (with custom icon or spinner)
     */
    loading: function(message, options) {
        if (typeof iziToast === 'undefined') return;
        
        options = options || {};
        
        return iziToast.info({
            id: 'loading',
            timeout: false,
            close: false,
            overlay: options.overlay || false,
            displayMode: 'replace',
            message: message || 'Loading...',
            position: options.position || 'topCenter',
            backgroundColor: '#fff',
            messageColor: '#363636',
            progressBar: false,
            icon: 'ico-info'
        });
    },
    
    /**
     * Hide specific toast by ID
     */
    hide: function(toastId, options) {
        if (typeof iziToast === 'undefined') return;
        
        options = options || {};
        iziToast.hide(options, document.querySelector('#' + toastId));
    },
    
    /**
     * Destroy all toasts
     */
    destroyAll: function() {
        if (typeof iziToast !== 'undefined') {
            iziToast.destroy();
        }
    },
    
    /**
     * Show custom toast with all options
     */
    show: function(options) {
        if (typeof iziToast !== 'undefined') {
            var mergedOptions = {};
            for (var key in TOAST_CONFIG) {
                if (TOAST_CONFIG.hasOwnProperty(key)) {
                    mergedOptions[key] = TOAST_CONFIG[key];
                }
            }
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    mergedOptions[key] = options[key];
                }
            }
            iziToast.show(mergedOptions);
        }
    },
    
    /**
     * Set default settings globally
     */
    settings: function(options) {
        if (typeof iziToast !== 'undefined') {
            iziToast.settings(options);
        }
    }
};

/**
 * Auto-show toast based on URL parameters
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('iziToast notification script loaded');
    console.log('iziToast available:', typeof iziToast !== 'undefined');
    
    var urlParams = new URLSearchParams(window.location.search);
    var shouldCleanUrl = false;
    
    // Check for registration success
    if (urlParams.has('registered')) {
        var message = urlParams.get('message') || 'Registration successful! Please login with your credentials.';
        showToast(decodeURIComponent(message), 'success');
        shouldCleanUrl = true;
    }
    
    // Check for logout
    if (urlParams.has('logout')) {
        var logoutStatus = urlParams.get('logout');
        if (logoutStatus === 'success' || logoutStatus === 'true') {
            showToast('You have been successfully logged out.', 'success', 3000);
            shouldCleanUrl = true;
        }
    }
    
    // Check for errors
    if (urlParams.has('error')) {
        var errorMsg = urlParams.get('error');
        if (errorMsg === 'invalid') {
            showToast('Invalid credentials. Please try again.', 'error');
        } else if (errorMsg === 'unauthorized') {
            showToast('Please login to access that page.', 'warning', 4000);
        } else {
            showToast(decodeURIComponent(errorMsg), 'error');
        }
        shouldCleanUrl = true;
    }
    
    // Check for success messages
    if (urlParams.has('success')) {
        var successMsg = urlParams.get('success');
        // Handle specific success cases
        if (successMsg === 'login') {
            showToast('Welcome! You have successfully logged in.', 'success', 4000);
        } else if (successMsg === 'logout') {
            showToast('You have been successfully logged out.', 'success', 3000);
        } else {
            // Generic success message or custom decoded message
            showToast(decodeURIComponent(successMsg), 'success');
        }
        shouldCleanUrl = true;
    }
    
    // Check for info messages
    if (urlParams.has('info')) {
        var infoMsg = urlParams.get('info');
        showToast(decodeURIComponent(infoMsg), 'info');
        shouldCleanUrl = true;
    }
    
    // Clean URL parameters after showing toast to prevent duplicate toasts on refresh
    if (shouldCleanUrl && window.history && window.history.replaceState) {
        // Get current URL without query parameters
        var cleanUrl = window.location.protocol + '//' + 
                      window.location.host + 
                      window.location.pathname;
        
        // Replace current history entry without reloading the page
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('URL parameters cleared to prevent duplicate toasts on refresh');
    }
});

console.log('Centralized Toast Notification System (iziToast) loaded successfully');
