package com.eduhub.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eduhub.model.Student;
import com.eduhub.model.Batch;
import com.eduhub.model.Branch;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.service.impl.BatchServiceImpl;
import com.eduhub.service.impl.BranchServiceImpl;
import com.eduhub.service.interfaces.StudentService;
import com.eduhub.service.interfaces.BatchService;
import com.eduhub.service.interfaces.BranchService;
import com.eduhub.util.QRTokenUtil;
import com.eduhub.util.VerificationLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VerifyIdServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(VerifyIdServlet.class);
    
    private StudentService studentService;
    private BatchService batchService;
    private BranchService branchService;

    @Override
    public void init() throws ServletException {
        studentService = new StudentServiceImpl();
        batchService = new BatchServiceImpl();
        branchService = new BranchServiceImpl();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            VerificationLogger.logFailure(request, null, "Missing token in URL");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Verification token is missing");
            return;
        }

        // Extract token from path (e.g., /abc123... -> abc123...)
        String token = pathInfo.substring(1);
        
        // Validate token and extract student ID
        String studentId = QRTokenUtil.validateToken(token);
        
        if (studentId == null) {
            // Token is invalid, expired, or tampered
            VerificationLogger.logFailure(request, token, "Invalid or expired token");
            request.setAttribute("isValid", false);
            request.setAttribute("errorMessage", "This QR code is invalid or has expired");
            request.getRequestDispatcher("/public/verifyid.jsp").forward(request, response);
            return;
        }
        
        try {
            Student student = studentService.getStudentById(studentId);
            
            if (student != null) {
                // Log successful verification
                VerificationLogger.logSuccess(request, studentId, student.getStudentName());
                // Fetch batch and branch details
                if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
                    try {
                        Batch batch = batchService.getBatchById(student.getBatchId(), student.getInstituteId());
                        if (batch != null) {
                            request.setAttribute("batchCode", batch.getBatchCode());
                            request.setAttribute("batchName", batch.getBatchName());
                            
                            // Fetch branch name if branchId exists
                            if (batch.getBranchId() != null && !batch.getBranchId().isEmpty()) {
                                try {
                                    Branch branch = branchService.getBranchById(batch.getBranchId(), student.getInstituteId());
                                    if (branch != null) {
                                        request.setAttribute("branchName", branch.getBranchName());
                                    }
                                } catch (Exception e) {
                                    // If branch fetch fails, continue without branch name
                                    e.printStackTrace();
                                }
                            }
                        }
                    } catch (Exception e) {
                        // If batch fetch fails, continue without batch details
                        e.printStackTrace();
                    }
                }
                
                request.setAttribute("isValid", true);
                request.setAttribute("student", student);
                
                // Add remaining validity info
                long remainingDays = QRTokenUtil.getRemainingDays(token);
                request.setAttribute("remainingDays", remainingDays);
            } else {
                VerificationLogger.logFailure(request, token, "Student not found in database");
                request.setAttribute("isValid", false);
                request.setAttribute("errorMessage", "Student record not found");
            }
            
            request.getRequestDispatcher("/public/verifyid.jsp").forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            VerificationLogger.logFailure(request, token, "Server error: " + e.getMessage());
            request.setAttribute("isValid", false);
            request.setAttribute("error", "System error occurred");
            request.getRequestDispatcher("/public/verifyid.jsp").forward(request, response);
        }
    }
}
