<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%@ page import="com.eduhub.dao.interfaces.CourseDAO" %>
<%@ page import="com.eduhub.dao.impl.CourseDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.StaffDAO" %>
<%@ page import="com.eduhub.dao.impl.StaffDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.BranchDAO" %>
<%@ page import="com.eduhub.dao.impl.BranchDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.BatchDAO" %>
<%@ page import="com.eduhub.dao.impl.BatchDAOImpl" %>
<%@ page import="com.eduhub.model.Course" %>
<%@ page import="com.eduhub.model.Staff" %>
<%@ page import="com.eduhub.model.Branch" %>
<%@ page import="com.eduhub.model.Batch" %>
<%
    String instituteId = (String) session.getAttribute("instituteId");
    if (instituteId == null) {
        response.sendRedirect(request.getContextPath() + "/public/login.jsp");
        return;
    }

    CourseDAO courseDAO = new CourseDAOImpl();
    StaffDAO staffDAO = new StaffDAOImpl();
    BranchDAO branchDAO = new BranchDAOImpl();
    BatchDAO batchDAO = new BatchDAOImpl();

    // Check for Edit Mode
    String batchId = request.getParameter("id");
    Batch batch = null;
    boolean isEditMode = false;
    
    if (batchId != null && !batchId.trim().isEmpty()) {
        batch = batchDAO.getBatchById(batchId, instituteId);
        if (batch != null) {
            isEditMode = true;
        }
    }

    // Fetch Branches
    List<Branch> branches = branchDAO.getAllBranches(instituteId);
    StringBuilder branchOptions = new StringBuilder();
    for(Branch branch : branches) {
        branchOptions.append(branch.getBranchId()).append("|").append(branch.getBranchName()).append(" (").append(branch.getBranchCode()).append(")").append(",");
    }
    if(branchOptions.length() > 0) branchOptions.setLength(branchOptions.length() - 1);

    // Fetch Courses
    List<Course> courses = courseDAO.getAllCourses(instituteId);
    StringBuilder courseOptions = new StringBuilder();
    for(Course course : courses) {
        courseOptions.append(course.getCourseId()).append("|").append(course.getCourseName()).append(" (").append(course.getCourseCode()).append(")").append(",");
    }
    if(courseOptions.length() > 0) courseOptions.setLength(courseOptions.length() - 1);

    // Fetch Trainers (Department: Trainer)
    List<Staff> trainers = staffDAO.getStaffByDepartment(instituteId, "Trainer");
    StringBuilder trainerOptions = new StringBuilder();
    for(Staff trainer : trainers) {
        String fullName = trainer.getFirstName() + " " + trainer.getLastName();
        trainerOptions.append(trainer.getStaffId()).append("|").append(fullName).append(",");
    }
    if(trainerOptions.length() > 0) trainerOptions.setLength(trainerOptions.length() - 1);

    StringBuilder modeOptions = new StringBuilder();
    for(String item : DropdownData.MODES_OF_CONDUCT) {
        modeOptions.append(item).append("|").append(item).append(",");
    }
    if(modeOptions.length() > 0) modeOptions.setLength(modeOptions.length() - 1);

    StringBuilder statusOptions = new StringBuilder();
    for(String item : DropdownData.BATCH_STATUSES) {
        statusOptions.append(item).append("|").append(item).append(",");
    }
    if(statusOptions.length() > 0) statusOptions.setLength(statusOptions.length() - 1);
    
    String pageTitle = isEditMode ? "Edit Batch" : "Create Batch";
    String pageDesc = isEditMode ? "Update batch details" : "Create new batch in EduHub";
    String fullPageTitle = pageTitle + " - Dashboard - EduHub";
    String actionUrl = isEditMode ? "/api/batches/update" : "/api/batches/create";
    String submitBtnText = isEditMode ? "Update Batch" : "Create Batch";
    
    String classDays = (batch != null && batch.getClassDays() != null) ? batch.getClassDays().toLowerCase() : "";

    // Pre-calculate values for JSP expressions to avoid quoting issues
    String batchCodeVal = isEditMode ? batch.getBatchCode() : (request.getParameter("batchCode") != null ? request.getParameter("batchCode") : "");
    String batchNameVal = isEditMode ? batch.getBatchName() : "";
    String courseIdVal = isEditMode ? batch.getCourseId() : "";
    String instructorIdVal = isEditMode ? batch.getInstructorId() : "";
    String branchIdVal = isEditMode ? batch.getBranchId() : "";
    String startDateVal = (isEditMode && batch.getStartDate() != null) ? batch.getStartDate().toString() : "";
    String endDateVal = (isEditMode && batch.getEndDate() != null) ? batch.getEndDate().toString() : "";
    String startTimeVal = (isEditMode && batch.getStartTime() != null) ? batch.getStartTime().toString() : "";
    String endTimeVal = (isEditMode && batch.getEndTime() != null) ? batch.getEndTime().toString() : "";
    String maxCapacityVal = isEditMode ? String.valueOf(batch.getMaxCapacity()) : "";
    String modeOfConductVal = isEditMode ? batch.getModeOfConduct() : "";
    String statusVal = isEditMode ? batch.getStatus() : "";
    String classroomLocationVal = (isEditMode && batch.getClassroomLocation() != null) ? batch.getClassroomLocation() : "";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="<%= fullPageTitle %>"/>
        <jsp:param name="description" value="<%= pageDesc %>"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/create-course.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="create-batch"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="<%= pageTitle %>"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2><%= pageTitle %></h2>
                        <p class="text-muted"><%= isEditMode ? "Edit existing batch details" : "Add a new batch for a course" %></p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp"/>
                            <jsp:param name="text" value="Back to Batches"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="create-course-layout">
                    <div class="create-course-form-column">
                        <form id="createBatchForm" action="${pageContext.request.contextPath}<%= actionUrl %>" method="POST">
                            <% if(isEditMode) { %>
                                <input type="hidden" name="batchId" value="<%= batch.getBatchId() %>">
                            <% } %>
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="batchCode"/>
                                        <jsp:param name="name" value="batchCode"/>
                                        <jsp:param name="label" value="Batch Code"/>
                                        <jsp:param name="placeholder" value="e.g., CS-2025-A"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="upc-scan"/>
                                        <jsp:param name="value" value="<%= batchCodeVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="batchName"/>
                                        <jsp:param name="name" value="batchName"/>
                                        <jsp:param name="label" value="Batch Name"/>
                                        <jsp:param name="placeholder" value="e.g., Morning Batch, Weekend Batch"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-8"/>
                                        <jsp:param name="icon" value="tag"/>
                                        <jsp:param name="value" value="<%= batchNameVal %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="courseId"/>
                                        <jsp:param name="name" value="courseId"/>
                                        <jsp:param name="label" value="Select Course"/>
                                        <jsp:param name="placeholder" value="Choose a course..."/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=courseOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="book"/>
                                        <jsp:param name="value" value="<%= courseIdVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="instructorId"/>
                                        <jsp:param name="name" value="instructorId"/>
                                        <jsp:param name="label" value="Trainer"/>
                                        <jsp:param name="placeholder" value="Choose trainer..."/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=trainerOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="person-badge"/>
                                        <jsp:param name="value" value="<%= instructorIdVal %>"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="branchId"/>
                                        <jsp:param name="name" value="branchId"/>
                                        <jsp:param name="label" value="Branch"/>
                                        <jsp:param name="placeholder" value="Select Branch..."/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=branchOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="building"/>
                                        <jsp:param name="value" value="<%= branchIdVal %>"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Schedule Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-calendar-fill"></i> Schedule Details</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="startDate"/>
                                        <jsp:param name="name" value="startDate"/>
                                        <jsp:param name="label" value="Start Date"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="calendar-event"/>
                                        <jsp:param name="value" value="<%= startDateVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="date"/>
                                        <jsp:param name="id" value="endDate"/>
                                        <jsp:param name="name" value="endDate"/>
                                        <jsp:param name="label" value="Expected End Date"/>
                                        <jsp:param name="required" value="false"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="calendar-check"/>
                                        <jsp:param name="value" value="<%= endDateVal %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="time"/>
                                        <jsp:param name="id" value="startTime"/>
                                        <jsp:param name="name" value="startTime"/>
                                        <jsp:param name="label" value="Start Time"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="clock"/>
                                        <jsp:param name="value" value="<%= startTimeVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="time"/>
                                        <jsp:param name="id" value="endTime"/>
                                        <jsp:param name="name" value="endTime"/>
                                        <jsp:param name="label" value="End Time"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="clock-history"/>
                                        <jsp:param name="value" value="<%= endTimeVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="maxCapacity"/>
                                        <jsp:param name="name" value="maxCapacity"/>
                                        <jsp:param name="label" value="Max Students"/>
                                        <jsp:param name="placeholder" value="e.g., 30"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="1"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="people"/>
                                        <jsp:param name="value" value="<%= maxCapacityVal %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-calendar-week"></i> Class Days <span class="text-danger">*</span></label>
                                    <div class="d-flex flex-wrap gap-3 p-3 border rounded bg-light">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="monday" name="classDays" value="monday" <%= classDays.contains("monday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="monday">Monday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="tuesday" name="classDays" value="tuesday" <%= classDays.contains("tuesday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="tuesday">Tuesday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="wednesday" name="classDays" value="wednesday" <%= classDays.contains("wednesday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="wednesday">Wednesday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="thursday" name="classDays" value="thursday" <%= classDays.contains("thursday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="thursday">Thursday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="friday" name="classDays" value="friday" <%= classDays.contains("friday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="friday">Friday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="saturday" name="classDays" value="saturday" <%= classDays.contains("saturday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="saturday">Saturday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="sunday" name="classDays" value="sunday" <%= classDays.contains("sunday") ? "checked" : "" %>>
                                            <label class="form-check-label" for="sunday">Sunday</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Batch Settings -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-gear-fill"></i> Batch Settings</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="modeOfConduct"/>
                                        <jsp:param name="name" value="modeOfConduct"/>
                                        <jsp:param name="label" value="Mode of Conduct"/>
                                        <jsp:param name="placeholder" value="Select Mode"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=modeOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="laptop"/>
                                        <jsp:param name="value" value="<%= modeOfConductVal %>"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="batchStatus"/>
                                        <jsp:param name="name" value="batchStatus"/>
                                        <jsp:param name="label" value="Status"/>
                                        <jsp:param name="placeholder" value="Select Status"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=statusOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="toggle-on"/>
                                        <jsp:param name="value" value="<%= statusVal %>"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="classroomLocation"/>
                                        <jsp:param name="name" value="classroomLocation"/>
                                        <jsp:param name="label" value="Classroom/Location"/>
                                        <jsp:param name="placeholder" value="e.g., Room 101, Building A or Zoom Meeting ID"/>
                                        <jsp:param name="class" value="col-md-12"/>
                                        <jsp:param name="icon" value="geo-alt"/>
                                        <jsp:param name="value" value="<%= classroomLocationVal %>"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" id="resetBtn">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> <%= submitBtnText %>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sidebar -->
                    <div class="create-course-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Batch Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Fill all required fields marked with <span class="required-star">*</span></li>
                                <li class="mb-2">Batch Code must be unique</li>
                                <li class="mb-2">Ensure start date is before end date</li>
                                <li class="mb-2">Check trainer availability before assigning</li>
                                <li class="mb-2">Verify classroom capacity for offline batches</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <h6 class="mb-3">
                                <i class="bi bi-lightbulb me-2"></i>Tips
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Use consistent naming for batches</li>
                                <li class="mb-2">Set realistic capacity limits</li>
                                <li class="mb-2">Double-check time slots to avoid conflicts</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <div>
                                <h6 class="mb-3">
                                    <i class="bi bi-headset me-2"></i>Need Help?
                                </h6>
                                <p class="small text-muted mb-2">Contact the academic coordinator for assistance</p>
                                <a href="#" class="btn btn-sm btn-outline-primary w-100">
                                    <i class="bi bi-envelope me-2"></i>Contact Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Reset button handler
        document.getElementById('resetBtn').addEventListener('click', function() {
            if (typeof showConfirmationModal === 'function') {
                showConfirmationModal({
                    title: 'Reset Form',
                    message: 'Are you sure you want to reset the form? All entered data will be lost.',
                    confirmText: 'Reset',
                    cancelText: 'Cancel',
                    confirmClass: 'btn-warning',
                    icon: 'bi-arrow-clockwise text-warning',
                    onConfirm: function() {
                        document.getElementById('createBatchForm').reset();
                        if (typeof toast !== 'undefined') {
                            toast.info('Form has been reset');
                        }
                    }
                });
            } else {
                if(confirm('Are you sure you want to reset the form?')) {
                    document.getElementById('createBatchForm').reset();
                }
            }
        });
        
        // Date validation - end date should be after start date
        document.getElementById('endDate').addEventListener('change', function() {
            const startDate = document.getElementById('startDate').value;
            const endDate = this.value;
            
            if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
                alert('Expected end date must be after start date');
                this.value = '';
            }
        });
        
        // Time validation - end time should be after start time
        document.getElementById('endTime').addEventListener('change', function() {
            const startTime = document.getElementById('startTime').value;
            const endTime = this.value;
            
            if (startTime && endTime && endTime <= startTime) {
                alert('End time must be after start time');
                this.value = '';
            }
        });

        // Check for duplicate batch code error
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('error') === 'duplicate_code') {
                if (typeof toast !== 'undefined') {
                    toast.error('Batch Code already exists! Please use a unique code.');
                }
                // Highlight the batch code input
                const batchCodeInput = document.getElementById('batchCode');
                if (batchCodeInput) {
                    batchCodeInput.classList.add('is-invalid');
                    batchCodeInput.focus();
                    
                    // Remove invalid class on input
                    batchCodeInput.addEventListener('input', function() {
                        this.classList.remove('is-invalid');
                    });
                }
                
                // Clean up URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }
        });
    </script>
</body>
</html>
