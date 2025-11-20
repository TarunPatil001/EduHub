package com.eduhub.exception;

/**
 * Custom exception for registration-related errors
 */
public class RegistrationException extends Exception {
    
    private String errorCode;
    
    public RegistrationException(String message) {
        super(message);
    }
    
    public RegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public RegistrationException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public RegistrationException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
