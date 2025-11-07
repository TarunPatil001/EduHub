<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Footer Component
  
  Purpose: 
    - Provides consistent footer across all pages
    - Contains links, copyright, social media icons
  
  Usage Example:
    <jsp:include page="components/footer.jsp"/>
--%>

<footer class="bg-dark text-white py-3">
	<div class="container">
		<div class="row align-items-center">
			<div class="col-md-4 mb-2 mb-md-0 text-center text-md-start">
				<h6 class="fw-bold mb-1 logo">EDUHUB</h6>
				<p class="text-white-50 small mb-0">Your All-in-One Educational Management System</p>
			</div>
			<div class="col-md-4 mb-2 mb-md-0 text-center">
				<p class="text-white-50 small mb-0">&copy; 2025 EduHub. All rights reserved.</p>
			</div>
			<div class="col-md-4 text-center text-md-end">
				<div class="d-flex gap-3 justify-content-center justify-content-md-end">
					<a href="#" class="text-white"><i class="bi bi-facebook"></i></a>
					<a href="#" class="text-white"><i class="bi bi-twitter"></i></a>
					<a href="#" class="text-white"><i class="bi bi-linkedin"></i></a>
					<a href="#" class="text-white"><i class="bi bi-instagram"></i></a>
				</div>
			</div>
		</div>
	</div>
</footer>
