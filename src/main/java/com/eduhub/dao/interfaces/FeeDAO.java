package com.eduhub.dao.interfaces;

import com.eduhub.model.Fee;
import com.eduhub.model.Transaction;
import java.util.List;

public interface FeeDAO {
    boolean addFee(Fee fee);
    boolean updateFee(Fee fee);
    boolean addTransaction(Transaction transaction);
    List<Transaction> getTransactionsByStudentId(String studentId, String instituteId);
    Fee getFeeByStudentId(String studentId, String instituteId);
    List<Fee> getAllFees(String instituteId);
    List<Fee> getFeesByFilters(String instituteId, String courseId, String status, String search, int page, int pageSize);
    int getFeeCountByFilters(String instituteId, String courseId, String status, String search);
    
    // Statistics
    int getPaidCount(String instituteId);
    int getPartialCount(String instituteId);
    int getPendingCount(String instituteId);
    int getOverdueCount(String instituteId);
    double getTotalCollected(String instituteId);
    double getTotalPending(String instituteId);
}
