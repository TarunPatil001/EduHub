<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Home - EduHub"/>
		<jsp:param name="description" value="A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub."/>
	</jsp:include>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/home.css">
</head>
<body style="padding-top: 80px;">
	<!-- Navigation -->
	<jsp:include page="/dashboard/components/navbar.jsp">
		<jsp:param name="activePage" value="home"/>
	</jsp:include>
	
	<!-- Main Content -->
	<main>
		<!-- Hero Section -->
		<section class="hero-section">
		    <div class="container">
		        <div class="row align-items-center">
		            <div class="col-lg-6">
		                <div class="hero-content">
		                    <h1 class="hero-title animate-fade-in">
		                        Welcome to <span class="brand-highlight">EDUHUB</span>
		                    </h1>
		                    <p class="hero-subtitle animate-fade-in-delay">
		                        A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub.
		                    </p>
		                    <div class="hero-buttons animate-fade-in-delay-2">
		                        <a href="${pageContext.request.contextPath}/public/login.jsp" class="btn btn-primary btn-lg">
		                            <i class="bi bi-box-arrow-in-right"></i> Get Started
		                        </a>
		                        <a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-outline-primary btn-lg">
		                            <i class="bi bi-person-plus"></i> Register Now
		                        </a>
		                    </div>
		                </div>
		            </div>
		            <div class="col-lg-6">
		                <div class="hero-image animate-float">
		                    <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg" alt="Education Management" class="img-fluid">
		                </div>
		            </div>
		        </div>
		    </div>
		    <div class="hero-wave">
		        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
		            <path fill="#ffffff" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
		        </svg>
		    </div>
		</section>
		
		<!-- Features Section -->
		<section class="features-section py-5">
		    <div class="container">
		        <div class="section-header text-center mb-5">
		            <h2 class="section-title">Why Choose EduHub?</h2>
		            <p class="section-subtitle">Powerful features to manage your educational institution efficiently</p>
		        </div>
		        
		        <div class="row g-4">
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-primary">
		                        <i class="bi bi-people-fill"></i>
		                    </div>
		                    <h3 class="feature-title">Student Management</h3>
		                    <p class="feature-description">Comprehensive student information system with enrollment, attendance tracking, and performance monitoring.</p>
		                </div>
		            </div>
		            
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-success">
		                        <i class="bi bi-person-badge-fill"></i>
		                    </div>
		                    <h3 class="feature-title">Faculty Management</h3>
		                    <p class="feature-description">Manage faculty profiles, schedules, assignments, and performance evaluations all in one place.</p>
		                </div>
		            </div>
		            
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-info">
		                        <i class="bi bi-calendar-check-fill"></i>
		                    </div>
		                    <h3 class="feature-title">Attendance Tracking</h3>
		                    <p class="feature-description">Real-time attendance monitoring with automated reports and notifications for students and parents.</p>
		                </div>
		            </div>
		            
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-warning">
		                        <i class="bi bi-book-fill"></i>
		                    </div>
		                    <h3 class="feature-title">Course Management</h3>
		                    <p class="feature-description">Create and manage courses, assign faculty, track progress, and organize study materials efficiently.</p>
		                </div>
		            </div>
		            
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-danger">
		                        <i class="bi bi-currency-dollar"></i>
		                    </div>
		                    <h3 class="feature-title">Fee Management</h3>
		                    <p class="feature-description">Streamlined fee collection, payment tracking, and automated financial reporting system.</p>
		                </div>
		            </div>
		            
		            <div class="col-md-6 col-lg-4">
		                <div class="feature-card">
		                    <div class="feature-icon bg-secondary">
		                        <i class="bi bi-chat-dots-fill"></i>
		                    </div>
		                    <h3 class="feature-title">Communication Hub</h3>
		                    <p class="feature-description">Integrated messaging, announcements, and notifications to keep everyone connected and informed.</p>
		                </div>
		            </div>
		        </div>
		    </div>
		</section>
		
		<!-- Call to Action Section -->
		<section class="cta-section">
		    <div class="container">
		        <div class="cta-content text-center">
		            <h2 class="cta-title">Ready to Transform Your Institution?</h2>
		            <p class="cta-subtitle">Join thousands of educational institutions already using EduHub to streamline their operations</p>
		            <div class="cta-buttons">
		                <a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-light btn-lg">
		                    <i class="bi bi-person-plus"></i> Register Now
		                </a>
		                <a href="${pageContext.request.contextPath}/public/login.jsp" class="btn btn-outline-light btn-lg">
		                    <i class="bi bi-box-arrow-in-right"></i> Login
		                </a>
		            </div>
		        </div>
		    </div>
		</section>
	</main>
	
	<!-- Footer -->
	<footer>
		<jsp:include page="/dashboard/components/footer.jsp"/>
	</footer>
	
	<!-- Scripts -->
	<jsp:include page="/dashboard/components/scripts.jsp"/>
	
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
