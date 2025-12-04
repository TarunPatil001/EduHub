package com.eduhub.dao.interfaces;

import java.util.List;
import java.sql.SQLException;
import com.eduhub.model.Student;
import com.eduhub.model.StudentDocument;

import com.eduhub.model.Course;
import com.eduhub.model.Branch;
import com.eduhub.model.Batch;

public interface StudentDAO {
    boolean addStudent(Student student);
    boolean updateStudent(Student student);
    boolean deleteStudent(String studentId, String instituteId);
    Student getStudentById(String studentId);
    List<Student> getAllStudents(String instituteId);
    List<Student> getStudentsByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search, int page, int pageSize);
    int getStudentCountByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search);
    
    // Fee management methods
    List<Student> getStudentsForFees(String instituteId);
    
    // Dropdown data methods
    List<Course> getDistinctCourses(String instituteId);
    List<Branch> getDistinctBranches(String instituteId);
    List<Batch> getDistinctBatches(String instituteId);
    List<String> getDistinctStatuses(String instituteId);

    // Document methods
    void addDocument(StudentDocument document) throws SQLException;
    List<StudentDocument> getDocumentsByStudentId(String studentId) throws SQLException;
    void deleteDocument(String documentId) throws SQLException;
    void updateDocument(StudentDocument document) throws SQLException;
}
