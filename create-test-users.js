const axios = require('axios');

// Backend URL (adjust if different)
const BACKEND_URL = 'https://indiantradebackend.onrender.com';

// Test users to create
const testUsers = [
  {
    endpoint: '/auth/register',
    data: {
      name: 'Test User',
      email: 'user@test.com',
      phone: '9999999991',
      password: 'test123',
      role: 'ROLE_USER',
      userType: 'user'
    },
    role: 'USER'
  },
  {
    endpoint: '/auth/vendor/register',
    data: {
      name: 'Test Vendor',
      email: 'vendor@test.com',
      phone: '9999999992',
      password: 'test123',
      businessName: 'Test Vendor Business',
      businessAddress: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      panNumber: 'ABCDE1234F',
      gstNumber: '29ABCDE1234F1Z5',
      role: 'ROLE_VENDOR',
      userType: 'vendor'
    },
    role: 'VENDOR'
  },
  {
    endpoint: '/auth/admin/register',
    data: {
      name: 'Test Admin',
      email: 'admin@test.com',
      phone: '9999999993',
      password: 'test123',
      role: 'ADMIN',
      userType: 'admin'
    },
    role: 'ADMIN'
  },
  {
    endpoint: '/auth/cto/register',
    data: {
      name: 'Test CTO',
      email: 'cto@test.com',
      phone: '9999999994',
      password: 'test123',
      role: 'CTO',
      userType: 'cto'
    },
    role: 'CTO'
  },
  {
    endpoint: '/auth/support/register',
    data: {
      name: 'Test Support',
      email: 'support@test.com',
      phone: '9999999995',
      password: 'test123',
      role: 'SUPPORT',
      userType: 'support'
    },
    role: 'SUPPORT'
  },
  {
    endpoint: '/auth/data-entry/register',
    data: {
      name: 'Test Employee',
      email: 'employee@test.com',
      phone: '9999999996',
      password: 'test123',
      role: 'DATA_ENTRY',
      userType: 'data_entry'
    },
    role: 'EMPLOYEE'
  }
];

async function createTestUsers() {
  console.log('🚀 Creating test users...');
  
  for (const user of testUsers) {
    try {
      console.log(`\n📝 Creating ${user.role} user...`);
      console.log(`📧 Email: ${user.data.email}`);
      console.log(`🔗 Endpoint: ${BACKEND_URL}${user.endpoint}`);
      
      const response = await axios.post(`${BACKEND_URL}${user.endpoint}`, user.data);
      
      console.log(`✅ ${user.role} user created successfully!`);
      console.log(`📜 Response: ${response.data}`);
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ ${user.role} user creation failed: ${error.response.data}`);
        if (error.response.data.includes('already registered')) {
          console.log(`ℹ️ ${user.role} user already exists - that's okay!`);
        }
      } else {
        console.log(`❌ Error creating ${user.role} user: ${error.message}`);
      }
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎉 Test user creation process completed!');
  console.log('\n📋 Test Credentials Summary:');
  console.log('================================');
  
  testUsers.forEach(user => {
    console.log(`${user.role.toUpperCase()}:`);
    console.log(`  Email: ${user.data.email}`);
    console.log(`  Password: ${user.data.password}`);
    console.log('');
  });
}

// Run the script
createTestUsers().catch(console.error);
