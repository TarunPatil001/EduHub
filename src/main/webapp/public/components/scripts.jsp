<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  Reusable Scripts Component
  
  Purpose: 
    - Provides all JavaScript includes for every page
    - Bootstrap JS and custom scripts
  
  Usage Example:
    <jsp:include page="components/scripts.jsp"/>
--%>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

<!-- Theme Switcher (must load before other scripts) -->
<script src="${pageContext.request.contextPath}/dashboard/js/theme-switcher.js"></script>

<!-- Custom JS -->
<script type="text/javascript" src="${pageContext.request.contextPath}/public/js/script.js"></script>
