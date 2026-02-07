# Use an officail OpenJDK image as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file from the target directory to the container
COPY build/libs/study-0.0.1-SNAPSHOT.jar /app/study-0.0.1-SNAPSHOT.jar

# Expose the port that the application will use
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/study-0.0.1-SNAPSHOT.jar"]