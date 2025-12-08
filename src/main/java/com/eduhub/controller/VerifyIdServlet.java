package com.eduhub.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eduhub.model.Student;
import com.eduhub.model.IdCard;
import com.eduhub.model.Batch;
import com.eduhub.model.Branch;
import com.eduhub.model.Course;
import com.eduhub.model.Institute;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.service.impl.IdCardServiceImpl;
import com.eduhub.service.impl.BatchServiceImpl;
import com.eduhub.service.impl.BranchServiceImpl;
import com.eduhub.service.impl.CourseServiceImpl;
import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.service.interfaces.StudentService;
import com.eduhub.service.interfaces.IdCardService;
import com.eduhub.service.interfaces.BatchService;
import com.eduhub.service.interfaces.BranchService;
import com.eduhub.service.interfaces.CourseService;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.util.AESTokenUtil;
import com.eduhub.util.VerificationLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Servlet to verify ID card authenticity via QR code scan
 * Supports two token types:
 * 1. AES-256-GCM encrypted tokens (time-limited, secure) - from GenerateQRTokenServlet
 * 2. Database tokens (HMAC hash) - from IdCardServiceImpl
 */
public class VerifyIdServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(VerifyIdServlet.class);
    
    private StudentService studentService;
    private IdCardService idCardService;
    private BatchService batchService;
    private BranchService branchService;
    private CourseService courseService;
    private InstituteDAO instituteDAO;

    @Override
    public void init() throws ServletException {
        studentService = new StudentServiceImpl();
        idCardService = new IdCardServiceImpl();
        batchService = new BatchServiceImpl();
        branchService = new BranchServiceImpl();
        courseService = new CourseServiceImpl();
        instituteDAO = new InstituteDAOImpl();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            VerificationLogger.logFailure(request, null, "Missing token in URL");
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "Verification token is missing");
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
            return;
        }

        // Extract token from path (e.g., /abc123... -> abc123...)
        String token = pathInfo.substring(1);
        
        logger.info("=== ID CARD VERIFICATION DEBUG ===");
        logger.info("Token received: {} (length: {})", token, token.length());
        
        // Try method 1: Decode AES-256-GCM encrypted token (time-limited, self-contained)
        logger.info("Attempting AES-256-GCM token validation...");
        String studentId = AESTokenUtil.validateIdToken(token);
        
        if (studentId != null) {
            // Token is valid AES encrypted format
            logger.info("AES Token SUCCESS - studentId: {}", studentId);
            handleQRTokenVerification(request, response, studentId, token);
            return;
        }
        logger.info("AES token validation failed - trying database lookup");
        
        // Method 1 failed - Try method 2: Look up ID card by token in database
        logger.info("Attempting database token lookup...");
        IdCard idCard = idCardService.verifyIdCard(token);
        
        if (idCard != null) {
            logger.info("Database lookup SUCCESS - idCardId: {}, studentId: {}", idCard.getIdCardId(), idCard.getStudentId());
            handleDatabaseTokenVerification(request, response, idCard, token);
            return;
        }
        logger.info("Database lookup returned NULL");
        
        // Both methods failed - token is invalid or expired
        VerificationLogger.logFailure(request, token, "Invalid or unknown token");
        logger.warn("ID card verification failed: Token not recognized: {}", token);
        request.setAttribute("isValid", false);
        request.setAttribute("errorMessage", "This ID card QR code is invalid, expired, or not recognized. Please ensure you are scanning a valid ID card.");
        request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
    }
    
    /**
     * Handle verification for AES encrypted tokens (from GenerateQRTokenServlet)
     */
    private void handleQRTokenVerification(HttpServletRequest request, HttpServletResponse response,
                                            String studentId, String token) 
            throws ServletException, IOException {
        
        try {
            Student student = studentService.getStudentById(studentId);
            
            if (student == null) {
                VerificationLogger.logFailure(request, token, "Student not found");
                request.setAttribute("isValid", false);
                request.setAttribute("errorMessage", "Student record not found");
                request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
                return;
            }
            
            // Check if student is still active (makes AES tokens revocable)
            String status = student.getStudentStatus();
            if (status != null && (status.equalsIgnoreCase("Inactive") || 
                                   status.equalsIgnoreCase("Expelled") || 
                                   status.equalsIgnoreCase("Suspended") ||
                                   status.equalsIgnoreCase("Withdrawn"))) {
                logger.warn("ID verification failed: Student {} is {}", studentId, status);
                request.setAttribute("isValid", false);
                request.setAttribute("student", student);
                request.setAttribute("errorMessage", "This student's ID card has been revoked. Status: " + status);
                request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
                return;
            }
            
            // Check if ID card is active (deactivated from admin panel)
            IdCard activeIdCard = idCardService.getActiveIdCard(studentId, student.getInstituteId());
            if (activeIdCard == null) {
                // No active ID card found - check if any ID card exists but is deactivated
                logger.warn("ID verification failed: No active ID card for student {}", studentId);
                request.setAttribute("isValid", false);
                request.setAttribute("student", student);
                request.setAttribute("errorMessage", "This ID card has been deactivated.");
                request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
                return;
            }
            
            // Log successful verification
            VerificationLogger.logSuccess(request, student.getStudentId(), student.getStudentName());
            
            // Fetch batch and branch details
            Batch batch = null;
            if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
                try {
                    batch = batchService.getBatchById(student.getBatchId(), student.getInstituteId());
                    if (batch != null) {
                        request.setAttribute("batchCode", batch.getBatchCode());
                        request.setAttribute("batchName", batch.getBatchName());
                        
                        if (batch.getBranchId() != null && !batch.getBranchId().isEmpty()) {
                            try {
                                Branch branch = branchService.getBranchById(batch.getBranchId(), student.getInstituteId());
                                if (branch != null) {
                                    request.setAttribute("branchName", branch.getBranchName());
                                }
                            } catch (Exception e) {
                                logger.warn("Could not fetch branch details", e);
                            }
                        }
                        
                        if (batch.getCourseId() != null && !batch.getCourseId().isEmpty()) {
                            try {
                                Course course = courseService.getCourseById(batch.getCourseId(), student.getInstituteId());
                                if (course != null) {
                                    request.setAttribute("courseName", course.getCourseName());
                                }
                            } catch (Exception e) {
                                logger.warn("Could not fetch course details", e);
                            }
                        }
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch batch details", e);
                }
            }
            
            // Fetch institute details
            if (student.getInstituteId() != null && !student.getInstituteId().isEmpty()) {
                try {
                    Institute institute = instituteDAO.getInstituteById(student.getInstituteId());
                    if (institute != null) {
                        request.setAttribute("instituteName", institute.getInstituteName());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch institute details", e);
                }
            }
            
            // Create a virtual IdCard object for the JSP
            IdCard virtualIdCard = new IdCard();
            virtualIdCard.setStudentId(studentId);
            virtualIdCard.setStudentName(buildFullName(student));
            virtualIdCard.setProfilePhotoUrl(student.getProfilePhotoUrl());
            virtualIdCard.setActive(true);
            
            // Set dates based on token validity
            long remainingDays = AESTokenUtil.getRemainingDays(token);
            LocalDate validUntil = LocalDate.now().plusDays(remainingDays);
            LocalDate issueDate = validUntil.minusYears(1);
            virtualIdCard.setIssueDate(java.sql.Date.valueOf(issueDate));
            virtualIdCard.setValidUntil(java.sql.Date.valueOf(validUntil));
            
            request.setAttribute("isValid", true);
            request.setAttribute("student", student);
            request.setAttribute("idCard", virtualIdCard);
            request.setAttribute("remainingDays", remainingDays);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            request.setAttribute("issueDate", issueDate.format(formatter));
            request.setAttribute("validUntil", validUntil.format(formatter));
            
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
            
        } catch (Exception e) {
            logger.error("Error verifying ID via QRToken", e);
            VerificationLogger.logFailure(request, token, "Server error: " + e.getMessage());
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "System error occurred");
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
        }
    }
    
    /**
     * Handle verification for database tokens (from IdCardServiceImpl)
     */
    private void handleDatabaseTokenVerification(HttpServletRequest request, HttpServletResponse response,
                                                   IdCard idCard, String token) 
            throws ServletException, IOException {
        
        // Check if ID card is still active - still pass idCard for JSP to display details
        if (!idCard.isActive()) {
            VerificationLogger.logFailure(request, token, "ID card has been deactivated");
            request.setAttribute("isValid", false);
            request.setAttribute("idCard", idCard); // Pass for display
            request.setAttribute("errorMessage", "This ID card has been deactivated");
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
            return;
        }
        
        // Check if ID card has expired - still pass idCard for JSP to display details
        if (idCard.getValidUntil() != null && idCard.getValidUntil().toLocalDate().isBefore(LocalDate.now())) {
            VerificationLogger.logFailure(request, token, "ID card has expired");
            request.setAttribute("isValid", false);
            request.setAttribute("idCard", idCard); // Pass for display
            request.setAttribute("errorMessage", "This ID card has expired");
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
            return;
        }
        
        try {
            Student student = studentService.getStudentById(idCard.getStudentId());
            
            if (student == null) {
                VerificationLogger.logFailure(request, token, "Student not found in database");
                request.setAttribute("isValid", false);
                request.setAttribute("errorMessage", "Student record not found");
                request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
                return;
            }
            
            // Check if student is still active
            String status = student.getStudentStatus();
            if (status != null && (status.equalsIgnoreCase("Inactive") || 
                                   status.equalsIgnoreCase("Expelled") || 
                                   status.equalsIgnoreCase("Suspended") ||
                                   status.equalsIgnoreCase("Withdrawn"))) {
                logger.warn("ID verification failed: Student {} is {}", idCard.getStudentId(), status);
                request.setAttribute("isValid", false);
                request.setAttribute("student", student);
                request.setAttribute("idCard", idCard);
                request.setAttribute("errorMessage", "This student's ID card has been revoked. Status: " + status);
                request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
                return;
            }
            
            // Log successful verification
            VerificationLogger.logSuccess(request, student.getStudentId(), student.getStudentName());
            
            // Fetch batch and branch details
            if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
                try {
                    Batch batch = batchService.getBatchById(student.getBatchId(), student.getInstituteId());
                    if (batch != null) {
                        request.setAttribute("batchCode", batch.getBatchCode());
                        request.setAttribute("batchName", batch.getBatchName());
                        
                        if (batch.getBranchId() != null && !batch.getBranchId().isEmpty()) {
                            try {
                                Branch branch = branchService.getBranchById(batch.getBranchId(), student.getInstituteId());
                                if (branch != null) {
                                    request.setAttribute("branchName", branch.getBranchName());
                                }
                            } catch (Exception e) {
                                logger.warn("Could not fetch branch details", e);
                            }
                        }
                        
                        if (batch.getCourseId() != null && !batch.getCourseId().isEmpty()) {
                            try {
                                Course course = courseService.getCourseById(batch.getCourseId(), student.getInstituteId());
                                if (course != null) {
                                    request.setAttribute("courseName", course.getCourseName());
                                }
                            } catch (Exception e) {
                                logger.warn("Could not fetch course details", e);
                            }
                        }
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch batch details", e);
                }
            }
            
            // Fetch institute details
            if (student.getInstituteId() != null && !student.getInstituteId().isEmpty()) {
                try {
                    Institute institute = instituteDAO.getInstituteById(student.getInstituteId());
                    if (institute != null) {
                        request.setAttribute("instituteName", institute.getInstituteName());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch institute details", e);
                }
            }
            
            request.setAttribute("isValid", true);
            request.setAttribute("student", student);
            request.setAttribute("idCard", idCard);
            
            // Calculate remaining days
            long remainingDays = 0;
            if (idCard.getValidUntil() != null) {
                remainingDays = java.time.temporal.ChronoUnit.DAYS.between(
                    LocalDate.now(), idCard.getValidUntil().toLocalDate());
            }
            request.setAttribute("remainingDays", remainingDays);
            
            // Format dates
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            if (idCard.getIssueDate() != null) {
                request.setAttribute("issueDate", idCard.getIssueDate().toLocalDate().format(formatter));
            }
            if (idCard.getValidUntil() != null) {
                request.setAttribute("validUntil", idCard.getValidUntil().toLocalDate().format(formatter));
            }
            
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
            
        } catch (Exception e) {
            logger.error("Error verifying ID card via DB", e);
            VerificationLogger.logFailure(request, token, "Server error: " + e.getMessage());
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "System error occurred");
            request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
        }
    }
    
    /**
     * Build full name from student object
     */
    private String buildFullName(Student student) {
        StringBuilder fullName = new StringBuilder();
        if (student.getStudentName() != null) fullName.append(student.getStudentName());
        if (student.getFatherName() != null) fullName.append(" ").append(student.getFatherName());
        if (student.getSurname() != null) fullName.append(" ").append(student.getSurname());
        return fullName.toString().trim();
    }
}
