package com.eduhub.controller;

import com.eduhub.dao.impl.FeeDAOImpl;
import com.eduhub.dao.interfaces.FeeDAO;
import com.eduhub.model.Fee;
import com.eduhub.model.Transaction;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@WebServlet("/fees/*")
public class FeeServlet extends HttpServlet {
    private FeeDAO feeDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        feeDAO = new FeeDAOImpl();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (pathInfo.equals("/student")) {
            handleGetStudentFee(request, response);
        } else if (pathInfo.equals("/history")) {
            handleGetTransactionHistory(request, response);
        } else if (pathInfo.equals("/search")) {
            handleSearchStudents(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/pay")) {
            handleRecordPayment(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private void handleGetStudentFee(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String studentId = request.getParameter("id");
        String instituteId = (String) request.getSession().getAttribute("instituteId");
        
        if (instituteId == null) instituteId = "INST001"; // Fallback for dev

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        if (studentId == null || studentId.trim().isEmpty()) {
            out.print(gson.toJson(new ResponseMessage(false, "Student ID is required")));
            return;
        }

        // Use getFeesByFilters to get comprehensive details including student name, course, etc.
        // We filter by specific student ID in the search parameter
        List<Fee> fees = feeDAO.getFeesByFilters(instituteId, null, null, studentId, 1, 1);

        if (fees != null && !fees.isEmpty()) {
            // Check if the returned record actually matches the ID (search is fuzzy)
            Fee fee = fees.stream()
                    .filter(f -> f.getStudentId().equalsIgnoreCase(studentId))
                    .findFirst()
                    .orElse(null);
            
            if (fee != null) {
                out.print(gson.toJson(new ResponseMessage(true, "Student found", fee)));
            } else {
                out.print(gson.toJson(new ResponseMessage(false, "Student not found")));
            }
        } else {
            out.print(gson.toJson(new ResponseMessage(false, "Student not found")));
        }
    }
    
    private void handleGetTransactionHistory(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String studentId = request.getParameter("studentId");
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        if (studentId == null || studentId.trim().isEmpty()) {
            out.print(gson.toJson(new ResponseMessage(false, "Student ID is required")));
            return;
        }

        List<Transaction> transactions = feeDAO.getTransactionsByStudentId(studentId);
        out.print(gson.toJson(new ResponseMessage(true, "History fetched", transactions)));
    }
    
    private void handleSearchStudents(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String query = request.getParameter("q");
        String instituteId = (String) request.getSession().getAttribute("instituteId");
        
        if (instituteId == null) instituteId = "INST001"; // Fallback

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        if (query == null || query.trim().length() < 2) {
            out.print(gson.toJson(List.of()));
            return;
        }

        // Search for students (limit 10)
        List<Fee> students = feeDAO.getFeesByFilters(instituteId, null, null, query, 1, 10);
        out.print(gson.toJson(students));
    }

    private void handleRecordPayment(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Parse JSON body
            JsonObject data = gson.fromJson(request.getReader(), JsonObject.class);
            
            String studentId = data.get("studentId").getAsString();
            BigDecimal amount = data.get("amount").getAsBigDecimal();
            String paymentDateStr = data.get("paymentDate").getAsString();
            String paymentMode = "Cash";
            if (data.has("paymentMethod") && !data.get("paymentMethod").isJsonNull()) {
                paymentMode = data.get("paymentMethod").getAsString();
            }
            
            String receiptNumber = null;
            if (data.has("receiptNumber") && !data.get("receiptNumber").isJsonNull()) {
                receiptNumber = data.get("receiptNumber").getAsString();
            }

            String status = "Paid"; // Default, will calculate
            
            String instituteId = (String) request.getSession().getAttribute("instituteId");
            if (instituteId == null) instituteId = "INST001";

            // Get existing fee record
            Fee existingFee = feeDAO.getFeeByStudentId(studentId);
            
            boolean success;
            String feeId;
            
            if (existingFee != null) {
                feeId = existingFee.getFeeId();
                // Update existing
                BigDecimal newPaid = existingFee.getPaidAmount().add(amount);
                BigDecimal newPending = existingFee.getTotalFee().subtract(newPaid);
                
                if (newPending.compareTo(BigDecimal.ZERO) <= 0) {
                    newPending = BigDecimal.ZERO;
                    status = "Paid";
                } else {
                    status = "Partial";
                }
                
                existingFee.setPaidAmount(newPaid);
                existingFee.setPendingAmount(newPending);
                existingFee.setStatus(status);
                existingFee.setLastPaymentDate(Date.valueOf(paymentDateStr));
                
                success = feeDAO.updateFee(existingFee);
            } else {
                // Create new fee record
                List<Fee> details = feeDAO.getFeesByFilters(instituteId, null, null, studentId, 1, 1);
                if (details.isEmpty()) {
                    out.print(gson.toJson(new ResponseMessage(false, "Student not found")));
                    return;
                }
                
                Fee detail = details.get(0);
                Fee newFee = new Fee();
                feeId = UUID.randomUUID().toString();
                newFee.setFeeId(feeId);
                newFee.setInstituteId(instituteId);
                newFee.setStudentId(studentId);
                newFee.setTotalFee(detail.getTotalFee()); // Course fee
                newFee.setPaidAmount(amount);
                newFee.setPendingAmount(detail.getTotalFee().subtract(amount));
                
                if (newFee.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    newFee.setPendingAmount(BigDecimal.ZERO);
                    newFee.setStatus("Paid");
                } else {
                    newFee.setStatus("Partial");
                }
                
                newFee.setLastPaymentDate(Date.valueOf(paymentDateStr));
                // Set a default due date if needed, e.g., 30 days from now
                newFee.setDueDate(new Date(System.currentTimeMillis() + 2592000000L)); 
                
                success = feeDAO.addFee(newFee);
            }

            if (success) {
                // Record Transaction
                Transaction transaction = new Transaction();
                if (receiptNumber != null && !receiptNumber.isEmpty()) {
                    transaction.setTransactionId(receiptNumber);
                } else {
                    transaction.setTransactionId(UUID.randomUUID().toString());
                }
                transaction.setFeeId(feeId);
                transaction.setInstituteId(instituteId);
                transaction.setStudentId(studentId);
                transaction.setAmount(amount);
                transaction.setPaymentMode(paymentMode);
                transaction.setTransactionDate(new Timestamp(System.currentTimeMillis()));
                transaction.setStatus("Success");
                transaction.setRemarks("Fee Payment");
                
                feeDAO.addTransaction(transaction);
                
                // Return the transaction ID (receipt number) in the response
                ResponseMessage responseMsg = new ResponseMessage(true, "Payment recorded successfully");
                responseMsg.transactionId = transaction.getTransactionId();
                out.print(gson.toJson(responseMsg));
            } else {
                out.print(gson.toJson(new ResponseMessage(false, "Failed to record payment in database")));
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.print(gson.toJson(new ResponseMessage(false, "Error processing payment: " + e.getMessage())));
        }
    }

    // Helper class for JSON responses
    private static class ResponseMessage {
        boolean success;
        String message;
        Object data;
        String transactionId; // Added field

        ResponseMessage(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        ResponseMessage(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
    }
}
