<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<!-- Include common head elements (meta tags, Bootstrap, icons) -->
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Create Admin Account - EduHub"/>
		<jsp:param name="description" value="Create your institute admin account"/>
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
					
					<!-- Registration card -->
					<div class="auth-card">
						<div class="row g-0">
							
							<!-- Left Side - Progress & Info -->
							<div class="col-lg-5 auth-brand-side">
								<div class="auth-brand-content">
									
									<!-- Brand logo -->
									<div class="brand-logo">
										<h1 class="logo-text">EduHub</h1>
										<div class="logo-underline"></div>
									</div>
									
									<!-- Brand title and subtitle -->
									<h2 class="brand-title">Almost There!</h2>
									<p class="brand-subtitle">Create your admin credentials to continue</p>
									
									<!-- Progress Steps -->
									<div class="registration-progress">
										
										<!-- Step 1 - Register Institute (Completed) -->
										<div class="progress-step completed">
											<div class="step-circle"><i class="bi bi-check"></i></div>
											<div class="step-info">
												<h6>Institute Details</h6>
												<p>Completed</p>
											</div>
										</div>
										
										<!-- Step 2 - Admin Account (Active) -->
										<div class="progress-step active">
											<div class="step-circle">2</div>
											<div class="step-info">
												<h6>Admin Account</h6>
												<p>In progress</p>
											</div>
										</div>
										
										<!-- Step 3 - Setup Profile -->
										<div class="progress-step">
											<div class="step-circle">3</div>
											<div class="step-info">
												<h6>Complete Profile</h6>
												<p>Next step</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Side - Form -->
							<div class="col-lg-7 auth-form-side">
								<div class="auth-form-content">
									
									<!-- Form header -->
									<div class="form-header">
										<div class="step-badge">Step 2 of 3</div>
										<h3>Create Admin Account</h3>
										<p>Set up your institute administrator credentials</p>
									</div>

									<!-- Admin registration form -->
									<form action="${pageContext.request.contextPath}/public/register_profile.jsp" method="post" class="auth-form">
										
										<!-- Admin Full Name Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="text"/>
											<jsp:param name="id" value="adminName"/>
											<jsp:param name="name" value="adminName"/>
											<jsp:param name="icon" value="person"/>
											<jsp:param name="label" value="Admin Full Name"/>
											<jsp:param name="placeholder" value="Enter admin's full name"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Admin Email Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="email"/>
											<jsp:param name="id" value="adminEmail"/>
											<jsp:param name="name" value="adminEmail"/>
											<jsp:param name="icon" value="envelope"/>
											<jsp:param name="label" value="Admin Email Address"/>
											<jsp:param name="placeholder" value="admin@yourinstitute.com"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Username Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="text"/>
											<jsp:param name="id" value="username"/>
											<jsp:param name="name" value="username"/>
											<jsp:param name="icon" value="person-badge"/>
											<jsp:param name="label" value="Username"/>
											<jsp:param name="placeholder" value="Choose a unique username"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="pattern" value="[a-zA-Z0-9_]{4,20}"/>
											<jsp:param name="helperText" value="4-20 characters, letters, numbers, and underscore only"/>
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
													placeholder="Create a strong password" 
													required
													minlength="8"
												>
												<!-- Toggle password visibility button -->
												<button type="button" class="password-toggle" onclick="togglePassword('password')">
													<i class="bi bi-eye" id="password-icon"></i>
												</button>
											</div>
											<small class="form-text text-muted">At least 8 characters with uppercase, lowercase, and number</small>
										</div>

										<!-- Confirm Password Field with Toggle Visibility -->
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
												<!-- Toggle confirm password visibility button -->
												<button type="button" class="password-toggle" onclick="togglePassword('confirmPassword')">
													<i class="bi bi-eye" id="confirmPassword-icon"></i>
												</button>
											</div>
										</div>

										<!-- Admin Phone Number Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="tel"/>
											<jsp:param name="id" value="adminPhone"/>
											<jsp:param name="name" value="adminPhone"/>
											<jsp:param name="icon" value="phone"/>
											<jsp:param name="label" value="Phone Number"/>
											<jsp:param name="placeholder" value="+1 (555) 000-0000"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Navigation Buttons - Back and Continue -->
										<div class="row g-2">
											<!-- Back button to previous step -->
											<div class="col-6">
												<jsp:include page="/dashboard/components/back-button.jsp">
													<jsp:param name="url" value="${pageContext.request.contextPath}/public/register_institute.jsp"/>
													<jsp:param name="text" value="Back"/>
													<jsp:param name="class" value="btn-lg w-100"/>
												</jsp:include>
											</div>
											<!-- Continue button to next step -->
											<div class="col-6">
												<button type="submit" class="btn btn-primary btn-lg w-100 auth-submit-btn">
													Continue
													<i class="bi bi-arrow-right"></i>
												</button>
											</div>
										</div>

										<!-- Login Link for existing users -->
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

	<!-- Bootstrap and jQuery scripts -->
	<jsp:include page="/dashboard/components/scripts.jsp"/>
	
	<!-- Custom JavaScript for password toggle and form validation -->
	<script src="${pageContext.request.contextPath}/public/js/register_admin.js"></script>

</body>
</html>
