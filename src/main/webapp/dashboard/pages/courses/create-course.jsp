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
                <!-- Page Header -->
                <div class="create-course-header">
                    <div class="header-content">
                        <div class="header-left">
                            <h2 class="page-title">
                                <i class="bi bi-plus-circle-fill"></i>
                                Create New Course
                            </h2>
                            <p class="page-subtitle">Fill in the course details below</p>
                        </div>
                        <div class="header-right">
                            <a href="${pageContext.request.contextPath}/dashboard/pages/courses/all-courses.jsp" class="btn btn-outline-secondary">
                                <i class="bi bi-arrow-left"></i> Back
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Form Container -->
                <form id="createCourseForm" class="course-form">
                    
                    <!-- Basic Information -->
                    <div class="form-card">
                        <div class="form-card-header">
                            <h3><i class="bi bi-info-circle-fill"></i> Basic Information</h3>
                        </div>
                        <div class="form-card-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="courseCode" class="required">Course Code</label>
                                    <input type="text" id="courseCode" name="courseCode" class="form-control" 
                                           placeholder="e.g., CS-101" required>
                                </div>
                                <div class="form-group">
                                    <label for="courseName" class="required">Course Name</label>
                                    <input type="text" id="courseName" name="courseName" class="form-control" 
                                           placeholder="e.g., Introduction to Computer Science" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="category" class="required">Category</label>
                                    <select id="category" name="category" class="form-control" required>
                                        <option value="">Select Category</option>
                                        <option value="science">Science</option>
                                        <option value="technology">Technology</option>
                                        <option value="mathematics">Mathematics</option>
                                        <option value="arts">Arts</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="language">Language</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="level" class="required">Level</label>
                                    <select id="level" name="level" class="form-control" required>
                                        <option value="">Select Level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="description" class="required">Description</label>
                                <textarea id="description" name="description" class="form-control" 
                                          rows="4" placeholder="Brief description of the course" required></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Course Details -->
                    <div class="form-card">
                        <div class="form-card-header">
                            <h3><i class="bi bi-book-fill"></i> Course Details</h3>
                        </div>
                        <div class="form-card-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="duration" class="required">Duration</label>
                                    <div class="input-group">
                                        <input type="number" id="durationValue" name="durationValue" class="form-control" 
                                               placeholder="e.g., 6" min="1" required>
                                        <select id="durationUnit" name="durationUnit" class="form-select" required>
                                            <option value="days">Days</option>
                                            <option value="weeks">Weeks</option>
                                            <option value="months" selected>Months</option>
                                            <option value="years">Years</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="maxStudents" class="required">Max Students</label>
                                    <input type="number" id="maxStudents" name="maxStudents" class="form-control" 
                                           placeholder="e.g., 30" min="1" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="fee">Fee (₹)</label>
                                <input type="number" id="fee" name="fee" class="form-control" 
                                       placeholder="e.g., 5000" min="0" step="100">
                            </div>
                        </div>
                    </div>

                    <!-- Schedule -->
                    <div class="form-card">
                        <div class="form-card-header">
                            <h3><i class="bi bi-calendar-fill"></i> Schedule</h3>
                        </div>
                        <div class="form-card-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="startDate" class="required">Start Date</label>
                                    <input type="date" id="startDate" name="startDate" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="endDate" class="required">End Date</label>
                                    <input type="date" id="endDate" name="endDate" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="instructor" class="required">Instructor</label>
                                <select id="instructor" name="instructor" class="form-control" required>
                                    <option value="">Select Instructor</option>
                                    <option value="1">Dr. Rajesh Kumar</option>
                                    <option value="2">Prof. Anjali Singh</option>
                                    <option value="3">Dr. Priya Sharma</option>
                                    <option value="4">Ms. Kavita Desai</option>
                                    <option value="5">Mr. Suresh Reddy</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="modeOfConduct" class="required">Mode of Conduct</label>
                                <select id="modeOfConduct" name="modeOfConduct" class="form-control" required>
                                    <option value="">Select Mode</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">
                            <i class="bi bi-x-circle"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                            <i class="bi bi-check-circle"></i> Create Course
                        </button>
                    </div>
                </form>
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
