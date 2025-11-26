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
        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                toast('Please fill in all required fields correctly.', { icon: '⚠️' });
                
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
        toast.error('File size should not exceed 5MB. Please select a smaller file.');
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

/**
 * Copy permanent address to current address
 */
function copyAddress() {
    const permanentAddress = document.getElementById('permanentAddress');
    const currentAddress = document.getElementById('currentAddress');
    
    if (permanentAddress && currentAddress) {
        currentAddress.value = permanentAddress.value;
        toast('Address copied successfully', { icon: 'ℹ️' });
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
        
        toast('Form reset successfully', { icon: 'ℹ️' });
    }
}

/**
 * Preview uploaded photo
 */
function previewPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            toast.success('Photo uploaded successfully');
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}