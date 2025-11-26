/**
 * ID Cards & Certificates JavaScript
 * Handles generation, preview, and management of student ID cards and certificates
 */

(function() {
    'use strict';

    // Sample student data (replace with actual API calls)
    const sampleStudents = [
        { rollNo: 'CS001', name: 'John Doe', department: 'Computer Science', semester: 3, batch: '2024', email: 'john.doe@eduhub.com', phone: '+1234567890', bloodGroup: 'O+', dob: '2005-05-15', address: '123 Main St, City' },
        { rollNo: 'EC002', name: 'Jane Smith', department: 'Electronics', semester: 2, batch: '2024', email: 'jane.smith@eduhub.com', phone: '+1234567891', bloodGroup: 'A+', dob: '2005-08-20', address: '456 Oak Ave, City' },
        { rollNo: 'ME003', name: 'Mike Johnson', department: 'Mechanical', semester: 4, batch: '2023', email: 'mike.j@eduhub.com', phone: '+1234567892', bloodGroup: 'B+', dob: '2004-12-10', address: '789 Pine Rd, City' },
        { rollNo: 'CS004', name: 'Sarah Williams', department: 'Computer Science', semester: 1, batch: '2024', email: 'sarah.w@eduhub.com', phone: '+1234567893', bloodGroup: 'AB+', dob: '2006-03-25', address: '321 Elm St, City' },
        { rollNo: 'CE005', name: 'David Brown', department: 'Civil', semester: 3, batch: '2023', email: 'david.b@eduhub.com', phone: '+1234567894', bloodGroup: 'O-', dob: '2004-07-18', address: '654 Maple Dr, City' },
        { rollNo: 'EC006', name: 'Emily Davis', department: 'Electronics', semester: 2, batch: '2024', email: 'emily.d@eduhub.com', phone: '+1234567895', bloodGroup: 'A-', dob: '2005-11-30', address: '987 Cedar Ln, City' },
    ];

    let selectedStudent = null;
    let generationHistory = [];

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadHistory();
        initializeDatePicker();
    });

    /**
     * Initialize date picker with current date
     */
    function initializeDatePicker() {
        const dateInput = document.getElementById('certIssueDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    /**
     * Handle ID card selection type change
     */
    window.handleIdSelectionType = function() {
        const selectionType = document.getElementById('idSelectionType').value;
        const singleSection = document.getElementById('singleIdSelection');
        const batchSection = document.getElementById('batchIdSelection');
        const deptSection = document.getElementById('deptIdSelection');

        // Hide all sections
        singleSection.style.display = 'none';
        batchSection.style.display = 'none';
        deptSection.style.display = 'none';

        // Show relevant section
        if (selectionType === 'single') {
            singleSection.style.display = 'block';
        } else if (selectionType === 'batch') {
            batchSection.style.display = 'block';
        } else if (selectionType === 'department') {
            deptSection.style.display = 'block';
        }
    };

    /**
     * Handle certificate selection type change
     */
    window.handleCertSelectionType = function() {
        const selectionType = document.getElementById('certSelectionType').value;
        const singleSection = document.getElementById('singleCertSelection');

        if (selectionType === 'single') {
            singleSection.style.display = 'block';
        } else {
            singleSection.style.display = 'none';
        }
    };

    /**
     * Handle certificate type change
     */
    window.handleCertificateType = function() {
        const certType = document.getElementById('certificateType').value;
        const gradeSection = document.getElementById('gradeSection');

        // Show grade section for achievement and excellence certificates
        if (certType === 'achievement' || certType === 'excellence') {
            gradeSection.style.display = 'block';
        } else {
            gradeSection.style.display = 'none';
        }
    };

    /**
     * Search student for ID card
     */
    window.searchStudentForId = function() {
        const query = document.getElementById('idStudentSearch').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('idStudentResults');

        if (query.length < 2) {
            resultsDiv.innerHTML = '';
            return;
        }

        const matches = sampleStudents.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.rollNo.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-info mb-0">No students found</div>';
            return;
        }

        resultsDiv.innerHTML = matches.map(student => `
            <a href="#" class="list-group-item list-group-item-action" onclick="selectStudentForId('${student.rollNo}'); return false;">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${escapeHtml(student.name)}</strong>
                        <br>
                        <small class="text-muted">${escapeHtml(student.rollNo)} - ${escapeHtml(student.department)}</small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                </div>
            </a>
        `).join('');
    };

    /**
     * Search student for certificate
     */
    window.searchStudentForCert = function() {
        const query = document.getElementById('certStudentSearch').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('certStudentResults');

        if (query.length < 2) {
            resultsDiv.innerHTML = '';
            return;
        }

        const matches = sampleStudents.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.rollNo.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-info mb-0">No students found</div>';
            return;
        }

        resultsDiv.innerHTML = matches.map(student => `
            <a href="#" class="list-group-item list-group-item-action" onclick="selectStudentForCert('${student.rollNo}'); return false;">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${escapeHtml(student.name)}</strong>
                        <br>
                        <small class="text-muted">${escapeHtml(student.rollNo)} - ${escapeHtml(student.department)}</small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                </div>
            </a>
        `).join('');
    };

    /**
     * Select student for ID card
     */
    window.selectStudentForId = function(rollNo) {
        selectedStudent = sampleStudents.find(s => s.rollNo === rollNo);
        if (selectedStudent) {
            document.getElementById('idStudentSearch').value = `${selectedStudent.name} (${selectedStudent.rollNo})`;
            document.getElementById('idStudentResults').innerHTML = `
                <div class="alert alert-success mb-0">
                    <i class="bi bi-check-circle"></i> Selected: ${escapeHtml(selectedStudent.name)}
                </div>
            `;
        }
    };

    /**
     * Select student for certificate
     */
    window.selectStudentForCert = function(rollNo) {
        selectedStudent = sampleStudents.find(s => s.rollNo === rollNo);
        if (selectedStudent) {
            document.getElementById('certStudentSearch').value = `${selectedStudent.name} (${selectedStudent.rollNo})`;
            document.getElementById('certStudentResults').innerHTML = `
                <div class="alert alert-success mb-0">
                    <i class="bi bi-check-circle"></i> Selected: ${escapeHtml(selectedStudent.name)}
                </div>
            `;
        }
    };

    /**
     * Preview ID card
     */
    window.previewCertificate = function() {
        if (!selectedStudent && document.getElementById('certificateSelectionType').value === 'single') {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        const student = selectedStudent || sampleStudents[0]; // Use first student for batch preview
        const includeBarcode = document.getElementById('includeBarcode').checked;
        const includePhoto = document.getElementById('includePhoto').checked;

        const previewDiv = document.getElementById('idCardPreview');
        previewDiv.innerHTML = generateIdCardHTML(student, includeBarcode, includePhoto);
    };

    /**
     * Generate ID card HTML
     */
    function generateIdCardHTML(student, includeBarcode, includePhoto) {
        const validUntil = new Date();
        validUntil.setFullYear(validUntil.getFullYear() + 1);
        
        return `
            <div class="id-card-container">
                <!-- Front Side -->
                <div class="id-card id-card-front">
                    <div class="id-card-header">
                        <div class="institution-logo">
                            <i class="bi bi-mortarboard-fill"></i>
                        </div>
                        <div class="institution-info">
                            <h4>EduHub Institute</h4>
                            <p>Student Identity Card</p>
                        </div>
                    </div>
                    
                    <div class="id-card-body">
                        ${includePhoto ? `
                        <div class="student-photo-section">
                            <div class="student-photo">
                                <div class="photo-placeholder">
                                    <i class="bi bi-person-circle"></i>
                                </div>
                            </div>
                            ${includeBarcode ? `
                            <div class="barcode">
                                <div class="barcode-placeholder">*${escapeHtml(student.rollNo)}*</div>
                                <small>${escapeHtml(student.rollNo)}</small>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        <div class="student-info">
                            <h5>${escapeHtml(student.name)}</h5>
                            <div class="info-row">
                                <span class="label">Roll Number</span>
                                <span class="value">${escapeHtml(student.rollNo)}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Department</span>
                                <span class="value">${escapeHtml(student.department)}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Batch</span>
                                <span class="value">${student.batch}-${parseInt(student.batch) + 1}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Blood Group</span>
                                <span class="value">${escapeHtml(student.bloodGroup)}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Valid Until</span>
                                <span class="value">${new Date(validUntil).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Side -->
                <div class="id-card id-card-back">
                    <div class="id-card-header">
                        <div class="institution-logo">
                            <i class="bi bi-info-circle-fill"></i>
                        </div>
                        <div class="institution-info">
                            <h4>Contact Information</h4>
                            <p>Important Details</p>
                        </div>
                    </div>
                    
                    <div class="back-info">
                        <div class="info-row">
                            <span class="label">Email Address</span>
                            <span class="value">${escapeHtml(student.email)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Phone Number</span>
                            <span class="value">${escapeHtml(student.phone)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Date of Birth</span>
                            <span class="value">${new Date(student.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Address</span>
                            <span class="value">${escapeHtml(student.address)}</span>
                        </div>
                    </div>

                    <div class="emergency-contact">
                        <h6>Emergency Contact</h6>
                        <p>EduHub Administration</p>
                        <p>Phone: +1-800-EDUHUB</p>
                        <p>Email: help@eduhub.com</p>
                    </div>

                    <div class="signature-section">
                        <div class="signature-line">
                            <div class="signature">Authorized Signatory</div>
                            <small>Director's Signature</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate ID card
     */
    window.generateIdCard = function() {
        const selectionType = document.getElementById('idSelectionType').value;
        
        if (selectionType === 'single' && !selectedStudent) {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        let studentsToGenerate = [];
        let count = 0;

        switch(selectionType) {
            case 'single':
                studentsToGenerate = [selectedStudent];
                count = 1;
                break;
            case 'batch':
                const batch = document.getElementById('idBatchSelect').value;
                const semester = document.getElementById('idSemesterSelect').value;
                studentsToGenerate = sampleStudents.filter(s => {
                    return (batch === '' || s.batch === batch) && 
                           (semester === '' || s.semester === parseInt(semester));
                });
                count = studentsToGenerate.length;
                break;
            case 'department':
                const dept = document.getElementById('idDepartmentSelect').value;
                studentsToGenerate = sampleStudents.filter(s => s.department === dept);
                count = studentsToGenerate.length;
                break;
            case 'all':
                studentsToGenerate = sampleStudents;
                count = studentsToGenerate.length;
                break;
        }

        if (count === 0) {
            toast('No students selected for ID card generation', { icon: '⚠️' });
            return;
        }

        // Show loading toast
        const loadingToastId = toast.loading(`Generating ${count} ID card${count > 1 ? 's' : ''}...`);

        // Simulate generation
        setTimeout(() => {
            // Add to history
            const historyEntry = {
                date: new Date().toISOString(),
                type: 'ID Card',
                students: count === 1 ? selectedStudent.name : `${count} students`,
                count: count,
                generatedBy: 'Admin User'
            };
            generationHistory.unshift(historyEntry);
            saveHistory();
            updateHistoryTable();

            // Dismiss loading toast
            toast.dismiss(loadingToastId);

            // Show success and download
            toast.success(`${count} ID card${count > 1 ? 's' : ''} generated successfully!`);
            downloadIdCards(studentsToGenerate);
        }, 1500);
    };

    /**
     * Download ID cards (simulate PDF download)
     */
    function downloadIdCards(students) {
        const fileName = students.length === 1 
            ? `ID_Card_${students[0].rollNo}.pdf`
            : `ID_Cards_Batch_${new Date().toISOString().split('T')[0]}.pdf`;
        
        toast('Downloading: ' + fileName, { icon: 'ℹ️' });
        // In real implementation, this would generate and download actual PDF
    }

    /**
     * Preview certificate
     */
        
        const selectionType = document.getElementById('certificateSelectionType').value;
        
        if (selectionType === 'single' && !selectedStudent) {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        const student = selectedStudent || sampleStudents[0];
        const certType = document.getElementById('certificateType').value;
        const courseName = document.getElementById('certCourseName').value;
        const issueDate = document.getElementById('certIssueDate').value;
        const grade = document.getElementById('certGrade').value;
        const notes = document.getElementById('certNotes').value;
        const includeSignature = document.getElementById('includeSignature').checked;
        const includeSeal = document.getElementById('includeSeal').checked;

        const previewDiv = document.getElementById('certificatePreview');
        previewDiv.innerHTML = generateCertificateHTML(student, certType, courseName, issueDate, grade, notes, includeSignature, includeSeal);
    };

    /**
     * Generate certificate HTML
     */
    function generateCertificateHTML(student, certType, courseName, issueDate, grade, notes, includeSignature, includeSeal) {
        const certTitle = getCertificateTitle(certType);
        const certText = getCertificateText(certType, student, courseName, grade);

        return `
            <div class="certificate-container">
                <div class="certificate">
                    <!-- Decorative Border -->
                    <div class="certificate-border">
                        <div class="certificate-inner-border">
                            <!-- Header -->
                            <div class="certificate-header">
                                <div class="cert-logo">
                                    <i class="bi bi-mortarboard-fill"></i>
                                </div>
                                <h2>EduHub Institute</h2>
                                <p class="subtitle">Excellence in Education Since 2020</p>
                            </div>

                            <!-- Certificate Type -->
                            <div class="certificate-type">
                                <h3>${certTitle}</h3>
                                <div class="decorative-line"></div>
                            </div>

                            <!-- Body -->
                            <div class="certificate-body">
                                <p class="cert-intro">This is to certify that</p>
                                <h4 class="student-name">${escapeHtml(student.name)}</h4>
                                <p class="cert-text">${certText}</p>
                                ${grade ? `<p class="cert-grade">Grade: <strong>${escapeHtml(grade)}</strong></p>` : ''}
                                ${notes ? `<p class="cert-notes">${escapeHtml(notes)}</p>` : ''}
                            </div>

                            <!-- Footer -->
                            <div class="certificate-footer">
                                <div class="cert-date">
                                    <p>Date of Issue</p>
                                    <p><strong>${formatDate(issueDate)}</strong></p>
                                </div>

                                ${includeSignature ? `
                                <div class="cert-signatures">
                                    <div class="signature-block">
                                        <div class="signature-line"></div>
                                        <p>Director's Signature</p>
                                    </div>
                                    <div class="signature-block">
                                        <div class="signature-line"></div>
                                        <p>HOD Signature</p>
                                    </div>
                                </div>
                                ` : ''}

                                ${includeSeal ? `
                                <div class="cert-seal">
                                    <div class="seal-circle">
                                        <i class="bi bi-patch-check-fill"></i>
                                        <p>Official Seal</p>
                                    </div>
                                </div>
                                ` : ''}
                            </div>

                            <!-- Certificate ID -->
                            <div class="certificate-id">
                                <small>Certificate ID: CERT-${student.rollNo}-${Date.now().toString().slice(-6)}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get certificate title
     */
    function getCertificateTitle(certType) {
        const titles = {
            'completion': 'Certificate of Completion',
            'achievement': 'Certificate of Achievement',
            'participation': 'Certificate of Participation',
            'excellence': 'Certificate of Academic Excellence',
            'custom': 'Certificate of Recognition'
        };
        return titles[certType] || 'Certificate';
    }

    /**
     * Get certificate text
     */
    function getCertificateText(certType, student, courseName, grade) {
        const course = courseName || 'the course';
        
        const texts = {
            'completion': `has successfully completed <strong>${course}</strong> at EduHub Institute. This achievement demonstrates dedication, commitment, and proficiency in the subject matter.`,
            'achievement': `has demonstrated exceptional performance in <strong>${course}</strong> and achieved outstanding results. This recognition acknowledges their hard work and excellence.`,
            'participation': `has actively participated in <strong>${course}</strong> conducted at EduHub Institute. This certificate acknowledges their engagement and contribution.`,
            'excellence': `has achieved academic excellence in <strong>${course}</strong> with exceptional performance. This honor recognizes their outstanding dedication to learning.`,
            'custom': `is hereby recognized for their exceptional contribution and achievement in <strong>${course}</strong> at EduHub Institute.`
        };
        
        return texts[certType] || texts['custom'];
    }

    /**
     * Generate certificate
     */
    window.generateCertificate = function() {
        const selectionType = document.getElementById('certSelectionType').value;
        
        if (selectionType === 'single' && !selectedStudent) {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        const courseName = document.getElementById('certCourseName').value;
        if (!courseName) {
            toast('Please enter course/event name', { icon: '⚠️' });
            return;
        }

        let count = 1;
        if (selectionType === 'multiple') {
            count = 5; // Simulated
        } else if (selectionType === 'batch') {
            count = sampleStudents.length;
        }

        // Show loading toast
        const loadingToastId = toast.loading(`Generating ${count} certificate${count > 1 ? 's' : ''}...`);

        // Simulate generation
        setTimeout(() => {
            const certType = document.getElementById('certificateType').value;
            
            // Add to history
            const historyEntry = {
                date: new Date().toISOString(),
                type: `Certificate - ${getCertificateTitle(certType)}`,
                students: count === 1 ? selectedStudent.name : `${count} students`,
                count: count,
                generatedBy: 'Admin User'
            };
            generationHistory.unshift(historyEntry);
            saveHistory();
            updateHistoryTable();

            // Dismiss loading toast
            toast.dismiss(loadingToastId);

            toast.success(`${count} certificate${count > 1 ? 's' : ''} generated successfully!`);
            downloadCertificate(count);
        }, 1500);
    };

    /**
     * Download certificate (simulate PDF download)
     */
    function downloadCertificate(count) {
        const certType = document.getElementById('certificateType').value;
        const fileName = count === 1 
            ? `Certificate_${selectedStudent.rollNo}.pdf`
            : `Certificates_${certType}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        toast('Downloading: ' + fileName, { icon: 'ℹ️' });
        // In real implementation, this would generate and download actual PDF
    }

    /**
     * Update history table
     */
    function updateHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        
        if (generationHistory.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                        <p class="text-muted mt-2 mb-0">No generation history yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = generationHistory.map((entry, index) => `
            <tr>
                <td>${formatDateTime(entry.date)}</td>
                <td><span class="badge bg-primary">${escapeHtml(entry.type)}</span></td>
                <td>${escapeHtml(entry.students)}</td>
                <td><span class="badge bg-info">${entry.count}</span></td>
                <td>${escapeHtml(entry.generatedBy)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="downloadHistoryItem(${index})" title="Download">
                        <i class="bi bi-download"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteHistoryItem(${index})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Download history item
     */
    window.downloadHistoryItem = function(index) {
        const entry = generationHistory[index];
        toast.success('Downloading ' + entry.type + ' for ' + entry.students);
    };

    /**
     * Delete history item
     */
    window.deleteHistoryItem = function(index) {
        if (confirm('Are you sure you want to delete this history entry?')) {
            generationHistory.splice(index, 1);
            saveHistory();
            updateHistoryTable();
            toast.success('History entry deleted');
        }
    };

    /**
     * Clear history
     */
    window.clearHistory = function() {
        if (confirm('Are you sure you want to clear all generation history?')) {
            generationHistory = [];
            saveHistory();
            updateHistoryTable();
            toast.success('History cleared successfully');
        }
    };

    /**
     * Save history to localStorage
     */
    function saveHistory() {
        localStorage.setItem('documentGenerationHistory', JSON.stringify(generationHistory));
    }

    /**
     * Load history from localStorage
     */
    function loadHistory() {
        const stored = localStorage.getItem('documentGenerationHistory');
        if (stored) {
            try {
                generationHistory = JSON.parse(stored);
                updateHistoryTable();
            } catch (e) {
                generationHistory = [];
            }
        }
    }

    /**
     * Refresh data
     */
    window.refreshData = function() {
        const loadingToastId = toast.loading('Refreshing data...');
        setTimeout(() => {
            loadHistory();
            
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            toast.success('Data refreshed successfully');
        }, 500);
    };

    /**
     * Helper functions
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();
