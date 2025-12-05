package com.eduhub.service.interfaces;

import com.eduhub.model.Student;
import com.eduhub.model.StudentDocument;
import java.util.List;

public interface StudentService {
    boolean addStudent(Student student, List<StudentDocument> documents);
    boolean updateStudent(Student student, List<StudentDocument> newDocuments, List<StudentDocument> updatedDocuments, List<String> deletedDocumentIds);
    boolean deleteStudent(String studentId, String instituteId);
    Student getStudentById(String studentId);
    List<Student> getAllStudents(String instituteId);
    List<Student> getStudentsByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search, int page, int pageSize);
    int getStudentCountByFilters(String instituteId, String courseId, String branchId, String batchId, String status, String search);
    List<StudentDocument> getDocumentsByStudentId(String studentId);
    
    // Deprecated methods to keep backward compatibility if needed, or just remove them if I update all callers
    // boolean addStudent(Student student); 
    // boolean updateStudent(Student student);
}
