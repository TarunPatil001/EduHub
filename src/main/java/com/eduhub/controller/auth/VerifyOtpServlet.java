package com.eduhub.controller.auth;

import com.eduhub.dao.impl.PasswordResetDAOImpl;
import com.eduhub.dao.interfaces.PasswordResetDAO;
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

@WebServlet("/auth/verify-otp")
public class VerifyOtpServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(VerifyOtpServlet.class);
    private PasswordResetDAO passwordResetDAO;

    @Override
    public void init() throws ServletException {
        passwordResetDAO = new PasswordResetDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("reset_user_id") == null) {
            response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
            return;
        }
        request.getRequestDispatcher("/public/verify-otp.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("reset_user_id") == null) {
            response.sendRedirect(request.getContextPath() + "/auth/forgot-password");
            return;
        }

        String userId = (String) session.getAttribute("reset_user_id");
        String otp = request.getParameter("otp");

        if (!ValidationUtil.isNotEmpty(otp)) {
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("Please enter OTP", "UTF-8"));
            return;
        }

        try {
            if (passwordResetDAO.validateOtp(userId, otp)) {
                // OTP Valid
                session.setAttribute("otp_verified", true);
                session.setAttribute("verified_otp", otp); // Store to mark as used later
                response.sendRedirect(request.getContextPath() + "/auth/reset-password");
            } else {
                response.sendRedirect(request.getContextPath() + 
                    "/auth/verify-otp?error=" + URLEncoder.encode("Invalid or expired OTP", "UTF-8"));
            }
        } catch (SQLException e) {
            logger.error("Database error verifying OTP", e);
            response.sendRedirect(request.getContextPath() + 
                "/auth/verify-otp?error=" + URLEncoder.encode("System error", "UTF-8"));
        }
    }
}
