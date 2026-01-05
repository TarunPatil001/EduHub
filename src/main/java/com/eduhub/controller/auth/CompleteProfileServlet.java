package com.eduhub.controller.auth;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
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
import java.util.UUID;

@WebServlet("/auth/complete-profile")
public class CompleteProfileServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(CompleteProfileServlet.class);
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("google_user_email") == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        String email = (String) session.getAttribute("google_user_email");
        String name = (String) session.getAttribute("google_user_name");
        String picture = (String) session.getAttribute("google_user_picture");
        
        String role = request.getParameter("role");
        String instituteId = request.getParameter("instituteId");
        String phone = request.getParameter("phone");

        // Basic Validation
        if (!ValidationUtil.isNotEmpty(role) || !ValidationUtil.isNotEmpty(instituteId)) {
            response.sendRedirect(request.getContextPath() + "/public/complete-profile.jsp?error=" + URLEncoder.encode("All fields are required", "UTF-8"));
            return;
        }

        try {
            User user = new User();
            user.setUserId(UUID.randomUUID().toString());
            user.setInstituteId(instituteId);
            user.setFullName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setRole(role);
            user.setProfilePhotoUrl(picture);
            user.setPasswordHash("GOOGLE_AUTH"); // Placeholder, or generate random
            // Note: In real app, we should set auth_provider='google' in DB
            
            userDAO.createUser(user);
            
            // Login
            session.setAttribute("user", user);
            session.setAttribute("role", role);
            
            // Cleanup session
            session.removeAttribute("google_user_email");
            session.removeAttribute("google_user_name");
            session.removeAttribute("google_user_picture");
            
            response.sendRedirect(request.getContextPath() + "/dashboard.jsp");

        } catch (Exception e) {
            logger.error("Failed to complete profile", e);
            response.sendRedirect(request.getContextPath() + "/public/complete-profile.jsp?error=" + URLEncoder.encode("Registration failed. Check Institute ID.", "UTF-8"));
        }
    }
}
