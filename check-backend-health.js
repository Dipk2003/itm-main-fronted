#!/usr/bin/env node

/**
 * 🏥 Backend Health Check Script
 * Verifies that the backend server is running and accessible
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080/api/v1';

async function checkBackendHealth() {
  console.log('🏥 Checking backend health...
');

  const checks = [
    {
      name: 'Backend Server',
      url: `${BACKEND_URL}/actuator/health`,
      description: 'Spring Boot Actuator Health Check'
    },
    {
      name: 'API Base',
      url: `${API_BASE_URL}`,
      description: 'API Base URL Accessibility'
    },
    {
      name: 'Auth Endpoints',
      url: `${API_BASE_URL}/auth/check-email-role`,
      description: 'Authentication API',
      method: 'POST',
      data: { email: 'test@example.com' }
    },
    {
      name: 'Product Endpoints',
      url: `${API_BASE_URL}/products`,
      description: 'Product API'
    },
    {
      name: 'Categories',
      url: `${API_BASE_URL}/categories`,
      description: 'Categories API'
    }
  ];

  let allHealthy = true;

  for (const check of checks) {
    try {
      console.log(`🔍 Checking ${check.name}...`);
      
      const config = {
        method: check.method || 'GET',
        url: check.url,
        timeout: 5000,
        validateStatus: (status) => status < 500 // Accept 4xx as "accessible"
      };
      
      if (check.data) {
        config.data = check.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      
      console.log(`✅ ${check.name}: OK (Status: ${response.status})`);
      console.log(`   📝 ${check.description}`);
      
    } catch (error) {
      console.log(`❌ ${check.name}: FAILED`);
      console.log(`   📝 ${check.description}`);
      console.log(`   🚨 Error: ${error.message}`);
      allHealthy = false;
    }
    console.log('');
  }

  if (allHealthy) {
    console.log('🎉 All backend services are healthy!');
    console.log('✅ Frontend-Backend integration should work properly.');
  } else {
    console.log('⚠️  Some backend services are not accessible.');
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Make sure the backend server is running on port 8080');
    console.log('2. Check if MySQL database is running and accessible');
    console.log('3. Verify backend application.properties configuration');
    console.log('4. Check for any startup errors in backend console');
    console.log('5. Ensure no firewall is blocking port 8080');
  }
}

checkBackendHealth().catch(console.error);
