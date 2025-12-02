package com.eduhub.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.eduhub.model.Batch;
import com.eduhub.service.interfaces.BatchService;
import com.eduhub.service.impl.BatchServiceImpl;

@WebServlet(urlPatterns = {"/api/batches/create", "/api/batches/list", "/api/batches/update", "/api/batches/delete"})
public class BatchServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(BatchServlet.class);
    private BatchService batchService;
    
    @Override
    public void init() throws ServletException {
        batchService = new BatchServiceImpl();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        logger.info("doPost called with servletPath: {}", servletPath);
        
        if (servletPath.endsWith("/create")) {
            handleCreateBatch(request, response);
        } else if (servletPath.endsWith("/update")) {
            handleUpdateBatch(request, response);
        } else if (servletPath.endsWith("/delete")) {
            handleDeleteBatch(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        if (servletPath.endsWith("/list")) {
            handleListBatches(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void handleCreateBatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-batch.jsp?error=session_error");
            return;
        }
        
        try {
            Batch batch = new Batch();
            batch.setBatchId(UUID.randomUUID().toString());
            batch.setInstituteId(instituteId);
            batch.setBranchId(request.getParameter("branchId"));
            batch.setBatchCode(request.getParameter("batchCode"));
            batch.setBatchName(request.getParameter("batchName"));
            batch.setCourseId(request.getParameter("courseId"));
            batch.setInstructorId(request.getParameter("instructorId"));
            
            String startDateStr = request.getParameter("startDate");
            if (startDateStr != null && !startDateStr.isEmpty()) {
                batch.setStartDate(LocalDate.parse(startDateStr));
            }
            
            String endDateStr = request.getParameter("endDate");
            if (endDateStr != null && !endDateStr.isEmpty()) {
                batch.setEndDate(LocalDate.parse(endDateStr));
            }
            
            String startTimeStr = request.getParameter("startTime");
            if (startTimeStr != null && !startTimeStr.isEmpty()) {
                batch.setStartTime(LocalTime.parse(startTimeStr));
            }
            
            String endTimeStr = request.getParameter("endTime");
            if (endTimeStr != null && !endTimeStr.isEmpty()) {
                batch.setEndTime(LocalTime.parse(endTimeStr));
            }
            
            String maxCapacityStr = request.getParameter("maxCapacity");
            if (maxCapacityStr != null && !maxCapacityStr.isEmpty()) {
                batch.setMaxCapacity(Integer.parseInt(maxCapacityStr));
            }
            
            String[] classDays = request.getParameterValues("classDays");
            if (classDays != null) {
                batch.setClassDays(String.join(",", classDays));
            }
            
            batch.setModeOfConduct(request.getParameter("modeOfConduct"));
            batch.setStatus(request.getParameter("batchStatus"));
            batch.setClassroomLocation(request.getParameter("classroomLocation"));
            
            boolean success = batchService.createBatch(batch);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?success=true&message=Batch created successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-batch.jsp?error=true&message=Failed to create batch. Please try again.");
            }
            
        } catch (Exception e) {
            logger.error("Error creating batch", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-batch.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleUpdateBatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Implementation for update
    }

    private void handleDeleteBatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Implementation for delete
    }

    private void handleListBatches(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Implementation for list
    }
}
