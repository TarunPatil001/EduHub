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
    let generationHistory = [];
    let allStudents = []; // To store fetched students
    let allBatches = []; // To store fetched batches

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadHistory();
        initializeDatePicker();
        fetchBatches(); // Fetch batches
        fetchStudents(); // Fetch real data
        
        // Add event listeners for batch selection to auto-preview
        const batchSelect = document.getElementById('idBatchSelect');
        if (batchSelect) {
            batchSelect.addEventListener('change', previewIdCard);
        }
    });

    /**
     * Fetch students from backend
     */
    function fetchStudents() {
        // Use the existing list API
        fetch(`${contextPath}/api/students/list`)
            .then(response => response.json())
            .then(data => {
                // The API returns { totalCount: ..., students: [...] }
                if (data.students && Array.isArray(data.students)) {
                    allStudents = data.students.map(s => ({
                        studentId: s.studentId,
                        name: `${s.studentName || ''} ${s.fatherName || ''} ${s.surname || ''}`.trim().replace(/\s+/g, ' '),
                        department: s.branchId || s.courseId || 'General',
                        batch: s.batchId || '2024',
                        profilePhotoUrl: s.profilePhotoUrl
                    }));
                    
                    // Batch dropdown is now populated separately via fetchBatches
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
     * Fetch batches from backend
     */
    function fetchBatches() {
        fetch(`${contextPath}/api/batches/list`)
            .then(response => response.json())
            .then(data => {
                if (data.batches && Array.isArray(data.batches)) {
                    allBatches = data.batches;
                    populateBatchDropdown();
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
     * Select student for certificate
     */
    window.selectStudentForCert = function(studentId) {
        selectedStudent = allStudents.find(s => s.studentId === studentId);
        if (selectedStudent) {
            const searchInput = document.getElementById('certStudentSearch');
            const resultsDiv = document.getElementById('certStudentResults');
            
            searchInput.value = `${selectedStudent.name}`;
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('search-suggestions');
        }
    };

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
            const container = previewDiv.querySelector('.id-card-container');
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
            let html = '<div class="id-card-container batch-preview">';
            for (const student of batchStudents) {
                // We extract the inner HTML of the card to avoid nested containers
                const cardHTML = await generateIdCardHTML(student, true);
                // Extract just the .id-card part
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cardHTML;
                const cardElement = tempDiv.querySelector('.id-card');
                if (cardElement) {
                    // Add data attribute for identification
                    cardElement.setAttribute('data-student-id', student.studentId);
                    html += cardElement.outerHTML;
                }
            }
            html += '</div>';
            previewDiv.innerHTML = html;
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
     * Generate ID card HTML with secure QR code
     */
    async function generateIdCardHTML(student, includePhoto) {
        const validUntil = new Date();
        validUntil.setFullYear(validUntil.getFullYear() + 1);
        
        const role = "STUDENT"; // Or derive from department e.g. "ENGINEER"

        // Use global contextPath defined in JSP, fallback to empty string if undefined
        const ctx = (typeof contextPath !== 'undefined') ? contextPath : '';
        
        // Generate secure token for QR code
        let verifyUrl;
        try {
            const response = await fetch(`${ctx}/api/generate-qr-token?studentId=${encodeURIComponent(student.studentId)}`);
            if (response.ok) {
                verifyUrl = await response.text();
            } else {
                // Fallback to plain ID if token generation fails
                console.warn('Token generation failed, using plain ID');
                verifyUrl = `${window.location.origin}${ctx}/verify-id/${student.studentId}`;
            }
        } catch (error) {
            console.error('Error generating secure token:', error);
            verifyUrl = `${window.location.origin}${ctx}/verify-id/${student.studentId}`;
        }
        
        // QR Code Generation using external API
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
        
        // Get Institute Name and generate Google-style colored text
        const instName = (typeof instituteName !== 'undefined' && instituteName) ? instituteName : 'EduHub';
        const colors = ['g-blue', 'g-red', 'g-yellow', 'g-green'];
        let logoHtml = '';
        let colorIndex = 0;
        for (let i = 0; i < instName.length; i++) {
            const char = instName[i];
            if (char === ' ') {
                logoHtml += '&nbsp;';
                continue;
            }
            logoHtml += `<span class="${colors[colorIndex]}">${char}</span>`;
            colorIndex = (colorIndex + 1) % colors.length;
        }

        return `
            <div class="id-card-container">
                <div class="id-card" id="idCardElement" data-student-id="${student.studentId}">
                    <!-- Decorative Strip -->
                    <div class="id-card-strip"></div>

                    <!-- Google Style Logo -->
                    <div class="google-logo">
                        ${logoHtml}
                    </div>

                    <!-- Photo -->
                    <div class="student-photo-container">
                        ${includePhoto ? (student.profilePhotoUrl ? `
                        <div class="student-photo-bg" style="background-image: url('${student.profilePhotoUrl}');"></div>
                        <!-- Hidden img for preloading and error handling -->
                        <img src="${student.profilePhotoUrl}" style="display:none;" crossorigin="anonymous" 
                            onerror="this.parentElement.innerHTML='<div class=\'photo-placeholder\'><i class=\'bi bi-person-fill\'></i></div>'">
                        ` : `
                        <div class="photo-placeholder">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        `) : ''}
                    </div>

                    <!-- Name & Role -->
                    <div class="student-details-main">
                        <h2 class="student-name-large">${student.name}</h2>
                        <p class="student-role-large">${role}</p>
                    </div>

                    <!-- Footer -->
                    <div class="id-card-footer">
                        <div class="qr-code-section">
                            <img src="${qrCodeUrl}" class="qr-code-img" alt="QR Code" crossorigin="anonymous">
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
                studentsToGenerate = allStudents.filter(s => {
                    return (batch === '' || s.batch === batch);
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

        // Direct generation without delay
        try {
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
            
            // Ensure preview exists for download
            // For batch, we need to make sure the preview is showing the batch
            if (selectionType === 'batch') {
                previewIdCard();
            } else if (!document.querySelector('.id-card')) {
                previewIdCard();
            }

            // Small delay to ensure DOM is updated if preview was just called
            setTimeout(() => {
                downloadIdCards(studentsToGenerate);
            }, 500); // Increased delay for batch rendering

        } catch (error) {
            console.error(error);
            toast.error('Error generating ID cards');
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
        const element = document.querySelector('.id-card');
        console.log('Found ID card element:', element);
        
        if (!element) {
            console.warn('ID card element not found in DOM');
            toast('Please preview the ID card first', { icon: '⚠️' });
            return;
        }

        toast('Downloading HD Image...', { icon: '⬇️' });

        // Wait for images to load (same logic as batch)
        const images = Array.from(element.querySelectorAll('img'));
        const imagePromises = images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        Promise.all(imagePromises).then(() => {
            // Small delay to ensure rendering
            return new Promise(resolve => setTimeout(resolve, 100));
        }).then(() => {
            console.log('Calling html2canvas...');
            return html2canvas(element, {
                scale: 4,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true
            });
        }).then(canvas => {
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
        const elements = document.querySelectorAll('.id-card');
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

        // Helper to process each card
        const processCard = (element, index) => {
            console.log('Processing card', index);

            // 1. Wait for images to load
            const images = Array.from(element.querySelectorAll('img'));
            const imagePromises = images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve; // Proceed even if image fails
                });
            });

            return Promise.all(imagePromises).then(() => {
                // 2. Small delay to ensure rendering is complete
                return new Promise(resolve => setTimeout(resolve, 100));
            }).then(() => {
                // 3. Capture
                return html2canvas(element, {
                    scale: 4,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false
                });
            }).then(canvas => {
                // 4. Convert to blob and add to ZIP
                return new Promise((resolve) => {
                    canvas.toBlob(blob => {
                        const studentId = element.getAttribute('data-student-id') || `student_${index}`;
                        console.log('Card processed:', studentId);
                        folder.file(`ID_Card_${studentId}.png`, blob);
                        processedCount++;
                        resolve();
                    });
                });
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
     * Preview certificate
     */
    window.previewCertificate = function() {
        const selectionType = document.getElementById('certificateSelectionType').value;
        
        if (selectionType === 'single' && !selectedStudent) {
            toast('Please select a student first', { icon: '⚠️' });
            return;
        }

        const student = selectedStudent || allStudents[0];
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
                                <small>Certificate ID: CERT-${student.studentId}-${Date.now().toString().slice(-6)}</small>
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
            count = allStudents.length;
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
            ? `Certificate_${selectedStudent.studentId}.pdf`
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
