<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduHub - Smart Education Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="public/css/landing.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="index.jsp" class="nav-brand">
                <i class="fas fa-graduation-cap"></i>
                <span class="text-uppercase">EduHub</span>
            </a>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#features" class="nav-link">Features</a></li>
                <li class="mobile-only"><a href="public/login.jsp" class="btn btn-outline-primary btn-sm">Login</a></li>
                <li class="mobile-only"><a href="public/register_institute.jsp" class="btn btn-primary btn-sm">Get Started</a></li>
            </ul>
            <div class="nav-buttons">
                <a href="public/login.jsp" class="btn btn-outline-primary">Login</a>
                <a href="public/register_institute.jsp" class="btn btn-primary">Get Started</a>
            </div>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <div class="hero-content pt-5">
                <div class="hero-text">
                    <h1 class="hero-title">
                        Transform Your <span class="highlight">Educational</span> Institution
                    </h1>
                    <p class="hero-subtitle">
                        Streamline student management, track attendance, manage courses, and generate reports - all in one powerful platform.
                    </p>
                    <div class="hero-buttons">
                        <a href="public/register_institute.jsp" class="btn btn-primary btn-lg">
                            Get Started
                            <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <h3>2K+</h3>
                            <p>Active Users</p>
                        </div>
                        <div class="stat-item">
                            <h3>50+</h3>
                            <p>Institutions</p>
                        </div>
                        <div class="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="floating-card card-1">
                        <i class="fas fa-user-graduate"></i>
                        <h4>Student Management</h4>
                        <p>Organize student data efficiently</p>
                    </div>
                    <div class="floating-card card-2">
                        <i class="fas fa-chart-line"></i>
                        <h4>Analytics</h4>
                        <p>Real-time insights & reports</p>
                    </div>
                    <div class="floating-card card-3">
                        <i class="fas fa-calendar-check"></i>
                        <h4>Attendance</h4>
                        <p>Track attendance seamlessly</p>
                    </div>
                    <div class="hero-illustration">
                        <div class="illustration-bg"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Powerful Features for Modern Education</h2>
                <p class="section-subtitle">Everything you need to manage your institution effectively</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>Student Management</h3>
                    <p>Comprehensive student profiles, enrollment tracking, and academic records management.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <h3>Attendance Tracking</h3>
                    <p>Automated attendance system with real-time updates and notifications.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <h3>Course Management</h3>
                    <p>Create, organize, and manage courses with ease and flexibility.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h3>Analytics & Reports</h3>
                    <p>Generate detailed reports and gain insights into institutional performance.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3>Staff Management</h3>
                    <p>Manage faculty, staff schedules, and role-based access control.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <h3>Notifications</h3>
                    <p>Keep everyone informed with automated notifications and alerts.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-image">
                    <div class="about-card">
                        <i class="fas fa-shield-alt"></i>
                        <h4>Secure & Reliable</h4>
                    </div>
                </div>
                <div class="about-text">
                    <h2>Why Choose EduHub?</h2>
                    <p class="about-description">
                        EduHub is designed to simplify educational institution management with cutting-edge technology and user-friendly interfaces.
                    </p>
                    <ul class="about-list">
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>Cloud-based platform accessible anywhere, anytime</span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>Intuitive dashboard for quick insights</span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>Scalable solution for institutions of all sizes</span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>24/7 customer support and regular updates</span>
                        </li>
                    </ul>
                    <a href="public/register_institute.jsp" class="btn btn-primary btn-lg">Get Started Today</a>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Transform Your Institution?</h2>
                <p>Join hundreds of institutions already using EduHub to streamline their operations.</p>
                <div class="cta-buttons">
                    <a href="public/register_institute.jsp" class="btn btn-light btn-lg">
                        Get Started Now
                        <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand-section">
                    <div class="footer-brand">
                        <i class="fas fa-graduation-cap"></i>
                        <span class="text-uppercase">EduHub</span>
                    </div>
                    <p class="footer-tagline">Empowering education through technology.</p>
                </div>
                <div class="footer-links-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="public/login.jsp">Login</a></li>
                        <li><a href="public/register_institute.jsp">Register</a></li>
                    </ul>
                </div>
                <div class="footer-social-section">
                    <h4>Follow Us</h4>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 EduHub. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard/js/theme-switcher.js"></script>
    <script src="public/js/script.js"></script>
</body>
</html>