package com.eduhub.controller;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
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

import com.cloudinary.utils.ObjectUtils;
import com.eduhub.model.Student;
import com.eduhub.model.StudentDocument;
import com.eduhub.service.impl.StudentServiceImpl;
import com.eduhub.service.interfaces.StudentService;
import com.eduhub.util.CloudinaryUtil;

@WebServlet(urlPatterns = {"/api/students/add", "/api/students/list", "/api/students/update", "/api/students/delete", "/api/students/get"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2, // 2MB
    maxFileSize = 1024 * 1024 * 10,      // 10MB
    maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class StudentServlet extends HttpServlet {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentServlet.class);
    private StudentService studentService;
    
    @Override
    public void init() throws ServletException {
        studentService = new StudentServiceImpl();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        logger.info("doPost called with servletPath: {}", servletPath);
        
        if (servletPath.endsWith("/add")) {
            handleAddStudent(request, response);
        } else if (servletPath.endsWith("/update")) {
            handleUpdateStudent(request, response);
        } else if (servletPath.endsWith("/delete")) {
            handleDeleteStudent(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        if (servletPath.endsWith("/list")) {
            handleListStudents(request, response);
        } else if (servletPath.endsWith("/get")) {
            handleGetStudent(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void handleAddStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/add-student.jsp?status=error&message=Session error: Institute ID not found");
            return;
        }
        
        try {
            Student student = new Student();
            student.setStudentId(UUID.randomUUID().toString());
            student.setInstituteId(instituteId);
            student.setStudentName(request.getParameter("studentName"));
            student.setFatherName(request.getParameter("fatherName"));
            student.setSurname(request.getParameter("surname"));
            
            String dobStr = request.getParameter("dateOfBirth");
            if (dobStr != null && !dobStr.isEmpty()) {
                student.setDateOfBirth(Date.valueOf(dobStr));
            }
            
            student.setGender(request.getParameter("gender"));
            student.setBloodGroup(request.getParameter("bloodGroup"));
            student.setMobileNumber(request.getParameter("mobileNumber"));
            student.setWhatsappNumber(request.getParameter("whatsappNumber"));
            student.setParentMobile(request.getParameter("parentMobile"));
            student.setEmailId(request.getParameter("emailId"));
            student.setInstagramId(request.getParameter("instagramId"));
            student.setLinkedinId(request.getParameter("linkedinId"));
            student.setPermanentAddress(request.getParameter("permanentAddress"));
            student.setCurrentAddress(request.getParameter("currentAddress"));
            student.setCollegeName(request.getParameter("collegeName"));
            student.setEducationQualification(request.getParameter("educationQualification"));
            student.setSpecialization(request.getParameter("specialization"));
            student.setPassingYear(request.getParameter("passingYear"));
            
            // Enrollment Details
            student.setBatchId(request.getParameter("batchId"));
            student.setStudentStatus(request.getParameter("studentStatus"));
            student.setFeesAllowed(request.getParameter("feesAllowed"));
            
            // Medical Info
            String medicalHistory = request.getParameter("medicalHistory");
            student.setMedicalHistory("yes".equalsIgnoreCase(medicalHistory));
            student.setMedicalCondition(request.getParameter("medicalCondition"));
            student.setMedicineName(request.getParameter("medicineName"));
            
            // Student Declaration
            String studentDeclaration = request.getParameter("studentDeclaration");
            student.setStudentDeclaration("true".equalsIgnoreCase(studentDeclaration) || "on".equalsIgnoreCase(studentDeclaration));
            
            // Handle Profile Photo Upload
            String profilePhotoUrl = null;
            Part filePart = request.getPart("studentPhoto");
            if (filePart != null && filePart.getSize() > 0) {
                profilePhotoUrl = uploadFile(filePart, "eduhub/student_photos/" + instituteId);
                student.setProfilePhotoUrl(profilePhotoUrl);
            }

            // Handle Documents
            List<StudentDocument> documents = new ArrayList<>();
            
            // Dynamic Document Uploads (matching Add Staff logic)
            String docIndicesStr = request.getParameter("documentIndices");
            if (docIndicesStr != null && !docIndicesStr.isEmpty()) {
                String[] indices = docIndicesStr.split(",");
                for (String index : indices) {
                    if (index.trim().isEmpty()) continue;
                    
                    String docType = request.getParameter("docType_" + index);
                    Part docPart = request.getPart("docFile_" + index);
                    
                    if (docType != null && !docType.isEmpty() && docPart != null && docPart.getSize() > 0) {
                        String docUrl = uploadFile(docPart, "eduhub/student_docs/" + instituteId);
                        
                        StudentDocument doc = new StudentDocument();
                        doc.setDocumentId(UUID.randomUUID().toString());
                        doc.setStudentId(student.getStudentId());
                        doc.setDocumentType(docType);
                        doc.setDocumentUrl(docUrl);
                        
                        documents.add(doc);
                    }
                }
            }
            
            boolean success = studentService.addStudent(student, documents);
            
            logger.info("Received student registration for: {} {}, Batch: {}", 
                    student.getStudentName(), student.getSurname(), student.getBatchId());
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/add-student.jsp?success=true&message=Student registered successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/add-student.jsp?error=true&message=Failed to register student");
            }
            
        } catch (Exception e) {
            logger.error("Error adding student", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/add-student.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleUpdateStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=session_error");
            return;
        }
        
        try {
            String studentId = request.getParameter("studentId");
            if (studentId == null || studentId.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=true&message=Student ID is missing");
                return;
            }

            Student student = new Student();
            student.setStudentId(studentId);
            student.setInstituteId(instituteId);
            student.setStudentName(request.getParameter("studentName"));
            student.setFatherName(request.getParameter("fatherName"));
            student.setSurname(request.getParameter("surname"));
            
            String dobStr = request.getParameter("dateOfBirth");
            if (dobStr != null && !dobStr.isEmpty()) {
                student.setDateOfBirth(Date.valueOf(dobStr));
            }
            
            student.setGender(request.getParameter("gender"));
            student.setBloodGroup(request.getParameter("bloodGroup"));
            student.setMobileNumber(request.getParameter("mobileNumber"));
            student.setWhatsappNumber(request.getParameter("whatsappNumber"));
            student.setParentMobile(request.getParameter("parentMobile"));
            student.setEmailId(request.getParameter("emailId"));
            student.setInstagramId(request.getParameter("instagramId"));
            student.setLinkedinId(request.getParameter("linkedinId"));
            student.setPermanentAddress(request.getParameter("permanentAddress"));
            student.setCurrentAddress(request.getParameter("currentAddress"));
            student.setCollegeName(request.getParameter("collegeName"));
            student.setEducationQualification(request.getParameter("educationQualification"));
            student.setSpecialization(request.getParameter("specialization"));
            student.setPassingYear(request.getParameter("passingYear"));
            
            student.setBatchId(request.getParameter("batchId"));
            student.setStudentStatus(request.getParameter("studentStatus"));
            student.setFeesAllowed(request.getParameter("feesAllowed"));
            
            String studentDeclaration = request.getParameter("studentDeclaration");
            if (studentDeclaration != null) {
                 student.setStudentDeclaration("true".equalsIgnoreCase(studentDeclaration) || "on".equalsIgnoreCase(studentDeclaration));
            }
            
            String medicalHistory = request.getParameter("medicalHistory");
            student.setMedicalHistory("yes".equalsIgnoreCase(medicalHistory));
            student.setMedicalCondition(request.getParameter("medicalCondition"));
            student.setMedicineName(request.getParameter("medicineName"));
            
            // Preserve existing photo if not updated (or handle update if implemented)
            Student existingStudent = studentService.getStudentById(studentId);
            if (existingStudent != null) {
                student.setProfilePhotoUrl(existingStudent.getProfilePhotoUrl());
            }
            
            // Handle Document Updates
            List<StudentDocument> newDocuments = new ArrayList<>();
            List<StudentDocument> updatedDocuments = new ArrayList<>();
            List<String> deletedDocumentIds = new ArrayList<>();
            
            // Get existing documents for update/delete operations
            List<StudentDocument> existingDocs = studentService.getDocumentsByStudentId(studentId);
            
            // 1. Process existing document updates
            String existingDocIdsStr = request.getParameter("existingDocIds");
            if (existingDocIdsStr != null && !existingDocIdsStr.isEmpty()) {
                String[] existingDocIds = existingDocIdsStr.split(",");
                for (String docId : existingDocIds) {
                    if (docId.trim().isEmpty()) continue;
                    
                    // Find existing document
                    String finalDocId = docId.trim();
                    StudentDocument doc = existingDocs.stream()
                        .filter(d -> d.getDocumentId().equals(finalDocId))
                        .findFirst().orElse(null);
                    
                    if (doc != null) {
                        boolean hasChanges = false;
                        
                        // Check for document type change
                        String newType = request.getParameter("docType_" + finalDocId);
                        if (newType != null && !newType.isEmpty() && !newType.equals(doc.getDocumentType())) {
                            doc.setDocumentType(newType);
                            hasChanges = true;
                        }
                        
                        // Check for file replacement
                        Part docPart = request.getPart("docFile_" + finalDocId);
                        if (docPart != null && docPart.getSize() > 0) {
                            // Delete old file from cloud
                            if (doc.getDocumentUrl() != null) {
                                deleteFile(doc.getDocumentUrl());
                            }
                            
                            // Upload new file
                            String docUrl = uploadFile(docPart, "eduhub/student_docs/" + instituteId);
                            doc.setDocumentUrl(docUrl);
                            hasChanges = true;
                        }
                        
                        if (hasChanges) {
                            updatedDocuments.add(doc);
                        }
                    }
                }
            }
            
            // 2. Process new document uploads
            String docIndicesStr = request.getParameter("documentIndices");
            if (docIndicesStr != null && !docIndicesStr.isEmpty()) {
                String[] indices = docIndicesStr.split(",");
                for (String index : indices) {
                    if (index.trim().isEmpty()) continue;
                    
                    String docType = request.getParameter("docType_" + index);
                    Part docPart = request.getPart("docFile_" + index);
                    
                    if (docType != null && !docType.isEmpty() && docPart != null && docPart.getSize() > 0) {
                        String docUrl = uploadFile(docPart, "eduhub/student_docs/" + instituteId);
                        
                        StudentDocument doc = new StudentDocument();
                        doc.setDocumentId(UUID.randomUUID().toString());
                        doc.setStudentId(studentId);
                        doc.setDocumentType(docType);
                        doc.setDocumentUrl(docUrl);
                        
                        newDocuments.add(doc);
                    }
                }
            }
            
            // 3. Process document deletions
            String deletedDocsStr = request.getParameter("deletedDocumentIds");
            if (deletedDocsStr != null && !deletedDocsStr.isEmpty()) {
                String[] deletedIds = deletedDocsStr.split(",");
                for (String id : deletedIds) {
                    if (!id.trim().isEmpty()) {
                        String finalId = id.trim();
                        deletedDocumentIds.add(finalId);
                        
                        // Get document and delete from cloud storage
                        StudentDocument docToDelete = existingDocs.stream()
                            .filter(d -> d.getDocumentId().equals(finalId))
                            .findFirst().orElse(null);
                        
                        if (docToDelete != null && docToDelete.getDocumentUrl() != null) {
                            deleteFile(docToDelete.getDocumentUrl());
                        }
                    }
                }
            }
            
            boolean success = studentService.updateStudent(student, newDocuments, updatedDocuments, deletedDocumentIds);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?success=true&message=Student updated successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/add-student.jsp?id=" + studentId + "&error=true&message=Failed to update student");
            }
            
        } catch (Exception e) {
            logger.error("Error updating student", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleDeleteStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }
        
        String instituteId = (String) session.getAttribute("instituteId");
        if (instituteId == null) {
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=session_error");
            return;
        }

        String studentId = request.getParameter("studentId");
        String studentIds = request.getParameter("studentIds");
        
        boolean success = false;
        
        try {
            if (studentIds != null && !studentIds.isEmpty()) {
                String[] ids = studentIds.split(",");
                boolean allSuccess = true;
                for (String id : ids) {
                    // Cleanup files before delete
                    cleanupStudentFiles(id.trim(), instituteId);
                    if (!studentService.deleteStudent(id.trim(), instituteId)) {
                        allSuccess = false;
                    }
                }
                success = allSuccess; 
            } else if (studentId != null && !studentId.isEmpty()) {
                // Cleanup files before delete
                cleanupStudentFiles(studentId, instituteId);
                success = studentService.deleteStudent(studentId, instituteId);
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=true&message=No student ID provided");
                return;
            }
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?success=true&message=Student(s) deleted successfully");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=true&message=Failed to delete student(s)");
            }
        } catch (Exception e) {
            logger.error("Error deleting student", e);
            response.sendRedirect(request.getContextPath() + "/dashboard/pages/students/all-students.jsp?error=true&message=An error occurred: " + e.getMessage());
        }
    }

    private void handleGetStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
            String studentId = request.getParameter("id");
            if (studentId == null || studentId.trim().isEmpty()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Student ID is required");
                return;
            }
            
            Student student = studentService.getStudentById(studentId);
            if (student == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
                return;
            }
            
            // Verify student belongs to institute
            if (!student.getInstituteId().equals(instituteId)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
                return;
            }
            
            List<StudentDocument> documents = studentService.getDocumentsByStudentId(studentId);
            String json = convertStudentToJson(student, documents);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
            
        } catch (Exception e) {
            logger.error("Error fetching student details", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching student details");
        }
    }

    private void handleListStudents(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
            String batchId = request.getParameter("batchId");
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
                logger.warn("Invalid page or pageSize format, using defaults");
            }
            
            List<Student> students = studentService.getStudentsByFilters(instituteId, courseId, branchId, batchId, status, search, page, pageSize);
            int totalCount = studentService.getStudentCountByFilters(instituteId, courseId, branchId, batchId, status, search);
            
            String json = convertStudentsToJson(students, totalCount);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } catch (Exception e) {
            logger.error("Error fetching students", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching students");
        }
    }

    private String convertStudentsToJson(List<Student> students, int totalCount) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"totalCount\":").append(totalCount).append(",");
        json.append("\"students\":[");
        for (int i = 0; i < students.size(); i++) {
            Student student = students.get(i);
            json.append(convertStudentToJson(student));
            if (i < students.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        json.append("}");
        return json.toString();
    }

    private String convertStudentToJson(Student student) {
        return convertStudentToJson(student, null);
    }

    private String convertStudentToJson(Student student, List<StudentDocument> documents) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"studentId\":\"").append(escapeJson(student.getStudentId())).append("\",");
        json.append("\"studentName\":\"").append(escapeJson(student.getStudentName())).append("\",");
        json.append("\"fatherName\":\"").append(escapeJson(student.getFatherName())).append("\",");
        json.append("\"surname\":\"").append(escapeJson(student.getSurname())).append("\",");
        json.append("\"dateOfBirth\":\"").append(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "").append("\",");
        json.append("\"gender\":\"").append(escapeJson(student.getGender())).append("\",");
        json.append("\"bloodGroup\":\"").append(escapeJson(student.getBloodGroup())).append("\",");
        json.append("\"mobileNumber\":\"").append(escapeJson(student.getMobileNumber())).append("\",");
        json.append("\"whatsappNumber\":\"").append(escapeJson(student.getWhatsappNumber())).append("\",");
        json.append("\"parentMobile\":\"").append(escapeJson(student.getParentMobile())).append("\",");
        json.append("\"emailId\":\"").append(escapeJson(student.getEmailId())).append("\",");
        json.append("\"instagramId\":\"").append(escapeJson(student.getInstagramId())).append("\",");
        json.append("\"linkedinId\":\"").append(escapeJson(student.getLinkedinId())).append("\",");
        json.append("\"permanentAddress\":\"").append(escapeJson(student.getPermanentAddress())).append("\",");
        json.append("\"currentAddress\":\"").append(escapeJson(student.getCurrentAddress())).append("\",");
        json.append("\"collegeName\":\"").append(escapeJson(student.getCollegeName())).append("\",");
        json.append("\"educationQualification\":\"").append(escapeJson(student.getEducationQualification())).append("\",");
        json.append("\"specialization\":\"").append(escapeJson(student.getSpecialization())).append("\",");
        json.append("\"passingYear\":\"").append(escapeJson(student.getPassingYear())).append("\",");
        json.append("\"batchId\":\"").append(escapeJson(student.getBatchId())).append("\",");
        json.append("\"studentDeclaration\":").append(student.isStudentDeclaration()).append(",");
        json.append("\"studentStatus\":\"").append(escapeJson(student.getStudentStatus())).append("\",");
        json.append("\"feesAllowed\":\"").append(escapeJson(student.getFeesAllowed())).append("\",");
        json.append("\"medicalHistory\":").append(student.isMedicalHistory()).append(",");
        json.append("\"medicalCondition\":\"").append(escapeJson(student.getMedicalCondition())).append("\",");
        json.append("\"medicineName\":\"").append(escapeJson(student.getMedicineName())).append("\",");
        json.append("\"profilePhotoUrl\":\"").append(escapeJson(student.getProfilePhotoUrl())).append("\"");
        
        if (documents != null && !documents.isEmpty()) {
            json.append(",\"documents\":[");
            for (int i = 0; i < documents.size(); i++) {
                StudentDocument doc = documents.get(i);
                json.append("{");
                json.append("\"documentId\":\"").append(escapeJson(doc.getDocumentId())).append("\",");
                json.append("\"documentType\":\"").append(escapeJson(doc.getDocumentType())).append("\",");
                json.append("\"documentUrl\":\"").append(escapeJson(doc.getDocumentUrl())).append("\"");
                json.append("}");
                if (i < documents.size() - 1) {
                    json.append(",");
                }
            }
            json.append("]");
        } else {
             json.append(",\"documents\":[]");
        }

        json.append("}");
        return json.toString();
    }

    private void cleanupStudentFiles(String studentId, String instituteId) {
        try {
            Student student = studentService.getStudentById(studentId);
            if (student != null) {
                if (student.getProfilePhotoUrl() != null) {
                    deleteFile(student.getProfilePhotoUrl());
                }
                List<StudentDocument> docs = studentService.getDocumentsByStudentId(studentId);
                for (StudentDocument doc : docs) {
                    if (doc.getDocumentUrl() != null) {
                        deleteFile(doc.getDocumentUrl());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error cleaning up files for student: " + studentId, e);
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
            String publicId = null;
            int uploadIndex = fileUrl.indexOf("/upload/");
            if (uploadIndex != -1) {
                String path = fileUrl.substring(uploadIndex + 8);
                int slashIndex = path.indexOf('/');
                if (slashIndex != -1 && path.substring(0, slashIndex).matches("v\\d+")) {
                    path = path.substring(slashIndex + 1);
                }
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
}
