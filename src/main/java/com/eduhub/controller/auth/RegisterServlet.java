package com.eduhub.controller.auth;

import com.eduhub.exception.DatabaseException;
import com.eduhub.exception.DuplicateEmailException;
import com.eduhub.exception.RegistrationException;
import com.eduhub.exception.ValidationException;
import com.eduhub.model.Institute;
import com.eduhub.model.User;
import com.eduhub.service.impl.RegistrationServiceImpl;
import com.eduhub.service.interfaces.RegistrationService;
import com.eduhub.util.PasswordUtil;
import com.eduhub.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet for handling institute registration with admin
 */
@WebServlet("/auth/register")
public class RegisterServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(RegisterServlet.class);
    private RegistrationService registrationService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        registrationService = new RegistrationServiceImpl();
        logger.info("RegisterServlet initialized");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        logger.info("========================================");
        logger.info("Registration request received from IP: {}", request.getRemoteAddr());
        logger.info("========================================");
        
        // Declare variables outside try block so they're accessible in catch blocks
        String instituteName = null;
        String instituteType = null;
        String instituteEmail = null;
        String institutePhone = null;
        String address = null;
        String city = null;
        String state = null;
        String zipCode = null;
        String country = null;
        String fullName = null;
        String adminEmail = null;
        String adminPhone = null;
        String password = null;
        String confirmPassword = null;
        
        try {
            // Get and sanitize institute data from request
            instituteName = ValidationUtil.sanitizeInput(request.getParameter("instituteName"));
            
            // Log received parameters for debugging
            logger.info("Received parameters:");
            logger.info("  - Institute Name: {}", instituteName);
            logger.info("  - Institute Email: {}", request.getParameter("instituteEmail"));
            logger.info("  - Admin Email: {}", request.getParameter("adminEmail"));
            instituteType = ValidationUtil.sanitizeInput(request.getParameter("instituteType"));
            instituteEmail = ValidationUtil.sanitizeInput(request.getParameter("instituteEmail"));
            institutePhone = ValidationUtil.sanitizeInput(request.getParameter("institutePhone"));
            address = ValidationUtil.sanitizeInput(request.getParameter("address"));
            city = ValidationUtil.sanitizeInput(request.getParameter("city"));
            state = ValidationUtil.sanitizeInput(request.getParameter("state"));
            zipCode = ValidationUtil.sanitizeInput(request.getParameter("zipCode"));
            country = ValidationUtil.sanitizeInput(request.getParameter("country"));
            
            // Get and sanitize admin data from request
            fullName = ValidationUtil.sanitizeInput(request.getParameter("fullName"));
            adminEmail = ValidationUtil.sanitizeInput(request.getParameter("adminEmail"));
            adminPhone = ValidationUtil.sanitizeInput(request.getParameter("adminPhone"));
            password = request.getParameter("password"); // Don't sanitize password
            confirmPassword = request.getParameter("confirmPassword");
            
            // Validate required fields are not empty
            if (!ValidationUtil.isNotEmpty(instituteName) || !ValidationUtil.isNotEmpty(instituteEmail) ||
                !ValidationUtil.isNotEmpty(fullName) || !ValidationUtil.isNotEmpty(adminEmail) ||
                !ValidationUtil.isNotEmpty(password)) {
                
                logger.warn("Validation failed: Required fields missing");
                logger.warn("  instituteName: {}, instituteEmail: {}, fullName: {}, adminEmail: {}, password: {}", 
                    ValidationUtil.isNotEmpty(instituteName), ValidationUtil.isNotEmpty(instituteEmail),
                    ValidationUtil.isNotEmpty(fullName), ValidationUtil.isNotEmpty(adminEmail),
                    ValidationUtil.isNotEmpty(password));
                request.setAttribute("error", "All required fields must be filled");
                request.getRequestDispatcher("/public/register_institute.jsp").forward(request, response);
                return;
            }
            
            logger.info("Required fields validation passed");
            
            // Validate email formats
            if (!ValidationUtil.isValidEmail(instituteEmail)) {
                logger.warn("Validation failed: Invalid institute email format: {}", instituteEmail);
                request.setAttribute("error", "Invalid institute email format");
                request.getRequestDispatcher("/public/register_institute.jsp").forward(request, response);
                return;
            }
            
            if (!ValidationUtil.isValidEmail(adminEmail)) {
                logger.warn("Validation failed: Invalid admin email format: {}", adminEmail);
                request.setAttribute("error", "Invalid admin email format");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
                return;
            }
            
            logger.info("Email validation passed");
            
            // Validate phone numbers
            if (!ValidationUtil.isValidPhone(institutePhone)) {
                logger.warn("Validation failed: Invalid institute phone format: {}", institutePhone);
                request.setAttribute("error", "Invalid institute phone number format");
                request.getRequestDispatcher("/public/register_institute.jsp").forward(request, response);
                return;
            }
            
            if (adminPhone != null && !adminPhone.trim().isEmpty() && !ValidationUtil.isValidPhone(adminPhone)) {
                logger.warn("Validation failed: Invalid admin phone format: {}", adminPhone);
                request.setAttribute("error", "Invalid admin phone number format");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
                return;
            }
            
            logger.info("Phone validation passed");
            
            // Validate field lengths
            logger.info("Validating field lengths...");
            if (!ValidationUtil.isValidLength(instituteName, 3, 255)) {
                logger.warn("Validation failed: Institute name length invalid: {} chars", instituteName.length());
                request.setAttribute("error", "Institute name must be between 3 and 255 characters");
                request.getRequestDispatcher("/public/register_institute.jsp").forward(request, response);
                return;
            }
            
            if (!ValidationUtil.isValidLength(fullName, 2, 255)) {
                logger.warn("Validation failed: Full name length invalid: {} chars", fullName.length());
                request.setAttribute("error", "Full name must be between 2 and 255 characters");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
                return;
            }
            
            logger.info("Field length validation passed");
            
            // Validate password match
            logger.info("Validating password match...");
            if (!password.equals(confirmPassword)) {
                logger.warn("Validation failed: Passwords do not match");
                request.setAttribute("error", "Passwords do not match");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
                return;
            }
            
            logger.info("Password match validation passed");
            
            // Validate password strength
            logger.info("Validating password strength...");
            if (!ValidationUtil.isStrongPassword(password)) {
                logger.warn("Validation failed: Password not strong enough");
                request.setAttribute("error", "Password must be at least 8 characters and contain letters and numbers");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
                return;
            }
            
            logger.info("Password strength validation passed");
            
            // Clean data for database (trim and limit)
            logger.info("Cleaning data for database...");
            instituteName = ValidationUtil.cleanForDatabase(instituteName, 255);
            fullName = ValidationUtil.cleanForDatabase(fullName, 255);
            address = ValidationUtil.cleanForDatabase(address, 500);
            city = ValidationUtil.cleanForDatabase(city, 100);
            state = ValidationUtil.cleanForDatabase(state, 100);
            logger.info("Data cleaning completed");
            
            // Create Institute object
            logger.info("Creating Institute object...");
            Institute institute = new Institute(
                instituteName, instituteType, instituteEmail, institutePhone,
                address, city, state, zipCode, country
            );
            logger.info("Institute object created successfully");
            
            // Create User (Admin) object with hashed password
            logger.info("Creating Admin user object and hashing password...");
            String hashedPassword = PasswordUtil.hashPassword(password);
            User admin = new User();
            admin.setFullName(fullName);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(hashedPassword);
            admin.setPhone(adminPhone);
            admin.setRole("admin");
            logger.info("Admin user object created successfully");
            
            // Register institute with admin
            logger.info("Calling registration service to insert data into database...");
            RegistrationService.RegistrationResult result = 
                registrationService.registerInstituteWithAdmin(institute, admin);
            logger.info("Registration service call completed. Success: {}", result.isSuccess());
            
            if (result.isSuccess()) {
                logger.info("Registration successful for institute: {}", instituteName);
                
                // Redirect to login page with success message
                String successMessage = "Registration successful! You can now log in with your credentials.";
                response.sendRedirect(request.getContextPath() + 
                    "/public/login.jsp?registered=true&message=" + 
                    java.net.URLEncoder.encode(successMessage, "UTF-8"));
            } else {
                logger.warn("Registration failed: {}", result.getMessage());
                // Forward to keep form data - don't redirect
                request.setAttribute("error", result.getMessage());
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
            }
            
        } catch (DuplicateEmailException e) {
            // Handle duplicate email - Forward to the correct page based on which email is duplicate
            logger.warn("Registration failed - duplicate email: {}", e.getMessage());
            request.setAttribute("error", e.getMessage());
            
            // Preserve all form data as attributes so they're available after forward
            request.setAttribute("instituteName", instituteName);
            request.setAttribute("instituteType", instituteType);
            request.setAttribute("instituteEmail", instituteEmail);
            request.setAttribute("institutePhone", institutePhone);
            request.setAttribute("address", address);
            request.setAttribute("city", city);
            request.setAttribute("state", state);
            request.setAttribute("zipCode", zipCode);
            request.setAttribute("country", country);
            request.setAttribute("fullName", fullName);
            request.setAttribute("adminEmail", adminEmail);
            request.setAttribute("adminPhone", adminPhone);
            
            // Check if the error message mentions "Admin email" or "Institute email"
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.toLowerCase().contains("admin email")) {
                // Admin email is duplicate - forward to admin page
                logger.info("Forwarding to register_admin.jsp with preserved form data");
                request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
            } else {
                // Institute email is duplicate - forward to institute page
                logger.info("Forwarding to register_institute.jsp with preserved form data");
                request.getRequestDispatcher("/public/register_institute.jsp").forward(request, response);
            }
            
        } catch (DatabaseException e) {
            // Handle database errors - Forward to keep form data
            logger.error("Database error during registration: {}", e.getMessage(), e);
            request.setAttribute("error", "Registration failed due to a system error. Please try again later.");
            
            // Preserve all form data
            request.setAttribute("instituteName", instituteName);
            request.setAttribute("instituteType", instituteType);
            request.setAttribute("instituteEmail", instituteEmail);
            request.setAttribute("institutePhone", institutePhone);
            request.setAttribute("address", address);
            request.setAttribute("city", city);
            request.setAttribute("state", state);
            request.setAttribute("zipCode", zipCode);
            request.setAttribute("country", country);
            request.setAttribute("fullName", fullName);
            request.setAttribute("adminEmail", adminEmail);
            request.setAttribute("adminPhone", adminPhone);
            
            request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
            
        } catch (RegistrationException e) {
            // Handle other registration exceptions - Forward to keep form data
            logger.error("Registration failed: {}", e.getMessage(), e);
            request.setAttribute("error", e.getMessage());
            
            // Preserve all form data
            request.setAttribute("instituteName", instituteName);
            request.setAttribute("instituteType", instituteType);
            request.setAttribute("instituteEmail", instituteEmail);
            request.setAttribute("institutePhone", institutePhone);
            request.setAttribute("address", address);
            request.setAttribute("city", city);
            request.setAttribute("state", state);
            request.setAttribute("zipCode", zipCode);
            request.setAttribute("country", country);
            request.setAttribute("fullName", fullName);
            request.setAttribute("adminEmail", adminEmail);
            request.setAttribute("adminPhone", adminPhone);
            
            request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
            
        } catch (Exception e) {
            // Catch-all for unexpected errors - Forward to keep form data
            logger.error("Unexpected error during registration", e);
            request.setAttribute("error", "An unexpected error occurred. Please try again later.");
            
            // Preserve all form data
            request.setAttribute("instituteName", instituteName);
            request.setAttribute("instituteType", instituteType);
            request.setAttribute("instituteEmail", instituteEmail);
            request.setAttribute("institutePhone", institutePhone);
            request.setAttribute("address", address);
            request.setAttribute("city", city);
            request.setAttribute("state", state);
            request.setAttribute("zipCode", zipCode);
            request.setAttribute("country", country);
            request.setAttribute("fullName", fullName);
            request.setAttribute("adminEmail", adminEmail);
            request.setAttribute("adminPhone", adminPhone);
            
            request.getRequestDispatcher("/public/register_admin.jsp").forward(request, response);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Redirect GET requests to registration page
        response.sendRedirect(request.getContextPath() + "/public/register_institute.jsp");
    }
}
