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
			
			if (input == null) {
				 // If file not found → stop program with error
				throw new RuntimeException("Unable to find db.properties");
			}
			
			// Load all values from the properties file into props object
			props.load(input);
			
			// Determine environment: Check System Env first, then properties, default to local
			String env = System.getenv("APP_ENVIRONMENT");
			if (env == null) {
				env = props.getProperty("app.environment", "local");
			}
			
			logger.info("Initializing Database in {} mode", env);
			
			String prefix = "local.";
			if ("production".equalsIgnoreCase(env)) {
				prefix = "prod.";
			}

			// Read configuration with fallback: System Env -> Property with prefix -> Default
			String dbHost = System.getenv("DB_HOST");
			if (dbHost == null) dbHost = props.getProperty(prefix + "db.host", "localhost");

			String dbPort = System.getenv("DB_PORT");
			if (dbPort == null) dbPort = props.getProperty(prefix + "db.port", "3306");

			String dbName = System.getenv("DB_NAME");
			if (dbName == null) dbName = props.getProperty(prefix + "db.name", "eduhub");

			String sslMode = System.getenv("DB_SSL_MODE");
			if (sslMode == null) sslMode = props.getProperty(prefix + "db.sslMode", "");

			username = System.getenv("DB_USER");
			if (username == null) username = props.getProperty(prefix + "db.username", "root");

			password = System.getenv("DB_PASSWORD");
			if (password == null) password = props.getProperty(prefix + "db.password", "root");

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
				logger.info("Institutes table created successfully");
			}
			
			// Check if users table exists
			boolean usersExists = tableExists(conn, "users");
			logger.info("Users table exists: {}", usersExists);
			
			if (!usersExists) {
				logger.warn("Users table not found. Creating...");
				createUsersTable(conn);
				logger.info("Users table created successfully");
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
				"institute_id INT AUTO_INCREMENT PRIMARY KEY, " +
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
				"approved_by INT NULL, " +
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
				"user_id INT AUTO_INCREMENT PRIMARY KEY, " +
				"institute_id INT NOT NULL, " +
				"full_name VARCHAR(255) NOT NULL, " +
				"email VARCHAR(255) NOT NULL UNIQUE, " +
				"password_hash VARCHAR(255) NOT NULL, " +
				"phone VARCHAR(20), " +
				"role VARCHAR(50) NOT NULL DEFAULT 'student', " +
				"status VARCHAR(50) DEFAULT 'active', " +
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
	
	
	/*
     * This method will be called whenever you need a DB connection.
     * It returns a Connection object using the loaded credentials.
     * For TiDB Cloud, username and password are already embedded in the URL.
     */
	public static Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, username, password);
	}

}
