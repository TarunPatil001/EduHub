/**
 * Add Student Page - Interactive Logic
 * Handles file uploads, drag & drop, and form validation
 */

// Global state for file uploads
const uploadedFiles = new Map();
// Use server-provided types if available, otherwise fallback to empty array
const documentTypes = (typeof SERVER_DOCUMENT_TYPES !== 'undefined') ? SERVER_DOCUMENT_TYPES : [];
let documentCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPhotoUpload();
    initializeFileUploadSystem();
    initFormValidation();
    initYearPicker();
    initAddressCopy();
    initBatchSelection();
    checkEditMode();
});

/**
 * Check if in Edit Mode and load data
 */
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    
    if (studentId) {
        // Update UI for Edit Mode
        document.title = "Edit Student - Dashboard - EduHub";
        const pageTitle = document.querySelector('.page-title-container h2');
        if (pageTitle) pageTitle.textContent = "Edit Student Details";
        
        const pageDesc = document.querySelector('.page-title-container p');
        if (pageDesc) pageDesc.textContent = "Update student information";
        
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Update Student';
        
        // Update Form Action
        const form = document.getElementById('addStudentForm');
        if (form) {
            form.action = `${CONTEXT_PATH}/api/students/update`;
            // Add hidden input for studentId
            const idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'studentId';
            idInput.value = studentId;
            form.appendChild(idInput);
        }
        
        // Fetch and Populate Data
        loadStudentDetails(studentId);
    }
}

function loadStudentDetails(studentId) {
    fetch(`${CONTEXT_PATH}/api/students/get?id=${studentId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch student details');
            return response.json();
        })
        .then(student => {
            populateForm(student);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to load student details', 'error');
        });
}

function populateForm(student) {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };
    
    setVal('studentName', student.studentName);
    setVal('fatherName', student.fatherName);
    setVal('surname', student.surname);
    setVal('dateOfBirth', student.dateOfBirth);
    setVal('gender', student.gender);
    setVal('bloodGroup', student.bloodGroup);
    setVal('mobileNumber', student.mobileNumber);
    setVal('whatsappNumber', student.whatsappNumber);
    setVal('parentMobile', student.parentMobile);
    setVal('emailId', student.emailId);
    setVal('instagramId', student.instagramId);
    setVal('linkedinId', student.linkedinId);
    setVal('permanentAddress', student.permanentAddress);
    setVal('currentAddress', student.currentAddress);
    setVal('collegeName', student.collegeName);
    setVal('educationQualification', student.educationQualification);
    setVal('specialization', student.specialization);
    setVal('passingYear', student.passingYear);
    setVal('studentStatus', student.studentStatus);
    setVal('feesAllowed', student.feesAllowed || 'NO');
    
    // Batch Selection
    const batchSelect = document.getElementById('batchCode');
    if (batchSelect && student.batchId) {
        batchSelect.dataset.pendingBatchId = student.batchId;
        // Try to set immediately if options are already loaded (unlikely but possible)
        const options = Array.from(batchSelect.options);
        const matchingOption = options.find(opt => opt.dataset.batchId === student.batchId);
        if (matchingOption) {
            batchSelect.value = matchingOption.value;
            batchSelect.dispatchEvent(new Event('change'));
            delete batchSelect.dataset.pendingBatchId;
        }
    }
    
    // Medical Info
    if (student.medicalHistory) {
        const yesRadio = document.getElementById('medicalHistoryYes');
        if (yesRadio) {
            yesRadio.checked = true;
            toggleMedicalDetails(true);
        }
        setVal('medicalCondition', student.medicalCondition);
        setVal('medicineName', student.medicineName);
    } else {
        const noRadio = document.getElementById('medicalHistoryNo');
        if (noRadio) {
            noRadio.checked = true;
            toggleMedicalDetails(false);
        }
    }
    
    // Declaration
    if (student.studentDeclaration) {
        const decl = document.getElementById('studentDeclaration');
        if (decl) decl.checked = true;
    }
    
    // Photo Preview
    if (student.profilePhotoUrl) {
        const photoPreview = document.getElementById('photoPreview');
        const photoPlaceholder = document.getElementById('photoPlaceholder');
        if (photoPreview && photoPlaceholder) {
            photoPreview.src = student.profilePhotoUrl;
            photoPreview.style.display = 'block';
            photoPlaceholder.style.display = 'none';
        }
    }

    // Documents
    if (student.documents && student.documents.length > 0) {
        const listContainer = document.getElementById('documentList');
        // Clear list if it's not empty (though it should be on load)
        if (listContainer) listContainer.innerHTML = ''; 
        
        student.documents.forEach(doc => {
            addExistingDocument(doc);
        });
    }
}

/**
 * Initialize Batch Selection and Auto-population
 */
function initBatchSelection() {
    const batchSelect = document.getElementById('batchCode');
    const batchNameInput = document.getElementById('batchName');
    const batchIdInput = document.getElementById('batchId');
    const courseInput = document.getElementById('courseEnrolled');
    
    if (!batchSelect) return;

    // Load batches from server
    // Fetching all batches to ensure we see what's available. 
    fetch(`${CONTEXT_PATH}/api/batches/list?pageSize=100`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Batches loaded:', data); // Debug log
            if (data && data.batches && data.batches.length > 0) {
                // Clear existing options except the first one
                while (batchSelect.options.length > 1) {
                    batchSelect.remove(1);
                }
                
                data.batches.forEach(batch => {
                    // Only show Active or Upcoming batches
                    if (batch.status === 'Active' || batch.status === 'Upcoming') {
                        const option = document.createElement('option');
                        option.value = batch.batchCode; 
                        option.textContent = `${batch.batchCode} - ${batch.batchName} (${batch.status})`;
                        
                        // Store additional data
                        option.dataset.batchId = batch.batchId;
                        option.dataset.batchName = batch.batchName;
                        option.dataset.courseName = batch.courseName || '';
                        
                        batchSelect.appendChild(option);
                    }
                });
                
                if (batchSelect.options.length <= 1) {
                    showToast('No Active or Upcoming batches found', 'warning');
                }
                
                // Check for pending selection (Edit Mode)
                if (batchSelect.dataset.pendingBatchId) {
                    const options = Array.from(batchSelect.options);
                    const matchingOption = options.find(opt => opt.dataset.batchId === batchSelect.dataset.pendingBatchId);
                    if (matchingOption) {
                        batchSelect.value = matchingOption.value;
                        batchSelect.dispatchEvent(new Event('change'));
                    }
                    delete batchSelect.dataset.pendingBatchId;
                }
            } else {
                toast.error('No batches found in the system');
            }
        })
        .catch(error => {
            console.error('Error loading batches:', error);
            toast.error('Failed to load batches. Please try again.');
        });

    // Handle selection change
    batchSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        
        if (selectedOption.value) {
            if (batchNameInput) batchNameInput.value = selectedOption.dataset.batchName || '';
            if (batchIdInput) batchIdInput.value = selectedOption.dataset.batchId || '';
            if (courseInput) courseInput.value = selectedOption.dataset.courseName || '';
        } else {
            if (batchNameInput) batchNameInput.value = '';
            if (batchIdInput) batchIdInput.value = '';
            if (courseInput) courseInput.value = '';
        }
    });
}

/**
 * Initialize Profile Photo Upload
 */
function initPhotoUpload() {
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    
    if (!photoInput) return;

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                showToast('Photo size should not exceed 2MB. Please select a smaller file.', 'error');
                this.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                showToast('Please upload an image file.', 'error');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                if (photoPreview) {
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = 'block';
                }
                if (photoPlaceholder) {
                    photoPlaceholder.style.display = 'none';
                }
            }
            reader.readAsDataURL(file);
        }
    });
}

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
            showToast(`File "${file.name}" exceeds 50MB limit.`, 'error');
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
            showToast(`File "${file.name}" has unsupported format.`, 'error');
            return;
        }

        addFileToList(file);
    });
}

function addFileToList(file) {
    documentCounter++;
    const fileId = documentCounter;
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
                    <h6 class="doc-title mb-0" title="${file.name}">${truncateFilename(file.name)}</h6>
                    <span class="badge bg-info-subtle text-info" style="font-size: 0.7rem; padding: 3px 8px;">New</span>
                </div>
                <p class="doc-link mb-0" style="font-size: 0.85rem; color: var(--text-secondary);">
                    <i class="bi bi-clock-history me-1"></i>${formatFileSize(file.size)} • Pending Upload
                </p>
            </div>
            
            <div class="doc-type-selector" style="min-width: 220px;">
                <select class="form-select form-select-sm" style="border-radius: 8px;" onchange="assignFileType(${fileId}, this.value)">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="doc-actions-wrapper d-flex gap-2">
                <button type="button" class="btn-doc-action btn-delete" onclick="removeFile(${fileId})" title="Remove">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </div>
    `;

    listContainer.appendChild(item);
    
    // Update document indices
    updateDocumentIndices();
    
    // Smooth scroll to the new item
    setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function assignFileType(fileId, type) {
    const fileData = uploadedFiles.get(fileId);
    if (!fileData) return;

    // If changing from an existing type, clear the old input
    if (fileData.type) {
        const oldInput = document.getElementById(`docFile_${fileId}`);
        if (oldInput) oldInput.remove();
    }

    fileData.type = type;
    
    if (type) {
        // Create or update hidden file input for this document
        let input = document.getElementById(`docFile_${fileId}`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = `docFile_${fileId}`;
            input.name = `docFile_${fileId}`;
            input.style.display = 'none';
            document.getElementById('addStudentForm').appendChild(input);
        }
        
        // Create hidden input for document type
        let typeInput = document.getElementById(`docType_${fileId}`);
        if (!typeInput) {
            typeInput = document.createElement('input');
            typeInput.type = 'hidden';
            typeInput.id = `docType_${fileId}`;
            typeInput.name = `docType_${fileId}`;
            document.getElementById('addStudentForm').appendChild(typeInput);
        }
        typeInput.value = type;
        
        // Assign file using DataTransfer
        const dt = new DataTransfer();
        dt.items.add(fileData.file);
        input.files = dt.files;
        
        // Visual feedback
        const item = document.getElementById(`item_${fileId}`);
        const select = item.querySelector('select');
        select.classList.remove('is-invalid');
        item.style.borderColor = 'var(--success-color)';
        setTimeout(() => item.style.borderColor = '', 1000);
    }
}

function removeFile(fileId) {
    const fileData = uploadedFiles.get(fileId);
    if (fileData && fileData.type) {
        const fileInput = document.getElementById(`docFile_${fileId}`);
        const typeInput = document.getElementById(`docType_${fileId}`);
        if (fileInput) fileInput.remove();
        if (typeInput) typeInput.remove();
    }
    
    uploadedFiles.delete(fileId);
    const item = document.getElementById(`item_${fileId}`);
    if (item) {
        item.remove();
    }
    
    updateDocumentIndices();
}

function updateDocumentIndices() {
    let indicesInput = document.getElementById('documentIndices');
    if (!indicesInput) {
        indicesInput = document.createElement('input');
        indicesInput.type = 'hidden';
        indicesInput.id = 'documentIndices';
        indicesInput.name = 'documentIndices';
        document.getElementById('addStudentForm').appendChild(indicesInput);
    }
    
    const indices = Array.from(uploadedFiles.keys());
    indicesInput.value = indices.join(',');
}

/**
 * Truncate long filenames for display
 */
function truncateFilename(filename, maxLength = 40) {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.substring(filename.lastIndexOf('.'));
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const truncateLength = maxLength - extension.length - 3; // -3 for "..."
    
    if (truncateLength > 0) {
        return nameWithoutExt.substring(0, truncateLength) + '...' + extension;
    }
    return filename.substring(0, maxLength) + '...';
}

/**
 * Update existing document IDs in a hidden input
 * Collects all existing (not marked for deletion) document IDs
 */
function updateExistingDocumentIds() {
    let existingIdsInput = document.getElementById('existingDocIds');
    if (!existingIdsInput) {
        existingIdsInput = document.createElement('input');
        existingIdsInput.type = 'hidden';
        existingIdsInput.id = 'existingDocIds';
        existingIdsInput.name = 'existingDocIds';
        document.getElementById('addStudentForm').appendChild(existingIdsInput);
    }
    
    // Collect all existing document items (not deleted, not new)
    const existingItems = document.querySelectorAll('.document-item-existing');
    const existingIds = [];
    
    existingItems.forEach(item => {
        // Extract document ID from the item's ID (format: doc_<documentId>)
        const docId = item.id.replace('doc_', '');
        if (docId && !item.classList.contains('marked-for-deletion')) {
            existingIds.push(docId);
        }
    });
    
    existingIdsInput.value = existingIds.join(',');
}

/**
 * Format file size bytes to human readable string
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Initialize Year Picker
 */
function initYearPicker() {
    const yearInput = document.getElementById('passingYear');
    if (!yearInput) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'year-picker-dropdown';
    document.body.appendChild(dropdown);

    let currentYear = new Date().getFullYear();
    let viewYear = currentYear;

    function renderYears(centerYear) {
        const startYear = centerYear - 4;
        const endYear = centerYear + 7;
        
        let html = `
            <div class="year-picker-header">
                <button type="button" class="year-picker-nav prev-years"><i class="bi bi-chevron-left"></i></button>
                <span>${startYear} - ${endYear}</span>
                <button type="button" class="year-picker-nav next-years"><i class="bi bi-chevron-right"></i></button>
            </div>
            <div class="year-picker-grid">
        `;

        for (let i = startYear; i <= endYear; i++) {
            const isSelected = yearInput.value == i;
            const isCurrent = i === currentYear;
            let classes = 'year-picker-item';
            if (isSelected) classes += ' selected';
            if (isCurrent) classes += ' current';
            
            html += `<div class="${classes}" data-year="${i}">${i}</div>`;
        }

        html += '</div>';
        dropdown.innerHTML = html;

        // Add event listeners
        dropdown.querySelector('.prev-years').addEventListener('click', (e) => {
            e.stopPropagation();
            viewYear -= 12;
            renderYears(viewYear);
        });

        dropdown.querySelector('.next-years').addEventListener('click', (e) => {
            e.stopPropagation();
            viewYear += 12;
            renderYears(viewYear);
        });

        dropdown.querySelectorAll('.year-picker-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                yearInput.value = item.dataset.year;
                dropdown.classList.remove('show');
                // Trigger change event for validation
                yearInput.dispatchEvent(new Event('change'));
                yearInput.dispatchEvent(new Event('input'));
            });
        });
    }

    // Show dropdown on input click
    yearInput.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = yearInput.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
        
        renderYears(viewYear);
        
        // Close other dropdowns
        document.querySelectorAll('.year-picker-dropdown.show').forEach(d => {
            if (d !== dropdown) d.classList.remove('show');
        });
        
        dropdown.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== yearInput) {
            dropdown.classList.remove('show');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        dropdown.classList.remove('show');
    });
}

/**
 * Copy Permanent Address to Current Address
 * Called by inline onclick in JSP
 */
function copyPermanentAddress() {
    const perm = document.getElementById('permanentAddress');
    const curr = document.getElementById('currentAddress');
    
    if (perm && curr) {
        curr.value = perm.value;
        // Trigger validation/events
        curr.dispatchEvent(new Event('input'));
        curr.dispatchEvent(new Event('change'));
        
        // Visual feedback for validation
        curr.classList.remove('is-invalid');
        if (curr.checkValidity()) {
            curr.classList.add('is-valid');
        }
        
        toast.success('Address copied successfully');
    }
}

/**
 * Copy Mobile Number to WhatsApp Number
 * Called by inline onchange in JSP
 */
function copySameAsMobile() {
    const mobile = document.getElementById('mobileNumber');
    const whatsapp = document.getElementById('whatsappNumber');
    const checkbox = document.getElementById('sameAsMobile');
    
    if (mobile && whatsapp && checkbox) {
        if (checkbox.checked) {
            whatsapp.value = mobile.value;
            // Trigger validation/events
            whatsapp.dispatchEvent(new Event('input'));
            whatsapp.dispatchEvent(new Event('change'));
            
            // Visual feedback
            whatsapp.classList.remove('is-invalid');
            if (whatsapp.checkValidity()) {
                whatsapp.classList.add('is-valid');
            }
            
            showToast('WhatsApp number updated', 'success');
        } else {
            whatsapp.value = '';
            whatsapp.dispatchEvent(new Event('input'));
            whatsapp.classList.remove('is-valid');
        }
    }
}

/**
 * Initialize Address Copy Functionality (Legacy/Alternative)
 */
function initAddressCopy() {
    // Kept for compatibility if ID is added later
    const copyBtn = document.getElementById('sameAsPermanent');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPermanentAddress);
    }
}

/**
 * Initialize Form Validation
 */
function initFormValidation() {
    const form = document.getElementById('addStudentForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find first invalid field and focus it
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                toast.error('Please fill in all required fields correctly');
            }
        } else {
            // Check if document types are selected for all new uploaded files
            let unassignedFiles = false;
            const newItems = document.querySelectorAll('.document-item-new');
            newItems.forEach(item => {
                const select = item.querySelector('select');
                if (select && !select.value) {
                    select.classList.add('is-invalid');
                    unassignedFiles = true;
                }
            });
            
            if (unassignedFiles) {
                e.preventDefault();
                e.stopPropagation();
                toast.error('Please select document type for all uploaded files');
                return;
            }

            // Update existing document IDs for backend processing
            updateExistingDocumentIds();

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
            }
        }
        
        form.classList.add('was-validated');
    });
}

/**
 * Toast Notification Helper - Using hot-toast library
 */
function showToast(message, type = 'info') {
    if (typeof toast !== 'undefined') {
        switch(type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
            case 'danger':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast.info(message);
        }
    } else {
        console.warn('Hot-toast library not loaded. Message:', message);
    }
}

// Helper for medical details toggle (referenced in JSP)
function toggleMedicalDetails(show) {
    const section = document.getElementById('medicalDetailsSection');
    if (section) {
        section.style.display = show ? 'block' : 'none';
        
        // Toggle required attributes
        const inputs = section.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.id === 'medicalCondition') { // Only condition is strictly required if Yes
                if (show) input.setAttribute('required', '');
                else input.removeAttribute('required');
            }
        });
    }
}

// Helper for form reset (referenced in JSP)
function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        document.getElementById('addStudentForm').reset();
        document.getElementById('photoPreview').style.display = 'none';
        document.getElementById('photoPlaceholder').style.display = 'block';
        document.getElementById('documentList').innerHTML = '';
        uploadedFiles.clear();
        toggleMedicalDetails(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function addExistingDocument(doc) {
    const listContainer = document.getElementById('documentList');
    if (!listContainer) return;

    const item = document.createElement('div');
    item.className = 'document-item-enhanced document-item-existing';
    item.id = `doc_${doc.documentId}`;
    
    // Determine icon and color based on file type/extension from URL or type
    let iconClass = 'bi-file-earmark-text';
    let iconBg = 'rgba(13, 110, 253, 0.1)';
    let iconColor = '#0d6efd';
    
    // Simple extension check from URL
    const url = doc.documentUrl || '';
    if (url.match(/\.(jpg|jpeg|png|gif)/i)) {
        iconClass = 'bi-file-earmark-image';
        iconBg = 'rgba(13, 110, 253, 0.1)';
        iconColor = '#0d6efd';
    } else if (url.match(/\.pdf/i)) {
        iconClass = 'bi-file-earmark-pdf';
        iconBg = 'rgba(220, 53, 69, 0.1)';
        iconColor = '#dc3545';
    } else if (url.match(/\.(doc|docx)/i)) {
        iconClass = 'bi-file-earmark-word';
        iconBg = 'rgba(25, 135, 84, 0.1)';
        iconColor = '#198754';
    } else if (url.match(/\.(xls|xlsx)/i)) {
        iconClass = 'bi-file-earmark-excel';
        iconBg = 'rgba(25, 135, 84, 0.1)';
        iconColor = '#198754';
    }
    
    // Find label for document type
    const typeLabel = documentTypes.find(t => t.value === doc.documentType)?.label || doc.documentType;

    // Build options HTML for the select dropdown
    let optionsHtml = '';
    documentTypes.forEach(type => {
        const selected = type.value === doc.documentType ? 'selected' : '';
        optionsHtml += `<option value="${type.value}" ${selected}>${type.label}</option>`;
    });
    
    console.log('Document types available:', documentTypes.length, 'Current type:', doc.documentType);

    item.innerHTML = `
        <div class="d-flex align-items-center gap-3 flex-wrap w-100">
            <div class="doc-icon-wrapper" style="background: ${iconBg}; color: ${iconColor};">
                <i class="bi ${iconClass}"></i>
            </div>
            
            <div class="doc-info-wrapper flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="doc-title mb-0">${typeLabel}</h6>
                    <span class="badge bg-success-subtle text-success" style="font-size: 0.7rem; padding: 3px 8px;">Uploaded</span>
                </div>
                <a href="${doc.documentUrl}" target="_blank" class="doc-link">
                    <i class="bi bi-eye me-1"></i>View Document
                </a>
            </div>
            
            <div class="doc-type-selector" style="min-width: 220px;">
                <select class="form-select form-select-sm doc-type-select" name="docType_${doc.documentId}" data-doc-id="${doc.documentId}" style="border-radius: 8px;">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="doc-actions-wrapper d-flex gap-2">
                <input type="file" id="replace_${doc.documentId}" name="docFile_${doc.documentId}" style="display:none" onchange="handleReplacement(this, '${doc.documentId}')">
                <button type="button" class="btn-doc-action btn-replace" onclick="triggerReplacement('${doc.documentId}')" title="Replace File">
                    <i class="bi bi-arrow-repeat"></i>
                </button>
                <button type="button" class="btn-doc-action btn-delete" onclick="markDocumentForDeletion('${doc.documentId}')" title="Remove">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </div>
    `;

    listContainer.appendChild(item);
    
    // Add event listener for document type changes
    const select = item.querySelector('.doc-type-select');
    if (select) {
        select.addEventListener('change', function() {
            const newType = this.value;
            const newLabel = documentTypes.find(t => t.value === newType)?.label || newType;
            const titleEl = item.querySelector('.doc-title');
            
            if (titleEl) {
                titleEl.textContent = newLabel;
            }
            
            // Visual feedback for edit
            item.style.borderColor = 'var(--primary-color)';
            item.style.background = 'rgba(13, 110, 253, 0.05)';
            
            toast.success('Document type updated');
        });
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
            titleEl.textContent = truncateFilename(file.name);
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
                    let deletedInput = document.getElementById('deletedDocumentIds');
                    if (!deletedInput) {
                        deletedInput = document.createElement('input');
                        deletedInput.type = 'hidden';
                        deletedInput.id = 'deletedDocumentIds';
                        deletedInput.name = 'deletedDocumentIds';
                        document.getElementById('addStudentForm').appendChild(deletedInput);
                    }
                    
                    if (deletedInput.value) {
                        deletedInput.value += ',' + docId;
                    } else {
                        deletedInput.value = docId;
                    }
                    
                    showToast('Document marked for removal', 'success');
                }
            }
        });
    } else {
        if (confirm('Are you sure you want to remove this document?')) {
            const item = document.getElementById(`doc_${docId}`);
            if (item) {
                item.style.display = 'none';
                
                // Add to deleted list
                let deletedInput = document.getElementById('deletedDocumentIds');
                if (!deletedInput) {
                    deletedInput = document.createElement('input');
                    deletedInput.type = 'hidden';
                    deletedInput.id = 'deletedDocumentIds';
                    deletedInput.name = 'deletedDocumentIds';
                    document.getElementById('addStudentForm').appendChild(deletedInput);
                }
                
                if (deletedInput.value) {
                    deletedInput.value += ',' + docId;
                } else {
                    deletedInput.value = docId;
                }
                
                showToast('Document marked for removal', 'success');
            }
        }
    }
}
/**
 * Update Fees Allowed based on Student Status
 */
function updateFeesAllowed() {
    const statusSelect = document.getElementById('studentStatus');
    const feesSelect = document.getElementById('feesAllowed');
    
    if (!statusSelect || !feesSelect) return;
    
    const status = statusSelect.value;
    
    switch(status) {
        case 'Pending':
        case 'Active':
        case 'Inactive':
            feesSelect.value = 'YES';
            break;
            
        case 'Suspended':
        case 'Graduated':
        case 'Dropped':
        default:
            feesSelect.value = 'NO';
            break;
    }
    
    // Visual feedback
    feesSelect.style.transition = 'background-color 0.3s';
    feesSelect.style.backgroundColor = '#e8f0fe';
    setTimeout(() => {
        feesSelect.style.backgroundColor = '';
    }, 500);
}

