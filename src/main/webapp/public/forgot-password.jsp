<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
    <title>Forgot Password - EduHub</title>

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
                
                <!-- Icon -->
                <div class="text-center mb-4">
                    <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style="width: 80px; height: 80px;">
                        <i class="fas fa-lock fa-3x text-primary"></i>
                    </div>
                </div>

                <!-- Header -->
                <div class="text-center mb-4">
                    <h2 class="fw-bold mb-2">Forgot Password?</h2>
                    <p class="text-muted">No worries! Enter your email and we'll send you a reset code.</p>
                </div>

                <!-- Error/Success Messages -->
                <% if (request.getParameter("error") != null) { %>
                    <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        <div><%= escapeHtml(java.net.URLDecoder.decode(request.getParameter("error"), "UTF-8")) %></div>
                    </div>
                <% } %>
                <% if (request.getParameter("message") != null) { %>
                    <div class="alert alert-success d-flex align-items-center mb-4" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        <div><%= escapeHtml(java.net.URLDecoder.decode(request.getParameter("message"), "UTF-8")) %></div>
                    </div>
                <% } %>

                <!-- Form -->
                <form action="${pageContext.request.contextPath}/auth/forgot-password" method="POST" class="needs-validation" novalidate>
                    
                    <!-- Email Input -->
                    <div class="mb-4">
                        <label for="email" class="form-label fw-semibold">
                            <i class="fas fa-envelope me-1"></i> Email Address
                        </label>
                        <input 
                            type="email" 
                            class="form-control form-control-lg" 
                            id="email" 
                            name="email" 
                            placeholder="Enter your registered email" 
                            required
                        >
                        <div class="invalid-feedback">
                            Please enter a valid email address.
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary btn-lg fw-semibold shadow-sm">
                            Send Reset Code
                        </button>
                    </div>

                    <!-- Back to Login -->
                    <div class="text-center">
                        <a href="${pageContext.request.contextPath}/public/login.jsp" class="text-decoration-none fw-medium d-inline-flex align-items-center gap-2 text-secondary hover-primary">
                            <i class="fas fa-arrow-left"></i> Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Footer -->
        <div class="position-absolute bottom-0 w-100 text-center pb-4 text-muted small" style="z-index: 1;">
            &copy; <%= java.time.Year.now().getValue() %> EduHub. All rights reserved.
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Toast Notifications -->
    <jsp:include page="/components/toast-dependencies.jsp" />
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get('error');
            const success = urlParams.get('success');
            
            if (error) {
                toast.error(decodeURIComponent(error));
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
            
            if (success) {
                toast.success(decodeURIComponent(success));
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        });
    </script>
</body>
</html>
