#!/usr/bin/env node

/**
 * 🧪 Integration Test Script
 * Tests the complete frontend-backend integration flow
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function runIntegrationTests() {
  console.log('🧪 Running Integration Tests...
');

  let authToken = null;

  // Test 1: Vendor Registration
  console.log('1️⃣ Testing Vendor Registration...');
  try {
    const registerData = {
      firstName: 'Test',
      lastName: 'Vendor',
      email: `testvendor${Date.now()}@example.com`,
      phoneNumber: '9876543210',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ROLE_VENDOR',
      userType: 'vendor'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/vendor/register`, registerData);
    console.log('✅ Vendor registration successful');
  } catch (error) {
    console.log('❌ Vendor registration failed:', error.response?.data || error.message);
  }

  // Test 2: Vendor Login
  console.log('
2️⃣ Testing Vendor Login...');
  try {
    const loginData = {
      emailOrPhone: 'vendor@example.com', // Use existing vendor
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/vendor/login`, loginData);
    
    if (loginResponse.data.token) {
      authToken = loginResponse.data.token;
      console.log('✅ Vendor login successful');
    } else {
      console.log('⚠️  Login requires OTP verification');
    }
  } catch (error) {
    console.log('❌ Vendor login failed:', error.response?.data || error.message);
  }

  // Test 3: Add Product (requires authentication)
  if (authToken) {
    console.log('
3️⃣ Testing Product Creation...');
    try {
      const productData = {
        name: 'Test Product ' + Date.now(),
        description: 'This is a test product created by integration test',
        price: 999.99,
        stock: 10,
        categoryId: 1,
        brand: 'Test Brand',
        unit: 'piece',
        isActive: true
      };

      const productResponse = await axios.post(
        `${API_BASE_URL}/products/vendor/add`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Product creation successful');
      console.log('📦 Created product ID:', productResponse.data.id);
    } catch (error) {
      console.log('❌ Product creation failed:', error.response?.data || error.message);
    }
  }

  // Test 4: Fetch Categories
  console.log('
4️⃣ Testing Categories API...');
  try {
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    console.log('✅ Categories fetch successful');
    console.log('📂 Found', Array.isArray(categoriesResponse.data) ? categoriesResponse.data.length : 0, 'categories');
  } catch (error) {
    console.log('❌ Categories fetch failed:', error.response?.data || error.message);
  }

  console.log('
🎯 Integration Tests Completed!');
  console.log('
💡 Next steps:');
  console.log('1. Start the backend server: cd D:\\itech-backend\\itech-backend && mvn spring-boot:run');
  console.log('2. Start the frontend server: npm run dev');
  console.log('3. Test vendor login at: http://localhost:3000/auth/vendor/login');
}

runIntegrationTests().catch(console.error);
