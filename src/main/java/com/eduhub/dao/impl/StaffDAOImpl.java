package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.StaffDAO;
import com.eduhub.model.Staff;
import com.eduhub.model.StaffCertification;
import com.eduhub.model.StaffDocument;
import com.eduhub.util.DBUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StaffDAOImpl implements StaffDAO {

    private static final Logger logger = LoggerFactory.getLogger(StaffDAOImpl.class);

    @Override
    public void addStaff(Staff staff) throws SQLException {
        logger.debug("Adding new staff member: {} {}", staff.getFirstName(), staff.getLastName());
        String sql = "INSERT INTO staff (staff_id, institute_id, first_name, last_name, date_of_birth, gender, " +
                     "nationality, marital_status, employee_id, role, joining_date, employment_type, salary, " +
                     "work_shift, reporting_manager, phone, email, address, city, state, postal_code, " +
                     "emergency_contact_name, emergency_contact_phone, emergency_contact_relation, " +
                     "highest_qualification, specialization, experience, status, profile_photo_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, staff.getStaffId());
            pstmt.setString(2, staff.getInstituteId());
            pstmt.setString(3, staff.getFirstName());
            pstmt.setString(4, staff.getLastName());
            pstmt.setDate(5, java.sql.Date.valueOf(staff.getDateOfBirth()));
            pstmt.setString(6, staff.getGender());
            pstmt.setString(7, staff.getNationality());
            pstmt.setString(8, staff.getMaritalStatus());
            pstmt.setString(9, staff.getEmployeeId());
            pstmt.setString(10, staff.getRole());
            pstmt.setDate(11, java.sql.Date.valueOf(staff.getJoiningDate()));
            pstmt.setString(12, staff.getEmploymentType());
            pstmt.setBigDecimal(13, staff.getSalary());
            pstmt.setString(14, staff.getWorkShift());
            pstmt.setString(15, staff.getReportingManager());
            pstmt.setString(16, staff.getPhone());
            pstmt.setString(17, staff.getEmail());
            pstmt.setString(18, staff.getAddress());
            pstmt.setString(19, staff.getCity());
            pstmt.setString(20, staff.getState());
            pstmt.setString(21, staff.getPostalCode());
            pstmt.setString(22, staff.getEmergencyContactName());
            pstmt.setString(23, staff.getEmergencyContactPhone());
            pstmt.setString(24, staff.getEmergencyContactRelation());
            pstmt.setString(25, staff.getHighestQualification());
            pstmt.setString(26, staff.getSpecialization());
            pstmt.setDouble(27, staff.getExperience());
            pstmt.setString(28, staff.getStatus());
            pstmt.setString(29, staff.getProfilePhotoUrl());

            pstmt.executeUpdate();
        }
    }

    @Override
    public void addCertification(StaffCertification certification) throws SQLException {
        String sql = "INSERT INTO staff_certifications (certification_id, staff_id, name, issuing_organization, " +
                     "issue_date, expiry_date, credential_id, verification_url, certificate_file_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, certification.getCertificationId());
            pstmt.setString(2, certification.getStaffId());
            pstmt.setString(3, certification.getName());
            pstmt.setString(4, certification.getIssuingOrganization());
            pstmt.setDate(5, java.sql.Date.valueOf(certification.getIssueDate()));
            pstmt.setDate(6, certification.getExpiryDate() != null ? java.sql.Date.valueOf(certification.getExpiryDate()) : null);
            pstmt.setString(7, certification.getCredentialId());
            pstmt.setString(8, certification.getVerificationUrl());
            pstmt.setString(9, certification.getCertificateFileUrl());

            pstmt.executeUpdate();
        }
    }

    @Override
    public void addDocument(StaffDocument document) throws SQLException {
        String sql = "INSERT INTO staff_documents (document_id, staff_id, document_type, document_url) " +
                     "VALUES (?, ?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, document.getDocumentId());
            pstmt.setString(2, document.getStaffId());
            pstmt.setString(3, document.getDocumentType());
            pstmt.setString(4, document.getDocumentUrl());

            pstmt.executeUpdate();
        }
    }

    @Override
    public Staff getStaffById(String staffId, String instituteId) throws SQLException {
        String sql = "SELECT * FROM staff WHERE staff_id = ? AND institute_id = ?";
        Staff staff = null;
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, staffId);
            pstmt.setString(2, instituteId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    staff = new Staff();
                    staff.setStaffId(rs.getString("staff_id"));
                    staff.setInstituteId(rs.getString("institute_id"));
                    staff.setFirstName(rs.getString("first_name"));
                    staff.setLastName(rs.getString("last_name"));
                    staff.setDateOfBirth(rs.getDate("date_of_birth").toLocalDate());
                    staff.setGender(rs.getString("gender"));
                    staff.setNationality(rs.getString("nationality"));
                    staff.setMaritalStatus(rs.getString("marital_status"));
                    staff.setEmployeeId(rs.getString("employee_id"));
                    staff.setRole(rs.getString("role"));
                    staff.setJoiningDate(rs.getDate("joining_date").toLocalDate());
                    staff.setEmploymentType(rs.getString("employment_type"));
                    staff.setSalary(rs.getBigDecimal("salary"));
                    staff.setWorkShift(rs.getString("work_shift"));
                    staff.setReportingManager(rs.getString("reporting_manager"));
                    staff.setPhone(rs.getString("phone"));
                    staff.setEmail(rs.getString("email"));
                    staff.setAddress(rs.getString("address"));
                    staff.setCity(rs.getString("city"));
                    staff.setState(rs.getString("state"));
                    staff.setPostalCode(rs.getString("postal_code"));
                    staff.setEmergencyContactName(rs.getString("emergency_contact_name"));
                    staff.setEmergencyContactPhone(rs.getString("emergency_contact_phone"));
                    staff.setEmergencyContactRelation(rs.getString("emergency_contact_relation"));
                    staff.setHighestQualification(rs.getString("highest_qualification"));
                    staff.setSpecialization(rs.getString("specialization"));
                    staff.setExperience(rs.getDouble("experience"));
                    staff.setStatus(rs.getString("status"));
                    staff.setProfilePhotoUrl(rs.getString("profile_photo_url"));
                }
            }
        }
        return staff;
    }

    @Override
    public List<Staff> getAllStaff(String instituteId) throws SQLException {
        logger.debug("Fetching all staff for institute: {}", instituteId);
        List<Staff> staffList = new ArrayList<>();
        String sql = "SELECT * FROM staff WHERE institute_id = ? ORDER BY created_at DESC";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Staff staff = new Staff();
                    staff.setStaffId(rs.getString("staff_id"));
                    staff.setInstituteId(rs.getString("institute_id"));
                    staff.setFirstName(rs.getString("first_name"));
                    staff.setLastName(rs.getString("last_name"));
                    staff.setDateOfBirth(rs.getDate("date_of_birth").toLocalDate());
                    staff.setGender(rs.getString("gender"));
                    staff.setNationality(rs.getString("nationality"));
                    staff.setMaritalStatus(rs.getString("marital_status"));
                    staff.setEmployeeId(rs.getString("employee_id"));
                    staff.setRole(rs.getString("role"));
                    staff.setJoiningDate(rs.getDate("joining_date").toLocalDate());
                    staff.setEmploymentType(rs.getString("employment_type"));
                    staff.setSalary(rs.getBigDecimal("salary"));
                    staff.setWorkShift(rs.getString("work_shift"));
                    staff.setReportingManager(rs.getString("reporting_manager"));
                    staff.setPhone(rs.getString("phone"));
                    staff.setEmail(rs.getString("email"));
                    staff.setAddress(rs.getString("address"));
                    staff.setCity(rs.getString("city"));
                    staff.setState(rs.getString("state"));
                    staff.setPostalCode(rs.getString("postal_code"));
                    staff.setEmergencyContactName(rs.getString("emergency_contact_name"));
                    staff.setEmergencyContactPhone(rs.getString("emergency_contact_phone"));
                    staff.setEmergencyContactRelation(rs.getString("emergency_contact_relation"));
                    staff.setHighestQualification(rs.getString("highest_qualification"));
                    staff.setSpecialization(rs.getString("specialization"));
                    staff.setExperience(rs.getDouble("experience"));
                    staff.setStatus(rs.getString("status"));
                    staff.setProfilePhotoUrl(rs.getString("profile_photo_url"));
                    
                    staffList.add(staff);
                }
            }
        }
        return staffList;
    }

    @Override
    public void updateStaff(Staff staff) throws SQLException {
        String sql = "UPDATE staff SET first_name=?, last_name=?, date_of_birth=?, gender=?, nationality=?, " +
                     "marital_status=?, role=?, joining_date=?, employment_type=?, salary=?, work_shift=?, " +
                     "reporting_manager=?, phone=?, email=?, address=?, city=?, state=?, postal_code=?, " +
                     "emergency_contact_name=?, emergency_contact_phone=?, emergency_contact_relation=?, " +
                     "highest_qualification=?, specialization=?, experience=?, status=?, profile_photo_url=? " +
                     "WHERE staff_id=? AND institute_id=?";
                     
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, staff.getFirstName());
            pstmt.setString(2, staff.getLastName());
            pstmt.setDate(3, java.sql.Date.valueOf(staff.getDateOfBirth()));
            pstmt.setString(4, staff.getGender());
            pstmt.setString(5, staff.getNationality());
            pstmt.setString(6, staff.getMaritalStatus());
            pstmt.setString(7, staff.getRole());
            pstmt.setDate(8, java.sql.Date.valueOf(staff.getJoiningDate()));
            pstmt.setString(9, staff.getEmploymentType());
            pstmt.setBigDecimal(10, staff.getSalary());
            pstmt.setString(11, staff.getWorkShift());
            pstmt.setString(12, staff.getReportingManager());
            pstmt.setString(13, staff.getPhone());
            pstmt.setString(14, staff.getEmail());
            pstmt.setString(15, staff.getAddress());
            pstmt.setString(16, staff.getCity());
            pstmt.setString(17, staff.getState());
            pstmt.setString(18, staff.getPostalCode());
            pstmt.setString(19, staff.getEmergencyContactName());
            pstmt.setString(20, staff.getEmergencyContactPhone());
            pstmt.setString(21, staff.getEmergencyContactRelation());
            pstmt.setString(22, staff.getHighestQualification());
            pstmt.setString(23, staff.getSpecialization());
            pstmt.setDouble(24, staff.getExperience());
            pstmt.setString(25, staff.getStatus());
            pstmt.setString(26, staff.getProfilePhotoUrl());
            pstmt.setString(27, staff.getStaffId());
            pstmt.setString(28, staff.getInstituteId());

            pstmt.executeUpdate();
        }
    }

    @Override
    public void deleteStaff(String staffId, String instituteId) throws SQLException {
        String sql = "DELETE FROM staff WHERE staff_id = ? AND institute_id = ?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, staffId);
            pstmt.setString(2, instituteId);
            
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean isEmailExists(String email) throws SQLException {
        logger.debug("Checking if email exists: {}", email);
        String sql = "SELECT COUNT(*) FROM staff WHERE email = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    @Override
    public boolean isEmployeeIdExists(String instituteId, String employeeId) throws SQLException {
        logger.debug("Checking if employee ID exists: {} for institute: {}", employeeId, instituteId);
        String sql = "SELECT COUNT(*) FROM staff WHERE institute_id = ? AND employee_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, instituteId);
            pstmt.setString(2, employeeId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
}
