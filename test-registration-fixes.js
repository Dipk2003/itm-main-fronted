/**
 * Test script to verify buyer registration and OTP logging fixes
 * Run this after starting both frontend and backend servers
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

async function testBuyerRegistration() {
  console.log('🧪 Testing Buyer Registration...\n');
  
  const testBuyerData = {
    name: 'Test Buyer',
    email: `testbuyer${Date.now()}@example.com`,
    phone: `98765${String(Date.now()).slice(-5)}`,
    password: 'TestPassword123!',
    role: 'ROLE_USER',
    userType: 'user',
    aadharCard: '123456789012'
  };
  
  try {
    // Test direct backend call
    console.log('📡 Testing direct backend call to /auth/register...');
    const backendResponse = await axios.post(`${BACKEND_URL}/auth/register`, testBuyerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend Response:', backendResponse.data);
    console.log('✅ Status:', backendResponse.status);
    
    // Test frontend proxy call
    console.log('\n📡 Testing frontend proxy call to /auth/register...');
    const frontendResponse = await axios.post(`${FRONTEND_URL}/auth/register`, testBuyerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frontend Response:', frontendResponse.data);
    console.log('✅ Status:', frontendResponse.status);
    
  } catch (error) {
    console.error('❌ Error testing buyer registration:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

async function testVendorRegistration() {
  console.log('\n🧪 Testing Vendor Registration and OTP Logging...\n');
  
  const testVendorData = {
    name: 'Test Vendor',
    email: `testvendor${Date.now()}@example.com`,
    phone: `99876${String(Date.now()).slice(-5)}`,
    password: 'TestPassword123!',
    role: 'ROLE_VENDOR',
    userType: 'vendor',
    businessName: 'Test Business',
    businessAddress: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    panNumber: 'ABCDE1234F',
    gstNumber: '27ABCDE1234F1Z5'
  };
  
  try {
    // Test backend vendor registration
    console.log('📡 Testing backend vendor registration...');
    const response = await axios.post(`${BACKEND_URL}/auth/vendor/register`, testVendorData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Vendor Registration Response:', response.data);
    console.log('✅ Status:', response.status);
    console.log('📝 Check the backend console for OTP logging output!');
    
  } catch (error) {
    console.error('❌ Error testing vendor registration:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

async function checkBackendHealth() {
  console.log('🔍 Checking backend health...\n');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ Backend is running:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Backend not accessible:', error.message);
    return false;
  }
}

async function checkFrontendHealth() {
  console.log('🔍 Checking frontend health...\n');
  
  try {
    const response = await axios.get(`${FRONTEND_URL}`, {
      timeout: 5000
    });
    console.log('✅ Frontend is running:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Frontend not accessible:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Registration Tests...\n');
  
  const backendHealthy = await checkBackendHealth();
  const frontendHealthy = await checkFrontendHealth();
  
  if (!backendHealthy) {
    console.log('❌ Backend is not running. Please start with: npm run backend or ./start-backend.bat');
    return;
  }
  
  if (!frontendHealthy) {
    console.log('❌ Frontend is not running. Please start with: npm run dev or ./start-frontend.bat');
    return;
  }
  
  await testBuyerRegistration();
  await testVendorRegistration();
  
  console.log('\n✅ Test completed! Check the backend console for OTP logs.');
  console.log('\nInstructions:');
  console.log('1. If buyer registration works, the 404/HTML error issue is fixed');
  console.log('2. If vendor registration shows OTP in backend console, OTP logging is working');
  console.log('3. Test in the browser by:');
  console.log('   - Going to http://localhost:3000/auth/user/register for buyer');
  console.log('   - Going to http://localhost:3000/auth/vendor/register for vendor');
}

// Run the tests
runTests().catch(console.error);
