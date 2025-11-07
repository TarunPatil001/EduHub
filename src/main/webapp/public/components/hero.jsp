<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <div class="hero-content">
                    <h1 class="hero-title animate-fade-in">
                        Welcome to <span class="brand-highlight">EDUHUB</span>
                    </h1>
                    <p class="hero-subtitle animate-fade-in-delay">
                        A comprehensive web-based educational management system designed to streamline the management of students, faculty, attendance, courses, and communication — all in one centralized hub.
                    </p>
                    <div class="hero-buttons animate-fade-in-delay-2">
                        <a href="${pageContext.request.contextPath}/public/login.jsp" class="btn btn-primary btn-lg">
                            <i class="bi bi-box-arrow-in-right"></i> Get Started
                        </a>
                        <a href="${pageContext.request.contextPath}/public/register_institute.jsp" class="btn btn-outline-primary btn-lg">
                            <i class="bi bi-person-plus"></i> Register Now
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="hero-image animate-float">
                    <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg" alt="Education Management" class="img-fluid">
                </div>
            </div>
        </div>
    </div>
    <div class="hero-wave">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    </div>
</section>
