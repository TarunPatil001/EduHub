<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Home - EduHub"/>
		<jsp:param name="description" value="A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub."/>
	</jsp:include>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/home.css">
</head>
<body>
	<!-- Navigation -->
	<jsp:include page="/public/components/navbar.jsp">
		<jsp:param name="activePage" value="home"/>
	</jsp:include>
	
	<!-- Main Content -->
	<main>
		<jsp:include page="/public/components/hero.jsp"/>
		<jsp:include page="/public/components/features.jsp"/>
		<jsp:include page="/public/components/cta.jsp"/>
	</main>
	
	<!-- Footer -->
	<footer>
		<jsp:include page="/public/components/footer.jsp"/>
	</footer>
	
	<!-- Scripts -->
	<jsp:include page="/public/components/scripts.jsp"/>
</body>
</html>