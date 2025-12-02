<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%
    // Helper to build options string for input-field component
    StringBuilder categoryOptions = new StringBuilder();
    for(String item : DropdownData.COURSE_CATEGORIES) {
        categoryOptions.append(item).append("|").append(item).append(",");
    }
    if(categoryOptions.length() > 0) categoryOptions.setLength(categoryOptions.length() - 1);

    StringBuilder levelOptions = new StringBuilder();
    for(String item : DropdownData.COURSE_LEVELS) {
        levelOptions.append(item).append("|").append(item).append(",");
    }
    if(levelOptions.length() > 0) levelOptions.setLength(levelOptions.length() - 1);

    StringBuilder durationUnitOptions = new StringBuilder();
    for(String item : DropdownData.DURATION_UNITS) {
        durationUnitOptions.append(item).append("|").append(item).append(",");
    }
    if(durationUnitOptions.length() > 0) durationUnitOptions.setLength(durationUnitOptions.length() - 1);

    StringBuilder statusOptions = new StringBuilder();
    for(String item : DropdownData.COURSE_STATUSES) {
        statusOptions.append(item).append("|").append(item).append(",");
    }
    if(statusOptions.length() > 0) statusOptions.setLength(statusOptions.length() - 1);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Create Course - Dashboard - EduHub"/>
        <jsp:param name="description" value="Create new course in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/create-course.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="create-course"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Create Course"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Create New Course</h2>
                        <p class="text-muted">Fill in the course details below</p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp"/>
                            <jsp:param name="text" value="Back to Courses"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="create-course-layout">
                    <div class="create-course-form-column">
                        <form id="createCourseForm" action="${pageContext.request.contextPath}/api/courses/create" method="POST">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="courseCode"/>
                                        <jsp:param name="name" value="courseCode"/>
                                        <jsp:param name="label" value="Course Code"/>
                                        <jsp:param name="placeholder" value="e.g., CS-101"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="upc-scan"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="courseName"/>
                                        <jsp:param name="name" value="courseName"/>
                                        <jsp:param name="label" value="Course Name"/>
                                        <jsp:param name="placeholder" value="e.g., Introduction to Computer Science"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="book"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="category"/>
                                        <jsp:param name="name" value="category"/>
                                        <jsp:param name="label" value="Category"/>
                                        <jsp:param name="placeholder" value="Select Category"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=categoryOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="tags"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="level"/>
                                        <jsp:param name="name" value="level"/>
                                        <jsp:param name="label" value="Level"/>
                                        <jsp:param name="placeholder" value="Select Level"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=levelOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="bar-chart"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="textarea"/>
                                        <jsp:param name="id" value="description"/>
                                        <jsp:param name="name" value="description"/>
                                        <jsp:param name="label" value="Description"/>
                                        <jsp:param name="placeholder" value="Brief description of the course"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="rows" value="4"/>
                                        <jsp:param name="icon" value="file-text"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Course Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-book-fill"></i> Course Details</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="durationValue"/>
                                        <jsp:param name="name" value="durationValue"/>
                                        <jsp:param name="label" value="Duration"/>
                                        <jsp:param name="placeholder" value="e.g., 6"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="min" value="1"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="clock"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="durationUnit"/>
                                        <jsp:param name="name" value="durationUnit"/>
                                        <jsp:param name="label" value="Duration Unit"/>
                                        <jsp:param name="placeholder" value="Select Unit"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=durationUnitOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="hourglass-split"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="number"/>
                                        <jsp:param name="id" value="fee"/>
                                        <jsp:param name="name" value="fee"/>
                                        <jsp:param name="label" value="Fee (₹)"/>
                                        <jsp:param name="placeholder" value="e.g., 5000"/>
                                        <jsp:param name="min" value="0"/>
                                        <jsp:param name="step" value="100"/>
                                        <jsp:param name="class" value="col-md-4"/>
                                        <jsp:param name="icon" value="currency-rupee"/>
                                    </jsp:include>
                                </div>
                            </div>
                            
                            <!-- Additional Settings -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-gear-fill"></i> Course Settings</h5>
                                
                                <div class="row g-3 mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="status"/>
                                        <jsp:param name="name" value="status"/>
                                        <jsp:param name="label" value="Status"/>
                                        <jsp:param name="placeholder" value="Select Status"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="<%=statusOptions.toString()%>"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="helperText" value="Active courses can have batches created for them"/>
                                        <jsp:param name="icon" value="toggle-on"/>
                                    </jsp:include>

                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="certificateOffered"/>
                                        <jsp:param name="name" value="certificateOffered"/>
                                        <jsp:param name="label" value="Certificate Offered"/>
                                        <jsp:param name="options" value="yes|Yes,no|No"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                        <jsp:param name="icon" value="award"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="alert alert-info mb-0">
                                    <i class="bi bi-info-circle"></i> <strong>Note:</strong> After creating the course, you can create batches with specific schedules, trainers, and timing in the "Create Batch" section.
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="form-action-buttons d-flex gap-3 justify-content-end">
                                <a href="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp" class="btn btn-outline-secondary px-4" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </a>
                                <button type="button" class="btn btn-outline-primary px-4" id="resetBtn">
                                    <i class="bi bi-arrow-clockwise"></i> Reset
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-check-circle-fill"></i> Create Course
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sidebar -->
                    <div class="create-course-sidebar-column">
                        <div class="card-custom mb-3">
                            <h6 class="mb-3">
                                <i class="bi bi-info-circle me-2"></i>Course Guidelines
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Fill all required fields marked with <span class="required-star">*</span></li>
                                <li class="mb-2">Course Code must be unique</li>
                                <li class="mb-2">Provide a clear and concise description</li>
                                <li class="mb-2">Set appropriate duration and fee</li>
                                <li class="mb-2">Ensure status is 'Active' for immediate use</li>
                            </ul>
                            
                            <hr class="my-3">
                            
                            <h6 class="mb-3">
                                <i class="bi bi-lightbulb me-2"></i>Tips
                            </h6>
                            <ul class="small text-muted mb-0 ps-3">
                                <li class="mb-2">Use standard naming conventions</li>
                                <li class="mb-2">Categorize courses correctly for better filtering</li>
                                <li class="mb-2">Double-check fee structure</li>
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
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/create-course.js"></script>
</body>
</html>
