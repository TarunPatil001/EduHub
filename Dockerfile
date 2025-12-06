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

# Remove default webapps to ensure clean deploy
RUN rm -rf /usr/local/tomcat/webapps/*

# Create eduhub directory structure
RUN mkdir -p /usr/local/tomcat/webapps/eduhub/WEB-INF/classes

# Copy webapp files (JSPs, static files, WEB-INF/web.xml, etc.)
COPY src/main/webapp/ /usr/local/tomcat/webapps/eduhub/

# Remove conflicting servlet-api jar from deployment (Tomcat provides this)
RUN rm -f /usr/local/tomcat/webapps/eduhub/WEB-INF/lib/javax.servlet-api-*.jar

# Copy compiled classes and resources from build stage
COPY --from=builder /app/build/classes/ /usr/local/tomcat/webapps/eduhub/WEB-INF/classes/

# Expose the default Tomcat port
EXPOSE 8080

# Default PORT value (can be overridden by Render)
ENV PORT=8080

# Start Tomcat with port configuration
CMD ["sh", "-c", "sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT}\\\"/g\" /usr/local/tomcat/conf/server.xml && catalina.sh run"]