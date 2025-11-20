package com.eduhub.controller.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Servlet for handling user logout
 */
@WebServlet("/auth/logout")
public class LogoutServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(LogoutServlet.class);
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        handleLogout(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        handleLogout(request, response);
    }
    
    private void handleLogout(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        logger.info("========================================");
        logger.info("Logout request received from IP: {}", request.getRemoteAddr());
        logger.info("========================================");
        
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            // Get user info before invalidating session
            Integer userId = (Integer) session.getAttribute("userId");
            String userEmail = (String) session.getAttribute("userEmail");
            String userName = (String) session.getAttribute("userName");
            Integer instituteId = (Integer) session.getAttribute("instituteId");
            
            logger.info("User logout - Email: {}, ID: {}, Institute: {}", 
                userEmail, userId, instituteId);
            
            // Clear all session attributes first
            session.removeAttribute("user");
            session.removeAttribute("userId");
            session.removeAttribute("userEmail");
            session.removeAttribute("userName");
            session.removeAttribute("userRole");
            session.removeAttribute("instituteId");
            session.removeAttribute("redirectAfterLogin");
            
            // Invalidate session
            session.invalidate();
            
            logger.info("Session invalidated successfully for user: {} (ID: {})", userEmail, userId);
        } else {
            logger.warn("Logout attempted with no active session from IP: {}", request.getRemoteAddr());
        }
        
        // Set headers to prevent caching
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        
        // Redirect to login page with logout success message
        response.sendRedirect(request.getContextPath() + "/public/login.jsp?logout=success");
    }
}
