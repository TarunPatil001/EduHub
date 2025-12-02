<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%@ page import="com.eduhub.dao.interfaces.BranchDAO" %>
<%@ page import="com.eduhub.dao.impl.BranchDAOImpl" %>
<%@ page import="com.eduhub.model.Branch" %>
<%
    // Helper to build options string for input-field component
    StringBuilder genderOptions = new StringBuilder();
    for(String item : DropdownData.GENDERS) {
        genderOptions.append(item).append("|").append(item).append(",");
    }
    if(genderOptions.length() > 0) genderOptions.setLength(genderOptions.length() - 1);

    StringBuilder maritalStatusOptions = new StringBuilder();
    for(String item : DropdownData.MARITAL_STATUSES) {
        maritalStatusOptions.append(item).append("|").append(item).append(",");
    }
    if(maritalStatusOptions.length() > 0) maritalStatusOptions.setLength(maritalStatusOptions.length() - 1);

    StringBuilder roleOptions = new StringBuilder();
    for(String item : DropdownData.ROLES) {
        roleOptions.append(item).append("|").append(item).append(",");
    }
    if(roleOptions.length() > 0) roleOptions.setLength(roleOptions.length() - 1);

    StringBuilder departmentOptions = new StringBuilder();
    for(String item : DropdownData.STAFF_DEPARTMENTS) {
        departmentOptions.append(item).append("|").append(item).append(",");
    }
    if(departmentOptions.length() > 0) departmentOptions.setLength(departmentOptions.length() - 1);

    // Fetch branches
    String instituteId = (String) session.getAttribute("instituteId");
    BranchDAO branchDAO = new BranchDAOImpl();
    List<Branch> branches = branchDAO.getAllBranches(instituteId);
    
    StringBuilder branchOptions = new StringBuilder();
    for(Branch branch : branches) {
        branchOptions.append(branch.getBranchId()).append("|").append(branch.getBranchName()).append(",");
    }
    if(branchOptions.length() > 0) branchOptions.setLength(branchOptions.length() - 1);

    StringBuilder employmentTypeOptions = new StringBuilder();
    for(String item : DropdownData.EMPLOYMENT_TYPES) {
        employmentTypeOptions.append(item).append("|").append(item).append(",");
    }
    if(employmentTypeOptions.length() > 0) employmentTypeOptions.setLength(employmentTypeOptions.length() - 1);

    StringBuilder workShiftOptions = new StringBuilder();
    for(String item : DropdownData.WORK_SHIFTS) {
        workShiftOptions.append(item).append("|").append(item).append(",");
    }
    if(workShiftOptions.length() > 0) workShiftOptions.setLength(workShiftOptions.length() - 1);

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

    StringBuilder stateOptions = new StringBuilder();
    for(String item : DropdownData.STATES) {
        stateOptions.append(item).append("|").append(item).append(",");
    }
    if(stateOptions.length() > 0) stateOptions.setLength(stateOptions.length() - 1);

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
        <jsp:param name="title" value="Add Staff - Dashboard - EduHub"/>
        <jsp:param name="description" value="Add new staff member to EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/staff/css/add-staff.css?v=<%=System.currentTimeMillis()%>">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="add-staff"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Add Staff"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>Add New Staff Member</h2>
                        <p class="text-muted">Register a new staff member in the system</p>
                    </div>
                    
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp"/>
                            <jsp:param name="text" value="Back to Staff"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="add-staff-layout">
                    <div class="add-staff-form-column">
                        <form id="addStaffForm" action="${pageContext.request.contextPath}/staff/add" method="POST" enctype="multipart/form-data">
                            
                            <!-- Personal Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-badge-fill"></i> Personal Information</h5>
                                
                                <div class="row align-items-center">
                                    <!-- Photo Upload Column -->
                                    <div class="col-lg-auto col-md-auto d-flex flex-column align-items-center mb-4 mb-md-0 pe-lg-5 border-end-lg">
                                        <div class="photo-upload-section">
                                            <div class="photo-preview" onclick="document.getElementById('staffPhoto').click()">
                                                <div class="photo-placeholder" id="photoPlaceholder">
                                                    <i class="bi bi-camera-fill"></i>
                                                    <span class="small fw-bold">Upload</span>
                                                </div>
                                                <img id="photoPreview" style="display: none;" alt="Staff Photo">
                                            </div>
                                            <input type="file" id="staffPhoto" name="staffPhoto" accept="image/*" style="display: none;">
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
                                                <jsp:param name="id" value="firstName"/>
                                                <jsp:param name="name" value="firstName"/>
                                                <jsp:param name="label" value="First Name"/>
                                                <jsp:param name="placeholder" value="First Name"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="lastName"/>
                                                <jsp:param name="name" value="lastName"/>
                                                <jsp:param name="label" value="Last Name"/>
                                                <jsp:param name="placeholder" value="Last Name"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="date"/>
                                                <jsp:param name="id" value="dateOfBirth"/>
                                                <jsp:param name="name" value="dateOfBirth"/>
                                                <jsp:param name="label" value="Date of Birth"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="select"/>
                                                <jsp:param name="id" value="gender"/>
                                                <jsp:param name="name" value="gender"/>
                                                <jsp:param name="label" value="Gender"/>
                                                <jsp:param name="placeholder" value="Select Gender"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="options" value="<%=genderOptions.toString()%>"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                        </div>

                                        <div class="row mb-3">
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="nationality"/>
                                                <jsp:param name="name" value="nationality"/>
                                                <jsp:param name="label" value="Nationality"/>
                                                <jsp:param name="placeholder" value="Enter nationality"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>

                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="select"/>
                                                <jsp:param name="id" value="maritalStatus"/>
                                                <jsp:param name="name" value="maritalStatus"/>
                                                <jsp:param name="label" value="Marital Status"/>
                                                <jsp:param name="placeholder" value="Select Status"/>
                                                <jsp:param name="options" value="<%=maritalStatusOptions.toString()%>"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Employment Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-briefcase-fill"></i> Employment Information</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="employeeId"/>
                                        <jsp:param name="name" value="employeeId"/>
                                        <jsp:param name="label" value="Employee ID"/>
                                        <jsp:param name="placeholder" value="EMP-001"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="department"/>
                                        <jsp:param name="name" value="department"/>
                                        <jsp:param name="label" value="Department"/>
                                        <jsp:param name="placeholder" value="Select Department"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=departmentOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="role"/>
                                        <jsp:param name="name" value="role"/>
                                        <jsp:param name="label" value="Role/Position"/>
                                        <jsp:param name="placeholder" value="Select Role"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=roleOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="branchId"/>
                                        <jsp:param name="name" value="branchId"/>
                                        <jsp:param name="label" value="Branch"/>
                                        <jsp:param name="placeholder" value="Select Branch"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=branchOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="joiningDate"/>
                                        <jsp:param name="name" value="joiningDate"/>
                                        <jsp:param name="label" value="Joining Date"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="employmentType"/>
                                        <jsp:param name="name" value="employmentType"/>
                                        <jsp:param name="label" value="Employment Type"/>
                                        <jsp:param name="placeholder" value="Select Type"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=employmentTypeOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>

                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="salary"/>
                                        <jsp:param name="name" value="salary"/>
                                        <jsp:param name="label" value="Monthly Salary"/>
                                        <jsp:param name="placeholder" value="5000"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="0"/>
                                        <jsp:param name="step" value="0.01"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="workShift"/>
                                        <jsp:param name="name" value="workShift"/>
                                        <jsp:param name="label" value="Work Shift"/>
                                        <jsp:param name="placeholder" value="Select Shift"/>
                                        <jsp:param name="options" value="<%=workShiftOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="reportingManager"/>
                                        <jsp:param name="name" value="reportingManager"/>
                                        <jsp:param name="label" value="Reporting Manager"/>
                                        <jsp:param name="placeholder" value="Manager name"/>
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
                                        <jsp:param name="id" value="phone"/>
                                        <jsp:param name="name" value="phone"/>
                                        <jsp:param name="label" value="Phone Number"/>
                                        <jsp:param name="placeholder" value="10-digit mobile number"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="pattern" value="[0-9]{10}"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="email"/>
                                        <jsp:param name="id" value="email"/>
                                        <jsp:param name="name" value="email"/>
                                        <jsp:param name="label" value="Email Address"/>
                                        <jsp:param name="placeholder" value="staff@example.com"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label for="address" class="form-label">Current Address <span class="required-star">*</span></label>
                                            <textarea class="form-control" id="address" name="address" rows="3" required placeholder="Enter complete address"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="city"/>
                                        <jsp:param name="name" value="city"/>
                                        <jsp:param name="label" value="City"/>
                                        <jsp:param name="placeholder" value="Enter city"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="state"/>
                                        <jsp:param name="name" value="state"/>
                                        <jsp:param name="label" value="State/Province"/>
                                        <jsp:param name="placeholder" value="Select State"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=stateOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="postalCode"/>
                                        <jsp:param name="name" value="postalCode"/>
                                        <jsp:param name="label" value="Postal Code"/>
                                        <jsp:param name="placeholder" value="Enter postal code"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>

                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="emergencyContactName"/>
                                        <jsp:param name="name" value="emergencyContactName"/>
                                        <jsp:param name="label" value="Emergency Contact Name"/>
                                        <jsp:param name="placeholder" value="Contact person name"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="emergencyContactPhone"/>
                                        <jsp:param name="name" value="emergencyContactPhone"/>
                                        <jsp:param name="label" value="Emergency Contact Phone"/>
                                        <jsp:param name="placeholder" value="10-digit number"/>
                                        <jsp:param name="pattern" value="[0-9]{10}"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="emergencyContactRelation"/>
                                        <jsp:param name="name" value="emergencyContactRelation"/>
                                        <jsp:param name="label" value="Relationship"/>
                                        <jsp:param name="placeholder" value="e.g., Spouse, Parent"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Qualifications -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-mortarboard-fill"></i> Qualifications</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="highestQualification"/>
                                        <jsp:param name="name" value="highestQualification"/>
                                        <jsp:param name="label" value="Highest Qualification"/>
                                        <jsp:param name="placeholder" value="Select Qualification"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=qualificationOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="specialization"/>
                                        <jsp:param name="name" value="specialization"/>
                                        <jsp:param name="label" value="Specialization/Field"/>
                                        <jsp:param name="placeholder" value="Select Specialization"/>
                                        <jsp:param name="options" value="<%=specializationOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="experience"/>
                                        <jsp:param name="name" value="experience"/>
                                        <jsp:param name="label" value="Years of Experience"/>
                                        <jsp:param name="placeholder" value="0"/>
                                        <jsp:param name="min" value="0"/>
                                        <jsp:param name="step" value="0.5"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>
                                
                            </div>
                            
                            <!-- Certifications -->
                            <div class="card-custom mb-4">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h5 class="mb-0"><i class="bi bi-file-earmark-text-fill"></i> Certification Uploads</h5>
                                    <button type="button" class="btn btn-primary" onclick="addCertification()" style="border-radius: 8px; padding: 0.5rem 1.25rem;">
                                        <i class="bi bi-plus-circle me-2"></i>Add New
                                    </button>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <!-- Empty State Placeholder -->
                                        <div id="certEmptyState" class="empty-state-box">
                                            <div class="empty-state-icon">
                                                <i class="bi bi-file-earmark-text"></i>
                                            </div>
                                            <h6 class="empty-state-title">No Certifications Added</h6>
                                            <p class="empty-state-text">Click "Add New" to add professional certifications</p>
                                        </div>
                                        
                                        <div id="certificationsContainer">
                                            <!-- Dynamic certification items will be added here -->
                                        </div>
                                        <input type="hidden" name="certificationIndices" id="certificationIndices" value="">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Document Uploads -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-file-earmark-arrow-up-fill"></i> Document Uploads</h5>
                                
                                <div class="alert alert-info d-flex align-items-center mb-4" style="background: rgba(13, 110, 253, 0.08); border: 1px solid rgba(13, 110, 253, 0.2); border-radius: 10px;">
                                    <i class="bi bi-info-circle-fill me-2" style="font-size: 1.25rem; color: var(--primary-color);"></i>
                                    <span style="color: var(--text-primary); font-weight: 500;">Upload new documents below.</span>
                                </div>
                                
                                <!-- Hidden Inputs for Form Submission -->
                                <div class="d-none">
                                    <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx">
                                    <input type="file" id="aadharCard" name="aadharCard" accept=".pdf,.jpg,.jpeg,.png">
                                    <input type="file" id="panCard" name="panCard" accept=".pdf,.jpg,.jpeg,.png">
                                    <input type="file" id="marksheet" name="marksheet" accept=".pdf,.jpg,.jpeg,.png">
                                    <input type="file" id="degreeCertificate" name="degreeCertificate" accept=".pdf,.jpg,.jpeg,.png">
                                    <input type="file" id="jobGuarantee" name="jobGuarantee" accept=".pdf,.doc,.docx">
                                    <!-- Multi-file trigger -->
                                    <input type="file" id="multiFileTrigger" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx">
                                </div>

                                <div class="upload-drop-zone" id="dropZone">
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
                            
                            <!-- Additional Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Additional Information</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="status" class="form-label">Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="status" name="status" required>
                                            <option value="Yet to Onboard" selected>Yet to Onboard</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" onclick="resetForm()">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Add Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="add-staff-sidebar-column">
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
                                <li class="mb-2">✓ ID Proof</li>
                                <li class="mb-2">✓ Resume/CV</li>
                                <li class="mb-2">• Educational Certificates</li>
                                <li class="mb-2">• Experience Letters</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <div>
                                <h6 class="mb-3">
                                    <i class="bi bi-headset me-2"></i>Need Help?
                                </h6>
                                <p class="small text-muted mb-2">Contact HR department for assistance</p>
                                <a href="#" class="btn btn-sm btn-outline-primary w-100">
                                    <i class="bi bi-telephone me-2"></i>Contact HR
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
    
    <!-- Add Staff Page Scripts -->
    <script>
        // Pass server-side data to JavaScript
        const SERVER_DOCUMENT_TYPES = <%=documentTypesJson.toString()%>;
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/staff/js/add-staff.js?v=<%=System.currentTimeMillis()%>"></script>

    <%-- Toast Notification Logic --%>
    <%
        String successMessage = (String) session.getAttribute("successMessage");
        String errorMessage = (String) session.getAttribute("errorMessage");
        
        if (successMessage != null) {
            session.removeAttribute("successMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.success("<%= successMessage %>");
        });
    </script>
    <% } %>
    
    <%
        if (errorMessage != null) {
            session.removeAttribute("errorMessage");
    %>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined') toast.error("<%= errorMessage %>");
        });
    </script>
    <% } %>
</body>
</html>
