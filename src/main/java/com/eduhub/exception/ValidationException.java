package com.eduhub.exception;

/**
 * Exception thrown when input validation fails
 */
public class ValidationException extends RegistrationException {
    
    private String fieldName;
    private String invalidValue;
    
    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
    }
    
    public ValidationException(String fieldName, String message) {
        super("VALIDATION_ERROR", message);
        this.fieldName = fieldName;
    }
    
    public ValidationException(String fieldName, String invalidValue, String message) {
        super("VALIDATION_ERROR", message);
        this.fieldName = fieldName;
        this.invalidValue = invalidValue;
    }
    
    public String getFieldName() {
        return fieldName;
    }
    
    public String getInvalidValue() {
        return invalidValue;
    }
}
