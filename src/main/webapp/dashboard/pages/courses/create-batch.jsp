<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Create Batch - Dashboard - EduHub"/>
        <jsp:param name="description" value="Create new batch in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <style>
        /* Mobile responsive styles for page header */
        @media (max-width: 991px) {
            .page-header {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 1rem;
            }
            
            .page-header .d-flex {
                flex-direction: column;
                align-items: flex-start !important;
                width: 100%;
                gap: 1rem;
            }
            
            .page-header .btn {
                width: 100%;
            }
        }
        
        @media (max-width: 576px) {
            .page-header {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 1rem;
                width: 100%;
            }
            
            .page-header .d-flex {
                flex-direction: column;
                align-items: flex-start !important;
                width: 100%;
            }
            
            .page-header h2 {
                font-size: 1.5rem;
            }
            
            .page-header .btn {
                width: 100%;
                font-size: 0.875rem;
                padding: 0.75rem 1rem;
            }
        }
    </style>
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
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Create New Batch</h2>
                        <p class="text-muted">Add a new batch for a course</p>
                    </div>
                    
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <jsp:include page="/dashboard/components/back-button.jsp">
                            <jsp:param name="url" value="${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp"/>
                            <jsp:param name="text" value="Back to Batches"/>
                        </jsp:include>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-9">
                        <form id="createBatchForm" action="${pageContext.request.contextPath}/api/batches/create" method="POST">
                            
                            <!-- Basic Information -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-info-circle-fill"></i> Basic Information</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="batchCode" class="form-label">Batch Code <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="batchCode" name="batchCode" required placeholder="e.g., CS-2025-A">
                                    </div>
                                    <div class="col-md-8">
                                        <label for="batchName" class="form-label">Batch Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="batchName" name="batchName" required placeholder="e.g., Morning Batch, Weekend Batch">
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
                                    </div>
                                    <div class="col-md-6">
                                        <label for="instructorId" class="form-label">Instructor <span class="text-danger">*</span></label>
                                        <select class="form-select" id="instructorId" name="instructorId" required>
                                            <option value="">Choose instructor...</option>
                                            <option value="1">Dr. John Smith</option>
                                            <option value="2">Prof. Sarah Johnson</option>
                                            <option value="3">Mr. Michael Brown</option>
                                            <option value="4">Ms. Emily Davis</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Schedule Details -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-calendar-fill"></i> Schedule Details</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="startDate" class="form-label">Start Date <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="startDate" name="startDate" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="endDate" class="form-label">End Date <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" id="endDate" name="endDate" required>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="startTime" class="form-label">Start Time <span class="text-danger">*</span></label>
                                        <input type="time" class="form-control" id="startTime" name="startTime" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="endTime" class="form-label">End Time <span class="text-danger">*</span></label>
                                        <input type="time" class="form-control" id="endTime" name="endTime" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="maxCapacity" class="form-label">Max Students <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" id="maxCapacity" name="maxCapacity" required min="1" placeholder="e.g., 30">
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Class Days <span class="text-danger">*</span></label>
                                    <div class="d-flex flex-wrap gap-3">
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
                            </div>
                            
                            <!-- Batch Settings -->
                            <div class="card-custom mb-4">
                                <h5 class="mb-4"><i class="bi bi-gear-fill"></i> Batch Settings</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="modeOfConduct" class="form-label">Mode of Conduct <span class="text-danger">*</span></label>
                                        <select class="form-select" id="modeOfConduct" name="modeOfConduct" required>
                                            <option value="">Select Mode</option>
                                            <% if(application.getAttribute("modesOfConduct") != null) {
                                                for(String item : (List<String>)application.getAttribute("modesOfConduct")) { %>
                                                <option value="<%=item%>"><%=item%></option>
                                            <% } } %>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="batchStatus" class="form-label">Status <span class="text-danger">*</span></label>
                                        <select class="form-select" id="batchStatus" name="batchStatus" required>
                                            <% if(application.getAttribute("batchStatuses") != null) {
                                                for(String item : (List<String>)application.getAttribute("batchStatuses")) { %>
                                                <option value="<%=item%>"><%=item%></option>
                                            <% } } %>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <label for="classroomLocation" class="form-label">Classroom/Location</label>
                                        <input type="text" class="form-control" id="classroomLocation" name="classroomLocation" placeholder="e.g., Room 101, Building A or Zoom Meeting ID">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" class="btn btn-secondary" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i> Cancel
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Create Batch
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
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Cancel button handler
        document.getElementById('cancelBtn').addEventListener('click', function() {
            window.location.href = '${pageContext.request.contextPath}/dashboard/pages/courses/manage-batches.jsp';
        });
        
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
    </script>
</body>
</html>
