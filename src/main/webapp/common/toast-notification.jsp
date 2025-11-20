<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  ============================================================================
  EduHub - Centralized Toast Notification Component (iziToast)
  ============================================================================
  
  Purpose: 
    - Single source of truth for toast notifications across the entire application
    - Works in public pages, dashboard pages, and all other sections
    - Uses iziToast library for beautiful, modern toast notifications
  
  Usage:
    1. Include this component ONCE in your page:
       <jsp:include page="/common/toast-notification.jsp"/>
    
    2. Call toast functions in your JavaScript:
       showToast('Message', 'success');
       Toast.success('Operation successful!');
       Toast.error('An error occurred!');
       Toast.warning('Warning message!');
       Toast.info('Information message!');
  
  Toast Types:
    - success (green)
    - error/danger (red)
    - warning (yellow/orange)
    - info (blue)
    - question (purple)
    
  Dependencies:
    - iziToast (loaded from CDN)
    
  Location:
    /common/toast-notification.jsp
    /common/js/toast-notification.js
    /common/css/toast-notification.css
    
  Benefits of Centralization:
    ✓ Single file to maintain
    ✓ Consistent behavior across all pages
    ✓ Beautiful animations and modern UI
    ✓ Reduces code duplication
    ✓ Better performance (no duplicate loading)
    ✓ Mobile responsive with customizable positions
  ============================================================================
--%>

<!-- iziToast CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast@1.4.0/dist/css/iziToast.min.css">

<!-- iziToast JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/izitoast@1.4.0/dist/js/iziToast.min.js"></script>

<!-- Centralized Toast Notification JavaScript -->
<script src="${pageContext.request.contextPath}/common/js/toast-notification.js"></script>

<!-- Centralized Toast Notification Custom Styles -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/common/css/toast-notification.css">
