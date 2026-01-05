package com.eduhub.controller.auth;

import com.eduhub.dao.impl.RememberMeDAOImpl;
import com.eduhub.dao.interfaces.RememberMeDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
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
    private RememberMeDAO rememberMeDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        rememberMeDAO = new RememberMeDAOImpl();
    }
    
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
            String userId = (String) session.getAttribute("userId");
            String userEmail = (String) session.getAttribute("userEmail");
            String userName = (String) session.getAttribute("userName");
            String instituteId = (String) session.getAttribute("instituteId");
            
            logger.info("User logout - Email: {}, ID: {}, Institute: {}", 
                userEmail, userId, instituteId);
            
            // Clear Remember Me cookie and token
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("remember_me".equals(cookie.getName())) {
                        try {
                            String[] parts = cookie.getValue().split(":");
                            if (parts.length == 2) {
                                String seriesId = parts[0];
                                rememberMeDAO.deleteToken(seriesId);
                            }
                        } catch (Exception e) {
                            logger.error("Error deleting Remember Me token", e);
                        }
                        
                        Cookie deleteCookie = new Cookie("remember_me", "");
                        deleteCookie.setMaxAge(0);
                        deleteCookie.setPath("/");
                        response.addCookie(deleteCookie);
                        break;
                    }
                }
            }

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
