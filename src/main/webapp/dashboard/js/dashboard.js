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
            if (window.innerWidth <= 991) {
                // Mobile: Slide sidebar in/out
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
            } else {
                // Desktop: Collapse sidebar to icon-only mode
                sidebar.classList.toggle('collapsed');
                document.querySelector('.dashboard-main').classList.toggle('expanded');
            }
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
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
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
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
    
});

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
