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
    void updateStaff(Staff staff) throws SQLException;
    void deleteStaff(String staffId, String instituteId) throws SQLException;
    boolean isEmailExists(String email) throws SQLException;
    boolean isEmployeeIdExists(String instituteId, String employeeId) throws SQLException;
}
