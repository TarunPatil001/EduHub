package com.eduhub.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.eduhub.model.Course;
import com.eduhub.service.interfaces.CourseService;
import com.eduhub.service.impl.CourseServiceImpl;

@WebServlet(urlPatterns = {"/api/courses/list", "/api/courses/create", "/api/courses/delete", "/api/courses/stats", "/api/courses/update", "/api/courses/active"})
public class CourseServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseServlet.class);
    private CourseService courseService;
    
    @Override
    public void init() throws ServletException {
        courseService = new CourseServiceImpl();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        logger.info("doGet called with servletPath: {}", servletPath);
        
        if (servletPath.endsWith("/list")) {
            handleListCourses(request, response);
        } else if (servletPath.endsWith("/stats")) {
            handleGetStats(request, response);
        } else if (servletPath.endsWith("/active")) {
            handleListActiveCourses(request, response);
        } else {
            logger.warn("Endpoint not found in doGet: {}", servletPath);
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }

    private void handleListActiveCourses(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleListActiveCourses called");
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
            List<Course> courses = courseService.getActiveCourses(instituteId);
            
            StringBuilder json = new StringBuilder();
            json.append("[");
            for (int i = 0; i < courses.size(); i++) {
                Course course = courses.get(i);
                json.append(convertCourseToJson(course));
                if (i < courses.size() - 1) {
                    json.append(",");
                }
            }
            json.append("]");
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json.toString());
        } catch (Exception e) {
            logger.error("Error fetching active courses", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching active courses");
        }
    }

    private void handleGetStats(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleGetStats called");
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
            java.util.Map<String, Integer> stats = courseService.getCourseStatistics(instituteId);
            
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"totalCourses\":").append(stats.get("totalCourses")).append(",");
            json.append("\"activeCourses\":").append(stats.get("activeCourses")).append(",");
            json.append("\"totalStudents\":").append(stats.get("totalStudents")).append(",");
            json.append("\"totalTeachers\":").append(stats.get("totalTeachers"));
            json.append("}");
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json.toString());
        } catch (Exception e) {
            logger.error("Error fetching course stats", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching course stats");
        }
    }

    private void handleListCourses(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleListCourses called");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            logger.warn("Unauthorized access to list courses - No session or userId");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            // If instituteId is missing but user is logged in, the session might be invalid or incomplete.
            // Force re-login.
            logger.warn("User {} logged in but instituteId missing from session. Forcing re-login.", session.getAttribute("userId"));
            session.invalidate();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Session incomplete - Institute ID missing");
            return;
        }
        
        try {
            int page = 1;
            int limit = 10;
            
            String pageParam = request.getParameter("page");
            String limitParam = request.getParameter("limit");
            String search = request.getParameter("search");
            String category = request.getParameter("category");
            String level = request.getParameter("level");
            String status = request.getParameter("status");
            
            if (pageParam != null && !pageParam.isEmpty()) {
                try {
                    page = Integer.parseInt(pageParam);
                    if (page < 1) page = 1;
                } catch (NumberFormatException e) {
                    logger.warn("Invalid page parameter: {}", pageParam);
                }
            }
            
            if (limitParam != null && !limitParam.isEmpty()) {
                try {
                    limit = Integer.parseInt(limitParam);
                    if (limit < 1) limit = 10;
                } catch (NumberFormatException e) {
                    logger.warn("Invalid limit parameter: {}", limitParam);
                }
            }

            logger.info("Fetching courses for instituteId: {}, page: {}, limit: {}, search: {}, category: {}, level: {}, status: {}", 
                    instituteId, page, limit, search, category, level, status);
            
            // Calculate offset
            int offset = (page - 1) * limit;
            
            java.util.List<Course> courses = courseService.getCourses(instituteId, page, limit, search, category, level, status);
            int totalItems = courseService.getTotalCourseCount(instituteId, search, category, level, status);
            int totalPages = (int) Math.ceil((double) totalItems / limit);
            
            logger.info("Found {} courses, total items: {}", courses.size(), totalItems);
            
            String json = convertCoursesToJson(courses, page, limit, totalItems, totalPages);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } catch (Exception e) {
            logger.error("Error fetching courses", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching courses");
        }
    }

    private String convertCoursesToJson(java.util.List<Course> courses, int currentPage, int itemsPerPage, int totalItems, int totalPages) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"courses\": [");
        for (int i = 0; i < courses.size(); i++) {
            Course course = courses.get(i);
            json.append(convertCourseToJson(course));
            if (i < courses.size() - 1) {
                json.append(",");
            }
        }
        json.append("],");
        json.append("\"pagination\": {");
        json.append("\"currentPage\": ").append(currentPage).append(",");
        json.append("\"itemsPerPage\": ").append(itemsPerPage).append(",");
        json.append("\"totalItems\": ").append(totalItems).append(",");
        json.append("\"totalPages\": ").append(totalPages);
        json.append("}");
        json.append("}");
        return json.toString();
    }

    private String convertCourseToJson(Course course) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"id\":\"").append(escapeJson(course.getCourseId())).append("\",");
        json.append("\"code\":\"").append(escapeJson(course.getCourseCode())).append("\",");
        json.append("\"name\":\"").append(escapeJson(course.getCourseName())).append("\",");
        json.append("\"category\":\"").append(escapeJson(course.getCategory())).append("\",");
        json.append("\"level\":\"").append(escapeJson(course.getLevel())).append("\",");
        json.append("\"description\":\"").append(escapeJson(course.getDescription())).append("\",");
        json.append("\"modules\":\"").append(escapeJson(course.getModules())).append("\",");
        json.append("\"duration\":\"").append(course.getDurationValue()).append(" ").append(escapeJson(course.getDurationUnit())).append("\",");
        json.append("\"maxStudents\":").append(0).append(","); // Assuming maxStudents is not in Course model yet, defaulting to 0
        json.append("\"fee\":").append(course.getFee()).append(",");
        json.append("\"modeOfConduct\":\"").append("offline").append("\","); // Defaulting as it's not in model
        json.append("\"startDate\":\"").append("").append("\","); // Defaulting
        json.append("\"endDate\":\"").append("").append("\","); // Defaulting
        json.append("\"teacher\":\"").append("").append("\","); // Defaulting
        json.append("\"certificateOffered\":").append(course.isCertificateOffered()).append(",");
        json.append("\"status\":\"").append(escapeJson(course.getStatus())).append("\"");
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        logger.info("doPost called with servletPath: {}", servletPath);
        
        if (servletPath.endsWith("/create")) {
            handleCreateCourse(request, response);
        } else if (servletPath.endsWith("/update")) {
            handleUpdateCourse(request, response);
        } else if (servletPath.endsWith("/delete")) {
            handleDeleteCourses(request, response);
        } else {
            logger.warn("Endpoint not found in doPost: {}", servletPath);
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }
    
    private void handleCreateCourse(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleCreateCourse called");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            logger.warn("Unauthorized access to create course - No session or userId");
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        logger.debug("instituteId from session: {}", instituteId);
        
        if (instituteId == null) {
            logger.warn("Institute ID not found in session for user: {}", session.getAttribute("userId"));
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-course.jsp?status=error&message=Institute+ID+not+found");
            return;
        }
        
        try {
            String courseCode = request.getParameter("courseCode");
            String courseName = request.getParameter("courseName");
            logger.info("Creating course - Code: {}, Name: {}", courseCode, courseName);
            
            String category = request.getParameter("category");
            String level = request.getParameter("level");
            String description = request.getParameter("description");
            String modules = request.getParameter("modules");
            
            String durationValueStr = request.getParameter("durationValue");
            int durationValue = (durationValueStr != null && !durationValueStr.isEmpty()) ? Integer.parseInt(durationValueStr) : 0;
            
            String durationUnit = request.getParameter("durationUnit");
            
            String feeStr = request.getParameter("fee");
            BigDecimal fee = (feeStr != null && !feeStr.isEmpty()) ? new BigDecimal(feeStr) : BigDecimal.ZERO;
            
            String status = request.getParameter("status");
            boolean certificateOffered = "yes".equalsIgnoreCase(request.getParameter("certificateOffered"));
            
            Course course = new Course();
            course.setInstituteId(instituteId);
            course.setCourseCode(courseCode);
            course.setCourseName(courseName);
            course.setCategory(category);
            course.setLevel(level);
            course.setDescription(description);
            course.setModules(modules);
            course.setDurationValue(durationValue);
            course.setDurationUnit(durationUnit);
            course.setFee(fee);
            course.setStatus(status);
            course.setCertificateOffered(certificateOffered);
            
            boolean success = courseService.createCourse(course);
            logger.info("createCourse result: {}", success);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-course.jsp?success=course_created&message=Course+created+successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-course.jsp?error=creation_failed&message=Failed+to+create+course.+Code+might+already+exist.");
            }
            
        } catch (NumberFormatException e) {
            logger.error("Invalid number format", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-course.jsp?status=error&message=Invalid+number+format");
        } catch (Exception e) {
            logger.error("Error creating course", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/courses/create-course.jsp?status=error&message=An+unexpected+error+occurred");
        }
    }

    private void handleUpdateCourse(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleUpdateCourse called");
        HttpSession session = request.getSession(false);
        
        // Set response type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        if (session == null || session.getAttribute("userId") == null) {
            logger.warn("Unauthorized access to update course - No session or userId");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\": false, \"message\": \"Unauthorized access\"}");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            logger.warn("Institute ID not found in session for user: {}", session.getAttribute("userId"));
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\": false, \"message\": \"Institute ID not found in session\"}");
            return;
        }
        
        try {
            String courseId = request.getParameter("id");
            if (courseId == null || courseId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"message\": \"Course ID missing\"}");
                return;
            }

            String courseCode = request.getParameter("courseCode");
            String courseName = request.getParameter("courseName");
            logger.info("Updating course - ID: {}, Code: {}, Name: {}", courseId, courseCode, courseName);
            
            String category = request.getParameter("category");
            String level = request.getParameter("level");
            String description = request.getParameter("description");
            String modules = request.getParameter("modules");
            
            String durationValueStr = request.getParameter("durationValue");
            int durationValue = (durationValueStr != null && !durationValueStr.isEmpty()) ? Integer.parseInt(durationValueStr) : 0;
            
            String durationUnit = request.getParameter("durationUnit");
            
            String feeStr = request.getParameter("fee");
            BigDecimal fee = (feeStr != null && !feeStr.isEmpty()) ? new BigDecimal(feeStr) : BigDecimal.ZERO;
            
            String status = request.getParameter("status");
            boolean certificateOffered = "yes".equalsIgnoreCase(request.getParameter("certificateOffered"));
            
            Course course = new Course();
            course.setCourseId(courseId);
            course.setInstituteId(instituteId);
            course.setCourseCode(courseCode);
            course.setCourseName(courseName);
            course.setCategory(category);
            course.setLevel(level);
            course.setDescription(description);
            course.setModules(modules);
            course.setDurationValue(durationValue);
            course.setDurationUnit(durationUnit);
            course.setFee(fee);
            course.setStatus(status);
            course.setCertificateOffered(certificateOffered);
            
            boolean success = courseService.updateCourse(course);
            logger.info("updateCourse result: {}", success);
            
            if (success) {
                response.getWriter().write("{\"success\": true, \"message\": \"Course updated successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"message\": \"Failed to update course\"}");
            }
            
        } catch (NumberFormatException e) {
            logger.error("Invalid number format", e);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\": false, \"message\": \"Invalid number format\"}");
        } catch (Exception e) {
            logger.error("Error updating course", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"An unexpected error occurred\"}");
        }
    }

    private void handleDeleteCourses(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.info("handleDeleteCourses called");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            logger.warn("Unauthorized access to delete courses - No session or userId");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            logger.warn("User {} logged in but instituteId missing from session during delete. Forcing re-login.", session.getAttribute("userId"));
            session.invalidate();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Session incomplete - Institute ID missing");
            return;
        }

        String idsParam = request.getParameter("ids");
        logger.info("Deleting courses with IDs: {}", idsParam);
        
        if (idsParam == null || idsParam.isEmpty()) {
            logger.warn("No course IDs provided for deletion");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "No course IDs provided");
            return;
        }

        String[] courseIds = idsParam.split(",");
        boolean allDeleted = true;
        int deletedCount = 0;

        for (String courseId : courseIds) {
            if (courseId != null && !courseId.trim().isEmpty()) {
                // Verify the course belongs to the institute before deleting
                boolean deleted = courseService.deleteCourse(courseId.trim(), instituteId);
                if (deleted) {
                    deletedCount++;
                } else {
                    allDeleted = false;
                    logger.warn("Failed to delete course ID: {} (possibly not found or unauthorized)", courseId);
                }
            }
        }
        
        logger.info("Deleted {} courses", deletedCount);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        if (deletedCount > 0) {
            response.getWriter().write("{\"success\": true, \"message\": \"" + deletedCount + " course(s) deleted successfully\", \"deletedCount\": " + deletedCount + "}");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"Failed to delete courses\"}");
        }
    }
}
