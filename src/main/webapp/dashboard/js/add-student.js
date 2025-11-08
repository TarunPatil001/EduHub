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
