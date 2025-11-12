/**
 * Theme Switcher
 * Handles light/dark mode switching with localStorage persistence
 */

(function() {
    'use strict';

    // Theme constants
    const THEME_KEY = 'eduhub-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Use saved theme, or default to system preference
        const theme = savedTheme || (prefersDark ? THEME_DARK : THEME_LIGHT);
        applyTheme(theme);
        
        // Update toggle switches if they exist
        updateThemeToggles(theme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        if (theme === THEME_DARK) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    // Get current theme
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? THEME_DARK : THEME_LIGHT;
    }

    // Toggle between light and dark theme
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme);
        updateThemeToggles(newTheme);
        
        // Show toast notification
        if (typeof showToast === 'function') {
            showToast(`${newTheme === THEME_DARK ? 'Dark' : 'Light'} mode enabled`, 'info', 2000);
        }
    }

    // Update all theme toggle switches on the page
    function updateThemeToggles(theme) {
        const isDark = theme === THEME_DARK;
        
        // Update dark mode toggle in settings
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.checked = isDark;
        }
        
        // Update any other theme toggles
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            toggle.checked = isDark;
        });
    }

    // Attach event listeners to theme toggles
    function attachThemeListeners() {
        // Dark mode toggle in settings
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function() {
                toggleTheme();
            });
        }
        
        // Any elements with data-theme-toggle attribute
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                toggleTheme();
            });
        });
    }

    // Listen for system theme changes
    function watchSystemTheme() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const savedTheme = localStorage.getItem(THEME_KEY);
            if (!savedTheme) {
                const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
                applyTheme(newTheme);
                updateThemeToggles(newTheme);
            }
        });
    }

    // Public API
    window.ThemeSwitcher = {
        init: initTheme,
        toggle: toggleTheme,
        setTheme: applyTheme,
        getCurrentTheme: getCurrentTheme
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            attachThemeListeners();
            watchSystemTheme();
        });
    } else {
        initTheme();
        attachThemeListeners();
        watchSystemTheme();
    }

})();
