<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Manage Batches - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage course batches in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/pages/courses/css/manage-batches.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="manage-batches"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Manage Batches"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header-wrapper mb-4">
                    <!-- Page Heading -->
                    <div class="page-title-container">
                        <h2>Manage Batches</h2>
                        <p class="text-muted">View and manage all course batches</p>
                    </div>
                    
                    <!-- Action Button -->
                    <div class="back-button-container">
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Create New Batch
                        </a>
                    </div>
                </div>
                
                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-xl-3 col-md-6 col-12 mb-3">
                        <div class="card-custom h-100">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <div class="stat-icon-circle bg-info bg-opacity-10">
                                        <i class="bi bi-calendar-plus text-info" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h3 class="mb-0">3</h3>
                                    <p class="text-muted mb-0 small">Upcoming Batches</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 col-12 mb-3">
                        <div class="card-custom h-100">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <div class="stat-icon-circle bg-success bg-opacity-10">
                                        <i class="bi bi-play-circle text-success" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h3 class="mb-0">2</h3>
                                    <p class="text-muted mb-0 small">Active Batches</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 col-12 mb-3">
                        <div class="card-custom h-100">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <div class="stat-icon-circle bg-primary bg-opacity-10">
                                        <i class="bi bi-people text-primary" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h3 class="mb-0">97</h3>
                                    <p class="text-muted mb-0 small">Total Students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 col-12 mb-3">
                        <div class="card-custom h-100">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <div class="stat-icon-circle bg-secondary bg-opacity-10">
                                        <i class="bi bi-check-circle text-secondary" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h3 class="mb-0">1</h3>
                                    <p class="text-muted mb-0 small">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <!-- Batches List -->
                <div class="card-custom-modern">
                    <div class="filter-header-section mb-4">
                        <div class="filter-title-section">
                            <h5 class="mb-1 fw-bold"><i class="bi bi-grid-3x3-gap-fill text-primary"></i> All Batches</h5>
                            <p class="text-muted small mb-0">Manage and monitor all course batches</p>
                        </div>
                        <div class="btn-group filter-btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary active" data-filter="all">All (6)</button>
                            <button type="button" class="btn btn-outline-info" data-filter="upcoming">Upcoming (3)</button>
                            <button type="button" class="btn btn-outline-success" data-filter="active">Active (2)</button>
                            <button type="button" class="btn btn-outline-secondary" data-filter="completed">Completed (1)</button>
                        </div>
                    </div>
                    
                    <!-- Search and Filter -->
                    <div class="row mb-4" id="filterSection">
                        <div class="col-lg-4 col-md-6 mb-3 mb-lg-0">
                            <label for="searchBatch" class="form-label fw-semibold">Search</label>
                            <div class="search-container">
                                <div class="input-group">
                                    <span class="input-group-text bg-white border-end-0">
                                        <i class="bi bi-search text-muted"></i>
                                    </span>
                                    <input type="text" class="form-control border-start-0" id="searchBatch" 
                                           placeholder="Search batches by name, code, or course...">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
                            <label for="filterCourse" class="form-label fw-semibold">Filter by Course</label>
                            <select class="form-select modern-select" id="filterCourse">
                                <option value="">All Courses</option>
                                <option value="cs">Computer Science</option>
                                <option value="ds">Data Science</option>
                                <option value="wd">Web Development</option>
                                <option value="ma">Mobile App</option>
                                <option value="dm">Digital Marketing</option>
                            </select>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
                            <label for="filterInstructor" class="form-label fw-semibold">Filter by Trainer</label>
                            <select class="form-select modern-select" id="filterInstructor">
                                <option value="">All Trainers</option>
                                <option value="john">Dr. John Smith</option>
                                <option value="sarah">Prof. Sarah Johnson</option>
                                <option value="michael">Mr. Michael Brown</option>
                                <option value="emily">Ms. Emily Davis</option>
                            </select>
                        </div>
                        
                        <div class="col-lg-2 col-md-6" id="filterExtraColumn">
                            <label class="form-label fw-semibold d-none d-lg-block">&nbsp;</label>
                            <button type="button" class="btn btn-outline-secondary w-100" id="clearFiltersBtn">
                                <i class="bi bi-x-circle"></i> Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Batches Grid - Outside the card wrapper -->
                <div class="row mt-4" id="batchesContainer">
                        <!-- Batch Card 1 -->
                        <div class="col-lg-6 col-12 mb-4" data-status="upcoming" data-course="cs" data-instructor="john">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Morning Batch</h5>
                                            <span class="batch-code">CS-2025-A</span>
                                        </div>
                                        <span class="status-badge status-upcoming">
                                            <i class="bi bi-clock-history"></i> Upcoming
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Computer Science - Foundation</strong>
                                    </div>
                                    
                                    <div class="info-row">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Dr. John Smith</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Start Date</label>
                                            <div class="value">Nov 20, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 9:00 AM - 12:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Mon, Wed, Fri
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Enrollment</span>
                                            <span class="enrollment-count">20/30 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill progress-success" style="width: 67%;"></div>
                                        </div>
                                        <div class="enrollment-status text-success">
                                            <i class="bi bi-arrow-up-circle-fill"></i> 67% enrolled
                                        </div>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Batch Card 2 -->
                        <div class="col-lg-6 col-12 mb-4" data-status="upcoming" data-course="ds" data-instructor="sarah">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Evening Batch</h5>
                                            <span class="batch-code">DS-2025-B</span>
                                        </div>
                                        <span class="status-badge status-upcoming">
                                            <i class="bi bi-clock-history"></i> Upcoming
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Data Science - Advanced</strong>
                                    </div>
                                    
                                    <div class="info-row">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Prof. Sarah Johnson</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Start Date</label>
                                            <div class="value">Nov 25, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 6:00 PM - 9:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Tue, Thu, Sat
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Enrollment</span>
                                            <span class="enrollment-count">15/25 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill progress-warning" style="width: 60%;"></div>
                                        </div>
                                        <div class="enrollment-status text-warning">
                                            <i class="bi bi-dash-circle-fill"></i> 60% enrolled
                                        </div>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Batch Card 3 - Active -->
                        <div class="col-lg-6 col-12 mb-4" data-status="active" data-course="wd" data-instructor="michael">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Weekend Batch</h5>
                                            <span class="batch-code">WD-2025-C</span>
                                        </div>
                                        <span class="status-badge status-active">
                                            <i class="bi bi-play-circle-fill"></i> Active
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Web Development - Full Stack</strong>
                                    </div>
                                    
                                    <div class="info-row">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Mr. Michael Brown</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Started On</label>
                                            <div class="value">Nov 5, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 10:00 AM - 4:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Sat, Sun
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Enrollment</span>
                                            <span class="enrollment-count">27/30 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill progress-success" style="width: 90%;"></div>
                                        </div>
                                        <div class="enrollment-status text-success">
                                            <i class="bi bi-arrow-up-circle-fill"></i> 90% enrolled
                                        </div>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Batch Card 4 -->
                        <div class="col-lg-6 col-12 mb-4" data-status="upcoming" data-course="ma" data-instructor="emily">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Afternoon Batch</h5>
                                            <span class="batch-code">MA-2025-D</span>
                                        </div>
                                        <span class="status-badge status-upcoming">
                                            <i class="bi bi-clock-history"></i> Upcoming
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Mobile App Development</strong>
                                    </div>
                                    
                                    <div class="info-row">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Ms. Emily Davis</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Start Date</label>
                                            <div class="value">Dec 1, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 2:00 PM - 5:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Mon, Wed, Fri
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Enrollment</span>
                                            <span class="enrollment-count">10/20 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill progress-info" style="width: 50%;"></div>
                                        </div>
                                        <div class="enrollment-status text-info">
                                            <i class="bi bi-arrow-right-circle-fill"></i> 50% enrolled
                                        </div>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Batch Card 5 - Active & Full -->
                        <div class="col-lg-6 col-12 mb-4" data-status="active" data-course="dm" data-instructor="john">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Online Batch</h5>
                                            <span class="batch-code">DM-2025-E</span>
                                        </div>
                                        <span class="status-badge status-active">
                                            <i class="bi bi-play-circle-fill"></i> Active
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Digital Marketing</strong>
                                    </div>
                                    
                                    <div class="info-row">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Dr. John Smith</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Started On</label>
                                            <div class="value">Nov 1, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 7:00 PM - 9:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Mon, Tue, Wed
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Enrollment</span>
                                            <span class="enrollment-count">25/25 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill progress-success" style="width: 100%;"></div>
                                        </div>
                                        <span class="full-badge mt-2">
                                            <i class="bi bi-check-circle-fill"></i> Fully Enrolled
                                        </span>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Batch Card 6 - Completed -->
                        <div class="col-lg-6 col-12 mb-4" data-status="completed" data-course="cs" data-instructor="sarah">
                            <div class="batch-card">
                                <div class="batch-card-header">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="batch-title">Summer Batch</h5>
                                            <span class="batch-code">CS-2024-Z</span>
                                        </div>
                                        <span class="status-badge status-completed">
                                            <i class="bi bi-check-circle-fill"></i> Completed
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="batch-card-body">
                                    <div class="course-name">
                                        <i class="bi bi-book-half text-primary"></i>
                                        <strong>Computer Science - Foundation</strong>
                                    </div>
                                    
                                    <div class="info-row info-row-three-cols">
                                        <div class="info-item">
                                            <label>Trainer</label>
                                            <div class="value">Prof. Sarah Johnson</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Started On</label>
                                            <div class="value">May 1, 2025</div>
                                        </div>
                                        <div class="info-item">
                                            <label>Completed On</label>
                                            <div class="value">Oct 15, 2025</div>
                                        </div>
                                    </div>
                                    
                                    <div class="schedule-info">
                                        <span class="schedule-item">
                                            <i class="bi bi-clock"></i> 9:00 AM - 12:00 PM
                                        </span>
                                        <span class="schedule-item">
                                            <i class="bi bi-calendar-week"></i> Mon, Wed, Fri
                                        </span>
                                    </div>
                                    
                                    <div class="enrollment-section">
                                        <div class="enrollment-header">
                                            <span class="enrollment-label">Final Enrollment</span>
                                            <span class="enrollment-count">30/30 students</span>
                                        </div>
                                        <div class="progress-bar-custom">
                                            <div class="progress-fill" style="width: 100%; background: #6c757d;"></div>
                                        </div>
                                        <div class="enrollment-status text-muted">
                                            <i class="bi bi-archive"></i> Archived batch
                                        </div>
                                    </div>
                                    
                                    <div class="batch-actions">
                                        <button class="btn btn-warning flex-fill">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-outline-danger flex-fill">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <!-- Empty State -->
                    <div id="emptyState" class="text-center py-5 d-none">
                        <i class="bi bi-inbox empty-state-icon"></i>
                        <h4 class="text-muted mt-4 mb-2">No batches found</h4>
                        <p class="text-muted">Try adjusting your filters or create a new batch to get started</p>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="btn btn-primary mt-3">
                            <i class="bi bi-plus-circle"></i> Create New Batch
                        </a>
                    </div>
            </div>
        </div>
    </div>
    
    <!-- Include Modal Component -->
    <jsp:include page="/dashboard/components/modal.jsp"/>
    
    <!-- Include Toast Notification Component -->
    <jsp:include page="/components/toast-dependencies.jsp"/>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/dashboard/pages/courses/js/manage-batches.js"></script>
</body>
</html>
