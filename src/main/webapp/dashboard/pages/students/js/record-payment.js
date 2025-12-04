/**
 * Record Payment Page - JavaScript Functions
 */

(function() {
    'use strict';

    // Global state
    let selectedStudent = null;
    
    // Make refresh function available globally
    window.handleRefreshPaymentHistory = function() {
        if (window.currentStudentId) {
            // In a real app with transaction history, we would fetch it here
            // For now, we just refresh the student details
            selectStudent(window.currentStudentId);
        } else {
            toast('Please select a student first', { icon: '⚠️' });
        }
    };

    // DOM Elements
    const studentSearch = document.getElementById('studentSearch');
    const searchResults = document.getElementById('searchResults');
    const selectedStudentId = document.getElementById('selectedStudentId');
    const studentDetailsCard = document.getElementById('studentDetailsCard');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentDate = document.getElementById('paymentDate');
    const receiptNumber = document.getElementById('receiptNumber');
    const resetBtn = document.getElementById('resetFormBtn');
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
                       document.getElementById('paymentNotes')];
        
        fields.forEach(field => {
            if (field) {
                field.disabled = !enable;
            }
        });
    }

    // Event Listeners
    function attachEventListeners() {
        // Student search with debounce
        let debounceTimer;
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => handleStudentSearch(), 300);
            });
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
        
        // Quick amount buttons
        document.querySelectorAll('.quick-amt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!selectedStudent) return;
                
                const amountType = e.target.dataset.amount;
                const pendingAmount = selectedStudent.totalFee - selectedStudent.paidAmount;
                
                if (amountType === 'full') {
                    paymentAmount.value = pendingAmount;
                } else {
                    const amt = parseFloat(amountType);
                    paymentAmount.value = Math.min(amt, pendingAmount);
                }
                updateAmountHelper();
            });
        });

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
        const query = studentSearch.value.trim();

        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }

        // Call Backend API
        fetch(`${CONTEXT_PATH}/fees/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data);
            })
            .catch(error => {
                console.error('Error searching students:', error);
                searchResults.innerHTML = '<div class="search-no-results">Error searching students</div>';
                searchResults.classList.add('show');
            });
    }

    // Display Search Results
    function displaySearchResults(results) {
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No students found</div>';
            searchResults.classList.add('show');
            return;
        }

        let html = '';
        results.forEach(student => {
            const pendingAmount = student.pendingAmount;
            html += `
                <div class="search-result-item" data-student-id="${student.studentId}">
                    <span class="search-result-name">${student.studentName}</span>
                    <div class="search-result-details">
                        ${student.courseName || 'N/A'} • Pending: ₹${pendingAmount.toLocaleString('en-IN')}
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
        // Fetch full details from backend
        fetch(`${CONTEXT_PATH}/fees/student?id=${encodeURIComponent(studentId)}`)
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    selectedStudent = response.data;
                    
                    // Store current student ID globally for refresh functionality
                    window.currentStudentId = selectedStudent.studentId;

                    // Update form fields
                    studentSearch.value = selectedStudent.studentName;
                    selectedStudentId.value = selectedStudent.studentId;
                    searchResults.classList.remove('show');

                    // Display student details
                    displayStudentDetails();

                    // Enable payment fields
                    togglePaymentFields(true);

                    // Fetch Payment History
                    fetchPaymentHistory(studentId);

                    // Set max payment amount to pending amount
                    const pendingAmount = selectedStudent.pendingAmount;
                    if (paymentAmount) {
                        paymentAmount.setAttribute('max', pendingAmount);
                        paymentAmount.value = '';
                        updateAmountHelper();
                    }
                } else {
                    toast.error(response.message || 'Student not found');
                }
            })
            .catch(error => {
                console.error('Error fetching student details:', error);
                toast.error('Failed to load student details');
            });
    }

    // Fetch Payment History
    function fetchPaymentHistory(studentId) {
        const historyContainer = document.getElementById('paymentHistoryContainer');
        const historyList = document.getElementById('paymentHistoryList');
        const refreshBtn = document.getElementById('refreshHistoryBtn');
        
        if (refreshBtn) {
            refreshBtn.style.display = 'block';
            refreshBtn.onclick = () => fetchPaymentHistory(studentId);
        }
        
        // Show loading state
        historyContainer.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Loading history...</p></div>';
        if (historyList) historyList.style.display = 'none';

        fetch(`${CONTEXT_PATH}/fees/history?studentId=${encodeURIComponent(studentId)}`)
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    renderPaymentHistory(response.data);
                } else {
                    historyContainer.innerHTML = '<div class="text-center py-4 text-danger"><i class="bi bi-exclamation-circle"></i> Failed to load history</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching history:', error);
                historyContainer.innerHTML = '<div class="text-center py-4 text-danger"><i class="bi bi-exclamation-circle"></i> Error loading history</div>';
            });
    }

    // Render Payment History
    function renderPaymentHistory(transactions) {
        const historyContainer = document.getElementById('paymentHistoryContainer');
        const historyList = document.getElementById('paymentHistoryList');
        
        if (!transactions || transactions.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-history-state">
                    <div class="empty-icon">
                        <i class="bi bi-receipt-cutoff"></i>
                    </div>
                    <p>No payment history found for this student.</p>
                </div>
            `;
            if (historyList) historyList.style.display = 'none';
            return;
        }

        let html = '';
        transactions.forEach(t => {
            let dateStr = '-';
            let timeStr = '';
            if (t.transactionDate) {
                try {
                    const dateObj = new Date(t.transactionDate);
                    dateStr = dateObj.toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    });
                    timeStr = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit'
                    });
                } catch (e) { dateStr = t.transactionDate; }
            }

            // Determine icon based on payment method
            let iconClass = 'bi-cash-coin';
            const method = (t.paymentMode || t.paymentMethod || '').toLowerCase();
            if (method.includes('card')) iconClass = 'bi-credit-card';
            else if (method.includes('upi') || method.includes('phonepe') || method.includes('paytm')) iconClass = 'bi-phone';
            else if (method.includes('bank') || method.includes('transfer')) iconClass = 'bi-bank';
            
            html += `
                <div class="payment-history-item" onclick="window.showReceiptModal('${t.transactionId || t.id}', '${t.amount}', '${dateStr}', '${t.paymentMode || t.paymentMethod}', '${selectedStudent.studentName}', '${selectedStudent.studentId}')">
                    <div class="payment-history-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="payment-history-details">
                        <div class="payment-history-title">Tuition Fee</div>
                        <div class="payment-history-date">
                            <span>${dateStr}</span>
                            ${timeStr ? `<span>&bull;</span><span>${timeStr}</span>` : ''}
                        </div>
                    </div>
                    <div class="payment-history-amount-section">
                        <span class="payment-history-amount">₹${parseFloat(t.amount).toLocaleString('en-IN')}</span>
                        <span class="payment-history-status status-success">Paid</span>
                    </div>
                    <div class="payment-history-actions">
                        <button class="btn btn-icon-only" title="Download Receipt" onclick="event.stopPropagation(); window.downloadReceipt('${t.transactionId || t.id}', '${selectedStudent.studentName}', '${t.amount}', '${dateStr}', '${t.paymentMode || t.paymentMethod}')">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        historyContainer.innerHTML = ''; // Clear loading/empty state
        if (historyList) {
            historyList.innerHTML = html;
            historyList.style.display = 'block';
            historyContainer.appendChild(historyList);
        } else {
            const list = document.createElement('div');
            list.id = 'paymentHistoryList';
            list.innerHTML = html;
            historyContainer.appendChild(list);
        }
    }

    // Display Student Details
    function displayStudentDetails() {
        if (!selectedStudent) return;

        const pendingAmount = selectedStudent.pendingAmount;
        const status = selectedStudent.status || 'Pending';

        // Update Avatar
        const avatarEl = document.getElementById('detailAvatar');
        if (selectedStudent.profilePhotoUrl) {
            avatarEl.innerHTML = `<img src="${selectedStudent.profilePhotoUrl}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            avatarEl.innerHTML = `<i class="bi bi-person-fill"></i>`;
        }

        document.getElementById('detailName').textContent = selectedStudent.studentName;
        document.getElementById('detailCourse').textContent = selectedStudent.courseName || 'Not Assigned';
        document.getElementById('detailBatch').textContent = selectedStudent.batchName || 'Not Assigned';
        document.getElementById('detailStatus').innerHTML = `<span class="badge status-${status.toLowerCase()}">${status}</span>`;
        document.getElementById('detailTotalFee').textContent = '₹' + selectedStudent.totalFee.toLocaleString('en-IN');
        document.getElementById('detailPaidAmount').textContent = '₹' + selectedStudent.paidAmount.toLocaleString('en-IN');
        document.getElementById('detailPendingAmount').textContent = '₹' + pendingAmount.toLocaleString('en-IN');

        studentDetailsCard.style.display = 'block';
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
                
                toast('Form has been reset', { icon: 'ℹ️' });
            }
        });
    }

    // Handle Form Submit - ENHANCED WITH API INTEGRATION
    function handleFormSubmit(e) {
        e.preventDefault();

        // Comprehensive validation chain
        const validationResult = performComprehensiveValidation();
        if (!validationResult.isValid) {
            toast.error(validationResult.message);
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
        // Fix: Ensure date comparison is done in local time to avoid timezone issues
        const parts = paymentDate.value.split('-');
        const paymentDateValue = new Date(parts[0], parts[1] - 1, parts[2]);
        paymentDateValue.setHours(0, 0, 0, 0);
        
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
        oneYearAgo.setHours(0, 0, 0, 0);
        
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
            studentId: selectedStudent.studentId,
            amount: amount,
            paymentDate: paymentDate.value,
            paymentMethod: document.getElementById('paymentMethod').value,
            receiptNumber: receiptNumber.value,
            transactionId: document.getElementById('transactionId').value || null,
            bankName: document.getElementById('bankName').value || null,
            notes: document.getElementById('paymentNotes').value || null
        };

        return paymentData;
    }

    // Show Receipt Modal (Global for onclick access)
    window.showReceiptModal = function(id, amount, date, method, studentName = null, studentId = null) {
        // If student info not provided, use the currently selected student
        const receiptStudentName = studentName || (selectedStudent ? selectedStudent.studentName : 'N/A');
        
        Swal.fire({
            html: `
                <div class="receipt-modal-content" id="receiptContent" style="padding: 20px;">
                    <!-- Success Icon -->
                    <div class="text-center mb-4">
                        <div style="width: 64px; height: 64px; background: #34a853; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px;">
                            <i class="bi bi-check-lg"></i>
                        </div>
                        <h3 style="font-size: 22px; font-weight: 600; color: #e8eaed; margin-bottom: 6px;">Payment Successful</h3>
                        <p style="color: #9aa0a6; font-size: 13px; margin: 0;">Receipt #${id}</p>
                    </div>
                    
                    <!-- Amount -->
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 13px; color: #9aa0a6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Amount Paid</div>
                        <div style="font-size: 48px; font-weight: 400; color: #ffffff; font-family: 'Google Sans', sans-serif;">₹${parseFloat(amount).toLocaleString('en-IN')}</div>
                    </div>

                    <!-- Details -->
                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="color: #9aa0a6; font-size: 14px;">Student</span>
                            <span style="font-weight: 500; color: #e8eaed; font-size: 14px; text-align: right;">${receiptStudentName}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="color: #9aa0a6; font-size: 14px;">Date</span>
                            <span style="font-weight: 500; color: #e8eaed; font-size: 14px;">${date}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #9aa0a6; font-size: 14px;">Method</span>
                            <span style="font-weight: 500; color: #e8eaed; font-size: 14px;">${method}</span>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px;">
                        <button onclick="Swal.close()" style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); border-radius: 4px; color: #8ab4f8; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 14px;" onmouseover="this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.background='rgba(255,255,255,0.05)';">
                            Close
                        </button>
                        <button onclick="window.downloadReceipt('${id}', '${receiptStudentName}', '${amount}', '${date}', '${method}')" style="padding: 12px; border: none; background: #1a73e8; color: white; border-radius: 4px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='#1765cc';" onmouseout="this.style.background='#1a73e8';">
                            <i class="bi bi-download"></i>
                            Download
                        </button>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: false,
            width: '420px',
            padding: '32px',
            customClass: {
                popup: 'rounded-3'
            },
            background: '#202124'
        });
    };

    // Download Receipt as PDF
    window.downloadReceipt = function(id, studentName, amount, date, method) {
        // Create a printable receipt structure
        const receiptStudentName = studentName || (selectedStudent ? selectedStudent.studentName : 'N/A');
            
            const printWindow = window.open('', '_blank', 'width=800,height=900');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Receipt - ${id}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: Arial, sans-serif;
                            background: white;
                            padding: 24px;
                            color: #000;
                        }
                        .receipt-container {
                            max-width: 640px;
                            margin: 0 auto;
                            background: #fff;
                            border: 1px solid #000;
                            padding: 28px 30px;
                        }

                        /* Header */
                        .header-section {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            padding-bottom: 14px;
                            margin-bottom: 16px;
                            border-bottom: 2px solid #000;
                        }
                        .logo-container {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .logo {
                            width: 42px;
                            height: 42px;
                            border: 2px solid #000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .brand-info h1 {
                            font-size: 22px;
                            font-weight: bold;
                            margin-bottom: 2px;
                        }
                        .brand-info p {
                            font-size: 12px;
                            letter-spacing: 0.2px;
                        }
                        .receipt-info {
                            text-align: right;
                        }
                        .receipt-label {
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 3px;
                            font-weight: bold;
                        }
                        .receipt-number {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 6px;
                        }
                        .date-badge {
                            border: 1px solid #000;
                            padding: 4px 8px;
                            font-size: 11px;
                            font-weight: bold;
                            display: inline-block;
                        }

                        /* Sections */
                        .section-title {
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-weight: bold;
                            margin-bottom: 8px;
                        }
                        .block {
                            border: 1px solid #000;
                            padding: 14px 16px;
                            margin-bottom: 16px;
                        }
                        .student-name {
                            font-size: 17px;
                            font-weight: bold;
                        }

                        /* Item Rows */
                        .item-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #000;
                        }
                        .item-row:last-child {
                            border-bottom: none;
                        }
                        .item-label {
                            font-size: 13px;
                        }
                        .item-label-main {
                            font-weight: bold;
                        }
                        .item-value {
                            font-weight: bold;
                            font-size: 14px;
                        }
                        .payment-method-badge {
                            border: 1px solid #000;
                            padding: 3px 10px;
                            font-size: 12px;
                            font-weight: bold;
                        }

                        /* Totals */
                        .total-section {
                            border: 2px solid #000;
                            padding: 14px 16px;
                            margin-bottom: 18px;
                        }
                        .subtotal-row {
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 10px;
                            margin-bottom: 10px;
                            border-bottom: 1px solid #000;
                            font-size: 13px;
                        }
                        .total-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .total-label { font-size: 14px; font-weight: bold; }
                        .total-amount { font-size: 22px; font-weight: bold; }

                        /* Signature */
                        .signature-block {
                            margin-top: 18px;
                            text-align: right;
                        }
                        .signature-line {
                            width: 200px;
                            border-top: 1px solid #000;
                            margin-left: auto;
                            margin-top: 28px;
                            padding-top: 6px;
                            font-size: 12px;
                            text-align: center;
                        }

                        /* Barcode */
                        .barcode-container {
                            text-align: center;
                            padding-top: 18px;
                            margin-top: 10px;
                            border-top: 1px dashed #000;
                        }
                        .barcode {
                            width: 100%;
                            max-width: 300px;
                            height: auto;
                            margin-bottom: 10px;
                        }
                        .barcode-text {
                            font-size: 12px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            font-family: 'Courier New', monospace;
                        }

                        /* Footer */
                        .footer {
                            text-align: center;
                            padding-top: 16px;
                            border-top: 2px solid #000;
                            margin-top: 18px;
                        }
                        .footer-text {
                            font-size: 12px;
                            line-height: 1.5;
                        }
                        .footer-highlight { font-weight: bold; }

                        @media print {
                            body { padding: 0; }
                            .receipt-container { border: 1px solid #000; box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        <!-- Header -->
                        <div class="header-section">
                            <div class="logo-container">
                                <div class="logo">E</div>
                                <div class="brand-info">
                                    <h1>EduHub</h1>
                                    <p>Institute Management</p>
                                </div>
                            </div>
                            <div class="receipt-info">
                                <div class="receipt-label">Receipt No.</div>
                                <div class="receipt-number">#${id}</div>
                                <div class="receipt-label">Date</div>
                                <div class="date-badge">${date}</div>
                            </div>
                        </div>

                        <!-- Payee Info -->
                        <div class="block">
                            <div class="section-title">Received From</div>
                            <div class="student-name">${receiptStudentName}</div>
                        </div>

                        <!-- Payment Details -->
                        <div class="section-title">Payment Details</div>
                        <div class="block">
                            <div class="item-row">
                                <span class="item-label item-label-main">Description</span>
                                <span class="item-value">Tuition Fee Payment</span>
                            </div>
                            <div class="item-row">
                                <span class="item-label">Payment Method</span>
                                <span class="payment-method-badge">${method}</span>
                            </div>
                            <div class="item-row">
                                <span class="item-label">Subtotal</span>
                                <span class="item-value">₹${parseFloat(amount).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <!-- Total Section -->
                        <div class="total-section">
                            <div class="total-row">
                                <span class="total-label">Total Amount Paid</span>
                                <span class="total-amount">₹${parseFloat(amount).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <!-- Signature -->
                        <div class="signature-block">
                            <div class="signature-line">Authorized Signature</div>
                        </div>

                        <!-- Barcode -->
                        <div class="barcode-container">
                            <svg class="barcode" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
                                <rect x="10" y="0" width="3" height="60" fill="#000"/>
                                <rect x="16" y="0" width="2" height="60" fill="#000"/>
                                <rect x="21" y="0" width="4" height="60" fill="#000"/>
                                <rect x="28" y="0" width="2" height="60" fill="#000"/>
                                <rect x="33" y="0" width="3" height="60" fill="#000"/>
                                <rect x="39" y="0" width="2" height="60" fill="#000"/>
                                <rect x="44" y="0" width="4" height="60" fill="#000"/>
                                <rect x="51" y="0" width="3" height="60" fill="#000"/>
                                <rect x="57" y="0" width="2" height="60" fill="#000"/>
                                <rect x="62" y="0" width="3" height="60" fill="#000"/>
                                <rect x="68" y="0" width="4" height="60" fill="#000"/>
                                <rect x="75" y="0" width="2" height="60" fill="#000"/>
                                <rect x="80" y="0" width="3" height="60" fill="#000"/>
                                <rect x="86" y="0" width="2" height="60" fill="#000"/>
                                <rect x="91" y="0" width="4" height="60" fill="#000"/>
                                <rect x="98" y="0" width="3" height="60" fill="#000"/>
                                <rect x="104" y="0" width="2" height="60" fill="#000"/>
                                <rect x="109" y="0" width="4" height="60" fill="#000"/>
                                <rect x="116" y="0" width="2" height="60" fill="#000"/>
                                <rect x="121" y="0" width="3" height="60" fill="#000"/>
                                <rect x="127" y="0" width="4" height="60" fill="#000"/>
                                <rect x="134" y="0" width="2" height="60" fill="#000"/>
                                <rect x="139" y="0" width="3" height="60" fill="#000"/>
                                <rect x="145" y="0" width="2" height="60" fill="#000"/>
                                <rect x="150" y="0" width="4" height="60" fill="#000"/>
                                <rect x="157" y="0" width="3" height="60" fill="#000"/>
                                <rect x="163" y="0" width="2" height="60" fill="#000"/>
                                <rect x="168" y="0" width="3" height="60" fill="#000"/>
                                <rect x="174" y="0" width="4" height="60" fill="#000"/>
                                <rect x="181" y="0" width="2" height="60" fill="#000"/>
                                <rect x="186" y="0" width="3" height="60" fill="#000"/>
                                <rect x="192" y="0" width="2" height="60" fill="#000"/>
                                <rect x="197" y="0" width="4" height="60" fill="#000"/>
                                <rect x="204" y="0" width="3" height="60" fill="#000"/>
                                <rect x="210" y="0" width="2" height="60" fill="#000"/>
                                <rect x="215" y="0" width="4" height="60" fill="#000"/>
                                <rect x="222" y="0" width="2" height="60" fill="#000"/>
                                <rect x="227" y="0" width="3" height="60" fill="#000"/>
                                <rect x="233" y="0" width="4" height="60" fill="#000"/>
                                <rect x="240" y="0" width="2" height="60" fill="#000"/>
                                <rect x="245" y="0" width="3" height="60" fill="#000"/>
                                <rect x="251" y="0" width="2" height="60" fill="#000"/>
                                <rect x="256" y="0" width="4" height="60" fill="#000"/>
                                <rect x="263" y="0" width="3" height="60" fill="#000"/>
                                <rect x="269" y="0" width="2" height="60" fill="#000"/>
                                <rect x="274" y="0" width="3" height="60" fill="#000"/>
                                <rect x="280" y="0" width="4" height="60" fill="#000"/>
                                <rect x="287" y="0" width="2" height="60" fill="#000"/>
                            </svg>
                            <div class="barcode-text">${id}</div>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                            <div class="footer-text">
                                Thank you for your payment.<br>
                                For queries, contact us at <span class="footer-highlight">support@eduhub.com</span><br>
                                <span style="font-size: 10px; margin-top: 6px; display: block;">This is a computer-generated receipt.</span>
                            </div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(() => window.print(), 250);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
    };

    // Show enhanced confirmation modal
    function showEnhancedConfirmationModal(paymentData) {
        let message = `
            <div class="confirm-payment-summary">
                <div class="text-center mb-3">
                    <div class="text-muted mb-1">You are collecting</div>
                    <div class="confirm-amount">₹${paymentData.amount.toLocaleString('en-IN')}</div>
                </div>
                <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
                    <span class="text-muted">Student</span>
                    <span class="fw-bold text-end">${selectedStudent.studentName}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
                    <span class="text-muted">Method</span>
                    <span class="fw-bold text-end">${paymentData.paymentMethod}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted">Date</span>
                    <span class="fw-bold text-end">${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}</span>
                </div>
            </div>
            <p class="text-muted small text-center mb-0">Please verify the details before proceeding.</p>
        `;

        Swal.fire({
            title: 'Confirm Payment',
            html: message,
            showCancelButton: true,
            confirmButtonText: 'Collect Payment',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'var(--primary-color)',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            focusConfirm: false,
            customClass: {
                popup: 'rounded-4'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                processPayment(paymentData);
            }
        });
    }

    // Process Payment
    function processPayment(paymentData) {
        // Show loading toast
        const loadingToastId = toast.loading('Processing payment...');

        // Call Backend API
        fetch(`${CONTEXT_PATH}/fees/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(response => {
            // Dismiss loading toast
            toast.dismiss(loadingToastId);

            if (response.success) {
                // Show the new Receipt Modal on success
                window.showReceiptModal(
                    response.transactionId || paymentData.receiptNumber, 
                    paymentData.amount, 
                    new Date().toLocaleDateString('en-IN'), 
                    paymentData.paymentMethod
                );
                
                // Reset form logic
                form.reset();
                form.classList.remove('was-validated');
                
                // Keep student selected but refresh history
                if (selectedStudent) {
                    // Update pending amount locally for immediate feedback
                    selectedStudent.paidAmount += paymentData.amount;
                    displayStudentDetails();
                    fetchPaymentHistory(selectedStudent.studentId);
                    
                    // Reset amount field
                    if (paymentAmount) {
                        paymentAmount.value = '';
                        updateAmountHelper();
                    }
                }
                
                generateReceiptNumber();
            } else {
                toast.error(response.message || 'Failed to record payment');
            }
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            toast.dismiss(loadingToastId);
            toast.error('An error occurred while processing the payment');
        });
    }

    // Show Fee Details Modal
    window.showFeeDetailsModal = function() {
        if (!selectedStudent) {
            toast.error('Please select a student first');
            return;
        }

        const pendingAmount = selectedStudent.pendingAmount || (selectedStudent.totalFee - selectedStudent.paidAmount);
        const paymentPercentage = selectedStudent.totalFee > 0 ? ((selectedStudent.paidAmount / selectedStudent.totalFee) * 100).toFixed(1) : 0;

        Swal.fire({
            html: `
                <div class="fee-details-modal-content" style="text-align: left; padding: 10px;">
                    <!-- Modal Header with Student Info -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 2rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                            <i class="bi bi-receipt"></i>
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-weight: 700; color: var(--text-color);">${selectedStudent.studentName}</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">
                            ${selectedStudent.courseName || 'N/A'} ${selectedStudent.batchName ? `• ${selectedStudent.batchName}` : ''}
                        </p>
                    </div>

                    <!-- Fee Amount Display -->
                    <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border-radius: 12px; border: 2px solid var(--border-color);">
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600;">Total Course Fee</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-color); line-height: 1;">₹${selectedStudent.totalFee.toLocaleString('en-IN')}</div>
                    </div>

                    <!-- Payment Progress -->
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-weight: 600; color: var(--text-color); font-size: 0.9rem;">Payment Progress</span>
                            <span style="font-weight: 700; color: ${paymentPercentage >= 100 ? '#28a745' : '#007bff'}; font-size: 1rem;">${paymentPercentage}%</span>
                        </div>
                        <div style="width: 100%; height: 14px; background: #e9ecef; border-radius: 20px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="width: ${paymentPercentage}%; height: 100%; background: linear-gradient(90deg, #28a745, #20c997); border-radius: 20px; transition: width 0.5s ease;"></div>
                        </div>
                    </div>

                    <!-- Fee Breakdown Cards -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <!-- Paid Card -->
                        <div style="background: rgba(40, 167, 69, 0.1); border: 2px solid rgba(40, 167, 69, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
                            <div style="width: 40px; height: 40px; background: #28a745; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: white; font-size: 1.2rem;">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #28a745; margin-bottom: 5px; font-weight: 600;">Paid Amount</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: #28a745;">₹${selectedStudent.paidAmount.toLocaleString('en-IN')}</div>
                        </div>

                        <!-- Pending Card -->
                        <div style="background: rgba(220, 53, 69, 0.1); border: 2px solid rgba(220, 53, 69, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
                            <div style="width: 40px; height: 40px; background: #dc3545; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: white; font-size: 1.2rem;">
                                <i class="bi bi-clock-fill"></i>
                            </div>
                            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #dc3545; margin-bottom: 5px; font-weight: 600;">Pending Balance</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: #dc3545;">₹${pendingAmount.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    <!-- Payment Status Badge -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        ${pendingAmount <= 0 
                            ? '<div style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724; padding: 12px 24px; border-radius: 25px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2);"><i class="bi bi-patch-check-fill" style="font-size: 1.2rem;"></i>Fully Paid - No Balance Due</div>'
                            : `<div style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #fff3cd, #ffeaa7); color: #856404; padding: 12px 24px; border-radius: 25px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(255, 193, 7, 0.2);"><i class="bi bi-exclamation-triangle-fill" style="font-size: 1.2rem;"></i>Balance Due: ₹${pendingAmount.toLocaleString('en-IN')}</div>`
                        }
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;">
                        <button onclick="Swal.close()" style="padding: 12px; border-radius: 10px; border: 2px solid var(--border-color); background: transparent; color: var(--text-color); font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                            <i class="bi bi-x-lg me-1"></i>Close
                        </button>
                        <button onclick="window.print()" style="padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); font-size: 0.9rem;">
                            <i class="bi bi-printer me-1"></i>Print Details
                        </button>
                    </div>

                    <!-- Footer Note -->
                    <div style="margin-top: 20px; padding: 12px; background: var(--light-bg); border-left: 3px solid #007bff; border-radius: 6px;">
                        <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                            <i class="bi bi-info-circle-fill me-1" style="color: #007bff;"></i>
                            All payment transactions are securely recorded. Download receipts from the payment history section.
                        </p>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: '550px',
            padding: '30px 20px',
            customClass: {
                popup: 'rounded-4',
                closeButton: 'btn-close-white'
            },
            backdrop: 'rgba(0,0,0,0.6)'
        });
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
