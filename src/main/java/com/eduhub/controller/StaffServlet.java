package com.eduhub.controller;

import com.eduhub.dao.impl.StaffDAOImpl;
import com.eduhub.dao.interfaces.StaffDAO;
import com.eduhub.model.Staff;
import com.eduhub.model.StaffCertification;
import com.eduhub.model.StaffDocument;
import com.eduhub.util.CloudinaryUtil;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getPathInfo();
        
        if ("/list".equals(action)) {
            listStaff(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getPathInfo();
        
        if ("/add".equals(action)) {
            addStaff(request, response);
        } else if ("/update".equals(action)) {
            updateStaff(request, response);
        } else if ("/delete".equals(action)) {
            deleteStaff(request, response);
        } else if ("/deleteBulk".equals(action)) {
            deleteStaffBulk(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void listStaff(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        logger.debug("Received request to list staff");
        HttpSession session = request.getSession();
        
        String instituteId = (String) session.getAttribute("instituteId");
        
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        try {
            // Get filter parameters
            String searchQuery = request.getParameter("search");
            String roleFilter = request.getParameter("role");
            String statusFilter = request.getParameter("status");
            
            // Get pagination parameters
            int currentPage = 1;
            int limit = 10;
            
            try {
                if (request.getParameter("page") != null) {
                    currentPage = Integer.parseInt(request.getParameter("page"));
                }
                if (request.getParameter("limit") != null) {
                    limit = Integer.parseInt(request.getParameter("limit"));
                }
            } catch (NumberFormatException e) {
                logger.warn("Invalid pagination parameters, using defaults");
            }
            
            int offset = (currentPage - 1) * limit;
            
            // Get filtered data
            List<Staff> staffList = staffDAO.getStaffList(instituteId, searchQuery, roleFilter, statusFilter, offset, limit);
            int totalFilteredStaff = staffDAO.getStaffCount(instituteId, searchQuery, roleFilter, statusFilter);
            
            // Get stats
            int totalStaff = staffDAO.getStaffCount(instituteId, null, null, null);
            int activeStaff = staffDAO.getStaffCount(instituteId, null, null, "Active");
            
            // Get distinct roles
            List<String> availableRoles = staffDAO.getDistinctRoles(instituteId);
            
            // Set attributes for JSP
            request.setAttribute("staffList", staffList);
            request.setAttribute("totalFilteredStaff", totalFilteredStaff);
            request.setAttribute("totalStaff", totalStaff);
            request.setAttribute("activeStaff", activeStaff);
            request.setAttribute("availableRoles", availableRoles);
            request.setAttribute("currentPage", currentPage);
            request.setAttribute("limit", limit);
            request.setAttribute("searchQuery", searchQuery);
            request.setAttribute("roleFilter", roleFilter);
            request.setAttribute("statusFilter", statusFilter);
            
            // Forward to JSP
            request.getRequestDispatcher("/dashboard/pages/staff/all-staff.jsp").forward(request, response);
            
        } catch (SQLException e) {
            logger.error("Database error while listing staff", e);
            request.setAttribute("error", "Error loading staff data: " + e.getMessage());
            request.getRequestDispatcher("/dashboard/pages/staff/all-staff.jsp").forward(request, response);
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
            String branchId = request.getParameter("branchId");
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
            staff.setBranchId(branchId);
            staff.setDepartment(request.getParameter("department"));
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
    
    private void updateStaff(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        logger.debug("Received request to update staff");
        HttpSession session = request.getSession();
        
        String instituteId = (String) session.getAttribute("instituteId");
        String staffId = request.getParameter("staffId");
        
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        try {
            // Fetch existing staff
            Staff existingStaff = staffDAO.getStaffById(staffId, instituteId);
            if (existingStaff == null) {
                request.setAttribute("error", "Staff member not found");
                request.getRequestDispatcher("/dashboard/pages/staff/all-staff.jsp").forward(request, response);
                return;
            }
            
            // Fetch existing related data for updates
            List<StaffCertification> existingCerts = staffDAO.getCertificationsByStaffId(staffId);
            List<StaffDocument> existingDocs = staffDAO.getDocumentsByStaffId(staffId);

            // Extract parameters
            String firstName = request.getParameter("firstName");
            String lastName = request.getParameter("lastName");
            LocalDate dateOfBirth = LocalDate.parse(request.getParameter("dateOfBirth"));
            String gender = request.getParameter("gender");
            String nationality = request.getParameter("nationality");
            String maritalStatus = request.getParameter("maritalStatus");
            String employeeId = request.getParameter("employeeId");
            String role = request.getParameter("role");
            String branchId = request.getParameter("branchId");
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
            
            // Validate unique constraints if changed
            if (!email.equals(existingStaff.getEmail()) && staffDAO.isEmailExists(email)) {
                request.setAttribute("error", "Email already exists");
                request.getRequestDispatcher("/dashboard/pages/staff/edit-staff.jsp?id=" + staffId).forward(request, response);
                return;
            }
            
            if (!employeeId.equals(existingStaff.getEmployeeId()) && staffDAO.isEmployeeIdExists(instituteId, employeeId)) {
                request.setAttribute("error", "Employee ID already exists");
                request.getRequestDispatcher("/dashboard/pages/staff/edit-staff.jsp?id=" + staffId).forward(request, response);
                return;
            }

            // --- PREPARATION & UPLOAD PHASE ---
            // Perform all file uploads first. If any fail, we abort before touching the database.

            // 1. Profile Photo
            String profilePhotoUrl = existingStaff.getProfilePhotoUrl();
            Part filePart = request.getPart("staffPhoto");
            if (filePart != null && filePart.getSize() > 0) {
                if (profilePhotoUrl != null && !profilePhotoUrl.isEmpty()) {
                    deleteFile(profilePhotoUrl);
                }
                profilePhotoUrl = uploadFile(filePart, "eduhub/staff_photos/" + instituteId);
            }

            // 2. Certifications (New & Updated)
            List<StaffCertification> certsToAdd = new ArrayList<>();
            List<StaffCertification> certsToUpdate = new ArrayList<>();
            
            String certIndicesStr = request.getParameter("certificationIndices");
            if (certIndicesStr != null && !certIndicesStr.isEmpty()) {
                String[] indices = certIndicesStr.split(",");
                for (String index : indices) {
                    if (index.trim().isEmpty()) continue;
                    
                    String certIdPK = request.getParameter("certId_" + index);
                    String name = request.getParameter("certName_" + index);
                    String org = request.getParameter("certOrg_" + index);
                    String dateStr = request.getParameter("certDate_" + index);
                    String expiryStr = request.getParameter("certExpiry_" + index);
                    String credId = request.getParameter("certId_" + index + "_val"); // Note: _val suffix for credential ID in edit form
                    if (credId == null) credId = request.getParameter("certId_" + index); // Fallback for new items if JS uses old name
                    
                    String verifyUrl = request.getParameter("certUrl_" + index);
                    
                    if (name != null && !name.isEmpty()) {
                        if (certIdPK != null && !certIdPK.isEmpty()) {
                            // Existing Certification - Update
                            String finalCertIdPK = certIdPK;
                            StaffCertification cert = existingCerts.stream()
                                .filter(c -> c.getCertificationId().equals(finalCertIdPK))
                                .findFirst().orElse(null);
                                
                            if (cert != null) {
                                cert.setName(name);
                                cert.setIssuingOrganization(org);
                                cert.setIssueDate(LocalDate.parse(dateStr));
                                if (expiryStr != null && !expiryStr.isEmpty()) {
                                    cert.setExpiryDate(LocalDate.parse(expiryStr));
                                } else {
                                    cert.setExpiryDate(null);
                                }
                                cert.setCredentialId(credId);
                                cert.setVerificationUrl(verifyUrl);
                                
                                Part certPart = request.getPart("certFile_" + index);
                                if (certPart != null && certPart.getSize() > 0) {
                                    logger.info("Found replacement file for certification: {}", index);
                                    if (cert.getCertificateFileUrl() != null) {
                                        deleteFile(cert.getCertificateFileUrl());
                                    }
                                    String certUrl = uploadFile(certPart, "eduhub/staff_certs/" + instituteId);
                                    cert.setCertificateFileUrl(certUrl);
                                } else {
                                    logger.debug("No replacement file found for certification: {}", index);
                                }
                                certsToUpdate.add(cert);
                            }
                        } else {
                            // New Certification - Add
                            StaffCertification cert = new StaffCertification();
                            cert.setCertificationId(UUID.randomUUID().toString());
                            cert.setStaffId(staffId);
                            cert.setName(name);
                            cert.setIssuingOrganization(org);
                            cert.setIssueDate(LocalDate.parse(dateStr));
                            if (expiryStr != null && !expiryStr.isEmpty()) {
                                cert.setExpiryDate(LocalDate.parse(expiryStr));
                            }
                            cert.setCredentialId(credId);
                            cert.setVerificationUrl(verifyUrl);
                            
                            Part certPart = request.getPart("certFile_" + index);
                            if (certPart != null && certPart.getSize() > 0) {
                                String certUrl = uploadFile(certPart, "eduhub/staff_certs/" + instituteId);
                                cert.setCertificateFileUrl(certUrl);
                            }
                            
                            certsToAdd.add(cert);
                        }
                    }
                }
            }

            // 3. Documents (New & Updated)
            List<StaffDocument> docsToAdd = new ArrayList<>();
            List<StaffDocument> docsToUpdate = new ArrayList<>();
            
            // Handle New Documents (Fixed types)
            List<String> docTypes = Arrays.asList("resume", "aadharCard", "panCard", "marksheet", "degreeCertificate", "jobGuarantee");
            for (String docType : docTypes) {
                Part docPart = request.getPart(docType);
                if (docPart != null && docPart.getSize() > 0) {
                    String docUrl = uploadFile(docPart, "eduhub/staff_docs/" + instituteId);
                    
                    StaffDocument doc = new StaffDocument();
                    doc.setDocumentId(UUID.randomUUID().toString());
                    doc.setStaffId(staffId);
                    doc.setDocumentType(docType);
                    doc.setDocumentUrl(docUrl);
                    
                    docsToAdd.add(doc);
                }
            }
            
            // Handle Existing Documents
            String[] existingDocIds = request.getParameterValues("existingDocId");
            if (existingDocIds != null) {
                for (String docId : existingDocIds) {
                    String finalDocId = docId;
                    StaffDocument doc = existingDocs.stream()
                        .filter(d -> d.getDocumentId().equals(finalDocId))
                        .findFirst().orElse(null);
                        
                    if (doc != null) {
                        String newType = request.getParameter("docType_" + docId);
                        if (newType != null && !newType.isEmpty()) {
                            doc.setDocumentType(newType);
                        }
                        
                        Part docPart = request.getPart("docFile_" + docId);
                        if (docPart != null && docPart.getSize() > 0) {
                            logger.info("Found replacement file for document: {}", docId);
                            if (doc.getDocumentUrl() != null) {
                                deleteFile(doc.getDocumentUrl());
                            }
                            String docUrl = uploadFile(docPart, "eduhub/staff_docs/" + instituteId);
                            doc.setDocumentUrl(docUrl);
                        } else {
                            logger.debug("No replacement file found for document: {}", docId);
                        }
                        docsToUpdate.add(doc);
                    }
                }
            }

            // --- PERSISTENCE PHASE ---
            // All uploads succeeded. Now apply changes to the database.

            // 1. Update Staff Details
            Staff staff = new Staff();
            staff.setStaffId(staffId);
            staff.setInstituteId(instituteId);
            staff.setBranchId(branchId);
            staff.setDepartment(request.getParameter("department"));
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

            staffDAO.updateStaff(staff);
            
            // 2. Handle Deletions (Certifications)
            String deletedCertIdsStr = request.getParameter("deletedCertificationIds");
            if (deletedCertIdsStr != null && !deletedCertIdsStr.isEmpty()) {
                String[] certIds = deletedCertIdsStr.split(",");
                for (String certId : certIds) {
                    if (!certId.trim().isEmpty()) {
                        String finalCertId = certId.trim();
                        StaffCertification certToDelete = existingCerts.stream()
                            .filter(c -> c.getCertificationId().equals(finalCertId))
                            .findFirst().orElse(null);
                        
                        if (certToDelete != null && certToDelete.getCertificateFileUrl() != null) {
                            deleteFile(certToDelete.getCertificateFileUrl());
                        }
                        
                        logger.info("Deleting certification: {}", certId);
                        staffDAO.deleteCertification(certId.trim());
                    }
                }
            }

            // 3. Handle Deletions (Documents)
            String deletedDocIdsStr = request.getParameter("deletedDocumentIds");
            if (deletedDocIdsStr != null && !deletedDocIdsStr.isEmpty()) {
                String[] docIds = deletedDocIdsStr.split(",");
                for (String docId : docIds) {
                    if (!docId.trim().isEmpty()) {
                        String finalDocId = docId.trim();
                        StaffDocument docToDelete = existingDocs.stream()
                            .filter(d -> d.getDocumentId().equals(finalDocId))
                            .findFirst().orElse(null);
                            
                        if (docToDelete != null && docToDelete.getDocumentUrl() != null) {
                            deleteFile(docToDelete.getDocumentUrl());
                        }
                        
                        logger.info("Deleting document: {}", docId);
                        staffDAO.deleteDocument(docId.trim());
                    }
                }
            }
            
            // 4. Apply Updates
            for (StaffCertification cert : certsToUpdate) {
                staffDAO.updateCertification(cert);
            }
            for (StaffDocument doc : docsToUpdate) {
                staffDAO.updateDocument(doc);
            }
            
            // 5. Apply Adds
            for (StaffCertification cert : certsToAdd) {
                staffDAO.addCertification(cert);
            }
            for (StaffDocument doc : docsToAdd) {
                staffDAO.addDocument(doc);
            }
            
            session.setAttribute("successMessage", "Staff member updated successfully");
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");

        } catch (SQLException e) {
            logger.error("Database error while updating staff", e);
            request.setAttribute("error", "Database error: " + e.getMessage());
            request.getRequestDispatcher("/dashboard/pages/staff/edit-staff.jsp?id=" + staffId).forward(request, response);
        } catch (Exception e) {
            logger.error("Error while updating staff", e);
            request.setAttribute("error", "Error: " + e.getMessage());
            request.getRequestDispatcher("/dashboard/pages/staff/edit-staff.jsp?id=" + staffId).forward(request, response);
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

    private void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;
        try {
            // Extract public ID
            // URL: https://res.cloudinary.com/cloudname/image/upload/v12345678/folder/filename.ext
            // We need: folder/filename
            
            String publicId = null;
            int uploadIndex = fileUrl.indexOf("/upload/");
            if (uploadIndex != -1) {
                String path = fileUrl.substring(uploadIndex + 8); // Skip "/upload/"
                // Skip version if present (v12345678/)
                int slashIndex = path.indexOf('/');
                if (slashIndex != -1 && path.substring(0, slashIndex).matches("v\\d+")) {
                    path = path.substring(slashIndex + 1);
                }
                // Remove extension
                int dotIndex = path.lastIndexOf('.');
                if (dotIndex != -1) {
                    publicId = path.substring(0, dotIndex);
                } else {
                    publicId = path;
                }
            }
            
            if (publicId != null) {
                logger.info("Deleting old file from Cloudinary. Public ID: {}", publicId);
                CloudinaryUtil.getCloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            logger.error("Failed to delete file from Cloudinary: " + fileUrl, e);
        }
    }

    private void deleteStaff(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        logger.debug("Received request to delete staff");
        HttpSession session = request.getSession();
        
        String instituteId = (String) session.getAttribute("instituteId");
        String staffId = request.getParameter("staffId");
        
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        if (staffId == null || staffId.isEmpty()) {
            session.setAttribute("errorMessage", "Invalid staff ID");
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
            return;
        }

        try {
            // Fetch staff to get file URLs before deletion
            Staff staff = staffDAO.getStaffById(staffId, instituteId);
            if (staff == null) {
                session.setAttribute("errorMessage", "Staff member not found");
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
                return;
            }

            // Delete associated files
            if (staff.getProfilePhotoUrl() != null && !staff.getProfilePhotoUrl().isEmpty()) {
                deleteFile(staff.getProfilePhotoUrl());
            }

            // Delete certifications and their files
            List<StaffCertification> certifications = staffDAO.getCertificationsByStaffId(staffId);
            for (StaffCertification cert : certifications) {
                if (cert.getCertificateFileUrl() != null && !cert.getCertificateFileUrl().isEmpty()) {
                    deleteFile(cert.getCertificateFileUrl());
                }
                staffDAO.deleteCertification(cert.getCertificationId());
            }

            // Delete documents and their files
            List<StaffDocument> documents = staffDAO.getDocumentsByStaffId(staffId);
            for (StaffDocument doc : documents) {
                if (doc.getDocumentUrl() != null && !doc.getDocumentUrl().isEmpty()) {
                    deleteFile(doc.getDocumentUrl());
                }
                staffDAO.deleteDocument(doc.getDocumentId());
            }

            // Delete staff record
            staffDAO.deleteStaff(staffId, instituteId);
            
            session.setAttribute("successMessage", "Staff member deleted successfully");
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");

        } catch (SQLException e) {
            logger.error("Database error while deleting staff", e);
            session.setAttribute("errorMessage", "Error deleting staff member: " + e.getMessage());
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
        } catch (Exception e) {
            logger.error("Error while deleting staff", e);
            session.setAttribute("errorMessage", "Error: " + e.getMessage());
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
        }
    }

    private void deleteStaffBulk(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        logger.debug("Received request to delete multiple staff members");
        HttpSession session = request.getSession();
        
        String instituteId = (String) session.getAttribute("instituteId");
        String[] staffIds = request.getParameterValues("staffIds[]");
        
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/public/login.jsp");
            return;
        }

        if (staffIds == null || staffIds.length == 0) {
            session.setAttribute("errorMessage", "No staff members selected");
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
            return;
        }

        int successCount = 0;
        int failCount = 0;

        for (String staffId : staffIds) {
            try {
                // Fetch staff to get file URLs before deletion
                Staff staff = staffDAO.getStaffById(staffId, instituteId);
                if (staff == null) {
                    failCount++;
                    continue;
                }

                // Delete associated files
                if (staff.getProfilePhotoUrl() != null && !staff.getProfilePhotoUrl().isEmpty()) {
                    deleteFile(staff.getProfilePhotoUrl());
                }

                // Delete certifications and their files
                List<StaffCertification> certifications = staffDAO.getCertificationsByStaffId(staffId);
                for (StaffCertification cert : certifications) {
                    if (cert.getCertificateFileUrl() != null && !cert.getCertificateFileUrl().isEmpty()) {
                        deleteFile(cert.getCertificateFileUrl());
                    }
                    staffDAO.deleteCertification(cert.getCertificationId());
                }

                // Delete documents and their files
                List<StaffDocument> documents = staffDAO.getDocumentsByStaffId(staffId);
                for (StaffDocument doc : documents) {
                    if (doc.getDocumentUrl() != null && !doc.getDocumentUrl().isEmpty()) {
                        deleteFile(doc.getDocumentUrl());
                    }
                    staffDAO.deleteDocument(doc.getDocumentId());
                }

                // Delete staff record
                staffDAO.deleteStaff(staffId, instituteId);
                successCount++;

            } catch (Exception e) {
                logger.error("Error deleting staff ID: " + staffId, e);
                failCount++;
            }
        }

        if (successCount > 0) {
            session.setAttribute("successMessage", successCount + " staff member(s) deleted successfully" + 
                (failCount > 0 ? " (" + failCount + " failed)" : ""));
        } else {
            session.setAttribute("errorMessage", "Failed to delete staff members");
        }

        response.sendRedirect(request.getContextPath() + "/dashboard/pages/staff/all-staff.jsp");
    }
}
