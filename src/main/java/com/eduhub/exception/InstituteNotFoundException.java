package com.eduhub.exception;

/**
 * Exception thrown when institute is not found
 */
public class InstituteNotFoundException extends RegistrationException {
    
    private int instituteId;
    
    public InstituteNotFoundException(int instituteId) {
        super("INSTITUTE_NOT_FOUND", 
              String.format("Institute with ID %d not found", instituteId));
        this.instituteId = instituteId;
    }
    
    public InstituteNotFoundException(String email) {
        super("INSTITUTE_NOT_FOUND", 
              String.format("Institute with email '%s' not found", email));
    }
    
    public int getInstituteId() {
        return instituteId;
    }
}
