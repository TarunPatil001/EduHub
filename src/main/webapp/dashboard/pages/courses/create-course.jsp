<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
                
                <div class="row">
                    <div class="col-lg-9">
                        <form id="createCourseForm" action="${pageContext.request.contextPath}/api/courses/create" method="POST">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="courseCode"/>
                                        <jsp:param name="name" value="courseCode"/>
                                        <jsp:param name="label" value="Course Code"/>
                                        <jsp:param name="placeholder" value="e.g., CS-101"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="text"/>
                                        <jsp:param name="id" value="courseName"/>
                                        <jsp:param name="name" value="courseName"/>
                                        <jsp:param name="label" value="Course Name"/>
                                        <jsp:param name="placeholder" value="e.g., Introduction to Computer Science"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="row mb-3">
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="category"/>
                                        <jsp:param name="name" value="category"/>
                                        <jsp:param name="label" value="Category"/>
                                        <jsp:param name="placeholder" value="Select Category"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="science|Science,technology|Technology,mathematics|Mathematics,arts|Arts,commerce|Commerce,language|Language"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                    
                                    <jsp:include page="/dashboard/components/input-field.jsp">
                                        <jsp:param name="type" value="select"/>
                                        <jsp:param name="id" value="level"/>
                                        <jsp:param name="name" value="level"/>
                                        <jsp:param name="label" value="Level"/>
                                        <jsp:param name="placeholder" value="Select Level"/>
                                        <jsp:param name="required" value="true"/>
                                        <jsp:param name="options" value="beginner|Beginner,intermediate|Intermediate,advanced|Advanced"/>
                                        <jsp:param name="class" value="col-md-6"/>
                                    </jsp:include>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description <span class="required-star">*</span></label>
                                    <textarea class="form-control" id="description" name="description" rows="4" required placeholder="Brief description of the course"></textarea>
                                </div>
                            </div>
                            
                            <!-- Course Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-book-fill"></i> Course Details</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="durationValue" class="form-label">Duration <span class="required-star">*</span></label>
                                        <input type="number" class="form-control" id="durationValue" name="durationValue" required placeholder="e.g., 6" min="1">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="durationUnit" class="form-label">Duration Unit <span class="required-star">*</span></label>
                                        <select class="form-select" id="durationUnit" name="durationUnit" required>
                                            <option value="days">Days</option>
                                            <option value="weeks">Weeks</option>
                                            <option value="months" selected>Months</option>
                                            <option value="years">Years</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="fee" class="form-label">Fee (₹)</label>
                                        <input type="number" class="form-control" id="fee" name="fee" placeholder="e.g., 5000" min="0" step="100">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Additional Settings -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-gear-fill"></i> Course Settings</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="status" class="form-label">Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="status" name="status" required>
                                            <option value="">Select Status</option>
                                            <option value="active" selected>Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <small class="text-muted">Active courses can have batches created for them</small>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="certificateOffered" class="form-label">Certificate Offered</label>
                                        <select class="form-select" id="certificateOffered" name="certificateOffered">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info mb-0">
                                    <i class="bi bi-info-circle"></i> <strong>Note:</strong> After creating the course, you can create batches with specific schedules, instructors, and timing in the "Create Batch" section.
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" class="btn btn-secondary" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Use existing dashboard components -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <jsp:include page="/common/toast-notification.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/create-course.js"></script>
</body>
</html>
