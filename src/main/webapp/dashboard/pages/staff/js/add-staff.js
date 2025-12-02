/**
 * Add Staff Page - JavaScript Functions
 * Separate JS file for better organization and maintainability
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Photo preview functionality
    const staffPhotoInput = document.getElementById('staffPhoto');
    if (staffPhotoInput) {
        staffPhotoInput.addEventListener('change', function(e) {
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

    // Age validation (Staff should be at least 18)
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('change', function() {
            const age = new Date().getFullYear() - new Date(this.value).getFullYear();
            
            if (age < 18) {
                toast.error('Staff member must be at least 18 years old. Please enter a valid date of birth.');
                this.value = '';
            }
        });
    }

    // Phone number validation - Allow only digits and limit to 10
    ['phone', 'emergencyContactPhone'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        }
    });

    // Form validation and submission
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        // Real-time validation
        const requiredFields = addStaffForm.querySelectorAll('[required]');
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

        addStaffForm.addEventListener('submit', function(e) {
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
                message: 'Are you sure you want to submit this staff registration?<br><br><small class="text-muted">Please verify all information is correct before submitting.</small>',
                confirmText: 'Yes, Submit',
                cancelText: 'Review Again',
                confirmClass: 'btn-success',
                icon: 'bi-check-circle-fill text-success',
                onConfirm: function() {
                    // Show loading toast
                    const loadingToastId = toast.loading('Submitting staff registration...');
                    
                    // Submit the form
                    document.getElementById('addStaffForm').submit();
                }
            });
        });
    }

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
    item.className = 'document-item-enhanced document-item-new';
    item.id = `item_${fileId}`;
    
    // Determine icon and color based on file type
    let iconClass = 'bi-file-earmark-text';
    let iconBg = 'rgba(13, 110, 253, 0.1)';
    let iconColor = '#0d6efd';
    
    if (file.type.includes('image') || file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        iconClass = 'bi-file-earmark-image';
        iconBg = 'rgba(13, 110, 253, 0.1)';
        iconColor = '#0d6efd';
    } else if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
        iconClass = 'bi-file-earmark-pdf';
        iconBg = 'rgba(220, 53, 69, 0.1)';
        iconColor = '#dc3545';
    } else if (file.name.match(/\.(doc|docx)$/i)) {
        iconClass = 'bi-file-earmark-word';
        iconBg = 'rgba(25, 135, 84, 0.1)';
        iconColor = '#198754';
    } else if (file.name.match(/\.(xls|xlsx)$/i)) {
        iconClass = 'bi-file-earmark-excel';
        iconBg = 'rgba(25, 135, 84, 0.1)';
        iconColor = '#198754';
    }

    let optionsHtml = '<option value="">Select Document Type...</option>';
    documentTypes.forEach(type => {
        optionsHtml += `<option value="${type.value}">${type.label}</option>`;
    });

    item.innerHTML = `
        <div class="d-flex align-items-center gap-3 flex-wrap w-100">
            <div class="doc-icon-wrapper" style="background: ${iconBg}; color: ${iconColor};">
                <i class="bi ${iconClass}"></i>
            </div>
            
            <div class="doc-info-wrapper flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="doc-title mb-0" title="${file.name}">${file.name}</h6>
                    <span class="badge bg-info-subtle text-info" style="font-size: 0.7rem; padding: 3px 8px;">New</span>
                </div>
                <p class="doc-link mb-0" style="font-size: 0.85rem; color: var(--text-secondary);">
                    <i class="bi bi-clock-history me-1"></i>${formatFileSize(file.size)} • Pending Upload
                </p>
            </div>
            
            <div class="doc-type-selector" style="min-width: 220px;">
                <select class="form-select form-select-sm" style="border-radius: 8px;" onchange="assignFileType('${fileId}', this.value)">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="doc-actions-wrapper d-flex gap-2">
                <button type="button" class="btn-doc-action btn-delete" onclick="removeFile('${fileId}')" title="Remove">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </div>
    `;

    listContainer.appendChild(item);
    
    // Smooth scroll to the new item
    setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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
            item.style.borderColor = 'var(--success-color)';
            setTimeout(() => item.style.borderColor = '', 1000);
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
            const form = document.getElementById('addStaffForm');
            
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
            
            // Scroll to top of form
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            toast.success('The form has been reset successfully.');
        }
    });
}

// Certification Management
let certCounter = 0;

function addCertification() {
    certCounter++;
    const container = document.getElementById('certificationsContainer');
    
    // Hide empty state when adding first certification
    const emptyState = document.getElementById('certEmptyState');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const certId = certCounter;
    
    const certHtml = `
        <div class="certification-item-enhanced certification-new" id="cert_${certId}">
            <div class="cert-header">
                <div class="d-flex align-items-center gap-3">
                    <div class="cert-icon-wrapper">
                        <i class="bi bi-award-fill"></i>
                    </div>
                    <div>
                        <h6 class="cert-title mb-0">New Certification <span class="badge bg-info-subtle text-info ms-2" style="font-size: 0.7rem; padding: 3px 8px;">New</span></h6>
                        <p class="cert-org mb-0">Enter details below</p>
                    </div>
                </div>
                <button type="button" class="btn-cert-close" aria-label="Close" onclick="removeCertification(${certId})">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <div class="cert-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Certification Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" name="certName_${certId}" required placeholder="e.g., AWS Certified Solutions Architect">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Issuing Organization <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" name="certOrg_${certId}" required placeholder="e.g., Amazon Web Services">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Issue Date <span class="text-danger">*</span></label>
                        <input type="date" class="form-control" name="certDate_${certId}" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Expiry Date</label>
                        <input type="date" class="form-control" name="certExpiry_${certId}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Credential ID</label>
                        <input type="text" class="form-control" name="certId_${certId}" placeholder="e.g., ABC-123-XYZ">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Verification URL</label>
                        <input type="url" class="form-control" name="certUrl_${certId}" placeholder="https://...">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Certificate File</label>
                        <div class="cert-file-wrapper">
                            <input type="file" class="form-control certification-file-input" name="certFile_${certId}" accept=".pdf,.jpg,.jpeg,.png">
                            <div class="form-text small mt-2"><i class="bi bi-info-circle me-1"></i>Upload PDF or image (Max 2MB)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', certHtml);
    
    // Update indices input
    let indicesInput = document.getElementById('certificationIndices');
    if (indicesInput) {
        const current = indicesInput.value;
        indicesInput.value = current ? current + ',' + certId : certId.toString();
    }
    
    // Scroll to the new certification
    const newCert = document.getElementById(`cert_${certId}`);
    if (newCert) {
        newCert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function removeCertification(id) {
    const item = document.getElementById(`cert_${id}`);
    if (item) {
        item.remove();
        
        // Update indices input
        let indicesInput = document.getElementById('certificationIndices');
        if (indicesInput) {
            let indices = indicesInput.value.split(',').filter(i => i != id);
            indicesInput.value = indices.join(',');
        }
        
        // Show empty state if no certifications left
        const container = document.getElementById('certificationsContainer');
        const emptyState = document.getElementById('certEmptyState');
        if (container && emptyState && container.children.length === 0) {
            emptyState.style.display = 'block';
        }
    }
}
