<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<!-- Include common head elements (meta tags, Bootstrap, icons) -->
	<jsp:include page="/dashboard/components/head.jsp">
		<jsp:param name="title" value="Register Institute - EduHub"/>
		<jsp:param name="description" value="Register your institute with EduHub"/>
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
									<h2 class="brand-title">Get Started</h2>
									<p class="brand-subtitle">Join thousands of institutes managing education seamlessly</p>
									
									<!-- Progress Steps -->
									<div class="registration-progress">
										
										<!-- Step 1 - Register Institute (Active) -->
										<div class="progress-step active">
											<div class="step-circle">1</div>
											<div class="step-info">
												<h6>Institute Details</h6>
												<p>Basic information</p>
											</div>
										</div>
										
										<!-- Step 2 - Admin Account -->
										<div class="progress-step">
											<div class="step-circle">2</div>
											<div class="step-info">
												<h6>Admin Account</h6>
												<p>Create credentials</p>
											</div>
										</div>
										
										<!-- Step 3 - Setup Profile -->
										<div class="progress-step">
											<div class="step-circle">3</div>
											<div class="step-info">
												<h6>Complete Profile</h6>
												<p>Additional details</p>
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
										<div class="step-badge">Step 1 of 3</div>
										<h3>Register Your Institute</h3>
										<p>Enter your institute's basic information to get started</p>
									</div>

									<!-- Registration form -->
									<form action="${pageContext.request.contextPath}/public/register_admin.jsp" method="post" class="auth-form">
										
										<!-- Institute Name Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="text"/>
											<jsp:param name="id" value="instituteName"/>
											<jsp:param name="name" value="instituteName"/>
											<jsp:param name="icon" value="building"/>
											<jsp:param name="label" value="Institute Name"/>
											<jsp:param name="placeholder" value="Enter institute name"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Institute Type Selection -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="select"/>
											<jsp:param name="id" value="instituteType"/>
											<jsp:param name="name" value="instituteType"/>
											<jsp:param name="icon" value="mortarboard"/>
											<jsp:param name="label" value="Institute Type"/>
											<jsp:param name="placeholder" value="Select institute type"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="options" value="school|School,college|College,university|University,training_center|Training Center,coaching_institute|Coaching Institute"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Official Email Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="email"/>
											<jsp:param name="id" value="instituteEmail"/>
											<jsp:param name="name" value="instituteEmail"/>
											<jsp:param name="icon" value="envelope"/>
											<jsp:param name="label" value="Official Email Address"/>
											<jsp:param name="placeholder" value="contact@yourinstitute.com"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Contact Phone Field -->
										<jsp:include page="/dashboard/components/input-field.jsp">
											<jsp:param name="type" value="tel"/>
											<jsp:param name="id" value="institutePhone"/>
											<jsp:param name="name" value="institutePhone"/>
											<jsp:param name="icon" value="telephone"/>
											<jsp:param name="label" value="Contact Phone"/>
											<jsp:param name="placeholder" value="+1 (555) 000-0000"/>
											<jsp:param name="required" value="true"/>
											<jsp:param name="class" value="form-group"/>
										</jsp:include>

										<!-- Location Fields - Country and City -->
										<div class="row">
											<!-- Country Selection -->
											<jsp:include page="/dashboard/components/input-field.jsp">
												<jsp:param name="type" value="select"/>
												<jsp:param name="id" value="country"/>
												<jsp:param name="name" value="country"/>
												<jsp:param name="icon" value="globe"/>
												<jsp:param name="label" value="Country"/>
												<jsp:param name="placeholder" value="Select country"/>
												<jsp:param name="required" value="true"/>
												<jsp:param name="options" value="US|United States,UK|United Kingdom,CA|Canada,AU|Australia,IN|India,other|Other"/>
												<jsp:param name="class" value="col-md-6 form-group"/>
											</jsp:include>
											
											<!-- City Field -->
											<jsp:include page="/dashboard/components/input-field.jsp">
												<jsp:param name="type" value="text"/>
												<jsp:param name="id" value="city"/>
												<jsp:param name="name" value="city"/>
												<jsp:param name="icon" value="geo-alt"/>
												<jsp:param name="label" value="City"/>
												<jsp:param name="placeholder" value="Enter city"/>
												<jsp:param name="required" value="true"/>
												<jsp:param name="class" value="col-md-6 form-group"/>
											</jsp:include>
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

	<!-- Bootstrap and jQuery scripts -->
	<jsp:include page="/dashboard/components/scripts.jsp"/>

</body>
</html>
