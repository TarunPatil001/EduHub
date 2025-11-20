package com.eduhub.controller.auth;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
import com.eduhub.util.PasswordUtil;
import com.eduhub.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;

/**
 * Servlet for handling user authentication (login)
 */
@WebServlet("/auth/login")
public class LoginServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(LoginServlet.class);
    private UserDAO userDAO;
    
    @Override
    public void init() throws ServletException {
        super.init();
        userDAO = new UserDAOImpl();
        logger.info("LoginServlet initialized");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        logger.info("========================================");
        logger.info("Login request received from IP: {}", request.getRemoteAddr());
        logger.info("========================================");
        
        try {
            // Get and sanitize credentials
            String username = ValidationUtil.sanitizeInput(request.getParameter("username"));
            String password = request.getParameter("password"); // Don't sanitize password
            
            logger.info("Login attempt for username: {}", username);
            
            // Validate required fields
            if (!ValidationUtil.isNotEmpty(username) || !ValidationUtil.isNotEmpty(password)) {
                logger.warn("Login failed: Missing username or password");
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Please enter both username and password", "UTF-8"));
                return;
            }
            
            // Validate email format
            if (!ValidationUtil.isValidEmail(username)) {
                logger.warn("Login failed: Invalid email format - {}", username);
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Please enter a valid email address", "UTF-8"));
                return;
            }
            
            // Get user by email
            logger.info("Attempting to find user with email: {}", username);
            User user = userDAO.getUserByEmail(username);
            
            // Check if user exists
            if (user == null) {
                logger.warn("Login failed: User not found - {}", username);
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Invalid email or password.", "UTF-8"));
                return;
            }
            
            // Verify password using BCrypt
            if (!PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
                logger.warn("Login failed: Invalid password for user - {}", username);
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Invalid email or password.", "UTF-8"));
                return;
            }
            
            // Check if user is active
            if (!"active".equalsIgnoreCase(user.getStatus())) {
                logger.warn("Login failed: User account is inactive - Status: {}", user.getStatus());
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Your account is not active. Please contact support.", "UTF-8"));
                return;
            }
            
            // Login successful - create session
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userName", user.getFullName());
            session.setAttribute("userRole", user.getRole());
            session.setAttribute("instituteId", user.getInstituteId());
            session.setMaxInactiveInterval(30 * 60); // 30 minutes
            
            logger.info("Login successful for user: {} (ID: {}, Role: {}, Institute: {})", 
                user.getEmail(), user.getUserId(), user.getRole(), user.getInstituteId());
            
            // Update last login timestamp
            try {
                userDAO.updateLastLogin(user.getUserId());
            } catch (Exception e) {
                logger.error("Failed to update last login for user: {}", user.getUserId(), e);
                // Don't fail the login if this fails
            }
            
            // Check if there's a redirect URL (user tried to access protected page before login)
            String redirectAfterLogin = (String) session.getAttribute("redirectAfterLogin");
            if (redirectAfterLogin != null && !redirectAfterLogin.isEmpty()) {
                session.removeAttribute("redirectAfterLogin");
                logger.info("Redirecting user to originally requested page: {}", redirectAfterLogin);
                response.sendRedirect(redirectAfterLogin);
            } else {
                // Default redirect to dashboard
                response.sendRedirect(request.getContextPath() + "/dashboard.jsp?success=login");
            }
            
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
            response.sendRedirect(request.getContextPath() + 
                "/public/login.jsp?error=" + 
                URLEncoder.encode("An unexpected error occurred. Please try again later.", "UTF-8"));
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Redirect GET requests to login page
        response.sendRedirect(request.getContextPath() + "/public/login.jsp");
    }
}
