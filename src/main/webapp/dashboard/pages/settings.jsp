<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
                            <button type="button" class="nav-link active" data-section="institute">
                                <i class="bi bi-building"></i>
                                <span>Institute Profile</span>
                            </button>
                            <button type="button" class="nav-link" data-section="account">
                                <i class="bi bi-person-circle"></i>
                                <span>Admin Account</span>
                            </button>
                            <button type="button" class="nav-link" data-section="security">
                                <i class="bi bi-shield-lock"></i>
                                <span>Security</span>
                            </button>
                            <button type="button" class="nav-link" data-section="preferences">
                                <i class="bi bi-sliders"></i>
                                <span>Preferences</span>
                            </button>
                            <button type="button" class="nav-link" data-section="notifications">
                                <i class="bi bi-bell"></i>
                                <span>Notifications</span>
                            </button>
                        </nav>
                    </div>
                    
                    <!-- Settings Content -->
                    <div class="col-lg-9">
                        <!-- Institute Profile Settings -->
                        <div id="institute" class="settings-section active">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-building"></i> Institute Profile</h5>
                                
                                <div class="settings-group">
                                    <h6>Basic Information</h6>
                                    
                                    <div class="mb-3">
                                        <label for="instituteName" class="form-label">Institute Name</label>
                                        <input type="text" class="form-control" id="instituteName" placeholder="Enter institute name">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="instituteType" class="form-label">Institute Type</label>
                                        <select class="form-select" id="instituteType">
                                            <option value="">Select type</option>
                                            <option value="school">School</option>
                                            <option value="college">College</option>
                                            <option value="university">University</option>
                                            <option value="training_center">Training Center</option>
                                            <option value="coaching_institute">Coaching Institute</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="instituteEmail" class="form-label">Official Email</label>
                                        <input type="email" class="form-control" id="instituteEmail" placeholder="contact@institute.com">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="institutePhone" class="form-label">Contact Phone</label>
                                        <input type="tel" class="form-control" id="institutePhone" placeholder="+1 (555) 000-0000">
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Location</h6>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="country" class="form-label">Country</label>
                                            <select class="form-select" id="country">
                                                <option value="">Select country</option>
                                                <option value="US">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="CA">Canada</option>
                                                <option value="IN">India</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="state" class="form-label">State/Province</label>
                                            <input type="text" class="form-control" id="state" placeholder="Enter state">
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="address" class="form-label">Address (Optional)</label>
                                        <textarea class="form-control" id="address" rows="2" placeholder="Street address"></textarea>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="city" class="form-label">City (Optional)</label>
                                            <input type="text" class="form-control" id="city" placeholder="City">
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="zipCode" class="form-label">ZIP/Postal Code (Optional)</label>
                                            <input type="text" class="form-control" id="zipCode" placeholder="ZIP code">
                                        </div>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">
                                    <i class="bi bi-save"></i> Save Institute Profile
                                </button>
                            </div>
                        </div>
                        
                        <!-- Admin Account Settings -->
                        <div id="account" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-person-circle"></i> Admin Account</h5>
                                
                                <div class="settings-group">
                                    <h6>Personal Information</h6>
                                    
                                    <div class="mb-3">
                                        <label for="adminName" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="adminName" placeholder="Enter full name">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="adminEmail" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="adminEmail" placeholder="admin@institute.com">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="adminPhone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="adminPhone" placeholder="+1 (555) 000-0000">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="username" class="form-label">Username</label>
                                        <input type="text" class="form-control" id="username" placeholder="username" readonly>
                                        <small class="form-text text-muted">Username cannot be changed</small>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">
                                    <i class="bi bi-save"></i> Update Account
                                </button>
                                <button class="btn btn-outline-danger ms-2">
                                    <i class="bi bi-trash"></i> Delete Account
                                </button>
                            </div>
                        </div>
                        
                        <!-- Security Settings -->
                        <div id="security" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-shield-lock"></i> Security Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Change Password</h6>
                                    
                                    <div class="mb-3">
                                        <label for="currentPassword" class="form-label">Current Password</label>
                                        <input type="password" class="form-control" id="currentPassword" placeholder="Enter current password">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="newPassword" class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="newPassword" placeholder="Enter new password">
                                        <small class="form-text text-muted">At least 8 characters with uppercase, lowercase, and number</small>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirmNewPassword" placeholder="Re-enter new password">
                                    </div>
                                    
                                    <button class="btn btn-primary">
                                        <i class="bi bi-key"></i> Change Password
                                    </button>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Session Management</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Current Device</h6>
                                            <p><i class="bi bi-laptop"></i> Windows PC - Last active: Just now</p>
                                        </div>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    
                                    <button class="btn btn-outline-danger mt-3">
                                        <i class="bi bi-box-arrow-right"></i> Sign out from all devices
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Preferences Settings -->
                        <div id="preferences" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4"><i class="bi bi-sliders"></i> Preferences</h5>
                                
                                <div class="settings-group">
                                    <h6>Language & Region</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Language</h6>
                                            <p>Select your preferred language</p>
                                        </div>
                                        <select class="form-select" style="max-width: 200px;">
                                            <option selected>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Timezone</h6>
                                            <p>Your current timezone</p>
                                        </div>
                                        <select class="form-select" style="max-width: 250px;">
                                            <option selected>(GMT-5:00) Eastern Time</option>
                                            <option>(GMT-8:00) Pacific Time</option>
                                            <option>(GMT+5:30) India Standard Time</option>
                                            <option>(GMT+0:00) UTC</option>
                                        </select>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Date Format</h6>
                                            <p>How dates are displayed</p>
                                        </div>
                                        <select class="form-select" style="max-width: 200px;">
                                            <option selected>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                                
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
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Compact View</h6>
                                            <p>Reduce spacing for more content</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="compactView">
                                        </div>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">
                                    <i class="bi bi-save"></i> Save Preferences
                                </button>
                            </div>
                        </div>
                        
                        <!-- Notification Settings -->
                        <div id="notifications" class="settings-section">
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
                                
                                <button class="btn btn-primary">
                                    <i class="bi bi-save"></i> Save Notification Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/dashboard/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Settings page navigation
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.settings-nav .nav-link');
            const sections = document.querySelectorAll('.settings-section');
            const contentArea = document.querySelector('.dashboard-content');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all links and sections
                    navLinks.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Show corresponding section
                    const sectionId = this.getAttribute('data-section');
                    const targetSection = document.getElementById(sectionId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }
                    
                    // Scroll to top of content area
                    if (contentArea) {
                        contentArea.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Handle direct hash navigation on page load
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                const targetLink = document.querySelector(`[data-section="${hash}"]`);
                if (targetLink) {
                    // Trigger click without scrolling
                    navLinks.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    targetLink.classList.add('active');
                    document.getElementById(hash).classList.add('active');
                    
                    // Scroll to top
                    if (contentArea) {
                        contentArea.scrollTop = 0;
                    }
                }
            }
            
            // Initialize dark mode toggle state
            setTimeout(function() {
                const darkModeToggle = document.getElementById('darkMode');
                if (darkModeToggle && typeof ThemeSwitcher !== 'undefined') {
                    // Sync toggle with current theme
                    const currentTheme = ThemeSwitcher.getCurrentTheme();
                    darkModeToggle.checked = (currentTheme === 'dark');
                    
                    // Log for debugging
                    console.log('Dark mode toggle initialized. Current theme:', currentTheme);
                }
            }, 100);
        });
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/js/theme-switcher.js"></script>
</body>
</html>
