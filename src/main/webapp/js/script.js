/**
 * EduHub Custom Scripts
 */

console.log("Script loaded successfully.");

// Auto-close navbar on mobile when clicking links or outside (Bootstrap handles the toggle button)
document.addEventListener('DOMContentLoaded', function() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    
    if (navbarCollapse) {
        // Close menu when clicking nav links (Bootstrap doesn't do this by default)
        navbarCollapse.querySelectorAll('.nav-link, .btn').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            });
        });
        
        // Close menu when clicking outside (Bootstrap doesn't do this by default)
        document.addEventListener('click', function(event) {
            if (!document.querySelector('.navbar').contains(event.target) && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    }
});