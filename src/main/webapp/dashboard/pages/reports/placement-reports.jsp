<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Placement Reports - Dashboard - EduHub"/>
        <jsp:param name="description" value="View placement reports in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="placement-reports"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Placement Reports"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Placement Reports</h2>
                    <p>Track student placements and job statistics</p>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Placement Analytics</h5>
                    <p class="text-muted">Placement reports and statistics will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
