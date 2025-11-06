<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Navbar Component
  
  Purpose: 
    - Provides consistent navigation across all pages
    - Highlights active page automatically
    - Responsive mobile menu
    - Context-aware links (works on localhost and production)
  
  Parameters:
    - activePage: Which page is currently active ("home", "placement", "about")
                  This will add the 'active' class to the corresponding nav link
  
  Usage Example:
    <jsp:include page="components/navbar.jsp">
        <jsp:param name="activePage" value="home"/>
    </jsp:include>
--%>

<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
	<div class="container">
		<a class="navbar-brand logo" href="${pageContext.request.contextPath}/">EduHub</a>
		<button class="navbar-toggler" type="button"
			data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent" aria-expanded="false"
			aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mx-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link ${param.activePage == 'home' ? 'active' : ''}"
						aria-current="page" href="${pageContext.request.contextPath}/">Home</a>
				</li>
				<li class="nav-item">
					<a class="nav-link ${param.activePage == 'placement' ? 'active' : ''}"
						href="${pageContext.request.contextPath}/placement_records">Placement Records</a>
				</li>
				<li class="nav-item">
					<a class="nav-link ${param.activePage == 'about' ? 'active' : ''}"
						href="${pageContext.request.contextPath}/about_us">About Us</a>
				</li>
			</ul>
			<div class="d-flex" role="search">
				<a class="btn btn-outline-dark me-2"
					href="${pageContext.request.contextPath}/login">Login</a>
				<a class="btn btn-dark"
					href="${pageContext.request.contextPath}/register">Register</a>
			</div>
		</div>
	</div>
</nav>
