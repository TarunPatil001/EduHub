<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - EduHub</title>
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
                    <h2 class="mb-3">Welcome Back!</h2>
                    <p class="lead mb-4">Manage your educational institution with ease</p>
                    <div class="d-flex flex-column gap-3 text-start mx-auto" style="max-width: 350px;">
                        <div class="d-flex align-items-center gap-3">
                            <i class="fas fa-shield-alt fa-2x"></i>
                            <span>Secure & Reliable</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <i class="fas fa-chart-line fa-2x"></i>
                            <span>Real-time Analytics</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <i class="fas fa-users fa-2x"></i>
                            <span>Easy Management</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Login Form -->
            <div class="col-lg-7 d-flex align-items-center justify-content-center p-4">
                <div class="w-100" style="max-width: 480px;">
                    
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
                                <h3 class="fw-bold mb-2">Sign In</h3>
                                <p class="text-muted mb-0">Enter your credentials to access your account</p>
                            </div>

                            <!-- Login Form -->
                            <form action="${pageContext.request.contextPath}/auth/login" method="post" id="loginForm">
                                
                                <!-- Email Field -->
                                <div class="mb-3">
                                    <label for="username" class="form-label fw-semibold">
                                        <i class="fas fa-envelope me-1"></i> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control form-control-lg" 
                                        id="username" 
                                        name="username" 
                                        placeholder="Enter your email address"
                                        required
                                        autocomplete="email"
                                    >
                                </div>

                                <!-- Password Field -->
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
                                            placeholder="Enter your password"
                                            required
                                            autocomplete="current-password"
                                        >
                                        <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                            <i class="fas fa-eye" id="toggleIcon"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Remember Me & Forgot Password -->
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="remember" name="remember">
                                        <label class="form-check-label" for="remember">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#" class="text-decoration-none small">Forgot Password?</a>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                                    <i class="fas fa-sign-in-alt me-2"></i> Sign In
                                </button>

                                <!-- Divider -->
                                <div class="text-center my-4">
                                    <span class="text-muted small">Don't have an account?</span>
                                </div>

                                <!-- Register Link -->
                                <a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-outline-primary w-100">
                                    <i class="fas fa-user-plus me-2"></i> Register New Institute
                                </a>

                                <!-- Back to Home -->
                                <div class="text-center mt-4">
                                    <a href="${pageContext.request.contextPath}/index.jsp" class="text-decoration-none text-muted small">
                                        <i class="fas fa-arrow-left me-1"></i> Back to Home
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="text-center mt-4">
                        <p class="text-muted small mb-0">
                            <i class="fas fa-shield-alt me-1"></i> Secured with encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    
    <!-- Centralized Toast Notification Component -->
    <jsp:include page="/common/toast-notification.jsp"/>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Password toggle functionality
            const togglePassword = document.getElementById('togglePassword');
            const password = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');

            if (togglePassword) {
                togglePassword.addEventListener('click', function() {
                    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                    password.setAttribute('type', type);
                    
                    if(type === 'password') {
                        toggleIcon.classList.remove('fa-eye-slash');
                        toggleIcon.classList.add('fa-eye');
                    } else {
                        toggleIcon.classList.remove('fa-eye');
                        toggleIcon.classList.add('fa-eye-slash');
                    }
                });
            }

            // Show toast on form submission
            const loginForm = document.querySelector('form');
            if (loginForm && typeof showToast === 'function') {
                loginForm.addEventListener('submit', function(e) {
                    // Show loading toast
                    showToast('Signing in...', 'info', 2000);
                });
            }
        });
    </script>
</body>
</html>
