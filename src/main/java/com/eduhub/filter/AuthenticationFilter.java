package com.eduhub.filter;

import com.eduhub.dao.impl.RememberMeDAOImpl;
import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.RememberMeDAO;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.RememberMeToken;
import com.eduhub.model.User;
import com.eduhub.util.PasswordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Base64;

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
    private RememberMeDAO rememberMeDAO;
    private UserDAO userDAO;
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        rememberMeDAO = new RememberMeDAOImpl();
        userDAO = new UserDAOImpl();
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

        // Check for Remember Me cookie if not logged in
        if (!isLoggedIn) {
            Cookie[] cookies = httpRequest.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("remember_me".equals(cookie.getName())) {
                        try {
                            String[] parts = cookie.getValue().split(":");
                            if (parts.length == 2) {
                                String seriesId = parts[0];
                                String token = parts[1];

                                RememberMeToken rememberToken = rememberMeDAO.getToken(seriesId);
                                if (rememberToken != null) {
                                    if (rememberToken.getExpiryTime().after(new Timestamp(System.currentTimeMillis()))) {
                                        if (PasswordUtil.verifyPassword(token, rememberToken.getTokenHash())) {
                                            // Valid token, log user in
                                            User user = userDAO.getUserById(rememberToken.getUserId());
                                            if (user != null && "active".equalsIgnoreCase(user.getStatus())) {
                                                session = httpRequest.getSession(true);
                                                session.setAttribute("user", user);
                                                session.setAttribute("userId", user.getUserId());
                                                session.setAttribute("userEmail", user.getEmail());
                                                session.setAttribute("userName", user.getFullName());
                                                session.setAttribute("userRole", user.getRole());
                                                session.setAttribute("instituteId", user.getInstituteId());
                                                session.setAttribute("userPhotoUrl", user.getProfilePhotoUrl());
                                                session.setMaxInactiveInterval(7 * 24 * 60 * 60);

                                                // Rotate token
                                                SecureRandom random = new SecureRandom();
                                                byte[] newTokenBytes = new byte[16];
                                                random.nextBytes(newTokenBytes);
                                                String newToken = Base64.getUrlEncoder().withoutPadding().encodeToString(newTokenBytes);
                                                String newTokenHash = PasswordUtil.hashPassword(newToken);
                                                
                                                rememberMeDAO.updateToken(seriesId, newTokenHash, new Timestamp(System.currentTimeMillis()));
                                                
                                                // Update cookie
                                                Cookie newCookie = new Cookie("remember_me", seriesId + ":" + newToken);
                                                newCookie.setMaxAge(30 * 24 * 60 * 60);
                                                newCookie.setPath("/");
                                                newCookie.setHttpOnly(true);
                                                
                                                // Auto-detect HTTPS
                                                if (httpRequest.isSecure() || "https".equalsIgnoreCase(httpRequest.getHeader("X-Forwarded-Proto"))) {
                                                    newCookie.setSecure(true);
                                                }
                                                
                                                httpResponse.addCookie(newCookie);
                                                
                                                isLoggedIn = true;
                                                logger.info("User {} logged in via Remember Me", user.getEmail());
                                            }
                                        } else {
                                            // Invalid token (possible theft), delete it
                                            rememberMeDAO.deleteToken(seriesId);
                                            logger.warn("Invalid Remember Me token for series: {}", seriesId);
                                            
                                            // Clear cookie
                                            Cookie deleteCookie = new Cookie("remember_me", "");
                                            deleteCookie.setMaxAge(0);
                                            deleteCookie.setPath("/");
                                            httpResponse.addCookie(deleteCookie);
                                        }
                                    } else {
                                        // Expired
                                        rememberMeDAO.deleteToken(seriesId);
                                    }
                                }
                            }
                        } catch (Exception e) {
                            logger.error("Error processing Remember Me cookie", e);
                        }
                    }
                }
            }
        }
        
        if (isLoggedIn) {
            // User is authenticated
            String userId = (String) session.getAttribute("userId");
            String userEmail = (String) session.getAttribute("userEmail");
            String instituteId = (String) session.getAttribute("instituteId");
            String userStatus = (String) session.getAttribute("userStatus");
            
            logger.debug("Authenticated user {} (ID: {}, Institute: {}, Status: {}) accessing: {}", 
                userEmail, userId, instituteId, userStatus, requestURI);

            // Check for Pending Setup Status
            if ("pending_setup".equalsIgnoreCase(userStatus)) {
                // Allow access to settings page, static resources, and update APIs
                boolean isAllowed = requestURI.contains("/dashboard/pages/settings.jsp") ||
                                    requestURI.contains("/dashboard/components/") ||
                                    requestURI.contains("/dashboard/css/") ||
                                    requestURI.contains("/dashboard/js/") ||
                                    requestURI.contains("/api/institute/") ||
                                    requestURI.contains("/api/user/update") ||
                                    requestURI.contains("/auth/logout");
                
                if (!isAllowed) {
                    httpResponse.sendRedirect(contextPath + "/dashboard/pages/settings.jsp?message=setup_required");
                    return;
                }
            }
            
            // Set security headers
            httpResponse.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            httpResponse.setHeader("Pragma", "no-cache");
            httpResponse.setDateHeader("Expires", 0);
            
            chain.doFilter(request, response);
        } else {
            // User is not authenticated, redirect to login
            logger.warn("Unauthorized access attempt to: {} from IP: {}", 
                requestURI, httpRequest.getRemoteAddr());
            
            // Check if request is for a static resource
            boolean isStaticResource = requestURI.toLowerCase().matches(".*\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$");

            if (isStaticResource) {
                // For static resources, send 401 instead of redirecting to login page
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

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
