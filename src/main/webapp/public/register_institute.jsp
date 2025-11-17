<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Institute - EduHub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>

    <div class="container-fluid vh-100">
        <div class="row min-vh-100">
            
            <!-- Left Side - Branding (Hidden on mobile) -->
            <div class="col-lg-5 d-none d-lg-flex bg-gradient-primary text-white p-5 align-items-center justify-content-center">
                <div class="text-center">
                    <div class="mb-4">
                        <i class="fas fa-graduation-cap fa-5x mb-3"></i>
                        <h1 class="display-4 fw-bold brand-logo">EduHub</h1>
                    </div>
                    <h2 class="mb-3">Get Started!</h2>
                    <p class="lead mb-4">Join hundreds of institutions managing education with ease</p>
                    
                    <!-- Registration Steps -->
                    <div class="d-flex flex-column gap-3 text-start mx-auto" style="max-width: 350px;">
                        <div class="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-10 rounded">
                            <div class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <strong>1</strong>
                            </div>
                            <div>
                                <strong>Institute Details</strong>
                                <small class="d-block opacity-75">Basic information</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-10 rounded opacity-50">
                            <div class="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <strong>2</strong>
                            </div>
                            <div>
                                <strong>Admin Account</strong>
                                <small class="d-block">Create credentials</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Registration Form -->
            <div class="col-lg-7 d-flex align-items-center justify-content-center p-4">
                <div class="w-100" style="max-width: 600px;">
                    
                    <!-- Mobile Logo (Visible only on mobile) -->
                    <div class="text-center mb-4 d-lg-none">
                        <i class="fas fa-graduation-cap fa-3x text-primary mb-2"></i>
                        <h2 class="brand-logo text-primary">EduHub</h2>
                    </div>

                    <!-- Card -->
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-4 p-md-5">
                            
                            <!-- Header -->
                            <div class="mb-4">
                                <span class="badge bg-primary mb-2">Step 1 of 2</span>
                                <h3 class="fw-bold mb-2">Register Your Institute</h3>
                                <p class="text-muted mb-0">Enter your institute's basic information</p>
                            </div>

                            <!-- Registration Form -->
                            <form action="${pageContext.request.contextPath}/public/register_admin.jsp" method="post">
                                
                                <!-- Institute Name -->
                                <div class="mb-3">
                                    <label for="instituteName" class="form-label fw-semibold">
                                        <i class="fas fa-building me-1"></i> Institute Name
                                    </label>
                                    <input 
                                        type="text" 
                                        class="form-control form-control-lg" 
                                        id="instituteName" 
                                        name="instituteName" 
                                        placeholder="Enter institute name"
                                        required
                                    >
                                </div>

                                <!-- Institute Type -->
                                <div class="mb-3">
                                    <label for="instituteType" class="form-label fw-semibold">
                                        <i class="fas fa-graduation-cap me-1"></i> Institute Type
                                    </label>
                                    <select class="form-select form-select-lg" id="instituteType" name="instituteType" required>
                                        <option value="">Select institute type</option>
                                        <option value="school">School</option>
                                        <option value="college">College</option>
                                        <option value="university">University</option>
                                        <option value="training">Training Center</option>
                                        <option value="coaching">Coaching Institute</option>
                                    </select>
                                </div>

                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="instituteEmail" class="form-label fw-semibold">
                                        <i class="fas fa-envelope me-1"></i> Official Email
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control form-control-lg" 
                                        id="instituteEmail" 
                                        name="instituteEmail" 
                                        placeholder="contact@yourinstitute.com"
                                        required
                                    >
                                </div>

                                <!-- Phone -->
                                <div class="mb-3">
                                    <label for="institutePhone" class="form-label fw-semibold">
                                        <i class="fas fa-phone me-1"></i> Contact Phone
                                    </label>
                                    <input 
                                        type="tel" 
                                        class="form-control form-control-lg" 
                                        id="institutePhone" 
                                        name="institutePhone" 
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    >
                                </div>

                                <!-- Address -->
                                <div class="mb-3">
                                    <label for="address" class="form-label fw-semibold">
                                        <i class="fas fa-map-marker-alt me-1"></i> Address
                                    </label>
                                    <input 
                                        type="text" 
                                        class="form-control form-control-lg" 
                                        id="address" 
                                        name="address" 
                                        placeholder="Street address, building number"
                                        required
                                    >
                                </div>

                                <!-- Location -->
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="city" class="form-label fw-semibold">
                                            <i class="fas fa-city me-1"></i> City
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control form-control-lg" 
                                            id="city" 
                                            name="city" 
                                            placeholder="Enter city"
                                            required
                                        >
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="state" class="form-label fw-semibold">
                                            <i class="fas fa-map me-1"></i> State
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control form-control-lg" 
                                            id="state" 
                                            name="state" 
                                            placeholder="Enter state/province"
                                            required
                                        >
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="zipCode" class="form-label fw-semibold">
                                            <i class="fas fa-mail-bulk me-1"></i> ZIP/Postal Code <span class="text-muted">(Optional)</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control form-control-lg" 
                                            id="zipCode" 
                                            name="zipCode" 
                                            placeholder="Enter ZIP/postal code"
                                        >
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="country" class="form-label fw-semibold">
                                            <i class="fas fa-globe me-1"></i> Country
                                        </label>
                                        <select class="form-select form-select-lg" id="country" name="country" required>
                                            <option value="">Select country</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="CA">Canada</option>
                                            <option value="AU">Australia</option>
                                            <option value="IN">India</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                                    Continue to Admin Setup
                                    <i class="fas fa-arrow-right ms-2"></i>
                                </button>

                                <!-- Login Link -->
                                <div class="text-center">
                                    <span class="text-muted small">Already registered?</span>
                                    <a href="${pageContext.request.contextPath}/public/login.jsp" class="text-decoration-none ms-1">Sign In</a>
                                </div>

                                <!-- Back to Home -->
                                <div class="text-center mt-3">
                                    <a href="${pageContext.request.contextPath}/index.jsp" class="text-decoration-none text-muted small">
                                        <i class="fas fa-arrow-left me-1"></i> Back to Home
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/public/js/toast-notification.js"></script>
</body>
</html>
