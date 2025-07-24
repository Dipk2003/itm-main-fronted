const axios = require('axios');

// Backend URL - change this to match your backend
const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

async function testForgotPasswordFlow() {
  console.log('🔍 Testing Forgot Password API Flow...\n');
  
  try {
    // Test 1: Send Forgot Password OTP
    console.log('📧 Step 1: Testing /auth/forgot-password endpoint');
    const testEmail = 'test@example.com'; // Change this to a real email in your system
    
    try {
      const otpResponse = await api.post('/auth/forgot-password', {
        email: testEmail
      });
      console.log('✅ OTP Send Response:', otpResponse.status, otpResponse.data);
    } catch (otpError) {
      console.error('❌ OTP Send Failed:');
      if (otpError.response) {
        console.error('Status:', otpError.response.status);
        console.error('Data:', otpError.response.data);
      } else {
        console.error('Network Error:', otpError.message);
      }
    }

    console.log('\n📝 Step 2: Testing /auth/verify-forgot-password-otp endpoint');
    try {
      const verifyResponse = await api.post('/auth/verify-forgot-password-otp', {
        email: testEmail,
        otp: '123456' // Test OTP
      });
      console.log('✅ OTP Verify Response:', verifyResponse.status, verifyResponse.data);
    } catch (verifyError) {
      console.error('❌ OTP Verify Failed:');
      if (verifyError.response) {
        console.error('Status:', verifyError.response.status);
        console.error('Data:', verifyError.response.data);
      } else {
        console.error('Network Error:', verifyError.message);
      }
    }

    // Test 3: Compare with registration endpoint (which works)
    console.log('\n🔍 Step 3: Testing registration endpoint for comparison');
    try {
      const regResponse = await api.post('/auth/register', {
        name: 'Test User',
        email: testEmail,
        password: 'testpassword123',
        userType: 'user'
      });
      console.log('✅ Registration Response:', regResponse.status, regResponse.data);
    } catch (regError) {
      console.error('❌ Registration Test:');
      if (regError.response) {
        console.error('Status:', regError.response.status);
        console.error('Data:', regError.response.data);
      } else {
        console.error('Network Error:', regError.message);
      }
    }

  } catch (error) {
    console.error('❌ General Error:', error.message);
  }
}

// Test health check
async function testHealth() {
  console.log('🏥 Testing Backend Health...');
  try {
    const health = await api.get('/health');
    console.log('✅ Backend is healthy:', health.status);
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testHealth();
  console.log('\n' + '='.repeat(50) + '\n');
  await testForgotPasswordFlow();
}

runTests();
