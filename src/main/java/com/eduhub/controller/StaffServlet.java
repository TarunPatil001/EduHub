package com.eduhub.controller;

import com.eduhub.dao.impl.StaffDAOImpl;
import com.eduhub.dao.interfaces.StaffDAO;
import com.eduhub.model.Staff;
import com.eduhub.model.StaffCertification;
import com.eduhub.model.StaffDocument;
import com.eduhub.util.CloudinaryUtil;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebServlet("/staff/*")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2, // 2MB
    maxFileSize = 1024 * 1024 * 10,      // 10MB
    maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class StaffServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(StaffServlet.class);
    private StaffDAO staffDAO;

    @Override
    public void init() throws ServletException {
        staffDAO = new StaffDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getPathInfo();
        
        if ("/add".equals(action)) {
            addStaff(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void addStaff(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        logger.debug("Received request to add staff");
        HttpSession session = request.getSession();
        
        String instituteId = (String) session.getAttribute("instituteId");
        logger.debug("Session instituteId: {}", instituteId);
        
        if (instituteId == null) {
            logger.warn("User not logged in or instituteId missing in session");
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        try {
            // Extract parameters
            String firstName = request.getParameter("firstName");
            String lastName = request.getParameter("lastName");
            LocalDate dateOfBirth = LocalDate.parse(request.getParameter("dateOfBirth"));
            String gender = request.getParameter("gender");
            String nationality = request.getParameter("nationality");
            String maritalStatus = request.getParameter("maritalStatus");
            String employeeId = request.getParameter("employeeId");
            String role = request.getParameter("role");
            LocalDate joiningDate = LocalDate.parse(request.getParameter("joiningDate"));
            String employmentType = request.getParameter("employmentType");
            BigDecimal salary = new BigDecimal(request.getParameter("salary"));
            String workShift = request.getParameter("workShift");
            String reportingManager = request.getParameter("reportingManager");
            String phone = request.getParameter("phone");
            String email = request.getParameter("email");
            String address = request.getParameter("address");
            String city = request.getParameter("city");
            String state = request.getParameter("state");
            String postalCode = request.getParameter("postalCode");
            String emergencyContactName = request.getParameter("emergencyContactName");
            String emergencyContactPhone = request.getParameter("emergencyContactPhone");
            String emergencyContactRelation = request.getParameter("emergencyContactRelation");
            String highestQualification = request.getParameter("highestQualification");
            String specialization = request.getParameter("specialization");
            Double experience = Double.parseDouble(request.getParameter("experience"));
            String status = request.getParameter("status");
            
            // Validate unique constraints
            if (staffDAO.isEmailExists(email)) {
                request.setAttribute("error", "Email already exists");
                request.getRequestDispatcher("/dashboard/pages/staff/add-staff.jsp").forward(request, response);
                return;
            }
            
            if (staffDAO.isEmployeeIdExists(instituteId, employeeId)) {
                request.setAttribute("error", "Employee ID already exists");
                request.getRequestDispatcher("/dashboard/pages/staff/add-staff.jsp").forward(request, response);
                return;
            }

            // Handle Profile Photo Upload
            String profilePhotoUrl = null;
            Part filePart = request.getPart("staffPhoto");
            if (filePart != null && filePart.getSize() > 0) {
                profilePhotoUrl = uploadFile(filePart, "eduhub/staff_photos/" + instituteId);
            }

            // Create Staff object
            Staff staff = new Staff();
            staff.setStaffId(UUID.randomUUID().toString());
            staff.setInstituteId(instituteId);
            staff.setFirstName(firstName);
            staff.setLastName(lastName);
            staff.setDateOfBirth(dateOfBirth);
            staff.setGender(gender);
            staff.setNationality(nationality);
            staff.setMaritalStatus(maritalStatus);
            staff.setEmployeeId(employeeId);
            staff.setRole(role);
            staff.setJoiningDate(joiningDate);
            staff.setEmploymentType(employmentType);
            staff.setSalary(salary);
            staff.setWorkShift(workShift);
            staff.setReportingManager(reportingManager);
            staff.setPhone(phone);
            staff.setEmail(email);
            staff.setAddress(address);
            staff.setCity(city);
            staff.setState(state);
            staff.setPostalCode(postalCode);
            staff.setEmergencyContactName(emergencyContactName);
            staff.setEmergencyContactPhone(emergencyContactPhone);
            staff.setEmergencyContactRelation(emergencyContactRelation);
            staff.setHighestQualification(highestQualification);
            staff.setSpecialization(specialization);
            staff.setExperience(experience);
            staff.setStatus(status);
            staff.setProfilePhotoUrl(profilePhotoUrl);

            // Save to database
            staffDAO.addStaff(staff);
            
            // Handle Certifications
            String certIndicesStr = request.getParameter("certificationIndices");
            if (certIndicesStr != null && !certIndicesStr.isEmpty()) {
                String[] indices = certIndicesStr.split(",");
                for (String index : indices) {
                    if (index.trim().isEmpty()) continue;
                    
                    String name = request.getParameter("certName_" + index);
                    String org = request.getParameter("certOrg_" + index);
                    String dateStr = request.getParameter("certDate_" + index);
                    String expiryStr = request.getParameter("certExpiry_" + index);
                    String credId = request.getParameter("certId_" + index);
                    String verifyUrl = request.getParameter("certUrl_" + index);
                    
                    if (name != null && !name.isEmpty()) {
                        StaffCertification cert = new StaffCertification();
                        cert.setCertificationId(UUID.randomUUID().toString());
                        cert.setStaffId(staff.getStaffId());
                        cert.setName(name);
                        cert.setIssuingOrganization(org);
                        cert.setIssueDate(LocalDate.parse(dateStr));
                        if (expiryStr != null && !expiryStr.isEmpty()) {
                            cert.setExpiryDate(LocalDate.parse(expiryStr));
                        }
                        cert.setCredentialId(credId);
                        cert.setVerificationUrl(verifyUrl);
                        
                        // Upload Certificate File
                        Part certPart = request.getPart("certFile_" + index);
                        if (certPart != null && certPart.getSize() > 0) {
                            String certUrl = uploadFile(certPart, "eduhub/staff_certs/" + instituteId);
                            cert.setCertificateFileUrl(certUrl);
                        }
                        
                        staffDAO.addCertification(cert);
                    }
                }
            }

            // Handle Documents
            List<String> docTypes = Arrays.asList("resume", "aadharCard", "panCard", "marksheet", "degreeCertificate", "jobGuarantee");
            for (String docType : docTypes) {
                Part docPart = request.getPart(docType);
                if (docPart != null && docPart.getSize() > 0) {
                    String docUrl = uploadFile(docPart, "eduhub/staff_docs/" + instituteId);
                    
                    StaffDocument doc = new StaffDocument();
                    doc.setDocumentId(UUID.randomUUID().toString());
                    doc.setStaffId(staff.getStaffId());
                    doc.setDocumentType(docType);
                    doc.setDocumentUrl(docUrl);
                    
                    staffDAO.addDocument(doc);
                }
            }
            
            // Redirect to add staff page with success message
            session.setAttribute("successMessage", "Staff member added successfully");
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/add-staff.jsp");

        } catch (SQLException e) {
            logger.error("Database error while adding staff", e);
            request.setAttribute("error", "Database error: " + e.getMessage());
            request.getRequestDispatcher("/dashboard/pages/staff/add-staff.jsp").forward(request, response);
        } catch (Exception e) {
            logger.error("Error while adding staff", e);
            request.setAttribute("error", "Error: " + e.getMessage());
            request.getRequestDispatcher("/dashboard/pages/staff/add-staff.jsp").forward(request, response);
        }
    }
    
    private String uploadFile(Part filePart, String folder) throws IOException {
        try (InputStream inputStream = filePart.getInputStream()) {
            byte[] fileBytes = inputStream.readAllBytes();
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", folder);
            uploadParams.put("public_id", "file_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
            uploadParams.put("resource_type", "auto");
            
            Map uploadResult = CloudinaryUtil.getCloudinary().uploader().upload(fileBytes, uploadParams);
            return (String) uploadResult.get("secure_url");
        }
    }
}
