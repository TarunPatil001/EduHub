package com.eduhub.controller;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.eduhub.model.Branch;
import com.eduhub.service.interfaces.BranchService;
import com.eduhub.service.impl.BranchServiceImpl;

@WebServlet(urlPatterns = {"/api/branches/create", "/api/branches/list", "/api/branches/update", "/api/branches/delete"})
public class BranchServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(BranchServlet.class);
    private BranchService branchService;
    
    @Override
    public void init() throws ServletException {
        branchService = new BranchServiceImpl();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        logger.info("doPost called with servletPath: {}", servletPath);
        
        if (servletPath.endsWith("/create")) {
            handleCreateBranch(request, response);
        } else if (servletPath.endsWith("/update")) {
            handleUpdateBranch(request, response);
        } else if (servletPath.endsWith("/delete")) {
            handleDeleteBranch(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        if (servletPath.endsWith("/list")) {
            handleListBranches(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void handleCreateBranch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/branches/create-branch.jsp?error=true&message=Session error: Institute ID not found");
            return;
        }
        
        try {
            Branch branch = new Branch();
            branch.setBranchId(UUID.randomUUID().toString());
            branch.setInstituteId(instituteId);
            branch.setBranchCode(request.getParameter("branchCode"));
            branch.setBranchName(request.getParameter("branchName"));
            branch.setBranchManagerId(request.getParameter("branchManagerId"));
            branch.setStatus(request.getParameter("branchStatus"));
            branch.setEmail(request.getParameter("email"));
            branch.setPhone(request.getParameter("phone"));
            branch.setAddress(request.getParameter("address"));
            branch.setCity(request.getParameter("city"));
            branch.setState(request.getParameter("state"));
            branch.setZipCode(request.getParameter("zipCode"));
            
            boolean success = branchService.createBranch(branch);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/branches/all-branches.jsp?success=true&message=Branch created successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/branches/create-branch.jsp?error=true&message=Failed to create branch. Branch code might already exist.");
            }
            
        } catch (Exception e) {
            logger.error("Error creating branch", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/branches/create-branch.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleUpdateBranch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Implementation for update
    }

    private void handleDeleteBranch(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String instituteId = (String) session.getAttribute("instituteId");
        String branchId = request.getParameter("id");

        if (instituteId == null || branchId == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing instituteId or branchId");
            return;
        }
        
        logger.info("Attempting to delete branchId: {} for instituteId: {}", branchId, instituteId);

        try {
            boolean success = branchService.deleteBranch(branchId, instituteId);
            if (success) {
                logger.info("Successfully deleted branchId: {}", branchId);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"status\":\"success\"}");
            } else {
                logger.warn("Failed to delete branchId: {}", branchId);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to delete branch");
            }
        } catch (Exception e) {
            logger.error("Error deleting branch", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private void handleListBranches(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Institute ID not found in session");
            return;
        }
        
        logger.info("Listing branches for instituteId: {}", instituteId);

        try {
            // Get filter and pagination parameters
            String searchQuery = request.getParameter("search");
            String city = request.getParameter("city");
            String state = request.getParameter("state");
            String status = request.getParameter("status");
            
            int page = 1;
            int limit = 10;
            
            try {
                if (request.getParameter("page") != null) {
                    page = Integer.parseInt(request.getParameter("page"));
                }
                if (request.getParameter("limit") != null) {
                    limit = Integer.parseInt(request.getParameter("limit"));
                }
            } catch (NumberFormatException e) {
                logger.warn("Invalid page or limit parameter, using defaults");
            }
            
            // Get filtered and paginated branches
            java.util.Map<String, Object> result = branchService.getBranchesWithFilters(
                instituteId, searchQuery, city, state, status, page, limit
            );
            
            @SuppressWarnings("unchecked")
            java.util.List<Branch> branches = (java.util.List<Branch>) result.get("branches");
            int totalCount = (Integer) result.get("totalCount");
            int totalPages = (Integer) result.get("totalPages");
            
            logger.info("Found {} branches (page {}/{}) for instituteId: {}", branches.size(), page, totalPages, instituteId);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"branches\":[");
            
            for (int i = 0; i < branches.size(); i++) {
                Branch b = branches.get(i);
                json.append("{");
                json.append("\"branchId\":\"").append(escapeJson(b.getBranchId())).append("\",");
                json.append("\"branchCode\":\"").append(escapeJson(b.getBranchCode())).append("\",");
                json.append("\"branchName\":\"").append(escapeJson(b.getBranchName())).append("\",");
                json.append("\"branchManagerId\":\"").append(escapeJson(b.getBranchManagerId())).append("\",");
                json.append("\"branchManagerName\":\"").append(escapeJson(b.getBranchManagerName())).append("\",");
                logger.debug("Branch: {}, ManagerID: {}, ManagerName: {}", b.getBranchName(), b.getBranchManagerId(), b.getBranchManagerName());
                json.append("\"city\":\"").append(escapeJson(b.getCity())).append("\",");
                json.append("\"state\":\"").append(escapeJson(b.getState())).append("\",");
                json.append("\"phone\":\"").append(escapeJson(b.getPhone())).append("\",");
                json.append("\"email\":\"").append(escapeJson(b.getEmail())).append("\",");
                json.append("\"address\":\"").append(escapeJson(b.getAddress())).append("\",");
                json.append("\"status\":\"").append(escapeJson(b.getStatus())).append("\"");
                json.append("}");
                
                if (i < branches.size() - 1) {
                    json.append(",");
                }
            }
            
            json.append("],");
            json.append("\"totalCount\":").append(totalCount).append(",");
            json.append("\"totalPages\":").append(totalPages).append(",");
            json.append("\"currentPage\":").append(page).append(",");
            json.append("\"pageSize\":").append(limit);
            json.append("}");
            
            response.getWriter().write(json.toString());
            
        } catch (Exception e) {
            logger.error("Error listing branches", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
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
