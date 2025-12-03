// Create Course Form - Simple Implementation
(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('createCourseForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Module Management Elements
    const moduleInput = document.getElementById('moduleInput');
    const addModuleBtn = document.getElementById('addModuleBtn');
    const modulesList = document.getElementById('modulesList');
    const childCoursesHidden = document.getElementById('childCoursesHidden');
    let modules = [];

    // Initialize
    function init() {
        bindEvents();
        initModules();
    }

    // Initialize Modules
    function initModules() {
        // Check if there's existing data (e.g. after validation error or edit mode)
        if (childCoursesHidden && childCoursesHidden.value) {
            const existingModules = childCoursesHidden.value.split(',').map(m => m.trim()).filter(m => m);
            existingModules.forEach(addModule);
        }
    }

    // Bind Events
    function bindEvents() {
        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleCancel);
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', handleReset);
        }
        
        // Module Management Events
        if (addModuleBtn && moduleInput) {
            addModuleBtn.addEventListener('click', () => {
                addModule(moduleInput.value);
                moduleInput.value = '';
                moduleInput.focus();
            });
            
            moduleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    addModule(moduleInput.value);
                    moduleInput.value = '';
                }
            });
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

    // Add Module
    function addModule(name) {
        if (!name || !name.trim()) return;
        
        const moduleName = name.trim();
        
        // Prevent duplicates
        if (modules.includes(moduleName)) {
            toast('Module already exists', { icon: '⚠️' });
            return;
        }
        
        modules.push(moduleName);
        updateModulesHiddenInput();
        renderModule(moduleName);
        hideEmptyMessage();
    }
    
    // Render Module Chip
    function renderModule(name) {
        const chip = document.createElement('div');
        chip.className = 'badge bg-primary text-white p-2 px-3 d-flex align-items-center gap-2';
        chip.style.fontSize = '0.9rem';
        chip.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            <span>${name}</span>
            <button type="button" class="btn-close btn-close-white" style="font-size: 0.6rem;" aria-label="Remove" title="Remove ${name}"></button>
        `;
        
        // Remove button event
        chip.querySelector('.btn-close').addEventListener('click', () => {
            removeModule(name, chip);
        });
        
        modulesList.appendChild(chip);
    }
    
    // Show/Hide Empty Message
    function hideEmptyMessage() {
        const emptyMessage = document.getElementById('emptyModulesMessage');
        if (emptyMessage && modules.length > 0) {
            emptyMessage.style.display = 'none';
        }
    }
    
    function showEmptyMessage() {
        const emptyMessage = document.getElementById('emptyModulesMessage');
        if (emptyMessage && modules.length === 0) {
            emptyMessage.style.display = 'block';
        }
    }
    
    // Remove Module
    function removeModule(name, element) {
        modules = modules.filter(m => m !== name);
        updateModulesHiddenInput();
        element.remove();
        showEmptyMessage();
    }
    
    // Update Hidden Input
    function updateModulesHiddenInput() {
        if (modulesHidden) {
            modulesHidden.value = modules.join(',');
        }
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

    // Validate Form
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Handle Cancel
    function handleCancel(e) {
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
            e.preventDefault(); // Prevent default navigation
            showConfirmationModal({
                title: 'Cancel Course Creation',
                message: 'Are you sure you want to cancel? All entered data will be lost.',
                confirmText: 'Yes, Cancel',
                cancelText: 'No, Continue',
                confirmClass: 'btn-danger',
                icon: 'bi-exclamation-triangle-fill text-warning',
                onConfirm: function() {
                    window.location.href = cancelBtn.href;
                }
            });
        }
        // If no data, let the link navigate naturally
    }

    // Handle Reset
    function handleReset() {
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
                title: 'Reset Form',
                message: 'Are you sure you want to reset the form? All entered data will be cleared.',
                confirmText: 'Yes, Reset',
                cancelText: 'No, Keep Data',
                confirmClass: 'btn-warning',
                icon: 'bi-arrow-clockwise text-warning',
                onConfirm: function() {
                    resetForm();
                    toast('Form has been reset', { icon: 'ℹ️' });
                }
            });
        } else {
            resetForm();
        }
    }

    // Reset Form
    function resetForm() {
        form.reset();
        
        // Reset modules
        modules = [];
        if (modulesList) {
            modulesList.innerHTML = '<div class="text-muted small w-100 text-center" id="emptyModulesMessage">No modules added yet. Add your first module above.</div>';
        }
        if (childCoursesHidden) childCoursesHidden.value = '';
        
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
        toast.loading('Creating course...');

        // Submit the form
        form.submit();
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