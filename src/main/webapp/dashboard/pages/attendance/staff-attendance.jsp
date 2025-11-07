<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Staff Attendance - Dashboard - EduHub"/>
        <jsp:param name="description" value="Mark staff attendance in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="staff-attendance"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Staff Attendance"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Staff Attendance</h2>
                    <p>Mark daily staff attendance</p>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Staff Attendance Marking</h5>
                    <p class="text-muted">Staff attendance system will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
