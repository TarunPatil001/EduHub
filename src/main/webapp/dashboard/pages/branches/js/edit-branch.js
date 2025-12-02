// Edit Branch Page - Form Validation and Submission
(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('editBranchForm');
    const branchCodeInput = document.getElementById('branchCode');
    const branchNameInput = document.getElementById('branchName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const zipCodeInput = document.getElementById('zipCode');
    const addressInput = document.getElementById('address');
    
    // Get branchId from URL as backup
    const urlParams = new URLSearchParams(window.location.search);
    const branchIdFromUrl = urlParams.get('id');

    // Initialize
    function init() {
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
        
        // Add real-time validation
        if (branchCodeInput) branchCodeInput.addEventListener('blur', validateBranchCode);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);
        if (phoneInput) phoneInput.addEventListener('blur', validatePhone);
        if (zipCodeInput) zipCodeInput.addEventListener('blur', validateZipCode);
    }

    // Validate Branch Code
    function validateBranchCode() {
        const value = branchCodeInput.value.trim();
        const pattern = /^[A-Z0-9\-]+$/;
        
        if (!value) {
            showFieldError(branchCodeInput, 'Branch code is required');
            return false;
        }
        
        if (!pattern.test(value)) {
            showFieldError(branchCodeInput, 'Branch code should contain only uppercase letters, numbers, and hyphens');
            return false;
        }
        
        clearFieldError(branchCodeInput);
        return true;
    }

    // Validate Email
    function validateEmail() {
        const value = emailInput.value.trim();
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            showFieldError(emailInput, 'Email is required');
            return false;
        }
        
        if (!pattern.test(value)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            return false;
        }
        
        clearFieldError(emailInput);
        return true;
    }

    // Validate Phone
    function validatePhone() {
        const value = phoneInput.value.trim();
        const pattern = /^[0-9+\-\s()]+$/;
        
        if (!value) {
            showFieldError(phoneInput, 'Phone number is required');
            return false;
        }
        
        if (!pattern.test(value) || value.replace(/[^0-9]/g, '').length < 10) {
            showFieldError(phoneInput, 'Please enter a valid phone number (at least 10 digits)');
            return false;
        }
        
        clearFieldError(phoneInput);
        return true;
    }

    // Validate ZIP Code
    function validateZipCode() {
        const value = zipCodeInput.value.trim();
        const pattern = /^[0-9]{5,6}$/;
        
        if (!value) {
            showFieldError(zipCodeInput, 'ZIP code is required');
            return false;
        }
        
        if (!pattern.test(value)) {
            showFieldError(zipCodeInput, 'Please enter a valid ZIP code (5-6 digits)');
            return false;
        }
        
        clearFieldError(zipCodeInput);
        return true;
    }

    // Show Field Error
    function showFieldError(input, message) {
        const formGroup = input.closest('.mb-3') || input.closest('.col-md-4') || input.closest('.col-md-6');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.invalid-feedback');
        if (existingError) existingError.remove();
        
        // Add error class
        input.classList.add('is-invalid');
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    // Clear Field Error
    function clearFieldError(input) {
        const formGroup = input.closest('.mb-3') || input.closest('.col-md-4') || input.closest('.col-md-6');
        if (!formGroup) return;
        
        input.classList.remove('is-invalid');
        const errorDiv = formGroup.querySelector('.invalid-feedback');
        if (errorDiv) errorDiv.remove();
    }

    // Validate All Fields
    function validateAllFields() {
        let isValid = true;
        
        // Required text fields
        const requiredFields = [
            { input: branchCodeInput, validator: validateBranchCode },
            { input: branchNameInput, validator: null },
            { input: emailInput, validator: validateEmail },
            { input: phoneInput, validator: validatePhone },
            { input: cityInput, validator: null },
            { input: stateInput, validator: null },
            { input: zipCodeInput, validator: validateZipCode },
            { input: addressInput, validator: null }
        ];
        
        requiredFields.forEach(field => {
            if (!field.input) return;
            
            if (field.validator) {
                if (!field.validator.call()) {
                    isValid = false;
                }
            } else {
                const value = field.input.value.trim();
                if (!value) {
                    showFieldError(field.input, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(field.input);
                }
            }
        });
        
        return isValid;
    }

    // Handle Form Submit
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Clear all previous errors
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        
        // Validate all fields
        if (!validateAllFields()) {
            if (typeof toast !== 'undefined') {
                toast.error('Please fix the validation errors before submitting');
            }
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const basePath = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        // Debug: Log form data
        console.log('Form data being submitted:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
        }
        
        // Verify branchId is present, if not, add it from URL
        const currentBranchId = formData.get('branchId');
        if (!currentBranchId || currentBranchId.trim() === '') {
            console.warn('branchId is missing or empty in form data! Attempting to use URL parameter...');
            if (branchIdFromUrl) {
                // Use set() instead of append() to overwrite any existing empty value
                formData.set('branchId', branchIdFromUrl);
                console.log('Set branchId from URL:', branchIdFromUrl);
            } else {
                console.error('branchId not found in form or URL!');
                if (typeof toast !== 'undefined') {
                    toast.error('Branch ID is missing. Please refresh and try again.');
                }
                return;
            }
        }
        
        // Disable submit button to prevent double submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...';
        
        // Convert FormData to URLSearchParams to send as application/x-www-form-urlencoded
        // This is required because the Servlet does not have @MultipartConfig annotation
        const urlSearchParams = new URLSearchParams();
        for (const pair of formData.entries()) {
            urlSearchParams.append(pair[0], pair[1]);
        }

        // Submit form
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: urlSearchParams
        })
        .then(response => {
            if (response.redirected) {
                // Handle redirect
                window.location.href = response.url;
                return null;
            }
            return response.text();
        })
        .then(text => {
            if (text === null) return; // Redirect handled
            
            // If we get here, there might be an error
            if (typeof toast !== 'undefined') {
                toast.error('Failed to update branch. Please try again.');
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            if (typeof toast !== 'undefined') {
                toast.error('An error occurred while updating the branch');
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
