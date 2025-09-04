#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080/api/v1';
const FRONTEND_URL = 'http://localhost:3000';

async function runCompleteIntegrationTest() {
    console.log('🧪 Running Complete Frontend-Backend Integration Test...\n');

    // Test 1: Backend Health
    console.log('1️⃣ Testing Backend Health...');
    try {
        const healthResponse = await axios.get(`${BACKEND_URL}/actuator/health`, {
            headers: { 'Origin': FRONTEND_URL },
            timeout: 10000
        });
        console.log('✅ Backend Health:', healthResponse.status, healthResponse.data.status);
    } catch (error) {
        console.log('❌ Backend Health Failed:', error.response?.status || error.message);
        console.log('🚨 Backend must be running on port 8080');
        return;
    }

    // Test 2: CORS Preflight
    console.log('\n2️⃣ Testing CORS Preflight...');
    try {
        const corsResponse = await axios.options(`${API_BASE_URL}/auth/vendor/login`, {
            headers: {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
        });
        console.log('✅ CORS Preflight:', corsResponse.status);
        console.log('📋 CORS Headers:', corsResponse.headers['access-control-allow-origin']);
    } catch (error) {
        console.log('❌ CORS Preflight Failed:', error.response?.status || error.message);
    }

    // Test 3: Auth Endpoint Accessibility
    console.log('\n3️⃣ Testing Auth Endpoint...');
    try {
        const authResponse = await axios.post(`${API_BASE_URL}/auth/vendor/login`, {
            emailOrPhone: 'nonexistent@example.com',
            password: 'wrongpassword'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL
            }
        });
        console.log('✅ Auth Endpoint Accessible:', authResponse.status);
    } catch (error) {
        const status = error.response?.status;
        console.log('📊 Auth Endpoint Response Status:', status);
        
        if (status === 400 || status === 401) {
            console.log('✅ Auth endpoint accessible! (400/401 = validation/auth error, not CORS)');
        } else if (status === 403) {
            console.log('❌ Still 403 - CORS/Security issue persists');
        } else if (status === 500) {
            console.log('⚠️ 500 Server Error - endpoint accessible but server issue');
        } else {
            console.log('❓ Unexpected status:', status);
        }
    }

    // Test 4: Products Endpoint
    console.log('\n4️⃣ Testing Products Endpoint...');
    try {
        const productsResponse = await axios.get(`${API_BASE_URL}/products`, {
            headers: { 'Origin': FRONTEND_URL },
            params: { page: 0, size: 1 }
        });
        console.log('✅ Products Endpoint:', productsResponse.status);
        console.log('📦 Products Found:', productsResponse.data?.totalElements || 0);
    } catch (error) {
        console.log('❌ Products Endpoint:', error.response?.status || error.message);
    }

    // Test 5: Categories Endpoint
    console.log('\n5️⃣ Testing Categories Endpoint...');
    try {
        const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, {
            headers: { 'Origin': FRONTEND_URL }
        });
        console.log('✅ Categories Endpoint:', categoriesResponse.status);
        console.log('📂 Categories Found:', Array.isArray(categoriesResponse.data) ? categoriesResponse.data.length : 0);
    } catch (error) {
        console.log('❌ Categories Endpoint:', error.response?.status || error.message);
    }

    console.log('\n🎯 Integration Test Summary:');
    console.log('✅ = Working correctly');
    console.log('❌ = Needs attention');
    console.log('⚠️ = Accessible but has errors');
    console.log('\n💡 If all tests show ✅ or ⚠️, the integration is working!');
}

runCompleteIntegrationTest().catch(console.error);