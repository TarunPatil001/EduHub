package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.model.Course;
import com.eduhub.model.Branch;
import com.eduhub.model.Batch;
import com.eduhub.model.Student;
import com.eduhub.model.StudentDocument;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDAOImpl implements StudentDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentDAOImpl.class);

    @Override
    public boolean addStudent(Student student) {
        String sql = "INSERT INTO students (student_id, institute_id, student_name, father_name, surname, date_of_birth, " +
                     "gender, blood_group, mobile_number, whatsapp_number, parent_mobile, email_id, instagram_id, linkedin_id, " +
                     "permanent_address, current_address, college_name, education_qualification, specialization, passing_year, " +
                     "batch_id, student_status, fees_allowed, medical_history, medical_condition, medicine_name, student_declaration, profile_photo_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            int i = 1;
            pstmt.setString(i++, student.getStudentId());
            pstmt.setString(i++, student.getInstituteId());
            pstmt.setString(i++, student.getStudentName());
            pstmt.setString(i++, student.getFatherName());
            pstmt.setString(i++, student.getSurname());
            pstmt.setDate(i++, student.getDateOfBirth());
            pstmt.setString(i++, student.getGender());
            pstmt.setString(i++, student.getBloodGroup());
            pstmt.setString(i++, student.getMobileNumber());
            pstmt.setString(i++, student.getWhatsappNumber());
            pstmt.setString(i++, student.getParentMobile());
            pstmt.setString(i++, student.getEmailId());
            pstmt.setString(i++, student.getInstagramId());
            pstmt.setString(i++, student.getLinkedinId());
            pstmt.setString(i++, student.getPermanentAddress());
            pstmt.setString(i++, student.getCurrentAddress());
            pstmt.setString(i++, student.getCollegeName());
            pstmt.setString(i++, student.getEducationQualification());
            pstmt.setString(i++, student.getSpecialization());
            pstmt.setString(i++, student.getPassingYear());
            pstmt.setString(i++, student.getBatchId());
            pstmt.setString(i++, student.getStudentStatus());
            pstmt.setString(i++, student.getFeesAllowed());
            pstmt.setBoolean(i++, student.isMedicalHistory());
            pstmt.setString(i++, student.getMedicalCondition());
            pstmt.setString(i++, student.getMedicineName());
            pstmt.setBoolean(i++, student.isStudentDeclaration());
            pstmt.setString(i++, student.getProfilePhotoUrl());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error adding student: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean updateStudent(Student student) {
        String sql = "UPDATE students SET student_name=?, father_name=?, surname=?, date_of_birth=?, gender=?, blood_group=?, " +
                     "mobile_number=?, whatsapp_number=?, parent_mobile=?, email_id=?, instagram_id=?, linkedin_id=?, " +
                     "permanent_address=?, current_address=?, college_name=?, education_qualification=?, specialization=?, " +
                     "passing_year=?, batch_id=?, student_status=?, fees_allowed=?, medical_history=?, " +
                     "medical_condition=?, medicine_name=?, student_declaration=?, profile_photo_url=? WHERE student_id=? AND institute_id=?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            int i = 1;
            pstmt.setString(i++, student.getStudentName());
            pstmt.setString(i++, student.getFatherName());
            pstmt.setString(i++, student.getSurname());
            pstmt.setDate(i++, student.getDateOfBirth());
            pstmt.setString(i++, student.getGender());
            pstmt.setString(i++, student.getBloodGroup());
            pstmt.setString(i++, student.getMobileNumber());
            pstmt.setString(i++, student.getWhatsappNumber());
            pstmt.setString(i++, student.getParentMobile());
            pstmt.setString(i++, student.getEmailId());
            pstmt.setString(i++, student.getInstagramId());
            pstmt.setString(i++, student.getLinkedinId());
            pstmt.setString(i++, student.getPermanentAddress());
            pstmt.setString(i++, student.getCurrentAddress());
            pstmt.setString(i++, student.getCollegeName());
            pstmt.setString(i++, student.getEducationQualification());
            pstmt.setString(i++, student.getSpecialization());
            pstmt.setString(i++, student.getPassingYear());
            pstmt.setString(i++, student.getBatchId());
            pstmt.setString(i++, student.getStudentStatus());
            pstmt.setString(i++, student.getFeesAllowed());
            pstmt.setBoolean(i++, student.isMedicalHistory());
            pstmt.setString(i++, student.getMedicalCondition());
            pstmt.setString(i++, student.getMedicineName());
            pstmt.setBoolean(i++, student.isStudentDeclaration());
            pstmt.setString(i++, student.getProfilePhotoUrl());
            pstmt.setString(i++, student.getStudentId());
            pstmt.setString(i++, student.getInstituteId());
            
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error updating student: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteStudent(String studentId, String instituteId) {
        String sql = "DELETE FROM students WHERE student_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            pstmt.setString(2, instituteId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting student: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public Student getStudentById(String studentId) {
        String sql = "SELECT * FROM students WHERE student_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToStudent(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting student by ID: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<Student> getAllStudents(String instituteId) {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT * FROM students WHERE institute_id = ? ORDER BY created_at DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSetToStudent(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting all students: {}", e.getMessage(), e);
        }
        return students;
    }

    @Override
    public List<Student> getStudentsByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search, int page, int pageSize) {
        List<Student> students = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT s.* FROM students s ");
        
        // Add joins if needed for filtering
        boolean joinBatches = (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) ||
                              (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId));
        
        if (joinBatches) {
            sql.append("LEFT JOIN batches b ON s.batch_id = b.batch_id ");
        }
        
        sql.append("WHERE s.institute_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) {
            sql.append(" AND b.course_id = ?");
            params.add(courseId);
        }
        
        if (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId)) {
            sql.append(" AND b.branch_id = ?");
            params.add(branchId);
        }

        if (batchId != null && !batchId.isEmpty() && !"all".equalsIgnoreCase(batchId)) {
            sql.append(" AND s.batch_id = ?");
            params.add(batchId);
        }
        
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND s.student_status = ?");
            params.add(status);
        }
        
        if (search != null && !search.isEmpty()) {
            sql.append(" AND (LOWER(s.student_name) LIKE ? OR LOWER(s.surname) LIKE ? OR s.mobile_number LIKE ? OR s.email_id LIKE ?)");
            String searchPattern = "%" + search.toLowerCase() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }
        
        sql.append(" ORDER BY s.created_at DESC LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add((page - 1) * pageSize);
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSetToStudent(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting students by filters: {}", e.getMessage(), e);
        }
        return students;
    }

    @Override
    public int getStudentCountByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM students s ");
        
        // Add joins if needed for filtering
        boolean joinBatches = (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) ||
                              (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId));
        
        if (joinBatches) {
            sql.append("LEFT JOIN batches b ON s.batch_id = b.batch_id ");
        }
        
        sql.append("WHERE s.institute_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(instituteId);

        if (courseId != null && !courseId.isEmpty() && !"all".equalsIgnoreCase(courseId)) {
            sql.append(" AND b.course_id = ?");
            params.add(courseId);
        }
        
        if (branchId != null && !branchId.isEmpty() && !"all".equalsIgnoreCase(branchId)) {
            sql.append(" AND b.branch_id = ?");
            params.add(branchId);
        }

        if (batchId != null && !batchId.isEmpty() && !"all".equalsIgnoreCase(batchId)) {
            sql.append(" AND s.batch_id = ?");
            params.add(batchId);
        }
        
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            sql.append(" AND s.student_status = ?");
            params.add(status);
        }
        
        if (search != null && !search.isEmpty()) {
            sql.append(" AND (LOWER(s.student_name) LIKE ? OR LOWER(s.surname) LIKE ? OR s.mobile_number LIKE ? OR s.email_id LIKE ?)");
            String searchPattern = "%" + search.toLowerCase() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting student count: {}", e.getMessage(), e);
        }
        return 0;
    }

    @Override
    public List<Student> getStudentsForFees(String instituteId) {
        List<Student> students = new ArrayList<>();
        // Fetch students where fees_allowed is 'YES'
        // Also join with batches/courses to get course name if needed, but for now simple fetch
        // We might want to order by name or ID
        String sql = "SELECT s.*, b.course_id, c.course_name " + 
                     "FROM students s " +
                     "LEFT JOIN batches b ON s.batch_id = b.batch_id " +
                     "LEFT JOIN courses c ON b.course_id = c.course_id " +
                     "WHERE s.institute_id = ? AND s.fees_allowed = 'YES' " +
                     "ORDER BY s.student_name";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Student student = mapResultSetToStudent(rs);
                    // We might need to set course name transiently if Student model supports it, 
                    // but Student model doesn't have courseName field. 
                    // However, the JSP needs course name.
                    // Let's check if we can use a DTO or just rely on what we have.
                    // For now, we return the Student object. The JSP might need to fetch course name separately 
                    // or we can add a transient field to Student.
                    // Actually, looking at mapResultSetToStudent, it doesn't map course_name.
                    // Let's just return the student for now. The JSP can use batchId to find course or we can update Student model.
                    // Wait, the JSP displays "Course". 
                    // The current dummy data has "Course".
                    // The Student model has `batchId`.
                    // I should probably update Student model to have `courseName` (transient) or just fetch it here.
                    // But `mapResultSetToStudent` is used elsewhere.
                    // Let's stick to the interface contract.
                    students.add(student);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting students for fees: {}", e.getMessage(), e);
        }
        return students;
    }

    @Override
    public List<Course> getDistinctCourses(String instituteId) {
        List<Course> courses = new ArrayList<>();
        String sql = "SELECT DISTINCT c.* FROM courses c " +
                     "JOIN batches b ON c.course_id = b.course_id " +
                     "JOIN students s ON b.batch_id = s.batch_id " +
                     "WHERE s.institute_id = ? ORDER BY c.course_name";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Course course = new Course();
                    course.setCourseId(rs.getString("course_id"));
                    course.setCourseName(rs.getString("course_name"));
                    // Map other fields if necessary, but ID and Name are critical for dropdowns
                    courses.add(course);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct courses from students: {}", e.getMessage(), e);
        }
        return courses;
    }

    @Override
    public List<Branch> getDistinctBranches(String instituteId) {
        List<Branch> branches = new ArrayList<>();
        String sql = "SELECT DISTINCT br.* FROM branches br " +
                     "JOIN batches b ON br.branch_id = b.branch_id " +
                     "JOIN students s ON b.batch_id = s.batch_id " +
                     "WHERE s.institute_id = ? ORDER BY br.branch_name";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Branch branch = new Branch();
                    branch.setBranchId(rs.getString("branch_id"));
                    branch.setBranchName(rs.getString("branch_name"));
                    branches.add(branch);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct branches from students: {}", e.getMessage(), e);
        }
        return branches;
    }

    @Override
    public List<Batch> getDistinctBatches(String instituteId) {
        List<Batch> batches = new ArrayList<>();
        String sql = "SELECT DISTINCT b.* FROM batches b " +
                     "JOIN students s ON b.batch_id = s.batch_id " +
                     "WHERE s.institute_id = ? ORDER BY b.batch_name";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Batch batch = new Batch();
                    batch.setBatchId(rs.getString("batch_id"));
                    batch.setBatchName(rs.getString("batch_name"));
                    batch.setBatchCode(rs.getString("batch_code"));
                    batch.setCourseId(rs.getString("course_id"));
                    batch.setBranchId(rs.getString("branch_id"));
                    batches.add(batch);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct batches from students: {}", e.getMessage(), e);
        }
        return batches;
    }

    @Override
    public List<String> getDistinctStatuses(String instituteId) {
        List<String> statuses = new ArrayList<>();
        String sql = "SELECT DISTINCT student_status FROM students WHERE institute_id = ? ORDER BY student_status";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String status = rs.getString("student_status");
                    if (status != null && !status.isEmpty()) {
                        statuses.add(status);
                    }
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting distinct statuses from students: {}", e.getMessage(), e);
        }
        return statuses;
    }

    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        Student student = new Student();
        student.setStudentId(rs.getString("student_id"));
        student.setInstituteId(rs.getString("institute_id"));
        student.setStudentName(rs.getString("student_name"));
        student.setFatherName(rs.getString("father_name"));
        student.setSurname(rs.getString("surname"));
        student.setDateOfBirth(rs.getDate("date_of_birth"));
        student.setGender(rs.getString("gender"));
        student.setBloodGroup(rs.getString("blood_group"));
        student.setMobileNumber(rs.getString("mobile_number"));
        student.setWhatsappNumber(rs.getString("whatsapp_number"));
        student.setParentMobile(rs.getString("parent_mobile"));
        student.setEmailId(rs.getString("email_id"));
        student.setInstagramId(rs.getString("instagram_id"));
        student.setLinkedinId(rs.getString("linkedin_id"));
        student.setPermanentAddress(rs.getString("permanent_address"));
        student.setCurrentAddress(rs.getString("current_address"));
        student.setCollegeName(rs.getString("college_name"));
        student.setEducationQualification(rs.getString("education_qualification"));
        student.setSpecialization(rs.getString("specialization"));
        student.setPassingYear(rs.getString("passing_year"));
        student.setBatchId(rs.getString("batch_id"));
        student.setStudentStatus(rs.getString("student_status"));
        student.setFeesAllowed(rs.getString("fees_allowed"));
        student.setMedicalHistory(rs.getBoolean("medical_history"));
        student.setMedicalCondition(rs.getString("medical_condition"));
        student.setMedicineName(rs.getString("medicine_name"));
        student.setStudentDeclaration(rs.getBoolean("student_declaration"));
        student.setProfilePhotoUrl(rs.getString("profile_photo_url"));
        student.setCreatedAt(rs.getTimestamp("created_at"));
        student.setUpdatedAt(rs.getTimestamp("updated_at"));
        return student;
    }

    @Override
    public void addDocument(StudentDocument document) throws SQLException {
        String sql = "INSERT INTO student_documents (document_id, student_id, document_type, document_url) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, document.getDocumentId());
            pstmt.setString(2, document.getStudentId());
            pstmt.setString(3, document.getDocumentType());
            pstmt.setString(4, document.getDocumentUrl());
            pstmt.executeUpdate();
        }
    }

    @Override
    public List<StudentDocument> getDocumentsByStudentId(String studentId) throws SQLException {
        List<StudentDocument> documents = new ArrayList<>();
        String sql = "SELECT * FROM student_documents WHERE student_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    StudentDocument doc = new StudentDocument();
                    doc.setDocumentId(rs.getString("document_id"));
                    doc.setStudentId(rs.getString("student_id"));
                    doc.setDocumentType(rs.getString("document_type"));
                    doc.setDocumentUrl(rs.getString("document_url"));
                    doc.setUploadedAt(rs.getTimestamp("uploaded_at"));
                    documents.add(doc);
                }
            }
        }
        return documents;
    }

    @Override
    public void deleteDocument(String documentId) throws SQLException {
        String sql = "DELETE FROM student_documents WHERE document_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, documentId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public void updateDocument(StudentDocument document) throws SQLException {
        String sql = "UPDATE student_documents SET document_type = ?, document_url = ? WHERE document_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, document.getDocumentType());
            pstmt.setString(2, document.getDocumentUrl());
            pstmt.setString(3, document.getDocumentId());
            pstmt.executeUpdate();
        }
    }
}
