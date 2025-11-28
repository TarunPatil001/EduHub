package com.eduhub.controller.api;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
import com.eduhub.util.PasswordUtil;
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
import java.sql.SQLException;

@WebServlet("/api/users/changePassword")
public class ChangePasswordServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(ChangePasswordServlet.class);
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        String userId = null;

        if (session != null) {
            userId = (String) session.getAttribute("userId");
        }

        // Fallback or if session is not used, get from request parameter
        if (userId == null || userId.isEmpty()) {
            userId = request.getParameter("userId");
        }

        if (userId == null || userId.isEmpty()) {
            logger.warn("Change password attempt without user identification (no session or userId parameter).");
            response.sendRedirect(request.getContextPath() + "/public/login.jsp?status=error&message=" + URLEncoder.encode("Your session has expired. Please log in again.", "UTF-8"));
            return;
        }

        String currentPassword = request.getParameter("currentPassword");
        String newPassword = request.getParameter("newPassword");
        String confirmPassword = request.getParameter("confirmPassword");

        // Basic validation
        if (currentPassword == null || newPassword == null || confirmPassword == null ||
            currentPassword.isEmpty() || newPassword.isEmpty() || confirmPassword.isEmpty()) {
            logger.warn("Change password failed: Missing fields for user {}", userId);
            redirectWithError(request, response, "All fields are required.");
            return;
        }

        if (!newPassword.equals(confirmPassword)) {
            logger.warn("Change password failed: Passwords do not match for user {}", userId);
            redirectWithError(request, response, "New passwords do not match.");
            return;
        }

        // Password complexity regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!newPassword.matches(passwordRegex)) {
            logger.warn("Change password failed: Password for user {} does not meet complexity requirements.", userId);
            redirectWithError(request, response, "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.");
            return;
        }

        try {
            // Verify current password
            User dbUser = userDAO.getUserById(userId);
            
            if (dbUser == null) {
                 logger.error("Change password failed: User not found in DB for ID {}", userId);
                 redirectWithError(request, response, "User not found. Your session may be invalid.");
                 return;
            }

            if (!PasswordUtil.verifyPassword(currentPassword, dbUser.getPasswordHash())) {
                logger.warn("Change password failed: Incorrect current password for user {}", userId);
                redirectWithError(request, response, "The current password you entered is incorrect.");
                return;
            }

            // Update password
            String newPasswordHash = PasswordUtil.hashPassword(newPassword);
            boolean success = userDAO.updatePassword(userId, newPasswordHash);

            if (success) {
                logger.info("Password updated successfully for user {}", userId);
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?section=security-section&status=success&message=" + URLEncoder.encode("Password updated successfully.", "UTF-8"));
            } else {
                logger.error("Change password failed: Database update returned false for user {}", userId);
                redirectWithError(request, response, "An unexpected error occurred while updating the password. Please try again.");
            }

        } catch (SQLException e) {
            logger.error("Database error during password change for user {}", userId, e);
            redirectWithError(request, response, "A database error occurred. Please contact support.");
        } catch (Exception e) {
            logger.error("An unexpected error occurred during password change for user {}", userId, e);
            redirectWithError(request, response, "An unexpected error occurred. Please try again.");
        }
    }

    private void redirectWithError(HttpServletRequest request, HttpServletResponse response, String message) throws IOException {
        response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?section=security-section&status=error&message=" + URLEncoder.encode(message, "UTF-8"));
    }
}
