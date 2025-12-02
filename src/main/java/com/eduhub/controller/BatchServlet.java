package com.eduhub.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=session_error");
            return;
        }
        
        try {
            String batchId = request.getParameter("batchId");
            if (batchId == null || batchId.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=true&message=Batch ID is missing");
                return;
            }

            Batch batch = new Batch();
            batch.setBatchId(batchId);
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
            } else {
                batch.setClassDays("");
            }
            
            batch.setModeOfConduct(request.getParameter("modeOfConduct"));
            batch.setStatus(request.getParameter("batchStatus"));
            batch.setClassroomLocation(request.getParameter("classroomLocation"));
            
            boolean success = batchService.updateBatch(batch);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?success=true&message=Batch updated successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-batch.jsp?id=" + batchId + "&error=true&message=Failed to update batch");
            }
            
        } catch (Exception e) {
            logger.error("Error updating batch", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleDeleteBatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=session_error");
            return;
        }

        String batchId = request.getParameter("batchId");
        String batchIds = request.getParameter("batchIds");
        
        boolean success = false;
        
        try {
            if (batchIds != null && !batchIds.isEmpty()) {
                // Bulk delete
                String[] ids = batchIds.split(",");
                boolean allSuccess = true;
                for (String id : ids) {
                    if (!batchService.deleteBatch(id.trim(), instituteId)) {
                        allSuccess = false;
                    }
                }
                success = allSuccess; 
            } else if (batchId != null && !batchId.isEmpty()) {
                // Single delete
                success = batchService.deleteBatch(batchId, instituteId);
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=true&message=No batch ID provided");
                return;
            }
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?success=true&message=Batch(es) deleted successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=true&message=Failed to delete batch(es)");
            }
        } catch (Exception e) {
            logger.error("Error deleting batch", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/manage-batches.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleListBatches(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Session incomplete - Institute ID missing");
            return;
        }
        
        try {
            String courseId = request.getParameter("courseId");
            String branchId = request.getParameter("branchId");
            String status = request.getParameter("status");
            String search = request.getParameter("search");
            
            int page = 1;
            int pageSize = 10;
            
            try {
                String pageStr = request.getParameter("page");
                if (pageStr != null && !pageStr.isEmpty()) {
                    page = Integer.parseInt(pageStr);
                }
                
                String pageSizeStr = request.getParameter("pageSize");
                if (pageSizeStr != null && !pageSizeStr.isEmpty()) {
                    pageSize = Integer.parseInt(pageSizeStr);
                }
            } catch (NumberFormatException e) {
                // Use defaults
                logger.warn("Invalid page or pageSize format, using defaults. Page: {}, PageSize: {}", request.getParameter("page"), request.getParameter("pageSize"));
            }
            
            logger.info("Fetching batches - Institute: {}, Course: {}, Branch: {}, Status: {}, Search: {}, Page: {}, Size: {}", 
                    instituteId, courseId, branchId, status, search, page, pageSize);

            List<Batch> batches = batchService.getBatchesByFilters(instituteId, courseId, branchId, status, search, page, pageSize);
            int totalCount = batchService.getBatchCountByFilters(instituteId, courseId, branchId, status, search);
            
            logger.info("Retrieved {} batches. Total count: {}", batches.size(), totalCount);
            
            String json = convertBatchesToJson(batches, totalCount);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } catch (Exception e) {
            logger.error("Error fetching batches", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching batches");
        }
    }

    private String convertBatchesToJson(List<Batch> batches, int totalCount) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"totalCount\":").append(totalCount).append(",");
        json.append("\"batches\":[");
        for (int i = 0; i < batches.size(); i++) {
            Batch batch = batches.get(i);
            json.append(convertBatchToJson(batch));
            if (i < batches.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        json.append("}");
        return json.toString();
    }

    private String convertBatchToJson(Batch batch) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"batchId\":\"").append(escapeJson(batch.getBatchId())).append("\",");
        json.append("\"batchCode\":\"").append(escapeJson(batch.getBatchCode())).append("\",");
        json.append("\"batchName\":\"").append(escapeJson(batch.getBatchName())).append("\",");
        json.append("\"courseId\":\"").append(escapeJson(batch.getCourseId())).append("\",");
        json.append("\"branchId\":\"").append(escapeJson(batch.getBranchId())).append("\",");
        json.append("\"instructorId\":\"").append(escapeJson(batch.getInstructorId())).append("\",");
        json.append("\"startDate\":\"").append(batch.getStartDate() != null ? batch.getStartDate().toString() : "").append("\",");
        json.append("\"endDate\":\"").append(batch.getEndDate() != null ? batch.getEndDate().toString() : "").append("\",");
        json.append("\"startTime\":\"").append(batch.getStartTime() != null ? batch.getStartTime().toString() : "").append("\",");
        json.append("\"endTime\":\"").append(batch.getEndTime() != null ? batch.getEndTime().toString() : "").append("\",");
        json.append("\"maxCapacity\":").append(batch.getMaxCapacity()).append(",");
        json.append("\"classDays\":\"").append(escapeJson(batch.getClassDays())).append("\",");
        json.append("\"modeOfConduct\":\"").append(escapeJson(batch.getModeOfConduct())).append("\",");
        json.append("\"status\":\"").append(escapeJson(batch.getStatus())).append("\",");
        json.append("\"classroomLocation\":\"").append(escapeJson(batch.getClassroomLocation())).append("\"");
        json.append("}");
        return json.toString();
    }

    private String escapeJson(String input) {
        if (input == null) {
            return "";
        }
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}
