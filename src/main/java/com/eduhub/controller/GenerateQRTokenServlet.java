package com.eduhub.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eduhub.util.QRTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet to generate secure QR code tokens for student verification
 * This generates time-limited, digitally signed tokens
 */
public class GenerateQRTokenServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(GenerateQRTokenServlet.class);
    
    // Base URL for verification - should be set via environment variable in production
    private static final String BASE_URL = System.getenv("APP_BASE_URL") != null 
        ? System.getenv("APP_BASE_URL") 
        : "http://localhost:8080/eduhub";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String studentId = request.getParameter("studentId");
        
        if (studentId == null || studentId.trim().isEmpty()) {
            logger.warn("Token generation failed: Missing student ID");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Student ID is required\"}");
            return;
        }
        
        logger.info("Generating QR token for student: {}", studentId.substring(0, Math.min(8, studentId.length())) + "...");
        
        try {
            // Generate secure token
            String token = QRTokenUtil.generateToken(studentId);
            
            if (token == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Failed to generate token\"}");
                return;
            }
            
            // Generate full verification URL
            String verificationUrl = BASE_URL + "/verify/id/" + token;
            
            // Return as JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.format(
                "{\"success\": true, \"token\": \"%s\", \"url\": \"%s\", \"validityDays\": 365}",
                token,
                verificationUrl
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Server error occurred\"}");
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String studentId = request.getParameter("studentId");
        
        if (studentId == null || studentId.trim().isEmpty()) {
            logger.warn("Token generation failed (GET): Missing student ID");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
            return;
        }
        
        logger.info("Generating QR token (GET) for student: {}", studentId.substring(0, Math.min(8, studentId.length())) + "...");
        
        try {
            // Generate secure token
            String token = QRTokenUtil.generateToken(studentId);
            
            if (token == null) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate token");
                return;
            }
            
            // Generate full verification URL
            String verificationUrl = BASE_URL + "/verify/id/" + token;
            
            // Return URL as plain text
            response.setContentType("text/plain");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(verificationUrl);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error occurred");
        }
    }
    
    /**
     * Handle certificate token generation via POST to /api/generate-cert-token
     */
    protected void handleCertificateTokenRequest(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String studentId = request.getParameter("studentId");
        String certId = request.getParameter("certId");
        String courseName = request.getParameter("courseName");
        
        if (studentId == null || studentId.trim().isEmpty()) {
            logger.warn("Certificate token generation failed: Missing student ID");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Student ID is required\"}");
            return;
        }
        
        if (certId == null || certId.trim().isEmpty()) {
            certId = "CERT-" + System.currentTimeMillis();
        }
        
        if (courseName == null || courseName.trim().isEmpty()) {
            courseName = "Course";
        }
        
        logger.info("Generating certificate QR token for student: {}, cert: {}", 
            studentId.substring(0, Math.min(8, studentId.length())) + "...", certId);
        
        try {
            // Generate secure certificate token
            String token = QRTokenUtil.generateCertificateToken(studentId, certId, courseName);
            
            if (token == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Failed to generate certificate token\"}");
                return;
            }
            
            // Generate full verification URL
            String verificationUrl = BASE_URL + "/verify/certificate/" + token;
            
            // Return as JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.format(
                "{\"success\": true, \"token\": \"%s\", \"url\": \"%s\", \"certId\": \"%s\", \"validityDays\": 365}",
                token,
                verificationUrl,
                certId
            ));
            
        } catch (Exception e) {
            logger.error("Error generating certificate token", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Server error occurred\"}");
        }
    }
}
