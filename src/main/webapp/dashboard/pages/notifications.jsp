<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <jsp:include page="/public/components/head.jsp">
        <jsp:param name="title" value="Notifications - Dashboard - EduHub"/>
        <jsp:param name="description" value="View all notifications in EduHub"/>
    </jsp:include>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/dashboard/css/dashboard.css">
    <style>
        .notification-filters {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #E2E8F0;
            background: white;
            color: var(--dark-color);
            border-radius: 2rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .filter-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
        
        .filter-btn.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .notification-item-full {
            background: white;
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
        }
        
        .notification-item-full:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
        
        .notification-item-full.unread {
            border-left: 4px solid var(--primary-color);
            background-color: #F0F7FF;
        }
        
        .notification-actions {
            display: flex;
            gap: 0.5rem;
            margin-left: auto;
        }
        
        .notification-actions button {
            background: none;
            border: none;
            color: var(--secondary-color);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: all 0.2s;
        }
        
        .notification-actions button:hover {
            background-color: var(--light-color);
            color: var(--dark-color);
        }
        
        .empty-notifications {
            text-align: center;
            padding: 3rem 1rem;
        }
        
        .empty-notifications i {
            font-size: 4rem;
            color: #CBD5E1;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <jsp:include page="../components/sidebar.jsp">
            <jsp:param name="activePage" value="notifications"/>
        </jsp:include>
        
        <!-- Main Content -->
        <div class="dashboard-main">
            <!-- Header -->
            <jsp:include page="../components/header.jsp">
                <jsp:param name="pageTitle" value="Notifications"/>
            </jsp:include>
            
            <!-- Content -->
            <div class="dashboard-content">
                <div class="page-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Notifications</h2>
                            <p>Stay updated with all your activities</p>
                        </div>
                        <div>
                            <button class="btn btn-outline-primary btn-sm me-2" onclick="markAllAsRead()">
                                <i class="bi bi-check-all"></i> Mark all as read
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="clearAll()">
                                <i class="bi bi-trash"></i> Clear all
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Filters -->
                <div class="notification-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="unread">Unread</button>
                    <button class="filter-btn" data-filter="students">Students</button>
                    <button class="filter-btn" data-filter="attendance">Attendance</button>
                    <button class="filter-btn" data-filter="assignments">Assignments</button>
                    <button class="filter-btn" data-filter="system">System</button>
                </div>
                
                <!-- Notifications List -->
                <div class="notifications-container">
                    <!-- Unread Notifications -->
                    <div class="notification-item-full unread" data-category="students">
                        <div class="notification-icon bg-primary">
                            <i class="bi bi-person-plus"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">New Student Registration</div>
                            <div class="notification-message">John Doe has successfully registered for the Computer Science program. Please review the application and approve enrollment.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 2 minutes ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Mark as read" onclick="markAsRead(this)">
                                <i class="bi bi-check"></i>
                            </button>
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="notification-item-full unread" data-category="attendance">
                        <div class="notification-icon bg-success">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Attendance Updated</div>
                            <div class="notification-message">Class 10-A attendance has been marked for today. Total present: 28/30 students. 2 students are absent.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 15 minutes ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Mark as read" onclick="markAsRead(this)">
                                <i class="bi bi-check"></i>
                            </button>
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="notification-item-full unread" data-category="assignments">
                        <div class="notification-icon bg-warning">
                            <i class="bi bi-file-earmark-text"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">New Assignment Submitted</div>
                            <div class="notification-message">Sarah Williams has submitted Mathematics Assignment #3. The assignment is ready for review and grading.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 1 hour ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Mark as read" onclick="markAsRead(this)">
                                <i class="bi bi-check"></i>
                            </button>
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Read Notifications -->
                    <div class="notification-item-full" data-category="system">
                        <div class="notification-icon bg-info">
                            <i class="bi bi-megaphone"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">System Announcement</div>
                            <div class="notification-message">Scheduled maintenance is planned for Sunday, November 10, 2025 at 2:00 AM EST. The system will be unavailable for approximately 2 hours.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 3 hours ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="notification-item-full" data-category="students">
                        <div class="notification-icon bg-danger">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Payment Reminder</div>
                            <div class="notification-message">Fee payment deadline is approaching for 5 students. Please send reminders to ensure timely payments.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 5 hours ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="notification-item-full" data-category="students">
                        <div class="notification-icon bg-primary">
                            <i class="bi bi-person-check"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Student Enrollment Approved</div>
                            <div class="notification-message">Emily Johnson's enrollment has been approved for the Biology program. Welcome email has been sent.</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> Yesterday</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="notification-item-full" data-category="attendance">
                        <div class="notification-icon bg-success">
                            <i class="bi bi-clipboard-data"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">Monthly Attendance Report</div>
                            <div class="notification-message">October 2025 attendance report is now available. Overall attendance rate: 94.5%</div>
                            <div class="notification-time"><i class="bi bi-clock"></i> 2 days ago</div>
                        </div>
                        <div class="notification-actions">
                            <button title="Delete" onclick="deleteNotification(this)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Empty State (hidden by default) -->
                <div class="empty-notifications" style="display: none;">
                    <i class="bi bi-bell-slash"></i>
                    <h5>No notifications</h5>
                    <p class="text-muted">You're all caught up! No new notifications at the moment.</p>
                </div>
                
            </div>
        </div>
    </div>
    
    <jsp:include page="/public/components/scripts.jsp"/>
    <script src="${pageContext.request.contextPath}/dashboard/js/dashboard.js"></script>
    <script>
        // Filter notifications
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const notifications = document.querySelectorAll('.notification-item-full');
                
                notifications.forEach(notification => {
                    if (filter === 'all') {
                        notification.style.display = 'flex';
                    } else if (filter === 'unread') {
                        notification.style.display = notification.classList.contains('unread') ? 'flex' : 'none';
                    } else {
                        notification.style.display = notification.getAttribute('data-category') === filter ? 'flex' : 'none';
                    }
                });
                
                checkEmpty();
            });
        });
        
        // Mark as read
        function markAsRead(button) {
            const item = button.closest('.notification-item-full');
            item.classList.remove('unread');
            button.remove();
            showToast('Notification marked as read', 'success');
        }
        
        // Mark all as read
        function markAllAsRead() {
            const unreadItems = document.querySelectorAll('.notification-item-full.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
                const readBtn = item.querySelector('.notification-actions button[title="Mark as read"]');
                if (readBtn) readBtn.remove();
            });
            showToast('All notifications marked as read', 'success');
        }
        
        // Delete notification
        function deleteNotification(button) {
            const item = button.closest('.notification-item-full');
            item.style.opacity = '0';
            item.style.transform = 'translateX(100%)';
            setTimeout(() => {
                item.remove();
                checkEmpty();
                showToast('Notification deleted', 'info');
            }, 300);
        }
        
        // Clear all
        function clearAll() {
            if (confirm('Are you sure you want to clear all notifications?')) {
                const items = document.querySelectorAll('.notification-item-full');
                items.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(100%)';
                });
                setTimeout(() => {
                    items.forEach(item => item.remove());
                    checkEmpty();
                    showToast('All notifications cleared', 'info');
                }, 300);
            }
        }
        
        // Check if empty
        function checkEmpty() {
            const container = document.querySelector('.notifications-container');
            const emptyState = document.querySelector('.empty-notifications');
            const visibleNotifications = document.querySelectorAll('.notification-item-full[style*="display: flex"], .notification-item-full:not([style*="display: none"])').length;
            
            if (visibleNotifications === 0 || document.querySelectorAll('.notification-item-full').length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                container.style.display = 'block';
                emptyState.style.display = 'none';
            }
        }
    </script>
</body>
</html>
