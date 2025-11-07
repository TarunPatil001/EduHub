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
<body style="padding-top: 80px;">
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
	
	<script>
		// Adjust body padding for fixed navbar on different screen sizes
		function adjustNavbarPadding() {
			const body = document.body;
			const width = window.innerWidth;
			
			if (width <= 575) {
				body.style.paddingTop = '65px';
			} else if (width <= 767) {
				body.style.paddingTop = '70px';
			} else if (width <= 991) {
				body.style.paddingTop = '75px';
			} else {
				body.style.paddingTop = '80px';
			}
		}
		
		// Run on page load
		adjustNavbarPadding();
		
		// Run on window resize
		window.addEventListener('resize', adjustNavbarPadding);
	</script>
</body>
</html>