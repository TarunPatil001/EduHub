package com.eduhub.controller;

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
import java.sql.SQLException;

@WebServlet("/api/user/update-password")
public class UserPasswordUpdateServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(UserPasswordUpdateServlet.class);
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=unauthorized");
            return;
        }

        String userId = request.getParameter("userId");
        String currentUserId = (String) session.getAttribute("userId");

        if (!currentUserId.equals(userId)) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Unauthorized+action&section=security-section");
            return;
        }

        String newPassword = request.getParameter("newPassword");
        String confirmPassword = request.getParameter("confirmPassword");
        String isGoogleAuth = request.getParameter("isGoogleAuth");

        if (newPassword == null || !newPassword.equals(confirmPassword)) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Passwords+do+not+match&section=security-section");
            return;
        }

        try {
            User user = userDAO.getUserById(userId);
            if (user == null) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=User+not+found&section=security-section");
                return;
            }

            // If NOT Google Auth, verify current password
            if (!"true".equals(isGoogleAuth)) {
                String currentPassword = request.getParameter("currentPassword");
                if (currentPassword == null || !PasswordUtil.verifyPassword(currentPassword, user.getPasswordHash())) {
                    response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Incorrect+current+password&section=security-section");
                    return;
                }
            } else {
                // Double check that user actually has GOOGLE_AUTH hash to prevent bypass
                if (!"GOOGLE_AUTH".equals(user.getPasswordHash())) {
                     response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Security+check+failed&section=security-section");
                     return;
                }
            }

            // Update Password
            String hashedPassword = PasswordUtil.hashPassword(newPassword);
            boolean success = userDAO.updatePassword(userId, hashedPassword);

            if (success) {
                logger.info("Password updated for user: {}", userId);
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=success&message=Password+updated+successfully&section=security-section");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Failed+to+update+password&section=security-section");
            }

        } catch (SQLException e) {
            logger.error("Database error updating password", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Database+error&section=security-section");
        }
    }
}
