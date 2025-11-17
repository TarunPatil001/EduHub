// Navbar scroll effect - add 'scrolled' class when user scrolls down
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.glassmorphism-navbar');
    
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});
