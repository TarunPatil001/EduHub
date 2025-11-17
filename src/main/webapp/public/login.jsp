<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<!-- Include common head elements (meta tags, Bootstrap, icons) -->
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Login - EduHub"/>
		<jsp:param name="description" value="Login to your institute dashboard on EduHub"/>
	</jsp:include>
	
	<!-- Authentication page styles -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
</head>
<body class="auth-page">

	<!-- Main content container -->
	<main class="auth-container">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-9">
					
					<!-- Login card -->
					<div class="auth-card">
						<div class="row g-0">
							
							<!-- Left Side - Branding -->
							<div class="col-lg-5 auth-brand-side">
								<div class="auth-brand-content">
									
									<!-- Brand logo -->
									<div class="brand-logo">
										<h1 class="logo-text">EduHub</h1>
										<div class="logo-underline"></div>
									</div>
									
									<!-- Brand title and subtitle -->
									<h2 class="brand-title">Welcome Back</h2>
									<p class="brand-subtitle">Login to access your institute dashboard</p>
									
									<!-- Brand features list -->
									<div class="brand-features">
										<div class="feature-item">
											<i class="bi bi-shield-check"></i>
											<span>Secure Authentication</span>
										</div>
										<div class="feature-item">
											<i class="bi bi-speedometer2"></i>
											<span>Fast & Reliable</span>
										</div>
										<div class="feature-item">
											<i class="bi bi-people"></i>
											<span>Manage Your Institute</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Side - Login Form -->
							<div class="col-lg-7 auth-form-side">
								<div class="auth-form-content">
									
									<!-- Form header -->
									<div class="form-header">
										<h3>Sign In</h3>
										<p>Enter your credentials to access your account</p>
									</div>

									<!-- Alert Messages -->
									<!-- Error message for invalid credentials -->
									<% if(request.getParameter("error") != null) { %>
										<div class="alert alert-danger">
											<i class="bi bi-x-circle-fill"></i>
											<span>Invalid credentials. Please try again.</span>
										</div>
									<% } %>
									
									<!-- Success message for logout -->
									<% if(request.getParameter("logout") != null) { %>
										<div class="alert alert-success">
											<i class="bi bi-check-circle-fill"></i>
											<span>Successfully logged out.</span>
										</div>
									<% } %>
									
									<!-- Success message for registration -->
									<% if(request.getParameter("registered") != null) { %>
										<div class="alert alert-success">
											<i class="bi bi-check-circle-fill"></i>
											<span>Registration successful! Please login.</span>
										</div>
									<% } %>

									<!-- Login form -->
									<form action="${pageContext.request.contextPath}/login" method="post" class="auth-form">
										
										<!-- Institute ID / Email Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="text"/>
											<jsp:param name="id" value="username"/>
											<jsp:param name="name" value="username"/>
											<jsp:param name="icon" value="building"/>
											<jsp:param name="label" value="Institute ID / Email"/>
											<jsp:param name="placeholder" value="Enter your institute ID or email"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="autocomplete" value="username"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Password Field with Toggle Visibility -->
										<div class="form-group">
											<label for="password" class="form-label">
												<i class="bi bi-lock"></i> Password
											</label>
											<div class="password-input-wrapper">
												<input 
													type="password" 
													class="form-control" 
													id="password" 
													name="password" 
													placeholder="Enter your password" 
													required
													autocomplete="current-password"
												>
												<!-- Toggle password visibility button -->
												<button type="button" class="password-toggle" onclick="togglePassword('password')">
													<i class="bi bi-eye" id="password-icon"></i>
												</button>
											</div>
										</div>

										<!-- Remember Me & Forgot Password -->
										<div class="d-flex justify-content-between align-items-center mb-3">
											<!-- Remember me checkbox -->
											<div class="form-check">
												<input class="form-check-input" type="checkbox" id="remember" name="remember">
												<label class="form-check-label" for="remember">
													Remember me
												</label>
											</div>
											<!-- Forgot password link -->
											<a href="#" class="text-primary small fw-bold">Forgot Password?</a>
										</div>

										<!-- Submit Button -->
										<button type="submit" class="btn btn-primary btn-lg w-100 auth-submit-btn">
											<i class="bi bi-box-arrow-in-right"></i> Sign In
										</button>

										<!-- Divider -->
										<div class="auth-divider">
											<span>New to EduHub?</span>
										</div>

										<!-- Registration Link -->
										<a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-outline-primary w-100">
											<i class="bi bi-building-add"></i> Register New Institute
										</a>

										<!-- Login Footer -->
										<div class="auth-footer">
											<p class="small text-muted">
												<i class="bi bi-shield-lock-fill"></i> 
												Secured with encryption
											</p>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Bootstrap and jQuery scripts -->
	<jsp:include page="/dashboard/components/scripts.jsp"/>
	
	<!-- Custom JavaScript for password toggle -->
	<script src="${pageContext.request.contextPath}/public/js/login.js"></script>

</body>
</html>
