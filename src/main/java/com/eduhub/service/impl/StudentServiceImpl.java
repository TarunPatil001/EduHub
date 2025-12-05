package com.eduhub.service.impl;

import com.eduhub.dao.impl.StudentDAOImpl;
import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.model.Student;
import com.eduhub.model.StudentDocument;
import com.eduhub.service.interfaces.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;

public class StudentServiceImpl implements StudentService {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);
    private StudentDAO studentDAO;

    public StudentServiceImpl() {
        this.studentDAO = new StudentDAOImpl();
    }

    @Override
    public boolean addStudent(Student student, List<StudentDocument> documents) {
        boolean success = studentDAO.addStudent(student);
        if (success && documents != null && !documents.isEmpty()) {
            try {
                for (StudentDocument doc : documents) {
                    studentDAO.addDocument(doc);
                }
            } catch (SQLException e) {
                logger.error("Error adding student documents", e);
                // Consider rolling back student creation? For now, just log error.
            }
        }
        return success;
    }

    @Override
    public boolean updateStudent(Student student, List<StudentDocument> newDocuments, List<StudentDocument> updatedDocuments, List<String> deletedDocumentIds) {
        boolean success = studentDAO.updateStudent(student);
        if (success) {
            try {
                if (newDocuments != null) {
                    for (StudentDocument doc : newDocuments) {
                        studentDAO.addDocument(doc);
                    }
                }
                if (updatedDocuments != null) {
                    for (StudentDocument doc : updatedDocuments) {
                        studentDAO.updateDocument(doc);
                    }
                }
                if (deletedDocumentIds != null) {
                    for (String docId : deletedDocumentIds) {
                        studentDAO.deleteDocument(docId);
                    }
                }
            } catch (SQLException e) {
                logger.error("Error updating student documents", e);
            }
        }
        return success;
    }

    @Override
    public boolean deleteStudent(String studentId, String instituteId) {
        return studentDAO.deleteStudent(studentId, instituteId);
    }

    @Override
    public Student getStudentById(String studentId) {
        return studentDAO.getStudentById(studentId);
    }

    @Override
    public List<Student> getAllStudents(String instituteId) {
        return studentDAO.getAllStudents(instituteId);
    }

    @Override
    public List<Student> getStudentsByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search, int page, int pageSize) {
        return studentDAO.getStudentsByFilters(instituteId, courseId, branchId, batchId, status, search, page, pageSize);
    }

    @Override
    public int getStudentCountByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search) {
        return studentDAO.getStudentCountByFilters(instituteId, courseId, branchId, batchId, status, search);
    }

    @Override
    public List<StudentDocument> getDocumentsByStudentId(String studentId) {
        try {
            return studentDAO.getDocumentsByStudentId(studentId);
        } catch (SQLException e) {
            logger.error("Error getting documents for student: " + studentId, e);
            return new ArrayList<>();
        }
    }
}
