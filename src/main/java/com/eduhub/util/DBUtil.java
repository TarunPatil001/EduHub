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
			
			 // Assign values from properties file to variables
	         url = props.getProperty("db.url");
	         username = props.getProperty("db.username"); 
	         password = props.getProperty("db.password");
	         driver = props.getProperty("db.driver");
	         
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
