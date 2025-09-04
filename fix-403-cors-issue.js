#!/usr/bin/env node

/**
 * 🔧 Fix 403 CORS and Security Configuration Issues
 * 
 * This script diagnoses and provides solutions for HTTP 403 errors
 * when frontend tries to communicate with backend
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080/api/v1';
const FRONTEND_URL = 'http://localhost:3000';

async function diagnose403Issue() {
    console.log('🔍 Diagnosing HTTP 403 Issue...\n');

    // Test 1: Check if backend is accessible
    console.log('1️⃣ Testing backend accessibility...');
    try {
        const healthResponse = await axios.get(`${BACKEND_URL}/actuator/health`, {
            timeout: 5000,
            headers: {
                'Origin': FRONTEND_URL,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        console.log('✅ Backend is accessible:', healthResponse.status);
        console.log('📋 Health data:', healthResponse.data);
    } catch (error) {
        console.log('❌ Backend accessibility test failed:', error.message);
        if (error.response) {
            console.log('📊 Response status:', error.response.status);
            console.log('📋 Response headers:', error.response.headers);
        }
    }

    // Test 2: Check CORS preflight
    console.log('\n2️⃣ Testing CORS preflight (OPTIONS request)...');
    try {
        const optionsResponse = await axios.options(`${API_BASE_URL}/auth/vendor/login`, {
            headers: {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            }
        });
        console.log('✅ CORS preflight successful:', optionsResponse.status);
        console.log('📋 CORS headers:', optionsResponse.headers);
    } catch (error) {
        console.log('❌ CORS preflight failed:', error.message);
        if (error.response?.status === 403) {
            console.log('🚨 CORS 403 Error - This is the main issue!');
        }
    }

    // Test 3: Direct POST to login endpoint
    console.log('\n3️⃣ Testing direct POST to login endpoint...');
    try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/vendor/login`, {
            emailOrPhone: 'test@example.com',
            password: 'testpass'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL,
            },
            timeout: 10000
        });
        console.log('✅ Direct POST successful:', loginResponse.status);
    } catch (error) {
        console.log('❌ Direct POST failed:', error.message);
        console.log('📊 Status:', error.response?.status);
        console.log('📋 Data:', error.response?.data);
        
        if (error.response?.status === 403) {
            console.log('🚨 This confirms the 403 CORS/Security issue!');
        }
    }

    // Test 4: Check Spring Security configuration
    console.log('\n4️⃣ Checking Spring Security endpoints...');
    const securityEndpoints = [
        '/actuator/health',
        '/api/v1/auth/check-email-role',
        '/api/v1/products',
    ];

    for (const endpoint of securityEndpoints) {
        try {
            const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
                headers: { 'Origin': FRONTEND_URL },
                timeout: 5000
            });
            console.log(`✅ ${endpoint}: ${response.status}`);
        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.response?.status || 'FAILED'}`);
        }
    }

    console.log('\n🛠️ SOLUTIONS FOR HTTP 403 ERROR:\n');
    
    console.log('📋 Solution 1: Backend CORS Configuration');
    console.log('   The backend Spring application needs proper CORS setup');
    console.log('   Check: application.properties CORS settings');
    console.log('   Check: WebConfig.java or SecurityConfig.java\n');
    
    console.log('📋 Solution 2: Spring Security Configuration');
    console.log('   Spring Security might be blocking requests');
    console.log('   Check: SecurityConfig.java permitAll() settings');
    console.log('   Check: CSRF token configuration\n');
    
    console.log('📋 Solution 3: API Endpoint Mapping');
    console.log('   Controller might have wrong request mapping');
    console.log('   Check: AuthController.java endpoint paths');
    console.log('   Check: Base URL configuration\n');
}

function generateBackendCorsConfig() {
    console.log('🔧 Generating Backend CORS Configuration...\n');

    const corsConfigJava = `@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
                
        registry.addMapping("/auth/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}`;

    const securityConfigJava = `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}`;

    console.log('📄 WebConfig.java (CORS Configuration):');
    console.log('─'.repeat(50));
    console.log(corsConfigJava);
    console.log('\n📄 SecurityConfig.java (Security Configuration):');
    console.log('─'.repeat(50));
    console.log(securityConfigJava);

    // Save to files
    fs.writeFileSync('WebConfig.java', corsConfigJava);
    fs.writeFileSync('SecurityConfig.java', securityConfigJava);
    console.log('\n✅ Configuration files saved to current directory');
}

function generateApplicationPropertiesFix() {
    console.log('\n🔧 Generating application.properties CORS fix...\n');

    const corsProperties = `# CORS Configuration - Enhanced for Frontend Integration
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000,https://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600

# Security Configuration
spring.security.require-ssl=false
security.csrf.enabled=false
spring.security.web.ignoring=/actuator/**,/auth/**,/api/v1/auth/**

# Server Configuration
server.port=8080
server.address=0.0.0.0
server.servlet.context-path=

# Enable all actuator endpoints for debugging
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
management.security.enabled=false`;

    console.log('📄 Add these to application.properties:');
    console.log('─'.repeat(50));
    console.log(corsProperties);
    
    fs.writeFileSync('cors-application-properties-fix.txt', corsProperties);
    console.log('\n✅ CORS properties saved to cors-application-properties-fix.txt');
}

async function testCORSFix() {
    console.log('\n🧪 Testing CORS Fix...\n');

    const testData = {
        emailOrPhone: 'test@example.com',
        password: 'testpass123'
    };

    try {
        // Test with explicit CORS headers
        const response = await axios.post(`${API_BASE_URL}/auth/vendor/login`, testData, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            },
            timeout: 10000
        });

        console.log('✅ CORS test successful!');
        console.log('📊 Status:', response.status);
        console.log('🎉 The 403 issue should be resolved!');

    } catch (error) {
        console.log('❌ CORS test still failing:', error.message);
        console.log('📊 Status:', error.response?.status);
        
        if (error.response?.status === 403) {
            console.log('\n🚨 403 Error Still Present - Additional Steps Needed:');
            console.log('1. Restart the backend server after configuration changes');
            console.log('2. Check if Spring Security is properly configured');
            console.log('3. Verify the controller endpoint mappings');
            console.log('4. Check for firewall or proxy blocking requests');
        }
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--diagnose')) {
        await diagnose403Issue();
    } else if (args.includes('--generate-config')) {
        generateBackendCorsConfig();
    } else if (args.includes('--generate-properties')) {
        generateApplicationPropertiesFix();
    } else if (args.includes('--test-cors')) {
        await testCORSFix();
    } else {
        // Run all by default
        await diagnose403Issue();
        generateApplicationPropertiesFix();
        generateBackendCorsConfig();
        
        console.log('\n🎯 IMMEDIATE ACTION ITEMS:\n');
        console.log('1. Copy the CORS properties to your backend application.properties');
        console.log('2. Update WebConfig.java and SecurityConfig.java in your backend');
        console.log('3. Restart the backend server');
        console.log('4. Test again: node fix-403-cors-issue.js --test-cors');
        console.log('\n📍 Backend location: D:\\itech-backend\\itech-backend\\src\\main\\resources\\');
    }
}

main().catch(console.error);
