/**
 * Record Payment Page - JavaScript Functions
 */

(function() {
    'use strict';

    // Dummy student data for search
    const students = [
        { id: 'STU001', name: 'Aarav Sharma', course: 'Computer Science', totalFee: 50000, paidAmount: 50000, status: 'Paid' },
        { id: 'STU002', name: 'Diya Patel', course: 'Business Administration', totalFee: 45000, paidAmount: 30000, status: 'Partial' },
        { id: 'STU003', name: 'Arjun Kumar', course: 'Engineering', totalFee: 60000, paidAmount: 20000, status: 'Pending' },
        { id: 'STU004', name: 'Ananya Singh', course: 'Mathematics', totalFee: 40000, paidAmount: 0, status: 'Unpaid' },
        { id: 'STU005', name: 'Vihaan Mehta', course: 'Computer Science', totalFee: 50000, paidAmount: 50000, status: 'Paid' },
        { id: 'STU006', name: 'Aarav Khan', course: 'Data Science', totalFee: 55000, paidAmount: 35000, status: 'Partial' },
        { id: 'STU007', name: 'Rohan Verma', course: 'Physics', totalFee: 42000, paidAmount: 42000, status: 'Paid' },
        { id: 'STU008', name: 'Sara Ali', course: 'Chemistry', totalFee: 43000, paidAmount: 25000, status: 'Pending' },
        { id: 'STU009', name: 'Kabir Reddy', course: 'Business Administration', totalFee: 45000, paidAmount: 0, status: 'Overdue' },
        { id: 'STU010', name: 'Myra Gupta', course: 'Engineering', totalFee: 60000, paidAmount: 60000, status: 'Paid' }
    ];

    let selectedStudent = null;

    // DOM Elements
    const studentSearch = document.getElementById('studentSearch');
    const searchResults = document.getElementById('searchResults');
    const selectedStudentId = document.getElementById('selectedStudentId');
    const studentDetailsCard = document.getElementById('studentDetailsCard');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentDate = document.getElementById('paymentDate');
    const receiptNumber = document.getElementById('receiptNumber');
    const resetBtn = document.getElementById('resetBtn');
    const form = document.getElementById('recordPaymentForm');

    // Initialize
    function init() {
        // Set today's date as default and max date
        const today = new Date().toISOString().split('T')[0];
        if (paymentDate) {
            paymentDate.value = today;
            paymentDate.setAttribute('max', today); // Prevent future dates
        }

        // Generate receipt number
        generateReceiptNumber();

        // Disable payment fields until student is selected
        togglePaymentFields(false);

        // Check for student ID in URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const studentIdFromUrl = urlParams.get('studentId');
        
        if (studentIdFromUrl) {
            // Auto-select student if ID is provided in URL
            selectStudent(studentIdFromUrl);
        }

        attachEventListeners();
    }

    // Toggle Payment Fields based on student selection
    function togglePaymentFields(enable) {
        const fields = [paymentAmount, document.getElementById('paymentMethod'), 
                       document.getElementById('transactionId'), document.getElementById('bankName'),
                       document.getElementById('paymentNotes'), document.getElementById('paymentProof')];
        
        const noStudentWarning = document.getElementById('noStudentWarning');
        
        fields.forEach(field => {
            if (field) {
                field.disabled = !enable;
            }
        });

        if (noStudentWarning) {
            noStudentWarning.style.display = enable ? 'none' : 'block';
        }
    }

    // Event Listeners
    function attachEventListeners() {
        // Student search
        if (studentSearch) {
            studentSearch.addEventListener('input', handleStudentSearch);
            studentSearch.addEventListener('focus', handleStudentSearch);
        }

        // Click outside to close search results
        document.addEventListener('click', (e) => {
            if (!studentSearch?.contains(e.target) && !searchResults?.contains(e.target)) {
                searchResults?.classList.remove('show');
            }
        });

        // Payment amount change
        if (paymentAmount) {
            paymentAmount.addEventListener('input', () => {
                updateAmountHelper();
            });
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', handleReset);
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    // Handle Student Search
    function handleStudentSearch() {
        const query = studentSearch.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }

        const filtered = students.filter(student => 
            student.id.toLowerCase().includes(query) ||
            student.name.toLowerCase().includes(query)
        );

        displaySearchResults(filtered);
    }

    // Display Search Results
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No students found</div>';
            searchResults.classList.add('show');
            return;
        }

        let html = '';
        results.forEach(student => {
            const pendingAmount = student.totalFee - student.paidAmount;
            html += `
                <div class="search-result-item" data-student-id="${student.id}">
                    <span class="search-result-name">${student.name}</span>
                    <div class="search-result-details">
                        ${student.id} • ${student.course} • Pending: ₹${pendingAmount.toLocaleString('en-IN')}
                    </div>
                </div>
            `;
        });

        searchResults.innerHTML = html;
        searchResults.classList.add('show');

        // Attach click events to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const studentId = item.dataset.studentId;
                selectStudent(studentId);
            });
        });
    }

    // Select Student
    function selectStudent(studentId) {
        selectedStudent = students.find(s => s.id === studentId);
        
        if (!selectedStudent) {
            Toast.error('Student not found');
            return;
        }

        // Update form fields
        studentSearch.value = selectedStudent.name;
        selectedStudentId.value = selectedStudent.id;
        searchResults.classList.remove('show');

        // Display student details
        displayStudentDetails();

        // Enable payment fields
        togglePaymentFields(true);

        // Load payment history for selected student
        if (typeof refreshPaymentHistory === 'function') {
            refreshPaymentHistory(selectedStudent.id);
        }

        // Set max payment amount to pending amount
        const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;
        if (paymentAmount) {
            paymentAmount.setAttribute('max', pendingAmount);
            paymentAmount.value = '';
            paymentAmount.focus();
        }
    }

    // Display Student Details
    function displayStudentDetails() {
        if (!selectedStudent) return;

        const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;

        document.getElementById('detailName').textContent = selectedStudent.name;
        document.getElementById('detailCourse').textContent = selectedStudent.course;
        document.getElementById('detailStatus').innerHTML = `<span class="badge status-${selectedStudent.status.toLowerCase()}">${selectedStudent.status}</span>`;
        document.getElementById('detailTotalFee').textContent = '₹' + selectedStudent.totalFee.toLocaleString('en-IN');
        document.getElementById('detailPaidAmount').textContent = '₹' + selectedStudent.paidAmount.toLocaleString('en-IN');
        document.getElementById('detailPendingAmount').textContent = '₹' + pendingAmount.toLocaleString('en-IN');

        studentDetailsCard.style.display = 'block';
        studentDetailsCard.classList.add('animate-in');
    }

    // Update Amount Helper
    function updateAmountHelper() {
        const amountHelper = document.getElementById('amountHelper');
        if (!selectedStudent || !paymentAmount || !amountHelper) return;

        const amount = parseFloat(paymentAmount.value);
        const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;

        // Handle invalid or empty input
        if (isNaN(amount) || paymentAmount.value === '') {
            amountHelper.textContent = `Pending amount: ₹${pendingAmount.toLocaleString('en-IN')}`;
            amountHelper.className = 'text-muted';
            paymentAmount.classList.remove('is-invalid', 'is-valid');
            return;
        }

        // Validate amount
        if (amount <= 0) {
            amountHelper.textContent = `⚠️ Amount must be greater than zero`;
            amountHelper.className = 'text-danger';
            paymentAmount.classList.add('is-invalid');
            paymentAmount.classList.remove('is-valid');
        } else if (amount > pendingAmount) {
            amountHelper.textContent = `⚠️ Amount exceeds pending amount of ₹${pendingAmount.toLocaleString('en-IN')}`;
            amountHelper.className = 'text-danger';
            paymentAmount.classList.add('is-invalid');
            paymentAmount.classList.remove('is-valid');
        } else if (amount === pendingAmount) {
            amountHelper.textContent = `✓ This will clear the full pending amount`;
            amountHelper.className = 'text-success fw-bold';
            paymentAmount.classList.remove('is-invalid');
            paymentAmount.classList.add('is-valid');
        } else if (amount > 0) {
            const remaining = pendingAmount - amount;
            amountHelper.textContent = `Remaining balance after payment: ₹${remaining.toLocaleString('en-IN')}`;
            amountHelper.className = 'text-info';
            paymentAmount.classList.remove('is-invalid');
            paymentAmount.classList.add('is-valid');
        }
    }



    // Generate Receipt Number
    function generateReceiptNumber() {
        if (receiptNumber) {
            const prefix = 'RCT';
            const timestamp = Date.now().toString().slice(-8);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            receiptNumber.value = `${prefix}${timestamp}${random}`;
        }
    }

    // Handle Reset
    function handleReset() {
        showConfirmationModal({
            title: 'Reset Form',
            message: 'Are you sure you want to reset the form? All entered data will be lost.',
            confirmText: 'Yes, Reset',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger',
            icon: 'bi-exclamation-triangle-fill text-danger',
            onConfirm: function() {
                // Reset form
                form.reset();
                form.classList.remove('was-validated');
                
                // Clear selected student
                selectedStudent = null;
                selectedStudentId.value = '';
                studentDetailsCard.style.display = 'none';
                
                // Reset date and receipt
                if (paymentDate) {
                    paymentDate.value = new Date().toISOString().split('T')[0];
                }
                generateReceiptNumber();
                
                Toast.info('Form has been reset');
            }
        });
    }

    // Handle Form Submit - ENHANCED WITH API INTEGRATION
    function handleFormSubmit(e) {
        e.preventDefault();

        // Comprehensive validation chain
        const validationResult = performComprehensiveValidation();
        if (!validationResult.isValid) {
            Toast.error(validationResult.message);
            if (validationResult.focusElement) {
                validationResult.focusElement.focus();
            }
            return;
        }

        // Prepare payment data
        const paymentData = buildPaymentData();

        // Show confirmation modal with detailed summary
        showEnhancedConfirmationModal(paymentData);
    }

    // Comprehensive validation function
    function performComprehensiveValidation() {
        // Validation 1: Student selection
        if (!selectedStudent) {
            return {
                isValid: false,
                message: 'Please select a student first',
                focusElement: studentSearch
            };
        }

        // Validation 2: Form validity
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return {
                isValid: false,
                message: 'Please fill in all required fields correctly',
                focusElement: null
            };
        }

        // Validation 3: Payment amount
        const amount = parseFloat(paymentAmount.value);
        if (isNaN(amount) || amount <= 0) {
            return {
                isValid: false,
                message: 'Please enter a valid payment amount greater than zero',
                focusElement: paymentAmount
            };
        }

        // Validation 4: Amount precision (max 2 decimals)
        if (amount.toString().split('.')[1]?.length > 2) {
            return {
                isValid: false,
                message: 'Amount can have maximum 2 decimal places',
                focusElement: paymentAmount
            };
        }

        // Validation 5: Pending amount check
        const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;
        if (pendingAmount <= 0) {
            return {
                isValid: false,
                message: 'This student has already paid the full fee amount',
                focusElement: null
            };
        }

        // Validation 6: Amount exceeds pending
        if (amount > pendingAmount) {
            return {
                isValid: false,
                message: `Payment amount (₹${amount.toLocaleString('en-IN')}) exceeds pending amount (₹${pendingAmount.toLocaleString('en-IN')})`,
                focusElement: paymentAmount
            };
        }

        // Validation 7: Payment date
        const paymentDateValue = new Date(paymentDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (paymentDateValue > today) {
            return {
                isValid: false,
                message: 'Payment date cannot be in the future',
                focusElement: paymentDate
            };
        }

        // Validation 8: Payment date not too old (more than 1 year)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (paymentDateValue < oneYearAgo) {
            return {
                isValid: false,
                message: 'Payment date cannot be more than 1 year old',
                focusElement: paymentDate
            };
        }

        // Validation 9: Payment method specific validations
        const method = document.getElementById('paymentMethod').value;
        const transactionId = document.getElementById('transactionId').value;
        
        if ((method === 'Online Transfer' || method === 'Credit Card' || method === 'Debit Card') 
            && !transactionId) {
            return {
                isValid: false,
                message: `Transaction ID is required for ${method}`,
                focusElement: document.getElementById('transactionId')
            };
        }

        return { isValid: true };
    }



    // Build payment data object
    function buildPaymentData() {
        const amount = parseFloat(paymentAmount.value);
        
        const paymentData = {
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            amount: amount,
            paymentDate: paymentDate.value,
            paymentMethod: document.getElementById('paymentMethod').value,
            receiptNumber: receiptNumber.value,
            transactionId: document.getElementById('transactionId').value || null,
            bankName: document.getElementById('bankName').value || null,
            notes: document.getElementById('paymentNotes').value || null,
            timestamp: new Date().toISOString()
        };

        return paymentData;
    }

    // Show enhanced confirmation modal
    function showEnhancedConfirmationModal(paymentData) {
        let message = `
            <div class="text-start">
                <div class="alert alert-info mb-3">
                    <i class="bi bi-info-circle"></i> <strong>Please review payment details carefully</strong>
                </div>
                <table class="table table-sm table-borderless">
                    <tr>
                        <td class="text-muted">Student:</td>
                        <td><strong>${paymentData.studentName}</strong> (${paymentData.studentId})</td>
                    </tr>
                    <tr>
                        <td class="text-muted">Amount:</td>
                        <td class="text-success"><strong>₹${paymentData.amount.toLocaleString('en-IN')}</strong></td>
                    </tr>
                    <tr>
                        <td class="text-muted">Payment Date:</td>
                        <td>${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td class="text-muted">Payment Method:</td>
                        <td><span class="badge bg-primary">${paymentData.paymentMethod}</span></td>
                    </tr>
                    <tr>
                        <td class="text-muted">Receipt Number:</td>
                        <td><code>${paymentData.receiptNumber}</code></td>
                    </tr>
        `;

        if (paymentData.transactionId) {
            message += `
                    <tr>
                        <td class="text-muted">Transaction ID:</td>
                        <td><code>${paymentData.transactionId}</code></td>
                    </tr>
            `;
        }

        message += `
                </table>
            </div>
        `;

        showConfirmationModal({
            title: 'Confirm Payment Recording',
            message: message,
            confirmText: '<i class="bi bi-check-circle me-1"></i> Confirm & Record',
            cancelText: '<i class="bi bi-x-circle me-1"></i> Review Again',
            confirmClass: 'btn-success',
            icon: 'bi-cash-coin text-success',
            onConfirm: function() {
                processPayment(paymentData);
            }
        });
    }

    // Process Payment
    function processPayment(paymentData) {
        // Show loading
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);

        // Simulate API call
        setTimeout(() => {
            // Remove loading
            document.body.removeChild(loading);

            // Update student data (in real app, this would be done by backend)
            updateStudentPaymentData(paymentData);

            // Build success message
            let successMsg = `
                <div class="text-start">
                    <h6>Receipt Number: ${paymentData.receiptNumber}</h6>
                    <hr>
                    <p><strong>Student:</strong> ${paymentData.studentName}</p>
                    <p><strong>Amount Paid:</strong> ₹${paymentData.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Payment Date:</strong> ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}</p>
                    <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
                    <hr>
                    <p class="text-success mb-0">✓ Receipt has been generated and sent to student's email.</p>
                </div>
            `;

            // Show success message
            Toast.success(`Payment of ₹${paymentData.amount.toLocaleString('en-IN')} recorded successfully!`);

            // Show success modal with receipt
            showSuccessModal({
                title: 'Payment Recorded Successfully',
                message: successMsg,
                onClose: function() {
                    // Reset form after success
                    form.reset();
                    form.classList.remove('was-validated');
                    selectedStudent = null;
                    selectedStudentId.value = '';
                    studentDetailsCard.style.display = 'none';
                    if (paymentDate) {
                        paymentDate.value = new Date().toISOString().split('T')[0];
                    }
                    generateReceiptNumber();
                }
            });

        }, 1500);
    }

    // Update Student Payment Data (simulates backend update)
    function updateStudentPaymentData(paymentData) {
        if (!selectedStudent) return;

        // Update paid amount
        selectedStudent.paidAmount += paymentData.amount;

        // Update payment status
        const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;
        if (pendingAmount === 0) {
            selectedStudent.status = 'Paid';
        } else if (selectedStudent.paidAmount > 0) {
            selectedStudent.status = 'Partial';
        } else {
            selectedStudent.status = 'Unpaid';
        }

        console.log('Updated student data:', selectedStudent);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
