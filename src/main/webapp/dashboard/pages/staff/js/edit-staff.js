/**
 * Edit Staff Page - JavaScript Functions
 * Based on add-staff.js but adapted for editing existing records
 */

// Global state
let certCounter = 0; // Will be initialized from JSP
const uploadedFiles = new Map();
// Use server-provided types if available, otherwise fallback to empty array
const documentTypes = (typeof SERVER_DOCUMENT_TYPES !== 'undefined') ? SERVER_DOCUMENT_TYPES : [];

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize certCounter from the hidden input or global variable if set
    if (typeof INITIAL_CERT_COUNT !== 'undefined') {
        certCounter = INITIAL_CERT_COUNT;
    }

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
                const placeholder = document.getElementById('photoPlaceholder');
                if (placeholder) placeholder.style.display = 'none';
                
                const preview = document.getElementById('photoPreview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                }
                
                // Also update the existing photo if present
                const currentPhoto = document.querySelector('.current-photo');
                if (currentPhoto) currentPhoto.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    // Age validation
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('change', function() {
            const age = new Date().getFullYear() - new Date(this.value).getFullYear();
            if (age < 18) {
                toast.error('Staff member must be at least 18 years old.');
                this.value = '';
            }
        });
    }

    // Phone validation
    ['phone', 'emergencyContactPhone'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        }
    });

    // Role Mapping based on Department
    const roleMapping = {
        "Trainer": ["Technical Trainer", "Programming Trainer", "Soft Skills Trainer"],
        "HR & Admin": ["HR Executive", "HR Manager", "Front Desk"],
        "Placement": ["Placement Officer", "Placement Coordinator"],
        "Accounts": ["Accountant"],
        "Technical Support": ["IT Support", "Lab Assistant"],
        "Management": ["Branch Manager"]
    };

    const departmentSelect = document.getElementById('department');
    const roleSelect = document.getElementById('role');

    if (departmentSelect && roleSelect) {
        // Store the initial role value from the rendered HTML (which has the correct option selected)
        const initialRole = roleSelect.value;

        function updateRoles(selectedDept, selectedRole) {
            const roles = roleMapping[selectedDept] || ["Other"];
            
            // Clear existing options
            roleSelect.innerHTML = '<option value="" disabled>Select Role</option>';
            
            // Add new options
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                if (role === selectedRole) {
                    option.selected = true;
                }
                roleSelect.appendChild(option);
            });
        }

        // Initial update to filter roles based on current department, but keep current role selected
        if (departmentSelect.value) {
            updateRoles(departmentSelect.value, initialRole);
        }

        departmentSelect.addEventListener('change', function() {
            updateRoles(this.value, null); // Reset role when department changes
        });
    }

    // Form validation
    const editStaffForm = document.getElementById('editStaffForm');
    if (editStaffForm) {
        const requiredFields = editStaffForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => validateField(field));
            } else {
                field.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) validateField(this);
                });
            }
        });

        editStaffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) isValid = false;
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

            // Check for unassigned new files
            const newItems = document.querySelectorAll('.document-item-new');
            let unassignedFiles = false;
            newItems.forEach(item => {
                const select = item.querySelector('select');
                if (select && !select.value) {
                    select.classList.add('is-invalid');
                    unassignedFiles = true;
                }
            });
            
            if (unassignedFiles) {
                toast.error('Please select a document type for all new files.');
                return;
            }
            
            showConfirmationModal({
                title: 'Update Staff Member',
                message: 'Are you sure you want to update this staff member\'s details?',
                confirmText: 'Yes, Update',
                cancelText: 'Cancel',
                confirmClass: 'btn-primary',
                icon: 'bi-pencil-square text-primary',
                onConfirm: function() {
                    const loadingToastId = toast.loading('Updating staff details...');
                    document.getElementById('editStaffForm').submit();
                }
            });
        });
    }

    // Initialize File Upload System
    initializeFileUploadSystem();
});

// --- File Upload Logic (Same as add-staff.js) ---

function initializeFileUploadSystem() {
    const dropZone = document.getElementById('dropZone');
    const multiFileTrigger = document.getElementById('multiFileTrigger');
    
    if (!dropZone || !multiFileTrigger) return;

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
    e.target.value = ''; 
}

function handleFiles(files) {
    ([...files]).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
            toast.error(`File "${file.name}" exceeds 50MB limit.`);
            return;
        }
        
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
    
    // Update document count
    updateDocumentCount();
    
    // Smooth scroll to the new item
    setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function updateDocumentCount() {
    const existingSection = document.querySelector('.existing-documents-section');
    if (!existingSection) {
        // Create the section if it doesn't exist
        const listContainer = document.getElementById('documentList');
        if (listContainer && listContainer.children.length > 0) {
            const sectionHtml = `
                <div class="existing-documents-section mt-4 mb-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h6 class="mb-0" style="color: var(--text-primary); font-weight: 600;">
                            <i class="bi bi-files me-2" style="color: var(--primary-color);"></i>Documents
                        </h6>
                        <span class="badge bg-primary-subtle text-primary px-3 py-2 document-count-badge" style="font-size: 0.85rem;">0 files</span>
                    </div>
                </div>
            `;
            listContainer.insertAdjacentHTML('beforebegin', sectionHtml);
        }
    }
    
    // Count all document items
    const documentList = document.getElementById('documentList');
    if (documentList) {
        const totalDocs = documentList.querySelectorAll('.document-item-enhanced').length;
        const badge = document.querySelector('.document-count-badge');
        if (badge) {
            badge.textContent = `${totalDocs} file${totalDocs !== 1 ? 's' : ''}`;
        }
    }
}

function updateCertificationCount() {
    const existingSection = document.querySelector('.existing-certifications-section');
    if (!existingSection) {
        // Create the section if it doesn't exist
        const container = document.getElementById('certificationsContainer');
        if (container && container.children.length > 0) {
            const sectionHtml = `
                <div class="existing-certifications-section mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="section-icon-wrapper" style="width: 40px; height: 40px; background: rgba(13, 110, 253, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary-color);">
                                <i class="bi bi-award-fill" style="font-size: 1.2rem;"></i>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <h6 class="mb-0" style="color: var(--text-primary); font-weight: 600;">Certifications</h6>
                                <span class="badge bg-primary-subtle text-primary px-3 py-2 certification-count-badge" style="font-size: 0.85rem;">0 certifications</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="addCertification()" style="border-radius: 8px; padding: 0.5rem 1.25rem;">
                            <i class="bi bi-plus-circle me-2"></i>Add New
                        </button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforebegin', sectionHtml);
        }
    }
    
    // Count all certification items
    const certContainer = document.getElementById('certificationsContainer');
    if (certContainer) {
        const totalCerts = certContainer.querySelectorAll('.certification-item-enhanced').length;
        const badge = document.querySelector('.certification-count-badge');
        if (badge) {
            badge.textContent = `${totalCerts} certification${totalCerts !== 1 ? 's' : ''}`;
        }
    }
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

    if (fileData.type) {
        const oldInput = document.getElementById(fileData.type);
        if (oldInput) oldInput.value = '';
    }

    fileData.type = type;
    
    if (type) {
        // Check for duplicates in new files
        for (const [id, data] of uploadedFiles.entries()) {
            if (id !== fileId && data.type === type) {
                data.type = null;
                const otherSelect = document.querySelector(`#item_${id} select`);
                if (otherSelect) otherSelect.value = '';
                toast.warning(`Document type reassigned to new file.`);
            }
        }

        // Assign to hidden input
        const input = document.getElementById(type);
        if (input) {
            const dt = new DataTransfer();
            dt.items.add(fileData.file);
            input.files = dt.files;
            
            const item = document.getElementById(`item_${fileId}`);
            item.classList.add('border-success');
            setTimeout(() => item.classList.remove('border-success'), 1000);
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
        // Update document count after removal
        updateDocumentCount();
        
        // Hide section if no documents left
        const documentList = document.getElementById('documentList');
        if (documentList && documentList.children.length === 0) {
            const existingSection = document.querySelector('.existing-documents-section');
            if (existingSection) {
                existingSection.remove();
            }
        }
    }
}

// --- Certification Management ---

function addCertification() {
    certCounter++;
    const container = document.getElementById('certificationsContainer');
    const indicesInput = document.getElementById('certificationIndices');
    
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
                        <input type="text" class="form-control" name="certId_${certId}_val" placeholder="e.g., ABC-123-XYZ">
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
    
    // Update indices
    if (indicesInput.value) {
        indicesInput.value += ',' + certId;
    } else {
        indicesInput.value = certId;
    }
    
    // Update certification count
    updateCertificationCount();
    
    // Scroll to the new certification
    const newCert = document.getElementById(`cert_${certId}`);
    if (newCert) {
        newCert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Remove NEW certification (not saved in DB yet)
function removeCertification(id) {
    const item = document.getElementById(`cert_${id}`);
    if (item) {
        item.remove();
        
        // Update indices
        const indicesInput = document.getElementById('certificationIndices');
        let indices = indicesInput.value.split(',');
        indices = indices.filter(idx => idx != id);
        indicesInput.value = indices.join(',');
        
        // Update certification count
        updateCertificationCount();
        
        // Show empty state and hide section if no certifications left
        const container = document.getElementById('certificationsContainer');
        if (container && container.children.length === 0) {
            const existingSection = document.querySelector('.existing-certifications-section');
            if (existingSection) {
                existingSection.remove();
            }
            const emptyState = document.getElementById('certEmptyState');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }
}

// Mark EXISTING certification for deletion
function markCertificationForDeletion(certId, domId) {
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Remove Certification',
            message: 'Are you sure you want to remove this certification? This action cannot be undone.',
            confirmText: 'Remove',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                const item = document.getElementById(`cert_${domId}`);
                if (item) {
                    item.style.display = 'none';
                    
                    // Add to deleted list
                    const deletedInput = document.getElementById('deletedCertificationIds');
                    if (deletedInput.value) {
                        deletedInput.value += ',' + certId;
                    } else {
                        deletedInput.value = certId;
                    }
                    
                    // Remove from indices to prevent processing
                    const indicesInput = document.getElementById('certificationIndices');
                    let indices = indicesInput.value.split(',');
                    indices = indices.filter(idx => idx != domId);
                    indicesInput.value = indices.join(',');
                    
                    // Update certification count
                    updateCertificationCount();
                    
                    if (typeof toast !== 'undefined') {
                        toast.success('Certification marked for removal');
                    }
                }
            }
        });
    } else {
        if (confirm('Are you sure you want to remove this certification?')) {
            const item = document.getElementById(`cert_${domId}`);
            if (item) {
                item.style.display = 'none';
                
                // Add to deleted list
                const deletedInput = document.getElementById('deletedCertificationIds');
                if (deletedInput.value) {
                    deletedInput.value += ',' + certId;
                } else {
                    deletedInput.value = certId;
                }
                
                // Remove from indices to prevent processing
                const indicesInput = document.getElementById('certificationIndices');
                let indices = indicesInput.value.split(',');
                indices = indices.filter(idx => idx != domId);
                indicesInput.value = indices.join(',');
                
                // Update certification count
                updateCertificationCount();
            }
        }
    }
}

// Mark EXISTING document for deletion
function markDocumentForDeletion(docId) {
    if (typeof showConfirmationModal === 'function') {
        showConfirmationModal({
            title: 'Remove Document',
            message: 'Are you sure you want to remove this document? This action cannot be undone.',
            confirmText: 'Remove',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                const item = document.getElementById(`doc_${docId}`);
                if (item) {
                    item.style.display = 'none';
                    
                    // Add to deleted list
                    const deletedInput = document.getElementById('deletedDocumentIds');
                    if (deletedInput.value) {
                        deletedInput.value += ',' + docId;
                    } else {
                        deletedInput.value = docId;
                    }
                    
                    // Update document count
                    updateDocumentCount();
                    
                    if (typeof toast !== 'undefined') {
                        toast.success('Document marked for removal');
                    }
                }
            }
        });
    } else {
        if (confirm('Are you sure you want to remove this document?')) {
            const item = document.getElementById(`doc_${docId}`);
            if (item) {
                item.style.display = 'none';
                
                // Add to deleted list
                const deletedInput = document.getElementById('deletedDocumentIds');
                if (deletedInput.value) {
                    deletedInput.value += ',' + docId;
                } else {
                    deletedInput.value = docId;
                }
                
                // Update document count
                updateDocumentCount();
            }
        }
    }
}

function triggerReplacement(docId) {
    const input = document.getElementById(`replace_${docId}`);
    if (input) input.click();
}

function handleReplacement(input, docId) {
    const item = document.getElementById(`doc_${docId}`);
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Find the title element
        const titleEl = item.querySelector('.doc-title');
        const linkEl = item.querySelector('.doc-link');
        const badgeEl = item.querySelector('.badge');
        
        if (titleEl) {
            const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
            titleEl.textContent = file.name;
            titleEl.title = file.name;
        }
        
        if (badgeEl) {
            badgeEl.className = 'badge bg-warning-subtle text-warning';
            badgeEl.style.fontSize = '0.7rem';
            badgeEl.style.padding = '3px 8px';
            badgeEl.textContent = 'Replacing';
        }
        
        if (linkEl) {
            linkEl.innerHTML = `<i class="bi bi-clock-history me-1"></i>${formatFileSize(file.size)} • Pending Upload`;
            linkEl.style.pointerEvents = 'none';
            linkEl.style.opacity = '0.7';
        }
        
        // Visual feedback
        item.style.borderColor = 'var(--warning-color)';
        item.style.background = 'rgba(255, 193, 7, 0.05)';
        
        toast.success('File selected for replacement');
    }
}

function handleCertFileSelect(input, id) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const wrapper = document.getElementById(`certFileWrapper_${id}`);
        const infoDiv = document.getElementById(`certReplacementInfo_${id}`);
        const currentDiv = wrapper.querySelector('.current-cert-file');
        
        if (infoDiv) {
            infoDiv.querySelector('.filename').textContent = file.name;
            infoDiv.style.display = 'block';
        }
        
        if (currentDiv) {
            currentDiv.style.opacity = '0.5';
            currentDiv.style.pointerEvents = 'none'; // Disable interaction with old file
        }
    }
}

function cancelCertReplacement(id) {
    const input = document.getElementById(`certFile_${id}`);
    const infoDiv = document.getElementById(`certReplacementInfo_${id}`);
    const wrapper = document.getElementById(`certFileWrapper_${id}`);
    const currentDiv = wrapper.querySelector('.current-cert-file');
    
    if (input) input.value = '';
    if (infoDiv) infoDiv.style.display = 'none';
    if (currentDiv) {
        currentDiv.style.opacity = '1';
        currentDiv.style.pointerEvents = 'auto';
    }
}

function validateField(field) {
    let isValid = true;
    const isRequired = field.hasAttribute('required');

    if (field.type === 'checkbox') {
        isValid = !isRequired || field.checked;
    } else if (field.tagName === 'SELECT') {
        isValid = !isRequired || !!field.value;
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
