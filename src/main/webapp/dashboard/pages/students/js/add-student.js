/**
 * Add Student Page - JavaScript Functions
 * Separate JS file for better organization and maintainability
 */

// Photo preview functionality
document.getElementById('studentPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        Toast.error('Photo size should not exceed 2MB. Please select a smaller file.');
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

/**
 * File upload handler
 * @param {HTMLInputElement} input - File input element
 * @param {string} boxId - ID of the upload box
 * @param {string} fileNameId - ID of the file name display element
 */
function handleFileUpload(input, boxId, fileNameId) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        Toast.error('File size should not exceed 5MB. Please select a smaller file.');
        input.value = '';
        return;
    }
    
    document.getElementById(boxId).classList.add('has-file');
    document.getElementById(fileNameId).textContent = '✓ ' + file.name;
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
            
            // Reset photo preview
            const photoPlaceholder = document.getElementById('photoPlaceholder');
            const photoPreview = document.getElementById('photoPreview');
            if (photoPlaceholder) photoPlaceholder.style.display = 'block';
            if (photoPreview) {
                photoPreview.style.display = 'none';
                photoPreview.src = '';
            }
            
            // Reset all file upload boxes and clear file names
            document.querySelectorAll('.file-upload-box').forEach(box => {
                box.classList.remove('has-file');
            });
            document.querySelectorAll('.file-name').forEach(name => {
                name.textContent = '';
            });
            
            // Clear all file inputs
            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = '';
            });
            
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
            
            Toast.success('The form has been reset successfully.');
        }
    });
}

// Form validation and submission
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        Toast.warning('Please fill in all required fields correctly.');
        
        const firstError = this.querySelector(':invalid');
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
            Toast.success('Student registration has been submitted successfully!');
            // document.getElementById('addStudentForm').submit(); // Uncomment when backend is ready
        }
    });
});

// Age validation
document.getElementById('dateOfBirth').addEventListener('change', function() {
    const age = new Date().getFullYear() - new Date(this.value).getFullYear();
    
    if (age < 15) {
        Toast.error('Student must be at least 15 years old to register. Please enter a valid date of birth.');
        this.value = '';
    }
});

// Phone number validation - Allow only digits and limit to 10
['mobileNumber', 'whatsappNumber', 'parentMobile'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
});

// Year Picker Implementation
(function() {
    const yearPickerInput = document.getElementById('passingYear');
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 15;
    const minYear = 1950;
    let selectedYear = null;
    let displayRangeStart = Math.floor((currentYear - 5) / 12) * 12;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'year-picker-dropdown';
    yearPickerInput.parentElement.style.position = 'relative';
    yearPickerInput.parentElement.appendChild(dropdown);
    
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
        
        dropdown.querySelector('[data-action="prev"]').addEventListener('click', () => changeYearRange(-12));
        dropdown.querySelector('[data-action="next"]').addEventListener('click', () => changeYearRange(12));
        
        const grid = dropdown.querySelector('#yearGrid');
        for (let year = displayRangeStart; year <= endYear; year++) {
            const yearItem = document.createElement('div');
            yearItem.className = 'year-picker-item';
            
            if (year === currentYear) yearItem.classList.add('current');
            if (year === selectedYear) yearItem.classList.add('selected');
            
            if (year < minYear || year > maxYear) {
                yearItem.style.opacity = '0.3';
                yearItem.style.pointerEvents = 'none';
            } else {
                yearItem.addEventListener('click', () => selectYear(year));
            }
            
            yearItem.textContent = year;
            grid.appendChild(yearItem);
        }
    }
    
    function changeYearRange(offset) {
        displayRangeStart = Math.max(minYear, Math.min(displayRangeStart + offset, Math.floor(maxYear / 12) * 12));
        renderYearPicker();
    }
    
    function selectYear(year) {
        selectedYear = year;
        yearPickerInput.value = year;
        dropdown.classList.remove('show');
        yearPickerInput.dispatchEvent(new Event('change'));
    }
    
    yearPickerInput.addEventListener('click', function() {
        if (!dropdown.classList.contains('show')) {
            displayRangeStart = Math.floor(((selectedYear || currentYear) - 5) / 12) * 12;
            renderYearPicker();
            dropdown.classList.add('show');
        } else {
            dropdown.classList.remove('show');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!yearPickerInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
})();

/**
 * Add Student Form Handler
 * Handles form submission, validation, and default values for new students
 */

document.addEventListener('DOMContentLoaded', function() {
    const addStudentForm = document.getElementById('addStudentForm');
    
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize form defaults
    initializeFormDefaults();
});

/**
 * Initialize form default values
 */
function initializeFormDefaults() {
    // Set default status to Active
    const statusSelect = document.getElementById('studentStatus');
    if (statusSelect && !statusSelect.value) {
        statusSelect.value = 'Active';
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!addStudentForm.checkValidity()) {
        event.stopPropagation();
        addStudentForm.classList.add('was-validated');
        Toast.error('Please fill all required fields');
        return;
    }
    
    // Collect form data
    const formData = new FormData(addStudentForm);
    
    // Add default values for new students
    const studentData = {
        // Personal Information
        studentName: formData.get('studentName'),
        fatherName: formData.get('fatherName'),
        surname: formData.get('surname'),
        dateOfBirth: formData.get('dateOfBirth'),
        gender: formData.get('gender'),
        bloodGroup: formData.get('bloodGroup'),
        
        // Contact Information
        mobileNumber: formData.get('mobileNumber'),
        whatsappNumber: formData.get('whatsappNumber'),
        parentMobile: formData.get('parentMobile'),
        emailId: formData.get('emailId'),
        instagramId: formData.get('instagramId'),
        linkedinId: formData.get('linkedinId'),
        
        // Address Information
        permanentAddress: formData.get('permanentAddress'),
        currentAddress: formData.get('currentAddress'),
        
        // Educational Information
        collegeName: formData.get('collegeName'),
        educationQualification: formData.get('educationQualification'),
        passingYear: formData.get('passingYear'),
        
        // Course Enrollment
        courseEnrolled: formData.get('courseEnrolled'),
        batchPreference: formData.get('batchPreference'),
        studentStatus: formData.get('studentStatus') || 'Active',
        
        // Enrollment date
        enrollDate: new Date().toISOString().split('T')[0], // Current date
        
        // Note: Grade and Attendance will be set by separate modules
        // - Grade: Set by assessment/grading module
        // - Attendance: Set by attendance tracking module
        
        // Medical Information
        medicalHistory: formData.get('medicalHistory'),
        medicalCondition: formData.get('medicalCondition'),
        medicineName: formData.get('medicineName')
    };
    
    // Show loading overlay
    showLoadingOverlay('Registering student...');
    
    // Simulate API call to register student
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Show success message
        Toast.success('Student registered successfully!');
        
        // Log the student data (in production, this would be sent to backend)
        console.log('Student Data:', studentData);
        
        // Show confirmation modal
        showConfirmationModal({
            title: 'Student Registered Successfully',
            message: `
                <div class="alert alert-success mb-3">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong>Success!</strong> Student has been registered successfully.
                </div>
                <div class="mb-3">
                    <p class="mb-2"><strong>Student Name:</strong> ${studentData.studentName} ${studentData.surname}</p>
                    <p class="mb-2"><strong>Course:</strong> ${getCourseName(studentData.courseEnrolled)}</p>
                    <p class="mb-2"><strong>Status:</strong> <span class="badge bg-success">${studentData.studentStatus}</span></p>
                    <p class="mb-2"><strong>Batch Mode:</strong> <span class="badge bg-info">${studentData.batchPreference || 'Not Selected'}</span></p>
                    <p class="mb-2"><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Next Steps:</strong>
                    <ul class="mb-0 mt-2 small">
                        <li>Grade will be assigned after first assessment</li>
                        <li>Attendance tracking starts from first class</li>
                        <li>Student can now access their dashboard</li>
                    </ul>
                </div>
            `,
            confirmText: 'View All Students',
            cancelText: 'Add Another Student',
            confirmClass: 'btn-primary',
            icon: 'bi-check-circle-fill text-success',
            onConfirm: function() {
                // Redirect to all students page
                window.location.href = 'all-students.jsp';
            },
            onCancel: function() {
                // Reset form to add another student
                resetForm();
            }
        });
        
    }, 1500);
}

/**
 * Get course name by ID
 */
function getCourseName(courseId) {
    const courses = {
        '1': 'Web Development',
        '2': 'Data Science',
        '3': 'Machine Learning',
        '4': 'Mobile App Development',
        '5': 'Python Programming'
    };
    return courses[courseId] || 'Unknown Course';
}

/**
 * Toggle medical details section
 */
function toggleMedicalDetails(show) {
    const medicalDetailsSection = document.getElementById('medicalDetailsSection');
    if (medicalDetailsSection) {
        medicalDetailsSection.style.display = show ? 'block' : 'none';
        
        // Make fields required/optional based on selection
        const medicalCondition = document.getElementById('medicalCondition');
        if (medicalCondition) {
            medicalCondition.required = show;
        }
    }
}

/**
 * Handle file upload display
 */
function handleFileUpload(input, boxId, fileNameId) {
    const box = document.getElementById(boxId);
    const fileName = document.getElementById(fileNameId);
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Update box appearance
        if (box) {
            box.style.borderColor = '#198754';
            box.style.backgroundColor = '#d1e7dd';
        }
        
        // Display file name
        if (fileName) {
            fileName.textContent = `✓ ${file.name}`;
            fileName.style.color = '#198754';
        }
    }
}

/**
 * Copy permanent address to current address
 */
function copyAddress() {
    const permanentAddress = document.getElementById('permanentAddress');
    const currentAddress = document.getElementById('currentAddress');
    
    if (permanentAddress && currentAddress) {
        currentAddress.value = permanentAddress.value;
        Toast.info('Address copied successfully');
    }
}

/**
 * Reset form to initial state
 */
function resetForm() {
    const form = document.getElementById('addStudentForm');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset file upload displays
        const fileBoxes = document.querySelectorAll('.file-upload-box');
        fileBoxes.forEach(box => {
            box.style.borderColor = '#dee2e6';
            box.style.backgroundColor = '#f8f9fa';
        });
        
        const fileNames = document.querySelectorAll('.file-name');
        fileNames.forEach(name => {
            name.textContent = '';
        });
        
        // Hide medical details section
        const medicalDetailsSection = document.getElementById('medicalDetailsSection');
        if (medicalDetailsSection) {
            medicalDetailsSection.style.display = 'none';
        }
        
        // Reset to default status
        initializeFormDefaults();
        
        Toast.info('Form reset successfully');
    }
}

/**
 * Preview uploaded photo
 */
function previewPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            Toast.success('Photo uploaded successfully');
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}