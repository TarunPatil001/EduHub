/**
 * ============================================================================
 * Institute Registration Form Validation
 * ============================================================================
 * 
 * Purpose: Client-side validation for institute registration form
 * 
 * Features:
 * - Validates all required fields
 * - Email format validation
 * - Phone number validation
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
 * Validate institute registration form
 * @param {Event} e - Form submit event
 * @returns {boolean} True if valid, false otherwise
 */
function validateInstituteForm(e) {
    console.log('validateInstituteForm called');
    
    const instituteName = document.getElementById('instituteName').value.trim();
    const instituteType = document.getElementById('instituteType').value;
    const instituteEmail = document.getElementById('instituteEmail').value.trim();
    const institutePhone = document.getElementById('institutePhone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value;

    console.log('Form values:', { instituteName, instituteType, instituteEmail, institutePhone });

    // Validate required fields
    if (!instituteName || !instituteType || !instituteEmail || !institutePhone || 
        !address || !city || !state || !country) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Missing required fields');
        toast.error('Fill in all required fields');
        return false; // Keep form data
    }

    // Validate institute name length
    if (instituteName.length < 3 || instituteName.length > 255) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Institute name length');
        toast.error('Institute name must be 3-255 characters');
        return false; // Keep form data
    }

    // Validate email format
    if (!isValidEmail(instituteEmail)) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Invalid email');
        toast.error('Invalid email address');
        return false; // Keep form data
    }

    // Validate phone format
    if (!isValidPhone(institutePhone)) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Invalid phone');
        toast.error('Invalid phone number');
        return false; // Keep form data
    }

    // Validate address length
    if (address.length < 5) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: Address too short');
        toast.error('Enter complete address');
        return false; // Keep form data
    }

    // Validate city length
    if (city.length < 2) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: City name too short');
        toast.error('Invalid city name');
        return false; // Keep form data
    }

    // Validate state length
    if (state.length < 2) {
        e.preventDefault(); // STOP form submission
        console.log('Validation failed: State name too short');
        toast.error('Invalid state/province');
        return false; // Keep form data
    }

    // All validations passed - form will submit and redirect to admin page
    console.log('Validation passed, form will submit');
    return true;
}

/**
 * Initialize form validation on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Register institute validation script loaded');
    const instituteForm = document.getElementById('instituteForm');
    if (instituteForm) {
        console.log('Institute form found, attaching validation');
        instituteForm.addEventListener('submit', validateInstituteForm);
    } else {
        console.error('Institute form not found!');
    }
});
