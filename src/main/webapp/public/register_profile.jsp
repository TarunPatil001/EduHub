<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Setup Institute Profile - Step 3 - EduHub"/>
		<jsp:param name="description" value="Complete your institute profile setup"/>
	</jsp:include>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
</head>
<body class="auth-page">

	<jsp:include page="/dashboard/components/navbar.jsp">
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
									<p class="brand-subtitle">Almost there! Complete your profile</p>
									
									<!-- Progress Steps -->
									<div class="registration-progress">
										<div class="progress-step completed">
											<div class="step-circle"><i class="bi bi-check"></i></div>
											<div class="step-info">
												<h6>Register Institute</h6>
												<p>Basic information</p>
											</div>
										</div>
										<div class="progress-step completed">
											<div class="step-circle"><i class="bi bi-check"></i></div>
											<div class="step-info">
												<h6>Admin Account</h6>
												<p>Create admin login</p>
											</div>
										</div>
										<div class="progress-step active">
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
										<div class="step-badge">Step 3 of 3</div>
										<h3>Setup Institute Profile</h3>
										<p>Complete your institute's detailed information</p>
									</div>

									<form action="${pageContext.request.contextPath}/public/login.jsp?registered=true" method="post" class="auth-form" enctype="multipart/form-data">
										
										<!-- Institute Address -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="textarea"/>
											<jsp:param name="id" value="address"/>
											<jsp:param name="name" value="address"/>
											<jsp:param name="icon" value="geo-alt"/>
											<jsp:param name="label" value="Complete Address"/>
											<jsp:param name="placeholder" value="Enter complete institute address"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="rows" value="3"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Postal Code & Established Year -->
										<div class="row">
											<jsp:include page="/dashboard/components/input-field.jsp">
												<jsp:param name="type" value="text"/>
												<jsp:param name="id" value="postalCode"/>
												<jsp:param name="name" value="postalCode"/>
												<jsp:param name="icon" value="mailbox"/>
												<jsp:param name="label" value="Postal Code"/>
												<jsp:param name="placeholder" value="Enter postal code"/>
												<jsp:param name="required" value="true"/>
												<jsp:param name="class" value="col-md-6 form-group"/>
											</jsp:include>
											
											<jsp:include page="/dashboard/components/input-field.jsp">
												<jsp:param name="type" value="number"/>
												<jsp:param name="id" value="establishedYear"/>
												<jsp:param name="name" value="establishedYear"/>
												<jsp:param name="icon" value="calendar"/>
												<jsp:param name="label" value="Established Year"/>
												<jsp:param name="placeholder" value="YYYY"/>
												<jsp:param name="required" value="true"/>
												<jsp:param name="min" value="1800"/>
												<jsp:param name="max" value="2026"/>
												<jsp:param name="class" value="col-md-6 form-group"/>
											</jsp:include>
										</div>

										<!-- Institute Website -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="url"/>
											<jsp:param name="id" value="website"/>
											<jsp:param name="name" value="website"/>
											<jsp:param name="icon" value="globe"/>
											<jsp:param name="label" value="Website (Optional)"/>
											<jsp:param name="placeholder" value="https://www.yourinstitute.com"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Registration Number -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="text"/>
											<jsp:param name="id" value="registrationNumber"/>
											<jsp:param name="name" value="registrationNumber"/>
											<jsp:param name="icon" value="file-text"/>
											<jsp:param name="label" value="Registration Number"/>
											<jsp:param name="placeholder" value="Enter official registration number"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Student Capacity -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="select"/>
											<jsp:param name="id" value="studentCapacity"/>
											<jsp:param name="name" value="studentCapacity"/>
											<jsp:param name="icon" value="people"/>
											<jsp:param name="label" value="Student Capacity"/>
											<jsp:param name="placeholder" value="Select capacity range"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="options" value="0-100|0 - 100 students,101-500|101 - 500 students,501-1000|501 - 1,000 students,1001-5000|1,001 - 5,000 students,5000+|5,000+ students"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Institute Logo -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="file"/>
											<jsp:param name="id" value="logo"/>
											<jsp:param name="name" value="logo"/>
											<jsp:param name="icon" value="image"/>
											<jsp:param name="label" value="Institute Logo (Optional)"/>
											<jsp:param name="accept" value="image/*"/>
											<jsp:param name="helperText" value="Max size: 2MB. Formats: JPG, PNG"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Description -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="textarea"/>
											<jsp:param name="id" value="description"/>
											<jsp:param name="name" value="description"/>
											<jsp:param name="icon" value="card-text"/>
											<jsp:param name="label" value="About Institute"/>
											<jsp:param name="placeholder" value="Brief description about your institute"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="rows" value="4"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Terms & Conditions -->
										<div class="form-check mb-4">
											<input class="form-check-input" type="checkbox" id="terms" required>
											<label class="form-check-label" for="terms">
												I agree to the <a href="#" class="text-primary">Terms & Conditions</a> and <a href="#" class="text-primary">Privacy Policy</a>
											</label>
										</div>

										<!-- Navigation Buttons -->
										<div class="row g-2 mb-3">
											<div class="col-6">
												<jsp:include page="/dashboard/components/back-button.jsp">
													<jsp:param name="url" value="${pageContext.request.contextPath}/public/register_admin.jsp"/>
													<jsp:param name="text" value="Back"/>
													<jsp:param name="class" value="w-100"/>
												</jsp:include>
											</div>
											<div class="col-6">
												<button type="submit" class="btn btn-primary w-100 auth-submit-btn">
													Complete <i class="bi bi-check-circle"></i>
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

	<jsp:include page="/dashboard/components/scripts.jsp"/>

</body>
</html>
