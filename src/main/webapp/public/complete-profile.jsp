<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Profile - EduHub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/public/css/auth.css">
</head>
<body>
    <div class="container-fluid vh-100">
        <div class="row min-vh-100">
            <!-- Left Side - Branding -->
            <div class="col-lg-5 d-none d-lg-flex bg-gradient-primary text-white p-5 align-items-center justify-content-center">
                <div class="text-center">
                    <div class="mb-4">
                        <i class="fas fa-user-check fa-5x mb-3"></i>
                        <h1 class="display-4 fw-bold brand-logo">EduHub</h1>
                    </div>
                    <h2 class="mb-3">Almost There!</h2>
                    <p class="lead mb-4">Just a few more details to set up your account.</p>
                </div>
            </div>

            <!-- Right Side - Form -->
            <div class="col-lg-7 d-flex align-items-center justify-content-center p-4">
                <div class="w-100" style="max-width: 480px;">
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-4 p-md-5">
                            <div class="mb-4">
                                <h3 class="fw-bold mb-2">Complete Profile</h3>
                                <p class="text-muted mb-0">Welcome, <strong>${sessionScope.google_user_name}</strong>!</p>
                            </div>
                            
                            <form action="${pageContext.request.contextPath}/auth/complete-profile" method="POST">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Email Address</label>
                                    <input type="email" class="form-control form-control-lg bg-light" value="${sessionScope.google_user_email}" disabled>
                                </div>

                                <div class="mb-3">
                                    <label for="role" class="form-label fw-semibold">I am a...</label>
                                    <select id="role" name="role" class="form-select form-select-lg" required>
                                        <option value="">Select Role</option>
                                        <option value="student">Student</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="instituteId" class="form-label fw-semibold">Institute Code</label>
                                    <input type="text" class="form-control form-control-lg" id="instituteId" name="instituteId" placeholder="Enter Institute ID" required>
                                    <div class="form-text">Ask your administrator for this code.</div>
                                </div>

                                <div class="mb-3">
                                    <label for="phone" class="form-label fw-semibold">Phone Number</label>
                                    <input type="tel" class="form-control form-control-lg" id="phone" name="phone" placeholder="Enter Phone Number" required>
                                </div>

                                <button type="submit" class="btn btn-primary btn-lg w-100">
                                    Complete Setup <i class="fas fa-check ms-2"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
