<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Get user info from session for header display
    String headerUserName = (String) session.getAttribute("userName");
    String headerUserEmail = (String) session.getAttribute("userEmail");
    String headerUserRole = (String) session.getAttribute("userRole");
    
    // Default values if session attributes are null
    if (headerUserName == null) headerUserName = "User";
    if (headerUserEmail == null) headerUserEmail = "";
    if (headerUserRole == null) headerUserRole = "user";
    
    // Capitalize role for display
    String displayRole = headerUserRole.substring(0, 1).toUpperCase() + headerUserRole.substring(1);
%>
<%--
  Dashboard Header Component
  
  Purpose: 
    - Top navigation bar for dashboard
    - User profile and notifications
--%>

<header class="dashboard-header">
    <div class="header-left">
        <button class="btn-toggle-sidebar" id="toggleSidebar">
            <i class="bi bi-layout-sidebar-inset"></i>
        </button>
        <h5 class="mb-0">
            <span class="desktop-title">${param.pageTitle != null ? param.pageTitle : 'Dashboard'}</span>
            <span class="mobile-title">
                ${param.pageTitle != null && param.pageTitle.contains('Dashboard Overview') ? 'Dashboard' : 
                  (param.pageTitle != null && param.pageTitle.length() > 15 ? param.pageTitle.substring(0, 15).concat('...') : 
                  (param.pageTitle != null ? param.pageTitle : 'Dashboard'))}
            </span>
        </h5>
    </div>
    
    <div class="header-right">
        <div class="header-notifications dropdown">
            <button class="btn-icon" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-bell"></i>
                <span class="notification-badge">5</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end notification-dropdown">
                <div class="notification-header">
                    <h6>Notifications</h6>
                    <button class="btn-mark-read">Mark all as read</button>
                </div>
                
                <div class="notification-list">
                    <a href="#" class="notification-item unread">
                        <div class="notification-icon bg-primary">
                            <i class="bi bi-person-plus"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">New Student Registration</div>
                            <div class="notification-message">John Doe has registered for Computer Science program</div>
                            <div class="notification-time">2 minutes ago</div>
                        </div>
                        <div class="notification-dot"></div>
                    </a>
                    
                    <a href="#" class="notification-item unread">
                        <div class="notification-icon bg-success">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Attendance Updated</div>
                            <div class="notification-message">Class 10-A attendance has been marked for today</div>
                            <div class="notification-time">15 minutes ago</div>
                        </div>
                        <div class="notification-dot"></div>
                    </a>
                    
                    <a href="#" class="notification-item unread">
                        <div class="notification-icon bg-warning">
                            <i class="bi bi-file-earmark-text"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">New Assignment Submitted</div>
                            <div class="notification-message">Sarah Williams submitted Mathematics Assignment #3</div>
                            <div class="notification-time">1 hour ago</div>
                        </div>
                        <div class="notification-dot"></div>
                    </a>
                    
                    <a href="#" class="notification-item">
                        <div class="notification-icon bg-info">
                            <i class="bi bi-megaphone"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">System Announcement</div>
                            <div class="notification-message">Scheduled maintenance on Sunday at 2:00 AM</div>
                            <div class="notification-time">3 hours ago</div>
                        </div>
                    </a>
                    
                    <a href="#" class="notification-item">
                        <div class="notification-icon bg-danger">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Payment Reminder</div>
                            <div class="notification-message">Fee payment deadline approaching for 5 students</div>
                            <div class="notification-time">5 hours ago</div>
                        </div>
                    </a>
                </div>
                
                <div class="notification-footer">
                    <a href="${pageContext.request.contextPath}/dashboard/pages/notifications.jsp">View all notifications</a>
                </div>
            </div>
        </div>
        
        <div class="header-profile dropdown">
            <button class="btn-profile" data-bs-toggle="dropdown">
                <div class="avatar-container">
                    <img src="https://ui-avatars.com/api/?name=<%= headerUserName.replace(" ", "+") %>&background=0D6EFD&color=fff" alt="Profile">
                </div>
                <div class="profile-info d-none d-md-block">
                    <span class="profile-name"><%= headerUserName %></span>
                </div>
                <i class="bi bi-chevron-down ms-2"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end profile-dropdown-menu">
                <div class="dropdown-header profile-header">
                    <div class="profile-name-large"><%= headerUserName.toUpperCase() %></div>
                    <div class="profile-email"><%= headerUserEmail.toUpperCase() %></div>
                    <div class="profile-role"><%= displayRole.toUpperCase() %></div>
                </div>
                <div class="dropdown-divider m-0"></div>
                <a class="dropdown-item" href="${pageContext.request.contextPath}/dashboard/pages/profile.jsp">
                    <i class="bi bi-person"></i> My Profile
                </a>
                <a class="dropdown-item" href="${pageContext.request.contextPath}/dashboard/pages/settings.jsp">
                    <i class="bi bi-gear"></i> Settings
                </a>
                <div class="dropdown-divider m-0"></div>
                <a class="dropdown-item text-danger" href="${pageContext.request.contextPath}/auth/logout" id="logoutBtn">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </a>
            </div>
        </div>
    </div>
</header>

<script>
    // Logout confirmation modal
    document.addEventListener('DOMContentLoaded', function() {
        // Handle header logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLogoutConfirmation(this.href);
            });
        }
        
        // Handle sidebar logout button
        const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
        if (sidebarLogoutBtn) {
            sidebarLogoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLogoutConfirmation(this.href);
            });
        }
        
        // Logout confirmation modal
        function showLogoutConfirmation(logoutUrl) {
            // Create modal backdrop
            const backdrop = document.createElement('div');
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            `;
            
            // Create confirmation dialog
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            `;
            
            dialog.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <i class="bi bi-box-arrow-right" style="font-size: 32px; color: #dc3545;"></i>
                    <h5 style="margin: 0; font-weight: 600; color: #333;">Logout Confirmation</h5>
                </div>
                <p style="color: #666; margin-bottom: 24px; font-size: 15px;">
                    Are you sure you want to logout? You'll need to login again to access the dashboard.
                </p>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="cancelLogout" style="
                        padding: 10px 24px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        color: #666;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                        Cancel
                    </button>
                    <button id="confirmLogout" style="
                        padding: 10px 24px;
                        border: none;
                        background: linear-gradient(135deg, #dc3545, #c82333);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="bi bi-check-circle me-1"></i> Yes, Logout
                    </button>
                </div>
            `;
            
            // Add animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            backdrop.appendChild(dialog);
            document.body.appendChild(backdrop);
            
            // Function to close modal smoothly
            function closeModal() {
                backdrop.style.transition = 'opacity 0.2s ease';
                backdrop.style.opacity = '0';
                setTimeout(() => {
                    if (backdrop.parentNode) {
                        backdrop.remove();
                    }
                }, 200);
            }
            
            // Handle cancel
            document.getElementById('cancelLogout').addEventListener('click', function() {
                closeModal();
            });
            
            // Handle confirm
            document.getElementById('confirmLogout').addEventListener('click', function() {
                closeModal();
                
                // Show loading toast
                if (typeof toast !== 'undefined') {
                    toast.loading('Logging out...');
                }
                
                // Redirect after brief delay
                setTimeout(function() {
                    window.location.href = logoutUrl;
                }, 800);
            });
            
            // Close on backdrop click
            backdrop.addEventListener('click', function(e) {
                if (e.target === backdrop) {
                    closeModal();
                }
            });
            
            // Close on ESC key
            const escHandler = function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }
    });
</script>
