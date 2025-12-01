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

<!-- Fixed top navbar with glassmorphism effect -->
<nav class="navbar navbar-expand-md navbar-dark fixed-top glassmorphism-navbar">
	<div class="container">
		<!-- Brand/logo -->
		<a class="navbar-brand logo" href="${pageContext.request.contextPath}/">
			<span class="logo-text">EduHub</span>
		</a>
		
		<!-- Mobile toggle button -->
		<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		
		<!-- Navbar links -->
		<div class="collapse navbar-collapse" id="navbarNav">
			<div class="ms-auto d-flex gap-3 mt-3 mt-md-0 align-items-center">
				<!-- Theme Toggle Button -->
				<button class="btn btn-glass btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" id="themeToggleBtn" onclick="ThemeSwitcher.toggle()" title="Toggle Theme" style="width: 32px; height: 32px;">
					<i class="bi bi-moon-stars-fill"></i>
				</button>

				<a class="btn btn-glass btn-sm" href="${pageContext.request.contextPath}/public/login.jsp">
					<i class="bi bi-box-arrow-in-right me-1"></i> Login
				</a>
				<a class="btn btn-glass-primary btn-sm" href="${pageContext.request.contextPath}/public/register_institute.jsp">
					<i class="bi bi-building-add me-1"></i> Register
				</a>
				<a class="btn btn-glass-gradient btn-sm" href="${pageContext.request.contextPath}/dashboard.jsp">
					<i class="bi bi-speedometer2 me-1"></i> Dashboard
				</a>
			</div>
		</div>
	</div>
</nav>
