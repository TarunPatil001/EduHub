/**
 * Add Student Page - JavaScript Functions
 * Separate JS file for better organization and maintainability
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Photo preview functionality
    const studentPhotoInput = document.getElementById('studentPhoto');
    if (studentPhotoInput) {
        studentPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Photo size should not exceed 2MB. Please select a smaller file.');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('photoPlaceholder').style.display = 'none';
                const preview = document.getElementById('photoPreview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    // Age validation
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('change', function() {
            const age = new Date().getFullYear() - new Date(this.value).getFullYear();
            
            if (age < 15) {
                toast.error('Student must be at least 15 years old to register. Please enter a valid date of birth.');
                this.value = '';
            }
        });
    }

    // Phone number validation - Allow only digits and limit to 10
    ['mobileNumber', 'whatsappNumber', 'parentMobile'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        }
    });

    // Form validation and submission
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        // Real-time validation
        const requiredFields = addStudentForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            if (field.type === 'checkbox' || field.type === 'radio' || field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    validateField(this);
                });
            } else {
                field.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            }
        });

        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                toast('Please fill in all required fields correctly.', { icon: '⚠️' });
                
                const firstError = this.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }
            
            showConfirmationModal({
                title: 'Submit Registration',
                message: 'Are you sure you want to submit this student registration?<br><br><small class="text-muted">Please verify all information is correct before submitting.</small>',
                confirmText: 'Yes, Submit',
                cancelText: 'Review Again',
                confirmClass: 'btn-success',
                icon: 'bi-check-circle-fill text-success',
                onConfirm: function() {
                    // Show loading toast
                    const loadingToastId = toast.loading('Submitting student registration...');
                    
                    // Simulate form submission
                    setTimeout(() => {
                        // Dismiss loading toast
                        toast.dismiss(loadingToastId);
                        
                        toast.success('Student registration has been submitted successfully!');
                        // document.getElementById('addStudentForm').submit(); // Uncomment when backend is ready
                    }, 1000);
                }
            });
        });
    }

    // Initialize Year Picker
    initializeYearPicker();

    // Initialize New File Upload System
    initializeFileUploadSystem();
});

// Global state for file uploads
const uploadedFiles = new Map();
// Use server-provided types if available, otherwise fallback to empty array
const documentTypes = (typeof SERVER_DOCUMENT_TYPES !== 'undefined') ? SERVER_DOCUMENT_TYPES : [];

/**
 * Initialize the drag and drop file upload system
 */
function initializeFileUploadSystem() {
    const dropZone = document.getElementById('dropZone');
    const multiFileTrigger = document.getElementById('multiFileTrigger');
    
    if (!dropZone || !multiFileTrigger) return;

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    multiFileTrigger.addEventListener('change', handleFileSelect, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
    // Reset input so same files can be selected again if needed
    e.target.value = ''; 
}

function handleFiles(files) {
    ([...files]).forEach(file => {
        // Validate file size (50MB as per new requirement)
        if (file.size > 50 * 1024 * 1024) {
            toast.error(`File "${file.name}" exceeds 50MB limit.`);
            return;
        }
        
        // Validate file type
        const validTypes = [
            'application/pdf', 
            'image/jpeg', 
            'image/png', 
            'image/jpg', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        // Simple check for extension if mime type check is too strict
        const extension = file.name.split('.').pop().toLowerCase();
        const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'xlsx', 'xls'];
        
        if (!validExtensions.includes(extension)) {
            toast.error(`File "${file.name}" has unsupported format.`);
            return;
        }

        addFileToList(file);
    });
}

function addFileToList(file) {
    const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    uploadedFiles.set(fileId, { file: file, type: null });

    const listContainer = document.getElementById('documentList');
    const item = document.createElement('div');
    item.className = 'document-item';
    item.id = `item_${fileId}`;
    
    // Determine icon
    let iconClass = 'bi-file-earmark-text';
    let iconTypeClass = '';
    if (file.type.includes('image')) {
        iconClass = 'bi-file-earmark-image';
        iconTypeClass = 'image';
    } else if (file.type.includes('pdf')) {
        iconClass = 'bi-file-earmark-pdf';
    } else if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        iconClass = 'bi-file-earmark-spreadsheet';
        iconTypeClass = 'image'; // Reusing blue color style
    }

    // Build dropdown options
    let optionsHtml = '<option value="">Select Document Type...</option>';
    documentTypes.forEach(type => {
        optionsHtml += `<option value="${type.value}">${type.label}</option>`;
    });

    item.innerHTML = `
        <div class="doc-icon ${iconTypeClass}">
            <i class="bi ${iconClass}"></i>
        </div>
        <div class="doc-info">
            <div class="doc-name" title="${file.name}">${file.name}</div>
            <div class="doc-size">${formatFileSize(file.size)}</div>
        </div>
        <select class="form-select form-select-sm doc-type-select" onchange="assignFileType('${fileId}', this.value)">
            ${optionsHtml}
        </select>
        <div class="doc-actions">
            <button type="button" class="btn-remove-file" onclick="removeFile('${fileId}')" title="Remove file">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    listContainer.appendChild(item);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function assignFileType(fileId, type) {
    const fileData = uploadedFiles.get(fileId);
    if (!fileData) return;

    // If changing from an existing type, clear the old input
    if (fileData.type) {
        const oldInput = document.getElementById(fileData.type);
        if (oldInput) oldInput.value = '';
    }

    fileData.type = type;
    
    if (type) {
        // Check if another file already has this type
        for (const [id, data] of uploadedFiles.entries()) {
            if (id !== fileId && data.type === type) {
                // Reset the other file's selection
                data.type = null;
                const otherSelect = document.querySelector(`#item_${id} select`);
                if (otherSelect) otherSelect.value = '';
                toast.warning(`Document type reassigned to new file.`);
            }
        }

        // Assign file to hidden input
        const input = document.getElementById(type);
        if (input) {
            const dt = new DataTransfer();
            dt.items.add(fileData.file);
            input.files = dt.files;
            
            // Visual feedback
            const item = document.getElementById(`item_${fileId}`);
            item.style.borderColor = '#198754';
            setTimeout(() => item.style.borderColor = '#edf2f9', 1000);
        }
    }
}

function removeFile(fileId) {
    const fileData = uploadedFiles.get(fileId);
    if (fileData && fileData.type) {
        const input = document.getElementById(fileData.type);
        if (input) input.value = '';
    }
    
    uploadedFiles.delete(fileId);
    const item = document.getElementById(`item_${fileId}`);
    if (item) {
        item.remove();
    }
}

/**
 * Copy permanent address to current address
 */
function copyPermanentAddress() {
    document.getElementById('currentAddress').value = document.getElementById('permanentAddress').value;
}

/**
 * Copy mobile number to WhatsApp number
 */
function copySameAsMobile() {
    if (document.getElementById('sameAsMobile').checked) {
        document.getElementById('whatsappNumber').value = document.getElementById('mobileNumber').value;
    }
}

/**
 * Toggle medical details section
 * @param {boolean} show - Whether to show or hide the section
 */
function toggleMedicalDetails(show) {
    const section = document.getElementById('medicalDetailsSection');
    section.style.display = show ? 'block' : 'none';
    
    if (!show) {
        document.getElementById('medicalCondition').value = '';
        document.getElementById('medicineName').value = '';
        document.getElementById('medicinePrescription').value = '';
    }
}

/**
 * Validate a single field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    let isValid = true;
    const isRequired = field.hasAttribute('required');

    if (field.type === 'checkbox') {
        isValid = !isRequired || field.checked;
    } else if (field.type === 'radio') {
        if (field.name) {
            const group = document.querySelectorAll(`input[name="${field.name}"]`);
            let isChecked = false;
            group.forEach(r => { if (r.checked) isChecked = true; });
            isValid = !isRequired || isChecked;
            
            // Update UI for all in group
            group.forEach(r => {
                if (!isValid) {
                    r.classList.add('is-invalid');
                    r.classList.remove('is-valid');
                } else {
                    r.classList.remove('is-invalid');
                    r.classList.add('is-valid');
                }
            });
            return isValid;
        } else {
            isValid = !isRequired || field.checked;
        }
    } else {
        isValid = !isRequired || !!field.value.trim();
    }

    if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        return true;
    }
}

/**
 * Reset form with confirmation
 */
function resetForm() {
    showConfirmationModal({
        title: 'Reset Form',
        message: 'Are you sure you want to reset the form?<br><br><strong class="text-danger">All entered data will be lost!</strong>',
        confirmText: 'Yes, Reset',
        cancelText: 'Keep Data',
        confirmClass: 'btn-danger',
        icon: 'bi-exclamation-triangle-fill text-danger',
        onConfirm: function() {
            const form = document.getElementById('addStudentForm');
            
            // Reset the form
            form.reset();
            form.classList.remove('was-validated');
            
            // Remove custom validation classes
            form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset photo preview
            const photoPlaceholder = document.getElementById('photoPlaceholder');
            const photoPreview = document.getElementById('photoPreview');
            if (photoPlaceholder) photoPlaceholder.style.display = 'block';
            if (photoPreview) {
                photoPreview.style.display = 'none';
                photoPreview.src = '';
            }
            
            // Reset medical details section
            const medicalSection = document.getElementById('medicalDetailsSection');
            if (medicalSection) {
                medicalSection.style.display = 'none';
            }
            
            // Uncheck "same as mobile" checkbox if exists
            const sameAsMobileCheckbox = document.getElementById('sameAsMobile');
            if (sameAsMobileCheckbox) {
                sameAsMobileCheckbox.checked = false;
            }
            
            // Reset terms and conditions checkbox
            const termsCheckbox = document.getElementById('termsConditions');
            if (termsCheckbox) {
                termsCheckbox.checked = false;
            }
            
            // Scroll to top of form
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            toast.success('The form has been reset successfully.');
        }
    });
}

/**
 * Initialize Year Picker
 */
function initializeYearPicker() {
    const yearPickerInput = document.getElementById('passingYear');
    
    // Check if the year picker input exists before initializing
    if (!yearPickerInput) {
        return;
    }
    
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 15;
    const minYear = 1950;
    let selectedYear = null;
    let displayRangeStart = Math.floor((currentYear - 5) / 12) * 12;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'year-picker-dropdown';
    document.body.appendChild(dropdown);
    
    function formatAcademicYear(year) {
        const nextYear = year + 1;
        return `${year}-${nextYear.toString().slice(-2)}`;
    }
    
    function renderYearPicker() {
        const endYear = displayRangeStart + 11;
        dropdown.innerHTML = `
            <div class="year-picker-header">
                <button type="button" class="year-picker-nav" data-action="prev">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <span>${displayRangeStart} - ${endYear}</span>
                <button type="button" class="year-picker-nav" data-action="next">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="year-picker-grid" id="yearGrid"></div>
        `;
        
        dropdown.querySelector('[data-action="prev"]').addEventListener('click', (e) => {
            e.stopPropagation();
            changeYearRange(-12);
        });
        dropdown.querySelector('[data-action="next"]').addEventListener('click', (e) => {
            e.stopPropagation();
            changeYearRange(12);
        });
        
        const grid = dropdown.querySelector('#yearGrid');
        for (let year = displayRangeStart; year <= endYear; year++) {
            const yearItem = document.createElement('div');
            yearItem.className = 'year-picker-item';
            yearItem.setAttribute('data-year', year);
            
            if (year === currentYear) yearItem.classList.add('current');
            if (year === selectedYear) yearItem.classList.add('selected');
            
            if (year < minYear || year > maxYear) {
                yearItem.style.opacity = '0.3';
                yearItem.style.pointerEvents = 'none';
            } else {
                yearItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectYear(year);
                });
            }
            
            // Display in academic year format (2024-25)
            yearItem.textContent = formatAcademicYear(year);
            grid.appendChild(yearItem);
        }
    }
    
    function changeYearRange(offset) {
        displayRangeStart = Math.max(minYear, Math.min(displayRangeStart + offset, Math.floor(maxYear / 12) * 12));
        renderYearPicker();
    }
    
    function selectYear(year) {
        selectedYear = year;
        // Display in academic year format (2024-25)
        yearPickerInput.value = formatAcademicYear(year);
        dropdown.classList.remove('show');
        yearPickerInput.dispatchEvent(new Event('change'));
    }
    
    // Initialize the year picker with years on page load
    renderYearPicker();
    
    // Function to position dropdown
    function positionDropdown() {
        const rect = yearPickerInput.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 5}px`;
        dropdown.style.left = `${rect.left}px`;
    }
    
    yearPickerInput.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!dropdown.classList.contains('show')) {
            displayRangeStart = Math.floor(((selectedYear || currentYear) - 5) / 12) * 12;
            renderYearPicker();
            positionDropdown();
            dropdown.classList.add('show');
        } else {
            dropdown.classList.remove('show');
        }
    });
    
    // Reposition dropdown on scroll and resize
    window.addEventListener('scroll', function() {
        if (dropdown.classList.contains('show')) {
            positionDropdown();
        }
    }, true);
    
    window.addEventListener('resize', function() {
        if (dropdown.classList.contains('show')) {
            positionDropdown();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!yearPickerInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}
