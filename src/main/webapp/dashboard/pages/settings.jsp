<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.dao.impl.InstituteDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.InstituteDAO" %>
<%@ page import="com.eduhub.model.Institute" %>
<%@ page import="com.eduhub.model.User" %>
<%@ page import="com.eduhub.dao.impl.UserDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.UserDAO" %>
<%@ page import="com.eduhub.util.DropdownData" %>
<%
    // Security Check
    if (session == null || session.getAttribute("userId") == null) {
        response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=unauthorized");
        return;
    }

    // Get institute details
    Institute institute = null;
    String instituteId = (String) session.getAttribute("instituteId");
    
    if (instituteId != null) {
        try {
            InstituteDAO instituteDAO = new InstituteDAOImpl();
            institute = instituteDAO.getInstituteById(instituteId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // Fallback if institute is null (should not happen for logged in users)
    if (institute == null) {
        institute = new Institute(); // Empty object to avoid null pointer exceptions
    }
    
    // Get current user details
    User currentUser = null;
    String currentUserId = (String) session.getAttribute("userId");
    if (currentUserId != null) {
        try {
            UserDAO userDAO = new UserDAOImpl();
            currentUser = userDAO.getUserById(currentUserId);
            if (currentUser != null) {
                System.out.println("DEBUG: settings.jsp - User found: " + currentUser.getFullName());
                System.out.println("DEBUG: settings.jsp - Photo URL from DB: " + currentUser.getProfilePhotoUrl());
            } else {
                System.out.println("DEBUG: settings.jsp - User not found for ID: " + currentUserId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("DEBUG: settings.jsp - Error fetching user: " + e.getMessage());
        }
    }
    if (currentUser == null) {
        currentUser = new User(); // Avoid null pointers
    }
    
    // Determine active section from request parameter
    String activeSection = request.getParameter("section");
    if (activeSection == null || activeSection.trim().isEmpty()) {
        activeSection = "profile-section";
    }
    String statusParam = request.getParameter("status");
    String messageParam = request.getParameter("message");
    
    // Calculate Initials
    String userInitials = "U";
    if (currentUser != null && currentUser.getFullName() != null && !currentUser.getFullName().isEmpty()) {
        String[] names = currentUser.getFullName().trim().split("\\s+");
        if (names.length >= 2) {
            userInitials = (names[0].substring(0, 1) + names[names.length - 1].substring(0, 1)).toUpperCase();
        } else if (names.length == 1) {
            userInitials = names[0].substring(0, 1).toUpperCase();
        }
    }
%>
<!-- DEBUG INFO: UserID=<%= currentUserId %>, PhotoURL=<%= currentUser.getProfilePhotoUrl() %> -->
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/dashboard/components/head.jsp">
        <jsp:param name="title" value="Settings - Dashboard - EduHub"/>
        <jsp:param name="description" value="Manage your settings in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <style>
        .settings-nav {
            background: white;
            border-radius: 0.75rem;
            padding: 1rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: calc(var(--header-height) + 2rem);
        }
        
        /* Dark mode for settings nav */
        [data-theme="dark"] .settings-nav {
            background: var(--card-bg);
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border-color);
        }
        
        .settings-nav .nav-link {
            padding: 0.75rem 1rem;
            color: var(--dark-color);
            border-radius: 0.5rem;
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.2s;
            border: none;
            text-decoration: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            font-size: 1rem;
        }
        
        /* Dark mode for nav links */
        [data-theme="dark"] .settings-nav .nav-link {
            color: var(--text-primary);
        }
        
        .settings-nav .nav-link:hover {
            background-color: var(--light-color);
        }
        
        /* Dark mode for nav link hover */
        [data-theme="dark"] .settings-nav .nav-link:hover {
            background-color: var(--hover-bg);
        }
        
        .settings-nav .nav-link.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Active link stays same in dark mode */
        [data-theme="dark"] .settings-nav .nav-link.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .settings-section {
            display: none;
        }
        
        .settings-section.active {
            display: block;
        }
        
        .settings-group {
            margin-bottom: 2rem;
        }
        
        .settings-group h6 {
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #E2E8F0;
        }
        
        /* Dark mode for group headings */
        [data-theme="dark"] .settings-group h6 {
            border-bottom-color: var(--border-color);
            color: #F1F5F9;
        }
        
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #F8F9FA;
        }
        
        /* Dark mode for setting items */
        [data-theme="dark"] .setting-item {
            border-bottom-color: var(--border-color);
        }
        
        .setting-item:last-child {
            border-bottom: none;
        }
        
        .setting-info h6 {
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        /* Dark mode for setting info */
        [data-theme="dark"] .setting-info h6 {
            color: var(--text-primary);
        }
        
        .setting-info p {
            font-size: 0.85rem;
            color: var(--secondary-color);
            margin: 0;
        }
        
        /* Dark mode for setting description */
        [data-theme="dark"] .setting-info p {
            color: var(--text-secondary);
        }
        
        .form-switch .form-check-input {
            width: 3rem;
            height: 1.5rem;
            cursor: pointer;
        }
        
        /* Dark mode for switches */
        [data-theme="dark"] .form-switch .form-check-input {
            background-color: #374151;
            border-color: #4B5563;
        }
        
        [data-theme="dark"] .form-switch .form-check-input:checked {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }
        
        [data-theme="dark"] .form-switch .form-check-input:focus {
            box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
        }
        
        @media (max-width: 991px) {
            .settings-nav {
                position: static;
                margin-bottom: 1rem;
            }
            
            .settings-nav .nav-link {
                font-size: 0.875rem;
            }
            
            /* Fix setting items on mobile */
            .setting-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.25rem 0;
            }
            
            .setting-info {
                width: 100%;
            }
            
            /* Make dropdowns and switches full width on mobile */
            .setting-item .form-select {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            .setting-item .form-check-switch {
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
        }
        
        @media (max-width: 768px) {
            .card-custom {
                padding: 1rem;
            }
            
            .settings-group {
                margin-bottom: 1.5rem;
            }
            
            .settings-group h6 {
                font-size: 0.95rem;
            }
            
            .setting-info h6 {
                font-size: 0.9rem;
            }
            
            .setting-info p {
                font-size: 0.8rem;
            }
            
            /* Button spacing on mobile */
            .settings-section .btn {
                width: 100%;
                margin-bottom: 0.5rem;
            }
            
            .settings-section .btn.ms-2 {
                margin-left: 0 !important;
                margin-top: 0.5rem;
            }
        }
        
        @media (max-width: 576px) {
            .page-header h2 {
                font-size: 1.5rem;
            }
            
            .page-header p {
                font-size: 0.875rem;
            }
            
            .settings-nav {
                padding: 0.75rem;
            }
            
            .settings-nav .nav-link {
                padding: 0.625rem 0.75rem;
                font-size: 0.8rem;
            }
            
            .settings-nav .nav-link i {
                font-size: 1rem;
            }
            
            .card-custom h5 {
                font-size: 1.1rem;
            }
        }

        .photo-upload-container {
            text-align: center;
        }
        .photo-preview {
            width: 150px;
            height: 150px;
            border: 2px dashed #ccc;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            background: #f8f9fa;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .photo-preview:hover {
            border-color: var(--primary-color);
            background: var(--light-color);
        }
        .photo-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .photo-placeholder {
            color: #6c757d;
            text-align: center;
        }
        [data-theme="dark"] .photo-preview {
            background: var(--card-bg);
            border-color: var(--border-color);
        }
        [data-theme="dark"] .photo-preview:hover {
            border-color: var(--primary-color);
            background: var(--hover-bg);
        }
        [data-theme="dark"] .photo-placeholder {
            color: var(--text-secondary);
        }
        
        /* New styles for Admin Account Section */
        .hover-opacity-100:hover {
            opacity: 1 !important;
        }
        .transition-opacity {
            transition: opacity 0.2s ease-in-out;
        }
        .object-fit-cover {
            object-fit: cover;
        }
        @media (min-width: 768px) {
            .border-end-md {
                border-right: 1px solid #dee2e6;
            }
        }
        [data-theme="dark"] .photo-preview-container {
            border-color: var(--card-bg) !important;
            outline-color: var(--border-color) !important;
        }
        [data-theme="dark"] .photo-placeholder {
            background-color: #2d3748 !important;
            color: var(--text-secondary) !important;
        }
        [data-theme="dark"] .border-end-md {
            border-right-color: var(--border-color);
        }
        
        /* Password toggle button fixed size */
        .password-toggle-btn {
            width: 46px !important;
            margin-bottom: 0 !important;
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="/dashboard/components/sidebar.jsp">
            <jsp:param name="activePage" value="settings"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="/dashboard/components/header.jsp">
                <jsp:param name="pageTitle" value="Settings"/>
            </jsp:include>
            
            <!-- Content -->
            <div class="dashboard-content">
                <div class="page-header">
                    <h2>Settings</h2>
                    <p>Manage your account and application settings</p>
                </div>
                
                <div class="row">
                    <!-- Settings Navigation -->
                    <div class="col-lg-3">
                        <nav class="settings-nav">
                            <button type="button" class="nav-link <%= "profile-section".equals(activeSection) ? "active" : "" %>" data-section="profile-section">
                                <i class="bi bi-building"></i>
                                <span>Institute Profile</span>
                            </button>
                            <button type="button" class="nav-link <%= "admin-accounts-section".equals(activeSection) ? "active" : "" %>" data-section="admin-accounts-section">
                                <i class="bi bi-person-circle"></i>
                                <span>Admin Accounts</span>
                            </button>
                            <button type="button" class="nav-link <%= "security-section".equals(activeSection) ? "active" : "" %>" data-section="security-section">
                                <i class="bi bi-shield-lock"></i>
                                <span>Security</span>
                            </button>
                            <button type="button" class="nav-link <%= "preferences".equals(activeSection) ? "active" : "" %>" data-section="preferences">
                                <i class="bi bi-sliders"></i>
                                <span>Preferences</span>
                            </button>
                            <button type="button" class="nav-link <%= "notifications".equals(activeSection) ? "active" : "" %>" data-section="notifications">
                                <i class="bi bi-bell"></i>
                                <span>Notifications</span>
                            </button>
                        </nav>
                    </div>
                    
                    <!-- Settings Content -->
                    <div class="col-lg-9">
                        <div id="profile-section" class="settings-section <%= "profile-section".equals(activeSection) ? "active" : "" %>">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-transparent border-bottom py-3">
                                    <h5 class="card-title mb-0"><i class="bi bi-building me-2"></i>Institute Profile</h5>
                                </div>
                                <div class="card-body p-4">
                                    <form action="${pageContext.request.contextPath}/api/institute/update" method="POST">
                                    <input type="hidden" name="section" value="profile-section">
                                    
                                    <div class="settings-group mb-4">
                                        <h6 class="text-uppercase text-muted small fw-bold mb-3">Basic Information</h6>
                                        
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <label for="instituteName" class="form-label">Institute Name</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="bi bi-mortarboard"></i></span>
                                                    <input type="text" class="form-control" id="instituteName" name="instituteName" placeholder="Enter institute name" value="<%= institute.getInstituteName() != null ? institute.getInstituteName() : "" %>">
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <label for="instituteType" class="form-label">Institute Type</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="bi bi-grid"></i></span>
                                                    <select class="form-select" id="instituteType" name="instituteType">
                                                        <option value="">Select type</option>
                                                        <% 
                                                        String currentType = institute.getInstituteType();
                                                        if (currentType != null) currentType = currentType.trim();
                                                        
                                                        for (String type : DropdownData.INSTITUTE_TYPES) {
                                                            String selected = type.equals(currentType) ? "selected" : "";
                                                        %>
                                                            <option value="<%= type %>" <%= selected %>><%= type %></option>
                                                        <% 
                                                        }
                                                        %>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <label for="institutePhone" class="form-label">Contact Phone</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="bi bi-telephone"></i></span>
                                                    <input type="tel" class="form-control" id="institutePhone" name="institutePhone" placeholder="+1 (555) 000-0000" value="<%= institute.getInstitutePhone() != null ? institute.getInstitutePhone() : "" %>">
                                                </div>
                                            </div>
                                            
                                            <div class="col-12">
                                                <label for="instituteEmail" class="form-label">Official Email</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>
                                                    <input type="email" class="form-control" id="instituteEmail" name="instituteEmail" placeholder="contact@institute.com" value="<%= institute.getInstituteEmail() != null ? institute.getInstituteEmail() : "" %>">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr class="my-4">

                                    <div class="settings-group">
                                        <h6 class="text-uppercase text-muted small fw-bold mb-3">Location Details</h6>
                                        
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <label for="address" class="form-label">Address</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="bi bi-geo-alt"></i></span>
                                                    <textarea class="form-control" id="address" name="address" rows="2" placeholder="Street address"><%= institute.getAddress() != null ? institute.getAddress() : "" %></textarea>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <label for="city" class="form-label">City</label>
                                                <input type="text" class="form-control" id="city" name="city" placeholder="City" value="<%= institute.getCity() != null ? institute.getCity() : "" %>">
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <label for="zipCode" class="form-label">ZIP/Postal Code</label>
                                                <input type="text" class="form-control" id="zipCode" name="zipCode" placeholder="ZIP code" value="<%= institute.getZipCode() != null ? institute.getZipCode() : "" %>">
                                            </div>

                                            <div class="col-md-6">
                                                <label for="country" class="form-label">Country</label>
                                                <select class="form-select" id="country" name="country">
                                                    <option value="">Select country</option>
                                                    <% 
                                                    String currentCountry = institute.getCountry();
                                                    if (currentCountry != null) currentCountry = currentCountry.trim();
                                                    
                                                    for (String country : DropdownData.COUNTRIES) {
                                                        String selected = country.equals(currentCountry) ? "selected" : "";
                                                    %>
                                                        <option value="<%= country %>" <%= selected %>><%= country %></option>
                                                    <% 
                                                    }
                                                    %>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="state" class="form-label">State/Province</label>
                                                <input type="text" class="form-control" id="state" name="state" placeholder="Enter state" value="<%= institute.getState() != null ? institute.getState() : "" %>">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                                        <button type="submit" class="btn btn-primary px-4" id="saveInstituteBtn">
                                            <i class="bi bi-check-lg me-2"></i>Save Changes
                                        </button>
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div>                        <div id="admin-accounts-section" class="settings-section <%= "admin-accounts-section".equals(activeSection) ? "active" : "" %>">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-transparent border-bottom py-3">
                                    <h5 class="card-title mb-0"><i class="bi bi-person-badge me-2"></i>Admin Account Profile</h5>
                                </div>
                                <div class="card-body p-4">
                                    <form id="adminAccountForm" action="${pageContext.request.contextPath}/api/users/updateProfile" method="POST" enctype="multipart/form-data">
                                        <input type="hidden" name="userId" value="<%= currentUser.getUserId() %>">
                                        <input type="hidden" name="section" value="admin-accounts-section">
                                        
                                        <div class="row g-4">
                                            <!-- Profile Photo Column -->
                                            <div class="col-md-4 text-center border-end-md">
                                                <div class="profile-photo-section">
                                                    <div class="position-relative d-inline-block mb-3">
                                                        <div class="photo-preview-container rounded-circle shadow-sm" style="width: 160px; height: 160px; overflow: hidden; position: relative; border: 4px solid #fff; box-shadow: 0 0 0 1px #dee2e6, 0 .125rem .25rem rgba(0,0,0,.075); border-radius: 50% !important; -webkit-mask-image: -webkit-radial-gradient(white, black); mask-image: radial-gradient(white, black);">
                                                            <% 
                                                                String photoUrl = currentUser.getProfilePhotoUrl();
                                                                if (photoUrl != null) {
                                                                    photoUrl = photoUrl.replace("\\", "/");
                                                                }
                                                                boolean hasPhoto = photoUrl != null && !photoUrl.isEmpty();
                                                                String displayUrl = "";
                                                                if (hasPhoto) {
                                                                    if (photoUrl.startsWith("http")) {
                                                                        displayUrl = photoUrl;
                                                                    } else {
                                                                        displayUrl = request.getContextPath() + "/" + photoUrl;
                                                                    }
                                                                }
                                                            %>
                                                            <div class="photo-placeholder d-flex flex-column align-items-center justify-content-center h-100 bg-light text-secondary" id="photoPlaceholder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; <%= hasPhoto ? "display: none;" : "" %>">
                                                                <span class="display-4 fw-bold"><%= userInitials %></span>
                                                            </div>
                                                            <img id="photoPreview" 
                                                                 src="<%= displayUrl %>?t=<%= System.currentTimeMillis() %>" 
                                                                 class="w-100 h-100 object-fit-cover" 
                                                                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; <%= hasPhoto ? "" : "display: none;" %>" 
                                                                 alt="Admin Photo"
                                                                 onerror="this.style.display='none'; document.getElementById('photoPlaceholder').style.display='flex';"
                                                                 onload="this.style.display='block'; document.getElementById('photoPlaceholder').style.display='none';">
                                                            
                                                            <!-- Overlay on hover -->
                                                            <div class="photo-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white opacity-0 hover-opacity-100 transition-opacity" onclick="document.getElementById('adminPhoto').click()" style="z-index: 5; cursor: pointer; clip-path: circle(50% at 50% 50%);">
                                                                <i class="bi bi-camera-fill fs-3"></i>
                                                            </div>
                                                            
                                                            <!-- Loading Overlay -->
                                                            <div id="photoLoadingOverlay" class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center" style="display: none !important; z-index: 10;">
                                                                <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
                                                                    <span class="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input type="file" id="adminPhoto" name="adminPhoto" accept="image/*" class="d-none">
                                                    <h6 class="mb-1"><%= currentUser.getFullName() != null ? currentUser.getFullName() : "Admin User" %></h6>
                                                    <span class="badge bg-primary-subtle text-primary rounded-pill px-3">Administrator</span>
                                                    <p class="small text-muted mt-2">Allowed: JPG, PNG (Max 2MB)</p>
                                                </div>
                                            </div>

                                            <!-- Form Fields Column -->
                                            <div class="col-md-8 ps-md-4">
                                                <h6 class="text-uppercase text-muted small fw-bold mb-3">Personal Information</h6>
                                                
                                                <div class="row g-3">
                                                    <div class="col-12">
                                                        <label for="adminFullName" class="form-label">Full Name</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                                                            <input type="text" class="form-control" id="adminFullName" name="fullName" placeholder="Enter your full name" value="<%= currentUser.getFullName() != null ? currentUser.getFullName() : "" %>">
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="col-12">
                                                        <label for="adminEmail" class="form-label">Email Address</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>
                                                            <input type="email" class="form-control" id="adminEmail" name="email" value="<%= currentUser.getEmail() != null ? currentUser.getEmail() : "" %>" placeholder="Enter email address">
                                                        </div>
                                                        <div class="form-text"><i class="bi bi-info-circle me-1"></i>Email address is used for login.</div>
                                                    </div>
                                                    
                                                    <div class="col-12">
                                                        <label for="adminPhone" class="form-label">Phone Number</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-light"><i class="bi bi-telephone"></i></span>
                                                            <input type="tel" class="form-control" id="adminPhone" name="phone" placeholder="Enter phone number" value="<%= currentUser.getPhone() != null ? currentUser.getPhone() : "" %>">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                                                    <button type="submit" class="btn btn-primary px-4" id="saveAccountBtn">
                                                        <i class="bi bi-check-lg me-2"></i>Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div id="security-section" class="settings-section <%= "security-section".equals(activeSection) ? "active" : "" %>">
                            <div class="card border-0 shadow-sm">
                                <div class="card-header bg-transparent border-bottom py-3">
                                    <h5 class="card-title mb-0"><i class="bi bi-shield-lock me-2"></i>Security Settings</h5>
                                </div>
                                <div class="card-body p-4">
                                    <div class="settings-group">
                                        <% 
                                        boolean isGoogleAuth = "GOOGLE_AUTH".equals(currentUser.getPasswordHash());
                                        if (isGoogleAuth) {
                                        %>
                                            <h6 class="text-uppercase text-muted small fw-bold mb-3">Set Password</h6>
                                            <div class="alert alert-info mb-4">
                                                <i class="bi bi-info-circle-fill me-2"></i>
                                                You are currently using Google Sign-In. You can set a password to enable email/password login as well.
                                            </div>
                                            <form id="changePasswordForm" action="${pageContext.request.contextPath}/api/user/update-password" method="POST">
                                                <input type="hidden" name="userId" value="<%= currentUserId %>">
                                                <input type="hidden" name="isGoogleAuth" value="true">
                                                
                                                <!-- No Current Password field for Google Auth users -->
                                        <% } else { %>
                                            <h6 class="text-uppercase text-muted small fw-bold mb-3">Change Password</h6>
                                            <form id="changePasswordForm" action="${pageContext.request.contextPath}/api/user/update-password" method="POST">
                                                <input type="hidden" name="userId" value="<%= currentUserId %>">
                                                
                                                <div class="mb-3">
                                                    <label for="currentPassword" class="form-label">Current Password</label>
                                                    <div class="input-group flex-nowrap">
                                                        <span class="input-group-text bg-light"><i class="bi bi-key"></i></span>
                                                        <input type="password" class="form-control" id="currentPassword" name="currentPassword" placeholder="Enter current password" required>
                                                        <button class="btn btn-outline-secondary password-toggle-btn" type="button" onclick="togglePassword('currentPassword')"><i class="bi bi-eye"></i></button>
                                                    </div>
                                                </div>
                                        <% } %>
                                            
                                            <div class="mb-3">
                                                <label for="newPassword" class="form-label">New Password</label>
                                                <div class="input-group flex-nowrap">
                                                    <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                                                    <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="Enter new password" required>
                                                    <button class="btn btn-outline-secondary password-toggle-btn" type="button" onclick="togglePassword('newPassword')"><i class="bi bi-eye"></i></button>
                                                </div>
                                                <div class="form-text text-muted small mt-1">
                                                    <i class="bi bi-info-circle me-1"></i>Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                                <div class="input-group flex-nowrap">
                                                    <span class="input-group-text bg-light"><i class="bi bi-check-circle"></i></span>
                                                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Re-enter new password" required>
                                                    <button class="btn btn-outline-secondary password-toggle-btn" type="button" onclick="togglePassword('confirmPassword')"><i class="bi bi-eye"></i></button>
                                                </div>
                                            </div>
                                            
                                            <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                                                <button type="submit" class="btn btn-primary px-4">
                                                    <i class="bi bi-check-lg me-2"></i>Update Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    
                                    <hr class="my-4">
                                    
                                    <div class="settings-group">
                                        <h6 class="text-uppercase text-muted small fw-bold mb-3">Session Management</h6>
                                        <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded border">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-white p-2 rounded-circle shadow-sm me-3 text-primary">
                                                    <i class="bi bi-laptop fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1">Current Session</h6>
                                                    <p class="mb-0 small text-muted">Active now • IP: <%= request.getRemoteAddr() %></p>
                                                </div>
                                            </div>
                                            <span class="badge bg-success-subtle text-success rounded-pill px-3">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="preferences" class="settings-section <%= "preferences".equals(activeSection) ? "active" : "" %>">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-sliders"></i> Preferences</h5>
                                
                                <div class="settings-group">
                                    <h6>Display Settings</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Dark Mode</h6>
                                            <p>Use dark theme for better visibility</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="darkMode">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Notification Settings -->
                        <div id="notifications" class="settings-section <%= "notifications".equals(activeSection) ? "active" : "" %>">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-bell"></i> Notification Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Email Notifications</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>New Student Registrations</h6>
                                            <p>Get notified when students register</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailStudents" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Fee Payments</h6>
                                            <p>Receive alerts for fee payments</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailPayments" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Staff Updates</h6>
                                            <p>Get notified about staff changes</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailStaff">
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>System Alerts</h6>
                                            <p>Important system notifications</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailSystem" checked>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Browser Notifications</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Enable Desktop Notifications</h6>
                                            <p>Show notifications on your desktop</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="desktopNotifications">
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Sound Alerts</h6>
                                            <p>Play sound for notifications</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="soundAlerts" checked>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                                    <button class="btn btn-primary px-4">
                                        <i class="bi bi-check-lg me-2"></i>Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/modal.jsp" />
    <jsp:include page="/components/toast-dependencies.jsp" />
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // --- Unsaved Changes Confirmation ---
        let isDirty = false;

        function setDirty() {
            isDirty = true;
        }

        function resetDirty() {
            isDirty = false;
        }

        // Add listeners to all inputs in settings sections (inside or outside forms)
        document.querySelectorAll('.settings-section input, .settings-section textarea, .settings-section select').forEach(input => {
            input.addEventListener('input', setDirty);
            input.addEventListener('change', setDirty);
        });

        // Handle form submissions to reset dirty state
        document.querySelectorAll('.settings-section form').forEach(form => {
            form.addEventListener('submit', resetDirty);
        });

        // --- Toggle Password Visibility ---
        window.togglePassword = function(inputId) {
            const input = document.getElementById(inputId);
            const icon = event.currentTarget.querySelector('i');
            
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = "password";
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        };

        document.addEventListener('DOMContentLoaded', function () {
            // --- Settings Navigation (Click Handling) ---
            const navLinks = document.querySelectorAll('.settings-nav .nav-link');
            const sections = document.querySelectorAll('.settings-section');
            
            function switchSection(link) {
                const sectionId = link.getAttribute('data-section');
                if (!sectionId) return;
                
                const targetSection = document.getElementById(sectionId);
                if (!targetSection) return;
                
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                link.classList.add('active');
                targetSection.classList.add('active');

                // Update URL to reflect current section without reloading
                const newUrl = window.location.pathname + "?section=" + sectionId;
                window.history.pushState({path: newUrl}, '', newUrl);
            }

            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetLink = this;
                    
                    if (isDirty) {
                        showConfirmationModal({
                            title: 'Unsaved Changes',
                            message: 'You have unsaved changes. Do you want to save or discard them?',
                            confirmText: 'Save',
                            confirmClass: 'btn-success',
                            extraBtnText: 'Discard',
                            extraBtnClass: 'btn-danger',
                            showCancel: false,
                            onConfirm: () => {
                                return handleSaveAndNavigate(targetLink, () => {
                                    switchSection(targetLink);
                                    toast.success('Settings saved successfully');
                                });
                            },
                            onExtraBtn: () => {
                                handleDiscardAndNavigate(targetLink, () => switchSection(targetLink));
                            }
                        });
                    } else {
                        switchSection(targetLink);
                    }
                });
            });
            
            // --- Global Navigation Interception ---
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                // If it's not a link, or it's a link inside the settings-nav (which are buttons anyway), ignore.
                if (!link || link.closest('.settings-nav')) return;
                
                // If it's a link that navigates away
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

                if (isDirty) {
                    e.preventDefault();
                    const targetUrl = link.href;
                    
                    showConfirmationModal({
                        title: 'Unsaved Changes',
                        message: 'You have unsaved changes. Do you want to save or discard them?',
                        confirmText: 'Save',
                        confirmClass: 'btn-success',
                        extraBtnText: 'Discard',
                        extraBtnClass: 'btn-danger',
                        showCancel: false,
                        onConfirm: () => {
                            return handleSaveAndNavigate(link, () => {
                                sessionStorage.setItem('pendingToastType', JSON.stringify({
                                    message: 'Settings saved successfully',
                                    type: 'success'
                                }));
                                window.location.href = targetUrl;
                            });
                        },
                        onExtraBtn: () => {
                            handleDiscardAndNavigate(link, () => window.location.href = targetUrl);
                        }
                    });
                }
            });

            function handleDiscardAndNavigate(target, navigationCallback) {
                const activeSection = document.querySelector('.settings-section.active');
                const form = activeSection ? activeSection.querySelector('form') : null;
                if (form) {
                    form.reset();
                }
                
                // Reset photo preview if it exists
                const photoPreview = document.getElementById('photoPreview');
                const photoPlaceholder = document.getElementById('photoPlaceholder');
                if (photoPreview && photoPlaceholder) {
                    photoPreview.src = originalPhotoSrc;
                    photoPreview.style.display = originalPhotoDisplay;
                    photoPlaceholder.style.display = originalPlaceholderDisplay;
                }

                // Also reset any non-form inputs if needed, or just rely on page reload for navigation
                // For section switching, we might need to manually reset inputs if they are not in a form
                if (activeSection) {
                     activeSection.querySelectorAll('input, select, textarea').forEach(input => {
                         // Simple reset for inputs not in form (if any)
                         if (!input.form) {
                             if (input.type === 'checkbox' || input.type === 'radio') {
                                 input.checked = input.defaultChecked;
                             } else {
                                 input.value = input.defaultValue;
                             }
                         }
                     });
                }

                resetDirty();
                navigationCallback();
            }

            function handleSaveAndNavigate(target, navigationCallback) {
                const activeSection = document.querySelector('.settings-section.active');
                const form = activeSection ? activeSection.querySelector('form') : null;
                
                if (form) {
                    // Show loading state on the Save button in modal
                    const confirmBtn = document.getElementById('modalConfirmBtn');
                    const originalText = confirmBtn.innerHTML;
                    confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
                    confirmBtn.disabled = true;

                    const formData = new FormData(form);
                    let fetchOptions = {
                        method: 'POST',
                        redirect: 'follow'
                    };

                    if (form.enctype === 'multipart/form-data') {
                        fetchOptions.body = formData;
                    } else {
                        const params = new URLSearchParams();
                        for (const pair of formData.entries()) {
                            params.append(pair[0], pair[1]);
                        }
                        fetchOptions.body = params;
                        fetchOptions.headers = {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        };
                    }

                    fetch(form.action, fetchOptions)
                        .then(response => {
                            const url = new URL(response.url);
                            const status = url.searchParams.get('status');
                            
                            if (status === 'success') {
                                // Update header image if we have a new preview and it's the admin account form
                                if (form.id === 'adminAccountForm') {
                                    const headerImg = document.getElementById('headerProfileImg');
                                    const photoPreview = document.getElementById('photoPreview');
                                    if (headerImg && photoPreview && photoPreview.style.display !== 'none') {
                                        headerImg.src = photoPreview.src;
                                    }
                                }
                                
                                resetDirty();
                                navigationCallback();
                                // Close modal manually since we returned false
                                if (window.currentConfirmationModal) {
                                    window.currentConfirmationModal.hide();
                                }
                            } else {
                                const message = url.searchParams.get('message') || 'Failed to save changes.';
                                toast.error(message);
                                if (window.currentConfirmationModal) {
                                    window.currentConfirmationModal.hide();
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error saving:', error);
                            toast.error('An error occurred while saving.');
                            if (window.currentConfirmationModal) {
                                window.currentConfirmationModal.hide();
                            }
                        })
                        .finally(() => {
                            if (confirmBtn) {
                                confirmBtn.innerHTML = originalText;
                                confirmBtn.disabled = false;
                            }
                        });
                        
                    return false; // Keep modal open
                } else {
                    // No form found (e.g. Preferences), just proceed as if saved (or maybe we should block?)
                    // For now, assume success
                    resetDirty();
                    navigationCallback();
                    return true; // Close modal
                }
            }
            
            // --- Browser Navigation Interception (Back/Refresh) ---
            window.addEventListener('beforeunload', function(e) {
                if (isDirty) {
                    e.preventDefault();
                    e.returnValue = ''; // Chrome requires returnValue to be set
                }
            });

            // --- Profile Photo Preview ---
            const adminPhotoInput = document.getElementById('adminPhoto');
            const photoPreview = document.getElementById('photoPreview');
            const photoPlaceholder = document.getElementById('photoPlaceholder');
            
            // Store original state for discard functionality
            let originalPhotoSrc = '';
            let originalPhotoDisplay = '';
            let originalPlaceholderDisplay = '';
            
            if (photoPreview) {
                originalPhotoSrc = photoPreview.src;
                originalPhotoDisplay = photoPreview.style.display;
            }
            if (photoPlaceholder) {
                originalPlaceholderDisplay = photoPlaceholder.style.display;
            }
            
            if (adminPhotoInput && photoPreview) {
                adminPhotoInput.addEventListener('change', function(e) {
                    const file = this.files[0];
                    if (file) {
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                            toast.error('Please select an image file.');
                            this.value = ''; // Clear input
                            return;
                        }
                        
                        // Validate file size (2MB)
                        if (file.size > 2 * 1024 * 1024) {
                            toast.error('Image size should be less than 2MB.');
                            this.value = ''; // Clear input
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = function(e) {
                            photoPreview.src = e.target.result;
                            photoPreview.style.display = 'block';
                            if (photoPlaceholder) {
                                photoPlaceholder.style.display = 'none';
                            }
                        }
                        reader.readAsDataURL(file);
                    }
                });
            }

            // --- Password Form Validation ---
            const changePasswordForm = document.getElementById('changePasswordForm');
            if(changePasswordForm) {
                changePasswordForm.addEventListener('submit', function(e) {
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

                    if (newPassword !== confirmPassword) {
                        e.preventDefault();
                        toast.error("New password and confirm password do not match.");
                        return;
                    }
                    
                    if (!passwordRegex.test(newPassword)) {
                        e.preventDefault();
                        toast.error("Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (e.g., Cc@12345).");
                        return;
                    }
                });
            }
            
            // --- Server-Side Triggered Toasts & URL Cleanup ---
            <% if (statusParam != null && messageParam != null) { %>
                <% if ("success".equals(statusParam)) { %>
                    toast.success("<%= messageParam %>");
                <% } else if ("error".equals(statusParam)) { %>
                    toast.error("<%= messageParam %>");
                <% } %>
                
                // Clean URL but keep section param if needed
                const cleanUrl = window.location.pathname + "?section=<%= activeSection %>";
                window.history.replaceState({}, document.title, cleanUrl);
            <% } %>

            // Check for setup_required message
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('message') === 'setup_required') {
                // Show a persistent warning
                toast.warning("Please complete your Institute Profile to access the dashboard.", 10000);
                
                // Highlight the profile section
                const profileSection = document.getElementById('profile-section');
                if (profileSection) {
                    profileSection.scrollIntoView({ behavior: 'smooth' });
                    // Add a visual cue
                    profileSection.classList.add('border', 'border-warning');
                    setTimeout(() => {
                        profileSection.classList.remove('border', 'border-warning');
                    }, 3000);
                }
            }
        });
    </script>
    <script src="${pageContext.request.contextPath}/public/js/theme-switcher.js"></script>
</body>
</html>
