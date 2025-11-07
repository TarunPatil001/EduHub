<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="About Us - EduHub"/>
		<jsp:param name="description" value="Learn more about EduHub"/>
	</jsp:include>
</head>
<body>

	<header>
		<jsp:include page="/public/components/navbar.jsp">
			<jsp:param name="activePage" value="about"/>
		</jsp:include>
	</header>

	<main>
		<jsp:include page="/public/components/coming_soon.jsp">
			<jsp:param name="title" value="About Us"/>
			<jsp:param name="message" value="About Us page is coming soon. Stay tuned for updates!"/>
		</jsp:include>
	</main>

	<jsp:include page="/public/components/footer.jsp"/>
	<jsp:include page="/public/components/scripts.jsp"/>

</body>
</html>
