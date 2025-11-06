<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="components/head.jsp">
		<jsp:param name="title" value="Placement Records - EduHub"/>
		<jsp:param name="description" value="View placement records and statistics for EduHub students"/>
	</jsp:include>
</head>
<body>

	<header>
		<jsp:include page="components/navbar.jsp">
			<jsp:param name="activePage" value="placement"/>
		</jsp:include>
	</header>

	<main>
		<jsp:include page="components/coming_soon.jsp">
			<jsp:param name="title" value="Placement Records"/>
			<jsp:param name="message" value="Placement records page is coming soon. Stay tuned for updates!"/>
		</jsp:include>
	</main>

	<jsp:include page="components/footer.jsp"/>
	<jsp:include page="components/scripts.jsp"/>

</body>
</html>