<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO" %>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl" %>
<%@ page import="com.eduhub.model.Staff" %>
<%@ page import="com.eduhub.model.StaffCertification" %>
<%@ page import="com.eduhub.model.StaffDocument" %>
<%
    String staffId = request.getParameter("id");
    String instituteId = (String) session.getAttribute("instituteId");
    Staff staff = null;
    List<StaffCertification> certifications = null;
    List<StaffDocument> documents = null;
    
    if (staffId != null && instituteId != null) {
        StaffDAO staffDAO = new StaffDAOImpl();
        try {
            staff = staffDAO.getStaffById(staffId, instituteId);
            if (staff != null) {
                certifications = staffDAO.getCertificationsByStaffId(staffId);
                documents = staffDAO.getDocumentsByStaffId(staffId);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    if (staff == null) {
        response.sendRedirect("all-staff.jsp");
        return;
    }

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
        <jsp:param name="title" value="Edit Staff - Dashboard - EduHub"/>
        <jsp:param name="description" value="Edit staff member details"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/staff/css/add-staff.css?v=<%=System.currentTimeMillis()%>">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="all-staff"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Edit Staff"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <div class="page-title-container">
                        <h2>Edit Staff Member</h2>
                        <p class="text-muted">Update staff member details</p>
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
                        <form id="editStaffForm" action="${pageContext.request.contextPath}/staff/update" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="staffId" value="<%= staff.getStaffId() %>">
                            
                            <!-- Personal Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-person-badge-fill"></i> Personal Information</h5>
                                
                                <div class="row align-items-center">
                                    <!-- Photo Upload Column -->
                                    <div class="col-lg-auto col-md-auto d-flex flex-column align-items-center mb-4 mb-md-0 pe-lg-5 border-end-lg">
                                        <div class="photo-upload-section">
                                            <div class="photo-preview" onclick="document.getElementById('staffPhoto').click()">
                                                <% if (staff.getProfilePhotoUrl() != null && !staff.getProfilePhotoUrl().isEmpty()) { %>
                                                    <img id="photoPreview" src="<%= staff.getProfilePhotoUrl() %>" alt="Staff Photo" style="display: block;">
                                                    <div class="photo-placeholder" id="photoPlaceholder" style="display: none;">
                                                        <i class="bi bi-camera-fill"></i>
                                                        <span class="small fw-bold">Change</span>
                                                    </div>
                                                <% } else { %>
                                                    <div class="photo-placeholder" id="photoPlaceholder">
                                                        <i class="bi bi-camera-fill"></i>
                                                        <span class="small fw-bold">Upload</span>
                                                    </div>
                                                    <img id="photoPreview" style="display: none;" alt="Staff Photo">
                                                <% } %>
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
                                                <jsp:param name="value" value="<%= staff.getFirstName() %>"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>
                                            
                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="text"/>
                                                <jsp:param name="id" value="lastName"/>
                                                <jsp:param name="name" value="lastName"/>
                                                <jsp:param name="label" value="Last Name"/>
                                                <jsp:param name="placeholder" value="Last Name"/>
                                                <jsp:param name="required" value="true"/>
                                                <jsp:param name="value" value="<%= staff.getLastName() %>"/>
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
                                                <jsp:param name="value" value="<%= staff.getDateOfBirth() %>"/>
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
                                                <jsp:param name="value" value="<%= staff.getGender() %>"/>
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
                                                <jsp:param name="value" value="<%= staff.getNationality() %>"/>
                                                <jsp:param name="class" value="col-md-6"/>
                                            </jsp:include>

                                            <jsp:include page="/dashboard/components/input-field.jsp">
                                                <jsp:param name="type" value="select"/>
                                                <jsp:param name="id" value="maritalStatus"/>
                                                <jsp:param name="name" value="maritalStatus"/>
                                                <jsp:param name="label" value="Marital Status"/>
                                                <jsp:param name="placeholder" value="Select Status"/>
                                                <jsp:param name="options" value="<%=maritalStatusOptions.toString()%>"/>
                                                <jsp:param name="value" value="<%= staff.getMaritalStatus() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getEmployeeId() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="role"/>
                                        <jsp:param name="name" value="role"/>
                                        <jsp:param name="label" value="Role/Position"/>
                                        <jsp:param name="placeholder" value="Select Role"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=roleOptions.toString()%>"/>
                                        <jsp:param name="value" value="<%= staff.getRole() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="joiningDate"/>
                                        <jsp:param name="name" value="joiningDate"/>
                                        <jsp:param name="label" value="Joining Date"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="value" value="<%= staff.getJoiningDate() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getEmploymentType() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="salary"/>
                                        <jsp:param name="name" value="salary"/>
                                        <jsp:param name="label" value="Monthly Salary"/>
                                        <jsp:param name="placeholder" value="5000"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="0"/>
                                        <jsp:param name="step" value="0.01"/>
                                        <jsp:param name="value" value="<%= staff.getSalary() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                </div>

                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="workShift"/>
                                        <jsp:param name="name" value="workShift"/>
                                        <jsp:param name="label" value="Work Shift"/>
                                        <jsp:param name="placeholder" value="Select Shift"/>
                                        <jsp:param name="options" value="<%=workShiftOptions.toString()%>"/>
                                        <jsp:param name="value" value="<%= staff.getWorkShift() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="reportingManager"/>
                                        <jsp:param name="name" value="reportingManager"/>
                                        <jsp:param name="label" value="Reporting Manager"/>
                                        <jsp:param name="placeholder" value="Manager name"/>
                                        <jsp:param name="value" value="<%= staff.getReportingManager() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
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
                                        <jsp:param name="value" value="<%= staff.getPhone() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="email"/>
                                        <jsp:param name="id" value="email"/>
                                        <jsp:param name="name" value="email"/>
                                        <jsp:param name="label" value="Email Address"/>
                                        <jsp:param name="placeholder" value="staff@example.com"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="value" value="<%= staff.getEmail() %>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label for="address" class="form-label">Current Address <span class="required-star">*</span></label>
                                            <textarea class="form-control" id="address" name="address" rows="3" required placeholder="Enter complete address"><%= staff.getAddress() %></textarea>
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
                                        <jsp:param name="value" value="<%= staff.getCity() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getState() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="postalCode"/>
                                        <jsp:param name="name" value="postalCode"/>
                                        <jsp:param name="label" value="Postal Code"/>
                                        <jsp:param name="placeholder" value="Enter postal code"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="value" value="<%= staff.getPostalCode() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getEmergencyContactName() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="tel"/>
                                        <jsp:param name="id" value="emergencyContactPhone"/>
                                        <jsp:param name="name" value="emergencyContactPhone"/>
                                        <jsp:param name="label" value="Emergency Contact Phone"/>
                                        <jsp:param name="placeholder" value="10-digit number"/>
                                        <jsp:param name="pattern" value="[0-9]{10}"/>
                                        <jsp:param name="value" value="<%= staff.getEmergencyContactPhone() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="emergencyContactRelation"/>
                                        <jsp:param name="name" value="emergencyContactRelation"/>
                                        <jsp:param name="label" value="Relationship"/>
                                        <jsp:param name="placeholder" value="e.g., Spouse, Parent"/>
                                        <jsp:param name="value" value="<%= staff.getEmergencyContactRelation() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getHighestQualification() %>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="specialization"/>
                                        <jsp:param name="name" value="specialization"/>
                                        <jsp:param name="label" value="Specialization/Field"/>
                                        <jsp:param name="placeholder" value="Select Specialization"/>
                                        <jsp:param name="options" value="<%=specializationOptions.toString()%>"/>
                                        <jsp:param name="value" value="<%= staff.getSpecialization() %>"/>
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
                                        <jsp:param name="value" value="<%= staff.getExperience() %>"/>
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
                                        <% if (certifications != null && !certifications.isEmpty()) { %>
                                        <div class="existing-certifications-section mb-4">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h6 class="mb-0" style="color: var(--text-primary); font-weight: 600;">
                                                    <i class="bi bi-files me-2" style="color: var(--primary-color);"></i>Existing Certifications
                                                </h6>
                                                <span class="badge bg-primary-subtle text-primary px-3 py-2" style="font-size: 0.85rem;"><%= certifications.size() %> certification<%= certifications.size() > 1 ? "s" : "" %></span>
                                            </div>
                                        </div>
                                        <% } %>
                                        
                                        <!-- Empty State Placeholder (hidden if certifications exist) -->
                                        <div id="certEmptyState" class="empty-state-box" style="<%= (certifications != null && !certifications.isEmpty()) ? "display: none;" : "" %>">
                                            <div class="empty-state-icon">
                                                <i class="bi bi-file-earmark-text"></i>
                                            </div>
                                            <h6 class="empty-state-title">No Certifications Added</h6>
                                            <p class="empty-state-text">Click "Add New" to add professional certifications</p>
                                        </div>
                                        
                                        <div id="certificationsContainer">
                                            <!-- Existing certifications -->
                                            <% 
                                            int certCounter = 0;
                                            StringBuilder initialIndices = new StringBuilder();
                                            if (certifications != null) { 
                                                for (int i = 0; i < certifications.size(); i++) {
                                                    StaffCertification cert = certifications.get(i);
                                                    certCounter++;
                                                    if (initialIndices.length() > 0) initialIndices.append(",");
                                                    initialIndices.append(certCounter);
                                            %>
                                                <div class="certification-item-enhanced" id="cert_<%= certCounter %>">
                                                    <div class="cert-header">
                                                        <div class="d-flex align-items-center gap-3">
                                                            <div class="cert-icon-wrapper">
                                                                <i class="bi bi-award-fill"></i>
                                                            </div>
                                                            <div>
                                                                <h6 class="cert-title mb-0"><%= cert.getName() %></h6>
                                                                <p class="cert-org mb-0"><%= cert.getIssuingOrganization() %></p>
                                                            </div>
                                                        </div>
                                                        <button type="button" class="btn-cert-close" aria-label="Close" onclick="markCertificationForDeletion('<%= cert.getCertificationId() %>', <%= certCounter %>)">
                                                            <i class="bi bi-x-lg"></i>
                                                        </button>
                                                    </div>
                                                    <input type="hidden" name="certId_<%= certCounter %>" value="<%= cert.getCertificationId() %>">
                                                    
                                                    <div class="cert-body">
                                                        <div class="row g-3">
                                                            <div class="col-md-6">
                                                                <label class="form-label">Certification Name <span class="text-danger">*</span></label>
                                                                <input type="text" class="form-control" name="certName_<%= certCounter %>" value="<%= cert.getName() %>" required>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <label class="form-label">Issuing Organization <span class="text-danger">*</span></label>
                                                                <input type="text" class="form-control" name="certOrg_<%= certCounter %>" value="<%= cert.getIssuingOrganization() %>" required>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <label class="form-label">Issue Date <span class="text-danger">*</span></label>
                                                                <input type="date" class="form-control" name="certDate_<%= certCounter %>" value="<%= cert.getIssueDate() %>" required>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <label class="form-label">Expiry Date</label>
                                                                <input type="date" class="form-control" name="certExpiry_<%= certCounter %>" value="<%= cert.getExpiryDate() != null ? cert.getExpiryDate() : "" %>">
                                                            </div>
                                                            <div class="col-md-6">
                                                                <label class="form-label">Credential ID</label>
                                                                <input type="text" class="form-control" name="certId_<%= certCounter %>_val" value="<%= cert.getCredentialId() != null ? cert.getCredentialId() : "" %>" placeholder="e.g., ABC-123-XYZ">
                                                            </div>
                                                            <div class="col-12">
                                                                <label class="form-label">Verification URL</label>
                                                                <input type="url" class="form-control" name="certUrl_<%= certCounter %>" value="<%= cert.getVerificationUrl() != null ? cert.getVerificationUrl() : "" %>" placeholder="https://...">
                                                            </div>
                                                            <div class="col-12">
                                                                <label class="form-label">Certificate File</label>
                                                                <div class="cert-file-wrapper" id="certFileWrapper_<%= certCounter %>">
                                                                    <% if (cert.getCertificateFileUrl() != null) { 
                                                                        String certExt = cert.getCertificateFileUrl().substring(cert.getCertificateFileUrl().lastIndexOf('.') + 1).toLowerCase();
                                                                        String certIconClass = "bi-file-earmark-pdf-fill";
                                                                        String certIconBg = "rgba(220, 53, 69, 0.1)";
                                                                        String certIconColor = "#dc3545";
                                                                        
                                                                        if (certExt.matches("jpg|jpeg|png|gif")) {
                                                                            certIconClass = "bi-file-earmark-image-fill";
                                                                            certIconBg = "rgba(13, 110, 253, 0.1)";
                                                                            certIconColor = "#0d6efd";
                                                                        }
                                                                    %>
                                                                    <div class="current-cert-file">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center gap-3">
                                                                                <div class="doc-icon-wrapper" style="width: 42px; height: 42px; font-size: 1.1rem; background: <%= certIconBg %>; color: <%= certIconColor %>;">
                                                                                    <i class="bi <%= certIconClass %>"></i>
                                                                                </div>
                                                                                <div>
                                                                                    <div class="fw-bold small text-primary">Current Certificate</div>
                                                                                    <a href="<%= cert.getCertificateFileUrl() %>" target="_blank" class="cert-view-link">
                                                                                        <i class="bi bi-eye me-1"></i>View File
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="document.getElementById('certFile_<%= certCounter %>').click()">
                                                                                <i class="bi bi-arrow-repeat me-1"></i>Replace
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <% } %>
                                                                    
                                                                    <input type="file" 
                                                                           id="certFile_<%= certCounter %>" 
                                                                           name="certFile_<%= certCounter %>" 
                                                                           class="form-control certification-file-input <%= cert.getCertificateFileUrl() != null ? "d-none" : "" %>" 
                                                                           accept=".pdf,.jpg,.jpeg,.png"
                                                                           onchange="handleCertFileSelect(this, '<%= certCounter %>')">
                                                                           
                                                                    <div class="replacement-info mt-2 p-2 border border-success rounded bg-success-subtle" id="certReplacementInfo_<%= certCounter %>" style="display:none;">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center gap-2 text-success">
                                                                                <i class="bi bi-check-circle-fill"></i>
                                                                                <div>
                                                                                    <div class="small fw-bold">Replacing with:</div>
                                                                                    <div class="small filename text-break"></div>
                                                                                </div>
                                                                            </div>
                                                                            <button type="button" class="btn-close btn-sm" onclick="cancelCertReplacement('<%= certCounter %>')"></button>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <% if (cert.getCertificateFileUrl() == null) { %>
                                                                        <div class="form-text small mt-2"><i class="bi bi-info-circle me-1"></i>Upload PDF or image (Max 2MB)</div>
                                                                    <% } %>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <% } } %>
                                        </div>
                                        <input type="hidden" name="certificationIndices" id="certificationIndices" value="<%= initialIndices.toString() %>">
                                        <input type="hidden" name="deletedCertificationIds" id="deletedCertificationIds" value="">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Document Uploads -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-file-earmark-arrow-up-fill"></i> Document Uploads</h5>
                                
                                <div class="alert alert-info d-flex align-items-center mb-4" style="background: rgba(13, 110, 253, 0.08); border: 1px solid rgba(13, 110, 253, 0.2); border-radius: 10px;">
                                    <i class="bi bi-info-circle-fill me-2" style="font-size: 1.25rem; color: var(--primary-color);"></i>
                                    <span style="color: var(--text-primary); font-weight: 500;">Upload new documents or manage existing ones below.</span>
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
                                <input type="hidden" name="deletedDocumentIds" id="deletedDocumentIds" value="">

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

                                <% if (documents != null && !documents.isEmpty()) { %>
                                <div class="existing-documents-section mt-4">
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <h6 class="mb-0" style="color: var(--text-primary); font-weight: 600;">
                                            <i class="bi bi-files me-2" style="color: var(--primary-color);"></i>Existing Documents
                                        </h6>
                                        <span class="badge bg-primary-subtle text-primary px-3 py-2" style="font-size: 0.85rem;"><%= documents.size() %> file<%= documents.size() > 1 ? "s" : "" %></span>
                                    </div>
                                </div>
                                <% } %>

                                <div class="document-list" id="documentList">
                                    <!-- Existing documents -->
                                    <% if (documents != null) { 
                                        for (StaffDocument doc : documents) {
                                            String fileExt = doc.getDocumentUrl().substring(doc.getDocumentUrl().lastIndexOf('.') + 1).toLowerCase();
                                            String iconClass = "bi-file-earmark-pdf";
                                            String iconBg = "rgba(220, 53, 69, 0.1)";
                                            String iconColor = "#dc3545";
                                            
                                            if (fileExt.matches("jpg|jpeg|png|gif")) {
                                                iconClass = "bi-file-earmark-image";
                                                iconBg = "rgba(13, 110, 253, 0.1)";
                                                iconColor = "#0d6efd";
                                            } else if (fileExt.matches("doc|docx")) {
                                                iconClass = "bi-file-earmark-word";
                                                iconBg = "rgba(25, 135, 84, 0.1)";
                                                iconColor = "#198754";
                                            } else if (fileExt.matches("xls|xlsx")) {
                                                iconClass = "bi-file-earmark-excel";
                                                iconBg = "rgba(25, 135, 84, 0.1)";
                                                iconColor = "#198754";
                                            }
                                    %>
                                        <div class="document-item-enhanced" id="doc_<%= doc.getDocumentId() %>">
                                            <input type="hidden" name="existingDocId" value="<%= doc.getDocumentId() %>">
                                            
                                            <div class="d-flex align-items-center gap-3 flex-wrap w-100">
                                                <div class="doc-icon-wrapper" style="background: <%= iconBg %>; color: <%= iconColor %>;">
                                                    <i class="bi <%= iconClass %>"></i>
                                                </div>
                                                
                                                <div class="doc-info-wrapper flex-grow-1">
                                                    <div class="d-flex align-items-center gap-2 mb-1">
                                                        <h6 class="doc-title mb-0"><%
                                                            String[] typeParts = null;
                                                            for(String type : DropdownData.DOCUMENT_TYPES) {
                                                                String[] parts = type.split("\\|");
                                                                if (parts[0].equals(doc.getDocumentType())) {
                                                                    typeParts = parts;
                                                                    break;
                                                                }
                                                            }
                                                            out.print(typeParts != null ? typeParts[1] : "Document");
                                                        %></h6>
                                                        <span class="badge bg-success-subtle text-success" style="font-size: 0.7rem; padding: 3px 8px;">Uploaded</span>
                                                    </div>
                                                    <a href="<%= doc.getDocumentUrl() %>" target="_blank" class="doc-link">
                                                        <i class="bi bi-eye me-1"></i>View Document
                                                    </a>
                                                </div>
                                                
                                                <div class="doc-type-selector" style="min-width: 220px;">
                                                    <select class="form-select form-select-sm" name="docType_<%= doc.getDocumentId() %>" style="border-radius: 8px;">
                                                        <% for(String type : DropdownData.DOCUMENT_TYPES) { 
                                                            String[] parts = type.split("\\|");
                                                            String val = parts[0];
                                                            String label = parts[1];
                                                            boolean selected = val.equals(doc.getDocumentType());
                                                        %>
                                                            <option value="<%= val %>" <%= selected ? "selected" : "" %>><%= label %></option>
                                                        <% } %>
                                                    </select>
                                                </div>
                                                
                                                <div class="doc-actions-wrapper d-flex gap-2">
                                                    <input type="file" id="replace_<%= doc.getDocumentId() %>" name="docFile_<%= doc.getDocumentId() %>" style="display:none" onchange="handleReplacement(this, '<%= doc.getDocumentId() %>')">
                                                    <button type="button" class="btn-doc-action btn-replace" onclick="triggerReplacement('<%= doc.getDocumentId() %>')" title="Replace File">
                                                        <i class="bi bi-arrow-repeat"></i>
                                                    </button>
                                                    <button type="button" class="btn-doc-action btn-delete" onclick="markDocumentForDeletion('<%= doc.getDocumentId() %>')" title="Remove">
                                                        <i class="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    <% } } %>
                                </div>
                            </div>
                            
                            <!-- Additional Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Additional Information</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="status" class="form-label">Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="status" name="status" required>
                                            <option value="Yet to Onboard" <%= "Yet to Onboard".equals(staff.getStatus()) ? "selected" : "" %>>Yet to Onboard</option>
                                            <option value="Active" <%= "Active".equals(staff.getStatus()) ? "selected" : "" %>>Active</option>
                                            <option value="Inactive" <%= "Inactive".equals(staff.getStatus()) ? "selected" : "" %>>Inactive</option>
                                            <option value="On Leave" <%= "On Leave".equals(staff.getStatus()) ? "selected" : "" %>>On Leave</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/staff/all-staff.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Update Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="add-staff-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Update Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Review all fields before saving</li>
                                <li class="mb-2">Uploading new documents will replace old ones</li>
                                <li class="mb-2">Ensure email and phone are unique</li>
                            </ul>
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
    
    <!-- Edit Staff Page Scripts -->
    <script>
        // Pass server-side data to JavaScript
        const SERVER_DOCUMENT_TYPES = <%=documentTypesJson.toString()%>;
        const INITIAL_CERT_COUNT = <%= certCounter %>;
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/staff/js/edit-staff.js?v=<%=System.currentTimeMillis()%>"></script>

    <%-- Toast Notification Logic --%>
    <%
        String successMessage = (String) session.getAttribute("successMessage");
        String errorMessage = (String) session.getAttribute("errorMessage");
        
        // Check request attributes as well (for forwards from Servlet on error)
        if (errorMessage == null) {
            errorMessage = (String) request.getAttribute("error");
        }
        
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
