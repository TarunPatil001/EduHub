<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Create Admin Account - Step 2 - EduHub"/>
		<jsp:param name="description" value="Create your institute admin account"/>
	</jsp:include>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
</head>
<body class="auth-page">

	<jsp:include page="/public/components/navbar.jsp">
		<jsp:param name="activePage" value="register"/>
	</jsp:include>

	<main class="auth-container">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-9">
					<div class="auth-card register-card">
						<div class="row g-0">
							<!-- Left Side - Progress & Info -->
							<div class="col-lg-5 auth-brand-side">
								<div class="auth-brand-content">
									<div class="brand-logo">
										<h1 class="logo-text">EDUHUB</h1>
										<div class="logo-underline"></div>
									</div>
									
									<h2 class="brand-title">Institute Registration</h2>
									<p class="brand-subtitle">Setting up your admin credentials</p>
									
									<!-- Progress Steps -->
									<div class="registration-progress">
										<div class="progress-step completed">
											<div class="step-circle"><i class="bi bi-check"></i></div>
											<div class="step-info">
												<h6>Register Institute</h6>
												<p>Basic information</p>
											</div>
										</div>
										<div class="progress-step active">
											<div class="step-circle">2</div>
											<div class="step-info">
												<h6>Admin Account</h6>
												<p>Create admin login</p>
											</div>
										</div>
										<div class="progress-step">
											<div class="step-circle">3</div>
											<div class="step-info">
												<h6>Setup Profile</h6>
												<p>Complete details</p>
											</div>
										</div>
										<div class="progress-step">
											<div class="step-circle">4</div>
											<div class="step-info">
												<h6>Login</h6>
												<p>Access dashboard</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Side - Form -->
							<div class="col-lg-7 auth-form-side">
								<div class="auth-form-content">
									<div class="form-header">
										<div class="step-badge">Step 2 of 3</div>
										<h3>Create Admin Account</h3>
										<p>Set up your institute administrator credentials</p>
									</div>

									<form action="${pageContext.request.contextPath}/public/register_profile.jsp" method="post" class="auth-form">
										
										<!-- Admin Full Name -->
										<div class="form-group">
											<label for="adminName" class="form-label">
												<i class="bi bi-person"></i> Admin Full Name
											</label>
											<input 
												type="text" 
												class="form-control" 
												id="adminName" 
												name="adminName" 
												placeholder="Enter admin's full name" 
												required
											>
										</div>

										<!-- Admin Email -->
										<div class="form-group">
											<label for="adminEmail" class="form-label">
												<i class="bi bi-envelope"></i> Admin Email Address
											</label>
											<input 
												type="email" 
												class="form-control" 
												id="adminEmail" 
												name="adminEmail" 
												placeholder="admin@yourinstitute.com" 
												required
											>
										</div>

										<!-- Username -->
										<div class="form-group">
											<label for="username" class="form-label">
												<i class="bi bi-person-badge"></i> Username
											</label>
											<input 
												type="text" 
												class="form-control" 
												id="username" 
												name="username" 
												placeholder="Choose a unique username" 
												required
												pattern="[a-zA-Z0-9_]{4,20}"
												title="Username must be 4-20 characters (letters, numbers, underscore only)"
											>
											<small class="form-text text-muted">4-20 characters, letters, numbers, and underscore only</small>
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
													placeholder="Create a strong password" 
													required
													minlength="8"
												>
												<button type="button" class="password-toggle" onclick="togglePassword('password')">
													<i class="bi bi-eye" id="password-icon"></i>
												</button>
											</div>
											<small class="form-text text-muted">At least 8 characters with uppercase, lowercase, and number</small>
										</div>

										<!-- Confirm Password -->
										<div class="form-group">
											<label for="confirmPassword" class="form-label">
												<i class="bi bi-lock-fill"></i> Confirm Password
											</label>
											<div class="password-input-wrapper">
												<input 
													type="password" 
													class="form-control" 
													id="confirmPassword" 
													name="confirmPassword" 
													placeholder="Re-enter your password" 
													required
												>
												<button type="button" class="password-toggle" onclick="togglePassword('confirmPassword')">
													<i class="bi bi-eye" id="confirmPassword-icon"></i>
												</button>
											</div>
										</div>

										<!-- Phone Number -->
										<div class="form-group">
											<label for="adminPhone" class="form-label">
												<i class="bi bi-phone"></i> Phone Number
											</label>
											<input 
												type="tel" 
												class="form-control" 
												id="adminPhone" 
												name="adminPhone" 
												placeholder="+1 (555) 000-0000" 
												required
											>
										</div>

										<!-- Navigation Buttons -->
										<div class="row g-2">
											<div class="col-6">
												<a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-outline-secondary btn-lg w-100">
													<i class="bi bi-arrow-left"></i> Back
												</a>
											</div>
											<div class="col-6">
												<button type="submit" class="btn btn-primary btn-lg w-100 auth-submit-btn">
													Continue
													<i class="bi bi-arrow-right"></i>
												</button>
											</div>
										</div>

										<!-- Login Link -->
										<div class="auth-footer">
											<p>Already have an account? <a href="${pageContext.request.contextPath}/public/login.jsp" class="text-primary fw-bold">Sign In</a></p>
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

		// Form validation
		document.querySelector('.auth-form').addEventListener('submit', function(e) {
			const password = document.getElementById('password').value;
			const confirmPassword = document.getElementById('confirmPassword').value;
			
			if (password !== confirmPassword) {
				e.preventDefault();
				alert('Passwords do not match!');
				return false;
			}
			
			if (password.length < 8) {
				e.preventDefault();
				alert('Password must be at least 8 characters long!');
				return false;
			}

			// Check password strength
			const hasUpperCase = /[A-Z]/.test(password);
			const hasLowerCase = /[a-z]/.test(password);
			const hasNumbers = /\d/.test(password);
			
			if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
				e.preventDefault();
				alert('Password must contain at least one uppercase letter, one lowercase letter, and one number!');
				return false;
			}
		});
	</script>

</body>
</html>
