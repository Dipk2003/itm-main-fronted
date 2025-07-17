// Test script to check backend connectivity
const axios = require('axios');

const BACKEND_URL = 'https://indiantradebackend123.onrender.com';

async function testBackendConnection() {
  console.log('Testing backend connection...');
  console.log('Backend URL:', BACKEND_URL);
  
  try {
    // Test basic connectivity
    console.log('\n1. Testing basic health check...');
    const healthResponse = await axios.get(`${BACKEND_URL}/actuator/health`, {
      timeout: 10000
    });
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  try {
    // Test auth endpoints
    console.log('\n2. Testing auth endpoints...');
    const authResponse = await axios.get(`${BACKEND_URL}/auth/test`, {
      timeout: 10000
    });
    console.log('✅ Auth endpoint accessible:', authResponse.data);
  } catch (error) {
    console.log('❌ Auth endpoint failed:', error.message);
  }
  
  try {
    // Test register endpoint (should return method not allowed for GET)
    console.log('\n3. Testing register endpoint...');
    const registerResponse = await axios.get(`${BACKEND_URL}/auth/register`, {
      timeout: 10000
    });
    console.log('✅ Register endpoint accessible:', registerResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 405) {
      console.log('✅ Register endpoint exists (Method Not Allowed for GET is expected)');
    } else {
      console.log('❌ Register endpoint failed:', error.message);
    }
  }
}

testBackendConnection();
