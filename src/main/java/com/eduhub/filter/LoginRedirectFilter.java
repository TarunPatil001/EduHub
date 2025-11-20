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
 * Login Redirect Filter - Prevents logged-in users from accessing login/register pages
 * Redirects them to dashboard if they try to access public auth pages
 */
@WebFilter(filterName = "LoginRedirectFilter", urlPatterns = {
    "/public/login.jsp",
    "/public/register_institute.jsp",
    "/public/register_admin.jsp"
})
public class LoginRedirectFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(LoginRedirectFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("LoginRedirectFilter initialized - Redirecting logged-in users away from auth pages");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Get session (don't create if doesn't exist)
        HttpSession session = httpRequest.getSession(false);
        
        // Check if user is already logged in
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);
        
        if (isLoggedIn) {
            // User is already logged in, redirect to dashboard
            String userEmail = (String) session.getAttribute("userEmail");
            logger.info("Logged-in user {} attempted to access auth page, redirecting to dashboard", userEmail);
            
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/dashboard.jsp");
        } else {
            // User is not logged in, allow access to auth pages
            chain.doFilter(request, response);
        }
    }
    
    @Override
    public void destroy() {
        logger.info("LoginRedirectFilter destroyed");
    }
}
