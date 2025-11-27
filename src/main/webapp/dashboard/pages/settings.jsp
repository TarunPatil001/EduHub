<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.eduhub.dao.impl.InstituteDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.InstituteDAO" %>
<%@ page import="com.eduhub.model.Institute" %>
<%@ page import="com.eduhub.model.User" %>
<%@ page import="com.eduhub.dao.impl.UserDAOImpl" %>
<%@ page import="com.eduhub.dao.interfaces.UserDAO" %>
<%
    // Security Check
    if (session == null || session.getAttribute("userId") == null) {
        response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=unauthorized");
        return;
    }

    // Get institute details
    Institute institute = null;
    Integer instituteId = (Integer) session.getAttribute("instituteId");
    
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
    Integer currentUserId = (Integer) session.getAttribute("userId");
    if (currentUserId != null) {
        try {
            UserDAO userDAO = new UserDAOImpl();
            currentUser = userDAO.getUserById(currentUserId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    if (currentUser == null) {
        currentUser = new User(); // Avoid null pointers
    }
%>
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
                            <button type="button" class="nav-link active" data-section="profile-section">
                                <i class="bi bi-building"></i>
                                <span>Institute Profile</span>
                            </button>
                            <button type="button" class="nav-link" data-section="admin-accounts-section">
                                <i class="bi bi-person-circle"></i>
                                <span>Admin Accounts</span>
                            </button>
                            <button type="button" class="nav-link" data-section="security-section">
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
                        <div id="profile-section" class="settings-section active">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">Institute Profile</h5>
                                </div>
                                <div class="card-body">
                                    <div class="settings-group">
                                        <h6>Basic Information</h6>
                                        
                                        <div class="mb-3">
                                            <label for="instituteName" class="form-label">Institute Name</label>
                                            <input type="text" class="form-control" id="instituteName" placeholder="Enter institute name" value="<%= institute.getInstituteName() != null ? institute.getInstituteName() : "" %>">
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="instituteType" class="form-label">Institute Type</label>
                                            <select class="form-select" id="instituteType">
                                                <option value="">Select type</option>
                                                <% 
                                                String currentType = institute.getInstituteType();
                                                if (currentType != null) currentType = currentType.trim();
                                                boolean typeFound = false;
                                                
                                                if(application.getAttribute("instituteTypes") != null) {
                                                    for(String item : (List<String>)application.getAttribute("instituteTypes")) { 
                                                        boolean isSelected = item.equals(currentType);
                                                        if (isSelected) typeFound = true;
                                                %>
                                                    <option value="<%=item%>" <%= isSelected ? "selected" : "" %>><%=item%></option>
                                                <% } } 
                                                
                                                // If the value from DB is not in the list, show it anyway
                                                if (currentType != null && !currentType.isEmpty() && !typeFound) {
                                                %>
                                                    <option value="<%=currentType%>" selected><%=currentType%></option>
                                                <% } %>
                                            </select>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="instituteEmail" class="form-label">Official Email</label>
                                            <input type="email" class="form-control" id="instituteEmail" placeholder="contact@institute.com" value="<%= institute.getInstituteEmail() != null ? institute.getInstituteEmail() : "" %>">
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="institutePhone" class="form-label">Contact Phone</label>
                                            <input type="tel" class="form-control" id="institutePhone" placeholder="+1 (555) 000-0000" value="<%= institute.getInstitutePhone() != null ? institute.getInstitutePhone() : "" %>">
                                        </div>
                                    </div>
                                    
                                    <div class="settings-group">
                                        <h6>Location</h6>
                                        
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="country" class="form-label">Country</label>
                                                <select class="form-select" id="country">
                                                    <option value="">Select country</option>
                                                    <% 
                                                    String currentCountry = institute.getCountry();
                                                    if (currentCountry != null) currentCountry = currentCountry.trim();
                                                    boolean countryFound = false;
                                                    
                                                    if(application.getAttribute("countries") != null) {
                                                        for(String item : (List<String>)application.getAttribute("countries")) { 
                                                            boolean isSelected = item.equals(currentCountry);
                                                            if (isSelected) countryFound = true;
                                                    %>
                                                        <option value="<%=item%>" <%= isSelected ? "selected" : "" %>><%=item%></option>
                                                    <% } } 
                                                    
                                                    // If the value from DB is not in the list, show it anyway
                                                    if (currentCountry != null && !currentCountry.isEmpty() && !countryFound) {
                                                    %>
                                                        <option value="<%=currentCountry%>" selected><%=currentCountry%></option>
                                                    <% } %>
                                                </select>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="state" class="form-label">State/Province</label>
                                                <input type="text" class="form-control" id="state" placeholder="Enter state" value="<%= institute.getState() != null ? institute.getState() : "" %>">
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="address" class="form-label">Address (Optional)</label>
                                            <textarea class="form-control" id="address" rows="2" placeholder="Street address"><%= institute.getAddress() != null ? institute.getAddress() : "" %></textarea>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="city" class="form-label">City (Optional)</label>
                                                <input type="text" class="form-control" id="city" placeholder="City" value="<%= institute.getCity() != null ? institute.getCity() : "" %>">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="zipCode" class="form-label">ZIP/Postal Code (Optional)</label>
                                                <input type="text" class="form-control" id="zipCode" placeholder="ZIP code" value="<%= institute.getZipCode() != null ? institute.getZipCode() : "" %>">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button class="btn btn-primary" id="saveInstituteBtn">
                                        <i class="bi bi-save"></i> Update Institute Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="admin-accounts-section" class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">Admin Account</h5>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Manage your personal administrator account details.</p>
                                    <div class="settings-group">
                                        <h6>Personal Information</h6>
                                        <div class="mb-3">
                                            <label for="adminFullName" class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="adminFullName" placeholder="Enter full name" value="<%= currentUser.getFullName() != null ? currentUser.getFullName() : "" %>">
                                        </div>
                                        <div class="mb-3">
                                            <label for="adminEmail" class="form-label">Email Address</label>
                                            <input type="email" class="form-control" id="adminEmail" placeholder="Enter email" value="<%= currentUser.getEmail() != null ? currentUser.getEmail() : "" %>">
                                        </div>
                                        <div class="mb-3">
                                            <label for="adminPhone" class="form-label">Phone Number</label>
                                            <input type="tel" class="form-control" id="adminPhone" placeholder="Enter phone number" value="<%= currentUser.getPhone() != null ? currentUser.getPhone() : "" %>">
                                        </div>
                                    </div>
                                    <button class="btn btn-primary" id="saveAccountBtn">
                                        <i class="bi bi-save"></i> Update Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="security-section" class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">Security Settings</h5>
                                </div>
                                <div class="card-body">
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
    <jsp:include page="/components/toast-dependencies.jsp"/>
    <jsp:include page="/dashboard/components/modal.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // --- Form State Management ---
        const formState = {};

        function captureInitialState(sectionId) {
            formState[sectionId] = { initialState: {}, isDirty: false };
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    formState[sectionId].initialState[input.id] = input.type === 'checkbox' ? input.checked : input.value;
                }
            });
        }

        function checkDirtyState(sectionId) {
            if (!formState[sectionId]) return;
            let dirty = false;
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    const initialValue = formState[sectionId].initialState[input.id];
                    const currentValue = input.type === 'checkbox' ? input.checked : input.value;
                    if (initialValue !== undefined && initialValue !== currentValue) {
                        dirty = true;
                    }
                }
            });
            formState[sectionId].isDirty = dirty;
        }
        
        function isAnyFormDirty() {
            return Object.values(formState).some(state => state && state.isDirty);
        }

        function revertChanges(sectionId) {
            if (!formState[sectionId] || !formState[sectionId].initialState) return;
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    const initialValue = formState[sectionId].initialState[input.id];
                    if (initialValue !== undefined) {
                        if (input.type === 'checkbox') {
                            input.checked = initialValue;
                        } else {
                            input.value = initialValue;
                        }
                    }
                }
            });
            formState[sectionId].isDirty = false;
        }

        // --- API Call Functions ---
        function saveInstituteProfile(onSuccess, showToast = true) {
            const btn = document.getElementById('saveInstituteBtn');
            const originalText = btn.innerHTML;
            
            const data = {
                instituteName: document.getElementById('instituteName').value,
                instituteType: document.getElementById('instituteType').value,
                instituteEmail: document.getElementById('instituteEmail').value,
                institutePhone: document.getElementById('institutePhone').value,
                country: document.getElementById('country').value,
                state: document.getElementById('state').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value
            };
            
            if (!data.instituteName || !data.instituteEmail) {
                toast.error('Institute Name and Email are required.');
                return;
            }
            
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            
            const formData = new URLSearchParams(data);

            fetch('${pageContext.request.contextPath}/api/institute/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    if (showToast) {
                        toast.success(result.message);
                    } else {
                        sessionStorage.setItem('pendingToast', JSON.stringify({
                            type: 'success',
                            message: result.message
                        }));
                    }
                    captureInitialState('profile-section'); // Recapture state on success
                    if (onSuccess) onSuccess();
                } else {
                    toast.error(result.message || 'Failed to update profile.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('An unexpected error occurred.');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            });
        }

        function saveAccountProfile(onSuccess, showToast = true) {
            const btn = document.getElementById('saveAccountBtn');
            const originalText = btn.innerHTML;
            
            const data = {
                fullName: document.getElementById('adminFullName').value,
                email: document.getElementById('adminEmail').value,
                phone: document.getElementById('adminPhone').value
            };
            
            if (!data.fullName || !data.email) {
                toast.error('Full Name and Email are required.');
                return;
            }
            
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            
            const formData = new URLSearchParams(data);

            fetch('${pageContext.request.contextPath}/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    if (showToast) {
                        toast.success(result.message);
                    } else {
                        sessionStorage.setItem('pendingToast', JSON.stringify({
                            type: 'success',
                            message: result.message
                        }));
                    }
                    captureInitialState('admin-accounts-section'); // Recapture state
                    if (onSuccess) onSuccess();
                } else {
                    toast.error(result.message || 'Failed to update account.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('An unexpected error occurred.');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            });
        }

        // --- Event Listeners ---
        document.addEventListener('DOMContentLoaded', function() {
            const managedSections = ['profile-section', 'admin-accounts-section'];

            // Initial setup
            managedSections.forEach(id => {
                captureInitialState(id);
                const section = document.getElementById(id);
                if (section) {
                    section.addEventListener('input', () => checkDirtyState(id));
                    section.addEventListener('change', () => checkDirtyState(id));
                }
            });

            // Save button listeners
            document.getElementById('saveInstituteBtn').addEventListener('click', () => saveInstituteProfile());
            document.getElementById('saveAccountBtn').addEventListener('click', () => saveAccountProfile());

            // Settings page navigation
            const navLinks = document.querySelectorAll('.settings-nav .nav-link');
            const sections = document.querySelectorAll('.settings-section');
            
            function switchSection(link) {
                const sectionId = link.getAttribute('data-section');
                if (!sectionId) return;
                
                const targetSection = document.getElementById(sectionId);
                if (!targetSection) {
                    console.error('Target section not found:', sectionId);
                    return;
                }
                
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                link.classList.add('active');
                targetSection.classList.add('active');
            }

            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const clickedLink = this;
                    
                    if (clickedLink.classList.contains('active')) return;

                    const dirtySectionId = managedSections.find(id => formState[id] && formState[id].isDirty);

                    if (dirtySectionId) {
                        const sectionName = dirtySectionId === 'profile-section' ? 'Institute Profile' : 'Admin Account';
                        
                        showConfirmationModal({
                            title: 'Unsaved Changes',
                            message: 'You have unsaved changes in the ' + sectionName + '. Do you want to save them before leaving?',
                            confirmText: 'Save Changes',
                            cancelText: 'Discard Changes',
                            extraBtnText: null,
                            onConfirm: () => {
                                const saveFunction = dirtySectionId === 'profile-section' ? saveInstituteProfile : saveAccountProfile;
                                saveFunction(() => {
                                    if (formState[dirtySectionId]) formState[dirtySectionId].isDirty = false;
                                    if (window.currentConfirmationModal) window.currentConfirmationModal.hide();
                                    switchSection(clickedLink);
                                });
                                return false; // Keep modal open
                            },
                            onCancel: () => {
                                revertChanges(dirtySectionId);
                                switchSection(clickedLink);
                            }
                        });
                    } else {
                        switchSection(clickedLink);
                    }
                });
            });

            // Global Link Navigation Protection
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (!link) return;
                
                // Ignore if it's a tab toggle or internal link or javascript
                if (link.getAttribute('data-section') || (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) || link.href.includes('javascript:')) return;
                
                // Check if dirty
                const dirtySectionId = managedSections.find(id => formState[id] && formState[id].isDirty);
                if (!dirtySectionId) return;
                
                e.preventDefault();
                const targetUrl = link.href;
                const sectionName = dirtySectionId === 'profile-section' ? 'Institute Profile' : 'Admin Account';
                
                showConfirmationModal({
                    title: 'Unsaved Changes',
                    message: 'You have unsaved changes in the ' + sectionName + '. Do you want to save them before leaving?',
                    confirmText: 'Save & Leave',
                    cancelText: 'Discard & Leave',
                    extraBtnText: null,
                    onConfirm: () => {
                        const saveFunction = dirtySectionId === 'profile-section' ? saveInstituteProfile : saveAccountProfile;
                        saveFunction(() => {
                            if (formState[dirtySectionId]) formState[dirtySectionId].isDirty = false;
                            if (window.currentConfirmationModal) window.currentConfirmationModal.hide();
                            canNavigate = true;
                            window.location.href = targetUrl;
                        }, false); // Pass false to suppress immediate toast and use sessionStorage
                        return false; // Keep modal open
                    },
                    onCancel: () => {
                        // No need to revert, just leave
                        canNavigate = true;
                        window.location.href = targetUrl;
                    }
                });
            });
            
            // Browser/Tab Close Protection
            window.addEventListener('beforeunload', function(e) {
                if (isAnyFormDirty() && !canNavigate) {
                    e.preventDefault();
                    e.returnValue = ''; // Required for Chrome
                }
            });
            
            // Handle hash on load
            if (window.location.hash) {
                const targetLink = document.querySelector(`[data-section="${window.location.hash.substring(1)}"]`);
                if (targetLink) switchSection(targetLink);
            }
        });
    </script>
    <script src="${pageContext.request.contextPath}/dashboard/js/theme-switcher.js"></script>
</body>
</html>
