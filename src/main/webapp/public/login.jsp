<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Institute Login - EduHub"/>
		<jsp:param name="description" value="Login to your institute dashboard on EduHub"/>
	</jsp:include>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
</head>
<body class="auth-page">

	<jsp:include page="/public/components/navbar.jsp">
		<jsp:param name="activePage" value="login"/>
	</jsp:include>

	<main class="auth-container">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-9">
					<div class="auth-card login-card">
						<div class="row g-0">
							<!-- Left Side - Branding -->
							<div class="col-lg-5 auth-brand-side">
								<div class="auth-brand-content">
									<div class="brand-logo">
										<h1 class="logo-text">EDUHUB</h1>
										<div class="logo-underline"></div>
									</div>
									<h2 class="brand-title">Institute Portal Access</h2>
									<p class="brand-subtitle">Manage your institution's academic operations seamlessly</p>
									<div class="brand-features">
										<div class="feature-item">
											<i class="bi bi-check-circle-fill"></i>
											<span>Secure Institute Dashboard</span>
										</div>
										<div class="feature-item">
											<i class="bi bi-check-circle-fill"></i>
											<span>Student & Staff Management</span>
										</div>
										<div class="feature-item">
											<i class="bi bi-check-circle-fill"></i>
											<span>Real-time Analytics</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Side - Login Form -->
							<div class="col-lg-7 auth-form-side">
								<div class="auth-form-content">
									<div class="form-header">
										<h3>Welcome Back</h3>
										<p>Sign in to your institute account</p>
									</div>

									<!-- Error/Success Messages -->
									<% if(request.getParameter("error") != null) { %>
										<div class="alert alert-danger">
											<i class="bi bi-x-circle-fill"></i>
											<span>Invalid credentials. Please try again.</span>
										</div>
									<% } %>
									
									<% if(request.getParameter("logout") != null) { %>
										<div class="alert alert-success">
											<i class="bi bi-check-circle-fill"></i>
											<span>Successfully logged out.</span>
										</div>
									<% } %>
									
									<% if(request.getParameter("registered") != null) { %>
										<div class="alert alert-success">
											<i class="bi bi-check-circle-fill"></i>
											<span>Registration successful! Please login.</span>
										</div>
									<% } %>

									<form action="${pageContext.request.contextPath}/login" method="post" class="auth-form">
										<!-- Institute ID / Email -->
										<div class="form-group">
											<label for="username" class="form-label">
												<i class="bi bi-building"></i> Institute ID / Email
											</label>
											<input 
												type="text" 
												class="form-control" 
												id="username" 
												name="username" 
												placeholder="Enter your institute ID or email" 
												required
												autocomplete="username"
											>
										</div>

										<!-- Password -->
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
												<button type="button" class="password-toggle" onclick="togglePassword('password')">
													<i class="bi bi-eye" id="password-icon"></i>
												</button>
											</div>
										</div>

										<!-- Remember Me & Forgot Password -->
										<div class="d-flex justify-content-between align-items-center mb-3">
											<div class="form-check">
												<input class="form-check-input" type="checkbox" id="remember" name="remember">
												<label class="form-check-label" for="remember">
													Remember me
												</label>
											</div>
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

	<jsp:include page="/public/components/scripts.jsp"/>
	
	<script>
		function togglePassword(fieldId) {
			const field = document.getElementById(fieldId);
			const icon = document.getElementById(fieldId + '-icon');
			
			if (field.type === 'password') {
				field.type = 'text';
				icon.classList.remove('bi-eye');
				icon.classList.add('bi-eye-slash');
			} else {
				field.type = 'password';
				icon.classList.remove('bi-eye-slash');
				icon.classList.add('bi-eye');
			}
		}
	</script>

</body>
</html>
