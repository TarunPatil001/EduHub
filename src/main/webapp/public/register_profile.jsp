<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<!-- Include common head elements (meta tags, Bootstrap, icons) -->
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Complete Profile - EduHub"/>
		<jsp:param name="description" value="Complete your institute profile setup"/>
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
									<h2 class="brand-title">Final Step!</h2>
									<p class="brand-subtitle">Complete your profile to get started</p>
									
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
										
										<!-- Step 2 - Admin Account (Completed) -->
										<div class="progress-step completed">
											<div class="step-circle"><i class="bi bi-check"></i></div>
											<div class="step-info">
												<h6>Admin Account</h6>
												<p>Completed</p>
											</div>
										</div>
										
										<!-- Step 3 - Setup Profile (Active) -->
										<div class="progress-step active">
											<div class="step-circle">3</div>
											<div class="step-info">
												<h6>Complete Profile</h6>
												<p>In progress</p>
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
										<div class="step-badge">Step 3 of 3</div>
										<h3>Setup Institute Profile</h3>
										<p>Complete your institute's detailed information</p>
									</div>

									<!-- Profile setup form -->
									<form action="${pageContext.request.contextPath}/public/login.jsp?registered=true" method="post" class="auth-form" enctype="multipart/form-data">
										
										<!-- Institute Complete Address Field -->
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

										<!-- Location Details - Postal Code and Established Year -->
										<div class="row">
											<!-- Postal Code Field -->
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
											
											<!-- Established Year Field -->
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

										<!-- Institute Website Field (Optional) -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="url"/>
											<jsp:param name="id" value="website"/>
											<jsp:param name="name" value="website"/>
											<jsp:param name="icon" value="globe"/>
											<jsp:param name="label" value="Website (Optional)"/>
											<jsp:param name="placeholder" value="https://www.yourinstitute.com"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Official Registration Number Field -->
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

										<!-- Student Capacity Selection -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="select"/>
											<jsp:param name="id" value="studentCapacity"/>
											<jsp:param name="name" value="studentCapacity"/>
											<jsp:param name="icon" value="people"/>
											<jsp:param name="label" value="Student Capacity"/>
											<jsp:param name="placeholder" value="Select capacity range"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="options" value="0-100|0-100 students,101-500|101-500 students,501-1000|501-1000 students,1001-5000|1001-5000 students,5000+|5000+ students"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Institute Logo Upload Field (Optional) -->
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

										<!-- About Institute Description Field -->
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

										<!-- Terms & Conditions Checkbox -->
										<div class="form-check mb-4">
											<input class="form-check-input" type="checkbox" id="terms" required>
											<label class="form-check-label" for="terms">
												I agree to the <a href="#" class="text-primary">Terms & Conditions</a> and <a href="#" class="text-primary">Privacy Policy</a>
											</label>
										</div>

										<!-- Navigation Buttons - Back and Complete -->
										<div class="row g-2 mb-3">
											<!-- Back button to previous step -->
											<div class="col-6">
												<jsp:include page="/dashboard/components/back-button.jsp">
													<jsp:param name="url" value="${pageContext.request.contextPath}/public/register_admin.jsp"/>
													<jsp:param name="text" value="Back"/>
													<jsp:param name="class" value="w-100"/>
												</jsp:include>
											</div>
											<!-- Complete registration button -->
											<div class="col-6">
												<button type="submit" class="btn btn-primary w-100 auth-submit-btn">
													Complete <i class="bi bi-check-circle"></i>
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

</body>
</html>
