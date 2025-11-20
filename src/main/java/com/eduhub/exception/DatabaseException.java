package com.eduhub.exception;

/**
 * Exception thrown when database operations fail
 */
public class DatabaseException extends RegistrationException {
    
    private String operation;
    
    public DatabaseException(String operation, String message) {
        super("DATABASE_ERROR", message);
        this.operation = operation;
    }
    
    public DatabaseException(String operation, String message, Throwable cause) {
        super("DATABASE_ERROR", message, cause);
        this.operation = operation;
    }
    
    public String getOperation() {
        return operation;
    }
}
