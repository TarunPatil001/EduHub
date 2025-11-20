# Dockerfile for EduHub Java web application
# Multi-stage build: 
# Stage 1 - Compile Java sources
# Stage 2 - Deploy to Tomcat
# Build: 2025-11-21 03:50 UTC - Force complete rebuild with TiDB Cloud fixes

# ============ Stage 1: Build Stage ============
FROM eclipse-temurin:17-jdk-jammy AS builder

# Install required tools
RUN apt-get update && apt-get install -y ant && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy source code and build files
COPY . .

# Compile the application using Ant
RUN ant compile

# ============ Stage 2: Runtime Stage ============
FROM tomcat:9.0-jdk17-temurin

# Remove default webapps to ensure clean ROOT deploy
RUN rm -rf /usr/local/tomcat/webapps/*

# Create ROOT directory structure
RUN mkdir -p /usr/local/tomcat/webapps/ROOT/WEB-INF/classes

# Copy webapp files (JSPs, static files, WEB-INF/web.xml, etc.)
COPY src/main/webapp/ /usr/local/tomcat/webapps/ROOT/

# Copy compiled classes from build stage
COPY --from=builder /app/build/classes/ /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/

# Copy resources from builder stage (logback.xml, etc.)
COPY --from=builder /app/src/main/resources/*.xml /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/

# Create a minimal db.properties file (actual values come from environment variables)
# This file is required even though production uses env vars
RUN echo "# Database Configuration - Production uses environment variables" > /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.host=localhost" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.port=3306" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.name=eduhub" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.username=placeholder" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.password=placeholder" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.driver=com.mysql.cj.jdbc.Driver" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties && \
    echo "db.sslMode=" >> /usr/local/tomcat/webapps/ROOT/WEB-INF/classes/db.properties

# Expose the default Tomcat port
EXPOSE 8080

# Default PORT value (can be overridden by Render)
ENV PORT=8080

# Start Tomcat with dynamic port binding for Render
ENTRYPOINT ["sh", "-c", "sed -i 's/port=\"8080\"/port=\"'${PORT}'\" address=\"0.0.0.0\"/g' /usr/local/tomcat/conf/server.xml && catalina.sh run"]
