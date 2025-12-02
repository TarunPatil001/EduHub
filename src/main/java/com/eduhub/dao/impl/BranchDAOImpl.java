package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.BranchDAO;
import com.eduhub.model.Branch;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BranchDAOImpl implements BranchDAO {
    
    private static final Logger logger = LoggerFactory.getLogger(BranchDAOImpl.class);

    @Override
    public boolean createBranch(Branch branch) {
        String sql = "INSERT INTO branches (branch_id, institute_id, branch_code, branch_name, branch_manager_id, " +
                     "status, email, phone, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, branch.getBranchId());
            pstmt.setString(2, branch.getInstituteId());
            pstmt.setString(3, branch.getBranchCode());
            pstmt.setString(4, branch.getBranchName());
            pstmt.setString(5, branch.getBranchManagerId());
            pstmt.setString(6, branch.getStatus());
            pstmt.setString(7, branch.getEmail());
            pstmt.setString(8, branch.getPhone());
            pstmt.setString(9, branch.getAddress());
            pstmt.setString(10, branch.getCity());
            pstmt.setString(11, branch.getState());
            pstmt.setString(12, branch.getZipCode());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            logger.error("Error creating branch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public Branch getBranchById(String branchId, String instituteId) {
        String sql = "SELECT b.*, CONCAT(s.first_name, ' ', s.last_name) as manager_name FROM branches b " +
                     "LEFT JOIN staff s ON b.branch_manager_id = s.staff_id " +
                     "WHERE b.branch_id = ? AND b.institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, branchId);
            pstmt.setString(2, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBranch(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting branch by ID: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    public List<Branch> getAllBranches(String instituteId) {
        List<Branch> branches = new ArrayList<>();
        String sql = "SELECT b.*, CONCAT(s.first_name, ' ', s.last_name) as manager_name FROM branches b " +
                     "LEFT JOIN staff s ON b.branch_manager_id = s.staff_id " +
                     "WHERE b.institute_id = ? ORDER BY b.created_at DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    branches.add(mapResultSetToBranch(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting all branches: {}", e.getMessage(), e);
        }
        return branches;
    }

    @Override
    public boolean updateBranch(Branch branch) {
        String sql = "UPDATE branches SET branch_code=?, branch_name=?, branch_manager_id=?, status=?, " +
                     "email=?, phone=?, address=?, city=?, state=?, zip_code=? WHERE branch_id=? AND institute_id=?";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, branch.getBranchCode());
            pstmt.setString(2, branch.getBranchName());
            pstmt.setString(3, branch.getBranchManagerId());
            pstmt.setString(4, branch.getStatus());
            pstmt.setString(5, branch.getEmail());
            pstmt.setString(6, branch.getPhone());
            pstmt.setString(7, branch.getAddress());
            pstmt.setString(8, branch.getCity());
            pstmt.setString(9, branch.getState());
            pstmt.setString(10, branch.getZipCode());
            pstmt.setString(11, branch.getBranchId());
            pstmt.setString(12, branch.getInstituteId());
            
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error updating branch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean deleteBranch(String branchId, String instituteId) {
        String sql = "DELETE FROM branches WHERE branch_id = ? AND institute_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, branchId);
            pstmt.setString(2, instituteId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting branch: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public boolean isBranchCodeExists(String instituteId, String branchCode) {
        String sql = "SELECT COUNT(*) FROM branches WHERE institute_id = ? AND branch_code = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, instituteId);
            pstmt.setString(2, branchCode);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            logger.error("Error checking branch code existence: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public List<Branch> getBranchesWithFilters(String instituteId, String searchQuery, String city, String state, String status, int offset, int limit) {
        List<Branch> branches = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT b.*, CONCAT(s.first_name, ' ', s.last_name) as manager_name FROM branches b " +
            "LEFT JOIN staff s ON b.branch_manager_id = s.staff_id " +
            "WHERE b.institute_id = ?"
        );
        
        List<Object> params = new ArrayList<>();
        params.add(instituteId);
        
        // Add search filter
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            sql.append(" AND (LOWER(b.branch_name) LIKE ? OR LOWER(b.branch_code) LIKE ? OR LOWER(b.city) LIKE ?)");
            String pattern = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }
        
        // Add city filter
        if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
            sql.append(" AND b.city = ?");
            params.add(city);
        }
        
        // Add state filter
        if (state != null && !state.trim().isEmpty() && !state.equalsIgnoreCase("all")) {
            sql.append(" AND b.state = ?");
            params.add(state);
        }
        
        // Add status filter
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
            sql.append(" AND b.status = ?");
            params.add(status);
        }
        
        sql.append(" ORDER BY b.created_at DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    pstmt.setString(i + 1, (String) param);
                } else if (param instanceof Integer) {
                    pstmt.setInt(i + 1, (Integer) param);
                }
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    branches.add(mapResultSetToBranch(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting branches with filters: {}", e.getMessage(), e);
        }
        return branches;
    }

    @Override
    public int getBranchCount(String instituteId, String searchQuery, String city, String state, String status) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM branches b WHERE b.institute_id = ?");
        
        List<Object> params = new ArrayList<>();
        params.add(instituteId);
        
        // Add search filter
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            sql.append(" AND (LOWER(b.branch_name) LIKE ? OR LOWER(b.branch_code) LIKE ? OR LOWER(b.city) LIKE ?)");
            String pattern = "%" + searchQuery.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }
        
        // Add city filter
        if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
            sql.append(" AND b.city = ?");
            params.add(city);
        }
        
        // Add state filter
        if (state != null && !state.trim().isEmpty() && !state.equalsIgnoreCase("all")) {
            sql.append(" AND b.state = ?");
            params.add(state);
        }
        
        // Add status filter
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
            sql.append(" AND b.status = ?");
            params.add(status);
        }
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                Object param = params.get(i);
                if (param instanceof String) {
                    pstmt.setString(i + 1, (String) param);
                }
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting branch count: {}", e.getMessage(), e);
        }
        return 0;
    }

    private Branch mapResultSetToBranch(ResultSet rs) throws SQLException {
        Branch branch = new Branch();
        branch.setBranchId(rs.getString("branch_id"));
        branch.setInstituteId(rs.getString("institute_id"));
        branch.setBranchCode(rs.getString("branch_code"));
        branch.setBranchName(rs.getString("branch_name"));
        branch.setBranchManagerId(rs.getString("branch_manager_id"));
        
        // Try to get manager name if available in the result set
        try {
            String managerName = rs.getString("manager_name");
            logger.debug("Mapped manager_name: '{}' for branch: '{}' (ID: {})", managerName, branch.getBranchName(), branch.getBranchId());
            branch.setBranchManagerName(managerName);
        } catch (SQLException e) {
            logger.warn("Column manager_name not found in result set for branch: {}", branch.getBranchName());
        }
        
        branch.setStatus(rs.getString("status"));
        branch.setEmail(rs.getString("email"));
        branch.setPhone(rs.getString("phone"));
        branch.setAddress(rs.getString("address"));
        branch.setCity(rs.getString("city"));
        branch.setState(rs.getString("state"));
        branch.setZipCode(rs.getString("zip_code"));
        branch.setCreatedAt(rs.getTimestamp("created_at"));
        branch.setUpdatedAt(rs.getTimestamp("updated_at"));
        return branch;
    }
}
