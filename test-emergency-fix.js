#!/usr/bin/env node

const axios = require('axios');

async function testEmergencyFix() {
    console.log('🧪 Testing Emergency Fix...\n');

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
    console.log('\n2️⃣ Testing auth endpoint directly...');
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
            console.log('\n🚨 STILL 403 - Security config not updated or backend not restarted');
        } else if (error.response?.status === 500) {
            console.log('\n✅ Security passed! 500 = Server error (probably invalid credentials)');
            console.log('💡 This means the 403 issue is FIXED!');
        } else if (error.response?.status === 400) {
            console.log('\n✅ Security passed! 400 = Bad request (validation error)');
            console.log('💡 This means the 403 issue is FIXED!');
        }
    }

    console.log('\n🎯 Summary:');
    console.log('- 403 = Security blocking requests (need to restart backend)');
    console.log('- 500 = Server error (security fixed, but app error)'); 
    console.log('- 400 = Validation error (security fixed, ready to test)');
}

testEmergencyFix().catch(console.error);