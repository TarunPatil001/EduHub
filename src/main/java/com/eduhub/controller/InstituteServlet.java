package com.eduhub.controller;

import com.eduhub.dao.impl.InstituteDAOImpl;
import com.eduhub.dao.interfaces.InstituteDAO;
import com.eduhub.model.Institute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet("/api/institute/*")
public class InstituteServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(InstituteServlet.class);
    private InstituteDAO instituteDAO;
    
    @Override
    public void init() throws ServletException {
        instituteDAO = new InstituteDAOImpl();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid endpoint\"}");
            return;
        }
        
        if (pathInfo.equals("/update")) {
            handleUpdateInstitute(request, response, out);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"status\":\"error\",\"message\":\"Endpoint not found\"}");
        }
    }
    
    private void handleUpdateInstitute(HttpServletRequest request, HttpServletResponse response, PrintWriter out) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"status\":\"error\",\"message\":\"Unauthorized access\"}");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Institute ID not found in session\"}");
            return;
        }
        
        try {
            // Read parameters (expecting form-urlencoded or query params)
            String name = request.getParameter("instituteName");
            String type = request.getParameter("instituteType");
            String email = request.getParameter("instituteEmail");
            String phone = request.getParameter("institutePhone");
            String address = request.getParameter("address");
            String city = request.getParameter("city");
            String state = request.getParameter("state");
            String zipCode = request.getParameter("zipCode");
            String country = request.getParameter("country");
            
            Institute updatedData = new Institute();
            updatedData.setInstituteId(instituteId);
            updatedData.setInstituteName(name);
            updatedData.setInstituteType(type);
            updatedData.setInstituteEmail(email);
            updatedData.setInstitutePhone(phone);
            updatedData.setAddress(address);
            updatedData.setCity(city);
            updatedData.setState(state);
            updatedData.setZipCode(zipCode);
            updatedData.setCountry(country);
            
            // Perform update
            boolean success = instituteDAO.updateInstitute(updatedData);
            String section = request.getParameter("section");
            if (section == null || section.isEmpty()) {
                section = "profile-section";
            }
            String redirectUrl;
            
            if (success) {
                logger.info("Institute profile updated successfully for ID: {}", instituteId);
                redirectUrl = request.getContextPath() + "/dashboard/pages/settings.jsp?status=success&message=Institute+profile+updated+successfully";
            } else {
                logger.error("Failed to update institute profile for ID: {}", instituteId);
                redirectUrl = request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Failed+to+update+institute+profile";
            }
            
            if (section != null && !section.isEmpty()) {
                redirectUrl += "&section=" + section + "#" + section;
            }
            
            response.sendRedirect(redirectUrl);
            
        } catch (SQLException e) {
            logger.error("Database error updating institute profile", e);
            String section = request.getParameter("section");
            if (section == null || section.isEmpty()) {
                section = "profile-section";
            }
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Database+error&section=" + section + "#" + section);
        } catch (Exception e) {
            logger.error("Unexpected error updating institute profile", e);
            String section = request.getParameter("section");
            if (section == null || section.isEmpty()) {
                section = "profile-section";
            }
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/settings.jsp?status=error&message=Invalid+request+data&section=" + section + "#" + section);
        }
    }
}
