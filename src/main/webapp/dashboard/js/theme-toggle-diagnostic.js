/**
 * Theme Toggle Diagnostic Script
 * Add this to any page to debug theme toggle issues
 */

console.log('%c🔍 Theme Toggle Diagnostic Started', 'color: #0D6EFD; font-size: 16px; font-weight: bold;');
console.log('='.repeat(50));

// Wait for DOM to be ready
setTimeout(function() {
    console.log('\n📋 DIAGNOSTIC REPORT:');
    console.log('='.repeat(50));
    
    // 1. Check if ThemeSwitcher API exists
    console.log('\n1️⃣ ThemeSwitcher API:');
    if (typeof ThemeSwitcher !== 'undefined') {
        console.log('   ✅ ThemeSwitcher API is available');
        console.log('   Current Theme:', ThemeSwitcher.getCurrentTheme());
    } else {
        console.log('   ❌ ThemeSwitcher API not found!');
        console.log('   → Check if theme-switcher.js is loaded');
    }
    
    // 2. Check navbar toggle button
    console.log('\n2️⃣ Navbar Toggle Button (#themeToggle):');
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        console.log('   ✅ Button found in DOM');
        console.log('   Element:', toggleBtn);
        
        // Check if it has click listener
        const hasListener = toggleBtn.onclick !== null || toggleBtn.hasAttribute('onclick');
        console.log('   Has direct onclick:', hasListener);
        
        // Try clicking programmatically
        console.log('   Testing programmatic click...');
        const beforeTheme = document.documentElement.getAttribute('data-theme');
        toggleBtn.click();
        setTimeout(function() {
            const afterTheme = document.documentElement.getAttribute('data-theme');
            if (beforeTheme !== afterTheme) {
                console.log('   ✅ Programmatic click works! Theme changed from', beforeTheme || 'light', 'to', afterTheme || 'light');
            } else {
                console.log('   ⚠️ Programmatic click did not change theme');
            }
        }, 50);
    } else {
        console.log('   ❌ Button NOT found in DOM!');
        console.log('   → Check if header.jsp is included');
        console.log('   → Verify button ID is "themeToggle"');
    }
    
    // 3. Check theme icon
    console.log('\n3️⃣ Theme Icon (#themeIcon):');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        console.log('   ✅ Icon found in DOM');
        console.log('   Current class:', themeIcon.className);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const expectedClass = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        if (themeIcon.className === expectedClass) {
            console.log('   ✅ Icon class is correct for current theme');
        } else {
            console.log('   ⚠️ Icon class mismatch. Expected:', expectedClass);
        }
    } else {
        console.log('   ❌ Icon NOT found in DOM!');
    }
    
    // 4. Check localStorage
    console.log('\n4️⃣ LocalStorage:');
    const savedTheme = localStorage.getItem('eduhub-theme');
    console.log('   eduhub-theme:', savedTheme || 'not set');
    
    // 5. Check data-theme attribute
    console.log('\n5️⃣ HTML data-theme attribute:');
    const dataTheme = document.documentElement.getAttribute('data-theme');
    console.log('   Current value:', dataTheme || 'not set (light mode)');
    
    // 6. Check event delegation
    console.log('\n6️⃣ Event Delegation Test:');
    console.log('   Click the navbar toggle button now...');
    console.log('   You should see "Header theme toggle clicked" in console');
    
    // 7. Summary
    console.log('\n📊 SUMMARY:');
    console.log('='.repeat(50));
    
    const issues = [];
    if (typeof ThemeSwitcher === 'undefined') issues.push('ThemeSwitcher API not loaded');
    if (!toggleBtn) issues.push('Toggle button not found');
    if (!themeIcon) issues.push('Theme icon not found');
    
    if (issues.length === 0) {
        console.log('%c✅ All checks passed! Theme toggle should be working.', 'color: #10B981; font-weight: bold;');
        console.log('\n💡 If toggle still not working:');
        console.log('   1. Try clicking the button and watch console');
        console.log('   2. Check browser console for JavaScript errors');
        console.log('   3. Verify theme-switcher.js is loaded (check Network tab)');
        console.log('   4. Clear browser cache and reload (Ctrl+Shift+R)');
    } else {
        console.log('%c❌ Issues found:', 'color: #EF4444; font-weight: bold;');
        issues.forEach(issue => console.log('   •', issue));
    }
    
    console.log('\n='.repeat(50));
    console.log('%c🔍 Diagnostic Complete', 'color: #0D6EFD; font-size: 16px; font-weight: bold;');
    
}, 500);

// Add click monitor
document.addEventListener('click', function(e) {
    const target = e.target.closest('#themeToggle');
    if (target) {
        console.log('%c👆 Theme toggle clicked!', 'color: #0D6EFD; font-weight: bold;');
        console.log('   Target:', e.target);
        console.log('   Current theme:', document.documentElement.getAttribute('data-theme') || 'light');
    }
}, true);
