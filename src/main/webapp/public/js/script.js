/**
 * ============================================================================
 * EduHub Landing Page JavaScript
 * ============================================================================
 * 
 * Purpose: Interactive functionality for the landing page (index.jsp)
 * 
 * Features:
 * - Mobile navigation menu toggle
 * - Smooth scroll for anchor links
 * - Navbar shadow effect on scroll
 * - Scroll-triggered animations for feature cards
 * - Auto-close mobile menu on link click or outside click
 * - Staggered animation delays for visual appeal
 * 
 * Functions:
 * 1. Mobile Menu Toggle - Hamburger menu for responsive navigation
 * 2. Smooth Scroll - Smooth scrolling to page sections
 * 3. Navbar Scroll Effect - Enhanced shadow when scrolling
 * 4. Intersection Observer - Animate elements when they enter viewport
 * 
 * Dependencies:
 *   - None (Vanilla JavaScript only)
 * ============================================================================
 */

/**
 * Main initialization - Runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================================================
    // PAGE INITIALIZATION
    // ========================================================================
    
    /**
     * Scroll to top on page load
     * Ensures users always start at the top of the page
     */
    window.scrollTo(0, 0);
    
    // ========================================================================
    // MOBILE MENU FUNCTIONALITY
    // ========================================================================
    
    /**
     * Mobile Menu Toggle
     * Handles the hamburger menu icon click to show/hide mobile navigation
     */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Toggle 'active' class on both hamburger and menu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    /**
     * Close mobile menu when clicking navigation links
     * Improves UX by automatically closing menu after selection
     */
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    /**
     * Close mobile menu when clicking outside
     * Provides intuitive behavior expected by users
     */
    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        const isClickInsideNavbar = navbar.contains(event.target);
        
        // If click is outside navbar and menu is open, close it
        if (!isClickInsideNavbar && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    /**
     * Close mobile menu when clicking mobile-only buttons
     * Ensures menu closes when user clicks Login/Register buttons in mobile menu
     */
    const mobileButtons = document.querySelectorAll('.mobile-only .btn');
    mobileButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // ========================================================================
    // SMOOTH SCROLLING
    // ========================================================================
    
    /**
     * Smooth scroll for anchor links
     * Enables smooth scrolling to page sections when clicking # links
     * 
     * Example: Clicking <a href="#features"> smoothly scrolls to #features section
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default if href is not just "#"
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========================================================================
    // NAVBAR SCROLL EFFECT
    // ========================================================================
    
    /**
     * Navbar scroll effect
     * Enhances navbar shadow when user scrolls down
     * Creates depth perception and improves visual hierarchy
     */
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add stronger shadow when scrolled past 100px
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            // Light shadow at top of page
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ========================================================================
    // SCROLL ANIMATIONS
    // ========================================================================
    
    /**
     * Intersection Observer Configuration
     * - threshold: 0.1 = trigger when 10% of element is visible
     * - rootMargin: Start observing 50px before element enters viewport
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    /**
     * Intersection Observer
     * Watches for elements entering the viewport and triggers animations
     * More performant than scroll event listeners
     */
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger fade-in animation when element enters viewport
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                // Stop observing once animated (animation only happens once)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    /**
     * Observe feature cards for scroll animations
     * Initially hide cards (opacity: 0) then animate them in when visible
     */
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    /**
     * Staggered animation delays
     * Each feature card animates slightly after the previous one
     * Creates a cascading effect for visual appeal
     * - Card 1: 0ms delay
     * - Card 2: 100ms delay
     * - Card 3: 200ms delay, etc.
     */
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// ============================================================================
// BROWSER BEHAVIOR OVERRIDES
// ============================================================================

/**
 * Prevent default scroll restoration
 * Ensures page always loads at the top, not at previous scroll position
 * Some browsers remember scroll position on back/forward navigation
 */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// ============================================================================
// DEBUG LOGGING
// ============================================================================

/* ============================================================================
   END OF FILE
   ============================================================================ */