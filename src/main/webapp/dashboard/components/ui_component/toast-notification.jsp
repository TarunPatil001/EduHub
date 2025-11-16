<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Toast Notification Component
  
  Purpose: 
    - Provides toast notifications for user feedback
    - Can be used across all dashboard pages
  
  Usage:
    Include this component in your page and call showToast() function
    
    Example:
    showToast('Operation successful!', 'success');
    showToast('An error occurred!', 'danger');
    showToast('Please wait...', 'info');
    showToast('Warning message!', 'warning');
    
  Types:
    - success (green)
    - danger (red)
    - warning (yellow/orange)
    - info (blue)
    - primary (blue)
    - secondary (gray)
--%>

<!-- Toast Container -->
<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <!-- Toasts will be dynamically added here -->
</div>

<script src="${pageContext.request.contextPath}/dashboard/components/js/toast-notification.js"></script>

<style>
    /* Toast Enhancements */
    .toast-container {
        max-width: 350px;
    }
    
    .toast {
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .toast-body {
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .toast .btn-close {
        padding: 0.5rem;
    }
    
    /* Custom toast types with icons */
    .toast-with-icon .toast-body {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .toast-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    /* Success Toast */
    .bg-success .toast-icon::before {
        content: '\f26b'; /* Bootstrap icon check-circle-fill */
        font-family: 'bootstrap-icons';
    }
    
    /* Danger Toast */
    .bg-danger .toast-icon::before {
        content: '\f338'; /* Bootstrap icon x-circle-fill */
        font-family: 'bootstrap-icons';
    }
    
    /* Warning Toast */
    .bg-warning .toast-icon::before {
        content: '\f33a'; /* Bootstrap icon exclamation-triangle-fill */
        font-family: 'bootstrap-icons';
    }
    
    /* Info Toast */
    .bg-info .toast-icon::before {
        content: '\f431'; /* Bootstrap icon info-circle-fill */
        font-family: 'bootstrap-icons';
    }
    
    /* Toast progress bar */
    .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background-color: rgba(255, 255, 255, 0.7);
        animation: toastProgress 5s linear forwards;
    }
    
    @keyframes toastProgress {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
</style>
