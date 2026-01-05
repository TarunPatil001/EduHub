package com.eduhub.controller.auth;

import com.eduhub.dao.impl.PasswordResetDAOImpl;
import com.eduhub.dao.interfaces.PasswordResetDAO;
import com.eduhub.service.impl.EmailServiceImpl;
import com.eduhub.service.interfaces.EmailService;
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

@WebServlet("/auth/resend-otp")
public class ResendOtpServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(ResendOtpServlet.class);
    private PasswordResetDAO passwordResetDAO;
    private EmailService emailService;

    @Override
    public void init() throws ServletException {
        passwordResetDAO = new PasswordResetDAOImpl();
        emailService = new EmailServiceImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("reset_user_id") == null || session.getAttribute("reset_email") == null) {
            response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
            return;
        }

        // Check Cooldown (60 seconds)
        Long lastSentTime = (Long) session.getAttribute("last_otp_sent_time");
        long currentTime = System.currentTimeMillis();
        
        if (lastSentTime != null && (currentTime - lastSentTime) < 60000) { // 60000 ms = 1 min
            long remainingSeconds = (60000 - (currentTime - lastSentTime)) / 1000;
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("Please wait " + remainingSeconds + " seconds before resending.", "UTF-8"));
            return;
        }

        // Rate Limiting: Max 3 attempts per 5 minutes, then 15 min block
        Long blockUntil = (Long) session.getAttribute("otp_block_until");
        if (blockUntil != null && currentTime < blockUntil) {
            long waitTime = (long) Math.ceil((blockUntil - currentTime) / 60000.0);
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("Too many attempts. Please try again in " + waitTime + " minutes.", "UTF-8"));
            return;
        }

        Long windowStart = (Long) session.getAttribute("otp_window_start");
        Integer requestCount = (Integer) session.getAttribute("otp_request_count");

        if (windowStart == null || (currentTime - windowStart) > 300000) { // 5 mins
            windowStart = currentTime;
            requestCount = 0;
            session.setAttribute("otp_window_start", windowStart);
            session.setAttribute("otp_request_count", 0);
            session.removeAttribute("otp_block_until");
        }

        if (requestCount >= 3) {
            blockUntil = currentTime + 900000; // 15 mins
            session.setAttribute("otp_block_until", blockUntil);
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("Too many attempts. Please try again in 15 minutes.", "UTF-8"));
            return;
        }

        String userId = (String) session.getAttribute("reset_user_id");
        String email = (String) session.getAttribute("reset_email");

        try {
            // Generate 6-digit OTP
            SecureRandom random = new SecureRandom();
            int otpNum = 100000 + random.nextInt(900000);
            String otp = String.valueOf(otpNum);
            
            // Generate Ref ID
            String refId = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Save OTP with Ref ID
            passwordResetDAO.saveOtp(userId, otp, refId);

            // Send Email with Ref ID
            boolean emailSent = emailService.sendPasswordResetOtp(email, otp, refId);

            if (emailSent) {
                session.setAttribute("otp_request_count", requestCount + 1);
                session.setAttribute("last_otp_sent_time", currentTime);
                response.sendRedirect(request.getContextPath() + 
                    "/auth/verify-otp?message=" + URLEncoder.encode("New code sent successfully!", "UTF-8"));
            } else {
                response.sendRedirect(request.getContextPath() + 
                    "/auth/verify-otp?error=" + URLEncoder.encode("Failed to send email. Try again.", "UTF-8"));
            }

        } catch (SQLException e) {
            logger.error("Database error during OTP resend", e);
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("System error occurred", "UTF-8"));
        }
    }
}
