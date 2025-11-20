package com.eduhub.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.eduhub.util.DBUtil;
import java.sql.Connection;

/**
 * Application Startup Listener
 * This runs automatically when the application is deployed on Tomcat.
 * It initializes components and verifies database connectivity.
 */
@WebListener
public class AppStartupListener implements ServletContextListener {
    
    private static final Logger logger = LoggerFactory.getLogger(AppStartupListener.class);
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        logger.info("========================================");
        logger.info("EduHub Application Starting...");
        logger.info("========================================");
        
        // Test database connection on startup
        try {
            Connection conn = DBUtil.getConnection();
            if (conn != null) {
                logger.info("✓ Database connection test: SUCCESS");
                logger.info("✓ Database: {}", conn.getMetaData().getDatabaseProductName());
                logger.info("✓ Version: {}", conn.getMetaData().getDatabaseProductVersion());
                conn.close();
                logger.info("✓ Database connection closed successfully");
            }
        } catch (Exception e) {
            logger.error("✗ Database connection test: FAILED", e);
            logger.error("Application may not function properly without database!");
        }
        
        logger.info("========================================");
        logger.info("EduHub Application Started Successfully!");
        logger.info("========================================");
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        logger.info("========================================");
        logger.info("EduHub Application Shutting Down...");
        logger.info("========================================");
    }
}
