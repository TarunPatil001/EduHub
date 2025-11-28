<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- hot-toast CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v2.0.2/lib/toast.css">

<!-- hot-toast JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v2.0.2/lib/toast.js"></script>

<!-- Configure hot-toast -->
<script>
    (function() {
        const config = {
            position: 'top-center',
            duration: 4000,
            maxToasts: 5,
            reverseOrder: false,
            gutter: 12
        };

        // Try to configure immediately if library is loaded
        if (typeof toast !== 'undefined' && typeof toast.config === 'function') {
            toast.config(config);
        }

        // Also ensure it's configured on DOMContentLoaded (in case script loaded async or deferred)
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof toast !== 'undefined' && typeof toast.config === 'function') {
                toast.config(config);
            }

            // Check for pending toast messages from sessionStorage
            const pendingToast = sessionStorage.getItem('pendingToastType');
            if (pendingToast) {
                try {
                    const toastData = JSON.parse(pendingToast);
                    if (toastData && toastData.message && toastData.type) {
                        // Small delay to ensure UI is ready
                        setTimeout(() => {
                            if (typeof toast !== 'undefined' && toast[toastData.type]) {
                                toast[toastData.type](toastData.message);
                            }
                        }, 300);
                    }
                } catch (e) {
                    console.error('Error parsing pending toast:', e);
                }
                // Clear the message so it doesn't show again
                sessionStorage.removeItem('pendingToastType');
            }
        });
    })();
</script>