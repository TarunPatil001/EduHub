<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  ============================================================================
  EduHub - Centralized Toast Notification Component (hot-toast)
  ============================================================================
  
  Purpose: 
    - Single source of truth for toast notifications across the entire application
    - Works in public pages, dashboard pages, and all other sections
    - Uses hot-toast library for beautiful, modern toast notifications
  
  Usage:
    1. Include this component ONCE in your page:
       <jsp:include page="/common/toast-notification.jsp"/>
    
    2. Call toast functions in your JavaScript:
       toast('Hello World!');
       toast.success('Operation successful!');
       toast.error('Something went wrong!');
       toast.loading('Processing...');
  
  Toast API:
    - toast(message, options) - Default toast
    - toast.success(message, options) - Success toast
    - toast.error(message, options) - Error toast
    - toast.loading(message, options) - Loading toast
    - toast.promise(promise, messages, options) - Promise handling
    - toast.dismiss(id?) - Dismiss specific or all toasts
    - toast.config(options) - Configure defaults
    
  Options:
    - icon: string (emoji or custom icon)
    - duration: number (ms, 0 = no auto-dismiss)
    - style: string (custom inline CSS)
    - className: string (custom CSS class)
    
  Positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    
  Dependencies:
    - hot-toast (loaded from CDN)
    
  Benefits:
    ✓ Ready to use - no additional setup needed
    ✓ Consistent behavior across all pages
    ✓ Beautiful animations and modern UI
    ✓ Automatically removes previous toasts (max 5)
    ✓ Mobile responsive with customizable positions
  ============================================================================
--%>

<!-- hot-toast CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v1.0.0/lib/toast.css">

<!-- hot-toast JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v1.0.0/lib/toast.js"></script>

<!-- Configure hot-toast -->
<script>
    // Configure toast with centralized settings
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof toast !== 'undefined' && typeof toast.config === 'function') {
            toast.config({
                position: 'top-center',    // Position of toasts
                duration: 4000,            // Duration in milliseconds
                maxToasts: 5,              // Maximum visible toasts
                reverseOrder: false        // Stack order (false = newest on top)
            });
        }
    });
</script>
