package com.eduhub.dao.interfaces;

import com.eduhub.model.Staff;
import com.eduhub.model.StaffCertification;
import com.eduhub.model.StaffDocument;
import java.sql.SQLException;
import java.util.List;

public interface StaffDAO {
    void addStaff(Staff staff) throws SQLException;
    void addCertification(StaffCertification certification) throws SQLException;
    void addDocument(StaffDocument document) throws SQLException;
    Staff getStaffById(String staffId, String instituteId) throws SQLException;
    List<Staff> getAllStaff(String instituteId) throws SQLException;
    List<Staff> getStaffList(String instituteId, String searchQuery, String role, String status, int offset, int limit) throws SQLException;
    int getStaffCount(String instituteId, String searchQuery, String role, String status) throws SQLException;
    void updateStaff(Staff staff) throws SQLException;
    void deleteStaff(String staffId, String instituteId) throws SQLException;
    boolean isEmailExists(String email) throws SQLException;
    boolean isEmployeeIdExists(String instituteId, String employeeId) throws SQLException;
    List<StaffCertification> getCertificationsByStaffId(String staffId) throws SQLException;
    List<StaffDocument> getDocumentsByStaffId(String staffId) throws SQLException;
    void updateCertification(StaffCertification certification) throws SQLException;
    void updateDocument(StaffDocument document) throws SQLException;
    void deleteCertification(String certificationId) throws SQLException;
    void deleteDocument(String documentId) throws SQLException;
    List<String> getDistinctRoles(String instituteId) throws SQLException;
    int getStaffCountByRole(String instituteId, String role) throws SQLException;
    int getStaffCountByRoleAndStatus(String instituteId, String role, String status) throws SQLException;
    List<Staff> getStaffByRoleLike(String instituteId, String rolePattern) throws SQLException;
    List<Staff> getStaffByDepartmentAndRole(String instituteId, String department, String role) throws SQLException;
    List<Staff> getStaffByDepartment(String instituteId, String department) throws SQLException;
}
