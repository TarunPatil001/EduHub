<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Dashboard Header Component
  
  Purpose: 
    - Top navigation bar for dashboard
    - User profile and notifications
--%>

<header class="dashboard-header">
    <div class="header-left">
        <button class="btn-toggle-sidebar" id="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>
        <h5 class="mb-0">${param.pageTitle != null ? param.pageTitle : 'Dashboard'}</h5>
    </div>
    
    <div class="header-right">
        <div class="header-search d-none d-md-block">
            <i class="bi bi-search"></i>
            <input type="text" class="form-control" placeholder="Search...">
        </div>
        
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
                <img src="https://ui-avatars.com/api/?name=User&background=0D6EFD&color=fff" alt="Profile">
                <span class="d-none d-md-inline">Admin User</span>
                <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
                <a class="dropdown-item" href="${pageContext.request.contextPath}/dashboard/pages/profile.jsp">
                    <i class="bi bi-person"></i> My Profile
                </a>
                <a class="dropdown-item" href="${pageContext.request.contextPath}/dashboard/pages/settings.jsp">
                    <i class="bi bi-gear"></i> Settings
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item text-danger" href="${pageContext.request.contextPath}/">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </a>
            </div>
        </div>
    </div>
</header>
