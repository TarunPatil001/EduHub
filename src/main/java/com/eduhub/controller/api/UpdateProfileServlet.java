package com.eduhub.controller.api;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;
import com.eduhub.service.impl.RegistrationServiceImpl;
import com.eduhub.service.interfaces.RegistrationService;
import com.eduhub.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.nio.file.Paths;

@WebServlet("/api/users/updateProfile")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2,  // 2MB
    maxFileSize = 1024 * 1024 * 10, // 10MB
    maxRequestSize = 1024 * 1024 * 50 // 50MB
)
public class UpdateProfileServlet extends HttpServlet {

    private static final Logger logger = LoggerFactory.getLogger(UpdateProfileServlet.class);
    private UserDAO userDAO;
    private RegistrationService registrationService;

    @Override
    public void init() throws ServletException {
        super.init();
        userDAO = new UserDAOImpl();
        registrationService = new RegistrationServiceImpl();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
            String userId = request.getParameter("userId");
            String fullName = request.getParameter("fullName");
            String phone = request.getParameter("phone");
            String section = request.getParameter("section");
            if (section == null || section.isEmpty()) {
                section = "admin-accounts-section";
            }

            if (!ValidationUtil.isNotEmpty(userId)) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=User+ID+is+missing&section=" + section + "#" + section);
                return;
            }

            // Security Check: Ensure the logged-in user is updating their own profile
            String sessionUserId = (String) request.getSession().getAttribute("userId");
            if (sessionUserId == null || !sessionUserId.equals(userId)) {
                logger.warn("Unauthorized profile update attempt. Session User: {}, Request User: {}", sessionUserId, userId);
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Unauthorized+access&section=" + section + "#" + section);
                return;
            }

            User user = userDAO.getUserById(userId);

            if (user == null) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=User+not+found&section=" + section + "#" + section);
                return;
            }

            // Update fields
            user.setFullName(ValidationUtil.sanitizeInput(fullName));
            user.setPhone(ValidationUtil.sanitizeInput(phone));

            // Handle file upload
            String oldPhotoUrl = null;
            String appPath = request.getServletContext().getRealPath("");
            
            Part filePart = request.getPart("adminPhoto");
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
                if (ValidationUtil.isNotEmpty(fileName)) {
                    logger.info("UpdateProfileServlet: appPath is {}", appPath);
                    
                    // Capture old photo URL before updating
                    oldPhotoUrl = user.getProfilePhotoUrl();
                    
                    String photoUrl = registrationService.saveUserProfilePhoto(filePart, userId, user.getInstituteId(), appPath);
                    user.setProfilePhotoUrl(photoUrl);
                    logger.info("Updated profile photo for user {}. New URL: {}", userId, photoUrl);
                }
            }

            boolean success = userDAO.updateUser(user);
            String redirectUrl;

            if (success) {
                // Delete old photo if update was successful and a new photo was uploaded
                if (oldPhotoUrl != null && !oldPhotoUrl.isEmpty()) {
                    registrationService.deleteProfilePhoto(oldPhotoUrl, appPath);
                }
                
                logger.info("Profile updated successfully for user {}", userId);
                // Update session attribute if photo was changed
                if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().isEmpty()) {
                    request.getSession().setAttribute("userPhotoUrl", user.getProfilePhotoUrl());
                }
                // Update session attribute for name as well
                if (user.getFullName() != null && !user.getFullName().isEmpty()) {
                    request.getSession().setAttribute("userName", user.getFullName());
                }
                redirectUrl = request.getContextPath() + "/dashboard/pages/settings.jsp?status=success&message=Profile+updated+successfully";
            } else {
                logger.error("Failed to update profile for user {}. DAO returned false.", userId);
                redirectUrl = request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Failed+to+update+profile";
            }
            
            if (section != null && !section.isEmpty()) {
                redirectUrl += "&section=" + section + "#" + section;
            }
            
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            logger.error("Error updating profile", e);
            String section = request.getParameter("section");
            if (section == null || section.isEmpty()) {
                section = "admin-accounts-section";
            }
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=An+unexpected+error+occurred&section=" + section + "#" + section);
        }
    }
}