package com.eduhub.controller.auth;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.impl.RememberMeDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.dao.interfaces.RememberMeDAO;
import com.eduhub.model.User;
import com.eduhub.model.RememberMeToken;
import com.eduhub.util.PasswordUtil;
import com.eduhub.util.ValidationUtil;
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
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Base64;

/**
 * Servlet for handling user authentication (login)
 */
@WebServlet("/auth/login")
public class LoginServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(LoginServlet.class);
    private UserDAO userDAO;
    private RememberMeDAO rememberMeDAO;
    
    @Override
    public void init() throws ServletException {
        super.init();
        userDAO = new UserDAOImpl();
        rememberMeDAO = new RememberMeDAOImpl();
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
            if ("GOOGLE_AUTH".equals(user.getPasswordHash())) {
                logger.warn("Login failed: User {} has GOOGLE_AUTH password hash", username);
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?error=" + 
                    URLEncoder.encode("Please sign in with Google.", "UTF-8"));
                return;
            }

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
            session.setAttribute("userPhotoUrl", user.getProfilePhotoUrl()); // Add photo URL to session
            session.setMaxInactiveInterval(7 * 24 * 60 * 60);  // 7 days
            
            logger.info("Login successful for user: {} (ID: {}, Role: {}, Institute: {})", 
                user.getEmail(), user.getUserId(), user.getRole(), user.getInstituteId());
            
            // Update last login timestamp
            try {
                userDAO.updateLastLogin(user.getUserId());
            } catch (Exception e) {
                logger.error("Failed to update last login for user: {}", user.getUserId(), e);
                // Don't fail the login if this fails
            }

            // Handle "Remember Me"
            String rememberMe = request.getParameter("remember");
            if ("on".equals(rememberMe)) {
                try {
                    SecureRandom random = new SecureRandom();
                    byte[] seriesBytes = new byte[16];
                    random.nextBytes(seriesBytes);
                    String seriesId = Base64.getUrlEncoder().withoutPadding().encodeToString(seriesBytes);

                    byte[] tokenBytes = new byte[16];
                    random.nextBytes(tokenBytes);
                    String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

                    String tokenHash = PasswordUtil.hashPassword(token);

                    RememberMeToken rememberToken = new RememberMeToken();
                    rememberToken.setSeriesId(seriesId);
                    rememberToken.setUserId(user.getUserId());
                    rememberToken.setTokenHash(tokenHash);
                    rememberToken.setExpiryTime(new Timestamp(System.currentTimeMillis() + (30L * 24 * 60 * 60 * 1000))); // 30 days

                    rememberMeDAO.saveToken(rememberToken);

                    Cookie cookie = new Cookie("remember_me", seriesId + ":" + token);
                    cookie.setMaxAge(30 * 24 * 60 * 60); // 30 days
                    cookie.setPath("/");
                    cookie.setHttpOnly(true);
                    
                    // Auto-detect HTTPS: Sets secure flag only if running on HTTPS (Production)
                    // Works on Localhost (HTTP) automatically
                    if (request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"))) {
                        cookie.setSecure(true);
                    }
                    
                    response.addCookie(cookie);
                    
                    logger.info("Remember Me token created for user: {}", user.getUserId());
                } catch (Exception e) {
                    logger.error("Failed to create Remember Me token", e);
                }
            }
            
            // Check if there's a redirect URL (user tried to access protected page before login)
            String redirectAfterLogin = (String) session.getAttribute("redirectAfterLogin");
            if (redirectAfterLogin != null && !redirectAfterLogin.isEmpty()) {
                session.removeAttribute("redirectAfterLogin");
                logger.info("Redirecting user to originally requested page: {}", redirectAfterLogin);
                response.sendRedirect(redirectAfterLogin);
            } else {
                // Default redirect to dashboard
                response.sendRedirect(request.getContextPath() + "/dashboard?success=login");
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
