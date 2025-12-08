package com.eduhub.service.impl;

import com.eduhub.dao.impl.CertificateDAOImpl;
import com.eduhub.dao.impl.StudentDAOImpl;
import com.eduhub.dao.impl.BatchDAOImpl;
import com.eduhub.dao.interfaces.CertificateDAO;
import com.eduhub.dao.interfaces.StudentDAO;
import com.eduhub.dao.interfaces.BatchDAO;
import com.eduhub.model.Certificate;
import com.eduhub.model.Student;
import com.eduhub.model.Batch;
import com.eduhub.service.interfaces.CertificateService;
import com.eduhub.util.AESTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of CertificateService interface.
 * Uses AES-256-GCM encryption for secure verification tokens.
 */
public class CertificateServiceImpl implements CertificateService {
    
    private static final Logger logger = LoggerFactory.getLogger(CertificateServiceImpl.class);
    
    private final CertificateDAO certificateDAO;
    private final StudentDAO studentDAO;
    private final BatchDAO batchDAO;
    
    public CertificateServiceImpl() {
        this.certificateDAO = new CertificateDAOImpl();
        this.studentDAO = new StudentDAOImpl();
        this.batchDAO = new BatchDAOImpl();
    }

    @Override
    public Certificate generateCertificate(String studentId, String instituteId, String batchId, 
                                           String courseName, String certificateType, String generatedBy) {
        try {
            // Get student details
            Student student = studentDAO.getStudentById(studentId);
            if (student == null) {
                logger.error("Student not found: {}", studentId);
                return null;
            }
            
            // Get batch details if batchId provided
            Batch batch = null;
            if (batchId != null && !batchId.isEmpty()) {
                batch = batchDAO.getBatchById(batchId, instituteId);
            }
            
            // Generate certificate
            Certificate cert = new Certificate();
            cert.setCertificateId(generateCertificateId(instituteId, courseName));
            cert.setStudentId(studentId);
            cert.setInstituteId(instituteId);
            cert.setBatchId(batchId);
            cert.setCourseId(batch != null ? batch.getCourseId() : null);
            cert.setCertificateType(certificateType != null ? certificateType : "completion");
            cert.setCourseName(courseName != null ? courseName : (batch != null ? batch.getBatchName() : "Program"));
            
            // Build student full name
            String fullName = buildFullName(student);
            cert.setStudentName(fullName);
            
            // Set dates
            cert.setIssueDate(Date.valueOf(LocalDate.now()));
            cert.setExpiryDate(null); // No expiry by default
            
            // Generate verification token
            String token = generateVerificationToken(cert.getCertificateId(), studentId);
            cert.setVerificationToken(token);
            cert.setVerificationUrl("/verify/certificate/" + token);
            
            cert.setRevoked(false);
            cert.setSignatoryName("Director");
            cert.setSignatoryTitle("Director");
            cert.setGeneratedBy(generatedBy);
            cert.setDownloadCount(0);
            
            // Save to database
            boolean saved = certificateDAO.addCertificate(cert);
            if (saved) {
                logger.info("Certificate generated successfully: {}", cert.getCertificateId());
                return cert;
            } else {
                logger.error("Failed to save certificate to database");
                return null;
            }
        } catch (Exception e) {
            logger.error("Error generating certificate: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public List<Certificate> generateBatchCertificates(String batchId, String instituteId, 
                                                        String certificateType, String generatedBy) {
        List<Certificate> certificates = new ArrayList<>();
        
        try {
            // Get batch details
            Batch batch = batchDAO.getBatchById(batchId, instituteId);
            if (batch == null) {
                logger.error("Batch not found: {}", batchId);
                return certificates;
            }
            
            // Get all students in batch using filter method
            List<Student> students = studentDAO.getStudentsByFilters(instituteId, null, null, batchId, null, null, 1, 1000);
            
            for (Student student : students) {
                // Check if certificate already exists
                if (!certificateDAO.certificateExists(student.getStudentId(), batch.getCourseId(), batchId)) {
                    Certificate cert = generateCertificate(student.getStudentId(), instituteId, 
                                                          batchId, batch.getBatchName(), certificateType, generatedBy);
                    if (cert != null) {
                        certificates.add(cert);
                    }
                } else {
                    logger.info("Certificate already exists for student: {}", student.getStudentId());
                }
            }
            
            logger.info("Generated {} certificates for batch {}", certificates.size(), batchId);
        } catch (Exception e) {
            logger.error("Error generating batch certificates: {}", e.getMessage(), e);
        }
        
        return certificates;
    }

    @Override
    public Certificate getCertificate(String certificateId) {
        return certificateDAO.getCertificateById(certificateId);
    }

    @Override
    public Certificate verifyCertificate(String verificationToken) {
        Certificate cert = certificateDAO.getCertificateByToken(verificationToken);
        if (cert != null) {
            // Log verification access
            certificateDAO.logCertificateAccess(cert.getCertificateId(), "verify", null, null, null);
        }
        return cert;
    }

    @Override
    public List<Certificate> getStudentCertificates(String studentId, String instituteId) {
        return certificateDAO.getCertificatesByStudent(studentId, instituteId);
    }

    @Override
    public List<Certificate> getBatchCertificates(String batchId, String instituteId) {
        return certificateDAO.getCertificatesByBatch(batchId, instituteId);
    }

    @Override
    public List<Certificate> getInstituteCertificates(String instituteId, int page, int pageSize) {
        return certificateDAO.getCertificatesByInstitute(instituteId, page, pageSize);
    }

    @Override
    public int getCertificateCount(String instituteId) {
        return certificateDAO.getCertificateCount(instituteId);
    }

    @Override
    public boolean revokeCertificate(String certificateId, String reason) {
        return certificateDAO.revokeCertificate(certificateId, reason);
    }
    
    @Override
    public boolean restoreCertificate(String certificateId) {
        return certificateDAO.restoreCertificate(certificateId);
    }

    @Override
    public boolean recordDownload(String certificateId, String downloadedBy, String ipAddress, String userAgent) {
        certificateDAO.incrementDownloadCount(certificateId);
        return certificateDAO.logCertificateAccess(certificateId, "download", downloadedBy, ipAddress, userAgent);
    }

    @Override
    public boolean deleteCertificate(String certificateId, String instituteId) {
        return certificateDAO.deleteCertificate(certificateId, instituteId);
    }

    @Override
    public String generateVerificationToken(String certificateId, String studentId) {
        // Use AES-256-GCM encryption for secure token generation
        String token = AESTokenUtil.generateCertificateToken(studentId, certificateId, null);
        if (token != null) {
            return token;
        }
        
        // Fallback to UUID if AES fails (should rarely happen)
        logger.error("AES token generation failed, using UUID fallback");
        return UUID.randomUUID().toString().replace("-", "").substring(0, 32);
    }

    @Override
    public String generateCertificateId(String instituteId, String courseName) {
        // Generate a unique certificate ID with format: INST-YEAR-MMDD-XXXXXX
        // Where XXXXXX is a unique alphanumeric code
        String instPrefix = instituteId != null && instituteId.length() >= 4 
                          ? instituteId.substring(0, 4).toUpperCase() 
                          : "CERT";
        
        int year = LocalDate.now().getYear();
        String monthDay = String.format("%02d%02d", 
                LocalDate.now().getMonthValue(), 
                LocalDate.now().getDayOfMonth());
        
        // Generate unique alphanumeric code using UUID + timestamp
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        long timestamp = System.currentTimeMillis() % 100000; // Last 5 digits of timestamp
        String uniqueCode = uuid.substring(0, 4) + String.format("%02d", timestamp % 100);
        
        return instPrefix + "-" + year + "-" + monthDay + "-" + uniqueCode;
    }
    
    @Override
    public boolean certificateExists(String studentId, String batchId, String certificateType, String instituteId) {
        return certificateDAO.certificateExistsWithType(studentId, batchId, certificateType, instituteId);
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
