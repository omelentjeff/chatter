# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files to the container
COPY pom.xml ./
COPY src ./src

# Build the project (this will create the target/*.jar file)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:21

# Copy the jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app.jar"]