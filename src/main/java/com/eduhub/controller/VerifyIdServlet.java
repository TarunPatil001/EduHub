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

public class VerifyIdServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
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
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Student ID is missing");
            return;
        }

        // Extract studentId from path (e.g., /32c840f1... -> 32c840f1...)
        String studentId = pathInfo.substring(1);
        
        try {
            Student student = studentService.getStudentById(studentId);
            
            if (student != null) {
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
            } else {
                request.setAttribute("isValid", false);
            }
            
            request.getRequestDispatcher("/public/verifyid.jsp").forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("isValid", false);
            request.setAttribute("error", "System error occurred");
            request.getRequestDispatcher("/public/verifyid.jsp").forward(request, response);
        }
    }
}
