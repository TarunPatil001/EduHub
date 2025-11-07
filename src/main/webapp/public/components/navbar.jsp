<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%--
  Reusable Navbar Component
  
  Purpose: 
    - Simple navbar with logo and action buttons
    - Responsive mobile menu
    - Context-aware links (works on localhost and production)
  
  Usage Example:
    <jsp:include page="components/navbar.jsp"/>
--%>

<nav class="navbar fixed-top border-bottom shadow-sm" style="position: fixed !important; top: 0 !important; z-index: 1030 !important; background: #ffffff !important;">
	<div class="container">
		<a class="navbar-brand logo"
			href="${pageContext.request.contextPath}/">EduHub</a>
		<div class="d-flex gap-2">
			<a class="btn btn-outline-dark btn-sm"
				href="${pageContext.request.contextPath}/public/login.jsp">Login</a>
			<a class="btn btn-dark btn-sm"
				href="${pageContext.request.contextPath}/public/register_institute.jsp">Register</a>
			<a class="btn btn-primary btn-sm d-none d-md-inline-block"
				href="${pageContext.request.contextPath}/dashboard.jsp">Dashboard</a>
		</div>
	</div>
</nav>
