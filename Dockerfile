# Dockerfile for EduHub Java web application
# - Uses an official Tomcat base image
# - Copies the exploded webapp from src/main/webapp into Tomcat's ROOT
# - Copies compiled classes from build/classes into WEB-INF/classes
# - Copies any jars from src/main/webapp/WEB-INF/lib into WEB-INF/lib
# Note: This Dockerfile expects that Java sources have already been compiled
# (i.e., `build/classes` contains .class files). If you need the image to
# compile sources, we can add a multi-stage build with Maven/Gradle.

ARG TOMCAT_VERSION=9.0
FROM tomcat:${TOMCAT_VERSION}-jdk17-temurin

# Remove default webapps (optional) to ensure clean ROOT deploy
RUN rm -rf /usr/local/tomcat/webapps/*

# Create ROOT directory
RUN mkdir -p /usr/local/tomcat/webapps/ROOT/WEB-INF/classes

# Copy exploded webapp (static files, JSPs, WEB-INF/web.xml, etc.)
# This includes WEB-INF/lib directory automatically
COPY src/main/webapp/ /usr/local/tomcat/webapps/ROOT/

# Note: build/classes is not copied because this is a JSP-only application
# Tomcat will compile JSPs at runtime. If you later add servlets or Java classes,
# compile them locally and add them to build/classes/, or use a multi-stage Dockerfile

# Expose the default Tomcat port. Render will provide a $PORT env var at runtime;
# we adjust Tomcat's server.xml on container start to listen on $PORT.
EXPOSE 8080

# Default PORT value (can be overridden by Render or docker run -e PORT=...)
ENV PORT=8080

# Replace the Connector port in server.xml with the $PORT value at container start,
# and ensure Tomcat binds to 0.0.0.0 (all interfaces) so Render can reach it.
# Using sh -c so environment variable expansion works.
ENTRYPOINT ["sh", "-c", "sed -i 's/port=\"8080\"/port=\"'${PORT}'\" address=\"0.0.0.0\"/g' /usr/local/tomcat/conf/server.xml && catalina.sh run"]
