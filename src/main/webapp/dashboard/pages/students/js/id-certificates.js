/**
 * ID Cards & Certificates JavaScript
 * Handles generation, preview, and management of student ID cards and certificates
 */

(function() {
    'use strict';

    // Polyfill for toast if not defined (prevents crashes if library fails to load)
    if (typeof window.toast === 'undefined') {
        window.toast = function(message, options) {
            console.log('Toast:', message);
            if (options && (options.icon === '⚠️' || options.icon === '❌')) {
                alert(message);
            }
        };
        window.toast.error = function(message) {
            console.error(message);
            alert(message);
        };
        window.toast.success = function(message) {
            console.log('Success:', message);
        };
    }

    // Global variables
    let selectedStudent = null;
    let selectedCertStudent = null; // For certificate tab
    let generationHistory = [];
    let allStudents = []; // To store fetched students
    let allBatches = []; // To store fetched batches
    let instituteDetails = null; // Store institute details

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadHistory();
        initializeDatePicker();
        fetchBatches(); // Fetch batches
        fetchStudents(); // Fetch real data
        fetchInstituteDetails(); // Fetch institute details
        
        // Add event listeners for batch selection to auto-preview
        const batchSelect = document.getElementById('idBatchSelect');
        if (batchSelect) {
            batchSelect.addEventListener('change', previewIdCard);
        }
        
        // Add event listener for certificate type dropdown to regenerate preview
        const certTypeSelect = document.getElementById('certType');
        if (certTypeSelect) {
            certTypeSelect.addEventListener('change', function() {
                // Regenerate certificate preview when type changes
                if (selectedCertStudent) {
                    previewSingleCertificate(selectedCertStudent);
                } else {
                    // Check if batch is selected
                    const certBatchSelect = document.getElementById('certBatchSelect');
                    if (certBatchSelect && certBatchSelect.value) {
                        previewBatchCertificates();
                    }
                }
            });
        }
        
        // Auto-load history when History tab is shown
        const historyTab = document.querySelector('button[data-bs-target="#history"]');
        if (historyTab) {
            historyTab.addEventListener('shown.bs.tab', function() {
                loadHistoryFromDatabase();
            });
        }
    });

    /**
     * Fetch students from backend with full details
     */
    function fetchStudents() {
        // Fetch with higher page size to get all students
        fetch(`${contextPath}/api/students/list?pageSize=1000`)
            .then(response => response.json())
            .then(data => {
                // The API returns { totalCount: ..., students: [...] }
                if (data.students && Array.isArray(data.students)) {
                    allStudents = data.students.map(s => ({
                        studentId: s.studentId,
                        studentName: s.studentName || '',
                        fatherName: s.fatherName || '',
                        surname: s.surname || '',
                        name: `${s.studentName || ''} ${s.fatherName || ''} ${s.surname || ''}`.trim().replace(/\s+/g, ' '),
                        department: s.branchId || s.courseId || 'General',
                        batch: s.batchId || '',
                        batchId: s.batchId || '',
                        profilePhotoUrl: s.profilePhotoUrl,
                        emailId: s.emailId || '',
                        mobileNumber: s.mobileNumber || '',
                        collegeName: s.collegeName || '',
                        educationQualification: s.educationQualification || '',
                        studentStatus: s.studentStatus || ''
                    }));
                } else {
                    console.error('Unexpected API response format:', data);
                    toast.error('Failed to load student data');
                }
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                toast.error('Error connecting to server');
            });
    }

    /**
     * Fetch institute details from backend
     */
    function fetchInstituteDetails() {
        fetch(`${contextPath}/api/institute/details`)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Failed to fetch institute details');
            })
            .then(data => {
                instituteDetails = data;
            })
            .catch(error => {
                console.log('Institute details not available:', error);
                // Use defaults from global instituteName
                instituteDetails = {
                    instituteName: (typeof instituteName !== 'undefined') ? instituteName : 'EduHub Institute',
                    instituteEmail: '',
                    address: '',
                    city: '',
                    state: '',
                    country: ''
                };
            });
    }

    /**
     * Fetch batches from backend
     */
    function fetchBatches() {
        fetch(`${contextPath}/api/batches/list`)
            .then(response => response.json())
            .then(data => {
                if (data.batches && Array.isArray(data.batches)) {
                    allBatches = data.batches;
                    populateBatchDropdown();
                    populateCertBatchDropdown();
                }
            })
            .catch(error => console.error('Error fetching batches:', error));
    }

    function populateBatchDropdown() {
        const batchSelect = document.getElementById('idBatchSelect');
        if (batchSelect && allBatches.length > 0) {
            batchSelect.innerHTML = '<option value="">-- Select Batch --</option>' + 
                allBatches.map(b => `<option value="${b.batchId}">${b.batchName} (${b.batchCode})</option>`).join('');
        }
    }

    function populateCertBatchDropdown() {
        const certBatchSelect = document.getElementById('certBatchSelect');
        if (certBatchSelect && allBatches.length > 0) {
            certBatchSelect.innerHTML = '<option value="">-- Select Batch --</option>' + 
                allBatches.map(b => `<option value="${b.batchId}">${b.batchName} (${b.batchCode})</option>`).join('');
        }
    }

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

        // Hide all sections
        singleSection.style.display = 'none';
        batchSection.style.display = 'none';
        
        // Show relevant section
        if (selectionType === 'single') {
            singleSection.style.display = 'block';
        } else if (selectionType === 'batch') {
            batchSection.style.display = 'block';
        }
    };

    /**
     * Handle certificate selection type change
     */
    window.handleCertSelectionType = function() {
        const selectionType = document.getElementById('certSelectionType').value;
        const singleSection = document.getElementById('singleCertSelection');
        const batchSection = document.getElementById('batchCertSelection');
        const studentInfoCard = document.getElementById('certStudentInfoCard');

        // Hide all sections
        if (singleSection) singleSection.style.display = 'none';
        if (batchSection) batchSection.style.display = 'none';
        if (studentInfoCard) studentInfoCard.style.display = 'none';
        
        // Clear preview
        const previewDiv = document.getElementById('certificatePreview');
        if (previewDiv) {
            previewDiv.innerHTML = `
                <div class="text-center text-muted">
                    <i class="bi bi-award" style="font-size: 4rem; opacity: 0.2;"></i>
                    <p class="mt-3">Select a student or batch to generate certificates</p>
                </div>
            `;
        }
        const downloadBtn = document.getElementById('downloadCertPreviewBtn');
        if (downloadBtn) downloadBtn.disabled = true;
        
        // Clear selection
        selectedCertStudent = null;
        
        // Show relevant section
        if (selectionType === 'single') {
            if (singleSection) singleSection.style.display = 'block';
        } else if (selectionType === 'batch') {
            if (batchSection) batchSection.style.display = 'block';
        }
    };

    /**
     * Handle certificate type change - removed as config panel removed
     */
    window.handleCertificateType = function() {
        // No longer needed
    };

    /**
     * Search student for ID card
     */
    window.searchStudentForId = function() {
        const query = document.getElementById('idStudentSearch').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('idStudentResults');

        if (query.length < 1) {
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('search-suggestions');
            return;
        }

        const matches = allStudents.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.studentId.toLowerCase().includes(query)
        ).slice(0, 8); // Limit to 8 results like Google

        if (matches.length === 0) {
            resultsDiv.className = 'search-suggestions';
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="bi bi-search"></i>
                    <div>No students found</div>
                </div>
            `;
            return;
        }

        resultsDiv.className = 'search-suggestions';
        resultsDiv.innerHTML = matches.map(student => `
            <div class="search-suggestion-item" onclick="selectStudentForId('${student.studentId}')">
                <div class="suggestion-icon">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${escapeHtml(student.name)}</div>
                    <div class="suggestion-meta">${escapeHtml(student.studentId.substring(0, 10))} · ${escapeHtml(student.department)}</div>
                </div>
            </div>
        `).join('');
    };

    /**
     * Search student for certificate
     */
    window.searchStudentForCert = function() {
        const query = document.getElementById('certStudentSearch').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('certStudentResults');

        if (query.length < 1) {
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('search-suggestions');
            return;
        }

        const matches = allStudents.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.studentId.toLowerCase().includes(query)
        ).slice(0, 8); // Limit to 8 results like Google

        if (matches.length === 0) {
            resultsDiv.className = 'search-suggestions';
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="bi bi-search"></i>
                    <div>No students found</div>
                </div>
            `;
            return;
        }

        resultsDiv.className = 'search-suggestions';
        resultsDiv.innerHTML = matches.map(student => `
            <div class="search-suggestion-item" onclick="selectStudentForCert('${student.studentId}')">
                <div class="suggestion-icon">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${escapeHtml(student.name)}</div>
                    <div class="suggestion-meta">${escapeHtml(student.studentId.substring(0, 10))} · ${escapeHtml(student.department)}</div>
                </div>
            </div>
        `).join('');
    };

    /**
     * Select student for ID card
     */
    window.selectStudentForId = function(studentId) {
        selectedStudent = allStudents.find(s => s.studentId === studentId);
        if (selectedStudent) {
            const searchInput = document.getElementById('idStudentSearch');
            const resultsDiv = document.getElementById('idStudentResults');
            
            searchInput.value = `${selectedStudent.name}`;
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('search-suggestions');
            
            // Auto-preview
            previewIdCard();
        }
    };

    /**
     * Select student for certificate and auto-preview
     */
    window.selectStudentForCert = function(studentId) {
        selectedCertStudent = allStudents.find(s => s.studentId === studentId);
        if (selectedCertStudent) {
            const searchInput = document.getElementById('certStudentSearch');
            const resultsDiv = document.getElementById('certStudentResults');
            
            searchInput.value = `${selectedCertStudent.name}`;
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('search-suggestions');
            
            // Show student info card
            showCertStudentInfo(selectedCertStudent);
            
            // Auto-preview certificate
            previewSingleCertificate(selectedCertStudent);
        }
    };

    /**
     * Show student info in the sidebar
     */
    function showCertStudentInfo(student) {
        const infoCard = document.getElementById('certStudentInfoCard');
        const infoDiv = document.getElementById('certStudentInfo');
        
        if (!infoCard || !infoDiv) return;
        
        // Get batch info
        const batch = allBatches.find(b => b.batchId === student.batchId);
        const batchName = batch ? batch.batchName : 'N/A';
        const courseName = batch ? (batch.courseName || batch.batchName) : 'N/A';
        
        infoDiv.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <div class="student-avatar me-3">
                    ${student.profilePhotoUrl 
                        ? `<img src="${student.profilePhotoUrl}" alt="${student.name}" class="rounded-circle" style="width: 60px; height: 60px; object-fit: cover;">`
                        : `<div class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style="width: 60px; height: 60px; font-size: 1.5rem;"><i class="bi bi-person-fill"></i></div>`
                    }
                </div>
                <div>
                    <h6 class="mb-0">${escapeHtml(student.name)}</h6>
                    <small class="text-muted">${escapeHtml(student.studentId.substring(0, 10))}</small>
                </div>
            </div>
            <div class="student-details-list">
                <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Batch</span>
                    <span class="fw-medium">${escapeHtml(batchName)}</span>
                </div>
                <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Course</span>
                    <span class="fw-medium">${escapeHtml(courseName)}</span>
                </div>
                <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Email</span>
                    <span class="fw-medium">${escapeHtml(student.emailId || 'N/A')}</span>
                </div>
                <div class="detail-item d-flex justify-content-between py-2">
                    <span class="text-muted">Status</span>
                    <span class="badge ${student.studentStatus === 'Active' ? 'bg-success' : 'bg-secondary'}">${escapeHtml(student.studentStatus || 'N/A')}</span>
                </div>
            </div>
        `;
        
        infoCard.style.display = 'block';
    }

    /**
     * Preview single student certificate
     */
    async function previewSingleCertificate(student) {
        const previewDiv = document.getElementById('certificatePreview');
        const downloadBtn = document.getElementById('downloadCertPreviewBtn');
        
        if (!student || !previewDiv) return;
        
        // Show loading state
        previewDiv.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Generating secure certificate...</p>
            </div>
        `;
        
        // Get batch info for certificate
        const batch = allBatches.find(b => b.batchId === student.batchId);
        
        const certData = buildCertificateData(student, batch);
        previewDiv.innerHTML = await generateProfessionalCertificateHTML(student, certData);
        
        if (downloadBtn) downloadBtn.disabled = false;
    }

    /**
     * Preview batch certificates
     */
    window.previewBatchCertificates = async function() {
        const batchId = document.getElementById('certBatchSelect').value;
        const previewDiv = document.getElementById('certificatePreview');
        const downloadBtn = document.getElementById('downloadCertPreviewBtn');
        
        if (!batchId) {
            previewDiv.innerHTML = `
                <div class="text-center text-muted">
                    <i class="bi bi-award" style="font-size: 4rem; opacity: 0.2;"></i>
                    <p class="mt-3">Select a batch to generate certificates</p>
                </div>
            `;
            if (downloadBtn) downloadBtn.disabled = true;
            return;
        }
        
        // Show loading state
        previewDiv.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Generating secure certificates...</p>
            </div>
        `;
        
        const batchStudents = allStudents.filter(s => s.batchId === batchId);
        const batch = allBatches.find(b => b.batchId === batchId);
        
        if (batchStudents.length === 0) {
            previewDiv.innerHTML = '<div class="alert alert-info">No students found in this batch</div>';
            if (downloadBtn) downloadBtn.disabled = true;
            return;
        }
        
        // Preview first student's certificate with batch count info
        const firstStudent = batchStudents[0];
        const certData = buildCertificateData(firstStudent, batch);
        const certHTML = await generateProfessionalCertificateHTML(firstStudent, certData);
        
        previewDiv.innerHTML = `
            <div class="batch-cert-info mb-3 text-center">
                <span class="badge bg-primary fs-6 px-3 py-2">
                    <i class="bi bi-people-fill me-2"></i>${batchStudents.length} Certificates will be generated
                </span>
            </div>
            ${certHTML}
        `;
        
        if (downloadBtn) downloadBtn.disabled = false;
    };

    /**
     * Build certificate data from student and batch
     */
    function buildCertificateData(student, batch, certType = null) {
        const inst = instituteDetails || {};
        const instName = inst.instituteName || (typeof instituteName !== 'undefined' ? instituteName : 'EduHub Institute');
        
        // Get certificate type from dropdown if not provided
        const certificateType = certType || document.getElementById('certType')?.value || 'completion';
        
        // Build duration text from course duration (durationValue + durationUnit)
        let durationText = '';
        if (batch && batch.courseDurationValue && batch.courseDurationUnit) {
            const value = batch.courseDurationValue;
            const unit = batch.courseDurationUnit;
            // Pluralize unit if needed
            const unitLabel = value === 1 ? unit : (unit.endsWith('s') ? unit : unit + 's');
            durationText = `${value} ${unitLabel}`;
        } else if (batch && batch.startDate && batch.endDate) {
            // Fallback to date range if course duration not available
            const startDate = new Date(batch.startDate);
            const endDate = new Date(batch.endDate);
            const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            durationText = `${startFormatted} to ${endFormatted}`;
        }
        
        // Build street address
        const streetAddress = inst.address || inst.streetAddress || '';
        
        // Build city, state, zipcode line
        let cityLine = [];
        if (inst.city) cityLine.push(inst.city);
        if (inst.state) cityLine.push(inst.state);
        if (inst.country) cityLine.push(inst.country);
        const cityStateCountry = cityLine.join(', ') || '';
        
        // zipCode from Java model (camelCase)
        const zipcode = inst.zipCode || inst.zipcode || inst.pincode || inst.postalCode || '';
        
        // Debug: log institute details to console
        console.log('Institute details for certificate:', inst);
        
        return {
            certType: certificateType,
            courseName: batch ? (batch.courseName || batch.batchName || 'Professional Development Program') : 'Professional Development Program',
            courseModules: batch ? (batch.courseModules || '') : '',
            description: batch ? getDefaultCourseDescription(batch.courseName || batch.batchName, batch.courseModules || '') : '',
            durationText: durationText,
            issueDate: new Date().toISOString().split('T')[0],
            signatoryName: 'Prajakt Patki',
            signatoryTitle: 'Director',
            streetAddress: streetAddress,
            cityStateCountry: cityStateCountry,
            zipcode: zipcode,
            instituteEmail: inst.instituteEmail || inst.email || '',
            instName: instName,
            includeSignature: true,
            includeQRCode: true
        };
    }

    /**
     * Get default course description based on course name and modules
     */
    function getDefaultCourseDescription(courseName, courseModules) {
        const course = courseName || 'the program';
        
        // Format modules for display
        let modulesText = '';
        if (courseModules && courseModules.trim()) {
            // Parse modules - they can be comma separated or newline separated
            const modulesList = courseModules.split(/[,\n]/).map(m => m.trim()).filter(m => m);
            if (modulesList.length > 0) {
                modulesText = ` covering: ${modulesList.join(', ')}`;
            }
        }
        
        return `This certificate is awarded for successfully completing comprehensive training in ${course}${modulesText}. The recipient has demonstrated proficiency in building scalable, secure, and robust enterprise applications adhering to industry best practices and coding standards.`;
    }

    /**
     * Preview ID card
     */
    window.previewIdCard = async function() {
        const selectionType = document.getElementById('idSelectionType').value;
        const previewDiv = document.getElementById('idCardPreview');
        const downloadBtn = document.getElementById('downloadPreviewBtn');
        
        if (selectionType === 'single') {
            if (!selectedStudent) {
                if (downloadBtn) downloadBtn.disabled = true;
                return;
            }
            previewDiv.innerHTML = await generateIdCardHTML(selectedStudent, true);
            // Reset container class
            const container = previewDiv.querySelector('.id-card-wrapper');
            if (container) container.classList.remove('batch-preview');
            if (downloadBtn) downloadBtn.disabled = false;
        } else if (selectionType === 'batch') {
            const batchId = document.getElementById('idBatchSelect').value;
            if (!batchId) {
                if (downloadBtn) downloadBtn.disabled = true;
                return;
            }

            const batchStudents = allStudents.filter(s => s.batch === batchId);
            if (batchStudents.length === 0) {
                previewDiv.innerHTML = '<div class="alert alert-info">No students in this batch</div>';
                if (downloadBtn) downloadBtn.disabled = true;
                return;
            }

            // Generate HTML for all students
            // We need to include the styles at least once
            let stylesIncluded = false;
            let styles = '';
            
            let html = '<div class="id-card-wrapper batch-preview" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; padding: 30px; justify-items: center; width: 100%; box-sizing: border-box;">';
            for (const student of batchStudents) {
                // We extract the inner HTML of the card to avoid nested containers
                const cardHTML = await generateIdCardHTML(student, true);
                // Extract just the .id-card-modern part
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cardHTML;
                
                if (!stylesIncluded) {
                    const styleElement = tempDiv.querySelector('style');
                    if (styleElement) {
                        styles = styleElement.outerHTML;
                        stylesIncluded = true;
                    }
                }
                
                const cardElement = tempDiv.querySelector('.id-card-modern');
                if (cardElement) {
                    // Add data attribute for identification
                    cardElement.setAttribute('data-student-id', student.studentId);
                    html += cardElement.outerHTML;
                }
            }
            html += '</div>';
            previewDiv.innerHTML = styles + html;
            if (downloadBtn) downloadBtn.disabled = false;
        }
    };

    /**
     * Download Current Preview
     */
    window.downloadCurrentPreview = function() {
        const selectionType = document.getElementById('idSelectionType').value;
        
        if (selectionType === 'single') {
            if (!selectedStudent) {
                toast('Please select a student first', { icon: '⚠️' });
                return;
            }
            downloadIdCards([selectedStudent]);
        } else if (selectionType === 'batch') {
            const batchId = document.getElementById('idBatchSelect').value;
            if (!batchId) {
                toast('Please select a batch first', { icon: '⚠️' });
                return;
            }
            const batchStudents = allStudents.filter(s => s.batch === batchId);
            if (batchStudents.length === 0) {
                toast('No students in this batch', { icon: '⚠️' });
                return;
            }
            downloadBatchIdCards(batchStudents);
        }
    };

    /**
     * Generate ID card HTML with secure QR code - Industry Grade Design
     */
    async function generateIdCardHTML(student, includePhoto) {
        const validUntil = new Date();
        validUntil.setFullYear(validUntil.getFullYear() + 1);
        const validUntilFormatted = validUntil.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const issuedDate = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        // Use global contextPath defined in JSP, fallback to empty string if undefined
        const ctx = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        // Get batch and course info
        const batch = allBatches.find(b => b.batchId === student.batchId);
        const courseName = batch?.courseName || student.courseName || 'Student Program';
        const batchName = batch?.batchName || student.batchName || '';
        
        // Get institute details
        const inst = instituteDetails || {};
        const instName = inst.instituteName || (typeof instituteName !== 'undefined' ? instituteName : 'EduHub Institute');
        const instEmail = inst.instituteEmail || inst.email || '';
        const instPhone = inst.phone || inst.contactPhone || '';
        const instAddress = inst.city ? `${inst.city}, ${inst.state || ''}` : '';
        
        // Generate secure token for QR code - ALWAYS use encrypted token
        let verifyUrl;
        try {
            const response = await fetch(`${ctx}/api/generate-qr-token?studentId=${encodeURIComponent(student.studentId)}`);
            if (response.ok) {
                verifyUrl = await response.text();
                console.log('Secure QR token generated successfully');
            } else {
                console.error('Token generation failed with status:', response.status);
                // Use a placeholder that indicates error - this won't verify but shows QR generation failed
                verifyUrl = `${window.location.origin}${ctx}/verify/id/TOKEN_GENERATION_FAILED`;
            }
        } catch (error) {
            console.error('Error generating secure token:', error);
            // Use a placeholder that indicates error
            verifyUrl = `${window.location.origin}${ctx}/verify/id/TOKEN_GENERATION_FAILED`;
        }
        
        // QR Code Generation using local ZXing-based QRCodeServlet (core-3.5.4)
        const qrCodeUrl = `${ctx}/QRCodeServlet?text=${encodeURIComponent(verifyUrl)}&width=200&height=200&color=0e2a47&bgcolor=ffffff&margin=0`;
        
        // Student ID short format
        const shortId = student.studentId ? student.studentId.substring(0, 12).toUpperCase() : 'N/A';

        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
                
                .id-card-wrapper {
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }
                
                .id-card-modern {
                    width: 340px;
                    min-width: 340px;
                    max-width: 340px;
                    height: 540px;
                    min-height: 540px;
                    max-height: 540px;
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 16px;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8);
                    overflow: hidden;
                    position: relative;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                
                /* Header with gradient */
                .id-header {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0e2a47 100%);
                    padding: 20px 24px 45px 24px;
                    position: relative;
                    overflow: hidden;
                }
                
                .id-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }
                
                .id-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37, #f4d03f, #d4af37);
                    background-size: 200% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .institute-logo-area {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                }
                
                .institute-logo-img {
                    width: 48px;
                    height: 48px;
                    object-fit: contain;
                    background: white;
                    border-radius: 10px;
                    padding: 4px;
                }
                
                .institute-name-header {
                    flex: 1;
                }
                
                .institute-name-header h1 {
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: 0.5px;
                    line-height: 1.3;
                }
                
                .institute-name-header p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 10px;
                    margin: 4px 0 0 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 500;
                }
                
                /* Photo Section */
                .photo-section {
                    display: flex;
                    justify-content: center;
                    margin-top: -35px;
                    position: relative;
                    z-index: 2;
                }
                
                .photo-frame {
                    width: 100px;
                    height: 100px;
                    min-width: 100px;
                    min-height: 100px;
                    max-width: 100px;
                    max-height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #d4af37, #f4d03f);
                    padding: 4px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    flex-shrink: 0;
                }
                
                .photo-inner {
                    width: 92px;
                    height: 92px;
                    min-width: 92px;
                    min-height: 92px;
                    max-width: 92px;
                    max-height: 92px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .photo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
                
                .photo-placeholder-modern {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
                    color: #64748b;
                    font-size: 40px;
                }
                
                /* Student Info */
                .student-info {
                    text-align: center;
                    padding: 16px 24px 12px 24px;
                }
                
                .student-name-modern {
                    font-size: 20px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.3px;
                }
                
                .course-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #0e2a47, #1e3a5f);
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 6px 14px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 8px;
                }
                
                /* Details Grid */
                .details-section {
                    padding: 0 24px;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                }
                
                .detail-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .detail-value {
                    font-size: 12px;
                    font-weight: 600;
                    color: #0f172a;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                /* QR & Validity Section */
                .bottom-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 24px;
                    margin-top: auto;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                }
                
                .validity-info {
                    flex: 1;
                }
                
                .validity-label {
                    font-size: 9px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 2px;
                }
                
                .validity-date {
                    font-size: 14px;
                    font-weight: 700;
                    color: #0f172a;
                }
                
                .qr-section {
                    text-align: center;
                }
                
                .qr-code-modern {
                    width: 90px;
                    height: 90px;
                    padding: 0;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                
                .qr-code-modern img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                
                .qr-label {
                    font-size: 8px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 4px;
                }
                
                /* Security Strip */
                .security-strip {
                    height: 24px;
                    background: linear-gradient(90deg, 
                        #0e2a47 0%, 
                        #1e3a5f 20%, 
                        #d4af37 40%, 
                        #f4d03f 50%, 
                        #d4af37 60%, 
                        #1e3a5f 80%, 
                        #0e2a47 100%
                    );
                    background-size: 200% 100%;
                    animation: holographic 4s linear infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes holographic {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                
                .security-text {
                    font-size: 8px;
                    font-weight: 700;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                
                /* Holographic overlay effect */
                .id-card-modern::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    transform: skewX(-25deg);
                    animation: shine 6s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 10;
                }
                
                @keyframes shine {
                    0%, 100% { left: -100%; }
                    50% { left: 150%; }
                }
                
                /* Download mode - no animations, full quality */
                .id-card-modern.download-mode::before,
                .id-card-modern.download-mode .security-strip,
                .id-card-modern.download-mode .id-header::after {
                    animation: none !important;
                }
            </style>
            
            <div class="id-card-wrapper">
                <div class="id-card-modern" id="idCardElement" data-student-id="${student.studentId}">
                    <!-- Header -->
                    <div class="id-header">
                        <div class="institute-logo-area">
                            <img src="${ctx}/public/assets/images/BlueBlackLogo.png" alt="Logo" class="institute-logo-img" crossorigin="anonymous">
                            <div class="institute-name-header">
                                <h1>${instName}</h1>
                                <p>Identity Card</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Photo -->
                    <div class="photo-section">
                        <div class="photo-frame">
                            <div class="photo-inner">
                                ${includePhoto && student.profilePhotoUrl ? `
                                    <img src="${student.profilePhotoUrl}" class="photo-img" alt="Student Photo" crossorigin="anonymous" 
                                        onerror="this.parentElement.innerHTML='<div class=\\'photo-placeholder-modern\\'><i class=\\'bi bi-person-fill\\'></i></div>'">
                                ` : `
                                    <div class="photo-placeholder-modern">
                                        <i class="bi bi-person-fill"></i>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Student Info -->
                    <div class="student-info">
                        <h2 class="student-name-modern">${student.name}</h2>
                        <span class="course-badge">${courseName}</span>
                    </div>
                    
                    <!-- Details -->
                    <div class="details-section">
                        <div class="detail-row">
                            <span class="detail-label">Student ID</span>
                            <span class="detail-value">${shortId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Batch</span>
                            <span class="detail-value">${batchName || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Issued</span>
                            <span class="detail-value">${issuedDate}</span>
                        </div>
                    </div>
                    
                    <!-- Bottom Section -->
                    <div class="bottom-section">
                        <div class="validity-info">
                            <div class="validity-label">Valid Until</div>
                            <div class="validity-date">${validUntilFormatted}</div>
                        </div>
                        <div class="qr-section">
                            <div class="qr-code-modern">
                                <img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous">
                            </div>
                            <div class="qr-label">Scan to Verify</div>
                        </div>
                    </div>
                    
                    <!-- Security Strip -->
                    <div class="security-strip">
                        <span class="security-text">Authorized • Verified • Secure</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate ID card - saves to backend first, then downloads
     */
    window.generateIdCard = async function() {
        const selectionType = document.getElementById('idSelectionType').value;
        
        if (selectionType === 'single' && !selectedStudent) {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        let studentsToGenerate = [];
        let count = 0;
        let batchId = null;

        switch(selectionType) {
            case 'single':
                studentsToGenerate = [selectedStudent];
                count = 1;
                break;
            case 'batch':
                batchId = document.getElementById('idBatchSelect').value;
                if (!batchId) {
                    toast('Please select a batch first', { icon: '⚠️' });
                    return;
                }
                studentsToGenerate = allStudents.filter(s => {
                    return s.batch === batchId || s.batchId === batchId;
                });
                count = studentsToGenerate.length;
                break;
        }

        if (count === 0) {
            toast('No students selected for ID card generation', { icon: '⚠️' });
            return;
        }

        // Show loading toast
        const loadingToastId = toast.loading(`Generating ${count} ID card${count > 1 ? 's' : ''}...`);

        try {
            // Call backend API to save ID card(s) to database
            let apiResponse;
            if (selectionType === 'single') {
                // Single ID card generation
                apiResponse = await fetch(`${contextPath}/api/id-cards/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `studentId=${encodeURIComponent(selectedStudent.studentId)}`
                });
            } else {
                // Batch ID card generation
                apiResponse = await fetch(`${contextPath}/api/id-cards/generate-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `batchId=${encodeURIComponent(batchId)}`
                });
            }

            const result = await apiResponse.json();
            
            if (!apiResponse.ok || result.error) {
                throw new Error(result.message || 'Failed to save ID card to database');
            }

            // Add to local history
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
            toast.success(`${count} ID card${count > 1 ? 's' : ''} generated and saved!`);
            
            // Ensure preview exists for download
            if (selectionType === 'batch') {
                previewIdCard();
            } else if (!document.querySelector('.id-card-modern')) {
                previewIdCard();
            }

            // Small delay to ensure DOM is updated if preview was just called
            setTimeout(() => {
                downloadIdCards(studentsToGenerate);
            }, 500);

        } catch (error) {
            console.error('Error generating ID cards:', error);
            toast.dismiss(loadingToastId);
            toast.error(error.message || 'Error generating ID cards');
        }
    };

    /**
     * Download ID cards (using html2canvas)
     */
    function downloadIdCards(students) {
        console.log('Starting downloadIdCards for', students.length, 'students');
        const isBatch = students.length > 1;
        
        if (isBatch) {
            console.log('Delegating to downloadBatchIdCards');
            downloadBatchIdCards(students);
            return;
        }

        // Single Card Download
        const element = document.querySelector('.id-card-modern');
        console.log('Found ID card element:', element);
        
        if (!element) {
            console.warn('ID card element not found in DOM');
            toast('Please preview the ID card first', { icon: '⚠️' });
            return;
        }

        toast('Downloading HD Image...', { icon: '⬇️' });

        // Add download-mode class to disable animations
        element.classList.add('download-mode');

        // Preload all images including background images
        const preloadImages = async () => {
            // Preload regular img tags
            const images = Array.from(element.querySelectorAll('img'));
            const imgPromises = images.map(img => {
                if (img.complete && img.naturalWidth > 0) {
                    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
                }
                return new Promise(resolve => {
                    img.onload = () => {
                        if (img.decode) img.decode().then(resolve).catch(resolve);
                        else resolve();
                    };
                    img.onerror = resolve;
                });
            });
            
            // Preload background images (legacy support)
            const bgElements = Array.from(element.querySelectorAll('[style*="background-image"]'));
            const bgPromises = bgElements.map(el => {
                const style = el.style.backgroundImage;
                const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (!urlMatch) return Promise.resolve();
                
                return new Promise(resolve => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = urlMatch[1];
                });
            });
            
            await Promise.all([...imgPromises, ...bgPromises]);
        };

        // Helper to fix object-fit for html2canvas
        const fixObjectFit = (element) => {
            const images = element.querySelectorAll('.photo-img');
            images.forEach(img => {
                if (img.naturalWidth && img.naturalHeight) {
                    const aspect = img.naturalWidth / img.naturalHeight;
                    // Container is square (1:1)
                    if (aspect >= 1) {
                        // Landscape or Square
                        img.style.width = 'auto';
                        img.style.height = '100%';
                        img.style.minWidth = '100%';
                        img.style.maxWidth = 'none';
                    } else {
                        // Portrait
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.minHeight = '100%';
                        img.style.maxHeight = 'none';
                    }
                    // Disable object-fit so html2canvas uses the explicit dimensions
                    img.style.objectFit = 'none'; 
                }
            });
        };

        preloadImages().then(() => {
            // Longer delay to ensure full rendering
            return new Promise(resolve => setTimeout(resolve, 300));
        }).then(() => {
            console.log('Calling html2canvas...');
            return html2canvas(element, {
                scale: 5,  // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true,
                width: 340,
                height: 540,
                windowWidth: 340,
                windowHeight: 540,
                imageTimeout: 15000,  // Wait longer for images
                onclone: function(clonedDoc) {
                    // Force light mode for the capture
                    clonedDoc.documentElement.removeAttribute('data-theme');
                    
                    // Ensure background images are preserved in clone
                    const clonedElement = clonedDoc.querySelector('.id-card-modern');
                    if (clonedElement) {
                        clonedElement.style.transform = 'none';
                        // Fix object-fit in the clone only
                        fixObjectFit(clonedElement);
                    }
                }
            });
        }).then(canvas => {
            // Remove download-mode class
            element.classList.remove('download-mode');
            console.log('html2canvas success, creating download link');
            const link = document.createElement('a');
            link.download = `ID_Card_${students[0].studentId}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('Download started!');
        }).catch(err => {
            console.error('Error generating ID card image:', err);
            toast.error('Failed to generate image. Please try again.');
        });
    }

    /**
     * Download Batch ID Cards as ZIP
     */
    function downloadBatchIdCards(students) {
        console.log('Starting downloadBatchIdCards');
        const elements = document.querySelectorAll('.id-card-modern');
        console.log('Found', elements.length, 'ID card elements');

        if (elements.length === 0) {
            console.warn('No ID card elements found for batch');
            toast('No ID cards found to download', { icon: '⚠️' });
            return;
        }

        toast('Generating ZIP file...', { icon: '⏳' });
        const zip = new JSZip();
        const folder = zip.folder("ID_Cards");
        let processedCount = 0;

        // Helper to preload all images including background images
        const preloadAllImages = async (element) => {
            // Preload regular img tags
            const images = Array.from(element.querySelectorAll('img'));
            const imgPromises = images.map(img => {
                if (img.complete && img.naturalWidth > 0) {
                    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
                }
                return new Promise(resolve => {
                    img.onload = () => {
                        if (img.decode) img.decode().then(resolve).catch(resolve);
                        else resolve();
                    };
                    img.onerror = resolve;
                });
            });
            
            // Preload background images (legacy support)
            const bgElements = Array.from(element.querySelectorAll('[style*="background-image"]'));
            const bgPromises = bgElements.map(el => {
                const style = el.style.backgroundImage;
                const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (!urlMatch) return Promise.resolve();
                
                return new Promise(resolve => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = urlMatch[1];
                });
            });
            
            await Promise.all([...imgPromises, ...bgPromises]);
        };

        // Helper to fix object-fit for html2canvas
        const fixObjectFit = (element) => {
            const images = element.querySelectorAll('.photo-img');
            images.forEach(img => {
                if (img.naturalWidth && img.naturalHeight) {
                    const aspect = img.naturalWidth / img.naturalHeight;
                    // Container is square (1:1)
                    if (aspect >= 1) {
                        // Landscape or Square
                        img.style.width = 'auto';
                        img.style.height = '100%';
                        img.style.minWidth = '100%';
                        img.style.maxWidth = 'none';
                    } else {
                        // Portrait
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.minHeight = '100%';
                        img.style.maxHeight = 'none';
                    }
                    // Disable object-fit so html2canvas uses the explicit dimensions
                    img.style.objectFit = 'none'; 
                }
            });
        };

        // Helper to process each card
        const processCard = async (element, index) => {
            console.log('Processing card', index);

            // Add download-mode class to disable animations
            element.classList.add('download-mode');

            // 1. Wait for all images to load
            await preloadAllImages(element);
            
            // 2. Delay to ensure rendering is complete
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 3. Capture
            const canvas = await html2canvas(element, {
                scale: 5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 340,
                height: 540,
                windowWidth: 340,
                windowHeight: 540,
                imageTimeout: 15000,
                onclone: function(clonedDoc) {
                    // Force light mode for the capture
                    clonedDoc.documentElement.removeAttribute('data-theme');

                    // Fix object-fit in the clone only
                    // Note: We need to find the specific card in the cloned document
                    // Since we are capturing 'element', clonedDoc.body will contain a clone of 'element'
                    // But html2canvas might wrap it.
                    // Usually clonedDoc is the document.
                    // If we capture a specific element, html2canvas clones the document but renders that element.
                    // We need to find the corresponding element in the cloned doc.
                    // Since we are capturing 'element', we can try to find it by data attribute or class.
                    const clonedElement = clonedDoc.querySelector(`[data-student-id="${element.getAttribute('data-student-id')}"]`) || clonedDoc.querySelector('.id-card-modern');
                    if (clonedElement) {
                        fixObjectFit(clonedElement);
                    }
                }
            });
            
            // Remove download-mode class
            element.classList.remove('download-mode');
            
            // 4. Convert to blob and add to ZIP
            return new Promise((resolve) => {
                canvas.toBlob(blob => {
                    const studentId = element.getAttribute('data-student-id') || `student_${index}`;
                    console.log('Card processed:', studentId);
                    folder.file(`ID_Card_${studentId}.png`, blob);
                    processedCount++;
                    resolve();
                }, 'image/png', 1.0);
            });
        };

        // Process all cards sequentially to avoid browser freeze
        const processAll = async () => {
            for (let i = 0; i < elements.length; i++) {
                await processCard(elements[i], i);
                // Optional: Update toast with progress
            }
            
            console.log('All cards processed, generating zip');
            // Generate ZIP
            zip.generateAsync({type:"blob"}).then(function(content) {
                console.log('Zip generated, saving...');
                saveAs(content, "ID_Cards_Batch.zip");
                toast.success('Batch download started!');
            });
        };

        processAll().catch(err => {
            console.error('Error generating batch zip:', err);
            toast.error('Failed to generate batch zip.');
        });
    }

    /**
     * Preview certificate - simplified version
     */
    window.previewCertificate = function() {
        const selectionType = document.getElementById('certSelectionType').value;
        
        if (selectionType === 'single') {
            if (!selectedCertStudent) {
                toast('Please select a student first', { icon: '⚠️' });
                return;
            }
            previewSingleCertificate(selectedCertStudent);
        } else if (selectionType === 'batch') {
            previewBatchCertificates();
        }
    };

    /**
     * Generate Professional Certificate HTML - Exact match to certificate.html template
     * Now with secure encrypted QR code for certificate verification
     */
    async function generateProfessionalCertificateHTML(student, options) {
        // Use global contextPath defined in JSP
        const ctx = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        const {
            certType = 'completion',
            courseName = 'Professional Development Program',
            courseModules = '',
            description = '',
            durationText = '',
            issueDate = new Date().toISOString().split('T')[0],
            signatoryName = 'Prajakt Patki',
            signatoryTitle = 'Director',
            streetAddress = '',
            cityStateCountry = '',
            zipcode = '',
            instituteEmail = '',
            instName = 'EduHub Institute',
            certificateId = null,  // Optional: use backend-generated ID if provided
            verificationToken = null  // Optional: use backend-generated token if provided
        } = options;
        
        console.log('DEBUG generateProfessionalCertificateHTML: certificateId from options =', certificateId, 'verificationToken =', verificationToken);
        
        // Get certificate subtitle based on type
        const certSubtitle = getCertificateSubtitle(certType);

        // Use type-specific description if no custom description provided
        const finalDescription = description || getDefaultDescription(certType, courseName, courseModules);
        
        // Format issue date
        const issueDateFormatted = issueDate ? formatDate(issueDate) : formatDate(new Date().toISOString().split('T')[0]);
        
        // Use provided certificate ID or generate a temporary one for preview
        let certId;
        if (certificateId) {
            // Use the backend-generated certificate ID
            certId = certificateId;
            console.log('DEBUG: Using backend-provided certificateId:', certId);
        } else {
            // Use placeholder ID for preview - actual ID will be assigned by backend
            certId = '0000-0000-0000-0000';
            console.log('DEBUG: Using placeholder certificateId for preview:', certId);
        }
        
        // Generate secure encrypted QR code URL from backend
        let qrCodeUrl;
        let verifyUrl;
        
        // If verification token is provided (from backend), use it directly
        if (verificationToken) {
            verifyUrl = `${window.location.origin}${ctx}/verify/certificate/${verificationToken}`;
            // Use local ZXing-based QRCodeServlet (core-3.5.4) with transparent background
            qrCodeUrl = `${ctx}/QRCodeServlet?text=${encodeURIComponent(verifyUrl)}&width=300&height=300&color=0e2a47&transparent=true&margin=0`;
        } else {
            // Generate QR code for preview - ALWAYS use encrypted token
            try {
                const response = await fetch(`${ctx}/api/generate-cert-token?studentId=${encodeURIComponent(student.studentId)}&studentName=${encodeURIComponent(student.name)}&certId=${encodeURIComponent(certId)}&courseName=${encodeURIComponent(courseName)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.url) {
                        verifyUrl = data.url;
                        // Use local ZXing-based QRCodeServlet (core-3.5.4) with transparent background
                        qrCodeUrl = `${ctx}/QRCodeServlet?text=${encodeURIComponent(verifyUrl)}&width=300&height=300&color=0e2a47&transparent=true&margin=0`;
                        console.log('Secure certificate QR generated:', data.certId);
                    } else {
                        throw new Error('Invalid response from token API');
                    }
                } else {
                    throw new Error('Token generation failed with status: ' + response.status);
                }
            } catch (error) {
                console.error('Could not generate secure QR token:', error);
                // Use a placeholder that indicates error - this won't verify but shows QR generation failed
                verifyUrl = `${window.location.origin}${ctx}/verify/certificate/TOKEN_GENERATION_FAILED`;
                // Use local ZXing-based QRCodeServlet (core-3.5.4) with transparent background
                qrCodeUrl = `${ctx}/QRCodeServlet?text=${encodeURIComponent(verifyUrl)}&width=300&height=300&color=0e2a47&transparent=true&margin=0`;
            }
        }

        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;600&family=Great+Vibes&display=swap');

                .certificate-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: fit-content;
                    width: 100%;
                }

                .certificate-container {
                    width: 1123px;
                    min-width: 1123px;
                    height: 794px;
                    min-height: 794px;
                    background: linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%);
                    position: relative;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(212,175,55,0.3);
                    padding: 40px;
                    display: flex;
                    overflow: hidden;
                    transform: scale(0.72);
                    transform-origin: top center;
                    font-family: 'Open Sans', sans-serif;
                    box-sizing: border-box;
                }

                /* Responsive scaling - keep fixed dimensions, just scale down */
                @media screen and (max-width: 900px) {
                    .certificate-container {
                        transform: scale(0.55);
                        transform-origin: top center;
                    }
                }

                @media screen and (max-width: 700px) {
                    .certificate-container {
                        transform: scale(0.45);
                        transform-origin: top center;
                    }
                }

                @media screen and (max-width: 550px) {
                    .certificate-container {
                        transform: scale(0.35);
                        transform-origin: top center;
                    }
                }

                @media screen and (max-width: 400px) {
                    .certificate-container {
                        transform: scale(0.28);
                        transform-origin: top center;
                    }
                }

                /* Override for download - force full size */
                .certificate-container.download-mode {
                    transform: none !important;
                    transform-origin: top left !important;
                }

                /* html2canvas in production can mis-render SVG masks as solid rectangles.
                   The background watermark uses an SVG mask, so disable it only for downloads. */
                .certificate-container.download-mode .bg-pattern {
                    display: none !important;
                }

                .certificate-container * {
                    box-sizing: border-box;
                }

                .certificate-container::before {
                    content: '';
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    right: 12px;
                    bottom: 12px;
                    border: 1px solid rgba(212,175,55,0.4);
                    pointer-events: none;
                    z-index: 0;
                }

                .border-frame {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    border: 2px solid #0e2a47;
                    z-index: 1;
                    pointer-events: none;
                }
                
                .border-frame::after {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    right: 4px;
                    bottom: 4px;
                    border: 1px solid #d4af37;
                }

                .corner-ornament {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 2px solid #d4af37;
                    z-index: 3;
                }
                .corner-tl { top: 25px; left: 25px; border-right: none; border-bottom: none; }
                .corner-tr { top: 25px; right: 25px; border-left: none; border-bottom: none; }
                .corner-bl { bottom: 25px; left: 25px; border-right: none; border-top: none; }
                .corner-br { bottom: 25px; right: 25px; border-left: none; border-top: none; }

                .ribbon {
                    position: absolute;
                    top: 0;
                    left: 60px;
                    width: 150px;
                    height: 714px;
                    z-index: 2;
                    overflow: visible;
                }
                
                .ribbon-svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 150px;
                    height: 714px;
                }
                
                .ribbon-content {
                    position: absolute;
                    top: 0;
                    left: 15px;
                    width: 135px;
                    height: 550px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding-top: 30px;
                    z-index: 3;
                }

                .ribbon-logo {
                    width: 110px;
                    max-height: 400px;
                    object-fit: contain;
                }

                .ribbon-logo i {
                    font-size: 50px;
                    color: #d4af37;
                }

                .content {
                    flex: 1;
                    margin-left: 180px;
                    padding: 20px 30px 15px 15px;
                    display: flex;
                    flex-direction: column;
                    z-index: 2;
                    height: 100%;
                }

                .main-content-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .footer-area {
                    flex-shrink: 0;
                    margin-top: auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }

                .title-group h1 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 52px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0;
                    line-height: 1;
                    letter-spacing: -1px;
                }

                .title-group h2 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 30px;
                    font-weight: 400;
                    color: #0e2a47;
                    margin: 8px 0 0 0;
                    letter-spacing: 2px;
                    font-style: italic;
                }

                .org-logo-top {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                
                .org-logo-placeholder {
                    min-width: 60px;
                    max-width: 500px;
                    min-height: 50px;
                    max-height: 300px;
                    padding: 8px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                }

                .org-logo-placeholder img {
                    max-width: 100%;
                    max-height: 70px;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                }

                .body-text {
                    margin-bottom: 10px;
                    flex-shrink: 0;
                }

                .confirm-text {
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .recipient-name {
                    font-family: 'Great Vibes', cursive;
                    font-size: 44px;
                    font-weight: 400;
                    color: #0e2a47;
                    margin: 0 0 3px 0;
                }

                .completed-text {
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .program-name {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 19px;
                    font-weight: 700;
                    color: #0e2a47;
                    margin: 5px 0 8px 0;
                    letter-spacing: 1px;
                }

                .description {
                    font-size: 12.5px;
                    color: #555;
                    line-height: 1.55;
                    max-width: 700px;
                    letter-spacing: 0.2px;
                    font-weight: 500;
                }

                .details-grid {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 0;
                    padding: 10px 0 0 0;
                }

                .detail-card {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    border-left: 3px solid #d4af37;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    border-radius: 0 6px 6px 0;
                }

                .detail-icon {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #0e2a47 0%, #1a3d5c 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .detail-icon svg {
                    width: 16px;
                    height: 16px;
                    fill: #d4af37;
                }

                .detail-content {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-weight: 600;
                    color: #0e2a47;
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 1px;
                }

                .detail-value {
                    color: #333;
                    font-size: 14px;
                    font-weight: 600;
                }

                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding-top: 10px;
                }

                .signature-section {
                    flex: 1.5;
                    text-align: left;
                    min-width: 200px;
                }

                .signature-image {
                    font-family: 'Great Vibes', cursive;
                    font-size: 34px;
                    color: #0e2a47 !important;
                    margin-bottom: 3px;
                }

                .signer-name {
                    font-weight: 700;
                    color: #333 !important;
                    font-size: 14px;
                    margin: 0;
                }

                .signer-title {
                    color: #777 !important;
                    font-size: 11px;
                    margin: 2px 0 0 0;
                }

                .center-logo {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                }

                .center-qr {
                    width: 120px;
                    height: 120px;
                    padding: 0;
                    background: transparent;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .center-qr img {
                    width: 135%;
                    height: 135%;
                    object-fit: contain;
                }

                .center-qr svg {
                    width: 100%;
                    height: 100%;
                }

                .center-logo-text {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 10px;
                    color: #0e2a47;
                    line-height: 1.2;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .certificate-id {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 9px;
                    color: #666;
                    letter-spacing: 0.5px;
                    margin-top: 3px;
                }

                .address-section {
                    flex: 1.5;
                    text-align: right;
                    font-size: 11px;
                    color: #555;
                    line-height: 1.6;
                    min-width: 250px;
                }

                .address-section strong {
                    color: #0e2a47;
                    font-size: 12px;
                }

                .bg-pattern {
                    position: absolute;
                    top: 50%;
                    left: 60%;
                    transform: translate(-50%, -50%);
                    width: 650px;
                    height: 650px;
                    opacity: 0.08;
                    z-index: 0;
                    pointer-events: none;
                }
                
                .bg-pattern svg {
                    width: 100%;
                    height: 100%;
                    fill: #0e2a47;
                }
            </style>

            <div class="certificate-wrapper">
            <div class="certificate-container" id="certificateElement">
                <!-- Decorative Border -->
                <div class="border-frame"></div>

                <!-- Corner Ornaments -->
                <div class="corner-ornament corner-tl"></div>
                <div class="corner-ornament corner-tr"></div>
                <div class="corner-ornament corner-bl"></div>
                <div class="corner-ornament corner-br"></div>

                <!-- Background Watermark -->
                <div class="bg-pattern">
                    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hexMesh" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
                                <path d="M28 0 L56 17 L56 50 L28 67 L0 50 L0 17 Z" fill="none" stroke="#0e2a47" stroke-width="0.6"/>
                                <path d="M28 67 L56 84 L56 117 L28 134 L0 117 L0 84 Z" fill="none" stroke="#0e2a47" stroke-width="0.6" transform="translate(0,-34)"/>
                                <path d="M0 50 L28 67 L28 100" fill="none" stroke="#0e2a47" stroke-width="0.4"/>
                                <path d="M56 50 L28 67" fill="none" stroke="#0e2a47" stroke-width="0.4"/>
                            </pattern>
                            <radialGradient id="fadeOut" cx="50%" cy="50%" r="60%">
                                <stop offset="0%" stop-color="white" stop-opacity="1"/>
                                <stop offset="100%" stop-color="white" stop-opacity="0"/>
                            </radialGradient>
                            <mask id="fadeMask">
                                <rect width="400" height="400" fill="url(#fadeOut)"/>
                            </mask>
                        </defs>
                        <rect width="400" height="400" fill="url(#hexMesh)" mask="url(#fadeMask)"/>
                        <circle cx="200" cy="200" r="80" fill="none" stroke="#0e2a47" stroke-width="0.5"/>
                        <circle cx="200" cy="200" r="60" fill="none" stroke="#0e2a47" stroke-width="0.3"/>
                        <circle cx="200" cy="200" r="100" fill="none" stroke="#0e2a47" stroke-width="0.3"/>
                        <g stroke="#0e2a47" stroke-width="0.3">
                            <line x1="200" y1="200" x2="200" y2="100"/>
                            <line x1="200" y1="200" x2="287" y2="150"/>
                            <line x1="200" y1="200" x2="287" y2="250"/>
                            <line x1="200" y1="200" x2="200" y2="300"/>
                            <line x1="200" y1="200" x2="113" y2="250"/>
                            <line x1="200" y1="200" x2="113" y2="150"/>
                        </g>
                        <g fill="#0e2a47">
                            <circle cx="200" cy="100" r="3"/>
                            <circle cx="287" cy="150" r="3"/>
                            <circle cx="287" cy="250" r="3"/>
                            <circle cx="200" cy="300" r="3"/>
                            <circle cx="113" cy="250" r="3"/>
                            <circle cx="113" cy="150" r="3"/>
                        </g>
                    </svg>
                </div>

                <!-- Left Ribbon with SVG shape (html2canvas compatible) -->
                <div class="ribbon">
                    <svg class="ribbon-svg" viewBox="0 0 150 714" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#0e2a47"/>
                                <stop offset="50%" style="stop-color:#1a3d5c"/>
                                <stop offset="100%" style="stop-color:#0e2a47"/>
                            </linearGradient>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#d4af37"/>
                                <stop offset="50%" style="stop-color:#f4d03f"/>
                                <stop offset="100%" style="stop-color:#d4af37"/>
                            </linearGradient>
                        </defs>
                        <!-- Main blue ribbon -->
                        <polygon points="0,0 150,0 150,580 75,700 0,580" fill="url(#ribbonGradient)"/>
                        <!-- Gold stripe on left inner edge of blue ribbon -->
                        <polygon points="0,0 12,0 12,570 0,570" fill="url(#goldGradient)"/>
                    </svg>
                    <div class="ribbon-content">
                        <img src="${ctx}/public/assets/images/iso-logo.png" alt="Certified" class="ribbon-logo">
                    </div>
                </div>

                <!-- Main Content -->
                <div class="content">
                    
                    <!-- Main Content Area (Header + Body + Details) -->
                    <div class="main-content-area">
                        <!-- Header -->
                        <div class="header">
                            <div class="title-group">
                                <h1>Certificate</h1>
                                <h2>${certSubtitle}</h2>
                            </div>
                            <div class="org-logo-top">
                                <div class="org-logo-placeholder">
                                    <img src="${ctx}/public/assets/images/BlueBlackLogo.png" alt="Institute Logo">
                                </div>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="body-text">
                            <div class="confirm-text">This is to confirm that</div>
                            <div class="recipient-name">${escapeHtml(student.name)}</div>
                            <div class="completed-text">has successfully completed the</div>
                            <div class="program-name">${escapeHtml(courseName)}</div>
                            <div class="description">${escapeHtml(finalDescription)}</div>
                        </div>

                        <!-- Details Grid -->
                        <div class="details-grid">
                        <div class="detail-card">
                            <div class="detail-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                </svg>
                            </div>
                            <div class="detail-content">
                                <div class="detail-label">Duration</div>
                                <div class="detail-value">${durationText || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                                </svg>
                            </div>
                            <div class="detail-content">
                                <div class="detail-label">Issue Date</div>
                                <div class="detail-value">${issueDateFormatted}</div>
                            </div>
                        </div>
                    </div>
                    </div><!-- End main-content-area -->

                    <!-- Footer Area -->
                    <div class="footer-area">
                        <div class="footer">
                            <div class="signature-section">
                                <div class="signature-image">${escapeHtml(signatoryName)}</div>
                                <p class="signer-name">Mr. ${escapeHtml(signatoryName)}</p>
                                <p class="signer-title">${escapeHtml(signatoryTitle)}</p>
                                <p class="signer-title">${escapeHtml(instName)}</p>
                            </div>

                            <div class="center-logo">
                                <div class="center-qr">
                                    <img src="${qrCodeUrl}" alt="Verify Certificate" style="width: 100%; height: 100%;" crossorigin="anonymous">
                                </div>
                                <div class="center-logo-text">Scan to Verify</div>
                                <div class="certificate-id">ID: ${certId}</div>
                            </div>

                            <div class="address-section">
                                <strong>${escapeHtml(instName)}</strong><br>
                                ${streetAddress ? escapeHtml(streetAddress) + '<br>' : ''}
                                ${cityStateCountry ? escapeHtml(cityStateCountry) + (zipcode ? ' - ' + escapeHtml(zipcode) : '') + '<br>' : ''}
                                ${instituteEmail ? escapeHtml(instituteEmail) : ''}
                            </div>
                        </div>
                    </div><!-- End footer-area -->

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
     * Get certificate subtitle for display
     */
    function getCertificateSubtitle(certType) {
        const subtitles = {
            'completion': 'of completion',
            'achievement': 'of achievement',
            'participation': 'of participation',
            'excellence': 'of excellence',
            'custom': 'of recognition'
        };
        return subtitles[certType] || 'of completion';
    }

    /**
     * Get default description based on certificate type
     */
    function getDefaultDescription(certType, courseName, courseModules) {
        const course = courseName || 'the course';
        
        // Format modules for display
        let modulesText = '';
        if (courseModules && courseModules.trim()) {
            // Parse modules - they can be comma separated or newline separated
            const modulesList = courseModules.split(/[,\n]/).map(m => m.trim()).filter(m => m);
            if (modulesList.length > 0) {
                modulesText = ` covering: ${modulesList.join(', ')}`;
            }
        }
        
        // Get action word based on certificate type
        const actionWords = {
            'completion': 'completing',
            'achievement': 'achieving excellence in',
            'participation': 'participating in',
            'excellence': 'mastering',
            'custom': 'contributing to'
        };
        const actionWord = actionWords[certType] || 'completing';
        
        const descriptions = {
            'completion': `This certificate is awarded for successfully ${actionWord} comprehensive training in ${course}${modulesText}. The recipient has demonstrated proficiency in building scalable, secure, and robust enterprise applications adhering to industry best practices and coding standards.`,
            'achievement': `This certificate recognizes outstanding achievement in ${course}${modulesText}. The recipient has shown exceptional dedication, skill, and performance throughout the program.`,
            'participation': `This certificate acknowledges active participation in ${course}${modulesText}. The recipient has engaged meaningfully with the course content and contributed to the learning community.`,
            'excellence': `This certificate honors academic excellence in ${course}${modulesText}. The recipient has achieved outstanding results and demonstrated exceptional understanding of the subject matter.`,
            'custom': `This certificate is awarded in recognition of exceptional contribution to ${course}${modulesText}. The recipient has shown dedication and excellence in their endeavors.`
        };
        
        return descriptions[certType] || descriptions['completion'];
    }

    /**
     * Handle certificate selection type change
     */
    window.handleCertSelectionType = function() {
        const selectionType = document.getElementById('certSelectionType').value;
        const singleSection = document.getElementById('singleCertSelection');
        const batchSection = document.getElementById('batchCertSelection');

        // Hide all sections
        singleSection.style.display = 'none';
        if (batchSection) batchSection.style.display = 'none';
        
        // Show relevant section
        if (selectionType === 'single') {
            singleSection.style.display = 'block';
        } else if (selectionType === 'batch') {
            if (batchSection) {
                batchSection.style.display = 'block';
                // Populate batch dropdown for certificates
                const certBatchSelect = document.getElementById('certBatchSelect');
                if (certBatchSelect && allBatches.length > 0) {
                    certBatchSelect.innerHTML = '<option value="">-- Select Batch --</option>' + 
                        allBatches.map(b => `<option value="${b.batchId}">${b.batchName} (${b.batchCode})</option>`).join('');
                }
            }
        }
    };

    /**
     * Generate certificate (and download) - saves to backend first
     */
    window.generateCertificate = async function() {
        const selectionType = document.getElementById('certSelectionType').value;
        const certType = document.getElementById('certType')?.value || 'completion';
        
        if (selectionType === 'single') {
            if (!selectedCertStudent) {
                toast('Please select a student first', { icon: '⚠️' });
                return;
            }
            
            const loadingToastId = toast.loading('Generating certificate...');
            
            try {
                // Get batch info for course name
                const batch = allBatches.find(b => b.batchId === selectedCertStudent.batchId);
                const courseName = batch?.batchName || 'Program';
                
                // Call backend API to save certificate to database
                const apiResponse = await fetch(`${contextPath}/api/certificates/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `studentId=${encodeURIComponent(selectedCertStudent.studentId)}&batchId=${encodeURIComponent(selectedCertStudent.batchId || '')}&courseName=${encodeURIComponent(courseName)}&certificateType=${encodeURIComponent(certType)}`
                });

                const result = await apiResponse.json();
                
                if (!apiResponse.ok || result.error) {
                    throw new Error(result.message || 'Failed to save certificate to database');
                }

                // Add to local history
                const historyEntry = {
                    date: new Date().toISOString(),
                    type: `Certificate of ${certType.charAt(0).toUpperCase() + certType.slice(1)}`,
                    students: selectedCertStudent.name,
                    count: 1,
                    generatedBy: 'Admin User',
                    certificateId: result.certificateId,
                    verificationToken: result.verificationToken
                };
                generationHistory.unshift(historyEntry);
                saveHistory();
                updateHistoryTable();

                toast.dismiss(loadingToastId);
                toast.success('Certificate generated and saved!');
                
                // Record download
                if (result.certificateId) {
                    fetch(`${contextPath}/api/certificates/download`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `certificateId=${encodeURIComponent(result.certificateId)}`
                    }).catch(err => console.log('Download tracking failed:', err));
                }
                
                // Regenerate preview with the actual certificate ID from backend before downloading
                const previewDiv = document.getElementById('certificatePreview');
                if (previewDiv) {
                    const certData = buildCertificateData(selectedCertStudent, batch);
                    // Add the backend-generated certificate ID and verification token
                    certData.certificateId = result.certificateId;
                    certData.verificationToken = result.verificationToken;
                    console.log('DEBUG: Regenerating preview with backend ID:', certData.certificateId, 'token:', certData.verificationToken);
                    previewDiv.innerHTML = await generateProfessionalCertificateHTML(selectedCertStudent, certData);
                    console.log('DEBUG: Preview regenerated - checking element for ID display');
                    const certIdElement = previewDiv.querySelector('.certificate-id');
                    if (certIdElement) console.log('DEBUG: Certificate ID in DOM:', certIdElement.textContent);
                    
                    // Wait for the preview to render before downloading
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Download the certificate
                downloadCurrentCertificate();
                
            } catch (error) {
                console.error('Error generating certificate:', error);
                toast.dismiss(loadingToastId);
                toast.error(error.message || 'Error generating certificate');
            }
            
        } else if (selectionType === 'batch') {
            const batchId = document.getElementById('certBatchSelect').value;
            if (!batchId) {
                toast('Please select a batch first', { icon: '⚠️' });
                return;
            }
            
            const batchStudents = allStudents.filter(s => s.batchId === batchId);
            if (batchStudents.length === 0) {
                toast('No students in this batch', { icon: '⚠️' });
                return;
            }
            
            const batch = allBatches.find(b => b.batchId === batchId);
            const loadingToastId = toast.loading(`Generating ${batchStudents.length} certificates...`);
            
            try {
                // Call backend API to save all certificates to database
                const apiResponse = await fetch(`${contextPath}/api/certificates/generate-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `batchId=${encodeURIComponent(batchId)}&certificateType=${encodeURIComponent(certType)}`
                });

                const result = await apiResponse.json();
                
                if (!apiResponse.ok || result.error) {
                    throw new Error(result.message || 'Failed to save certificates to database');
                }

                // Add to local history
                const historyEntry = {
                    date: new Date().toISOString(),
                    type: `Certificate of ${certType.charAt(0).toUpperCase() + certType.slice(1)}`,
                    students: `${result.count || batchStudents.length} students`,
                    count: result.count || batchStudents.length,
                    generatedBy: 'Admin User'
                };
                generationHistory.unshift(historyEntry);
                saveHistory();
                updateHistoryTable();

                // Generate all certificates for batch (download)
                downloadBatchCertificates(batchStudents, batch, loadingToastId);
                
            } catch (error) {
                console.error('Error generating batch certificates:', error);
                toast.dismiss(loadingToastId);
                toast.error(error.message || 'Error generating certificates');
            }
        }
    };
    
    /**
     * Download batch certificates as ZIP (PDF format)
     */
    async function downloadBatchCertificates(students, batch, loadingToastId) {
        try {
            // Check if JSZip is available
            if (typeof JSZip === 'undefined') {
                toast.dismiss(loadingToastId);
                toast.error('JSZip library not loaded. Downloading first certificate only.');
                downloadCurrentCertificate();
                return;
            }

            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined') {
                toast.dismiss(loadingToastId);
                toast.error('PDF library not loaded. Please refresh the page.');
                return;
            }
            
            const zip = new JSZip();
            const certFolder = zip.folder('certificates');
            const { jsPDF } = window.jspdf;
            
            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                const certData = buildCertificateData(student, batch);
                
                // Create temporary element for rendering
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '-9999px';
                tempContainer.innerHTML = await generateProfessionalCertificateHTML(student, certData);
                document.body.appendChild(tempContainer);
                
                // Get the certificate container (class is .certificate-container with id certificateElement)
                const certElement = tempContainer.querySelector('.certificate-container');
                
                // Add download-mode class to force full size rendering
                if (certElement) {
                    certElement.classList.add('download-mode');
                }
                
                // Wait for images to load
                const images = Array.from(tempContainer.querySelectorAll('img'));
                await Promise.all(images.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                }));
                
                // Render to canvas
                const canvas = await html2canvas(certElement, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    // Never use a transparent canvas background for JPEG/PDF exports.
                    // Transparent areas often render as black, and dark mode makes it more noticeable.
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: 1123,
                    height: 794,
                    windowWidth: 1123,
                    windowHeight: 794,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    onclone: function(clonedDoc) {
                        clonedDoc.documentElement.removeAttribute('data-theme');
                    }
                });
                
                // Calculate PDF dimensions from canvas to avoid gaps
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const pdfWidth = 297;
                const pdfHeight = (canvasHeight / canvasWidth) * pdfWidth;
                
                // Create PDF with custom dimensions
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight]
                });
                
                // Get image data from canvas
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                
                // Add image to PDF (full page, no gaps)
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                
                // Get PDF as blob and add to zip
                const pdfBlob = pdf.output('blob');
                const studentName = student.name.replace(/[^a-zA-Z0-9]/g, '_');
                certFolder.file(`Certificate_${studentName}_${student.studentId.substring(0, 8)}.pdf`, pdfBlob);
                
                // Cleanup
                document.body.removeChild(tempContainer);
            }
            
            // Generate and download ZIP
            const content = await zip.generateAsync({ type: 'blob' });
            const batchName = batch ? batch.batchName.replace(/[^a-zA-Z0-9]/g, '_') : 'Batch';
            saveAs(content, `Certificates_${batchName}_${Date.now()}.zip`);
            
            // Add to history
            const historyEntry = {
                date: new Date().toISOString(),
                type: `Certificate of Completion`,
                students: `${students.length} students (${batch ? batch.batchName : 'Batch'})`,
                count: students.length,
                generatedBy: 'Admin User'
            };
            generationHistory.unshift(historyEntry);
            saveHistory();
            updateHistoryTable();
            
            toast.dismiss(loadingToastId);
            toast.success(`${students.length} certificate PDFs downloaded successfully!`);
            
        } catch (error) {
            console.error('Error generating batch certificates:', error);
            toast.dismiss(loadingToastId);
            toast.error('Failed to generate batch certificates. Please try again.');
        }
    }

    /**
     * Download current certificate preview as PDF
     */
    window.downloadCurrentCertificate = function() {
        const element = document.getElementById('certificateElement');
        
        if (!element) {
            toast('Please preview the certificate first', { icon: '⚠️' });
            return;
        }

        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            toast.error('PDF library not loaded. Please refresh the page.');
            return;
        }

        toast('Generating HD certificate PDF...', { icon: '⬇️' });

        // Wait for images to load
        const images = Array.from(element.querySelectorAll('img'));
        const imagePromises = images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        Promise.all(imagePromises).then(() => {
            return new Promise(resolve => setTimeout(resolve, 200));
        }).then(() => {
            // Add download-mode class to force full size rendering (overrides media queries)
            element.classList.add('download-mode');
            
            return html2canvas(element, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                // Use a solid background so the exported JPEG/PDF never goes dark.
                // (JPEG doesn't support alpha; transparent pixels commonly become black.)
                backgroundColor: '#ffffff',
                logging: false,
                width: 1123,
                height: 794,
                windowWidth: 1123,
                windowHeight: 794,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                onclone: function(clonedDoc) {
                    clonedDoc.documentElement.removeAttribute('data-theme');
                }
            }).then(canvas => {
                // Remove download-mode class
                element.classList.remove('download-mode');
                return canvas;
            });
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            
            // Create PDF with custom dimensions matching certificate aspect ratio
            // Certificate is 1123x794px (aspect ratio 1.414:1)
            // Use custom page size to match exactly
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calculate PDF dimensions in mm (use 297mm width for A4-like size)
            const pdfWidth = 297;
            const pdfHeight = (canvasHeight / canvasWidth) * pdfWidth;
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            
            // Get image data from canvas
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Add image to PDF (full page, no gaps)
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
            // Generate filename and save
            const studentId = selectedCertStudent ? selectedCertStudent.studentId : 'certificate';
            const studentName = selectedCertStudent ? selectedCertStudent.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Student';
            pdf.save(`Certificate_${studentName}_${studentId.substring(0, 8)}.pdf`);
            
            toast.success('Certificate PDF downloaded successfully!');
        }).catch(err => {
            console.error('Error generating certificate PDF:', err);
            toast.error('Failed to generate certificate PDF. Please try again.');
        });
    };

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
        showConfirmationModal({
            title: 'Delete History Entry',
            message: 'Are you sure you want to delete this history entry?',
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                generationHistory.splice(index, 1);
                saveHistory();
                updateHistoryTable();
                toast.success('History entry deleted');
            }
        });
    };

    /**
     * Clear history
     */
    window.clearHistory = function() {
        showConfirmationModal({
            title: 'Clear Local History',
            message: 'Are you sure you want to clear all local generation history?',
            confirmText: 'Clear All',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                generationHistory = generationHistory.filter(h => h.source === 'database');
                saveHistory();
                updateHistoryTable();
                toast.success('Local history cleared successfully');
            }
        });
    };

    /**
     * Save history to localStorage
     */
    function saveHistory() {
        // Only save non-database entries to localStorage
        const localHistory = generationHistory.filter(h => h.source !== 'database');
        localStorage.setItem('documentGenerationHistory', JSON.stringify(localHistory));
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
     * Load history from database
     */
    window.loadHistoryFromDatabase = async function() {
        const tbody = document.getElementById('historyTableBody');
        
        // Show loading state
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted mt-2 mb-0">Loading history...</p>
                    </td>
                </tr>
            `;
        }
        
        try {
            // Load certificates
            const certResponse = await fetch(`${contextPath}/api/certificates/list?pageSize=100`);
            const certData = await certResponse.json();
            
            // Load ID cards
            const idCardResponse = await fetch(`${contextPath}/api/id-cards/list?pageSize=100`);
            const idCardData = await idCardResponse.json();
            
            // Combine and format history
            generationHistory = [];
            
            if (certData.certificates && Array.isArray(certData.certificates)) {
                certData.certificates.forEach(cert => {
                    // Look up student name from allStudents if not in certificate data
                    let studentName = cert.studentName;
                    if (!studentName && cert.studentId) {
                        const student = allStudents.find(s => s.studentId === cert.studentId);
                        if (student) {
                            studentName = student.name || student.studentName;
                        }
                    }
                    
                    generationHistory.push({
                        date: cert.generatedAt || cert.issueDate,
                        type: 'Certificate',
                        subType: cert.certificateType || 'completion',
                        studentId: cert.studentId,
                        studentName: studentName,
                        certificateId: cert.certificateId,
                        verificationToken: cert.verificationToken,
                        isRevoked: cert.isRevoked || cert.revoked || false,
                        docType: 'certificate'
                    });
                });
            }
            
            if (idCardData.idCards && Array.isArray(idCardData.idCards)) {
                idCardData.idCards.forEach(card => {
                    // Look up student name from allStudents if not in ID card data
                    let studentName = card.studentName;
                    if (!studentName && card.studentId) {
                        const student = allStudents.find(s => s.studentId === card.studentId);
                        if (student) {
                            studentName = student.name || student.studentName;
                        }
                    }
                    
                    generationHistory.push({
                        date: card.generatedAt || card.issueDate,
                        type: 'ID Card',
                        studentId: card.studentId,
                        studentName: studentName,
                        idCardId: card.idCardId,
                        verificationToken: card.verificationToken,
                        isActive: card.isActive !== undefined ? card.isActive : (card.active !== undefined ? card.active : true),
                        validUntil: card.validUntil,
                        docType: 'id-card'
                    });
                });
            }
            
            // Sort by date descending
            generationHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            updateHistoryTable();
            
        } catch (error) {
            console.error('Error loading history from database:', error);
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-danger">
                            <i class="bi bi-exclamation-circle" style="font-size: 2rem;"></i>
                            <p class="mt-2 mb-0">Failed to load history</p>
                        </td>
                    </tr>
                `;
            }
        }
    };

    /**
     * Update history table
     */
    function updateHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        const emptyState = document.getElementById('historyEmptyState');
        const tableContainer = document.getElementById('historyTableContainer');
        
        if (!tbody) return;

        if (generationHistory.length === 0) {
            // Show empty state, hide table
            if (emptyState) emptyState.style.display = '';
            if (tableContainer) tableContainer.style.display = 'none';
            tbody.innerHTML = '';
            updateBulkDeleteButton();
            return;
        }
        
        // Hide empty state, show table
        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = '';

        tbody.innerHTML = generationHistory.map(entry => {
            const dateStr = formatDateTime(entry.date);
            const docId = entry.certificateId || entry.idCardId;
            
            // Type badge with icon
            let typeDisplay = entry.type;
            let typeIcon = 'bi-award';
            let typeBadgeClass = 'type-badge-certificate';
            
            if (entry.docType === 'id-card') {
                typeIcon = 'bi-person-badge';
                typeBadgeClass = 'type-badge-idcard';
            }
            
            if (entry.subType) {
                typeDisplay = `${entry.type} (${entry.subType.charAt(0).toUpperCase() + entry.subType.slice(1)})`;
            }
            
            // Status badge with matching styles to all-students.jsp
            let statusBadge = '<span class="badge status-active">Active</span>';
            if (entry.isRevoked) {
                statusBadge = '<span class="badge status-revoked">Revoked</span>';
            } else if (entry.isActive === false) {
                statusBadge = '<span class="badge status-inactive">Inactive</span>';
            }
            
            // Build actions based on document type and status - matching all-students.jsp btn-group style
            let actions = '<div class="btn-group" role="group">';
            
            // Download button - always available
            if (entry.docType === 'certificate') {
                actions += `<button type="button" class="btn btn-sm download-btn" onclick="downloadCertificateFromHistory('${entry.certificateId}', '${entry.studentId || ''}', '${entry.subType || 'completion'}')" title="Download PDF">
                    <i class="bi bi-download"></i>
                </button>`;
            } else if (entry.docType === 'id-card') {
                actions += `<button type="button" class="btn btn-sm download-btn" onclick="downloadIdCardFromHistory('${entry.idCardId}', '${entry.studentId || ''}')" title="Download PDF">
                    <i class="bi bi-download"></i>
                </button>`;
            }
            
            // Verify button - if token exists
            if (entry.verificationToken) {
                const verifyPath = entry.docType === 'id-card' ? 'id' : 'certificate';
                actions += `<a href="${contextPath}/verify/${verifyPath}/${entry.verificationToken}" 
                    target="_blank" class="btn btn-sm verify-btn" title="Verify">
                    <i class="bi bi-patch-check"></i>
                </a>`;
            }
            
            // Revoke/Restore button for certificates, Activate/Deactivate for ID cards
            if (entry.docType === 'certificate') {
                if (entry.isRevoked) {
                    // Show Restore button for revoked certificates
                    actions += `<button type="button" class="btn btn-sm restore-btn" onclick="restoreCertificate('${entry.certificateId}')" title="Restore Certificate">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>`;
                } else {
                    // Show Revoke button for active certificates
                    actions += `<button type="button" class="btn btn-sm revoke-btn" onclick="revokeCertificate('${entry.certificateId}')" title="Revoke Certificate">
                        <i class="bi bi-x-circle"></i>
                    </button>`;
                }
                // Delete button for certificates
                actions += `<button type="button" class="btn btn-sm delete-btn" onclick="deleteCertificate('${entry.certificateId}')" title="Delete Certificate">
                    <i class="bi bi-trash"></i>
                </button>`;
            } else if (entry.docType === 'id-card') {
                if (entry.isActive === false) {
                    // Show Activate button for inactive ID cards
                    actions += `<button type="button" class="btn btn-sm restore-btn" onclick="activateIdCard('${entry.idCardId}')" title="Activate ID Card">
                        <i class="bi bi-play-circle"></i>
                    </button>`;
                } else {
                    // Show Deactivate button for active ID cards
                    actions += `<button type="button" class="btn btn-sm revoke-btn" onclick="deactivateIdCard('${entry.idCardId}')" title="Deactivate ID Card">
                        <i class="bi bi-pause-circle"></i>
                    </button>`;
                }
                // Delete button for ID cards
                actions += `<button type="button" class="btn btn-sm delete-btn" onclick="deleteIdCard('${entry.idCardId}')" title="Delete ID Card">
                    <i class="bi bi-trash"></i>
                </button>`;
            }
            
            actions += '</div>';
            
            return `
                <tr data-doc-type="${entry.docType}" data-doc-id="${docId}">
                    <td>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input history-checkbox" value="${docId}" data-doc-type="${entry.docType}">
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-calendar3 text-muted"></i>
                            <span>${escapeHtml(dateStr)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="type-badge ${typeBadgeClass}">
                            <i class="bi ${typeIcon}"></i> ${escapeHtml(typeDisplay)}
                        </span>
                    </td>
                    <td>
                        <div class="student-info">
                            <span class="student-name-text">${escapeHtml(entry.studentName || (entry.studentId ? 'ID: ' + entry.studentId.substring(0, 8) + '...' : '-'))}</span>
                        </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${actions}</td>
                </tr>
            `;
        }).join('');
        
        // Setup checkbox event listeners
        setupHistoryCheckboxListeners();
        updateBulkDeleteButton();
    }
    
    /**
     * Setup checkbox event listeners for history table
     */
    function setupHistoryCheckboxListeners() {
        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAllHistory');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.history-checkbox');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                    const row = cb.closest('tr');
                    if (row) {
                        row.classList.toggle('row-selected', this.checked);
                    }
                });
                updateBulkDeleteButton();
            });
        }
        
        // Individual checkboxes
        const checkboxes = document.querySelectorAll('.history-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const row = this.closest('tr');
                if (row) {
                    row.classList.toggle('row-selected', this.checked);
                }
                
                // Update select all checkbox state
                const allChecked = document.querySelectorAll('.history-checkbox:checked').length === checkboxes.length;
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = allChecked;
                }
                
                updateBulkDeleteButton();
            });
        });
    }
    
    /**
     * Update bulk delete button visibility and count
     */
    function updateBulkDeleteButton() {
        const selectedCount = document.querySelectorAll('.history-checkbox:checked').length;
        const bulkDeleteBtn = document.getElementById('bulkDeleteHistoryBtn');
        const countSpan = document.getElementById('selectedHistoryCount');
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.style.display = selectedCount > 0 ? '' : 'none';
        }
        if (countSpan) {
            countSpan.textContent = selectedCount;
        }
    }
    
    /**
     * Bulk delete selected history items
     */
    window.bulkDeleteHistory = async function() {
        const selectedCheckboxes = document.querySelectorAll('.history-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            toast('No items selected', { icon: '⚠️' });
            return;
        }
        
        const count = selectedCheckboxes.length;
        
        showConfirmationModal({
            title: 'Delete Selected Items',
            message: `Are you sure you want to permanently delete ${count} selected item(s)? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: function() {
                performBulkDelete(selectedCheckboxes);
            }
        });
    };
    
    /**
     * Perform the actual bulk delete operation
     */
    async function performBulkDelete(selectedCheckboxes) {
        const loadingToastId = toast.loading(`Deleting ${selectedCheckboxes.length} items...`);
        
        // Group by document type
        const certificates = [];
        const idCards = [];
        
        selectedCheckboxes.forEach(cb => {
            const docType = cb.getAttribute('data-doc-type');
            const docId = cb.value;
            
            if (docType === 'certificate') {
                certificates.push(docId);
            } else if (docType === 'id-card') {
                idCards.push(docId);
            }
        });
        
        let successCount = 0;
        let errorCount = 0;
        
        try {
            // Delete certificates
            for (const certId of certificates) {
                try {
                    const response = await fetch(`${contextPath}/api/certificates/delete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `certificateId=${encodeURIComponent(certId)}`
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (e) {
                    errorCount++;
                }
            }
            
            // Delete ID cards
            for (const idCardId of idCards) {
                try {
                    const response = await fetch(`${contextPath}/api/id-cards/delete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `idCardId=${encodeURIComponent(idCardId)}`
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (e) {
                    errorCount++;
                }
            }
            
            toast.dismiss(loadingToastId);
            
            if (errorCount === 0) {
                toast.success(`Successfully deleted ${successCount} item(s)`);
            } else {
                toast(`Deleted ${successCount} items, ${errorCount} failed`, { icon: '⚠️' });
            }
            
            // Reset select all checkbox
            const selectAllCheckbox = document.getElementById('selectAllHistory');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
            
            // Reload history
            loadHistoryFromDatabase();
            
        } catch (error) {
            console.error('Error during bulk delete:', error);
            toast.dismiss(loadingToastId);
            toast.error('Error deleting items');
        }
    };

    /**
     * Revoke a certificate
     */
    window.revokeCertificate = async function(certificateId) {
        showConfirmationModal({
            title: 'Revoke Certificate',
            message: 'Are you sure you want to revoke this certificate?<br><br>The certificate will be marked as invalid and cannot be verified.',
            confirmText: 'Revoke',
            confirmClass: 'btn-warning',
            icon: 'bi-x-circle text-warning',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/certificates/revoke`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `certificateId=${encodeURIComponent(certificateId)}&reason=Revoked by administrator`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('Certificate revoked successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to revoke certificate');
                    }
                } catch (error) {
                    console.error('Error revoking certificate:', error);
                    toast.error('Error revoking certificate');
                }
            }
        });
    };

    /**
     * Restore (un-revoke) a certificate
     */
    window.restoreCertificate = async function(certificateId) {
        showConfirmationModal({
            title: 'Restore Certificate',
            message: 'Are you sure you want to restore this certificate?<br><br>The certificate will be active again and can be verified.',
            confirmText: 'Restore',
            confirmClass: 'btn-success',
            icon: 'bi-arrow-counterclockwise text-success',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/certificates/restore`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `certificateId=${encodeURIComponent(certificateId)}`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('Certificate restored successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to restore certificate');
                    }
                } catch (error) {
                    console.error('Error restoring certificate:', error);
                    toast.error('Error restoring certificate');
                }
            }
        });
    };

    /**
     * Deactivate an ID card
     */
    window.deactivateIdCard = async function(idCardId) {
        showConfirmationModal({
            title: 'Deactivate ID Card',
            message: 'Are you sure you want to deactivate this ID card?<br><br>The ID card will be marked as inactive.',
            confirmText: 'Deactivate',
            confirmClass: 'btn-warning',
            icon: 'bi-pause-circle text-warning',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/id-cards/deactivate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `idCardId=${encodeURIComponent(idCardId)}&reason=Deactivated by administrator`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('ID Card deactivated successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to deactivate ID card');
                    }
                } catch (error) {
                    console.error('Error deactivating ID card:', error);
                    toast.error('Error deactivating ID card');
                }
            }
        });
    };

    /**
     * Activate (reactivate) an ID card
     */
    window.activateIdCard = async function(idCardId) {
        showConfirmationModal({
            title: 'Activate ID Card',
            message: 'Are you sure you want to activate this ID card?<br><br>The ID card will become active again.',
            confirmText: 'Activate',
            confirmClass: 'btn-success',
            icon: 'bi-play-circle text-success',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/id-cards/activate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `idCardId=${encodeURIComponent(idCardId)}`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('ID Card activated successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to activate ID card');
                    }
                } catch (error) {
                    console.error('Error activating ID card:', error);
                    toast.error('Error activating ID card');
                }
            }
        });
    };

    /**
     * Refresh data
     */
    window.refreshData = function() {
        const loadingToastId = toast.loading('Refreshing data...');
        
        // Refresh students and batches
        fetchStudents();
        fetchBatches();
        
        setTimeout(() => {
            loadHistory();
            toast.dismiss(loadingToastId);
            toast.success('Data refreshed successfully');
        }, 500);
    };

    /**
     * Download certificate from history - creates temporary preview and downloads
     */
    window.downloadCertificateFromHistory = async function(certificateId, studentId, certType) {
        toast.info('Preparing certificate for download...');
        
        // First, fetch the certificate details from backend to get the actual certificate ID
        let certDetails = null;
        try {
            const response = await fetch(`${contextPath}/api/certificates/get?certificateId=${encodeURIComponent(certificateId)}`);
            if (response.ok) {
                certDetails = await response.json();
            }
        } catch (e) {
            console.error('Error fetching certificate:', e);
        }
        
        // Find the student in allStudents by studentId
        let student = null;
        const actualStudentId = certDetails?.studentId || studentId;
        
        if (actualStudentId) {
            student = allStudents.find(s => s.studentId === actualStudentId);
        }
        
        if (!student) {
            toast.error('Student details not found. Please refresh the page and try again.');
            return;
        }
        
        // Set global variables for download function
        selectedCertStudent = student;
        
        // Create a temporary hidden container for rendering
        let tempContainer = document.getElementById('tempCertDownloadContainer');
        if (!tempContainer) {
            tempContainer = document.createElement('div');
            tempContainer.id = 'tempCertDownloadContainer';
            // Position off-screen but with proper dimensions (visibility hidden allows layout calculation)
            tempContainer.style.cssText = 'position: absolute; left: -9999px; top: 0; visibility: hidden; width: 1123px;';
            document.body.appendChild(tempContainer);
        }
        
        // Get batch info for certificate
        const batch = allBatches.find(b => b.batchId === student.batchId);
        
        // Build certificate data with the specific certificate type from history
        const certData = buildCertificateData(student, batch, certType || certDetails?.certificateType || 'completion');
        
        // Add the actual certificate ID and verification token from database
        if (certDetails) {
            certData.certificateId = certDetails.certificateId;
            certData.verificationToken = certDetails.verificationToken;
        }
        
        // Generate certificate HTML
        tempContainer.innerHTML = await generateProfessionalCertificateHTML(student, certData);
        
        // Make temporarily visible for proper rendering (off-screen)
        tempContainer.style.visibility = 'visible';
        
        // Wait for render and images
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const element = tempContainer.querySelector('#certificateElement') || tempContainer.querySelector('.certificate-container');
        
        if (!element) {
            toast.error('Failed to generate certificate preview.');
            return;
        }
        
        // Download using html2canvas
        try {
            // Add download-mode class to force full size rendering (overrides media queries)
            element.classList.add('download-mode');
            
            // Wait for images to load
            const images = Array.from(element.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Certificate is fixed at 1123x794
            const certWidth = 1123;
            const certHeight = 794;
            
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: certWidth,
                height: certHeight,
                windowWidth: certWidth,
                windowHeight: certHeight,
                onclone: function(clonedDoc) {
                    clonedDoc.documentElement.removeAttribute('data-theme');
                }
            });
            
            // Remove download-mode class
            element.classList.remove('download-mode');
            
            const { jsPDF } = window.jspdf;
            
            // A4 landscape: 297mm x 210mm (maintain certificate aspect ratio)
            const pdfWidth = 297;
            const pdfHeight = 210;
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
            const studentName = (student.studentName || student.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
            pdf.save(`Certificate_${studentName}_${student.studentId.substring(0, 8)}.pdf`);
            
            toast.success('Certificate PDF downloaded successfully!');
        } catch (err) {
            console.error('Error generating certificate PDF:', err);
            toast.error('Failed to generate certificate PDF. Please try again.');
        }
    };

    /**
     * Download ID card from history - creates temporary preview and downloads
     */
    window.downloadIdCardFromHistory = async function(idCardId, studentId) {
        toast.info('Preparing ID card for download...');
        
        // Find the student in allStudents by studentId
        let student = null;
        
        if (studentId) {
            student = allStudents.find(s => s.studentId === studentId);
        }
        
        if (!student) {
            // Try fetching the ID card details to get student ID
            try {
                const response = await fetch(`${contextPath}/api/id-cards/get?idCardId=${encodeURIComponent(idCardId)}`);
                const idCard = await response.json();
                if (idCard && idCard.studentId) {
                    student = allStudents.find(s => s.studentId === idCard.studentId);
                }
            } catch (e) {
                console.error('Error fetching ID card:', e);
            }
        }
        
        if (!student) {
            toast.error('Student details not found. Please refresh the page and try again.');
            return;
        }
        
        // Create a temporary hidden container for rendering
        let tempContainer = document.getElementById('tempIdCardDownloadContainer');
        if (!tempContainer) {
            tempContainer = document.createElement('div');
            tempContainer.id = 'tempIdCardDownloadContainer';
            // Position off-screen but with proper dimensions
            tempContainer.style.cssText = 'position: absolute; left: -9999px; top: 0; visibility: hidden;';
            document.body.appendChild(tempContainer);
        }
        
        // Generate ID card HTML
        tempContainer.innerHTML = await generateIdCardHTML(student, true);
        
        // Make temporarily visible for proper rendering (off-screen)
        tempContainer.style.visibility = 'visible';
        
        // Wait for render and images
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const element = tempContainer.querySelector('.id-card-modern');
        
        if (!element) {
            toast.error('Failed to generate ID card preview.');
            return;
        }
        
        // Download using html2canvas
        try {
            // Add download-mode class to disable animations
            element.classList.add('download-mode');
            
            // Preload all images including background images
            const images = Array.from(element.querySelectorAll('img'));
            const imgPromises = images.map(img => {
                if (img.complete && img.naturalWidth > 0) {
                    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
                }
                return new Promise(resolve => {
                    img.onload = () => {
                        if (img.decode) img.decode().then(resolve).catch(resolve);
                        else resolve();
                    };
                    img.onerror = resolve;
                });
            });
            
            // Preload background images (legacy support)
            const bgElements = Array.from(element.querySelectorAll('[style*="background-image"]'));
            const bgPromises = bgElements.map(el => {
                const style = el.style.backgroundImage;
                const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (!urlMatch) return Promise.resolve();
                
                return new Promise(resolve => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = urlMatch[1];
                });
            });
            
            await Promise.all([...imgPromises, ...bgPromises]);
            
            // Calculate aspect ratios from the original loaded images
            const originalPhotoImg = element.querySelector('.photo-img');
            let photoAspect = 1; // Default to square
            if (originalPhotoImg && originalPhotoImg.naturalWidth && originalPhotoImg.naturalHeight) {
                photoAspect = originalPhotoImg.naturalWidth / originalPhotoImg.naturalHeight;
            }
            
            // Helper to fix object-fit for html2canvas
            const fixObjectFit = (element, aspect) => {
                const images = element.querySelectorAll('.photo-img');
                images.forEach(img => {
                    // Use the pre-calculated aspect ratio
                    // Container is square (1:1)
                    if (aspect >= 1) {
                        // Landscape or Square
                        img.style.width = 'auto';
                        img.style.height = '100%';
                        img.style.minWidth = '100%';
                        img.style.maxWidth = 'none';
                    } else {
                        // Portrait
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.minHeight = '100%';
                        img.style.maxHeight = 'none';
                    }
                    // Disable object-fit so html2canvas uses the explicit dimensions
                    img.style.objectFit = 'none'; 
                });
            };
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const canvas = await html2canvas(element, {
                scale: 5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 340,
                height: 540,
                windowWidth: 340,
                windowHeight: 540,
                imageTimeout: 15000,
                onclone: function(clonedDoc) {
                    clonedDoc.documentElement.removeAttribute('data-theme');
                    const clonedElement = clonedDoc.querySelector('.id-card-modern');
                    if (clonedElement) {
                        fixObjectFit(clonedElement, photoAspect);
                    }
                }
            });
            
            const link = document.createElement('a');
            const studentName = (student.studentName || student.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
            link.download = `ID_Card_${studentName}_${student.studentId.substring(0, 8)}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('ID Card image downloaded successfully!');
        } catch (err) {
            console.error('Error generating ID card image:', err);
            toast.error('Failed to generate ID card image. Please try again.');
        }
    };

    /**
     * Delete a certificate
     */
    window.deleteCertificate = async function(certificateId) {
        showConfirmationModal({
            title: 'Delete Certificate',
            message: 'Are you sure you want to permanently delete this certificate? This action cannot be undone.',
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/certificates/delete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `certificateId=${encodeURIComponent(certificateId)}`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('Certificate deleted successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to delete certificate');
                    }
                } catch (error) {
                    console.error('Error deleting certificate:', error);
                    toast.error('Error deleting certificate');
                }
            }
        });
    };

    /**
     * Delete an ID card
     */
    window.deleteIdCard = async function(idCardId) {
        showConfirmationModal({
            title: 'Delete ID Card',
            message: 'Are you sure you want to permanently delete this ID card? This action cannot be undone.',
            confirmText: 'Delete',
            confirmClass: 'btn-danger',
            icon: 'bi-trash text-danger',
            onConfirm: async function() {
                try {
                    const response = await fetch(`${contextPath}/api/id-cards/delete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `idCardId=${encodeURIComponent(idCardId)}`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.success('ID Card deleted successfully');
                        loadHistoryFromDatabase();
                    } else {
                        toast.error(result.message || 'Failed to delete ID card');
                    }
                } catch (error) {
                    console.error('Error deleting ID card:', error);
                    toast.error('Error deleting ID card');
                }
            }
        });
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
