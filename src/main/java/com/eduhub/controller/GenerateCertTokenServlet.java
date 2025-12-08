package com.eduhub.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eduhub.util.AESTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet to generate secure QR code tokens for certificate verification
 * This generates time-limited, digitally signed tokens specifically for certificates
 */
public class GenerateCertTokenServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(GenerateCertTokenServlet.class);
    
    // Base URL for verification - should be set via environment variable in production
    private static final String BASE_URL = System.getenv("APP_BASE_URL") != null 
        ? System.getenv("APP_BASE_URL") 
        : "http://localhost:8080/eduhub";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        handleCertificateTokenRequest(request, response);
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        handleCertificateTokenRequest(request, response);
    }

    private void handleCertificateTokenRequest(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String studentId = request.getParameter("studentId");
        String studentName = request.getParameter("studentName");
        String certId = request.getParameter("certId");
        String courseName = request.getParameter("courseName");
        
        if (studentId == null || studentId.trim().isEmpty()) {
            logger.warn("Certificate token generation failed: Missing student ID");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Student ID is required\"}");
            return;
        }
        
        // Generate certificate ID if not provided
        if (certId == null || certId.trim().isEmpty()) {
            // Create a unique certificate ID
            String prefix = "CERT";
            String year = String.valueOf(java.time.Year.now().getValue());
            String uniqueNum = String.format("%06d", Math.abs(studentId.hashCode()) % 1000000);
            certId = prefix + "-" + year + "-" + uniqueNum;
        }
        
        if (courseName == null || courseName.trim().isEmpty()) {
            courseName = "Professional Development Program";
        }
        
        if (studentName == null || studentName.trim().isEmpty()) {
            studentName = "Student";
        }
        
        logger.info("Generating certificate QR token for student: {}, cert: {}", 
            studentId.substring(0, Math.min(8, studentId.length())) + "...", certId);
        
        try {
            // Generate secure AES-256-GCM encrypted certificate token
            String token = AESTokenUtil.generateCertificateToken(studentId, certId, courseName);
            
            if (token == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Failed to generate certificate token\"}");
                return;
            }
            
            // Generate full verification URL
            String verificationUrl = BASE_URL + "/verify/certificate/" + token;
            
            // Return as JSON
            response.getWriter().write(String.format(
                "{\"success\": true, \"token\": \"%s\", \"url\": \"%s\", \"certId\": \"%s\", \"validityDays\": 365}",
                escapeJson(token),
                escapeJson(verificationUrl),
                escapeJson(certId)
            ));
            
            logger.info("Certificate token generated successfully for cert: {}", certId);
            
        } catch (Exception e) {
            logger.error("Error generating certificate token", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Server error occurred\"}");
        }
    }
    
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}
