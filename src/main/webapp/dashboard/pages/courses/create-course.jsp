<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
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
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Create New Course</h2>
                            <p class="text-muted">Fill in the course details below</p>
                        </div>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Courses
                        </a>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-9">
                        <form id="createCourseForm" action="${pageContext.request.contextPath}/api/courses/create" method="POST">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="courseCode" class="form-label">Course Code <span class="required-star">*</span></label>
                                        <input type="text" class="form-control" id="courseCode" name="courseCode" required placeholder="e.g., CS-101">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="courseName" class="form-label">Course Name <span class="required-star">*</span></label>
                                        <input type="text" class="form-control" id="courseName" name="courseName" required placeholder="e.g., Introduction to Computer Science">
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="category" class="form-label">Category <span class="required-star">*</span></label>
                                        <select class="form-select" id="category" name="category" required>
                                            <option value="">Select Category</option>
                                            <option value="science">Science</option>
                                            <option value="technology">Technology</option>
                                            <option value="mathematics">Mathematics</option>
                                            <option value="arts">Arts</option>
                                            <option value="commerce">Commerce</option>
                                            <option value="language">Language</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="level" class="form-label">Level <span class="required-star">*</span></label>
                                        <select class="form-select" id="level" name="level" required>
                                            <option value="">Select Level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
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
                                        <label for="maxStudents" class="form-label">Max Students <span class="required-star">*</span></label>
                                        <input type="number" class="form-control" id="maxStudents" name="maxStudents" required placeholder="e.g., 30" min="1">
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="fee" class="form-label">Fee (₹)</label>
                                        <input type="number" class="form-control" id="fee" name="fee" placeholder="e.g., 5000" min="0" step="100">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Schedule -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-calendar-fill"></i> Schedule</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="startDate" class="form-label">Start Date <span class="required-star">*</span></label>
                                        <input type="date" class="form-control" id="startDate" name="startDate" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="endDate" class="form-label">End Date <span class="required-star">*</span></label>
                                        <input type="date" class="form-control" id="endDate" name="endDate" required>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="instructor" class="form-label">Instructor <span class="required-star">*</span></label>
                                        <select class="form-select" id="instructor" name="instructor" required>
                                            <option value="">Select Instructor</option>
                                            <option value="1">Dr. Rajesh Kumar</option>
                                            <option value="2">Prof. Anjali Singh</option>
                                            <option value="3">Dr. Priya Sharma</option>
                                            <option value="4">Ms. Kavita Desai</option>
                                            <option value="5">Mr. Suresh Reddy</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="modeOfConduct" class="form-label">Mode of Conduct <span class="required-star">*</span></label>
                                        <select class="form-select" id="modeOfConduct" name="modeOfConduct" required>
                                            <option value="">Select Mode</option>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="status" class="form-label">Status <span class="required-star">*</span></label>
                                        <select class="form-select" id="status" name="status" required>
                                            <option value="">Select Status</option>
                                            <option value="active" selected>Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
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
    <jsp:include page="/dashboard/components/toast-notification.jsp"/>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/create-course.js"></script>
</body>
</html>
