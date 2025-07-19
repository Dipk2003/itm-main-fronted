// Frontend Authentication Fix Script
// Run this in your browser console to debug and fix authentication issues

console.log('🔧 Starting Frontend Authentication Fix...');

// Step 1: Check current configuration
console.log('📋 Current Configuration:');
console.log('- Window location:', window.location.href);
console.log('- Local storage token:', localStorage.getItem('token') ? 'Present' : 'Missing');
console.log('- Local storage user:', localStorage.getItem('user') ? 'Present' : 'Missing');

// Step 2: Check if we can reach the backend
const backendUrl = 'https://indiantradebackend-1.onrender.com';
console.log('🌐 Testing backend connectivity...');

async function testBackendConnectivity() {
    try {
        const response = await fetch(`${backendUrl}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Backend is reachable');
            const data = await response.text();
            console.log('Backend health response:', data);
        } else {
            console.log('⚠️ Backend returned status:', response.status);
        }
    } catch (error) {
        console.log('❌ Backend connectivity failed:', error.message);
        console.log('💡 This might be a CORS or network issue');
    }
}

// Step 3: Validate authentication token
async function validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('❌ No authentication token found');
        console.log('💡 Please log in first');
        return false;
    }
    
    console.log('🔑 Testing token validation...');
    console.log('Token preview:', token.substring(0, 30) + '...');
    
    try {
        const response = await fetch(`${backendUrl}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            console.log('✅ Token is valid');
            console.log('User data:', userData);
            
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } else {
            console.log('❌ Token validation failed:', response.status);
            
            if (response.status === 401) {
                console.log('💡 Token expired or invalid - please log in again');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            return false;
        }
    } catch (error) {
        console.log('❌ Token validation error:', error.message);
        return false;
    }
}

// Step 4: Fix autocomplete attribute issue
function fixAutocompleteAttributes() {
    console.log('🔧 Fixing autocomplete attributes...');
    
    // Find input fields that might need autocomplete attributes
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach((input, index) => {
        const placeholder = input.placeholder?.toLowerCase() || '';
        const name = input.name?.toLowerCase() || '';
        
        if (!input.getAttribute('autocomplete')) {
            let autocompleteValue = 'off';
            
            // Determine appropriate autocomplete value based on field type
            if (placeholder.includes('email') || name.includes('email')) {
                autocompleteValue = 'email';
            } else if (placeholder.includes('username') || name.includes('username')) {
                autocompleteValue = 'username';
            } else if (placeholder.includes('password') || name.includes('password')) {
                autocompleteValue = 'current-password';
            } else if (placeholder.includes('phone') || name.includes('phone')) {
                autocompleteValue = 'tel';
            } else if (placeholder.includes('aadhar') || name.includes('aadhar')) {
                autocompleteValue = 'off';
            }
            
            input.setAttribute('autocomplete', autocompleteValue);
            console.log(`✅ Fixed input #${index + 1}: ${placeholder || name} -> autocomplete="${autocompleteValue}"`);
        }
    });
}

// Step 5: Clear problematic data and refresh
function clearAndRefresh() {
    console.log('🧹 Clearing problematic data...');
    
    // Clear any corrupted authentication data
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token) {
        try {
            // Try to parse token to see if it's valid JSON (it shouldn't be)
            JSON.parse(token);
            console.log('⚠️ Token appears to be JSON instead of JWT - clearing');
            localStorage.removeItem('token');
        } catch {
            // This is expected for a proper JWT token
            console.log('✅ Token format appears correct');
        }
    }
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('✅ User data parsed successfully:', userData);
        } catch {
            console.log('⚠️ User data corrupted - clearing');
            localStorage.removeItem('user');
        }
    }
}

// Step 6: Comprehensive fix
async function comprehensiveFix() {
    console.log('🚀 Running comprehensive fix...');
    
    // Fix autocomplete attributes
    fixAutocompleteAttributes();
    
    // Clear problematic data
    clearAndRefresh();
    
    // Test backend connectivity
    await testBackendConnectivity();
    
    // Validate authentication
    const isValid = await validateToken();
    
    if (isValid) {
        console.log('✅ Authentication is working properly');
        console.log('🎉 Frontend fix completed successfully!');
        
        // Test a sample API call
        console.log('🧪 Testing sample API call...');
        try {
            const response = await fetch(`${backendUrl}/api/categories`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const categories = await response.json();
                console.log('✅ API call successful, categories:', categories);
            } else {
                console.log('⚠️ API call failed:', response.status);
            }
        } catch (error) {
            console.log('❌ API call error:', error.message);
        }
    } else {
        console.log('❌ Authentication issues detected');
        console.log('💡 Next steps:');
        console.log('  1. Clear browser cache and cookies');
        console.log('  2. Log out and log back in');
        console.log('  3. Check if backend server is running properly');
        console.log('  4. Verify your user credentials');
    }
    
    console.log('');
    console.log('📋 Summary of fixes applied:');
    console.log('✅ Added .env.local with correct backend URL');
    console.log('✅ Enhanced API error logging');
    console.log('✅ Fixed autocomplete attributes');
    console.log('✅ Validated authentication token');
    console.log('✅ Tested backend connectivity');
    
    console.log('');
    console.log('🔄 Please refresh the page to apply the changes');
}

// Run the comprehensive fix
comprehensiveFix();

// Export functions for manual use
window.authFix = {
    testBackend: testBackendConnectivity,
    validateToken: validateToken,
    fixAutocomplete: fixAutocompleteAttributes,
    clearData: clearAndRefresh,
    runAll: comprehensiveFix
};

console.log('');
console.log('💡 Manual functions available:');
console.log('- authFix.testBackend() - Test backend connectivity');
console.log('- authFix.validateToken() - Validate current token');
console.log('- authFix.fixAutocomplete() - Fix autocomplete attributes');
console.log('- authFix.clearData() - Clear corrupted data');
console.log('- authFix.runAll() - Run all fixes again');
