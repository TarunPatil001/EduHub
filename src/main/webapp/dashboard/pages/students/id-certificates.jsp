<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="ID Cards & Certificates - Dashboard - EduHub"/>
        <jsp:param name="description" value="Generate student ID cards and certificates in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="id-certificates"/>
        </jsp:include>
        
        <div class="dashboard-main">
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="ID Cards & Certificates"/>
            </jsp:include>
            
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>ID Cards & Certificates</h2>
                    <p>Generate and manage student ID cards and certificates</p>
                </div>
                
                <div class="card-custom">
                    <h5 class="mb-4">Document Generation</h5>
                    <p class="text-muted">ID card and certificate generation tools will be added here...</p>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
</body>
</html>
