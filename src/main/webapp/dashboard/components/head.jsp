<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Head Component
  
  Purpose: 
    - Provides all meta tags, CSS links, fonts for every page
    - Avoids duplicating head content across multiple JSP files
    - Allows custom title and description per page
  
  Parameters:
    - title (optional): Page title (default: "EduHub – All-in-One Educational Management System")
    - description (optional): Meta description for SEO
  
  Usage Example:
    <head>
        <jsp:include page="components/head.jsp">
            <jsp:param name="title" value="About Us - EduHub"/>
            <jsp:param name="description" value="Learn more about EduHub"/>
        </jsp:include>
    </head>
--%>

<!-- Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${param.description != null ? param.description : 'A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub.'}">

<!-- Title -->
<title>${param.title != null ? param.title : 'EduHub – All-in-One Educational Management System'}</title>

<!-- Preconnect for Performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Google Fonts - Inter -->
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

<!-- Toastify CSS -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

<!-- Custom CSS -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/style.css?v=3">
