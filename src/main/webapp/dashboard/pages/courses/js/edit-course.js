// Edit Course Form
(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('editCourseForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Module Management Elements
    const moduleInput = document.getElementById('moduleInput');
    const addModuleBtn = document.getElementById('addModuleBtn');
    const modulesList = document.getElementById('modulesList');
    const modulesHidden = document.getElementById('modulesHidden');
    let modules = [];

    // Initialize
    function init() {
        bindEvents();
        initModules();
    }
    
    // Initialize Modules
    function initModules() {
        // Check if there's existing data
        if (modulesHidden && modulesHidden.value) {
            const existingModules = modulesHidden.value.split(',').map(m => m.trim()).filter(m => m);
            existingModules.forEach(addModule);
        }
    }

    // Bind Events
    function bindEvents() {
        // Form submission
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleCancel);
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
        if (form) {
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
    }

    // Add Module
    function addModule(name) {
        if (!name || !name.trim()) return;
        
        const moduleName = name.trim();
        
        // Prevent duplicates
        if (modules.includes(moduleName)) {
            if (typeof toast !== 'undefined') {
                toast('Module already exists', { icon: '⚠️' });
            }
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
        // Check if form has changed (simple check)
        // For a more robust check, we'd need to store initial values
        // For now, just confirm if they want to leave
        
        e.preventDefault(); // Prevent default navigation
        
        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal({
                title: 'Cancel Editing',
                message: 'Are you sure you want to cancel? Any unsaved changes will be lost.',
                confirmText: 'Yes, Cancel',
                cancelText: 'No, Continue Editing',
                confirmClass: 'btn-secondary',
                icon: 'bi-exclamation-circle text-secondary',
                onConfirm: function() {
                    window.location.href = cancelBtn.href;
                }
            });
        } else {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = cancelBtn.href;
            }
        }
    }

    // Handle Form Submit
    function handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            if (typeof toast !== 'undefined') {
                toast.error('Please fill in all required fields correctly');
            }
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
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Updating Course...';
        
        if (typeof toast !== 'undefined') {
            toast.loading('Updating course...');
        }

        // Prepare data
        const formData = new FormData(form);
        
        // Handle duration combination if needed (value + unit)
        const durationValue = document.getElementById('durationValue');
        const durationUnit = document.getElementById('durationUnit');
        if (durationValue && durationUnit) {
            formData.set('duration', `${durationValue.value} ${durationUnit.value}`);
        }

        // Convert to URLSearchParams
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataUrlEncoded = new URLSearchParams(plainFormData);

        // Submit via Fetch
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formDataUrlEncoded
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to all courses with status and message params (handled by JSP)
                // Use contextPath if available, otherwise construct relative path
                const basePath = (typeof contextPath !== 'undefined') ? contextPath : '/EduHub';
                const message = encodeURIComponent('Course updated successfully!');
                window.location.href = `${basePath}/dashboard/pages/courses/all-courses.jsp?status=success&message=${message}`;
            } else {
                throw new Error(data.message || 'Failed to update course');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (typeof toast !== 'undefined') {
                toast.error(error.message || 'An unexpected error occurred. Please try again.');
            } else {
                alert(error.message || 'An unexpected error occurred. Please try again.');
            }
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
