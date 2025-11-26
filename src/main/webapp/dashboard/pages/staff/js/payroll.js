/**
 * Payroll & Salary Management System
 * Comprehensive payroll processing with salary management
 */

// Sample staff payroll data (November 2025 - Current Month)
const staffPayrollData = [
    { id: 1, empId: "EMP001", name: "Dr. Robert Johnson", department: "teaching", designation: "Senior Teacher", basicSalary: 45000, allowances: 8000, deductions: 3500, status: "pending" },
    { id: 2, empId: "EMP002", name: "Ms. Sarah Williams", department: "teaching", designation: "Teacher", basicSalary: 38000, allowances: 6000, deductions: 2800, status: "pending" },
    { id: 3, empId: "EMP003", name: "Mrs. Emily Parker", department: "teaching", designation: "Teacher", basicSalary: 35000, allowances: 5500, deductions: 2500, status: "pending" },
    { id: 4, empId: "EMP004", name: "Dr. Lisa Anderson", department: "teaching", designation: "Principal", basicSalary: 65000, allowances: 15000, deductions: 6000, status: "pending" },
    { id: 5, empId: "EMP005", name: "Ms. Anna Martinez", department: "teaching", designation: "Teacher", basicSalary: 36000, allowances: 5800, deductions: 2600, status: "pending" },
    { id: 6, empId: "EMP006", name: "Mr. Thomas Brown", department: "teaching", designation: "Vice Principal", basicSalary: 55000, allowances: 12000, deductions: 5000, status: "processing" },
    { id: 7, empId: "EMP007", name: "Dr. Michelle Lee", department: "teaching", designation: "HOD Science", basicSalary: 48000, allowances: 9000, deductions: 3800, status: "processing" },
    { id: 8, empId: "EMP008", name: "Mr. David Kumar", department: "teaching", designation: "Teacher", basicSalary: 37000, allowances: 6200, deductions: 2700, status: "pending" },
    { id: 9, empId: "EMP009", name: "Mr. Michael Chen", department: "administration", designation: "Office Manager", basicSalary: 42000, allowances: 7500, deductions: 3200, status: "pending" },
    { id: 10, empId: "EMP010", name: "Ms. Jennifer Davis", department: "administration", designation: "Admin Officer", basicSalary: 32000, allowances: 5000, deductions: 2200, status: "pending" },
    { id: 11, empId: "EMP011", name: "Mr. Christopher White", department: "administration", designation: "Receptionist", basicSalary: 25000, allowances: 3500, deductions: 1800, status: "pending" },
    { id: 12, empId: "EMP012", name: "Mrs. Patricia Garcia", department: "administration", designation: "Admin Assistant", basicSalary: 28000, allowances: 4000, deductions: 2000, status: "processing" },
    { id: 13, empId: "EMP013", name: "Mr. Alex Thompson", department: "it", designation: "IT Manager", basicSalary: 50000, allowances: 10000, deductions: 4500, status: "paid" },
    { id: 14, empId: "EMP014", name: "Ms. Rachel Green", department: "it", designation: "System Admin", basicSalary: 38000, allowances: 6500, deductions: 2900, status: "pending" },
    { id: 15, empId: "EMP015", name: "Mr. Kevin Moore", department: "it", designation: "Tech Support", basicSalary: 30000, allowances: 4500, deductions: 2100, status: "pending" },
    { id: 16, empId: "EMP016", name: "Mr. James Wilson", department: "management", designation: "Director", basicSalary: 85000, allowances: 25000, deductions: 10000, status: "paid" },
    { id: 17, empId: "EMP017", name: "Dr. Susan Taylor", department: "management", designation: "Academic Head", basicSalary: 72000, allowances: 18000, deductions: 8000, status: "paid" },
    { id: 18, empId: "EMP018", name: "Mr. Richard Miller", department: "accounts", designation: "Accountant", basicSalary: 40000, allowances: 7000, deductions: 3000, status: "processing" },
    { id: 19, empId: "EMP019", name: "Ms. Linda Johnson", department: "accounts", designation: "Finance Officer", basicSalary: 45000, allowances: 8500, deductions: 3600, status: "paid" },
    { id: 20, empId: "EMP020", name: "Mrs. Margaret Brown", department: "library", designation: "Librarian", basicSalary: 32000, allowances: 5000, deductions: 2200, status: "unpaid" },
    { id: 21, empId: "EMP021", name: "Mr. Paul Anderson", department: "library", designation: "Library Assistant", basicSalary: 24000, allowances: 3200, deductions: 1600, status: "pending" }
];

// Global variables
let allStaff = [...staffPayrollData];
let filteredStaff = [...staffPayrollData];
let currentPage = 1;
let itemsPerPage = 10;

// DOM Elements
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const departmentFilter = document.getElementById('departmentFilter');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const selectAll = document.getElementById('selectAll');
const tableBody = document.getElementById('payrollTableBody');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const paginationContainer = document.getElementById('paginationContainer');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePayroll();
    attachEventListeners();
    loadPayrollData();
});

// Helper function to get Bootstrap button class based on status
function getStatusButtonClass(status) {
    switch(status) {
        case 'paid':
            return 'btn-success';
        case 'unpaid':
            return 'btn-danger';
        case 'pending':
            return 'btn-warning';
        case 'processing':
            return 'btn-info';
        default:
            return 'btn-secondary';
    }
}

function initializePayroll() {
    // Set current month and year
    const now = new Date();
    monthSelect.value = String(now.getMonth() + 1).padStart(2, '0');
    yearSelect.value = now.getFullYear();
    
    // Set default status filter to 'pending'
    if (statusFilter) {
        statusFilter.value = 'pending';
    }
}

function attachEventListeners() {
    // Filters
    if (monthSelect) monthSelect.addEventListener('change', filterStaff);
    if (yearSelect) yearSelect.addEventListener('change', filterStaff);
    if (departmentFilter) departmentFilter.addEventListener('change', filterStaff);
    if (statusFilter) statusFilter.addEventListener('change', filterStaff);
    if (searchInput) searchInput.addEventListener('input', filterStaff);
    if (itemsPerPageSelect) itemsPerPageSelect.addEventListener('change', changeItemsPerPage);
    
    // Select all checkbox
    if (selectAll) selectAll.addEventListener('change', toggleSelectAll);
    
    // Bulk actions
    const markAsPaidBtn = document.getElementById('markAsPaidBtn');
    const sendPayslipsBtn = document.getElementById('sendPayslipsBtn');
    const processPayrollBtn = document.getElementById('processPayrollBtn');
    const generatePayslipsBtn = document.getElementById('generatePayslipsBtn');
    const exportPayrollBtn = document.getElementById('exportPayrollBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    if (markAsPaidBtn) markAsPaidBtn.addEventListener('click', markSelectedAsPaid);
    if (sendPayslipsBtn) sendPayslipsBtn.addEventListener('click', sendPayslips);
    if (processPayrollBtn) processPayrollBtn.addEventListener('click', processPayroll);
    if (generatePayslipsBtn) generatePayslipsBtn.addEventListener('click', generateAllPayslips);
    if (exportPayrollBtn) exportPayrollBtn.addEventListener('click', exportPayrollReport);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Edit salary modal listeners
    const editBasicSalary = document.getElementById('editBasicSalary');
    const editAllowances = document.getElementById('editAllowances');
    const editDeductions = document.getElementById('editDeductions');
    
    if (editBasicSalary) editBasicSalary.addEventListener('input', calculateNetSalary);
    if (editAllowances) editAllowances.addEventListener('input', calculateNetSalary);
    if (editDeductions) editDeductions.addEventListener('input', calculateNetSalary);
    
    const saveSalaryBtn = document.getElementById('saveSalaryBtn');
    if (saveSalaryBtn) saveSalaryBtn.addEventListener('click', saveSalaryChanges);
    
    // Payslip modal action listeners
    const downloadPayslipBtn = document.getElementById('downloadPayslipBtn');
    const emailPayslipBtn = document.getElementById('emailPayslipBtn');
    
    if (downloadPayslipBtn) downloadPayslipBtn.addEventListener('click', downloadPayslip);
    if (emailPayslipBtn) emailPayslipBtn.addEventListener('click', emailPayslip);
}

function filterStaff() {
    const department = departmentFilter.value.toLowerCase();
    const status = statusFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredStaff = allStaff.filter(staff => {
        const matchDepartment = !department || staff.department === department;
        const matchStatus = !status || staff.status === status;
        const matchSearch = !searchTerm || 
            staff.name.toLowerCase().includes(searchTerm) ||
            staff.empId.toLowerCase().includes(searchTerm) ||
            staff.designation.toLowerCase().includes(searchTerm);
        
        return matchDepartment && matchStatus && matchSearch;
    });
    
    currentPage = 1;
    loadPayrollData();
}

function loadPayrollData() {
    if (filteredStaff.length === 0) {
        showEmptyState();
        updateStatistics();
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedStaff = filteredStaff.slice(start, end);
    
    tableBody.innerHTML = '';
    
    paginatedStaff.forEach(staff => {
        const row = createStaffRow(staff);
        tableBody.appendChild(row);
    });
    
    updatePagination();
    updateStatistics();
    updateSelectAllCheckbox();
}

function createStaffRow(staff) {
    const row = document.createElement('tr');
    row.dataset.staffId = staff.id;
    
    const netSalary = staff.basicSalary + staff.allowances - staff.deductions;
    
    row.innerHTML = `
        <td>
            <div class="form-check">
                <input type="checkbox" class="form-check-input row-checkbox" data-staff-id="${staff.id}">
            </div>
        </td>
        <td><strong>${staff.empId}</strong></td>
        <td>${staff.name}</td>
        <td>
            <span class="department-badge ${staff.department}">${staff.department.toUpperCase()}</span>
        </td>
        <td>${staff.designation}</td>
        <td class="salary-amount">₹${formatCurrency(staff.basicSalary)}</td>
        <td class="salary-amount salary-positive">+₹${formatCurrency(staff.allowances)}</td>
        <td class="salary-amount salary-negative">-₹${formatCurrency(staff.deductions)}</td>
        <td class="salary-amount"><strong>₹${formatCurrency(netSalary)}</strong></td>
        <td>
            <div class="dropdown">
                <button class="btn btn-sm ${getStatusButtonClass(staff.status)} dropdown-toggle" type="button" id="statusDropdown${staff.id}" data-bs-toggle="dropdown" aria-expanded="false" data-staff-id="${staff.id}">
                    ${capitalizeFirst(staff.status)}
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="statusDropdown${staff.id}">
                    <li><a class="dropdown-item" href="#" data-status="unpaid" data-staff-id="${staff.id}">
                        <i class="bi bi-x-circle-fill text-danger me-2"></i>Unpaid
                    </a></li>
                    <li><a class="dropdown-item" href="#" data-status="pending" data-staff-id="${staff.id}">
                        <i class="bi bi-clock-fill text-warning me-2"></i>Pending
                    </a></li>
                    <li><a class="dropdown-item" href="#" data-status="processing" data-staff-id="${staff.id}">
                        <i class="bi bi-arrow-repeat text-info me-2"></i>Processing
                    </a></li>
                    <li><a class="dropdown-item" href="#" data-status="paid" data-staff-id="${staff.id}">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>Paid
                    </a></li>
                </ul>
            </div>
        </td>
        <td>
            <button class="btn btn-sm btn-primary btn-action" onclick="viewPayslip(${staff.id})" title="View Payslip">
                <i class="bi bi-file-earmark-text"></i>
            </button>
            <button class="btn btn-sm btn-info btn-action" onclick="editSalary(${staff.id})" title="Edit Salary">
                <i class="bi bi-pencil"></i>
            </button>
        </td>
    `;
    
    // Add event listener to checkbox
    const checkbox = row.querySelector('.row-checkbox');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
        updateSelectAllCheckbox();
        updateSelectedCount();
    });
    
    // Add event listeners to status dropdown items
    const statusItems = row.querySelectorAll('.dropdown-item');
    const statusButton = row.querySelector('.dropdown-toggle');
    
    // Initialize Bootstrap dropdown
    if (typeof bootstrap !== 'undefined') {
        new bootstrap.Dropdown(statusButton);
    }
    
    statusItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const newStatus = this.dataset.status;
            const oldStatus = staff.status;
            
            // Update staff status
            staff.status = newStatus;
            
            // Update button text and class with Bootstrap button variant
            statusButton.textContent = capitalizeFirst(newStatus);
            statusButton.className = `btn btn-sm ${getStatusButtonClass(newStatus)} dropdown-toggle`;
            
            // Re-initialize dropdown after class change
            if (typeof bootstrap !== 'undefined') {
                const dropdown = bootstrap.Dropdown.getInstance(statusButton);
                if (dropdown) {
                    dropdown.dispose();
                }
                new bootstrap.Dropdown(statusButton);
            }
            
            // Update statistics
            updateStatistics();
            
            // Show success notification
            toast.success('Status changed from ' + capitalizeFirst(oldStatus) + ' to ' + capitalizeFirst(newStatus) + ' for ' + staff.name);
        });
    });
    
    return row;
}

function showEmptyState() {
    tableBody.innerHTML = `
        <tr class="empty-state-row">
            <td colspan="11" class="text-center py-5">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="bi bi-search"></i>
                    </div>
                    <h4 class="empty-state-title">No Staff Found</h4>
                    <p class="empty-state-text">No staff members match your current filters</p>
                </div>
            </td>
        </tr>
    `;
    paginationContainer.innerHTML = '';
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const rows = document.querySelectorAll('#payrollTable tbody tr:not(.empty-state-row)');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = selectAll.checked;
        if (selectAll.checked) {
            rows[index]?.classList.add('selected');
        } else {
            rows[index]?.classList.remove('selected');
        }
    });
    
    updateSelectedCount();
}

function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    
    if (!selectAll) return;
    
    if (checkboxes.length === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    } else if (checkedBoxes.length === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    } else if (checkedBoxes.length === checkboxes.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
    }
    
    // Update selected count whenever checkbox state changes
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedCount = document.getElementById('selectedCount');
    if (selectedCount) {
        selectedCount.textContent = checkedBoxes.length;
    }
}

function updateStatistics() {
    // Total staff count
    const totalStaffCount = document.getElementById('totalStaffCount');
    if (totalStaffCount) {
        totalStaffCount.textContent = allStaff.length;
    }
    
    // Total payroll
    const totalPayroll = allStaff.reduce((sum, staff) => {
        return sum + (staff.basicSalary + staff.allowances - staff.deductions);
    }, 0);
    const totalPayrollEl = document.getElementById('totalPayroll');
    if (totalPayrollEl) {
        totalPayrollEl.textContent = `₹${formatCurrency(totalPayroll)}`;
    }
    
    // Pending count (includes unpaid and pending)
    const pendingCount = allStaff.filter(s => s.status === 'pending' || s.status === 'unpaid').length;
    const pendingCountEl = document.getElementById('pendingCount');
    if (pendingCountEl) {
        pendingCountEl.textContent = pendingCount;
    }
    
    // Paid count
    const paidCount = allStaff.filter(s => s.status === 'paid').length;
    const paidCountEl = document.getElementById('paidCount');
    if (paidCountEl) {
        paidCountEl.textContent = paidCount;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    
    // Update showing info
    const start = filteredStaff.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredStaff.length);
    
    document.getElementById('showingStart').textContent = start;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalEntries').textContent = filteredStaff.length;
    
    // Build pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Bind click events
    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                currentPage = page;
                loadPayrollData();
            }
        });
    });
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    loadPayrollData();
}

// View Payslip
function viewPayslip(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    const netSalary = staff.basicSalary + staff.allowances - staff.deductions;
    const month = monthSelect.options[monthSelect.selectedIndex].text;
    const year = yearSelect.value;
    const grossSalary = staff.basicSalary + staff.allowances;
    
    // Get current date for generation
    const currentDate = new Date();
    const generatedDate = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const payslipContent = `
        <div class="professional-payslip">
            <!-- Header Section -->
            <div class="payslip-header-section">
                <div class="company-info">
                    <h2 class="company-name">EduHub Institute</h2>
                    <p class="company-address">123 Education Street, Learning City, India - 400001</p>
                    <p class="company-contact">Email: hr@eduhub.com | Phone: +91 22 1234 5678</p>
                </div>
                <div class="payslip-title-box">
                    <h1 class="payslip-title">SALARY SLIP</h1>
                    <p class="payslip-period">For the month of ${month} ${year}</p>
                </div>
            </div>

            <!-- Employee Information -->
            <div class="employee-info-section">
                <div class="row">
                    <div class="col-md-6">
                        <table class="info-table">
                            <tr>
                                <td class="label-cell">Employee Name:</td>
                                <td class="value-cell"><strong>${staff.name}</strong></td>
                            </tr>
                            <tr>
                                <td class="label-cell">Employee ID:</td>
                                <td class="value-cell"><strong>${staff.empId}</strong></td>
                            </tr>
                            <tr>
                                <td class="label-cell">Designation:</td>
                                <td class="value-cell">${staff.designation}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="info-table">
                            <tr>
                                <td class="label-cell">Department:</td>
                                <td class="value-cell">${capitalizeFirst(staff.department)}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Pay Period:</td>
                                <td class="value-cell">${month} ${year}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Payment Date:</td>
                                <td class="value-cell">${generatedDate}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Salary Breakdown Table -->
            <div class="salary-breakdown-section">
                <table class="salary-table">
                    <thead>
                        <tr>
                            <th colspan="2" class="earnings-header">EARNINGS</th>
                            <th colspan="2" class="deductions-header">DEDUCTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="item-name">Basic Salary</td>
                            <td class="amount-cell">₹${formatCurrency(staff.basicSalary)}</td>
                            <td class="item-name">Tax (TDS)</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.deductions * 0.4))}</td>
                        </tr>
                        <tr>
                            <td class="item-name">House Rent Allowance (HRA)</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.allowances * 0.5))}</td>
                            <td class="item-name">Provident Fund (PF)</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.deductions * 0.4))}</td>
                        </tr>
                        <tr>
                            <td class="item-name">Dearness Allowance (DA)</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.allowances * 0.3))}</td>
                            <td class="item-name">Professional Tax</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.deductions * 0.1))}</td>
                        </tr>
                        <tr>
                            <td class="item-name">Transport Allowance</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.allowances * 0.2))}</td>
                            <td class="item-name">Insurance</td>
                            <td class="amount-cell">₹${formatCurrency(Math.floor(staff.deductions * 0.1))}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="total-label"><strong>GROSS EARNINGS</strong></td>
                            <td class="total-amount"><strong>₹${formatCurrency(grossSalary)}</strong></td>
                            <td class="total-label"><strong>TOTAL DEDUCTIONS</strong></td>
                            <td class="total-amount"><strong>₹${formatCurrency(staff.deductions)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Net Salary Section -->
            <div class="net-salary-section">
                <div class="net-salary-box">
                    <div class="net-salary-label">NET SALARY PAYABLE</div>
                    <div class="net-salary-amount">₹${formatCurrency(netSalary)}</div>
                    <div class="net-salary-words">(${numberToWords(netSalary)} Rupees Only)</div>
                </div>
            </div>

            <!-- Footer Section -->
            <div class="payslip-footer-section">
                <div class="row">
                    <div class="col-md-6">
                        <p class="note-text"><strong>Note:</strong> This is a computer-generated payslip and does not require a signature.</p>
                    </div>
                    <div class="col-md-6 text-end">
                        <div class="signature-section">
                            <div class="signature-line"></div>
                            <p class="signature-label">Authorized Signatory</p>
                            <p class="company-seal">EduHub Institute</p>
                        </div>
                    </div>
                </div>
                <div class="confidential-text">
                    <i class="bi bi-shield-lock"></i> This payslip is confidential and intended solely for the use of the employee.
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('payslipContent').innerHTML = payslipContent;
    
    // Store staff ID for download/email actions
    document.getElementById('downloadPayslipBtn').dataset.staffId = staffId;
    document.getElementById('emailPayslipBtn').dataset.staffId = staffId;
    
    const payslipModal = new bootstrap.Modal(document.getElementById('payslipModal'));
    payslipModal.show();
}

// Helper function to convert number to words (simplified for Indian numbering)
function numberToWords(num) {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    function convertLessThanThousand(n) {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
    }
    
    if (num < 1000) return convertLessThanThousand(num);
    if (num < 100000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        return convertLessThanThousand(thousands) + ' Thousand' + (remainder ? ' ' + convertLessThanThousand(remainder) : '');
    }
    
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertLessThanThousand(lakhs) + ' Lakh' + (remainder ? ' ' + numberToWords(remainder) : '');
}

// Edit Salary
function editSalary(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    document.getElementById('editStaffId').value = staff.id;
    document.getElementById('editStaffName').value = staff.name;
    document.getElementById('editBasicSalary').value = staff.basicSalary;
    document.getElementById('editAllowances').value = staff.allowances;
    document.getElementById('editDeductions').value = staff.deductions;
    
    calculateNetSalary();
    
    const editSalaryModal = new bootstrap.Modal(document.getElementById('editSalaryModal'));
    editSalaryModal.show();
}

function calculateNetSalary() {
    const basic = parseFloat(document.getElementById('editBasicSalary').value) || 0;
    const allowances = parseFloat(document.getElementById('editAllowances').value) || 0;
    const deductions = parseFloat(document.getElementById('editDeductions').value) || 0;
    
    const netSalary = basic + allowances - deductions;
    document.getElementById('editNetSalary').value = `₹${formatCurrency(netSalary)}`;
}

function saveSalaryChanges() {
    const staffId = parseInt(document.getElementById('editStaffId').value);
    const basicSalary = parseFloat(document.getElementById('editBasicSalary').value);
    const allowances = parseFloat(document.getElementById('editAllowances').value);
    const deductions = parseFloat(document.getElementById('editDeductions').value);
    
    const staff = allStaff.find(s => s.id === staffId);
    if (staff) {
        staff.basicSalary = basicSalary;
        staff.allowances = allowances;
        staff.deductions = deductions;
        
        loadPayrollData();
        
        const editSalaryModal = bootstrap.Modal.getInstance(document.getElementById('editSalaryModal'));
        editSalaryModal.hide();
        
        toast.success('Salary updated for ' + staff.name);
    }
}

// Mark as Paid
function markAsPaid(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    showConfirmationModal({
        title: 'Mark as Paid',
        message: `Mark salary as paid for <strong>${staff.name}</strong>?`,
        confirmText: 'Yes, Mark as Paid',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-check-circle text-success',
        onConfirm: function() {
            staff.status = 'paid';
            loadPayrollData();
            toast.success(staff.name + ' marked as paid');
        }
    });
}

// Mark Selected as Paid
function markSelectedAsPaid() {
    const selected = getSelectedStaffIds();
    if (selected.length === 0) {
        toast('Please select staff members first', { icon: '⚠️' });
        return;
    }
    
    showConfirmationModal({
        title: 'Mark Selected as Paid',
        message: `Mark <strong>${selected.length} staff member(s)</strong> as paid?`,
        confirmText: 'Yes, Mark as Paid',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-check-circle text-success',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading(`Updating payment status for ${selected.length} staff member(s)...`);
            
            setTimeout(() => {
                selected.forEach(staffId => {
                    const staff = allStaff.find(s => s.id === staffId);
                    if (staff) staff.status = 'paid';
                });
                
                loadPayrollData();
                
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                toast.success(`${selected.length} staff member(s) marked as paid`);
            }, 800);
        }
    });
}

// Send Payslips
function sendPayslips() {
    const selected = getSelectedStaffIds();
    if (selected.length === 0) {
        toast('Please select staff members first', { icon: '⚠️' });
        return;
    }
    
    showConfirmationModal({
        title: 'Send Payslips',
        message: `Send payslips via email to <strong>${selected.length} staff member(s)</strong>?`,
        confirmText: 'Yes, Send Payslips',
        cancelText: 'Cancel',
        confirmClass: 'btn-info',
        icon: 'bi-envelope text-info',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading(`Sending payslips to ${selected.length} staff member(s)...`);
            
            // Simulate sending
            setTimeout(() => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                toast.success(`Payslips sent to ${selected.length} staff member(s)`);
            }, 1200);
        }
    });
}

// Process Payroll
function processPayroll() {
    const pendingStaff = filteredStaff.filter(s => s.status === 'pending');
    
    if (pendingStaff.length === 0) {
        toast('No pending payroll to process', { icon: 'ℹ️' });
        return;
    }
    
    showConfirmationModal({
        title: 'Process Payroll',
        message: `Process payroll for <strong>${pendingStaff.length} pending staff member(s)</strong>?`,
        confirmText: 'Yes, Process Payroll',
        cancelText: 'Cancel',
        confirmClass: 'btn-primary',
        icon: 'bi-arrow-repeat text-primary',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading(`Processing payroll for ${pendingStaff.length} staff member(s)...`);
            
            setTimeout(() => {
                pendingStaff.forEach(staff => {
                    staff.status = 'processing';
                });
                
                loadPayrollData();
                
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                toast.success(`Payroll processing started for ${pendingStaff.length} staff member(s)`);
            }, 1000);
        }
    });
}

// Generate All Payslips
function generateAllPayslips() {
    showConfirmationModal({
        title: 'Generate Payslips',
        message: `Generate payslips for all <strong>${filteredStaff.length} staff member(s)</strong>?`,
        confirmText: 'Yes, Generate',
        cancelText: 'Cancel',
        confirmClass: 'btn-success',
        icon: 'bi-file-earmark-text text-success',
        onConfirm: function() {
            // Show loading toast
            const loadingToastId = toast.loading(`Generating payslips for ${filteredStaff.length} staff members...`);
            
            setTimeout(() => {
                // Dismiss loading toast
                toast.dismiss(loadingToastId);
                
                toast.success(`${filteredStaff.length} payslips generated successfully`);
                // Implement actual generation logic
            }, 1500);
        }
    });
}

// Export Payroll Report
function exportPayrollReport() {
    const month = monthSelect.options[monthSelect.selectedIndex].text;
    const year = yearSelect.value;
    
    // Show loading toast
    const loadingToastId = toast.loading('Preparing payroll export...');
    
    setTimeout(() => {
        let csv = `Payroll Report - ${month} ${year}\n\n`;
        csv += 'Emp ID,Name,Department,Designation,Basic Salary,Allowances,Deductions,Net Salary,Status\n';
        
        filteredStaff.forEach(staff => {
            const netSalary = staff.basicSalary + staff.allowances - staff.deductions;
            csv += `${staff.empId},"${staff.name}",${staff.department},${staff.designation},${staff.basicSalary},${staff.allowances},${staff.deductions},${netSalary},${staff.status}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_${month}_${year}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        toast.success(`Payroll report exported successfully for ${month} ${year}`);
    }, 800);
}

// Clear Filters
function clearFilters() {
    // Reset all filter controls to default values
    const now = new Date();
    
    // Reset month and year to current
    if (monthSelect) monthSelect.value = String(now.getMonth() + 1).padStart(2, '0');
    if (yearSelect) yearSelect.value = now.getFullYear().toString();
    
    // Reset department to all
    if (departmentFilter) departmentFilter.value = '';
    
    // Reset status to pending (default)
    if (statusFilter) statusFilter.value = 'pending';
    
    // Clear search input
    if (searchInput) searchInput.value = '';
    
    // Re-apply filters
    filterStaff();
    
    // Show notification
    toast('All filters have been reset', { icon: 'ℹ️' });
}

// Helper Functions
function getSelectedStaffIds() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.dataset.staffId));
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-IN');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Download Payslip as PDF (using browser print)
function downloadPayslip() {
    const staffId = parseInt(document.getElementById('downloadPayslipBtn').dataset.staffId);
    const staff = allStaff.find(s => s.id === staffId);
    
    if (!staff) {
        showToast('Staff not found', 'error');
        return;
    }
    
    // Close the modal temporarily
    const payslipModal = bootstrap.Modal.getInstance(document.getElementById('payslipModal'));
    if (payslipModal) {
        payslipModal.hide();
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const payslipContent = document.getElementById('payslipContent').innerHTML;
    
    // Write the content to the new window with print styles
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payslip - ${staff.name} - ${monthSelect.options[monthSelect.selectedIndex].text} ${yearSelect.value}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }
                body { 
                    margin: 0; 
                    padding: 10px; 
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    background: #ffffff;
                }
                .professional-payslip {
                    background: #ffffff;
                    padding: 1.5rem;
                    max-width: 210mm;
                    margin: 0 auto;
                }
                .payslip-header-section {
                    border-bottom: 2px solid #000000;
                    padding-bottom: 0.75rem;
                    margin-bottom: 1rem;
                }
                .company-info { text-align: center; margin-bottom: 0.5rem; }
                .company-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #000000;
                    margin: 0 0 0.25rem 0;
                    letter-spacing: 1px;
                }
                .company-address, .company-contact {
                    font-size: 0.75rem;
                    color: #000000;
                    margin: 0.125rem 0;
                }
                .payslip-title-box {
                    background: #000000;
                    color: #ffffff;
                    padding: 0.5rem 1rem;
                    border: 2px solid #000000;
                    text-align: center;
                    margin-top: 0.5rem;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .payslip-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: 2px;
                }
                .payslip-period {
                    font-size: 0.85rem;
                    margin: 0.25rem 0 0 0;
                }
                .employee-info-section {
                    background: #ffffff;
                    border: 1px solid #000000;
                    padding: 0.75rem;
                    margin-bottom: 1rem;
                }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .info-table tr {
                    border-bottom: 1px solid #cccccc;
                }
                .info-table tr:last-child { border-bottom: none; }
                .label-cell {
                    padding: 0.4rem 0.5rem 0.4rem 0;
                    font-weight: 600;
                    color: #000000;
                    width: 40%;
                    font-size: 0.8rem;
                }
                .value-cell {
                    padding: 0.4rem 0;
                    color: #000000;
                    font-size: 0.8rem;
                }
                .salary-breakdown-section { margin-bottom: 1rem; }
                .salary-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #000000;
                }
                .salary-table thead th {
                    padding: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-align: center;
                    color: #ffffff;
                    background: #000000;
                    border: 1px solid #000000;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .earnings-header {
                    background: #000000;
                }
                .deductions-header {
                    background: #000000;
                }
                .salary-table tbody tr {
                    border-bottom: 1px solid #cccccc;
                }
                .item-name {
                    padding: 0.4rem 0.5rem;
                    font-size: 0.75rem;
                    color: #000000;
                    border-right: 1px solid #cccccc;
                    width: 35%;
                }
                .amount-cell {
                    padding: 0.4rem 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #000000;
                    text-align: right;
                    font-family: 'Courier New', monospace;
                    border-right: 1px solid #cccccc;
                    width: 15%;
                }
                .total-row {
                    background-color: #f0f0f0;
                    border-top: 2px solid #000000;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .total-label {
                    padding: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #000000;
                    border-right: 1px solid #000000;
                }
                .total-amount {
                    padding: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #000000;
                    text-align: right;
                    font-family: 'Courier New', monospace;
                    border-right: 1px solid #000000;
                }
                .net-salary-section { margin-bottom: 1rem; }
                .net-salary-box {
                    background: #000000;
                    color: #ffffff;
                    padding: 0.75rem 1rem;
                    border: 3px double #000000;
                    text-align: center;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .net-salary-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                    letter-spacing: 1px;
                }
                .net-salary-amount {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin: 0.25rem 0;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 1px;
                }
                .net-salary-words {
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    font-style: italic;
                }
                .payslip-footer-section {
                    border-top: 1px solid #000000;
                    padding-top: 0.75rem;
                    margin-top: 1rem;
                }
                .note-text {
                    font-size: 0.7rem;
                    color: #000000;
                    margin: 0;
                    line-height: 1.4;
                }
                .signature-section { margin-top: 1rem; }
                .signature-line {
                    width: 150px;
                    border-bottom: 1px solid #000000;
                    margin: 0 0 0.25rem auto;
                }
                .signature-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #000000;
                    margin: 0.125rem 0;
                }
                .company-seal {
                    font-size: 0.7rem;
                    color: #000000;
                    margin: 0;
                }
                .confidential-text {
                    background: #ffffff;
                    border: 1px solid #000000;
                    padding: 0.4rem 0.75rem;
                    text-align: center;
                    font-size: 0.7rem;
                    color: #000000;
                    margin-top: 0.75rem;
                    font-weight: 500;
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .professional-payslip { padding: 0; max-width: 100%; }
                }
            </style>
        </head>
        <body>
            ${payslipContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    toast.success('Payslip opened in new window for download/print');
}

// Email Payslip
function emailPayslip() {
    const staffId = parseInt(document.getElementById('emailPayslipBtn').dataset.staffId);
    const staff = allStaff.find(s => s.id === staffId);
    
    if (!staff) {
        showToast('Staff not found', 'error');
        return;
    }
    
    const month = monthSelect.options[monthSelect.selectedIndex].text;
    const year = yearSelect.value;
    
    showConfirmationModal({
        title: 'Email Payslip',
        message: `Send payslip for <strong>${month} ${year}</strong> to <strong>${staff.name}</strong>?<br><small class="text-muted">Email will be sent to the registered email address.</small>`,
        confirmText: 'Yes, Send Email',
        cancelText: 'Cancel',
        confirmClass: 'btn-info',
        icon: 'bi-envelope text-info',
        onConfirm: function() {
            // Simulate email sending
            toast.success('Payslip emailed successfully to ' + staff.name);
            
            // Close the payslip modal
            const payslipModal = bootstrap.Modal.getInstance(document.getElementById('payslipModal'));
            if (payslipModal) {
                payslipModal.hide();
            }
        }
    });
}
