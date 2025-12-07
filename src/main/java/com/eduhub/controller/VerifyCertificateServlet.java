package com.eduhub.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eduhub.model.Student;
import com.eduhub.model.Certificate;
import com.eduhub.model.Batch;
import com.eduhub.model.Branch;
import com.eduhub.model.Course;
import com.eduhub.model.Institute;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.service.impl.CertificateServiceImpl;
import com.eduhub.service.impl.BatchServiceImpl;
import com.eduhub.service.impl.BranchServiceImpl;
import com.eduhub.service.impl.CourseServiceImpl;
import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.service.interfaces.StudentService;
import com.eduhub.service.interfaces.CertificateService;
import com.eduhub.service.interfaces.BatchService;
import com.eduhub.service.interfaces.BranchService;
import com.eduhub.service.interfaces.CourseService;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.util.QRTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.format.DateTimeFormatter;

/**
 * Servlet to verify certificate authenticity via QR code scan
 * Supports two token types:
 * 1. QRTokenUtil tokens (time-limited, decodable) - from GenerateCertTokenServlet
 * 2. Database tokens (simple HMAC) - from CertificateServiceImpl
 */
public class VerifyCertificateServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(VerifyCertificateServlet.class);
    
    private StudentService studentService;
    private CertificateService certificateService;
    private BatchService batchService;
    private BranchService branchService;
    private CourseService courseService;
    private InstituteDAO instituteDAO;

    @Override
    public void init() throws ServletException {
        studentService = new StudentServiceImpl();
        certificateService = new CertificateServiceImpl();
        batchService = new BatchServiceImpl();
        branchService = new BranchServiceImpl();
        courseService = new CourseServiceImpl();
        instituteDAO = new InstituteDAOImpl();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            logger.warn("Certificate verification failed: Missing token in URL");
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "Verification token is missing");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            return;
        }

        // Extract token from path (e.g., /abc123... -> abc123...)
        String token = pathInfo.substring(1);
        
        logger.info("=== CERTIFICATE VERIFICATION DEBUG ===");
        logger.info("Token received: {} (length: {})", token, token.length());
        
        // Try method 1: Decode QRTokenUtil token (time-limited, self-contained)
        logger.info("Attempting QRTokenUtil validation...");
        String[] certDetails = QRTokenUtil.validateCertificateToken(token);
        
        if (certDetails != null) {
            // Token is valid QRTokenUtil format - extract details and verify
            String studentId = certDetails[0];
            String certId = certDetails[1];
            String courseName = certDetails[2];
            
            logger.info("QRTokenUtil SUCCESS - studentId: {}, certId: {}", studentId, certId);
            handleQRTokenVerification(request, response, studentId, certId, courseName, token);
            return;
        }
        logger.info("QRTokenUtil validation failed - trying database lookup");
        
        // Method 1 failed - Try method 2: Look up in database by token
        logger.info("Attempting database token lookup...");
        Certificate cert = certificateService.verifyCertificate(token);
        
        if (cert != null) {
            logger.info("Database lookup SUCCESS - certId: {}, studentId: {}", cert.getCertificateId(), cert.getStudentId());
            handleDatabaseTokenVerification(request, response, cert);
            return;
        }
        logger.info("Database lookup returned NULL - certificate not found in database");
        
        // Both methods failed - token is invalid or expired
        logger.warn("Certificate verification failed: Token not recognized: {}", token);
        request.setAttribute("isValid", false);
        request.setAttribute("errorMessage", "This certificate QR code is invalid, expired, or not recognized. Please ensure you are scanning a valid certificate.");
        request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
    }
    
    /**
     * Handle verification for QRTokenUtil tokens (from GenerateCertTokenServlet)
     */
    private void handleQRTokenVerification(HttpServletRequest request, HttpServletResponse response,
                                            String studentId, String certId, String courseName, String token) 
            throws ServletException, IOException {
        
        try {
            Student student = studentService.getStudentById(studentId);
            
            if (student == null) {
                logger.warn("Certificate verification failed: Student not found for ID: {}", studentId);
                request.setAttribute("isValid", false);
                request.setAttribute("errorMessage", "The student associated with this certificate was not found in our records.");
                request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
                return;
            }
            
            logger.info("Certificate verified successfully via QRToken: {} for student: {}", certId, studentId);
            
            // Build full student name
            StringBuilder fullName = new StringBuilder();
            if (student.getStudentName() != null) fullName.append(student.getStudentName());
            if (student.getFatherName() != null) fullName.append(" ").append(student.getFatherName());
            if (student.getSurname() != null) fullName.append(" ").append(student.getSurname());
            String studentFullName = fullName.toString().trim();
            
            // Create a virtual Certificate object for the JSP (similar to how we handle ID cards)
            Certificate virtualCert = new Certificate();
            virtualCert.setCertificateId(certId);
            virtualCert.setStudentId(studentId);
            virtualCert.setStudentName(studentFullName);
            virtualCert.setCourseName(courseName);
            virtualCert.setInstituteId(student.getInstituteId());
            virtualCert.setIssueDate(java.sql.Date.valueOf(java.time.LocalDate.now())); // Use current date as approximate
            virtualCert.setRevoked(false);
            
            // Set certificate details
            request.setAttribute("isValid", true);
            request.setAttribute("student", student);
            request.setAttribute("certificate", virtualCert); // Use "certificate" to match JSP
            request.setAttribute("certId", certId);
            request.setAttribute("courseName", courseName);
            request.setAttribute("studentName", studentFullName);
            
            // Fetch batch details and course duration
            if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
                try {
                    Batch batch = batchService.getBatchById(student.getBatchId(), student.getInstituteId());
                    if (batch != null) {
                        request.setAttribute("batchName", batch.getBatchName());
                        request.setAttribute("startDate", batch.getStartDate());
                        request.setAttribute("endDate", batch.getEndDate());
                        
                        // Fetch course details for duration
                        if (batch.getCourseId() != null && !batch.getCourseId().isEmpty()) {
                            try {
                                Course course = courseService.getCourseById(batch.getCourseId(), student.getInstituteId());
                                if (course != null) {
                                    request.setAttribute("courseDurationValue", course.getDurationValue());
                                    request.setAttribute("courseDurationUnit", course.getDurationUnit());
                                }
                            } catch (Exception e) {
                                logger.warn("Could not fetch course details for duration", e);
                            }
                        }
                        
                        // Fetch branch name
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
                        request.setAttribute("instituteAddress", institute.getAddress());
                        request.setAttribute("instituteCity", institute.getCity());
                        request.setAttribute("instituteEmail", institute.getInstituteEmail());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch institute details", e);
                }
            }
            
            // Add remaining validity info
            long remainingDays = QRTokenUtil.getRemainingDays(token);
            request.setAttribute("remainingDays", remainingDays);
            request.setAttribute("verificationTime", new java.util.Date());
            
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            
        } catch (Exception e) {
            logger.error("Error verifying certificate via QRToken", e);
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "A system error occurred while verifying the certificate.");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
        }
    }
    
    /**
     * Handle verification for database tokens (from CertificateServiceImpl)
     */
    private void handleDatabaseTokenVerification(HttpServletRequest request, HttpServletResponse response,
                                                   Certificate cert) 
            throws ServletException, IOException {
        
        // Check if certificate is revoked - still pass the cert to JSP for proper display
        if (cert.isRevoked()) {
            logger.warn("Certificate verification - Certificate has been revoked: {}", cert.getCertificateId());
            request.setAttribute("isValid", false);
            request.setAttribute("certificate", cert); // Pass cert so JSP can show revocation details
            request.setAttribute("errorMessage", "This certificate has been revoked");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            return;
        }
        
        try {
            Student student = studentService.getStudentById(cert.getStudentId());
            
            if (student == null) {
                logger.warn("Certificate verification failed: Student not found for ID: {}", cert.getStudentId());
                request.setAttribute("isValid", false);
                request.setAttribute("errorMessage", "The student associated with this certificate was not found.");
                request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
                return;
            }
            
            logger.info("Certificate verified successfully via DB: {} for student: {}", 
                cert.getCertificateId(), cert.getStudentId());
            
            // Set certificate details
            request.setAttribute("isValid", true);
            request.setAttribute("student", student);
            request.setAttribute("certificate", cert); // Use "certificate" to match JSP
            request.setAttribute("certId", cert.getCertificateId());
            
            // Get course name and duration from certificate or fetch from course table
            String courseName = cert.getCourseName();
            if (cert.getCourseId() != null && !cert.getCourseId().isEmpty()) {
                try {
                    Course course = courseService.getCourseById(cert.getCourseId(), student.getInstituteId());
                    if (course != null) {
                        if (courseName == null || courseName.isEmpty()) {
                            courseName = course.getCourseName();
                        }
                        // Set course duration
                        request.setAttribute("courseDurationValue", course.getDurationValue());
                        request.setAttribute("courseDurationUnit", course.getDurationUnit());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch course details", e);
                }
            }
            request.setAttribute("courseName", courseName);
            
            // Build full student name
            StringBuilder fullName = new StringBuilder();
            if (student.getStudentName() != null) fullName.append(student.getStudentName());
            if (student.getFatherName() != null) fullName.append(" ").append(student.getFatherName());
            if (student.getSurname() != null) fullName.append(" ").append(student.getSurname());
            request.setAttribute("studentName", fullName.toString().trim());
            
            // Fetch batch details
            if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
                try {
                    Batch batch = batchService.getBatchById(student.getBatchId(), student.getInstituteId());
                    if (batch != null) {
                        request.setAttribute("batchName", batch.getBatchName());
                        request.setAttribute("startDate", batch.getStartDate());
                        request.setAttribute("endDate", batch.getEndDate());
                        
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
                        request.setAttribute("instituteAddress", institute.getAddress());
                        request.setAttribute("instituteCity", institute.getCity());
                        request.setAttribute("instituteEmail", institute.getInstituteEmail());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch institute details", e);
                }
            }
            
            // Set issue date from certificate
            if (cert.getIssueDate() != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
                request.setAttribute("issueDate", cert.getIssueDate().toLocalDate().format(formatter));
            }
            
            request.setAttribute("verificationTime", new java.util.Date());
            
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            
        } catch (Exception e) {
            logger.error("Error verifying certificate via DB", e);
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "A system error occurred while verifying the certificate.");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
        }
    }
}
