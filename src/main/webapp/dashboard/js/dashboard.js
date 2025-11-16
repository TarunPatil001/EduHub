/**
 * Dashboard JavaScript Functions
 * 
 * Purpose:
 * - Handle sidebar toggle
 * - Handle responsive behavior
 * - Initialize dashboard components
 */

document.addEventListener('DOMContentLoaded', function() {
    
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
                sidebar.classList.toggle('collapsed');
                document.querySelector('.dashboard-main').classList.toggle('expanded');
                
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
