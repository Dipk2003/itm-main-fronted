# 🔧 COMPLETE RENDER DATABASE FIX

## Problem Diagnosed ✅
Your Spring Boot app is trying to connect to **MySQL** instead of **PostgreSQL** on Render.

The error `com.mysql.cj.jdbc.exceptions.CommunicationsException` proves it's using MySQL drivers.

## Step 1: Update Environment Variables on Render

Go to your Render service → Environment → Add these variables:

```bash
# CRITICAL: Force PostgreSQL Configuration
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=

# Database Configuration
PORT=8080
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000

# JPA Configuration
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# Email Configuration
SMTP_USERNAME=ultimate.itech4@gmail.com
SMTP_PASSWORD=Uit4@1135##
EMAIL_SIMULATION_ENABLED=false
SMS_SIMULATION_ENABLED=true
```

## Step 2: Check Your Backend pom.xml

Make sure you have PostgreSQL dependency and NOT MySQL:

```xml
<!-- ✅ KEEP THIS - PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- ❌ REMOVE THIS - MySQL Driver (if present) -->
<!-- <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency> -->
```

## Step 3: Update application-production.properties

Create/update this file in your backend `src/main/resources/`:

```properties
# Server Configuration
server.port=${PORT:8080}

# PostgreSQL Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Hikari Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000

# CORS Configuration
spring.web.cors.allowed-origins=${ALLOWED_ORIGINS:*}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${SMTP_USERNAME}
spring.mail.password=${SMTP_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Logging
logging.level.org.hibernate.SQL=INFO
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=INFO
```

## Step 4: Verify No MySQL Configuration

Check that your backend doesn't have any hardcoded MySQL URLs like:
- `jdbc:mysql://localhost:3306/`
- Any references to MySQL in application.properties
- Any MySQL-specific configuration classes

## Step 5: Update Render Build Settings

**Build Command:**
```bash
mvn clean package -DskipTests
```

**Start Command:**
```bash
java -jar target/itech-backend-0.0.1-SNAPSHOT.jar
```

## Step 6: Alternative Database URL Parser (if needed)

If the above doesn't work, add this Java configuration to parse DATABASE_URL:

```java
@Configuration
@Profile("production")
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl == null) {
            throw new IllegalStateException("DATABASE_URL environment variable is not set");
        }

        try {
            URI dbUri = URI.create(databaseUrl);
            String[] userInfo = dbUri.getUserInfo().split(":");
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:postgresql://" + dbUri.getHost() + ":" + dbUri.getPort() + dbUri.getPath());
            config.setUsername(userInfo[0]);
            config.setPassword(userInfo[1]);
            config.setDriverClassName("org.postgresql.Driver");
            
            // Connection pool settings
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);
            
            return new HikariDataSource(config);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to create database connection", e);
        }
    }
}
```

## Step 7: Test the Fix

After deploying:

1. Check Render logs for successful PostgreSQL connection
2. Look for: `Database version: 12.0` (PostgreSQL version)
3. Verify no MySQL connection errors

## Why This Happened

Your app was configured for **dual-database support**:
- MySQL for localhost development 
- PostgreSQL for production on Render

But the **production profile wasn't properly activated**, so it defaulted to MySQL configuration.

## Quick Verification Commands

After fix, your logs should show:
```
HHH000204: Processing PersistenceUnitInfo [name: default]
Database version: 12.0  <-- PostgreSQL
```

Instead of:
```
Communications link failure  <-- MySQL error
```

## Emergency Quick Fix

If you need immediate fix, just add these 3 environment variables on Render:

1. `SPRING_DATASOURCE_URL=${DATABASE_URL}`
2. `SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver` 
3. `SPRING_PROFILES_ACTIVE=production`

Then redeploy.
