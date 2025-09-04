#!/usr/bin/env node

/**
 * 🔧 Vendor Role Issue Diagnostic and Fix Script
 * 
 * This script helps diagnose and fix the specific issue where:
 * "This account is not registered as a vendor. Please use the correct login portal."
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/v1';
const BACKEND_URL = 'http://localhost:8080';

async function diagnoseVendorRoleIssue() {
    console.log('🔍 Diagnosing Vendor Role Issue...\n');

    const testEmail = 'mishra@gmail.com';
    
    // Step 1: Check if backend is running
    console.log('1️⃣ Checking backend connectivity...');
    try {
        await axios.get(`${BACKEND_URL}/actuator/health`, { timeout: 5000 });
        console.log('✅ Backend is running and accessible\n');
    } catch (error) {
        console.log('❌ Backend is not accessible');
        console.log('🚨 Please start the backend server first:');
        console.log('   cd "D:\\itech-backend\\itech-backend"');
        console.log('   mvn spring-boot:run\n');
        return;
    }

    // Step 2: Check email role
    console.log('2️⃣ Checking email role in database...');
    try {
        const roleResponse = await axios.post(`${API_BASE_URL}/auth/check-email-role`, {
            email: testEmail
        });
        
        console.log('📧 Email check result:', roleResponse.data);
        
        const userRole = roleResponse.data.role || roleResponse.data.userRole;
        const exists = roleResponse.data.exists;
        
        if (exists === false || exists === 'false') {
            console.log('❌ Email not found in database');
            console.log('💡 Solution: Register this email as a vendor first\n');
        } else {
            console.log(`📝 Current role: ${userRole}`);
            
            if (userRole === 'ROLE_VENDOR' || userRole === 'VENDOR') {
                console.log('✅ Email is correctly registered as vendor');
                console.log('🤔 The issue might be in the login validation logic\n');
            } else {
                console.log('❌ Email is registered but NOT as a vendor');
                console.log(`🔄 Current role: ${userRole}`);
                console.log('💡 This explains the error message\n');
            }
        }
    } catch (error) {
        console.log('❌ Error checking email role:', error.response?.data || error.message);
        console.log('🚨 This might indicate backend API issues\n');
    }

    // Step 3: Try direct vendor registration
    console.log('3️⃣ Attempting to register email as vendor...');
    try {
        const registerData = {
            firstName: 'Test',
            lastName: 'Vendor',
            email: `vendor_${Date.now()}@example.com`, // Use unique email
            phoneNumber: '9876543210',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'ROLE_VENDOR',
            userType: 'vendor'
        };

        const registerResponse = await axios.post(`${API_BASE_URL}/auth/vendor/register`, registerData);
        console.log('✅ Test vendor registration successful');
        console.log('📧 Test vendor email:', registerData.email);
        console.log('🔑 Test vendor password: password123');
        console.log('💡 Try logging in with this test vendor account\n');
        
    } catch (error) {
        console.log('❌ Test vendor registration failed:', error.response?.data || error.message);
        console.log('🚨 This indicates issues with vendor registration endpoint\n');
    }

    // Step 4: Solutions and recommendations
    console.log('🛠️ SOLUTIONS TO FIX THE ISSUE:\n');
    
    console.log('📋 Option 1: Register the email as a vendor');
    console.log('   1. Go to: http://localhost:3000/auth/vendor/register');
    console.log('   2. Use a different email (vendors@example.com)');
    console.log('   3. Complete vendor registration');
    console.log('   4. Then login with vendor credentials\n');
    
    console.log('📋 Option 2: Use existing vendor account');
    console.log('   1. Check your database for existing vendor accounts');
    console.log('   2. Look in the users table for role = "ROLE_VENDOR"');
    console.log('   3. Use those credentials for login\n');
    
    console.log('📋 Option 3: Convert existing user to vendor (Database)');
    console.log('   1. Connect to your MySQL database');
    console.log('   2. Find the user: SELECT * FROM users WHERE email = "mishra@gmail.com"');
    console.log('   3. Update role: UPDATE users SET role = "ROLE_VENDOR" WHERE email = "mishra@gmail.com"');
    console.log('   4. Restart backend and try login again\n');
    
    console.log('📋 Option 4: Debug the backend authentication');
    console.log('   1. Check backend logs when attempting login');
    console.log('   2. Look for authentication and authorization errors');
    console.log('   3. Verify JWT token generation and role assignment\n');

    console.log('🔍 DEBUGGING CHECKLIST:\n');
    console.log('□ Backend server is running on port 8080');
    console.log('□ MySQL database is accessible and contains user data');
    console.log('□ The email exists in the database');
    console.log('□ The user role is set to "ROLE_VENDOR" in database');
    console.log('□ JWT token configuration is correct');
    console.log('□ CORS settings allow frontend-backend communication');
    console.log('□ No firewall blocking the connection\n');
}

async function createTestVendorAccount() {
    console.log('🏭 Creating Test Vendor Account...\n');
    
    const vendorData = {
        firstName: 'Test',
        lastName: 'Vendor',
        email: 'testvendor@itechmart.com',
        phoneNumber: '9876543210',
        password: 'vendor123',
        confirmPassword: 'vendor123',
        role: 'ROLE_VENDOR',
        userType: 'vendor'
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/vendor/register`, vendorData);
        console.log('✅ Test vendor account created successfully!');
        console.log('🔑 Login Credentials:');
        console.log('   Email: testvendor@itechmart.com');
        console.log('   Password: vendor123');
        console.log('🌐 Login URL: http://localhost:3000/auth/vendor/login\n');
    } catch (error) {
        console.log('❌ Failed to create test vendor account:', error.response?.data || error.message);
        
        if (error.response?.status === 409) {
            console.log('💡 Account might already exist. Try logging in with:');
            console.log('   Email: testvendor@itechmart.com');
            console.log('   Password: vendor123\n');
        }
    }
}

async function testVendorLogin() {
    console.log('🔐 Testing Vendor Login Flow...\n');
    
    const loginData = {
        emailOrPhone: 'testvendor@itechmart.com',
        password: 'vendor123'
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/vendor/login`, loginData);
        
        if (response.data.token) {
            console.log('✅ Vendor login successful!');
            console.log('🎫 JWT Token received');
            console.log('👤 User data:', response.data.user);
            console.log('🏪 Role:', response.data.user?.role);
        } else {
            console.log('⚠️ Login requires OTP verification');
            console.log('📱 OTP sent to email');
        }
    } catch (error) {
        console.log('❌ Vendor login failed:', error.response?.data || error.message);
        
        if (error.response?.data?.includes('not registered as a vendor')) {
            console.log('🚨 Same issue detected - account exists but wrong role');
        }
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--create-test')) {
        await createTestVendorAccount();
    } else if (args.includes('--test-login')) {
        await testVendorLogin();
    } else {
        await diagnoseVendorRoleIssue();
        
        console.log('🎯 QUICK ACTIONS:\n');
        console.log('To create a test vendor account:');
        console.log('node fix-vendor-role-issue.js --create-test\n');
        
        console.log('To test vendor login:');
        console.log('node fix-vendor-role-issue.js --test-login\n');
    }
}

main().catch(console.error);
