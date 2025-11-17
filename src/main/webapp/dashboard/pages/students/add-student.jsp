<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Add Student - Dashboard - EduHub"/>
        <jsp:param name="description" value="Add new student to EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/add-student.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="add-student"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Add Student"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>Add New Student</h2>
                        <p class="text-muted">Register a new student in the system</p>
                    </div>
                    
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp"/>
                            <jsp:param name="text" value="Back to Students"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="add-student-layout">
                    <div class="add-student-form-column">
                        <form id="addStudentForm" action="${pageContext.request.contextPath}/api/students/add" method="POST" enctype="multipart/form-data">
                            
                            <!-- Student Photo Upload -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-3"><i class="bi bi-camera"></i> Student Photo</h5>
                                <div class="photo-upload-container">
                                    <div class="photo-preview" onclick="document.getElementById('studentPhoto').click()">
                                        <div class="photo-placeholder" id="photoPlaceholder">
                                            <i class="bi bi-person-circle" style="font-size: 60px;"></i>
                                            <p class="mb-0 small mt-2" style="font-weight: 500;">Click to Upload</p>
                                            <p class="mb-0" style="font-size: 0.75rem; color: #6c757d;">Student Photo</p>
                                        </div>
                                        <img id="photoPreview" style="display: none;" alt="Student Photo">
                                    </div>
                                    <input type="file" id="studentPhoto" name="studentPhoto" accept="image/*" style="display: none;">
                                    <p class="small text-muted mt-2 mb-0">Upload a passport-size photo (JPG, PNG - Max 2MB)</p>
                                </div>
                            </div>
                            
                            <!-- Personal Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-fill"></i> Personal Information</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="studentName"/>
                                        <jsp:param name="name" value="studentName"/>
                                        <jsp:param name="label" value="Student Name"/>
                                        <jsp:param name="placeholder" value="Enter first name"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="fatherName"/>
                                        <jsp:param name="name" value="fatherName"/>
                                        <jsp:param name="label" value="Father's Name"/>
                                        <jsp:param name="placeholder" value="Enter father's name"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="surname"/>
                                        <jsp:param name="name" value="surname"/>
                                        <jsp:param name="label" value="Surname"/>
                                        <jsp:param name="placeholder" value="Enter surname"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="dateOfBirth"/>
                                        <jsp:param name="name" value="dateOfBirth"/>
                                        <jsp:param name="label" value="Date of Birth"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="max" value="2010-12-31"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="gender"/>
                                        <jsp:param name="name" value="gender"/>
                                        <jsp:param name="label" value="Gender"/>
                                        <jsp:param name="placeholder" value="Select Gender"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="male|Male,female|Female,other|Other"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="bloodGroup"/>
                                        <jsp:param name="name" value="bloodGroup"/>
                                        <jsp:param name="label" value="Blood Group"/>
                                        <jsp:param name="placeholder" value="Select Blood Group"/>
                                        <jsp:param name="options" value="A+|A+,A-|A-,B+|B+,B-|B-,AB+|AB+,AB-|AB-,O+|O+,O-|O-"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Contact Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-telephone-fill"></i> Contact Information</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="mobileNumber"/>
                                        <jsp:param name="name" value="mobileNumber"/>
                                        <jsp:param name="label" value="Mobile Number"/>
                                        <jsp:param name="placeholder" value="10-digit mobile number"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="pattern" value="[0-9]{10}"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <div class="col-md-4">
                                        <jsp:include page="/dashboard/components/input-field.jsp">
                                            <jsp:param name="type" value="tel"/>
                                            <jsp:param name="id" value="whatsappNumber"/>
                                            <jsp:param name="name" value="whatsappNumber"/>
                                            <jsp:param name="label" value="WhatsApp Number"/>
                                            <jsp:param name="placeholder" value="10-digit WhatsApp number"/>
                                            <jsp:param name="required" value="true"/>
                                            <jsp:param name="pattern" value="[0-9]{10}"/>
                                        </jsp:include>
                                        <div class="form-check mt-1">
                                            <input class="form-check-input" type="checkbox" id="sameAsMobile" onchange="copySameAsMobile()">
                                            <label class="form-check-label small" for="sameAsMobile">Same as mobile</label>
                                        </div>
                                    </div>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="parentMobile"/>
                                        <jsp:param name="name" value="parentMobile"/>
                                        <jsp:param name="label" value="Parent's Mobile Number"/>
                                        <jsp:param name="placeholder" value="10-digit parent's mobile"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="pattern" value="[0-9]{10}"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="email"/>
                                        <jsp:param name="id" value="emailId"/>
                                        <jsp:param name="name" value="emailId"/>
                                        <jsp:param name="label" value="Email ID"/>
                                        <jsp:param name="placeholder" value="student@example.com"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="instagramId"/>
                                        <jsp:param name="name" value="instagramId"/>
                                        <jsp:param name="label" value="Instagram Account ID"/>
                                        <jsp:param name="placeholder" value="username"/>
                                        <jsp:param name="prepend" value="@"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="linkedinId"/>
                                        <jsp:param name="name" value="linkedinId"/>
                                        <jsp:param name="label" value="LinkedIn Account ID"/>
                                        <jsp:param name="placeholder" value="linkedin.com/in/..."/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Address Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-geo-alt-fill"></i> Address Information</h5>
                                
                                <jsp:include page="/dashboard/components/input-field.jsp">
                                    <jsp:param name="type" value="textarea"/>
                                    <jsp:param name="id" value="permanentAddress"/>
                                    <jsp:param name="name" value="permanentAddress"/>
                                    <jsp:param name="label" value="Permanent Address"/>
                                    <jsp:param name="placeholder" value="Enter complete permanent address"/>
                                    <jsp:param name="required" value="true"/>
                                    <jsp:param name="rows" value="3"/>
                                    <jsp:param name="class" value="mb-3"/>
                                </jsp:include>
                                
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <label for="currentAddress" class="form-label mb-0">Current Address <span class="required-star">*</span></label>
                                        <a href="javascript:void(0)" class="same-as-permanent" onclick="copyPermanentAddress()">
                                            <i class="bi bi-files"></i> Same as Permanent Address
                                        </a>
                                    </div>
                                    <textarea class="form-control" id="currentAddress" name="currentAddress" rows="3" required placeholder="Enter complete current address"></textarea>
                                </div>
                            </div>
                            
                            <!-- Educational Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-mortarboard-fill"></i> Educational Information</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="collegeName"/>
                                        <jsp:param name="name" value="collegeName"/>
                                        <jsp:param name="label" value="College Name"/>
                                        <jsp:param name="placeholder" value="Enter college/university name"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="educationQualification"/>
                                        <jsp:param name="name" value="educationQualification"/>
                                        <jsp:param name="label" value="Education Qualification"/>
                                        <jsp:param name="placeholder" value="Select Qualification"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="10th|10th Standard,12th|12th Standard,diploma|Diploma,bachelor|Bachelor's Degree,master|Master's Degree,phd|PhD,other|Other"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label for="passingYear" class="form-label">Passing Year <span class="required-star">*</span></label>
                                        <input type="text" class="form-control" id="passingYear" name="passingYear" required placeholder="Click to select year" readonly>
                                    </div>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="courseEnrolled"/>
                                        <jsp:param name="name" value="courseEnrolled"/>
                                        <jsp:param name="label" value="Course to Enroll"/>
                                        <jsp:param name="placeholder" value="Select Course"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="1|Web Development - Full Stack,2|Data Science - Advanced,3|Mobile App Development,4|Digital Marketing,5|Python Programming"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <div class="col-md-4">
                                        <label for="batchPreference" class="form-label">Batch Preference</label>
                                        <select class="form-select" id="batchPreference" name="batchPreference">
                                            <option value="">Select Batch Mode</option>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row g-3 mt-1">
                                    <div class="col-md-4">
                                        <label for="studentStatus" class="form-label">Student Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="studentStatus" name="studentStatus" required>
                                            <option value="">Select Status</option>
                                            <option value="Active" selected>Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Suspended">Suspended</option>
                                            <option value="Graduated">Graduated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Medical Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-heart-pulse-fill"></i> Medical Information</h5>
                                
                                <div class="mb-3">
                                    <label class="form-label">Any Medical History? <span class="required-star">*</span></label>
                                    <div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="medicalHistory" id="medicalHistoryYes" value="yes" onchange="toggleMedicalDetails(true)" required>
                                            <label class="form-check-label" for="medicalHistoryYes">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="medicalHistory" id="medicalHistoryNo" value="no" onchange="toggleMedicalDetails(false)" required>
                                            <label class="form-check-label" for="medicalHistoryNo">No</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="medicalDetailsSection" style="display: none;">
                                    <div class="alert alert-info">
                                        <i class="bi bi-info-circle"></i> Please provide details about medical conditions, allergies, or ongoing treatments
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="medicalCondition" class="form-label">Medical Condition/Details</label>
                                        <textarea class="form-control" id="medicalCondition" name="medicalCondition" rows="3" placeholder="Describe the medical condition"></textarea>
                                    </div>
                                    
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="medicineName" class="form-label">Medicine Name(s)</label>
                                            <input type="text" class="form-control" id="medicineName" name="medicineName" placeholder="Enter medicine names (separated by comma)">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="medicinePrescription" class="form-label">Upload Prescription (Optional)</label>
                                            <input type="file" class="form-control" id="medicinePrescription" name="medicinePrescription" accept=".pdf,.jpg,.jpeg,.png">
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Document Uploads -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-file-earmark-arrow-up"></i> Document Uploads</h5>
                                <p class="text-muted mb-4">Please upload clear scanned copies of the following documents (PDF format preferred)</p>
                                
                                <div class="row">
                                    <!-- Aadhar Card -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Aadhar Card <span class="required-star">*</span></label>
                                        <div class="file-upload-box" id="aadharBox" onclick="document.getElementById('aadharCard').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload Aadhar Card</p>
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="aadharFileName"></p>
                                        <input type="file" id="aadharCard" name="aadharCard" accept=".pdf,.jpg,.jpeg,.png" required style="display: none;" onchange="handleFileUpload(this, 'aadharBox', 'aadharFileName')">
                                    </div>
                                    
                                    <!-- PAN Card -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">PAN Card</label>
                                        <div class="file-upload-box" id="panCardBox" onclick="document.getElementById('panCard').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload PAN Card</p>
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="panCardFileName"></p>
                                        <input type="file" id="panCard" name="panCard" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" onchange="handleFileUpload(this, 'panCardBox', 'panCardFileName')">
                                    </div>
                                    
                                    <!-- Marksheet -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Current/Final Year Marksheet <span class="required-star">*</span></label>
                                        <div class="file-upload-box" id="marksheetBox" onclick="document.getElementById('marksheet').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload Marksheet</p>
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="marksheetFileName"></p>
                                        <input type="file" id="marksheet" name="marksheet" accept=".pdf,.jpg,.jpeg,.png" required style="display: none;" onchange="handleFileUpload(this, 'marksheetBox', 'marksheetFileName')">
                                    </div>
                                    
                                    <!-- Degree Certificate -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Degree Certificate</label>
                                        <div class="file-upload-box" id="degreeBox" onclick="document.getElementById('degreeCertificate').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload Degree Certificate</p>
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="degreeFileName"></p>
                                        <input type="file" id="degreeCertificate" name="degreeCertificate" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" onchange="handleFileUpload(this, 'degreeBox', 'degreeFileName')">
                                    </div>
                                    
                                    <!-- Job Guarantee Document -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Job Guarantee Document</label>
                                        <div class="file-upload-box" id="jobGuaranteeBox" onclick="document.getElementById('jobGuarantee').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload Job Guarantee Doc</p>
                                            <small class="text-muted">PDF, JPG, PNG - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="jobGuaranteeFileName"></p>
                                        <input type="file" id="jobGuarantee" name="jobGuarantee" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" onchange="handleFileUpload(this, 'jobGuaranteeBox', 'jobGuaranteeFileName')">
                                    </div>
                                    
                                    <!-- Resume -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Resume/CV</label>
                                        <div class="file-upload-box" id="resumeBox" onclick="document.getElementById('resume').click()">
                                            <i class="bi bi-cloud-upload" style="font-size: 30px; color: #6c757d;"></i>
                                            <p class="mb-0 mt-2">Click to upload Resume/CV</p>
                                            <small class="text-muted">PDF, DOC, DOCX - Max 5MB</small>
                                        </div>
                                        <p class="file-name" id="resumeFileName"></p>
                                        <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" style="display: none;" onchange="handleFileUpload(this, 'resumeBox', 'resumeFileName')">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Terms and Conditions -->
                            <div class="card-custom mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="termsConditions" name="termsConditions" required>
                                    <label class="form-check-label" for="termsConditions">
                                        I hereby declare that the information provided is true and correct to the best of my knowledge. <span class="required-star">*</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="d-flex gap-2 mb-4 form-action-buttons">
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Submit Registration
                                </button>
                                <button type="button" class="btn btn-outline-secondary" onclick="resetForm()">
                                    <i class="bi bi-arrow-clockwise"></i> Reset Form
                                </button>
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp" class="btn btn-outline-danger">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="add-student-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Registration Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Fill all required fields marked with <span class="required-star">*</span></li>
                                <li class="mb-2">Upload clear, legible document scans</li>
                                <li class="mb-2">Ensure mobile numbers are active</li>
                                <li class="mb-2">Use a valid email address</li>
                                <li class="mb-2">Photo should be passport-size</li>
                                <li class="mb-2">All documents should be in PDF or image format</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <h6 class="mb-3">
                                <i class="bi bi-file-text me-2"></i>Required Documents
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">✓ Aadhar Card</li>
                                <li class="mb-2">✓ Latest Marksheet</li>
                                <li class="mb-2">• PAN Card (if available)</li>
                                <li class="mb-2">• Degree Certificate</li>
                                <li class="mb-2">• Job Guarantee Document</li>
                                <li class="mb-2">• Resume/CV</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <div>
                                <h6 class="mb-3">
                                    <i class="bi bi-headset me-2"></i>Need Help?
                                </h6>
                                <p class="small text-muted mb-2">Contact our admission team for assistance</p>
                                <a href="#" class="btn btn-sm btn-outline-primary w-100">
                                    <i class="bi bi-telephone me-2"></i>Contact Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    
    <!-- Include Reusable Modal Component -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    
    <!-- Include Toast Notification Component -->
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <!-- Add Student Page Scripts -->
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/add-student.js"></script>
</body>
</html>
