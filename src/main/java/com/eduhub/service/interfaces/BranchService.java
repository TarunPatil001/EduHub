package com.eduhub.service.interfaces;

import com.eduhub.model.Branch;
import java.util.List;
import java.util.Map;

public interface BranchService {
    boolean createBranch(Branch branch);
    Branch getBranchById(String branchId, String instituteId);
    List<Branch> getAllBranches(String instituteId);
    Map<String, Object> getBranchesWithFilters(String instituteId, String searchQuery, String city, String state, String status, int page, int limit);
    boolean updateBranch(Branch branch);
    boolean deleteBranch(String branchId, String instituteId);
}
