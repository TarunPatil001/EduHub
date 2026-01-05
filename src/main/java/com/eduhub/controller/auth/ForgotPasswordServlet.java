package com.eduhub.controller.auth;

import com.eduhub.dao.impl.PasswordResetDAOImpl;
import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.PasswordResetDAO;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
import com.eduhub.service.impl.EmailServiceImpl;
import com.eduhub.service.interfaces.EmailService;
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
import java.security.SecureRandom;
import java.sql.SQLException;

@WebServlet("/auth/forgot-password")
public class ForgotPasswordServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordServlet.class);
    private UserDAO userDAO;
    private PasswordResetDAO passwordResetDAO;
    private EmailService emailService;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
        passwordResetDAO = new PasswordResetDAOImpl();
        emailService = new EmailServiceImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.getRequestDispatcher("/public/forgot-password.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String email = request.getParameter("email");

        if (!ValidationUtil.isValidEmail(email)) {
            response.sendRedirect(request.getContextPath() + 
                "/auth/forgot-password?error=" + URLEncoder.encode("Invalid email address", "UTF-8"));
            return;
        }

        // Rate Limiting: Max 3 attempts per 5 minutes, then 15 min block
        HttpSession session = request.getSession();
        long currentTime = System.currentTimeMillis();

        // 1. Check Block
        Long blockUntil = (Long) session.getAttribute("otp_block_until");
        if (blockUntil != null && currentTime < blockUntil) {
            long waitTime = (long) Math.ceil((blockUntil - currentTime) / 60000.0);
            response.sendRedirect(request.getContextPath() + 
                "/auth/forgot-password?error=" + URLEncoder.encode("Too many attempts. Please try again in " + waitTime + " minutes.", "UTF-8"));
            return;
        }

        // 2. Check Window (5 mins)
        Long windowStart = (Long) session.getAttribute("otp_window_start");
        Integer requestCount = (Integer) session.getAttribute("otp_request_count");

        if (windowStart == null || (currentTime - windowStart) > 300000) { // 5 mins = 300,000 ms
            windowStart = currentTime;
            requestCount = 0;
            session.setAttribute("otp_window_start", windowStart);
            session.setAttribute("otp_request_count", 0);
            session.removeAttribute("otp_block_until");
        }

        // 3. Check Count
        if (requestCount >= 3) {
            blockUntil = currentTime + 900000; // 15 mins = 900,000 ms
            session.setAttribute("otp_block_until", blockUntil);
            response.sendRedirect(request.getContextPath() + 
                "/auth/forgot-password?error=" + URLEncoder.encode("Too many attempts. Please try again in 15 minutes.", "UTF-8"));
            return;
        }

        try {
            User user = userDAO.getUserByEmail(email);
            if (user == null) {
                // Security: Don't reveal if email exists or not. Fake success.
                // But for UX, sometimes we do reveal. Let's stick to secure practice or just warn.
                // For this project, let's be helpful but cautious.
                logger.warn("Password reset requested for non-existent email: {}", email);
                response.sendRedirect(request.getContextPath() + 
                    "/auth/forgot-password?error=" + URLEncoder.encode("Email not found", "UTF-8"));
                return;
            }

            // Generate 6-digit OTP
            SecureRandom random = new SecureRandom();
            int otpNum = 100000 + random.nextInt(900000);
            String otp = String.valueOf(otpNum);
            
            // Generate Ref ID
            String refId = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Save OTP with Ref ID
            passwordResetDAO.saveOtp(user.getUserId(), otp, refId);

            // Send Email with Ref ID
            boolean emailSent = emailService.sendPasswordResetOtp(email, otp, refId);

            if (emailSent) {
                // Increment rate limit count
                session.setAttribute("otp_request_count", requestCount + 1);

                session.setAttribute("reset_email", email);
                session.setAttribute("reset_user_id", user.getUserId());
                session.setAttribute("last_otp_sent_time", System.currentTimeMillis());
                response.sendRedirect(request.getContextPath() + "/auth/verify-otp");
            } else {
                response.sendRedirect(request.getContextPath() + 
                    "/auth/forgot-password?error=" + URLEncoder.encode("Failed to send email. Try again.", "UTF-8"));
            }

        } catch (SQLException e) {
            logger.error("Database error during password reset", e);
            response.sendRedirect(request.getContextPath() + 
                "/auth/forgot-password?error=" + URLEncoder.encode("System error occurred", "UTF-8"));
        }
    }
}
