<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%!
    // Helper method to get value from either attribute or parameter
    public String getFormValue(HttpServletRequest request, String name) {
        Object attrValue = request.getAttribute(name);
        String paramValue = request.getParameter(name);
        
        if (attrValue != null) {
            return attrValue.toString();
        } else if (paramValue != null) {
            return paramValue;
        }
        return "";
    }
%>
<%
    // Get all form values (from attributes if error forward, or parameters if normal submit)
    String instituteName = getFormValue(request, "instituteName");
    String instituteType = getFormValue(request, "instituteType");
    String instituteEmail = getFormValue(request, "instituteEmail");
    String institutePhone = getFormValue(request, "institutePhone");
    String address = getFormValue(request, "address");
    String city = getFormValue(request, "city");
    String state = getFormValue(request, "state");
    String zipCode = getFormValue(request, "zipCode");
    String country = getFormValue(request, "country");
    String fullName = getFormValue(request, "fullName");
    String adminEmail = getFormValue(request, "adminEmail");
    String adminPhone = getFormValue(request, "adminPhone");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Admin Account - EduHub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
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
                    <h2 class="mb-3">Almost There!</h2>
                    <p class="lead mb-4">Create your admin credentials to continue</p>
                    
                    <!-- Registration Steps -->
                    <div class="d-flex flex-column gap-3 text-start mx-auto" style="max-width: 350px;">
                        <div class="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-10 rounded">
                            <div class="bg-white text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <i class="fas fa-check"></i>
                            </div>
                            <div>
                                <strong>Institute Details</strong>
                                <small class="d-block opacity-75">Completed</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-10 rounded">
                            <div class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <strong>2</strong>
                            </div>
                            <div>
                                <strong>Admin Account</strong>
                                <small class="d-block opacity-75">Current step</small>
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
                                <span class="badge bg-primary mb-2">Step 2 of 2</span>
                                <h3 class="fw-bold mb-2">Create Admin Account</h3>
                                <p class="text-muted mb-0">Set up your administrator credentials</p>
                            </div>

                            <!-- Registration Form -->
                            <form action="${pageContext.request.contextPath}/auth/register" method="post" id="adminForm">
                                
                                <!-- Hidden fields from institute form -->
                                <input type="hidden" name="instituteName" id="instituteName" value="<%= instituteName %>">
                                <input type="hidden" name="instituteType" id="instituteType" value="<%= instituteType %>">
                                <input type="hidden" name="instituteEmail" id="instituteEmail" value="<%= instituteEmail %>">
                                <input type="hidden" name="institutePhone" id="institutePhone" value="<%= institutePhone %>">
                                <input type="hidden" name="address" id="address" value="<%= address %>">
                                <input type="hidden" name="city" id="city" value="<%= city %>">
                                <input type="hidden" name="state" id="state" value="<%= state %>">
                                <input type="hidden" name="zipCode" id="zipCode" value="<%= zipCode %>">
                                <input type="hidden" name="country" id="country" value="<%= country %>">
                                
                                <!-- Full Name -->
                                <div class="mb-3">
                                    <label for="fullName" class="form-label fw-semibold">
                                        <i class="fas fa-user me-1"></i> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        class="form-control form-control-lg" 
                                        id="fullName" 
                                        name="fullName" 
                                        placeholder="Enter your full name"
                                        value="<%= fullName %>"
                                        required
                                    >
                                </div>

                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="adminEmail" class="form-label fw-semibold">
                                        <i class="fas fa-envelope me-1"></i> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control form-control-lg" 
                                        id="adminEmail" 
                                        name="adminEmail" 
                                        placeholder="admin@example.com"
                                        value="<%= adminEmail %>"
                                        required
                                    >
                                </div>

                                <!-- Phone -->
                                <div class="mb-3">
                                    <label for="adminPhone" class="form-label fw-semibold">
                                        <i class="fas fa-phone me-1"></i> Phone Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        class="form-control form-control-lg" 
                                        id="adminPhone" 
                                        name="adminPhone" 
                                        placeholder="+1 (555) 000-0000"
                                        value="<%= adminPhone %>"
                                        required
                                    >
                                </div>

                                <!-- Password -->
                                <div class="mb-3">
                                    <label for="password" class="form-label fw-semibold">
                                        <i class="fas fa-lock me-1"></i> Password
                                    </label>
                                    <div class="input-group">
                                        <input 
                                            type="password" 
                                            class="form-control form-control-lg" 
                                            id="password" 
                                            name="password" 
                                            placeholder="Create a strong password"
                                            required
                                        >
                                        <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                            <i class="fas fa-eye" id="toggleIcon"></i>
                                        </button>
                                    </div>
                                    <small class="text-muted">At least 8 characters</small>
                                </div>

                                <!-- Confirm Password -->
                                <div class="mb-3">
                                    <label for="confirmPassword" class="form-label fw-semibold">
                                        <i class="fas fa-lock me-1"></i> Confirm Password
                                    </label>
                                    <div class="input-group">
                                        <input 
                                            type="password" 
                                            class="form-control form-control-lg" 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            placeholder="Re-enter your password"
                                            required
                                        >
                                        <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                            <i class="fas fa-eye" id="toggleConfirmIcon"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                                    Complete Registration
                                    <i class="fas fa-check ms-2"></i>
                                </button>

                                <!-- Back Link -->
                                <div class="text-center">
                                    <a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="text-decoration-none text-muted small">
                                        <i class="fas fa-arrow-left me-1"></i> Back to Institute Details
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Centralized Toast Notification Component -->
    <jsp:include page="/common/toast-notification.jsp"/>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            <% 
            String error = (String) request.getAttribute("error");
            boolean hasError = (error != null && !error.isEmpty());
            %>
            
            // Password toggle functionality
            const togglePassword = document.getElementById('togglePassword');
            const password = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');
            if (togglePassword && password && toggleIcon) {
                togglePassword.addEventListener('click', function() {
                    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                    password.setAttribute('type', type);
                    toggleIcon.classList.toggle('fa-eye');
                    toggleIcon.classList.toggle('fa-eye-slash');
                });
            }

            // Confirm password toggle functionality
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            const toggleConfirmIcon = document.getElementById('toggleConfirmIcon');
            if (toggleConfirmPassword && confirmPassword && toggleConfirmIcon) {
                toggleConfirmPassword.addEventListener('click', function() {
                    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                    confirmPassword.setAttribute('type', type);
                    toggleConfirmIcon.classList.toggle('fa-eye');
                    toggleConfirmIcon.classList.toggle('fa-eye-slash');
                });
            }
            
            // Show welcome toast if there's NO error (coming from institute form for first time)
            <% if (!hasError) { %>
                const instituteName = document.getElementById('instituteName').value;
                if (instituteName && typeof toast !== 'undefined') {
                    toast.success('Step 1 complete! Create admin account.');
                }
            <% } %>

            // Clear form only when navigating back after leaving the page successfully
            window.addEventListener('pageshow', function(event) {
                // If page is loaded from browser cache (back button pressed)
                if (event.persisted) {
                    console.log('Page loaded from cache, resetting form');
                    document.getElementById('adminForm').reset();
                }
            });

            // Display backend error if exists
            <% if (hasError) { %>
                if (typeof toast !== 'undefined') {
                    toast.error('<%= error.replace("'", "\\'").replace("\n", " ").replace("\r", " ") %>');
                } else {
                    console.error('toast function not available');
                    alert('<%= error.replace("'", "\\'") %>');
                }
            <% } %>

            // Form validation and submission
            const adminForm = document.getElementById('adminForm');
            if (adminForm) {
                adminForm.addEventListener('submit', function(e) {
                    // Validate form first
                    if (!adminForm.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        adminForm.classList.add('was-validated');
                        if (typeof toast !== 'undefined') {
                            toast.error('Fill in all required fields');
                        }
                        return false;
                    }
                    
                    // Check password match
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    if (password !== confirmPassword) {
                        e.preventDefault();
                        if (typeof toast !== 'undefined') {
                            toast.error('Passwords do not match!');
                        }
                        return false;
                    }
                    
                    // Show loading toast - will be replaced by success/error after redirect
                    if (typeof toast !== 'undefined') {
                        toast.loading('Creating your account...');
                    }
                    // Let form submit normally to Java servlet
                });
            }
        });
    </script>
</body>
</html>
