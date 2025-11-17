<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Attendance Reports - Dashboard - EduHub"/>
        <jsp:param name="description" value="View attendance reports in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="attendance-report"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Attendance Reports"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Attendance Reports</h2>
                    <p>Detailed attendance analytics and reports</p>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Attendance Analytics</h5>
                    <p class="text-muted">Attendance report generation will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
