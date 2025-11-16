# Listener Package

Contains event listeners for application and session lifecycle events.

## Purpose
- Respond to application startup/shutdown
- Handle session creation/destruction
- Initialize resources
- Cleanup on shutdown

## Files to Create

1. **AppContextListener.java**
   - Application startup initialization
   - Database connection pool setup
   - Load configuration
   - Cleanup on shutdown

2. **SessionListener.java**
   - Track active sessions
   - Handle session creation
   - Handle session destruction
   - Track user activity

## Example Context Listener

```java
package com.eduhub.listener;

import javax.servlet.*;
import javax.servlet.annotation.WebListener;
import com.eduhub.util.DatabaseUtil;

@WebListener
public class AppContextListener implements ServletContextListener {
    
    @Override
    public void contextInitialized(ServletContextEvent event) {
        ServletContext context = event.getServletContext();
        
        // Initialize database
        try {
            if (DatabaseUtil.testConnection()) {
                context.log("Database connection successful");
            } else {
                context.log("Database connection failed");
            }
        } catch (Exception e) {
            context.log("Error initializing database", e);
        }
        
        // Load configuration
        context.log("EduHub application started");
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent event) {
        // Cleanup resources
        event.getServletContext().log("EduHub application stopped");
    }
}
```

## Example Session Listener

```java
package com.eduhub.listener;

import javax.servlet.http.*;
import javax.servlet.annotation.WebListener;

@WebListener
public class SessionListener implements HttpSessionListener {
    
    private static int activeSessions = 0;
    
    @Override
    public void sessionCreated(HttpSessionEvent event) {
        activeSessions++;
        event.getSession().getServletContext()
             .log("Session created. Active sessions: " + activeSessions);
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        activeSessions--;
        event.getSession().getServletContext()
             .log("Session destroyed. Active sessions: " + activeSessions);
    }
    
    public static int getActiveSessions() {
        return activeSessions;
    }
}
```
