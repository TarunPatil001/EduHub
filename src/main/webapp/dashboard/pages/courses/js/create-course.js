// Create Course Form - Simple Implementation
(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('createCourseForm');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const cancelBtn = document.getElementById('cancelBtn');

    // Initialize
    function init() {
        bindEvents();
        setMinDates();
    }

    // Bind Events
    function bindEvents() {
        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleCancel);
        }

        // Date validation
        if (startDate && endDate) {
            startDate.addEventListener('change', validateDates);
            endDate.addEventListener('change', validateDates);
        }

        // Real-time validation on blur
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }

    // Set minimum dates
    function setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        if (startDate) startDate.min = today;
        if (endDate) endDate.min = today;
    }

    // Validate Field
    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        }
    }

    // Validate Dates
    function validateDates() {
        if (startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);

            if (end <= start) {
                endDate.classList.add('is-invalid');
                endDate.classList.remove('is-valid');
                toast('End date must be after start date', { icon: '⚠️' });
                return false;
            } else {
                endDate.classList.remove('is-invalid');
                endDate.classList.add('is-valid');
                return true;
            }
        }
        return true;
    }

    // Validate Form
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!validateDates()) {
            isValid = false;
        }

        return isValid;
    }

    // Handle Cancel
    function handleCancel() {
        // Check if form has any data
        const formData = new FormData(form);
        let hasData = false;
        
        for (let [key, value] of formData.entries()) {
            if (value && value.trim() !== '') {
                hasData = true;
                break;
            }
        }

        if (hasData) {
            showConfirmationModal({
                title: 'Cancel Course Creation',
                message: 'Are you sure you want to cancel? All entered data will be lost.',
                confirmText: 'Yes, Cancel',
                cancelText: 'No, Continue',
                confirmClass: 'btn-danger',
                icon: 'bi-exclamation-triangle-fill text-warning',
                onConfirm: function() {
                    resetForm();
                    toast('Form has been reset', { icon: 'ℹ️' });
                }
            });
        } else {
            resetForm();
            toast('Form has been reset', { icon: 'ℹ️' });
        }
    }

    // Reset Form
    function resetForm() {
        form.reset();
        
        // Reset status to empty (Select Status option)
        const statusField = document.getElementById('status');
        if (statusField) {
            statusField.value = '';
        }
        
        // Remove all validation classes
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle Form Submit
    function handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            toast('Please fill in all required fields correctly', { icon: '⚠️' });
            // Scroll to first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating Course...';
        
        // Show loading toast
        const loadingToast = toast.loading('Creating course...');

        // Collect form data
        const formData = new FormData(form);
        const durationValue = formData.get('durationValue');
        const durationUnit = formData.get('durationUnit');
        const duration = `${durationValue} ${durationUnit}`;
        
        const courseData = {
            code: formData.get('courseCode'),
            name: formData.get('courseName'),
            category: formData.get('category'),
            level: formData.get('level'),
            description: formData.get('description'),
            duration: duration,
            durationValue: durationValue,
            durationUnit: durationUnit,
            maxStudents: formData.get('maxStudents'),
            fee: formData.get('fee') || '0',
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            instructor: formData.get('instructor'),
            modeOfConduct: formData.get('modeOfConduct'),
            status: formData.get('status')
        };

        // Simulate API call
        setTimeout(() => {
            console.log('Course Data:', courseData);
            
            // Dismiss loading toast
            if (typeof loadingToast === 'function') loadingToast();
            
            showSuccessModal({
                title: 'Course Created Successfully!',
                message: `
                    <div style="text-align: center;">
                        <i class="bi bi-check-circle-fill" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i>
                        <h4 style="margin: 0.5rem 0; color: #1f2937;">${courseData.name}</h4>
                        <p style="color: #6b7280; margin: 0.5rem 0;">Course code: <strong>${courseData.code}</strong></p>
                        <p style="color: #6b7280;">The course has been created successfully and is ready for enrollment.</p>
                    </div>
                `,
                onClose: function() {
                    // Reset form or redirect
                    form.reset();
                    
                    // Reset status to empty (Select Status option)
                    const statusField = document.getElementById('status');
                    if (statusField) {
                        statusField.value = '';
                    }
                    
                    document.querySelectorAll('.is-valid').forEach(el => {
                        el.classList.remove('is-valid');
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    toast('You can create another course or go back to courses list', { icon: 'ℹ️' });
                }
            });

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }

    // Note: Using reusable modal and toast components from dashboard/components/
    // - showConfirmationModal() for confirmations
    // - showSuccessModal() for success messages
    // - showErrorModal() for error messages
    // - showToast() for toast notifications (deprecated, use toast.success/error)

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
