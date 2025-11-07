<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<jsp:include page="/public/components/head.jsp">
		<jsp:param name="title" value="Setup Institute Profile - Step 3 - EduHub"/>
		<jsp:param name="description" value="Complete your institute profile setup"/>
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
										<div class="form-group">
											<label for="address" class="form-label">
												<i class="bi bi-geo-alt"></i> Complete Address
											</label>
											<textarea 
												class="form-control" 
												id="address" 
												name="address" 
												rows="3" 
												placeholder="Enter complete institute address"
												required
											></textarea>
										</div>

										<!-- Postal Code & Established Year -->
										<div class="row">
											<div class="col-md-6">
												<div class="form-group">
													<label for="postalCode" class="form-label">
														<i class="bi bi-mailbox"></i> Postal Code
													</label>
													<input 
														type="text" 
														class="form-control" 
														id="postalCode" 
														name="postalCode" 
														placeholder="Enter postal code" 
														required
													>
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="establishedYear" class="form-label">
														<i class="bi bi-calendar"></i> Established Year
													</label>
													<input 
														type="number" 
														class="form-control" 
														id="establishedYear" 
														name="establishedYear" 
														placeholder="YYYY" 
														min="1800" 
														max="2026"
														required
													>
												</div>
											</div>
										</div>

										<!-- Institute Website -->
										<div class="form-group">
											<label for="website" class="form-label">
												<i class="bi bi-globe"></i> Website (Optional)
											</label>
											<input 
												type="url" 
												class="form-control" 
												id="website" 
												name="website" 
												placeholder="https://www.yourinstitute.com"
											>
										</div>

										<!-- Registration Number -->
										<div class="form-group">
											<label for="registrationNumber" class="form-label">
												<i class="bi bi-file-text"></i> Registration Number
											</label>
											<input 
												type="text" 
												class="form-control" 
												id="registrationNumber" 
												name="registrationNumber" 
												placeholder="Enter official registration number" 
												required
											>
										</div>

										<!-- Student Capacity -->
										<div class="form-group">
											<label for="studentCapacity" class="form-label">
												<i class="bi bi-people"></i> Student Capacity
											</label>
											<select class="form-select" id="studentCapacity" name="studentCapacity" required>
												<option value="" selected>Select capacity range</option>
												<option value="0-100">0 - 100 students</option>
												<option value="101-500">101 - 500 students</option>
												<option value="501-1000">501 - 1,000 students</option>
												<option value="1001-5000">1,001 - 5,000 students</option>
												<option value="5000+">5,000+ students</option>
											</select>
										</div>

										<!-- Institute Logo -->
										<div class="form-group">
											<label for="logo" class="form-label">
												<i class="bi bi-image"></i> Institute Logo (Optional)
											</label>
											<input 
												type="file" 
												class="form-control" 
												id="logo" 
												name="logo" 
												accept="image/*"
											>
											<small class="form-text text-muted">Max size: 2MB. Formats: JPG, PNG</small>
										</div>

										<!-- Description -->
										<div class="form-group">
											<label for="description" class="form-label">
												<i class="bi bi-card-text"></i> About Institute
											</label>
											<textarea 
												class="form-control" 
												id="description" 
												name="description" 
												rows="4" 
												placeholder="Brief description about your institute"
												required
											></textarea>
										</div>

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
												<a href="${pageContext.request.contextPath}/public/register_admin.jsp" class="btn btn-outline-secondary w-100">
													<i class="bi bi-arrow-left"></i> Back
												</a>
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

	<jsp:include page="/public/components/scripts.jsp"/>

</body>
</html>
