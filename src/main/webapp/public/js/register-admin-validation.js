/**
 * ============================================================================
 * Admin Registration Form Validation
 * ============================================================================
 * 
 * Purpose: Client-side validation for admin registration form
 * 
 * Features:
 * - Validates all required fields
 * - Email format validation
 * - Phone number validation
 * - Password strength validation
 * - Password matching validation
 * - Field length validation
 * - Shows toast notifications for errors
 * 
 * Dependencies:
 *   - hot-toast (loaded from CDN via toast-notification.jsp)
 * ============================================================================
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isStrongPassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
}

/**
 * Validate admin registration form
 * @param {Event} e - Form submit event
 * @returns {boolean} True if valid, false otherwise
 */
function validateAdminForm(e) {
    console.log('validateAdminForm called');
    
    const fullName = document.getElementById('fullName').value.trim();
    const adminEmail = document.getElementById('adminEmail').value.trim();
    const adminPhone = document.getElementById('adminPhone').value.trim();
    const passwordValue = document.getElementById('password').value;
    const confirmPasswordValue = document.getElementById('confirmPassword').value;

    console.log('Form values:', { fullName, adminEmail, adminPhone });

    // Validate required fields
    if (!fullName || !adminEmail || !adminPhone || !passwordValue || !confirmPasswordValue) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Missing required fields');
        toast.error('Fill in all required fields');
        return false; // Keep form data
    }

    // Validate full name length
    if (fullName.length < 2 || fullName.length > 255) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Full name length');
        toast.error('Name must be 2-255 characters');
        return false; // Keep form data
    }

    // Validate full name format (should contain at least one space for first and last name)
    if (!fullName.includes(' ')) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Full name format');
        toast.error('Enter first and last name');
        return false; // Keep form data
    }

    // Validate email format
    if (!isValidEmail(adminEmail)) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Invalid email');
        toast.error('Invalid email address');
        return false; // Keep form data
    }

    // Validate phone format
    if (!isValidPhone(adminPhone)) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Invalid phone');
        toast.error('Invalid phone number');
        return false; // Keep form data
    }

    // Validate password strength
    if (passwordValue.length < 8) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Password too short');
        toast.error('Password must be 8+ characters');
        return false; // Keep form data
    }

    // Check if password contains both letters and numbers
    if (!isStrongPassword(passwordValue)) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Password not strong enough');
        toast.error('Password needs letters & numbers');
        return false; // Keep form data
    }

    // Validate passwords match
    if (passwordValue !== confirmPasswordValue) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Passwords do not match');
        toast.error('Passwords do not match');
        return false; // Keep form data
    }

    // ALL VALIDATIONS PASSED - Allow form submission
    console.log('Validation passed, allowing form submission');
    // Toast will be shown by the inline script in register_admin.jsp
    
    // Form will submit to backend
    // After successful registration, backend will redirect to login page
    return true; // Allow form submission
}

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (togglePassword && password && toggleIcon) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            toggleIcon.classList.toggle('fa-eye');
            toggleIcon.classList.toggle('fa-eye-slash');
        });
    }

    // Confirm password toggle
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const toggleConfirmIcon = document.getElementById('toggleConfirmIcon');

    if (toggleConfirmPassword && confirmPassword && toggleConfirmIcon) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            toggleConfirmIcon.classList.toggle('fa-eye');
            toggleConfirmIcon.classList.toggle('fa-eye-slash');
        });
    }
}

/**
 * Initialize form validation on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminForm');
    if (adminForm) {
        adminForm.addEventListener('submit', validateAdminForm);
    }
    
    // Initialize password toggle
    initPasswordToggle();
});
