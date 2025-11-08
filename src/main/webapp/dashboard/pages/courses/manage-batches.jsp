<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Manage Batches - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage course batches in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
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
                <div class="page-header mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Manage Course Batches</h2>
                            <p class="text-muted">Create and manage course batches and schedules</p>
                        </div>
                        <a href="${pageContext.request.contextPath}/dashboard/pages/courses/create-batch.jsp" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Create New Batch
                        </a>
                    </div>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Batch Management</h5>
                    <p class="text-muted">Batch management system will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
