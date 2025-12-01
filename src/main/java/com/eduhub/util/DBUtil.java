package com.eduhub.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DBUtil {
	
	private static final Logger logger = LoggerFactory.getLogger(DBUtil.class);
	
	// variables used to store database configuration
	private static String url;
	private static String username;
	private static String password;
	private static String driver;
	
	// Track if tables have been verified
	private static boolean tablesVerified = false;
	
	 /*
     * STATIC BLOCK:
     * This block runs ONLY ONCE when the class is loaded.
     * Here we load the db.properties file and initialize DB credentials.
     */
	static {
		try {
			// Create Properties object to read key-value pairs
			Properties props = new Properties();
			
			/*
             * Load the db.properties file from src/main/resources.
             * getResourceAsStream searches the classpath and returns the file as InputStream.
             */
			InputStream input = DBUtil.class.getClassLoader().getResourceAsStream("db.properties");
			
			if (input != null) {
				// Load all values from the properties file into props object
				props.load(input);
			} else {
				logger.warn("db.properties not found. Relying on environment variables.");
			}
			
			// Determine environment: Check System Env first, then properties, default to local
			String env = System.getenv("app.environment");
			if (env == null || env.trim().isEmpty()) {
				env = props.getProperty("app.environment", "local");
			}
			
			logger.info("Initializing Database in {} mode", env);
			
			String prefix = "local.";
			if ("production".equalsIgnoreCase(env)) {
				prefix = "prod.";
			}

			// Helper function to get value with priority: Env -> Property -> Default
			// Also handles empty strings in properties by treating them as null
			String dbHost = getValue(props, prefix + "db.host", "DB_HOST", "localhost");
			String dbPort = getValue(props, prefix + "db.port", "DB_PORT", "3306");
			String dbName = getValue(props, prefix + "db.name", "DB_NAME", "eduhub");
			String sslMode = getValue(props, prefix + "db.sslMode", "DB_SSL_MODE", "");
			username = getValue(props, prefix + "db.username", "DB_USER", "root");
			password = getValue(props, prefix + "db.password", "DB_PASSWORD", "root");

			driver = props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
		 
			// Build the connection URL
			// Standard MySQL format: jdbc:mysql://host:port/database
			StringBuilder urlBuilder = new StringBuilder("jdbc:mysql://")
					.append(dbHost).append(":").append(dbPort).append("/").append(dbName);
		 
			// Add SSL mode parameters
			if (sslMode != null && !sslMode.isEmpty() && !sslMode.equalsIgnoreCase("false")) {
				urlBuilder.append("?sslMode=").append(sslMode);
			} else {
				// For localhost/dev, usually disable SSL and allow public key retrieval
				urlBuilder.append("?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
			}
		 
			url = urlBuilder.toString();
	         
	         /*
	             * Load the JDBC driver class into memory.
	             * Example: com.mysql.cj.jdbc.Driver
	             */
	         Class.forName(driver);
	         logger.info("Database configuration loaded successfully");
	         logger.info("Database URL: {}", url);
	         
	         // Initialize database tables if they don't exist
	         initializeDatabaseTables();
			
		}catch(Exception e) {
			 logger.error("Failed to load database configuration", e);
			 throw new RuntimeException("Database initialization failed", e);
		}
	}
	
	/**
	 * Helper method to get configuration value with priority:
	 * 1. System Environment Variable (e.g. DB_HOST)
	 * 2. System Environment Variable with prefix (e.g. prod.db.host)
	 * 3. Property from file (e.g. prod.db.host)
	 * 4. Default value
	 */
	private static String getValue(Properties props, String propKey, String envKey, String defaultValue) {
		// 1. Check specific environment variable (e.g. DB_HOST)
		String value = System.getenv(envKey);
		if (value != null && !value.trim().isEmpty()) {
			return value;
		}
		
		// 2. Check prefixed environment variable (e.g. prod.db.host)
		value = System.getenv(propKey);
		if (value != null && !value.trim().isEmpty()) {
			return value;
		}
		
		// 3. Check property from file
		value = props.getProperty(propKey);
		if (value != null && !value.trim().isEmpty()) {
			return value;
		}
		
		// 4. Return default
		return defaultValue;
	}
	
	/**
	 * Initialize database tables if they don't exist
	 * This method checks if tables exist and creates them if necessary
	 */
	private static void initializeDatabaseTables() {
		Connection conn = null;
		try {
			logger.info("Connecting to database for table initialization...");
			conn = DriverManager.getConnection(url, username, password);
			logger.info("Database connection established successfully");
			
			// Check if institutes table exists
			boolean institutesExists = tableExists(conn, "institutes");
			logger.info("Institutes table exists: {}", institutesExists);
			
			if (!institutesExists) {
				logger.warn("Institutes table not found. Creating...");
				createInstitutesTable(conn);
				institutesExists = true; // Assume creation was successful if no exception was thrown
				logger.info("Institutes table created successfully");
			}
			
			// Only proceed to create users table if institutes table exists
			if (institutesExists) {
				boolean usersExists = tableExists(conn, "users");
				logger.info("Users table exists: {}", usersExists);
				
				if (!usersExists) {
					logger.warn("Users table not found. Creating...");
					createUsersTable(conn);
					logger.info("Users table created successfully");
				}

				// Check if courses table exists
				boolean coursesExists = tableExists(conn, "courses");
				logger.info("Courses table exists: {}", coursesExists);
				
				if (!coursesExists) {
					logger.warn("Courses table not found. Creating...");
					createCoursesTable(conn);
					logger.info("Courses table created successfully");
				}

				// Check if staff table exists
				boolean staffExists = tableExists(conn, "staff");
				logger.info("Staff table exists: {}", staffExists);
				
				if (!staffExists) {
					logger.warn("Staff table not found. Creating...");
					createStaffTable(conn);
					logger.info("Staff table created successfully");
				}

				// Check if staff_certifications table exists
				boolean staffCertificationsExists = tableExists(conn, "staff_certifications");
				logger.info("Staff certifications table exists: {}", staffCertificationsExists);
				
				if (!staffCertificationsExists) {
					logger.warn("Staff certifications table not found. Creating...");
					createStaffCertificationsTable(conn);
					logger.info("Staff certifications table created successfully");
				}

				// Check if staff_documents table exists
				boolean staffDocumentsExists = tableExists(conn, "staff_documents");
				logger.info("Staff documents table exists: {}", staffDocumentsExists);
				
				if (!staffDocumentsExists) {
					logger.warn("Staff documents table not found. Creating...");
					createStaffDocumentsTable(conn);
					logger.info("Staff documents table created successfully");
				}
			} else {
				logger.error("Skipping users and courses table creation because institutes table does not exist.");
			}
			
			logger.info("Database tables initialized successfully");
			
		} catch (SQLException e) {
			logger.error("Failed to initialize database tables: " + e.getMessage(), e);
			logger.error("SQL State: " + e.getSQLState());
			logger.error("Error Code: " + e.getErrorCode());
			// Don't throw exception - allow app to start even if table creation fails
			// This gives admin a chance to manually create tables
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					logger.error("Failed to close connection", e);
				}
			}
		}
	}
	
	/**
	 * Check if a table exists in the database
	 */
	private static boolean tableExists(Connection conn, String tableName) throws SQLException {
		// Get database name from connection
		String databaseName = conn.getCatalog();
		// Try both with and without database name, and check both lowercase and original case
		try (var rs = conn.getMetaData().getTables(databaseName, null, tableName, new String[]{"TABLE"})) {
			if (rs.next()) {
				return true;
			}
		}
		// Also try with uppercase table name (for case-sensitive systems)
		try (var rs = conn.getMetaData().getTables(databaseName, null, tableName.toUpperCase(), new String[]{"TABLE"})) {
			if (rs.next()) {
				return true;
			}
		}
		// Also try with lowercase table name
		try (var rs = conn.getMetaData().getTables(databaseName, null, tableName.toLowerCase(), new String[]{"TABLE"})) {
			if (rs.next()) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Create institutes table
	 * Optimized for MySQL 8.0+ / TiDB Cloud
	 */
	private static void createInstitutesTable(Connection conn) throws SQLException {
		String sql = "CREATE TABLE institutes (" +
				"institute_id VARCHAR(36) PRIMARY KEY, " +
				"institute_name VARCHAR(255) NOT NULL, " +
				"institute_type VARCHAR(100) NOT NULL, " +
				"institute_email VARCHAR(255) NOT NULL UNIQUE, " +
				"institute_phone VARCHAR(20), " +
				"address TEXT, " +
				"city VARCHAR(100), " +
				"state VARCHAR(100), " +
				"zip_code VARCHAR(20), " +
				"country VARCHAR(100), " +
				"registration_status VARCHAR(50) DEFAULT 'approved', " +
				"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
				"approved_at TIMESTAMP NULL, " +
				"approved_by VARCHAR(36) NULL, " +
				"rejection_reason TEXT NULL, " +
				"INDEX idx_institute_email (institute_email), " +
				"INDEX idx_registration_status (registration_status)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Institutes table created successfully");
		}
	}
	
	/**
	 * Create users table
	 * Optimized for MySQL 8.0+ / TiDB Cloud
	 */
	private static void createUsersTable(Connection conn) throws SQLException {
		String sql = "CREATE TABLE users (" +
				"user_id VARCHAR(36) PRIMARY KEY, " +
				"institute_id VARCHAR(36) NOT NULL, " +
				"full_name VARCHAR(255) NOT NULL, " +
				"email VARCHAR(255) NOT NULL UNIQUE, " +
				"password_hash VARCHAR(255) NOT NULL, " +
				"phone VARCHAR(20), " +
				"role VARCHAR(50) NOT NULL DEFAULT 'student', " +
				"status VARCHAR(50) DEFAULT 'active', " +
				"profile_photo_url VARCHAR(255) NULL, " +
				"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
				"last_login TIMESTAMP NULL, " +
				"FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE, " +
				"INDEX idx_email (email), " +
				"INDEX idx_institute_id (institute_id), " +
				"INDEX idx_role (role), " +
				"INDEX idx_status (status)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Users table created successfully");
		}
	}

	/**
	 * Create courses table
	 * Optimized for MySQL 8.0+ / TiDB Cloud
	 */
	private static void createCoursesTable(Connection conn) throws SQLException {
		String sql = "CREATE TABLE courses (" +
				"course_id VARCHAR(36) PRIMARY KEY, " +
				"institute_id VARCHAR(36) NOT NULL, " +
				"course_code VARCHAR(50) NOT NULL, " +
				"course_name VARCHAR(100) NOT NULL, " +
				"category VARCHAR(50), " +
				"level VARCHAR(20), " +
				"description TEXT, " +
				"duration_value INT, " +
				"duration_unit VARCHAR(20), " +
				"fee DECIMAL(10, 2), " +
				"status VARCHAR(20) DEFAULT 'Active', " +
				"certificate_offered BOOLEAN DEFAULT FALSE, " +
				"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
				"FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE, " +
				"UNIQUE KEY unique_course_code (institute_id, course_code), " +
				"INDEX idx_institute_id (institute_id), " +
				"INDEX idx_status (status)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Courses table created successfully");
		}
	}
	
	/**
	 * Create staff table
	 * Optimized for MySQL 8.0+ / TiDB Cloud
	 */
	private static void createStaffTable(Connection conn) throws SQLException {
		logger.info("Attempting to create staff table...");
		String sql = "CREATE TABLE staff (" +
				"staff_id VARCHAR(36) PRIMARY KEY, " +
				"institute_id VARCHAR(36) NOT NULL, " +
				"first_name VARCHAR(100) NOT NULL, " +
				"last_name VARCHAR(100) NOT NULL, " +
				"date_of_birth DATE NOT NULL, " +
				"gender VARCHAR(20) NOT NULL, " +
				"nationality VARCHAR(100), " +
				"marital_status VARCHAR(50), " +
				"employee_id VARCHAR(50) NOT NULL, " +
				"role VARCHAR(50) NOT NULL, " +
				"joining_date DATE NOT NULL, " +
				"employment_type VARCHAR(50) NOT NULL, " +
				"salary DECIMAL(10, 2) NOT NULL, " +
				"work_shift VARCHAR(50), " +
				"reporting_manager VARCHAR(100), " +
				"phone VARCHAR(20) NOT NULL, " +
				"email VARCHAR(255) NOT NULL, " +
				"address TEXT NOT NULL, " +
				"city VARCHAR(100) NOT NULL, " +
				"state VARCHAR(100) NOT NULL, " +
				"postal_code VARCHAR(20) NOT NULL, " +
				"emergency_contact_name VARCHAR(100), " +
				"emergency_contact_phone VARCHAR(20), " +
				"emergency_contact_relation VARCHAR(50), " +
				"highest_qualification VARCHAR(100) NOT NULL, " +
				"specialization VARCHAR(100), " +
				"experience DOUBLE, " +
				"status VARCHAR(50) DEFAULT 'Yet to Onboard', " +
				"profile_photo_url VARCHAR(255), " +
				"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
				"FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE, " +
				"UNIQUE KEY unique_employee_id (institute_id, employee_id), " +
				"INDEX idx_institute_id (institute_id), " +
				"INDEX idx_email (email), " +
				"INDEX idx_status (status)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Staff table created successfully");
		}
	}

	/**
	 * Create staff certifications table
	 */
	private static void createStaffCertificationsTable(Connection conn) throws SQLException {
		logger.info("Attempting to create staff_certifications table...");
		String sql = "CREATE TABLE staff_certifications (" +
				"certification_id VARCHAR(36) PRIMARY KEY, " +
				"staff_id VARCHAR(36) NOT NULL, " +
				"name VARCHAR(255) NOT NULL, " +
				"issuing_organization VARCHAR(255) NOT NULL, " +
				"issue_date DATE NOT NULL, " +
				"expiry_date DATE, " +
				"credential_id VARCHAR(100), " +
				"verification_url VARCHAR(500), " +
				"certificate_file_url VARCHAR(500), " +
				"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE, " +
				"INDEX idx_staff_id (staff_id)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Staff certifications table created successfully");
		}
	}

	/**
	 * Create staff documents table
	 */
	private static void createStaffDocumentsTable(Connection conn) throws SQLException {
		logger.info("Attempting to create staff_documents table...");
		String sql = "CREATE TABLE staff_documents (" +
				"document_id VARCHAR(36) PRIMARY KEY, " +
				"staff_id VARCHAR(36) NOT NULL, " +
				"document_type VARCHAR(50) NOT NULL, " +
				"document_url VARCHAR(500) NOT NULL, " +
				"uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
				"FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE, " +
				"INDEX idx_staff_id (staff_id)" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
		
		try (var stmt = conn.createStatement()) {
			stmt.executeUpdate(sql);
			logger.info("Staff documents table created successfully");
		}
	}
	
	
	/*
     * This method will be called whenever you need a DB connection.
     * It returns a Connection object using the loaded credentials.
     * For TiDB Cloud, username and password are already embedded in the URL.
     */
	public static Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, username, password);
	}

}