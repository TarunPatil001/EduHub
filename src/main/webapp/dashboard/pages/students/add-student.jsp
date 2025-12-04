<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%
    // Helper to build options string for input-field component
    StringBuilder genderOptions = new StringBuilder();
    for(String item : DropdownData.GENDERS) {
        genderOptions.append(item).append("|").append(item).append(",");
    }
    if(genderOptions.length() > 0) genderOptions.setLength(genderOptions.length() - 1);

    StringBuilder bloodGroupOptions = new StringBuilder();
    for(String item : DropdownData.BLOOD_GROUPS) {
        bloodGroupOptions.append(item).append("|").append(item).append(",");
    }
    if(bloodGroupOptions.length() > 0) bloodGroupOptions.setLength(bloodGroupOptions.length() - 1);

    StringBuilder qualificationOptions = new StringBuilder();
    for(String item : DropdownData.QUALIFICATIONS) {
        qualificationOptions.append(item).append("|").append(item).append(",");
    }
    if(qualificationOptions.length() > 0) qualificationOptions.setLength(qualificationOptions.length() - 1);

    StringBuilder specializationOptions = new StringBuilder();
    for(String item : DropdownData.SPECIALIZATIONS) {
        specializationOptions.append(item).append("|").append(item).append(",");
    }
    if(specializationOptions.length() > 0) specializationOptions.setLength(specializationOptions.length() - 1);

    StringBuilder courseOptions = new StringBuilder();
    for(String item : DropdownData.COURSES) {
        courseOptions.append(item).append("|").append(item).append(",");
    }
    if(courseOptions.length() > 0) courseOptions.setLength(courseOptions.length() - 1);

    // Build document types JSON for JavaScript
    StringBuilder documentTypesJson = new StringBuilder("[");
    for(int i = 0; i < DropdownData.DOCUMENT_TYPES.size(); i++) {
        String[] parts = DropdownData.DOCUMENT_TYPES.get(i).split("\\|");
        documentTypesJson.append("{ \"value\": \"").append(parts[0]).append("\", \"label\": \"").append(parts[1]).append("\" }");
        if(i < DropdownData.DOCUMENT_TYPES.size() - 1) documentTypesJson.append(", ");
    }
    documentTypesJson.append("]");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Add Student - Dashboard - EduHub"/>
        <jsp:param name="description" value="Add new student to EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/students/css/add-student.css?v=<%=System.currentTimeMillis()%>">
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
                        <h2>Add New Student Registration</h2>
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
                            
                            <!-- Basic Profile & Personal Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-badge-fill"></i> Basic Profile</h5>
                                
                                <div class="row align-items-center">
                                    <!-- Photo Upload Column -->
                                    <div class="col-lg-auto col-md-auto d-flex flex-column align-items-center mb-4 mb-md-0 pe-lg-5 border-end-lg">
                                        <div class="photo-upload-section">
                                            <div class="photo-preview" onclick="document.getElementById('studentPhoto').click()">
                                                <div class="photo-placeholder" id="photoPlaceholder">
                                                    <i class="bi bi-camera-fill"></i>
                                                    <span class="small fw-bold">Upload</span>
                                                </div>
                                                <img id="photoPreview" style="display: none;" alt="Student Photo">
                                            </div>
                                            <input type="file" id="studentPhoto" name="studentPhoto" accept="image/*" style="display: none;">
                                            <div class="upload-hint text-center">
                                                JPG/PNG &bull; Max 2MB
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Personal Details Column -->
                                    <div class="col-lg col-md">
                                        <div class="row mb-3">
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="studentName"/>
                                                <jsp:param name="name" value="studentName"/>
                                                <jsp:param name="label" value="Student Name"/>
                                                <jsp:param name="placeholder" value="First Name"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="class" value="col-md-4"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="fatherName"/>
                                                <jsp:param name="name" value="fatherName"/>
                                                <jsp:param name="label" value="Father's Name"/>
                                                <jsp:param name="placeholder" value="Father's Name"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="class" value="col-md-4"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="surname"/>
                                                <jsp:param name="name" value="surname"/>
                                                <jsp:param name="label" value="Surname"/>
                                                <jsp:param name="placeholder" value="Last Name"/>
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
                                                <jsp:param name="options" value="<%=genderOptions.toString()%>"/>
                                                <jsp:param name="class" value="col-md-4"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="select"/>
                                                <jsp:param name="id" value="bloodGroup"/>
                                                <jsp:param name="name" value="bloodGroup"/>
                                                <jsp:param name="label" value="Blood Group"/>
                                                <jsp:param name="placeholder" value="Select Group"/>
                                                <jsp:param name="options" value="<%=bloodGroupOptions.toString()%>"/>
                                                <jsp:param name="class" value="col-md-4"/>
                                            </jsp:include>
                                        </div>
                                    </div>
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
                                        <div class="form-check mt-2">
                                            <input class="form-check-input" type="checkbox" id="sameAsMobile" onchange="copySameAsMobile()">
                                            <label class="form-check-label small text-muted" for="sameAsMobile">Same as mobile</label>
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
                                        <jsp:param name="label" value="Instagram ID"/>
                                        <jsp:param name="placeholder" value="username"/>
                                        <jsp:param name="prepend" value="@"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="linkedinId"/>
                                        <jsp:param name="name" value="linkedinId"/>
                                        <jsp:param name="label" value="LinkedIn Profile"/>
                                        <jsp:param name="placeholder" value="linkedin.com/in/..."/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Address Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-geo-alt-fill"></i> Address Information</h5>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <label for="permanentAddress" class="form-label mb-0">Permanent Address <span class="required-star">*</span></label>
                                                <!-- Invisible placeholder to match height of 'Copy Permanent' button -->
                                                <span class="same-as-permanent" style="visibility: hidden; pointer-events: none;">
                                                    <i class="bi bi-files"></i> Copy Permanent
                                                </span>
                                            </div>
                                            <textarea class="form-control" id="permanentAddress" name="permanentAddress" rows="4" required placeholder="Enter complete permanent address"></textarea>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <label for="currentAddress" class="form-label mb-0">Current Address <span class="required-star">*</span></label>
                                                <a href="javascript:void(0)" class="same-as-permanent" onclick="copyPermanentAddress()">
                                                    <i class="bi bi-files"></i> Copy Permanent
                                                </a>
                                            </div>
                                            <textarea class="form-control" id="currentAddress" name="currentAddress" rows="4" required placeholder="Enter complete current address"></textarea>
                                        </div>
                                    </div>
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
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="educationQualification"/>
                                        <jsp:param name="name" value="educationQualification"/>
                                        <jsp:param name="label" value="Qualification"/>
                                        <jsp:param name="placeholder" value="Select Qualification"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=qualificationOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="specialization"/>
                                        <jsp:param name="name" value="specialization"/>
                                        <jsp:param name="label" value="Specialization"/>
                                        <jsp:param name="placeholder" value="Select Specialization"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=specializationOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="passingYear" class="form-label">Passing Year <span class="required-star">*</span></label>
                                        <div class="input-group">
                                            <span class="input-group-text input-group-text-custom"><i class="bi bi-calendar-event"></i></span>
                                            <input type="text" class="form-control" id="passingYear" name="passingYear" required placeholder="Select Year" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Enrollment Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-journal-check"></i> Enrollment Details</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="batchCode" class="form-label">Batch Code <span class="required-star">*</span></label>
                                        <select class="form-select" id="batchCode" name="batchCode" required>
                                            <option value="">Select Batch Code</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="batchName" class="form-label">Batch Name</label>
                                        <input type="text" class="form-control" id="batchName" readonly placeholder="Auto-populated">
                                        <input type="hidden" id="batchId" name="batchId">
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="studentStatus" class="form-label">Student Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="studentStatus" name="studentStatus" required onchange="updateFeesAllowed()">
                                            <option value="">Select Status</option>
                                            <% for(String item : DropdownData.STUDENT_STATUSES) { %>
                                                <option value="<%=item%>" <%=item.equals("Pending") ? "selected" : ""%>><%=item%></option>
                                            <% } %>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="feesAllowed" class="form-label">Fees Allowed <span class="required-star">*</span></label>
                                        <select class="form-select" id="feesAllowed" name="feesAllowed" required>
                                            <option value="NO">NO</option>
                                            <option value="YES">YES</option>
                                        </select>
                                        <small class="text-muted">Auto-set based on status</small>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Medical Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-heart-pulse-fill"></i> Medical Information</h5>
                                
                                <div class="mb-3 p-3 medical-info-box rounded-3 border">
                                    <label class="form-label d-block mb-2">Any Medical History? <span class="required-star">*</span></label>
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
                                    <div class="alert alert-info border-0 shadow-sm">
                                        <i class="bi bi-info-circle-fill me-2"></i> Please provide details about medical conditions, allergies, or ongoing treatments
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
                                <h5 class="mb-4"><i class="bi bi-file-earmark-arrow-up-fill"></i> Document Uploads</h5>
                                
                                <div class="alert alert-info alert-custom-info d-flex align-items-center mb-4">
                                    <i class="bi bi-info-circle-fill me-2"></i>
                                    <span>Upload new documents below.</span>
                                </div>
                                
                <!-- Hidden Inputs for Form Submission -->
                <div class="d-none">
                    <!-- Multi-file trigger -->
                    <input type="file" id="multiFileTrigger" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx">
                </div>                                <div class="upload-drop-zone" id="dropZone">
                                    <div class="upload-icon-wrapper">
                                        <div class="upload-icon-circle">
                                            <i class="bi bi-cloud-arrow-up-fill"></i>
                                        </div>
                                    </div>
                                    <div class="upload-text">
                                        <h6 class="mb-2">Choose files or drag & drop here</h6>
                                        <p class="text-muted mb-3"><i class="bi bi-file-earmark-text me-1"></i>PDF, DOC, DOCX, JPEG, PNG, XLSX • Max 50MB per file</p>
                                        <button type="button" class="btn btn-primary" onclick="document.getElementById('multiFileTrigger').click()">
                                            <i class="bi bi-folder2-open me-2"></i>Browse Files
                                        </button>
                                    </div>
                                </div>

                                <div class="document-list" id="documentList">
                                    <!-- Dynamic file list will appear here -->
                                </div>
                            </div>
                            
                            <!-- Terms and Conditions -->
                            <div class="card-custom mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="studentDeclaration" name="studentDeclaration" required>
                                    <label class="form-check-label" for="studentDeclaration">
                                        I hereby declare that the information provided is true and correct to the best of my knowledge. <span class="required-star">*</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/students/all-students.jsp" class="btn btn-outline-secondary px-4">
                                    Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" onclick="resetForm()">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Submit Registration
                                </button>
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
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <!-- Add Student Page Scripts -->
    <script>
        // Pass server-side data to JavaScript
        const CONTEXT_PATH = '${pageContext.request.contextPath}';
        const SERVER_DOCUMENT_TYPES = <%=documentTypesJson.toString()%>;
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/students/js/add-student.js?v=<%=System.currentTimeMillis()%>"></script>
</body>
</html>
