package com.eduhub.exception;

/**
 * Exception thrown when duplicate email is found during registration
 */
public class DuplicateEmailException extends RegistrationException {
    
    private String email;
    private String emailType; // "institute" or "admin"
    
    public DuplicateEmailException(String email, String emailType) {
        super("DUPLICATE_EMAIL", 
              String.format("%s email '%s' is already registered", 
                          emailType.substring(0, 1).toUpperCase() + emailType.substring(1), 
                          email));
        this.email = email;
        this.emailType = emailType;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getEmailType() {
        return emailType;
    }
}
