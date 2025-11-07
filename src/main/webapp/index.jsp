<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Home - EduHub"/>
		<jsp:param name="description" value="A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub."/>
	</jsp:include>
</head>
<body>

	<header>
		<jsp:include page="/public/components/navbar.jsp">
			<jsp:param name="activePage" value="home"/>
		</jsp:include>
	</header>
	
	<main>
		<jsp:include page="/public/components/coming_soon.jsp">
			<jsp:param name="title" value="Home"/>
			<jsp:param name="message" value="Home page is coming soon. Stay tuned for updates!"/>
		</jsp:include>
	</main>
	
	<jsp:include page="/public/components/footer.jsp"/>
	<jsp:include page="/public/components/scripts.jsp"/>

	
</body>
</html>