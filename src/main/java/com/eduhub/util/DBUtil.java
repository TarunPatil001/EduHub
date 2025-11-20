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
			
			 // Read from environment variables first, fall back to properties file
			 String dbHost = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : props.getProperty("db.host", "localhost");
			 String dbPort = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : props.getProperty("db.port", "3306");
			 String dbName = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : props.getProperty("db.name", "eduhub");
			 
			 // Build the connection URL
			 url = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?useSSL=true&serverTimezone=UTC";
			 
			 // Username and password from environment or properties
	         username = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : props.getProperty("db.username", "root"); 
	         password = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : props.getProperty("db.password", "root");
	         driver = props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
	         
	         /*
	             * Load the JDBC driver class into memory.
	             * Example: com.mysql.cj.jdbc.Driver
	             */
	         Class.forName(driver);
	         logger.info("Database configuration loaded successfully");
	         logger.info("Database URL: {}", url);
			
		}catch(Exception e) {
			 logger.error("Failed to load database configuration", e);
			 throw new RuntimeException("Database initialization failed", e);
		}
	}
	
	/*
     * This method will be called whenever you need a DB connection.
     * It returns a Connection object using the loaded credentials.
     */
	public static Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, username, password);
	}

}
