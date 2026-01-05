package com.eduhub.controller.auth;

import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.Institute;
import com.eduhub.model.User;
import com.eduhub.util.GoogleAuthUtil;
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
import java.util.UUID;

@WebServlet("/auth/google/callback")
public class GoogleCallbackServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(GoogleCallbackServlet.class);
    private UserDAO userDAO;
    private InstituteDAO instituteDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAOImpl();
        instituteDAO = new InstituteDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String code = request.getParameter("code");
        String error = request.getParameter("error");

        if (error != null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=" + URLEncoder.encode("Google login cancelled", "UTF-8"));
            return;
        }

        try {
            // Exchange code for token
            String accessToken = GoogleAuthUtil.getAccessToken(code);
            if (accessToken == null) {
                response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=" + URLEncoder.encode("Failed to authenticate with Google", "UTF-8"));
                return;
            }

            // Get User Info
            GoogleAuthUtil.GoogleUser googleUser = GoogleAuthUtil.getUserInfo(accessToken);
            
            // Check if user exists in DB
            User user = userDAO.getUserByEmail(googleUser.email);

            HttpSession session = request.getSession();

            if (user != null) {
                // User exists - Log them in
                if (!"active".equalsIgnoreCase(user.getStatus()) && !"pending_setup".equalsIgnoreCase(user.getStatus())) {
                    response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=" + URLEncoder.encode("Account is inactive", "UTF-8"));
                    return;
                }
                
                createSession(session, user);
                
                if ("pending_setup".equalsIgnoreCase(user.getStatus())) {
                    response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?message=setup_required");
                } else {
                    response.sendRedirect(request.getContextPath() + "/dashboard.jsp");
                }
                
            } else {
                // New User - Auto-Register as Pending Admin
                
                // 1. Check if Institute exists for this email, otherwise create one
                Institute institute = instituteDAO.getInstituteByEmail(googleUser.email);
                String instituteId;
                
                if (institute != null) {
                    // Institute exists, use it
                    instituteId = institute.getInstituteId();
                    logger.info("Found existing institute for email {}: {}", googleUser.email, instituteId);
                } else {
                    // Create Placeholder Institute
                    institute = new Institute();
                    instituteId = UUID.randomUUID().toString();
                    institute.setInstituteId(instituteId);
                    institute.setInstituteName("Pending Setup"); // Placeholder
                    institute.setInstituteEmail(googleUser.email); // Temporary
                    institute.setInstituteType("School"); // Default
                    institute.setAddress("Pending");
                    institute.setCity("Pending");
                    institute.setState("Pending");
                    institute.setZipCode("00000");
                    institute.setCountry("Pending");
                    institute.setInstitutePhone("0000000000");
                    
                    instituteDAO.createInstitute(institute);
                    logger.info("Created new placeholder institute for email {}: {}", googleUser.email, instituteId);
                }
                
                // 2. Create User
                user = new User();
                user.setUserId(UUID.randomUUID().toString());
                user.setInstituteId(instituteId);
                user.setFullName(googleUser.name);
                user.setEmail(googleUser.email);
                user.setPasswordHash("GOOGLE_AUTH");
                user.setRole("admin");
                user.setStatus("pending_setup"); // Mark as pending
                user.setProfilePhotoUrl(googleUser.picture);
                // Set auth_provider='google' in DB logic if column exists
                
                userDAO.createUser(user);
                
                createSession(session, user);
                
                // Redirect to Settings to complete profile
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?message=setup_required");
            }

        } catch (Exception e) {
            logger.error("Google callback error", e);
            response.sendRedirect(request.getContextPath() + "/public/login.jsp?error=" + URLEncoder.encode("System error", "UTF-8"));
        }
    }

    private void createSession(HttpSession session, User user) {
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userName", user.getFullName());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userRole", user.getRole());
        session.setAttribute("instituteId", user.getInstituteId());
        session.setAttribute("userStatus", user.getStatus());
    }
}
