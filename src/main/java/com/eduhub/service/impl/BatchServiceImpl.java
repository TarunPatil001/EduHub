package com.eduhub.service.impl;

import com.eduhub.dao.impl.BatchDAOImpl;
import com.eduhub.dao.interfaces.BatchDAO;
import com.eduhub.model.Batch;
import com.eduhub.service.interfaces.BatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class BatchServiceImpl implements BatchService {
    
    private static final Logger logger = LoggerFactory.getLogger(BatchServiceImpl.class);
    private BatchDAO batchDAO;

    public BatchServiceImpl() {
        this.batchDAO = new BatchDAOImpl();
    }

    @Override
    public boolean createBatch(Batch batch) {
        // Check if batch code already exists
        if (batchDAO.isBatchCodeExists(batch.getInstituteId(), batch.getBatchCode())) {
            logger.warn("Batch code {} already exists for institute {}", batch.getBatchCode(), batch.getInstituteId());
            return false;
        }
        return batchDAO.createBatch(batch);
    }

    @Override
    public Batch getBatchById(String batchId, String instituteId) {
        return batchDAO.getBatchById(batchId, instituteId);
    }

    @Override
    public List<Batch> getBatchesByCourseId(String courseId, String instituteId) {
        return batchDAO.getBatchesByCourseId(courseId, instituteId);
    }

    @Override
    public List<Batch> getAllBatches(String instituteId) {
        return batchDAO.getAllBatches(instituteId);
    }

    @Override
    public boolean updateBatch(Batch batch) {
        // Check if batch code exists for other batches (if code is being updated)
        Batch existingBatch = batchDAO.getBatchById(batch.getBatchId(), batch.getInstituteId());
        if (existingBatch != null && !existingBatch.getBatchCode().equals(batch.getBatchCode())) {
            if (batchDAO.isBatchCodeExists(batch.getInstituteId(), batch.getBatchCode())) {
                logger.warn("Batch code {} already exists for institute {}", batch.getBatchCode(), batch.getInstituteId());
                return false;
            }
        }
        return batchDAO.updateBatch(batch);
    }

    @Override
    public boolean deleteBatch(String batchId, String instituteId) {
        return batchDAO.deleteBatch(batchId, instituteId);
    }

    @Override
    public List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery) {
        return batchDAO.getBatchesByFilters(instituteId, courseId, branchId, status, searchQuery);
    }

    @Override
    public List<Batch> getBatchesByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return batchDAO.getBatchesByFilters(instituteId, courseId, branchId, status, searchQuery, offset, pageSize);
    }

    @Override
    public int getBatchCountByFilters(String instituteId, String courseId, String branchId, String status, String searchQuery) {
        return batchDAO.getBatchCountByFilters(instituteId, courseId, branchId, status, searchQuery);
    }
}
