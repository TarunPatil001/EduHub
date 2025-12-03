package com.eduhub.service.interfaces;

import com.eduhub.model.Batch;
import java.util.List;

public interface BatchService {
    boolean createBatch(Batch batch);
    Batch getBatchById(String batchId, String instituteId);
    List<Batch> getBatchesByCourseId(String courseId, String instituteId);
    List<Batch> getAllBatches(String instituteId);
    boolean updateBatch(Batch batch);
    boolean deleteBatch(String batchId, String instituteId);
    List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery);
    List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery, int page, int pageSize);
    int getBatchCountByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery);
    boolean isBatchCodeExists(String instituteId, String batchCode);
}
