package com.eduhub.dao.interfaces;

import com.eduhub.model.Batch;
import java.util.List;

public interface BatchDAO {
    boolean createBatch(Batch batch);
    Batch getBatchById(String batchId, String instituteId);
    List<Batch> getBatchesByCourseId(String courseId, String instituteId);
    List<Batch> getAllBatches(String instituteId);
    boolean updateBatch(Batch batch);
    boolean deleteBatch(String batchId, String instituteId);
    boolean isBatchCodeExists(String instituteId, String batchCode);
}
