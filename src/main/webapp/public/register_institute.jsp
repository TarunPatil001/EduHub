<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Register Institute - Step 1 - EduHub"/>
		<jsp:param name="description" value="Register your institute with EduHub"/>
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
									<p class="brand-subtitle">Join the future of educational management</p>
									
									<!-- Progress Steps -->
									<div class="registration-progress">
										<div class="progress-step active">
											<div class="step-circle">1</div>
											<div class="step-info">
												<h6>Register Institute</h6>
												<p>Basic information</p>
											</div>
										</div>
										<div class="progress-step">
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
										<div class="step-badge">Step 1 of 3</div>
										<h3>Register Your Institute</h3>
										<p>Enter your institute's basic information to get started</p>
									</div>

									<form action="${pageContext.request.contextPath}/public/register_admin.jsp" method="post" class="auth-form">
										
										<!-- Institute Name -->
										<div class="form-group">
											<label for="instituteName" class="form-label">
												<i class="bi bi-building"></i> Institute Name
											</label>
											<input 
												type="text" 
												class="form-control" 
												id="instituteName" 
												name="instituteName" 
												placeholder="Enter institute name" 
												required
											>
										</div>

										<!-- Institute Type -->
										<div class="form-group">
											<label for="instituteType" class="form-label">
												<i class="bi bi-mortarboard"></i> Institute Type
											</label>
											<select class="form-select" id="instituteType" name="instituteType" required>
												<option value="" selected>Select institute type</option>
												<option value="school">School</option>
												<option value="college">College</option>
												<option value="university">University</option>
												<option value="training_center">Training Center</option>
												<option value="coaching_institute">Coaching Institute</option>
											</select>
										</div>

										<!-- Email -->
										<div class="form-group">
											<label for="instituteEmail" class="form-label">
												<i class="bi bi-envelope"></i> Official Email Address
											</label>
											<input 
												type="email" 
												class="form-control" 
												id="instituteEmail" 
												name="instituteEmail" 
												placeholder="contact@yourinstitute.com" 
												required
											>
										</div>

										<!-- Phone -->
										<div class="form-group">
											<label for="institutePhone" class="form-label">
												<i class="bi bi-telephone"></i> Contact Phone
											</label>
											<input 
												type="tel" 
												class="form-control" 
												id="institutePhone" 
												name="institutePhone" 
												placeholder="+1 (555) 000-0000" 
												required
											>
										</div>

										<!-- Country -->
										<div class="row">
											<div class="col-md-6">
												<div class="form-group">
													<label for="country" class="form-label">
														<i class="bi bi-globe"></i> Country
													</label>
													<select class="form-select" id="country" name="country" required>
														<option value="" selected>Select country</option>
														<option value="US">United States</option>
														<option value="UK">United Kingdom</option>
														<option value="CA">Canada</option>
														<option value="AU">Australia</option>
														<option value="IN">India</option>
														<option value="other">Other</option>
													</select>
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="city" class="form-label">
														<i class="bi bi-geo-alt"></i> City
													</label>
													<input 
														type="text" 
														class="form-control" 
														id="city" 
														name="city" 
														placeholder="Enter city" 
														required
													>
												</div>
											</div>
										</div>

										<!-- Submit Button -->
										<button type="submit" class="btn btn-primary btn-lg w-100 auth-submit-btn">
											Continue to Admin Setup
											<i class="bi bi-arrow-right"></i>
										</button>

										<!-- Login Link -->
										<div class="auth-footer">
											<p>Already registered? <a href="${pageContext.request.contextPath}/public/login.jsp" class="text-primary fw-bold">Sign In</a></p>
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

</body>
</html>
