<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Footer Component
  
  Purpose: 
    - Provides consistent footer across all pages
    - Contains links, copyright, social media icons
  
  Usage Example:
    <jsp:include page="components/footer.jsp"/>
--%>

<footer class="bg-dark text-white py-4">
	<div class="container">
		<div class="row">
			<div class="col-md-4 mb-3 mb-md-0 text-white">
				<h5 class="fw-bold">EduHub</h5>
				<p class="text-white small">Your All-in-One Educational Management System</p>
			</div>
			<div class="col-md-4 mb-3 mb-md-0">
				<h6 class="fw-bold mb-3">Quick Links</h6>
				<ul class="list-unstyled">
					<li><a href="${pageContext.request.contextPath}/" class="text-white text-decoration-none small">Home</a></li>
					<li><a href="${pageContext.request.contextPath}/public/about_us.jsp" class="text-white text-decoration-none small">About Us</a></li>
					<li><a href="${pageContext.request.contextPath}/public/placement_records.jsp" class="text-white text-decoration-none small">Placement Records</a></li>
				</ul>
			</div>
			<div class="col-md-4">
				<h6 class="fw-bold mb-3">Connect With Us</h6>
				<div class="d-flex gap-2">
					<a href="#" class="text-white"><i class="bi bi-facebook fs-4"></i></a>
					<a href="#" class="text-white"><i class="bi bi-twitter fs-4"></i></a>
					<a href="#" class="text-white"><i class="bi bi-linkedin fs-4"></i></a>
					<a href="#" class="text-white"><i class="bi bi-instagram fs-4"></i></a>
				</div>
			</div>
		</div>
		<hr class="text-muted my-3">
		<div class="text-center text-white small">
			<p class="mb-0">&copy; 2025 EduHub. All rights reserved.</p>
		</div>
	</div>
</footer>
