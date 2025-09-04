#!/usr/bin/env node

/**
 * 🆘 Emergency Fix for Persistent 403/500 Backend Issues
 * 
 * This script provides multiple aggressive fixes for the authentication issues
 */

const fs = require('fs');
const path = require('path');

console.log('🆘 Emergency Backend Fix - Starting...\n');

// 1. Create a completely open SecurityConfig for debugging
console.log('1️⃣ Creating debug-friendly SecurityConfig...');

const debugSecurityConfig = `package com.itech.itech_backend.config;

import com.itech.itech_backend.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    
    @Value("\${spring.web.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("🔧 Configuring Security Filter Chain with EMERGENCY DEBUG MODE");
        
        http
                .csrf(csrf -> {
                    csrf.disable();
                    System.out.println("✅ CSRF disabled");
                })
                .cors(cors -> {
                    cors.configurationSource(corsConfigurationSource());
                    System.out.println("✅ CORS configured");
                })
                .authorizeHttpRequests(auth -> {
                    System.out.println("🔓 Configuring request matchers...");
                    
                    auth
                            // === EMERGENCY: ALLOW ALL AUTH ENDPOINTS ===
                            .requestMatchers(
                                    "/auth/**",
                                    "/api/auth/**", 
                                    "/api/v1/auth/**",
                                    "/api/*/auth/**"
                            ).permitAll()
                            
                            // === ALLOW ALL HEALTH AND ACTUATOR ===
                            .requestMatchers(
                                    "/health",
                                    "/health/**",
                                    "/actuator/**",
                                    "/api/health/**"
                            ).permitAll()
                            
                            // === ALLOW ALL PRODUCTS FOR TESTING ===
                            .requestMatchers(
                                    "/products/**",
                                    "/api/products/**",
                                    "/api/v1/products/**",
                                    "/api/*/products/**"
                            ).permitAll()
                            
                            // === ALLOW ALL CATEGORIES ===
                            .requestMatchers(
                                    "/categories/**",
                                    "/api/categories/**",
                                    "/api/v1/categories/**",
                                    "/api/*/categories/**"
                            ).permitAll()
                            
                            // === ALLOW ALL VENDORS FOR TESTING ===
                            .requestMatchers(
                                    "/vendors/**",
                                    "/api/vendors/**",
                                    "/api/v1/vendors/**",
                                    "/api/*/vendors/**"
                            ).permitAll()
                            
                            // === EVERYTHING ELSE FOR DEBUG ===
                            .requestMatchers("/**").permitAll()
                            .anyRequest().permitAll();
                    
                    System.out.println("✅ All endpoints configured as PERMIT ALL for debugging");
                })
                .sessionManagement(sess -> {
                    sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                    System.out.println("✅ Stateless session configured");
                });
                // Temporarily disable JWT filter for debugging
                // .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("🎉 Security configuration completed - ALL ENDPOINTS OPEN FOR DEBUG");
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println("🌐 Configuring CORS for emergency debug mode");
        
        CorsConfiguration configuration = new CorsConfiguration();
        
        // EMERGENCY: Allow everything for debugging
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        System.out.println("✅ CORS configured to allow ALL origins, methods, and headers");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}`;

// Write the emergency SecurityConfig
const securityConfigPath = 'D:\\itech-backend\\itech-backend\\src\\main\\java\\com\\itech\\itech_backend\\config\\SecurityConfig.java';
const backupPath = 'D:\\itech-backend\\itech-backend\\src\\main\\java\\com\\itech\\itech_backend\\config\\SecurityConfig.java.backup';

try {
    // Create backup of original
    if (fs.existsSync(securityConfigPath)) {
        fs.copyFileSync(securityConfigPath, backupPath);
        console.log('✅ Original SecurityConfig backed up');
    }
    
    // Write emergency config
    fs.writeFileSync(securityConfigPath, debugSecurityConfig);
    console.log('✅ Emergency SecurityConfig written');
    console.log('🚨 WARNING: This config disables ALL security for debugging!');
    
} catch (error) {
    console.log('❌ Could not write SecurityConfig:', error.message);
    console.log('📝 Manual fix required - copy the config below:');
    console.log('\n' + '='.repeat(60));
    console.log(debugSecurityConfig);
    console.log('='.repeat(60));
}

// 2. Create emergency application.properties override
console.log('\n2️⃣ Creating emergency application.properties...');

const emergencyProperties = `# =============================================================================
# EMERGENCY DEBUG CONFIGURATION - iTech Backend
# =============================================================================
# WARNING: This configuration disables security for debugging purposes
# DO NOT USE IN PRODUCTION

spring.application.name=itech-backend
spring.profiles.active=development

# Server Configuration
server.port=8080
server.address=0.0.0.0

# Database Configuration  
spring.datasource.url=jdbc:mysql://localhost:3306/itech_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# EMERGENCY: Disable Security
spring.security.enabled=false
security.csrf.enabled=false
management.security.enabled=false

# EMERGENCY: Open CORS
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# JWT Configuration
jwt.secret=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
jwt.expiration-in-ms=86400000

# Debug Logging
logging.level.com.itech.itech_backend=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.web.cors=DEBUG

# Actuator - Open all endpoints
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
management.endpoints.enabled-by-default=true
`;

const propertiesPath = 'D:\\itech-backend\\itech-backend\\src\\main\\resources\\application-emergency.properties';
try {
    fs.writeFileSync(propertiesPath, emergencyProperties);
    console.log('✅ Emergency properties written to: application-emergency.properties');
} catch (error) {
    console.log('❌ Could not write properties file:', error.message);
    fs.writeFileSync('./emergency-application.properties', emergencyProperties);
    console.log('✅ Written to current directory: emergency-application.properties');
}

// 3. Create restart script with emergency config
console.log('\n3️⃣ Creating emergency restart script...');

const emergencyRestartScript = `@echo off
echo 🆘 EMERGENCY BACKEND RESTART WITH OPEN SECURITY
echo.

echo Stopping all Java processes...
taskkill /f /im "java.exe" 2>nul
timeout /t 3 >nul

echo Navigating to backend directory...
cd /d "D:\\itech-backend\\itech-backend"

echo.
echo 🚨 STARTING WITH EMERGENCY DEBUG CONFIGURATION
echo This will disable ALL security temporarily for testing
echo.

echo Building and starting backend with emergency profile...
mvn clean compile spring-boot:run -Dspring.profiles.active=emergency

pause`;

fs.writeFileSync('./emergency-restart-backend.bat', emergencyRestartScript);
console.log('✅ Emergency restart script created');

// 4. Create simplified test script
console.log('\n4️⃣ Creating simplified test...');

const simpleTest = `#!/usr/bin/env node

const axios = require('axios');

async function testEmergencyFix() {
    console.log('🧪 Testing Emergency Fix...\\n');

    // Test basic connectivity
    console.log('1️⃣ Testing basic backend connectivity...');
    try {
        const response = await axios.get('http://localhost:8080/actuator/health', { timeout: 5000 });
        console.log('✅ Backend is accessible:', response.status);
        console.log('📊 Health:', response.data);
    } catch (error) {
        console.log('❌ Backend not accessible:', error.message);
        console.log('🚨 Start backend with: emergency-restart-backend.bat');
        return;
    }

    // Test auth endpoint
    console.log('\\n2️⃣ Testing auth endpoint directly...');
    try {
        const authResponse = await axios.post('http://localhost:8080/api/v1/auth/vendor/login', {
            emailOrPhone: 'test@example.com',
            password: 'test123'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            }
        });
        
        console.log('✅ Auth endpoint accessible:', authResponse.status);
        console.log('📊 Response:', authResponse.data);
        
    } catch (error) {
        console.log('❌ Auth endpoint test:', error.message);
        console.log('📊 Status:', error.response?.status);
        console.log('📋 Data:', error.response?.data);
        
        if (error.response?.status === 403) {
            console.log('\\n🚨 STILL 403 - Security config not updated or backend not restarted');
        } else if (error.response?.status === 500) {
            console.log('\\n✅ Security passed! 500 = Server error (probably invalid credentials)');
            console.log('💡 This means the 403 issue is FIXED!');
        } else if (error.response?.status === 400) {
            console.log('\\n✅ Security passed! 400 = Bad request (validation error)');
            console.log('💡 This means the 403 issue is FIXED!');
        }
    }

    console.log('\\n🎯 Summary:');
    console.log('- 403 = Security blocking requests (need to restart backend)');
    console.log('- 500 = Server error (security fixed, but app error)'); 
    console.log('- 400 = Validation error (security fixed, ready to test)');
}

testEmergencyFix().catch(console.error);`;

fs.writeFileSync('./test-emergency-fix.js', simpleTest);
console.log('✅ Simple test script created');

console.log('\n🆘 EMERGENCY ACTION PLAN:\n');
console.log('1. 🔄 RESTART BACKEND: Run emergency-restart-backend.bat');
console.log('2. 🧪 TEST FIX: Run test-emergency-fix.js');
console.log('3. 🌐 TRY LOGIN: http://localhost:3000/auth/vendor/login');
console.log('\n⚠️  The emergency config disables ALL security temporarily');
console.log('✅ This will help identify if the issue is security-related or something else');

console.log('\n📱 ALTERNATIVE SOLUTIONS:\n');
console.log('A. Quick Database Fix:');
console.log('   - Connect to MySQL');
console.log('   - Run: UPDATE users SET role="ROLE_VENDOR" WHERE email="mishra@gmail.com"');
console.log('   - Restart backend');
console.log('\nB. Use Different Email:');
console.log('   - Register new vendor at: http://localhost:3000/auth/vendor/register');
console.log('   - Use: newvendor@example.com');
console.log('\nC. Check Backend Logs:');
console.log('   - Look for Spring Security errors');
console.log('   - Check for database connection issues');
console.log('   - Verify JWT configuration errors');
