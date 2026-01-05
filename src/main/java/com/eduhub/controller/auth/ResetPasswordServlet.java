package com.eduhub.controller.auth;

import com.eduhub.dao.impl.PasswordResetDAOImpl;
import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.PasswordResetDAO;
import com.eduhub.dao.interfaces.UserDAO;
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
import java.sql.SQLException;

@WebServlet("/auth/reset-password")
public class ResetPasswordServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(ResetPasswordServlet.class);
    private UserDAO userDAO;
    private PasswordResetDAO passwordResetDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
        passwordResetDAO = new PasswordResetDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("otp_verified") == null) {
            response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
            return;
        }
        request.getRequestDispatcher("/public/reset-password.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("otp_verified") == null) {
            response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
            return;
        }

        String userId = (String) session.getAttribute("reset_user_id");
        String otp = (String) session.getAttribute("verified_otp");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        if (!ValidationUtil.isNotEmpty(password) || !password.equals(confirmPassword)) {
            response.sendRedirect(request.getContextPath() + 
                "/auth/reset-password?error=" + URLEncoder.encode("Passwords do not match", "UTF-8"));
            return;
        }

        try {
            // Hash new password
            String passwordHash = PasswordUtil.hashPassword(password);
            
            // Update User
            userDAO.updatePassword(userId, passwordHash);
            
            // Mark OTP as used
            passwordResetDAO.markOtpAsUsed(userId, otp);
            
            // Clear session
            session.invalidate();
            
            response.sendRedirect(request.getContextPath() + 
                "/public/login.jsp?message=" + URLEncoder.encode("Password reset successfully. Please login.", "UTF-8"));

        } catch (SQLException e) {
            logger.error("Database error resetting password", e);
            response.sendRedirect(request.getContextPath() + 
                "/auth/reset-password?error=" + URLEncoder.encode("System error", "UTF-8"));
        }
    }
}
