<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Security Check: Ensure user has verified OTP
    // This prevents direct access to the JSP without going through the OTP flow
    if (session == null || session.getAttribute("otp_verified") == null) {
        response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
        return;
    }
%>
<%!
    // Helper to prevent XSS injection
    public String escapeHtml(String text) {
        if (text == null) return null;
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#x27;");
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - EduHub</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>

    <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative overflow-hidden">
        
        <!-- Background Decoration -->
        <div class="position-absolute top-0 start-0 w-100 h-100" style="z-index: 0;">
            <div class="position-absolute top-0 start-0 w-100 h-50 bg-gradient-primary" style="border-bottom-left-radius: 50% 20%; border-bottom-right-radius: 50% 20%; transform: scaleX(1.2);"></div>
        </div>

        <div class="card border-0 shadow-lg" style="max-width: 450px; width: 100%; z-index: 1; border-radius: 16px;">
            <div class="card-body p-5">
                
                <!-- Header -->
                <div class="text-center mb-4">
                    <h2 class="fw-bold mb-2">Create New Password</h2>
                    <p class="text-muted">Please enter your new password below.</p>
                </div>

                <!-- Error Messages -->
                <% if (request.getParameter("error") != null) { %>
                    <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        <div><%= escapeHtml(java.net.URLDecoder.decode(request.getParameter("error"), "UTF-8")) %></div>
                    </div>
                <% } %>

                <!-- Reset Form -->
                <form action="${pageContext.request.contextPath}/auth/reset-password" method="post" id="resetPasswordForm">
                    
                    <!-- New Password -->
                    <div class="mb-3">
                        <label for="password" class="form-label fw-semibold">
                            <i class="fas fa-lock me-1"></i> New Password
                        </label>
                        <div class="input-group">
                            <input 
                                type="password" 
                                class="form-control form-control-lg" 
                                id="password" 
                                name="password" 
                                placeholder="Enter new password"
                                required
                                autocomplete="new-password"
                            >
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="form-text text-muted small mt-1">
                            <i class="fas fa-info-circle me-1"></i>
                            Must be at least 8 characters with uppercase, lowercase, number & special char.
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-4">
                        <label for="confirmPassword" class="form-label fw-semibold">
                            <i class="fas fa-check-circle me-1"></i> Confirm Password
                        </label>
                        <div class="input-group">
                            <input 
                                type="password" 
                                class="form-control form-control-lg" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                placeholder="Confirm new password"
                                required
                                autocomplete="new-password"
                            >
                            <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary btn-lg fw-semibold shadow-sm">
                            Reset Password
                        </button>
                    </div>
                </form>

                <!-- Footer -->
                <div class="text-center text-muted small">
                    &copy; <%= java.time.Year.now().getValue() %> EduHub. All rights reserved.
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Toggle Password Visibility
        function setupToggle(btnId, inputId) {
            const btn = document.getElementById(btnId);
            const input = document.getElementById(inputId);
            const icon = btn.querySelector('i');

            btn.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }

        setupToggle('togglePassword', 'password');
        setupToggle('toggleConfirmPassword', 'confirmPassword');

        // Form Validation
        document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (password !== confirmPassword) {
                e.preventDefault();
                alert("Passwords do not match!");
                return;
            }

            if (!passwordRegex.test(password)) {
                e.preventDefault();
                alert("Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.");
                return;
            }
        });
    </script>
</body>
</html>
