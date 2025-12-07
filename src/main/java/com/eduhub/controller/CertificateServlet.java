package com.eduhub.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.eduhub.model.Certificate;
import com.eduhub.model.IdCard;
import com.eduhub.model.Student;
import com.eduhub.model.Batch;
import com.eduhub.model.Branch;
import com.eduhub.model.Course;
import com.eduhub.model.Institute;
import com.eduhub.service.impl.CertificateServiceImpl;
import com.eduhub.service.impl.IdCardServiceImpl;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.service.impl.BatchServiceImpl;
import com.eduhub.service.impl.BranchServiceImpl;
import com.eduhub.service.impl.CourseServiceImpl;
import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.service.interfaces.CertificateService;
import com.eduhub.service.interfaces.IdCardService;
import com.eduhub.service.interfaces.StudentService;
import com.eduhub.service.interfaces.BatchService;
import com.eduhub.service.interfaces.BranchService;
import com.eduhub.service.interfaces.CourseService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet for Certificate and ID Card API endpoints.
 * Handles generation, retrieval, verification, and management.
 */
@WebServlet(urlPatterns = {
    "/api/certificates/generate",
    "/api/certificates/generate-batch",
    "/api/certificates/list",
    "/api/certificates/get",
    "/api/certificates/verify/*",
    "/api/certificates/download",
    "/api/certificates/revoke",
    "/api/certificates/restore",
    "/api/certificates/delete",
    "/api/certificates/student/*",
    "/api/id-cards/generate",
    "/api/id-cards/generate-batch",
    "/api/id-cards/list",
    "/api/id-cards/get",
    "/api/id-cards/verify/*",
    "/api/id-cards/activate",
    "/api/id-cards/deactivate",
    "/api/id-cards/delete",
    "/api/id-cards/student/*"
})
public class CertificateServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(CertificateServlet.class);
    private CertificateService certificateService;
    private IdCardService idCardService;
    private StudentService studentService;
    private BatchService batchService;
    private BranchService branchService;
    private CourseService courseService;
    private InstituteDAO instituteDAO;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        certificateService = new CertificateServiceImpl();
        idCardService = new IdCardServiceImpl();
        studentService = new StudentServiceImpl();
        batchService = new BatchServiceImpl();
        branchService = new BranchServiceImpl();
        courseService = new CourseServiceImpl();
        instituteDAO = new InstituteDAOImpl();
        gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String path = request.getServletPath();
        String pathInfo = request.getPathInfo();
        
        // Public verification endpoints (no auth required)
        // Note: For pattern /verify/certificate/*, getServletPath() returns "/verify/certificate"
        if (path.equals("/verify/certificate")) {
            handlePublicCertificateVerify(request, response);
            return;
        }
        if (path.equals("/verify/id")) {
            handlePublicIdCardVerify(request, response);
            return;
        }
        
        // API verification endpoints
        if (path.contains("/certificates/verify")) {
            handleCertificateVerify(request, response);
            return;
        }
        if (path.contains("/id-cards/verify")) {
            handleIdCardVerify(request, response);
            return;
        }
        
        // Protected endpoints require authentication
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        
        // Route to appropriate handler
        if (path.endsWith("/certificates/list")) {
            handleListCertificates(request, response, instituteId);
        } else if (path.endsWith("/certificates/get")) {
            handleGetCertificate(request, response);
        } else if (path.contains("/certificates/student/")) {
            handleGetStudentCertificates(request, response, instituteId, pathInfo);
        } else if (path.endsWith("/id-cards/list")) {
            handleListIdCards(request, response, instituteId);
        } else if (path.endsWith("/id-cards/get")) {
            handleGetIdCard(request, response);
        } else if (path.contains("/id-cards/student/")) {
            handleGetStudentIdCards(request, response, instituteId, pathInfo);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String path = request.getServletPath();
        
        // All POST endpoints require authentication
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        String userId = (String) session.getAttribute("userId");
        
        // Route to appropriate handler
        if (path.endsWith("/certificates/generate")) {
            handleGenerateCertificate(request, response, instituteId, userId);
        } else if (path.endsWith("/certificates/generate-batch")) {
            handleGenerateBatchCertificates(request, response, instituteId, userId);
        } else if (path.endsWith("/certificates/download")) {
            handleRecordDownload(request, response);
        } else if (path.endsWith("/certificates/revoke")) {
            handleRevokeCertificate(request, response);
        } else if (path.endsWith("/certificates/restore")) {
            handleRestoreCertificate(request, response);
        } else if (path.endsWith("/certificates/delete")) {
            handleDeleteCertificate(request, response, instituteId);
        } else if (path.endsWith("/id-cards/generate")) {
            handleGenerateIdCard(request, response, instituteId, userId);
        } else if (path.endsWith("/id-cards/generate-batch")) {
            handleGenerateBatchIdCards(request, response, instituteId, userId);
        } else if (path.endsWith("/id-cards/activate")) {
            handleActivateIdCard(request, response);
        } else if (path.endsWith("/id-cards/deactivate")) {
            handleDeactivateIdCard(request, response);
        } else if (path.endsWith("/id-cards/delete")) {
            handleDeleteIdCard(request, response, instituteId);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    // ==================== Certificate Handlers ====================
    
    private void handleGenerateCertificate(HttpServletRequest request, HttpServletResponse response,
                                           String instituteId, String userId) throws IOException {
        String studentId = request.getParameter("studentId");
        String batchId = request.getParameter("batchId");
        String courseName = request.getParameter("courseName");
        String certificateType = request.getParameter("certificateType");
        
        if (studentId == null || studentId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
            return;
        }
        
        // Check if certificate already exists for this student with same type and batch
        String certType = certificateType != null ? certificateType : "completion";
        if (certificateService.certificateExists(studentId, batchId, certType, instituteId)) {
            sendJsonError(response, HttpServletResponse.SC_CONFLICT, 
                "Certificate already exists for this student with the same type and course. Please use a different certificate type or delete the existing one.");
            return;
        }
        
        Certificate cert = certificateService.generateCertificate(studentId, instituteId, batchId, 
                                                                   courseName, certificateType, userId);
        
        if (cert != null) {
            sendJsonResponse(response, cert);
        } else {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate certificate");
        }
    }
    
    private void handleGenerateBatchCertificates(HttpServletRequest request, HttpServletResponse response,
                                                  String instituteId, String userId) throws IOException {
        String batchId = request.getParameter("batchId");
        String certificateType = request.getParameter("certificateType");
        
        if (batchId == null || batchId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Batch ID is required");
            return;
        }
        
        List<Certificate> certs = certificateService.generateBatchCertificates(batchId, instituteId, 
                                                                                certificateType, userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("count", certs.size());
        result.put("certificates", certs);
        sendJsonResponse(response, result);
    }
    
    private void handleListCertificates(HttpServletRequest request, HttpServletResponse response,
                                        String instituteId) throws IOException {
        int page = parseIntParam(request.getParameter("page"), 1);
        int pageSize = parseIntParam(request.getParameter("pageSize"), 20);
        
        List<Certificate> certs = certificateService.getInstituteCertificates(instituteId, page, pageSize);
        int totalCount = certificateService.getCertificateCount(instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("certificates", certs);
        result.put("totalCount", totalCount);
        result.put("page", page);
        result.put("pageSize", pageSize);
        sendJsonResponse(response, result);
    }
    
    private void handleGetCertificate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String certificateId = request.getParameter("certificateId");
        
        if (certificateId == null || certificateId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Certificate ID is required");
            return;
        }
        
        Certificate cert = certificateService.getCertificate(certificateId);
        
        if (cert != null) {
            sendJsonResponse(response, cert);
        } else {
            sendJsonError(response, HttpServletResponse.SC_NOT_FOUND, "Certificate not found");
        }
    }
    
    private void handleGetStudentCertificates(HttpServletRequest request, HttpServletResponse response,
                                              String instituteId, String pathInfo) throws IOException {
        String studentId = pathInfo != null ? pathInfo.substring(1) : null;
        
        if (studentId == null || studentId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
            return;
        }
        
        List<Certificate> certs = certificateService.getStudentCertificates(studentId, instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("certificates", certs);
        result.put("count", certs.size());
        sendJsonResponse(response, result);
    }
    
    private void handleCertificateVerify(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        String token = pathInfo != null ? pathInfo.substring(1) : request.getParameter("token");
        
        if (token == null || token.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Verification token is required");
            return;
        }
        
        Certificate cert = certificateService.verifyCertificate(token);
        
        if (cert != null) {
            Map<String, Object> result = new HashMap<>();
            result.put("valid", !cert.isRevoked());
            result.put("certificate", cert);
            if (cert.isRevoked()) {
                result.put("message", "This certificate has been revoked");
            }
            sendJsonResponse(response, result);
        } else {
            sendJsonError(response, HttpServletResponse.SC_NOT_FOUND, "Certificate not found or invalid token");
        }
    }
    
    private void handlePublicCertificateVerify(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        String token = pathInfo != null ? pathInfo.substring(1) : null;
        
        if (token == null || token.isEmpty()) {
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "Verification token is missing");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            return;
        }
        
        Certificate cert = certificateService.verifyCertificate(token);
        
        if (cert == null) {
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "This certificate verification token is invalid or the certificate does not exist.");
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            return;
        }
        
        if (cert.isRevoked()) {
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "This certificate has been revoked. Reason: " + 
                (cert.getRevokeReason() != null ? cert.getRevokeReason() : "Not specified"));
            request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
            return;
        }
        
        // Set all attributes needed by the JSP
        request.setAttribute("isValid", true);
        request.setAttribute("certificate", cert);
        request.setAttribute("certId", cert.getCertificateId());
        request.setAttribute("issueDate", cert.getIssueDate() != null ? cert.getIssueDate().toLocalDate() : null);
        
        // Fetch fresh Student details
        if (cert.getStudentId() != null) {
            try {
                Student student = studentService.getStudentById(cert.getStudentId());
                if (student != null) {
                    // Build full name: firstName fatherName surname
                    StringBuilder fullName = new StringBuilder();
                    if (student.getStudentName() != null && !student.getStudentName().isEmpty()) {
                        fullName.append(student.getStudentName());
                    }
                    if (student.getFatherName() != null && !student.getFatherName().isEmpty()) {
                        if (fullName.length() > 0) fullName.append(" ");
                        fullName.append(student.getFatherName());
                    }
                    if (student.getSurname() != null && !student.getSurname().isEmpty()) {
                        if (fullName.length() > 0) fullName.append(" ");
                        fullName.append(student.getSurname());
                    }
                    request.setAttribute("studentName", fullName.toString());
                } else {
                    request.setAttribute("studentName", cert.getStudentName());
                }
            } catch (Exception e) {
                logger.error("Error fetching student details for certificate verification", e);
                request.setAttribute("studentName", cert.getStudentName());
            }
        } else {
            request.setAttribute("studentName", cert.getStudentName());
        }
        
        // Fetch Course details for Name and Duration
        if (cert.getCourseId() != null && !cert.getCourseId().isEmpty()) {
            try {
                Course course = courseService.getCourseById(cert.getCourseId(), cert.getInstituteId());
                if (course != null) {
                    request.setAttribute("courseName", course.getCourseName());
                    request.setAttribute("courseDurationValue", course.getDurationValue());
                    request.setAttribute("courseDurationUnit", course.getDurationUnit());
                } else {
                    request.setAttribute("courseName", cert.getCourseName());
                }
            } catch (Exception e) {
                logger.error("Error fetching course details for certificate verification", e);
                request.setAttribute("courseName", cert.getCourseName());
            }
        } else {
            request.setAttribute("courseName", cert.getCourseName());
        }
        
        // Fetch Batch details for Duration (Fallback)
        if (cert.getBatchId() != null && !cert.getBatchId().isEmpty()) {
            try {
                Batch batch = batchService.getBatchById(cert.getBatchId(), cert.getInstituteId());
                if (batch != null) {
                    request.setAttribute("courseStartDate", batch.getStartDate());
                    request.setAttribute("courseEndDate", batch.getEndDate());
                }
            } catch (Exception e) {
                logger.error("Error fetching batch details for certificate verification", e);
            }
        }
        
        // Fetch Institute details
        if (cert.getInstituteId() != null) {
            try {
                Institute institute = instituteDAO.getInstituteById(cert.getInstituteId());
                if (institute != null) {
                    request.setAttribute("instituteName", institute.getInstituteName());
                    request.setAttribute("instituteAddress", institute.getAddress());
                    request.setAttribute("instituteCity", institute.getCity());
                }
            } catch (Exception e) {
                logger.error("Error fetching institute details for certificate verification", e);
            }
        }
        
        request.setAttribute("verificationTime", new java.util.Date());
        
        // Calculate remaining days if expiry date exists
        if (cert.getExpiryDate() != null) {
            long remainingDays = java.time.temporal.ChronoUnit.DAYS.between(
                java.time.LocalDate.now(), 
                cert.getExpiryDate().toLocalDate()
            );
            request.setAttribute("remainingDays", remainingDays);
        }
        
        request.getRequestDispatcher("/public/verify-certificate.jsp").forward(request, response);
    }
    
    private void handleRecordDownload(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String certificateId = request.getParameter("certificateId");
        
        if (certificateId == null || certificateId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Certificate ID is required");
            return;
        }
        
        HttpSession session = request.getSession(false);
        String userId = session != null ? (String) session.getAttribute("userId") : null;
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        
        boolean success = certificateService.recordDownload(certificateId, userId, ipAddress, userAgent);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        sendJsonResponse(response, result);
    }
    
    private void handleRevokeCertificate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String certificateId = request.getParameter("certificateId");
        String reason = request.getParameter("reason");
        
        if (certificateId == null || certificateId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Certificate ID is required");
            return;
        }
        
        boolean success = certificateService.revokeCertificate(certificateId, reason);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "Certificate revoked successfully" : "Failed to revoke certificate");
        sendJsonResponse(response, result);
    }
    
    private void handleRestoreCertificate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String certificateId = request.getParameter("certificateId");
        
        if (certificateId == null || certificateId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Certificate ID is required");
            return;
        }
        
        boolean success = certificateService.restoreCertificate(certificateId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "Certificate restored successfully" : "Failed to restore certificate");
        sendJsonResponse(response, result);
    }
    
    private void handleDeleteCertificate(HttpServletRequest request, HttpServletResponse response,
                                         String instituteId) throws IOException {
        String certificateId = request.getParameter("certificateId");
        
        if (certificateId == null || certificateId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Certificate ID is required");
            return;
        }
        
        boolean success = certificateService.deleteCertificate(certificateId, instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        sendJsonResponse(response, result);
    }
    
    // ==================== ID Card Handlers ====================
    
    private void handleGenerateIdCard(HttpServletRequest request, HttpServletResponse response,
                                      String instituteId, String userId) throws IOException {
        String studentId = request.getParameter("studentId");
        
        if (studentId == null || studentId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
            return;
        }
        
        // Check if active ID card already exists for this student
        if (idCardService.activeIdCardExists(studentId, instituteId)) {
            sendJsonError(response, HttpServletResponse.SC_CONFLICT, 
                "An active ID card already exists for this student. Please deactivate the existing one first or use the regenerate option.");
            return;
        }
        
        IdCard idCard = idCardService.generateIdCard(studentId, instituteId, userId);
        
        if (idCard != null) {
            sendJsonResponse(response, idCard);
        } else {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate ID card");
        }
    }
    
    private void handleGenerateBatchIdCards(HttpServletRequest request, HttpServletResponse response,
                                            String instituteId, String userId) throws IOException {
        String batchId = request.getParameter("batchId");
        
        if (batchId == null || batchId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Batch ID is required");
            return;
        }
        
        List<IdCard> idCards = idCardService.generateBatchIdCards(batchId, instituteId, userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("count", idCards.size());
        result.put("idCards", idCards);
        sendJsonResponse(response, result);
    }
    
    private void handleListIdCards(HttpServletRequest request, HttpServletResponse response,
                                   String instituteId) throws IOException {
        int page = parseIntParam(request.getParameter("page"), 1);
        int pageSize = parseIntParam(request.getParameter("pageSize"), 20);
        
        List<IdCard> idCards = idCardService.getInstituteIdCards(instituteId, page, pageSize);
        int totalCount = idCardService.getIdCardCount(instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("idCards", idCards);
        result.put("totalCount", totalCount);
        result.put("page", page);
        result.put("pageSize", pageSize);
        sendJsonResponse(response, result);
    }
    
    private void handleGetIdCard(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idCardId = request.getParameter("idCardId");
        
        if (idCardId == null || idCardId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "ID Card ID is required");
            return;
        }
        
        IdCard idCard = idCardService.getIdCard(idCardId);
        
        if (idCard != null) {
            sendJsonResponse(response, idCard);
        } else {
            sendJsonError(response, HttpServletResponse.SC_NOT_FOUND, "ID Card not found");
        }
    }
    
    private void handleGetStudentIdCards(HttpServletRequest request, HttpServletResponse response,
                                         String instituteId, String pathInfo) throws IOException {
        String studentId = pathInfo != null ? pathInfo.substring(1) : null;
        
        if (studentId == null || studentId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
            return;
        }
        
        // Get active ID card
        IdCard activeCard = idCardService.getActiveIdCard(studentId, instituteId);
        // Get all ID cards (history)
        List<IdCard> allCards = idCardService.getStudentIdCards(studentId, instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("activeIdCard", activeCard);
        result.put("idCardHistory", allCards);
        result.put("count", allCards.size());
        sendJsonResponse(response, result);
    }
    
    private void handleIdCardVerify(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        String token = pathInfo != null ? pathInfo.substring(1) : request.getParameter("token");
        
        if (token == null || token.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Verification token is required");
            return;
        }
        
        IdCard idCard = idCardService.verifyIdCard(token);
        
        if (idCard != null) {
            Map<String, Object> result = new HashMap<>();
            result.put("valid", idCard.isValid());
            result.put("idCard", idCard);
            if (!idCard.isActive()) {
                result.put("message", "This ID card has been deactivated");
            } else if (!idCard.isValid()) {
                result.put("message", "This ID card has expired");
            }
            sendJsonResponse(response, result);
        } else {
            sendJsonError(response, HttpServletResponse.SC_NOT_FOUND, "ID Card not found or invalid token");
        }
    }
    
    private void handlePublicIdCardVerify(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        String token = pathInfo != null ? pathInfo.substring(1) : null;
        
        if (token == null || token.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid verification link");
            return;
        }
        
        IdCard idCard = idCardService.verifyIdCard(token);
        
        if (idCard != null) {
            // Fetch additional details to resolve names
            try {
                Student student = studentService.getStudentById(idCard.getStudentId());
                if (student != null) {
                    // Build full name: firstName fatherName surname
                    StringBuilder fullName = new StringBuilder();
                    if (student.getStudentName() != null && !student.getStudentName().isEmpty()) {
                        fullName.append(student.getStudentName());
                    }
                    if (student.getFatherName() != null && !student.getFatherName().isEmpty()) {
                        if (fullName.length() > 0) fullName.append(" ");
                        fullName.append(student.getFatherName());
                    }
                    if (student.getSurname() != null && !student.getSurname().isEmpty()) {
                        if (fullName.length() > 0) fullName.append(" ");
                        fullName.append(student.getSurname());
                    }
                    idCard.setStudentName(fullName.toString());
                    idCard.setProfilePhotoUrl(student.getProfilePhotoUrl());
                    
                    if (student.getBatchId() != null) {
                        Batch batch = batchService.getBatchById(student.getBatchId(), idCard.getInstituteId());
                        if (batch != null) {
                            request.setAttribute("batchCode", batch.getBatchCode());
                            request.setAttribute("batchName", batch.getBatchName());
                            // Update batch name in ID card object for display
                            idCard.setBatchName(batch.getBatchName());
                            
                            // Resolve Branch Name
                            if (batch.getBranchId() != null && !batch.getBranchId().isEmpty()) {
                                Branch branch = branchService.getBranchById(batch.getBranchId(), idCard.getInstituteId());
                                if (branch != null) {
                                    request.setAttribute("branchName", branch.getBranchName());
                                    // Update department/branch in ID card object
                                    idCard.setDepartment(branch.getBranchName());
                                }
                            }
                            
                            // Resolve Course Name
                            if (batch.getCourseId() != null && !batch.getCourseId().isEmpty()) {
                                Course course = courseService.getCourseById(batch.getCourseId(), idCard.getInstituteId());
                                if (course != null) {
                                    request.setAttribute("courseName", course.getCourseName());
                                }
                            }
                        }
                    }
                }
                
                // Fetch Institute details
                if (idCard.getInstituteId() != null) {
                    Institute institute = instituteDAO.getInstituteById(idCard.getInstituteId());
                    if (institute != null) {
                        request.setAttribute("instituteName", institute.getInstituteName());
                        request.setAttribute("instituteAddress", institute.getAddress());
                        request.setAttribute("instituteCity", institute.getCity());
                    }
                }
            } catch (Exception e) {
                logger.error("Error fetching additional details for ID card verification", e);
            }
        }
        
        // Set attributes and forward to verification JSP page
        request.setAttribute("idCard", idCard);
        request.setAttribute("isValid", idCard != null && idCard.isValid());
        request.getRequestDispatcher("/public/verify-id.jsp").forward(request, response);
    }
    
    private void handleActivateIdCard(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idCardId = request.getParameter("idCardId");
        
        if (idCardId == null || idCardId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "ID Card ID is required");
            return;
        }
        
        boolean success = idCardService.activateIdCard(idCardId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "ID Card activated successfully" : "Failed to activate ID Card");
        sendJsonResponse(response, result);
    }
    
    private void handleDeactivateIdCard(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idCardId = request.getParameter("idCardId");
        String reason = request.getParameter("reason");
        
        if (idCardId == null || idCardId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "ID Card ID is required");
            return;
        }
        
        boolean success = idCardService.deactivateIdCard(idCardId, reason);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "ID Card deactivated successfully" : "Failed to deactivate ID Card");
        sendJsonResponse(response, result);
    }
    
    private void handleDeleteIdCard(HttpServletRequest request, HttpServletResponse response,
                                    String instituteId) throws IOException {
        String idCardId = request.getParameter("idCardId");
        
        if (idCardId == null || idCardId.isEmpty()) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "ID Card ID is required");
            return;
        }
        
        boolean success = idCardService.deleteIdCard(idCardId, instituteId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        sendJsonResponse(response, result);
    }
    
    // ==================== Helper Methods ====================
    
    private void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(data));
        out.flush();
    }
    
    private void sendJsonError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", true);
        error.put("message", message);
        
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(error));
        out.flush();
    }
    
    private int parseIntParam(String param, int defaultValue) {
        if (param == null || param.isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(param);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
