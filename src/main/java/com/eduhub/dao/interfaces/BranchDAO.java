package com.eduhub.dao.interfaces;

import com.eduhub.model.Branch;
import java.util.List;

public interface BranchDAO {
    boolean createBranch(Branch branch);
    Branch getBranchById(String branchId, String instituteId);
    List<Branch> getAllBranches(String instituteId);
    List<Branch> getBranchesWithFilters(String instituteId, String searchQuery, String city, String state, String status, int offset, int limit);
    int getBranchCount(String instituteId, String searchQuery, String city, String state, String status);
    boolean updateBranch(Branch branch);
    boolean deleteBranch(String branchId, String instituteId);
    boolean isBranchCodeExists(String instituteId, String branchCode);
}
