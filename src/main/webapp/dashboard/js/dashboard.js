/**
 * Dashboard JavaScript Functions
 * 
 * Purpose:
 * - Handle sidebar toggle
 * - Handle responsive behavior
 * - Initialize dashboard components
 * - Adjust viewport height for mobile devices
 */

// Set CSS custom property for actual viewport height (handles mobile browser address bars)
function setViewportHeight() {
    // Get the actual viewport height
    const vh = window.innerHeight * 0.01;
    // Set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Also set a CSS variable for 100vh equivalent
    document.documentElement.style.setProperty('--actual-vh', `${window.innerHeight}px`);
}

// Call on page load
setViewportHeight();

// Update on resize (debounced for performance)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setViewportHeight, 100);
});

// Update on orientation change (important for mobile devices)
window.addEventListener('orientationchange', function() {
    setTimeout(setViewportHeight, 100); // Small delay to ensure correct values
});

// Update on scroll for iOS Safari (address bar show/hide)
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(setViewportHeight, 100);
}, { passive: true });

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================================================
    // TOAST NOTIFICATIONS
    // ========================================================================
    
    /**
     * Toast notifications are now handled by the centralized system
     * in /common/js/toast-notification.js
     * 
     * URL parameters like ?success=login, ?error=something, ?logout=true
     * are automatically detected and shown as toasts.
     * 
     * No need for duplicate logic here.
     */
    
    // ========================================================================
    // SIDEBAR AND OVERLAY SETUP
    // ========================================================================
    
    // Create sidebar overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);
    
    // Sidebar toggle functionality
    const toggleSidebar = document.getElementById('toggleSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('dashboardSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            const icon = toggleSidebar.querySelector('i');
            
            if (window.innerWidth <= 991) {
                // Mobile: Slide sidebar in/out
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
                
                // Toggle icon
                if (sidebar.classList.contains('show')) {
                    icon.classList.remove('bi-layout-sidebar-inset');
                    icon.classList.add('bi-layout-sidebar-inset-reverse');
                } else {
                    icon.classList.remove('bi-layout-sidebar-inset-reverse');
                    icon.classList.add('bi-layout-sidebar-inset');
                }
            } else {
                // Desktop: Collapse sidebar to icon-only mode
                const isCollapsing = !sidebar.classList.contains('collapsed');
                
                sidebar.classList.toggle('collapsed');
                document.querySelector('.dashboard-main').classList.toggle('expanded');
                
                // When collapsing sidebar, close all submenus
                if (isCollapsing) {
                    const allSubmenus = document.querySelectorAll('.submenu.show');
                    allSubmenus.forEach(function(submenu) {
                        // Use Bootstrap's collapse to close
                        const bsCollapse = bootstrap.Collapse.getInstance(submenu);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        } else {
                            submenu.classList.remove('show');
                        }
                    });
                    
                    // Update aria-expanded attributes
                    const allSubmenuLinks = document.querySelectorAll('.nav-link.has-submenu');
                    allSubmenuLinks.forEach(function(link) {
                        link.setAttribute('aria-expanded', 'false');
                    });
                } else {
                    // When expanding sidebar, open only the active submenu
                    const activeSubmenuLink = document.querySelector('.nav-link.has-submenu.active');
                    if (activeSubmenuLink) {
                        const targetId = activeSubmenuLink.getAttribute('data-bs-target');
                        if (targetId) {
                            const activeSubmenu = document.querySelector(targetId);
                            if (activeSubmenu) {
                                setTimeout(function() {
                                    const bsCollapse = new bootstrap.Collapse(activeSubmenu, {
                                        toggle: true
                                    });
                                }, 100);
                            }
                        }
                    }
                }
                
                // Toggle icon
                if (sidebar.classList.contains('collapsed')) {
                    icon.classList.remove('bi-layout-sidebar-inset');
                    icon.classList.add('bi-layout-sidebar-inset-reverse');
                } else {
                    icon.classList.remove('bi-layout-sidebar-inset-reverse');
                    icon.classList.add('bi-layout-sidebar-inset');
                }
            }
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            
            // Reset icon to default
            const icon = toggleSidebar.querySelector('i');
            icon.classList.remove('bi-layout-sidebar-inset-reverse');
            icon.classList.add('bi-layout-sidebar-inset');
        });
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            
            // Reset icon to default
            const icon = toggleSidebar.querySelector('i');
            icon.classList.remove('bi-layout-sidebar-inset-reverse');
            icon.classList.add('bi-layout-sidebar-inset');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 991) {
            const isClickInsideSidebar = sidebar && sidebar.contains(event.target);
            const isToggleButton = toggleSidebar && toggleSidebar.contains(event.target);
            
            if (!isClickInsideSidebar && !isToggleButton && sidebar && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
                
                // Reset icon to default
                const icon = toggleSidebar.querySelector('i');
                icon.classList.remove('bi-layout-sidebar-inset-reverse');
                icon.classList.add('bi-layout-sidebar-inset');
            }
        }
    });
    
    // ========================================================================
    // EXPAND SIDEBAR WHEN CLICKING SUBMENU ITEMS IN COLLAPSED STATE
    // ========================================================================
    
    /**
     * When sidebar is collapsed and user clicks on a nav item with submenu,
     * expand the sidebar to show the submenu items
     */
    const submenuLinks = document.querySelectorAll('.nav-link.has-submenu');
    
    submenuLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Only apply this behavior on desktop when sidebar is collapsed
            if (window.innerWidth > 991 && sidebar && sidebar.classList.contains('collapsed')) {
                // Prevent the default collapse toggle
                event.preventDefault();
                
                // Expand the sidebar
                sidebar.classList.remove('collapsed');
                document.querySelector('.dashboard-main').classList.remove('expanded');
                
                // Update toggle icon
                if (toggleSidebar) {
                    const icon = toggleSidebar.querySelector('i');
                    icon.classList.remove('bi-layout-sidebar-inset-reverse');
                    icon.classList.add('bi-layout-sidebar-inset');
                }
                
                // Close all other submenus first
                const allSubmenus = document.querySelectorAll('.submenu.show');
                allSubmenus.forEach(function(submenu) {
                    const bsCollapse = bootstrap.Collapse.getInstance(submenu);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        submenu.classList.remove('show');
                    }
                });
                
                // After expanding, trigger the clicked submenu to open
                setTimeout(function() {
                    const targetId = link.getAttribute('data-bs-target');
                    if (targetId) {
                        const submenu = document.querySelector(targetId);
                        if (submenu) {
                            // Use Bootstrap's collapse API
                            const bsCollapse = new bootstrap.Collapse(submenu, {
                                toggle: true
                            });
                        }
                    }
                }, 100); // Small delay to ensure sidebar expansion completes
            } else if (window.innerWidth > 991 && sidebar && !sidebar.classList.contains('collapsed')) {
                // When sidebar is expanded, close other submenus when opening a new one
                const targetId = link.getAttribute('data-bs-target');
                const clickedSubmenu = document.querySelector(targetId);
                
                // Only close others if this submenu is currently closed
                if (clickedSubmenu && !clickedSubmenu.classList.contains('show')) {
                    const allSubmenus = document.querySelectorAll('.submenu.show');
                    allSubmenus.forEach(function(submenu) {
                        if (submenu !== clickedSubmenu) {
                            const bsCollapse = bootstrap.Collapse.getInstance(submenu);
                            if (bsCollapse) {
                                bsCollapse.hide();
                            }
                        }
                    });
                }
            }
            // On mobile, default behavior (Bootstrap collapse) works
        });
    });
    
    // ========================================================================
    // INITIALIZE: CLOSE NON-ACTIVE SUBMENUS ON PAGE LOAD
    // ========================================================================
    
    /**
     * On page load, ensure only the active submenu is open
     */
    window.addEventListener('load', function() {
        // Only apply on desktop
        if (window.innerWidth > 991 && sidebar && !sidebar.classList.contains('collapsed')) {
            const activeSubmenuLink = document.querySelector('.nav-link.has-submenu.active');
            const allSubmenus = document.querySelectorAll('.submenu.show');
            
            allSubmenus.forEach(function(submenu) {
                // Check if this submenu belongs to the active link
                if (activeSubmenuLink) {
                    const activeTargetId = activeSubmenuLink.getAttribute('data-bs-target');
                    const activeSubmenu = document.querySelector(activeTargetId);
                    
                    // Close all submenus except the active one
                    if (submenu !== activeSubmenu) {
                        const bsCollapse = bootstrap.Collapse.getInstance(submenu);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        } else {
                            submenu.classList.remove('show');
                        }
                    }
                } else {
                    // No active submenu, close all
                    const bsCollapse = bootstrap.Collapse.getInstance(submenu);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        submenu.classList.remove('show');
                    }
                }
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            
            // Reset icon to default when transitioning to desktop
            if (toggleSidebar) {
                const icon = toggleSidebar.querySelector('i');
                if (!sidebar.classList.contains('collapsed')) {
                    icon.classList.remove('bi-layout-sidebar-inset-reverse');
                    icon.classList.add('bi-layout-sidebar-inset');
                }
            }
        }
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Initialize Charts
    initializeCharts();
    
});

/**
 * Initialize Dashboard Charts
 */
function initializeCharts() {
    // Attendance Trends Chart
    const attendanceChartCanvas = document.getElementById('attendanceChart');
    if (attendanceChartCanvas) {
        const attendanceCtx = attendanceChartCanvas.getContext('2d');
        new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Student Attendance',
                    data: [92, 94, 89, 95, 91, 88, 93],
                    borderColor: 'rgb(13, 110, 253)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }, {
                    label: 'Staff Attendance',
                    data: [96, 98, 95, 97, 96, 94, 97],
                    borderColor: 'rgb(25, 135, 84)',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Course Distribution Chart
    const courseChartCanvas = document.getElementById('courseDistributionChart');
    if (courseChartCanvas) {
        const courseCtx = courseChartCanvas.getContext('2d');
        new Chart(courseCtx, {
            type: 'doughnut',
            data: {
                labels: ['Full Stack Development', 'Data Science', 'Digital Marketing', 'Others'],
                datasets: [{
                    data: [425, 320, 289, 200],
                    backgroundColor: [
                        'rgba(13, 110, 253, 0.8)',
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderColor: [
                        'rgb(13, 110, 253)',
                        'rgb(25, 135, 84)',
                        'rgb(255, 193, 7)',
                        'rgb(108, 117, 125)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
}

/**
 * Format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Show loading spinner
 */
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    loader.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loader.style.zIndex = '9999';
    loader.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(loader);
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.remove();
    }
}

/**
 * Note: Toast notification functions have been moved to
 * /dashboard/components/toast-notification.jsp
 * Include that component in your page to use showToast() function
 */

// Load theme switcher script dynamically
(function loadThemeSwitcher() {
    const script = document.createElement('script');
    script.src = document.querySelector('script[src*="dashboard.js"]')
        .src.replace('dashboard.js', 'theme-switcher.js');
    document.head.appendChild(script);
})();
