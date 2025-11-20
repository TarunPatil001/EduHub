package com.eduhub.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Authentication Filter - Protects all pages requiring login
 * Checks if user is logged in before allowing access to protected resources
 */
@WebFilter(filterName = "AuthenticationFilter", urlPatterns = {
    "/dashboard.jsp",
    "/dashboard/*"
})
public class AuthenticationFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("AuthenticationFilter initialized - Protecting dashboard and related pages");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Get the requested URI
        String requestURI = httpRequest.getRequestURI();
        String contextPath = httpRequest.getContextPath();
        
        logger.debug("Authentication check for: {}", requestURI);
        
        // Get session (don't create if doesn't exist)
        HttpSession session = httpRequest.getSession(false);
        
        // Check if user is logged in
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);
        
        if (isLoggedIn) {
            // User is authenticated, allow access
            Integer userId = (Integer) session.getAttribute("userId");
            String userEmail = (String) session.getAttribute("userEmail");
            Integer instituteId = (Integer) session.getAttribute("instituteId");
            
            logger.debug("Authenticated user {} (ID: {}, Institute: {}) accessing: {}", 
                userEmail, userId, instituteId, requestURI);
            
            // Set security headers
            httpResponse.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            httpResponse.setHeader("Pragma", "no-cache");
            httpResponse.setDateHeader("Expires", 0);
            
            chain.doFilter(request, response);
        } else {
            // User is not authenticated, redirect to login
            logger.warn("Unauthorized access attempt to: {} from IP: {}", 
                requestURI, httpRequest.getRemoteAddr());
            
            // Store the original requested URL to redirect back after login
            String originalURL = requestURI;
            String queryString = httpRequest.getQueryString();
            if (queryString != null) {
                originalURL += "?" + queryString;
            }
            httpRequest.getSession(true).setAttribute("redirectAfterLogin", originalURL);
            
            // Redirect to login with error message
            httpResponse.sendRedirect(contextPath + "/public/login.jsp?error=unauthorized&redirect=" + 
                java.net.URLEncoder.encode(originalURL, "UTF-8"));
        }
    }
    
    @Override
    public void destroy() {
        logger.info("AuthenticationFilter destroyed");
    }
}
