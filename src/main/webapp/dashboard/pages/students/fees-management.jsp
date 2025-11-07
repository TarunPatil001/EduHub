<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Fees Management - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage student fees in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="fees-management"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Fees Management"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Fees Management</h2>
                    <p>Track and manage student fee payments</p>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Fee Collection & Management</h5>
                    <p class="text-muted">Fee management system will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
