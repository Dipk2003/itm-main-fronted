// Debug script to test product API
// Run this in browser console after logging in

const baseUrl = 'http://localhost:8080';

async function testProductAPI() {
    console.log('🚀 Testing Product API...');
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found. Please log in first.');
        return;
    }
    
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    
    // Test 1: Check token validity
    try {
        const profileResponse = await fetch(`${baseUrl}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            console.log('✅ Profile API works:', profile);
        } else {
            console.error('❌ Profile API failed:', profileResponse.status);
            return;
        }
    } catch (error) {
        console.error('❌ Profile API error:', error);
        return;
    }
    
    // Test 2: Try to add a product with minimal data
    const minimalProduct = {
        name: "Test Product",
        description: "Test Description",
        price: 100.0,
        stock: 10,
        categoryId: 1
    };
    
    try {
        console.log('📝 Sending product data:', minimalProduct);
        
        const response = await fetch(`${baseUrl}/api/products/vendor/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(minimalProduct)
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', [...response.headers.entries()]);
        
        const responseText = await response.text();
        console.log('📊 Response body:', responseText);
        
        if (response.ok) {
            console.log('✅ Product added successfully!');
        } else {
            console.error('❌ Product add failed:', response.status, responseText);
        }
    } catch (error) {
        console.error('❌ Product API error:', error);
    }
}

// Run the test
testProductAPI();
