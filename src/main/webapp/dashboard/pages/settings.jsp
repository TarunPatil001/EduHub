<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
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
        
        .settings-nav .nav-link:hover {
            background-color: var(--light-color);
        }
        
        .settings-nav .nav-link.active {
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
        
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #F8F9FA;
        }
        
        .setting-item:last-child {
            border-bottom: none;
        }
        
        .setting-info h6 {
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .setting-info p {
            font-size: 0.85rem;
            color: var(--secondary-color);
            margin: 0;
        }
        
        .form-switch .form-check-input {
            width: 3rem;
            height: 1.5rem;
            cursor: pointer;
        }
        
        @media (max-width: 991px) {
            .settings-nav {
                position: static;
                margin-bottom: 1rem;
            }
            
            .settings-nav .nav-link {
                font-size: 0.875rem;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="../components/sidebar.jsp">
            <jsp:param name="activePage" value="settings"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="../components/header.jsp">
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
                            <button type="button" class="nav-link active" data-section="general">
                                <i class="bi bi-gear"></i>
                                <span>General</span>
                            </button>
                            <button type="button" class="nav-link" data-section="account">
                                <i class="bi bi-person"></i>
                                <span>Account</span>
                            </button>
                            <button type="button" class="nav-link" data-section="notifications">
                                <i class="bi bi-bell"></i>
                                <span>Notifications</span>
                            </button>
                            <button type="button" class="nav-link" data-section="security">
                                <i class="bi bi-shield-lock"></i>
                                <span>Security</span>
                            </button>
                            <button type="button" class="nav-link" data-section="appearance">
                                <i class="bi bi-palette"></i>
                                <span>Appearance</span>
                            </button>
                            <button type="button" class="nav-link" data-section="privacy">
                                <i class="bi bi-eye-slash"></i>
                                <span>Privacy</span>
                            </button>
                        </nav>
                    </div>
                    
                    <!-- Settings Content -->
                    <div class="col-lg-9">
                        <!-- General Settings -->
                        <div id="general" class="settings-section active">
                            <div class="card-custom">
                                <h5 class="mb-4">General Settings</h5>
                                
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
                                            <option>German</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Timezone</h6>
                                            <p>Your current timezone</p>
                                        </div>
                                        <select class="form-select" style="max-width: 200px;">
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
                                    <h6>System Preferences</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Auto-save forms</h6>
                                            <p>Automatically save form data as you type</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="autoSave" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Show tooltips</h6>
                                            <p>Display helpful tooltips throughout the app</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="showTooltips" checked>
                                        </div>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                        
                        <!-- Account Settings -->
                        <div id="account" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4">Account Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Personal Information</h6>
                                    
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="firstName" class="form-label">First Name</label>
                                            <input type="text" class="form-control" id="firstName" value="Admin">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="lastName" class="form-label">Last Name</label>
                                            <input type="text" class="form-control" id="lastName" value="User">
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="email" value="admin@eduhub.com">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="phone" placeholder="+1 (555) 123-4567">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="bio" class="form-label">Bio</label>
                                        <textarea class="form-control" id="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">Update Account</button>
                                <button class="btn btn-outline-danger ms-2">Delete Account</button>
                            </div>
                        </div>
                        
                        <!-- Notification Settings -->
                        <div id="notifications" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4">Notification Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Email Notifications</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>New student registrations</h6>
                                            <p>Get notified when new students register</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailStudents" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Attendance updates</h6>
                                            <p>Receive updates about attendance changes</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailAttendance" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Assignment submissions</h6>
                                            <p>Get notified about new assignment submissions</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="emailAssignments">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Push Notifications</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Desktop notifications</h6>
                                            <p>Show notifications on your desktop</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="pushDesktop">
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Sound alerts</h6>
                                            <p>Play a sound when you receive notifications</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="soundAlerts" checked>
                                        </div>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">Save Preferences</button>
                            </div>
                        </div>
                        
                        <!-- Security Settings -->
                        <div id="security" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4">Security Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Password</h6>
                                    
                                    <div class="mb-3">
                                        <label for="currentPassword" class="form-label">Current Password</label>
                                        <input type="password" class="form-control" id="currentPassword">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="newPassword" class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="newPassword">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirmPassword">
                                    </div>
                                    
                                    <button class="btn btn-primary">Change Password</button>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Two-Factor Authentication</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Enable 2FA</h6>
                                            <p>Add an extra layer of security to your account</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="enable2FA">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Active Sessions</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Current Device</h6>
                                            <p>Windows PC - Last active: Just now</p>
                                        </div>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    
                                    <button class="btn btn-outline-danger mt-3">Sign out from all devices</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Appearance Settings -->
                        <div id="appearance" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4">Appearance Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Theme</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Dark mode</h6>
                                            <p>Use dark theme for better visibility at night</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="darkMode">
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Compact mode</h6>
                                            <p>Reduce spacing for a more compact layout</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="compactMode">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Sidebar</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Sidebar position</h6>
                                            <p>Choose sidebar placement</p>
                                        </div>
                                        <select class="form-select" style="max-width: 200px;">
                                            <option selected>Left</option>
                                            <option>Right</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary">Apply Changes</button>
                            </div>
                        </div>
                        
                        <!-- Privacy Settings -->
                        <div id="privacy" class="settings-section">
                            <div class="card-custom">
                                <h5 class="mb-4">Privacy Settings</h5>
                                
                                <div class="settings-group">
                                    <h6>Profile Visibility</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Show profile to other users</h6>
                                            <p>Allow other users to view your profile</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="showProfile" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Show online status</h6>
                                            <p>Let others know when you're online</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="showOnline" checked>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Data & Analytics</h6>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Usage analytics</h6>
                                            <p>Help us improve by sharing anonymous usage data</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="analytics" checked>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h6>Personalized recommendations</h6>
                                            <p>Receive personalized content based on your activity</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="recommendations">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-group">
                                    <h6>Data Management</h6>
                                    
                                    <button class="btn btn-outline-primary me-2">Download my data</button>
                                    <button class="btn btn-outline-danger">Clear all data</button>
                                </div>
                                
                                <button class="btn btn-primary">Save Privacy Settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
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
        });
    </script>
</body>
</html>
