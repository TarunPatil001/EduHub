<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Create Batch - Dashboard - EduHub"/>
        <jsp:param name="description" value="Create new batch in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="create-batch"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Create Batch"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Create New Batch</h2>
                            <p class="text-muted">Add a new batch for a course</p>
                        </div>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Batches
                        </a>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card-custom">
                            <h5 class="mb-4"><i class="bi bi-plus-circle"></i> Batch Information</h5>
                            
                            <form id="createBatchForm" action="${pageContext.request.contextPath}/api/batches/create" method="POST">
                                <!-- Batch Basic Information -->
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="batchName" class="form-label">Batch Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="batchName" name="batchName" required placeholder="e.g., Batch A, Morning Batch">
                                        <div class="invalid-feedback">Please provide a batch name.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="batchCode" class="form-label">Batch Code <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="batchCode" name="batchCode" required placeholder="e.g., CS-2024-A">
                                        <div class="invalid-feedback">Please provide a unique batch code.</div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="courseId" class="form-label">Select Course <span class="text-danger">*</span></label>
                                        <select class="form-select" id="courseId" name="courseId" required>
                                            <option value="">Choose a course...</option>
                                            <option value="1">Computer Science - Foundation</option>
                                            <option value="2">Data Science - Advanced</option>
                                            <option value="3">Web Development - Full Stack</option>
                                            <option value="4">Mobile App Development</option>
                                            <option value="5">Digital Marketing</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a course.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="instructorId" class="form-label">Primary Instructor</label>
                                        <select class="form-select" id="instructorId" name="instructorId">
                                            <option value="">Choose an instructor...</option>
                                            <option value="1">Dr. John Smith</option>
                                            <option value="2">Prof. Sarah Johnson</option>
                                            <option value="3">Mr. Michael Brown</option>
                                            <option value="4">Ms. Emily Davis</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Schedule Information -->
                                <h6 class="mt-4 mb-3"><i class="bi bi-calendar3"></i> Schedule Details</h6>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="startDate" class="form-label">Start Date <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="startDate" name="startDate" required>
                                        <div class="invalid-feedback">Please select a start date.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="endDate" class="form-label">End Date <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="endDate" name="endDate" required>
                                        <div class="invalid-feedback">Please select an end date.</div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="startTime" class="form-label">Start Time <span class="text-danger">*</span></label>
                                        <input type="time" class="form-control" id="startTime" name="startTime" required>
                                        <div class="invalid-feedback">Please select a start time.</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="endTime" class="form-label">End Time <span class="text-danger">*</span></label>
                                        <input type="time" class="form-control" id="endTime" name="endTime" required>
                                        <div class="invalid-feedback">Please select an end time.</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="duration" class="form-label">Duration (weeks)</label>
                                        <input type="number" class="form-control" id="duration" name="duration" min="1" placeholder="12">
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Class Days <span class="text-danger">*</span></label>
                                    <div class="d-flex flex-wrap gap-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="monday" name="classDays" value="monday">
                                            <label class="form-check-label" for="monday">Monday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="tuesday" name="classDays" value="tuesday">
                                            <label class="form-check-label" for="tuesday">Tuesday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="wednesday" name="classDays" value="wednesday">
                                            <label class="form-check-label" for="wednesday">Wednesday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="thursday" name="classDays" value="thursday">
                                            <label class="form-check-label" for="thursday">Thursday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="friday" name="classDays" value="friday">
                                            <label class="form-check-label" for="friday">Friday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="saturday" name="classDays" value="saturday">
                                            <label class="form-check-label" for="saturday">Saturday</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="sunday" name="classDays" value="sunday">
                                            <label class="form-check-label" for="sunday">Sunday</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capacity & Enrollment -->
                                <h6 class="mt-4 mb-3"><i class="bi bi-people"></i> Capacity & Enrollment</h6>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="maxCapacity" class="form-label">Max Capacity <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" id="maxCapacity" name="maxCapacity" required min="1" placeholder="30">
                                        <div class="invalid-feedback">Please specify max capacity.</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="minCapacity" class="form-label">Min Capacity</label>
                                        <input type="number" class="form-control" id="minCapacity" name="minCapacity" min="1" placeholder="10">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="currentEnrollment" class="form-label">Current Enrollment</label>
                                        <input type="number" class="form-control" id="currentEnrollment" name="currentEnrollment" min="0" value="0" readonly>
                                    </div>
                                </div>
                                
                                <!-- Additional Information -->
                                <h6 class="mt-4 mb-3"><i class="bi bi-info-circle"></i> Additional Information</h6>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="classroomLocation" class="form-label">Classroom/Location</label>
                                        <input type="text" class="form-control" id="classroomLocation" name="classroomLocation" placeholder="e.g., Room 101, Building A">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="batchStatus" class="form-label">Batch Status <span class="text-danger">*</span></label>
                                        <select class="form-select" id="batchStatus" name="batchStatus" required>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="description" class="form-label">Batch Description</label>
                                    <textarea class="form-control" id="description" name="description" rows="4" placeholder="Enter batch description, special notes, or requirements..."></textarea>
                                </div>
                                
                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="allowOnlineEnrollment" name="allowOnlineEnrollment" checked>
                                        <label class="form-check-label" for="allowOnlineEnrollment">
                                            Allow online enrollment for this batch
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="sendNotifications" name="sendNotifications" checked>
                                        <label class="form-check-label" for="sendNotifications">
                                            Send notifications to enrolled students
                                        </label>
                                    </div>
                                </div>
                                
                                <!-- Form Actions -->
                                <div class="d-flex gap-2 mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-check-circle"></i> Create Batch
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary" onclick="resetForm()">
                                        <i class="bi bi-arrow-clockwise"></i> Reset
                                    </button>
                                    <a href="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp" class="btn btn-outline-danger">
                                        <i class="bi bi-x-circle"></i> Cancel
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Sidebar with helpful info -->
                    <div class="col-lg-4">
                        <div class="card-custom mb-3">
                            <h6><i class="bi bi-lightbulb"></i> Tips for Creating Batches</h6>
                            <ul class="small text-muted mb-0">
                                <li>Choose a unique batch code for easy identification</li>
                                <li>Ensure the schedule doesn't conflict with other batches</li>
                                <li>Set realistic capacity based on available resources</li>
                                <li>Add detailed description to help students understand the batch</li>
                                <li>Assign an instructor before the batch starts</li>
                            </ul>
                        </div>
                        
                        <div class="card-custom mb-3">
                            <h6><i class="bi bi-calendar-event"></i> Upcoming Batches</h6>
                            <div class="small">
                                <div class="mb-2 pb-2 border-bottom">
                                    <strong>Web Dev - Batch A</strong><br>
                                    <span class="text-muted">Starts: Nov 15, 2025</span><br>
                                    <span class="badge bg-success">20/30 enrolled</span>
                                </div>
                                <div class="mb-2 pb-2 border-bottom">
                                    <strong>Data Science - Batch B</strong><br>
                                    <span class="text-muted">Starts: Nov 20, 2025</span><br>
                                    <span class="badge bg-warning">15/25 enrolled</span>
                                </div>
                                <div class="mb-0">
                                    <strong>Mobile Dev - Batch C</strong><br>
                                    <span class="text-muted">Starts: Dec 1, 2025</span><br>
                                    <span class="badge bg-info">10/20 enrolled</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card-custom">
                            <h6><i class="bi bi-question-circle"></i> Need Help?</h6>
                            <p class="small text-muted mb-2">If you need assistance creating a batch, contact the administration team.</p>
                            <a href="#" class="btn btn-sm btn-outline-primary w-100">
                                <i class="bi bi-chat-dots"></i> Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Form validation
        (function () {
            'use strict';
            const form = document.getElementById('createBatchForm');
            
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        })();
        
        // Reset form function
        function resetForm() {
            document.getElementById('createBatchForm').reset();
            document.getElementById('createBatchForm').classList.remove('was-validated');
        }
        
        // Date validation - end date should be after start date
        document.getElementById('endDate').addEventListener('change', function() {
            const startDate = document.getElementById('startDate').value;
            const endDate = this.value;
            
            if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
                alert('End date must be after start date');
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
        
        // Auto-generate batch code based on course selection
        document.getElementById('courseId').addEventListener('change', function() {
            const courseText = this.options[this.selectedIndex].text;
            const year = new Date().getFullYear();
            if (courseText && courseText !== 'Choose a course...') {
                const courseCode = courseText.split(' - ')[0].substring(0, 3).toUpperCase();
                const batchCodeField = document.getElementById('batchCode');
                if (!batchCodeField.value) {
                    batchCodeField.value = courseCode + '-' + year + '-';
                }
            }
        });
    </script>
</body>
</html>
