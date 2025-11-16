<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/ui_component/head.jsp">
        <jsp:param name="title" value="Add Staff - Dashboard - EduHub"/>
        <jsp:param name="description" value="Add new staff member in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <style>
        .add-staff-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .form-section {
            background: #fff;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .form-section-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .form-section-header .icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            margin-right: 1rem;
        }
        
        .form-section-header .title {
            flex: 1;
        }
        
        .form-section-header h5 {
            margin: 0;
            color: #212529;
            font-weight: 600;
        }
        
        .form-section-header p {
            margin: 0;
            color: #6c757d;
            font-size: 0.875rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 0;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #212529;
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        .form-group label i {
            margin-right: 0.5rem;
            color: #0D6EFD;
        }
        
        .form-group label .required {
            color: #DC3545;
            margin-left: 0.25rem;
        }
        
        .form-control, .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #0D6EFD;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
            outline: none;
        }
        
        .form-control:disabled, .form-select:disabled {
            background-color: #e9ecef;
        }
        
        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }
        
        .file-upload-wrapper {
            position: relative;
            width: 100%;
        }
        
        .file-upload-input {
            opacity: 0;
            position: absolute;
            z-index: -1;
        }
        
        .file-upload-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
            min-height: 180px;
            height: 180px;
        }
        
        .file-upload-label:hover {
            border-color: #0D6EFD;
            background-color: #e7f1ff;
        }
        
        .file-upload-label i {
            font-size: 2rem;
            color: #0D6EFD;
            margin-bottom: 0.5rem;
            display: block;
            text-align: center;
        }
        
        .file-upload-text {
            text-align: center;
            width: 100%;
            display: block;
        }
        
        .file-upload-text strong {
            display: block;
            color: #212529;
            margin-bottom: 0.25rem;
            text-align: center;
            width: 100%;
        }
        
        .file-upload-text small {
            color: #6c757d;
            display: block;
            text-align: center;
            width: 100%;
        }
        
        /* Photo Upload Label - Special styling for photo preview */
        .photo-preview-box {
            display: none;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 80px;
            margin-bottom: 0.5rem;
        }
        
        .photo-preview-box.show {
            display: flex;
        }
        
        .photo-preview-box img {
            max-width: 80px;
            max-height: 80px;
            width: auto;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .file-upload-label.has-photo {
            border-color: #198754 !important;
            background-color: #d1e7dd !important;
        }
        
        .file-upload-label.has-photo #photoUploadIcon {
            display: none;
        }
        
        .file-name-display {
            display: block;
            margin-top: 0.5rem;
            color: #198754;
            font-size: 0.875rem;
        }
        
        .file-name-display i {
            margin-right: 0.25rem;
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 2px solid #f0f0f0;
        }
        
        /* Use Bootstrap buttons - no custom styles needed */
        

        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .form-section {
                padding: 1.5rem;
            }
            
            .form-actions {
                flex-direction: column-reverse;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/ui_component/sidebar.jsp">
            <jsp:param name="activePage" value="add-staff"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/ui_component/header.jsp">
                <jsp:param name="pageTitle" value="Add Staff"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Add New Staff Member</h2>
                        <p>Register a new staff member in the system</p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/ui_component/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp"/>
                            <jsp:param name="text" value="Back to Staff"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="add-staff-container">
                    <form id="addStaffForm" action="${pageContext.request.contextPath}/staff/add" method="post" enctype="multipart/form-data">
                        
                        <!-- Personal Information Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-person"></i>
                                </div>
                                <div class="title">
                                    <h5>Personal Information</h5>
                                    <p>Basic details of the staff member</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">
                                        <i class="bi bi-person-fill"></i>First Name<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="firstName" name="firstName" required placeholder="Enter first name">
                                </div>
                                
                                <div class="form-group">
                                    <label for="lastName">
                                        <i class="bi bi-person-fill"></i>Last Name<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="lastName" name="lastName" required placeholder="Enter last name">
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">
                                        <i class="bi bi-envelope-fill"></i>Email Address<span class="required">*</span>
                                    </label>
                                    <input type="email" class="form-control" id="email" name="email" required placeholder="staff@example.com">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone">
                                        <i class="bi bi-telephone-fill"></i>Phone Number<span class="required">*</span>
                                    </label>
                                    <input type="tel" class="form-control" id="phone" name="phone" required placeholder="+1 (555) 123-4567">
                                </div>
                                
                                <div class="form-group">
                                    <label for="dateOfBirth">
                                        <i class="bi bi-calendar-fill"></i>Date of Birth<span class="required">*</span>
                                    </label>
                                    <input type="date" class="form-control" id="dateOfBirth" name="dateOfBirth" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="gender">
                                        <i class="bi bi-gender-ambiguous"></i>Gender<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="gender" name="gender" required>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nationality">
                                        <i class="bi bi-flag-fill"></i>Nationality
                                    </label>
                                    <input type="text" class="form-control" id="nationality" name="nationality" placeholder="Enter nationality">
                                </div>
                                
                                <div class="form-group">
                                    <label for="bloodGroup">
                                        <i class="bi bi-heart-pulse-fill"></i>Blood Group
                                    </label>
                                    <select class="form-select" id="bloodGroup" name="bloodGroup">
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="maritalStatus">
                                        <i class="bi bi-people-fill"></i>Marital Status
                                    </label>
                                    <select class="form-select" id="maritalStatus" name="maritalStatus">
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Employment Information Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-briefcase"></i>
                                </div>
                                <div class="title">
                                    <h5>Employment Information</h5>
                                    <p>Job role and department details</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employeeId">
                                        <i class="bi bi-badge-tm-fill"></i>Employee ID<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="employeeId" name="employeeId" required placeholder="EMP-001">
                                </div>
                                
                                <div class="form-group">
                                    <label for="role">
                                        <i class="bi bi-person-badge-fill"></i>Role/Position<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="role" name="role" required>
                                        <option value="">Select Role</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="HR">HR Manager</option>
                                        <option value="Placement Coordinator">Placement Coordinator</option>
                                        <option value="Accountant">Accountant</option>
                                        <option value="Librarian">Librarian</option>
                                        <option value="Lab Assistant">Lab Assistant</option>
                                        <option value="Support Staff">Support Staff</option>
                                        <option value="Administrative Officer">Administrative Officer</option>
                                        <option value="IT Support">IT Support</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="department">
                                        <i class="bi bi-building"></i>Department<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="department" name="department" required>
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Human Resources">Human Resources</option>
                                        <option value="Accounts">Accounts</option>
                                        <option value="Library">Library</option>
                                        <option value="Placement">Placement</option>
                                        <option value="IT Support">IT Support</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="joiningDate">
                                        <i class="bi bi-calendar-check-fill"></i>Joining Date<span class="required">*</span>
                                    </label>
                                    <input type="date" class="form-control" id="joiningDate" name="joiningDate" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="employmentType">
                                        <i class="bi bi-clock-fill"></i>Employment Type<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="employmentType" name="employmentType" required>
                                        <option value="">Select Type</option>
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Temporary">Temporary</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="salary">
                                        <i class="bi bi-currency-dollar"></i>Monthly Salary<span class="required">*</span>
                                    </label>
                                    <input type="number" class="form-control" id="salary" name="salary" required placeholder="5000" min="0" step="0.01">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="workShift">
                                        <i class="bi bi-clock-history"></i>Work Shift
                                    </label>
                                    <select class="form-select" id="workShift" name="workShift">
                                        <option value="">Select Shift</option>
                                        <option value="Morning">Morning (6 AM - 2 PM)</option>
                                        <option value="Day">Day (9 AM - 5 PM)</option>
                                        <option value="Evening">Evening (2 PM - 10 PM)</option>
                                        <option value="Night">Night (10 PM - 6 AM)</option>
                                        <option value="Flexible">Flexible</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="reportingManager">
                                        <i class="bi bi-person-lines-fill"></i>Reporting Manager
                                    </label>
                                    <input type="text" class="form-control" id="reportingManager" name="reportingManager" placeholder="Manager name">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Contact Information Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-geo-alt"></i>
                                </div>
                                <div class="title">
                                    <h5>Contact Information</h5>
                                    <p>Address and emergency contact details</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label for="address">
                                        <i class="bi bi-house-fill"></i>Current Address<span class="required">*</span>
                                    </label>
                                    <textarea class="form-control" id="address" name="address" required placeholder="Enter complete address"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">
                                        <i class="bi bi-building"></i>City<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="city" name="city" required placeholder="Enter city">
                                </div>
                                
                                <div class="form-group">
                                    <label for="state">
                                        <i class="bi bi-map-fill"></i>State/Province<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="state" name="state" required placeholder="Enter state">
                                </div>
                                
                                <div class="form-group">
                                    <label for="postalCode">
                                        <i class="bi bi-mailbox"></i>Postal Code<span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="postalCode" name="postalCode" required placeholder="Enter postal code">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="emergencyContactName">
                                        <i class="bi bi-person-fill-exclamation"></i>Emergency Contact Name
                                    </label>
                                    <input type="text" class="form-control" id="emergencyContactName" name="emergencyContactName" placeholder="Contact person name">
                                </div>
                                
                                <div class="form-group">
                                    <label for="emergencyContactPhone">
                                        <i class="bi bi-telephone-fill"></i>Emergency Contact Phone
                                    </label>
                                    <input type="tel" class="form-control" id="emergencyContactPhone" name="emergencyContactPhone" placeholder="+1 (555) 123-4567">
                                </div>
                                
                                <div class="form-group">
                                    <label for="emergencyContactRelation">
                                        <i class="bi bi-people-fill"></i>Relationship
                                    </label>
                                    <input type="text" class="form-control" id="emergencyContactRelation" name="emergencyContactRelation" placeholder="e.g., Spouse, Parent">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Qualifications Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-mortarboard"></i>
                                </div>
                                <div class="title">
                                    <h5>Qualifications</h5>
                                    <p>Educational background and certifications</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="highestQualification">
                                        <i class="bi bi-award-fill"></i>Highest Qualification<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="highestQualification" name="highestQualification" required>
                                        <option value="">Select Qualification</option>
                                        <option value="High School">High School</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                        <option value="Master's Degree">Master's Degree</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="specialization">
                                        <i class="bi bi-book-fill"></i>Specialization/Field
                                    </label>
                                    <select class="form-select" id="specialization" name="specialization">
                                        <option value="">Select Specialization</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics & Communication">Electronics & Communication</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Automobile Engineering">Automobile Engineering</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Business Administration">Business Administration</option>
                                        <option value="Human Resources">Human Resources</option>
                                        <option value="Accounting & Finance">Accounting & Finance</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Management">Management</option>
                                        <option value="Education">Education</option>
                                        <option value="Psychology">Psychology</option>
                                        <option value="English Literature">English Literature</option>
                                        <option value="Library Science">Library Science</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="experience">
                                        <i class="bi bi-graph-up-arrow"></i>Years of Experience
                                    </label>
                                    <input type="number" class="form-control" id="experience" name="experience" placeholder="0" min="0" step="0.5">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label for="certifications">
                                        <i class="bi bi-patch-check-fill"></i>Certifications
                                    </label>
                                    <textarea class="form-control" id="certifications" name="certifications" placeholder="List any professional certifications (one per line)" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Documents & Photo Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-file-earmark-text"></i>
                                </div>
                                <div class="title">
                                    <h5>Documents & Photo</h5>
                                    <p>Upload required documents and profile photo</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="photo">
                                        <i class="bi bi-camera-fill"></i>Profile Photo
                                    </label>
                                    <div class="file-upload-wrapper">
                                        <input type="file" class="file-upload-input" id="photo" name="photo" accept="image/*">
                                        <label for="photo" class="file-upload-label photo-upload-label">
                                            <div class="photo-preview-box" id="photoPreviewBox">
                                                <img id="photoPreview" alt="Staff Photo">
                                            </div>
                                            <i class="bi bi-cloud-upload" id="photoUploadIcon"></i>
                                            <div class="file-upload-text">
                                                <strong id="photoUploadText">Click to upload photo</strong>
                                                <small>JPG, PNG - Max 2MB</small>
                                            </div>
                                        </label>
                                    </div>
                                    <small id="photoFileName" class="file-name-display"></small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="resume">
                                        <i class="bi bi-file-pdf-fill"></i>Resume/CV
                                    </label>
                                    <div class="file-upload-wrapper">
                                        <input type="file" class="file-upload-input" id="resume" name="resume" accept=".pdf,.doc,.docx">
                                        <label for="resume" class="file-upload-label">
                                            <i class="bi bi-cloud-upload"></i>
                                            <div class="file-upload-text">
                                                <strong>Click to upload resume</strong>
                                                <small>PDF, DOC, DOCX - Max 5MB</small>
                                            </div>
                                        </label>
                                    </div>
                                    <small id="resumeFileName" class="file-name-display"></small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="idProof">
                                        <i class="bi bi-card-heading"></i>ID Proof
                                    </label>
                                    <div class="file-upload-wrapper">
                                        <input type="file" class="file-upload-input" id="idProof" name="idProof" accept=".pdf,.jpg,.jpeg,.png">
                                        <label for="idProof" class="file-upload-label">
                                            <i class="bi bi-cloud-upload"></i>
                                            <div class="file-upload-text">
                                                <strong>Click to upload ID</strong>
                                                <small>PDF, JPG, PNG - Max 2MB</small>
                                            </div>
                                        </label>
                                    </div>
                                    <small id="idProofFileName" class="file-name-display"></small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Additional Information Section -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <div class="icon">
                                    <i class="bi bi-info-circle"></i>
                                </div>
                                <div class="title">
                                    <h5>Additional Information</h5>
                                    <p>Other relevant details</p>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label for="notes">
                                        <i class="bi bi-journal-text"></i>Notes/Comments
                                    </label>
                                    <textarea class="form-control" id="notes" name="notes" placeholder="Any additional information about the staff member" rows="4"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="status">
                                        <i class="bi bi-toggle-on"></i>Status<span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="status" name="status" required>
                                        <option value="Active" selected>Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Form Actions -->
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline-secondary" onclick="resetForm()">
                                <i class="bi bi-x-circle"></i> Clear Form
                            </button>
                            <jsp:include page="/dashboard/components/ui_component/back-button.jsp">
                                <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp"/>
                                <jsp:param name="text" value="Cancel"/>
                            </jsp:include>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle"></i> Add Staff Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/ui_component/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    
    <!-- Include Reusable Modal Component -->
    <jsp:include page="/dashboard/components/ui_component/modal.jsp"/>
    
    <!-- Include Toast Notification Component -->
    <jsp:include page="/dashboard/components/ui_component/toast-notification.jsp"/>
    
    <script>
        // Photo preview functionality
        document.getElementById('photo').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('Photo size should not exceed 2MB. Please select a smaller file.', 'danger');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('photoPreview');
                const previewBox = document.getElementById('photoPreviewBox');
                const photoLabel = document.querySelector('.photo-upload-label');
                const photoFileName = document.getElementById('photoFileName');
                const uploadText = document.getElementById('photoUploadText');
                
                preview.src = event.target.result;
                previewBox.classList.add('show');
                photoLabel.classList.add('has-photo');
                uploadText.textContent = 'Click to change photo';
                photoFileName.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + file.name;
                
                // Show success toast
                showToast('Profile photo uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        });
        
        // Reset Form Function
        function resetForm() {
            showConfirmationModal({
                title: 'Reset Form',
                message: 'Are you sure you want to clear all form data?<br><br><strong class="text-danger">All entered data will be lost!</strong>',
                confirmText: 'Yes, Reset',
                cancelText: 'Keep Data',
                confirmClass: 'btn-danger',
                icon: 'bi-exclamation-triangle-fill text-danger',
                onConfirm: function() {
                    const form = document.getElementById('addStaffForm');
                    form.reset();
                    
                    // Reset photo preview
                    const photoPreview = document.getElementById('photoPreview');
                    const previewBox = document.getElementById('photoPreviewBox');
                    const uploadText = document.getElementById('photoUploadText');
                    const photoFileName = document.getElementById('photoFileName');
                    
                    if (photoPreview) photoPreview.src = '';
                    if (previewBox) previewBox.classList.remove('show');
                    if (uploadText) uploadText.textContent = 'Click to upload photo';
                    if (photoFileName) photoFileName.textContent = '';
                    
                    // Reset file name displays
                    document.getElementById('resumeFileName').textContent = '';
                    document.getElementById('idProofFileName').textContent = '';
                    
                    // Reset all file upload boxes - remove has-photo class
                    document.querySelectorAll('.file-upload-label').forEach(label => {
                        label.classList.remove('has-photo');
                    });
                    
                    // Show success toast
                    showToast('Form has been reset successfully', 'success');
                }
            });
        }
        
        // File Upload Label Update for Resume and ID Proof
        document.getElementById('resume').addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                showToast('Resume file size should not exceed 5MB. Please select a smaller file.', 'danger');
                this.value = '';
                return;
            }
            
            const fileDisplay = document.getElementById('resumeFileName');
            const label = this.nextElementSibling;
            fileDisplay.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + file.name;
            label.classList.add('has-photo');
            showToast('Resume uploaded successfully', 'success');
        });
        
        document.getElementById('idProof').addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('ID Proof file size should not exceed 2MB. Please select a smaller file.', 'danger');
                this.value = '';
                return;
            }
            
            const fileDisplay = document.getElementById('idProofFileName');
            const label = this.nextElementSibling;
            fileDisplay.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + file.name;
            label.classList.add('has-photo');
            showToast('ID Proof uploaded successfully', 'success');
        });
        
        // Form Validation
        document.getElementById('addStaffForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            let invalidFields = [];
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#DC3545';
                    const label = document.querySelector(`label[for="${field.id}"]`);
                    if (label) {
                        invalidFields.push(label.textContent.replace('*', '').trim());
                    }
                } else {
                    field.style.borderColor = '#dee2e6';
                }
            });
            
            if (!isValid) {
                showErrorModal({
                    title: 'Validation Error',
                    message: `Please fill in all required fields:<br><br><ul class="text-start"><li>${invalidFields.slice(0, 5).join('</li><li>')}</li></ul>${invalidFields.length > 5 ? '<p>...and ' + (invalidFields.length - 5) + ' more fields</p>' : ''}`
                });
                
                // Scroll to first invalid field
                const firstInvalid = document.querySelector('[required][style*="border-color: rgb(220, 53, 69)"]');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // If validation passes, show success and submit
            showSuccessModal({
                title: 'Staff Member Added Successfully!',
                message: 'The staff member has been registered in the system.<br><br>You will be redirected to the staff list.',
                onClose: function() {
                    // In a real application, this would submit to the backend
                    // Uncomment the following line to actually submit the form
                    // document.getElementById('addStaffForm').submit();
                    
                    // For demo: redirect to all staff page
                    // window.location.href = '${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp';
                }
            });
            
            // Show success toast as well
            showToast('Staff member added successfully!', 'success');
        });
    </script>
</body>
</html>
