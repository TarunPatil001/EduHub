package com.eduhub.service.impl;

import com.eduhub.dao.interfaces.BranchDAO;
import com.eduhub.dao.impl.BranchDAOImpl;
import com.eduhub.model.Branch;
import com.eduhub.service.interfaces.BranchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class BranchServiceImpl implements BranchService {
    
    private static final Logger logger = LoggerFactory.getLogger(BranchServiceImpl.class);
    private BranchDAO branchDAO;

    public BranchServiceImpl() {
        this.branchDAO = new BranchDAOImpl();
    }

    @Override
    public boolean createBranch(Branch branch) {
        // Validate if branch code already exists for this institute
        if (branchDAO.isBranchCodeExists(branch.getInstituteId(), branch.getBranchCode())) {
            logger.warn("Branch code {} already exists for institute {}", branch.getBranchCode(), branch.getInstituteId());
            return false;
        }
        return branchDAO.createBranch(branch);
    }

    @Override
    public Branch getBranchById(String branchId, String instituteId) {
        return branchDAO.getBranchById(branchId, instituteId);
    }

    @Override
    public List<Branch> getAllBranches(String instituteId) {
        return branchDAO.getAllBranches(instituteId);
    }

    @Override
    public boolean updateBranch(Branch branch) {
        return branchDAO.updateBranch(branch);
    }

    @Override
    public boolean deleteBranch(String branchId, String instituteId) {
        return branchDAO.deleteBranch(branchId, instituteId);
    }

    @Override
    public java.util.Map<String, Object> getBranchesWithFilters(String instituteId, String searchQuery, String city, String state, String status, int page, int limit) {
        int offset = (page - 1) * limit;
        List<Branch> branches = branchDAO.getBranchesWithFilters(instituteId, searchQuery, city, state, status, offset, limit);
        int totalCount = branchDAO.getBranchCount(instituteId, searchQuery, city, state, status);
        int totalPages = (int) Math.ceil((double) totalCount / limit);
        
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("branches", branches);
        result.put("totalCount", totalCount);
        result.put("totalPages", totalPages);
        result.put("currentPage", page);
        result.put("pageSize", limit);
        
        return result;
    }
}
