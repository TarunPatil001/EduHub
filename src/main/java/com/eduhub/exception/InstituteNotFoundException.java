package com.eduhub.exception;

/**
 * Exception thrown when institute is not found
 */
public class InstituteNotFoundException extends RegistrationException {
    
    private String instituteId;
    
    public InstituteNotFoundException(String instituteId) {
        super("INSTITUTE_NOT_FOUND", 
              String.format("Institute with ID %s not found", instituteId));
        this.instituteId = instituteId;
    }
    
    public InstituteNotFoundException(String email, boolean isEmail) {
        super("INSTITUTE_NOT_FOUND", 
              String.format("Institute with email '%s' not found", email));
    }
    
    public String getInstituteId() {
        return instituteId;
    }
}
