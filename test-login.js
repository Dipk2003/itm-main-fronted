const axios = require('axios');

// Backend URL
const BACKEND_URL = 'https://indiantradebackend.onrender.com';

// Test login function
async function testLogin(email, password, role) {
  try {
    console.log(`\n🔐 Testing login for ${role}:`);
    console.log(`📧 Email: ${email}`);
    
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      emailOrPhone: email,
      password: password
    });
    
    console.log(`✅ ${role} login successful!`);
    console.log(`🎯 User data:`, response.data.user);
    console.log(`🔑 Token received: ${response.data.token ? 'Yes' : 'No'}`);
    
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`⚠️ ${role} login failed: ${error.response.data}`);
      
      // If login failed but user exists, it might need OTP verification
      if (error.response.data.includes('Invalid') && !error.response.data.includes('not found')) {
        console.log(`ℹ️ ${role} user exists but might need OTP verification`);
        return 'OTP_REQUIRED';
      }
    } else {
      console.log(`❌ ${role} login error: ${error.message}`);
    }
    
    return false;
  }
}

async function testAllLogins() {
  console.log('🚀 Testing login for all users...');
  
  const testUsers = [
    { email: 'user@test.com', password: 'test123', role: 'USER' },
    { email: 'vendor@test.com', password: 'test123', role: 'VENDOR' },
    { email: 'admin@test.com', password: 'test123', role: 'ADMIN' },
    { email: 'cto@test.com', password: 'test123', role: 'CTO' },
    { email: 'support@test.com', password: 'test123', role: 'SUPPORT' },
    { email: 'employee@test.com', password: 'test123', role: 'EMPLOYEE' },
    
    // Also test the existing ramesh@gmail.com
    { email: 'ramesh@gmail.com', password: '123456', role: 'EXISTING_VENDOR' }
  ];
  
  const results = [];
  
  for (const user of testUsers) {
    const result = await testLogin(user.email, user.password, user.role);
    results.push({ ...user, result });
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Login Test Results Summary:');
  console.log('=================================');
  
  results.forEach(user => {
    const status = user.result === true ? '✅ SUCCESS' : 
                   user.result === 'OTP_REQUIRED' ? '🔐 OTP REQUIRED' : 
                   '❌ FAILED';
    console.log(`${user.role}: ${status}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log('');
  });
  
  // Provide working credentials
  const workingCredentials = results.filter(u => u.result === true);
  const otpRequiredCredentials = results.filter(u => u.result === 'OTP_REQUIRED');
  
  if (workingCredentials.length > 0) {
    console.log('🎯 READY TO USE (Direct Login):');
    console.log('===============================');
    workingCredentials.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });
  }
  
  if (otpRequiredCredentials.length > 0) {
    console.log('\n🔐 REQUIRES OTP VERIFICATION:');
    console.log('============================');
    otpRequiredCredentials.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password} (needs OTP)`);
    });
  }
}

// Run the test
testAllLogins().catch(console.error);
