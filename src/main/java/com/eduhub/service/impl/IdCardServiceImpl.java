package com.eduhub.service.impl;

import com.eduhub.dao.impl.IdCardDAOImpl;
import com.eduhub.dao.impl.StudentDAOImpl;
import com.eduhub.dao.impl.BatchDAOImpl;
import com.eduhub.dao.interfaces.IdCardDAO;
import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.dao.interfaces.BatchDAO;
import com.eduhub.model.IdCard;
import com.eduhub.model.Student;
import com.eduhub.model.Batch;
import com.eduhub.service.interfaces.IdCardService;
import com.eduhub.util.AESTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of IdCardService interface.
 * Uses AES-256-GCM encryption for secure verification tokens.
 */
public class IdCardServiceImpl implements IdCardService {
    
    private static final Logger logger = LoggerFactory.getLogger(IdCardServiceImpl.class);
    private static final int VALIDITY_YEARS = 1; // ID cards valid for 1 year
    
    private final IdCardDAO idCardDAO;
    private final StudentDAO studentDAO;
    private final BatchDAO batchDAO;
    
    public IdCardServiceImpl() {
        this.idCardDAO = new IdCardDAOImpl();
        this.studentDAO = new StudentDAOImpl();
        this.batchDAO = new BatchDAOImpl();
    }

    @Override
    public IdCard generateIdCard(String studentId, String instituteId, String generatedBy) {
        try {
            // Get student details
            Student student = studentDAO.getStudentById(studentId);
            if (student == null) {
                logger.error("Student not found: {}", studentId);
                return null;
            }
            
            // Deactivate any existing active ID cards for this student
            idCardDAO.deactivateAllForStudent(studentId, instituteId);
            
            // Get batch details
            Batch batch = null;
            if (student.getBatchId() != null) {
                batch = batchDAO.getBatchById(student.getBatchId(), instituteId);
            }
            
            // Generate new ID card
            IdCard idCard = new IdCard();
            idCard.setIdCardId(UUID.randomUUID().toString());
            idCard.setStudentId(studentId);
            idCard.setInstituteId(instituteId);
            
            // Build student full name
            String fullName = buildFullName(student);
            idCard.setStudentName(fullName);
            
            // Set department and batch
            idCard.setDepartment(batch != null ? batch.getBranchId() : "General");
            idCard.setBatchName(batch != null ? batch.getBatchName() : "N/A");
            idCard.setProfilePhotoUrl(student.getProfilePhotoUrl());
            
            // Set validity
            idCard.setIssueDate(Date.valueOf(LocalDate.now()));
            idCard.setValidUntil(Date.valueOf(LocalDate.now().plusYears(VALIDITY_YEARS)));
            idCard.setActive(true);
            
            // Generate verification token
            String token = generateVerificationToken(idCard.getIdCardId(), studentId);
            idCard.setVerificationToken(token);
            idCard.setQrCodeData("/verify/id/" + token);
            
            idCard.setGeneratedBy(generatedBy);
            idCard.setRegenerationCount(0);
            
            // Save to database
            boolean saved = idCardDAO.addIdCard(idCard);
            if (saved) {
                logger.info("ID card generated successfully: {}", idCard.getIdCardId());
                return idCard;
            } else {
                logger.error("Failed to save ID card to database");
                return null;
            }
        } catch (Exception e) {
            logger.error("Error generating ID card: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public List<IdCard> generateBatchIdCards(String batchId, String instituteId, String generatedBy) {
        List<IdCard> idCards = new ArrayList<>();
        
        try {
            // Get all students in batch using filter method
            List<Student> students = studentDAO.getStudentsByFilters(instituteId, null, null, batchId, null, null, 1, 1000);
            
            for (Student student : students) {
                IdCard idCard = generateIdCard(student.getStudentId(), instituteId, generatedBy);
                if (idCard != null) {
                    idCards.add(idCard);
                }
            }
            
            logger.info("Generated {} ID cards for batch {}", idCards.size(), batchId);
        } catch (Exception e) {
            logger.error("Error generating batch ID cards: {}", e.getMessage(), e);
        }
        
        return idCards;
    }

    @Override
    public IdCard getIdCard(String idCardId) {
        return idCardDAO.getIdCardById(idCardId);
    }

    @Override
    public IdCard verifyIdCard(String verificationToken) {
        return idCardDAO.getIdCardByToken(verificationToken);
    }

    @Override
    public IdCard getActiveIdCard(String studentId, String instituteId) {
        return idCardDAO.getActiveIdCardByStudent(studentId, instituteId);
    }

    @Override
    public List<IdCard> getStudentIdCards(String studentId, String instituteId) {
        return idCardDAO.getIdCardsByStudent(studentId, instituteId);
    }

    @Override
    public List<IdCard> getInstituteIdCards(String instituteId, int page, int pageSize) {
        return idCardDAO.getIdCardsByInstitute(instituteId, page, pageSize);
    }

    @Override
    public int getIdCardCount(String instituteId) {
        return idCardDAO.getIdCardCount(instituteId);
    }

    @Override
    public boolean deactivateIdCard(String idCardId, String reason) {
        return idCardDAO.deactivateIdCard(idCardId, reason);
    }
    
    @Override
    public boolean activateIdCard(String idCardId) {
        return idCardDAO.activateIdCard(idCardId);
    }

    @Override
    public IdCard regenerateIdCard(String studentId, String instituteId, String generatedBy) {
        // This will automatically deactivate old cards and create a new one
        return generateIdCard(studentId, instituteId, generatedBy);
    }

    @Override
    public boolean deleteIdCard(String idCardId, String instituteId) {
        return idCardDAO.deleteIdCard(idCardId, instituteId);
    }
    
    @Override
    public boolean activeIdCardExists(String studentId, String instituteId) {
        return idCardDAO.activeIdCardExists(studentId, instituteId);
    }

    @Override
    public String generateVerificationToken(String idCardId, String studentId) {
        // Use AES-256-GCM encryption for secure token generation
        String token = AESTokenUtil.generateIdToken(studentId);
        if (token != null) {
            return token;
        }
        
        // Fallback to UUID if AES fails (should rarely happen)
        logger.error("AES token generation failed, using UUID fallback");
        return UUID.randomUUID().toString().replace("-", "").substring(0, 32);
    }

    @Override
    public boolean isIdCardValid(String verificationToken) {
        IdCard idCard = idCardDAO.getIdCardByToken(verificationToken);
        if (idCard == null) {
            return false;
        }
        return idCard.isValid();
    }
    
    /**
     * Helper method to build full name from student
     */
    private String buildFullName(Student student) {
        StringBuilder name = new StringBuilder();
        if (student.getStudentName() != null && !student.getStudentName().isEmpty()) {
            name.append(student.getStudentName());
        }
        if (student.getFatherName() != null && !student.getFatherName().isEmpty()) {
            if (name.length() > 0) name.append(" ");
            name.append(student.getFatherName());
        }
        if (student.getSurname() != null && !student.getSurname().isEmpty()) {
            if (name.length() > 0) name.append(" ");
            name.append(student.getSurname());
        }
        return name.toString().trim();
    }
}
