<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Security Check: Ensure user has initiated password reset
    if (session == null || session.getAttribute("reset_user_id") == null) {
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
    <title>Verify OTP - EduHub</title>

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
                    <h2 class="fw-bold mb-2">Enter Verification Code</h2>
                    <%
                        String email = (String) session.getAttribute("reset_email");
                        String maskedEmail = "your email";
                        if (email != null && email.contains("@")) {
                            int atIndex = email.indexOf("@");
                            if (atIndex > 1) {
                                maskedEmail = email.charAt(0) + "*****" + email.substring(atIndex);
                            } else {
                                maskedEmail = email;
                            }
                        }
                    %>
                    <p class="text-muted">We've sent a 6-digit code to your email address <br><strong><%= maskedEmail %></strong></p>
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

                <!-- OTP Form -->
                <form action="${pageContext.request.contextPath}/auth/verify-otp" method="post" id="otpForm" class="needs-validation" novalidate>
                    
                    <!-- OTP Field -->
                    <div class="mb-4">
                        <label for="otp" class="form-label fw-semibold">
                            <i class="fas fa-key me-1"></i> Verification Code
                        </label>
                        <input 
                            type="text" 
                            class="form-control form-control-lg text-center" 
                            id="otp" 
                            name="otp" 
                            placeholder="000000"
                            maxlength="6"
                            pattern="[0-9]{6}"
                            required
                            autocomplete="one-time-code"
                            style="letter-spacing: 1.5rem; font-weight: 600; font-size: 1.5rem; font-family: monospace;"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                        >
                        <div class="invalid-feedback">
                            Please enter the 6-digit code.
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary btn-lg fw-semibold shadow-sm">
                            Verify Code
                        </button>
                    </div>

                    <!-- Resend Link & Timer -->
                    <div class="text-center mb-3">
                        <p class="text-muted mb-1">Didn't receive the code?</p>
                        <a href="${pageContext.request.contextPath}/auth/resend-otp" id="resendLink" class="text-decoration-none fw-medium disabled-link">
                            Resend <span id="timer">(60s)</span>
                        </a>
                    </div>

                    <!-- Back to Login/Forgot Password -->
                    <div class="text-center">
                        <a href="${pageContext.request.contextPath}/auth/forgot-password" class="text-decoration-none fw-medium d-inline-flex align-items-center gap-2 text-secondary hover-primary">
                            <i class="fas fa-arrow-left"></i> Back to Email Entry
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

    <style>
        .disabled-link {
            pointer-events: none;
            color: #adb5bd !important;
            cursor: default;
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const resendLink = document.getElementById('resendLink');
            const timerSpan = document.getElementById('timer');
            
            <% 
                Long lastSentTime = (Long) session.getAttribute("last_otp_sent_time");
                long initialTimeLeft = 0;
                if (lastSentTime != null) {
                    long timeSinceSent = (System.currentTimeMillis() - lastSentTime) / 1000;
                    initialTimeLeft = 60 - timeSinceSent;
                    if (initialTimeLeft < 0) initialTimeLeft = 0;
                }
            %>
            
            let timeLeft = <%= initialTimeLeft %>;

            function updateTimerUI() {
                if (timeLeft <= 0) {
                    resendLink.classList.remove('disabled-link');
                    resendLink.classList.add('text-primary');
                    timerSpan.style.display = 'none';
                    resendLink.innerHTML = 'Resend';
                    return true; // Timer finished
                } else {
                    timerSpan.textContent = '(' + timeLeft + 's)';
                    return false; // Timer running
                }
            }

            // Initial check
            if (!updateTimerUI()) {
                const timerId = setInterval(() => {
                    timeLeft--;
                    if (updateTimerUI()) {
                        clearInterval(timerId);
                    }
                }, 1000);
            }
        });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
