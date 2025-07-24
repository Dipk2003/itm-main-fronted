// Debug utility to help diagnose authentication issues
export const debugAuthState = () => {
  if (typeof window === 'undefined') {
    console.log('Running on server side');
    return;
  }

  console.log('=== Auth Debug Information ===');
  console.log('Current URL:', window.location.href);
  console.log('Current Time:', new Date().toISOString());
  
  const token = localStorage.getItem('token');
  console.log('\nToken Information:');
  console.log('- token exists:', !!token);
  console.log('- token length:', token ? token.length : 0);
  console.log('- token preview:', token ? token.substring(0, 50) + '...' : 'None');
  
  // Try to decode JWT token (basic decode, not verification)
  if (token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('- token payload:', payload);
        console.log('- token issued at:', new Date(payload.iat * 1000).toISOString());
        console.log('- token expires at:', new Date(payload.exp * 1000).toISOString());
        console.log('- token expired?', payload.exp * 1000 < Date.now());
      }
    } catch (error) {
      console.log('- token decode failed:', error);
    }
  }
  
  console.log('\nLocal Storage Items:');
  console.log('- user:', localStorage.getItem('user'));
  console.log('- authToken:', localStorage.getItem('authToken'));
  console.log('- userData:', localStorage.getItem('userData'));
  console.log('- userRole:', localStorage.getItem('userRole'));
  console.log('- vendorId:', localStorage.getItem('vendorId'));
  console.log('- userId:', localStorage.getItem('userId'));
  
  // Try to parse user data
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      console.log('\nParsed user data:', user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
    }
  }
  
  console.log('=== End Debug Info ===');
};

// Quick function to set test user data (for debugging only)
export const setTestUserData = () => {
  if (typeof window === 'undefined') return;
  
  const testUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    userType: 'user',
    phone: '+1234567890',
    address: '123 Test St',
    isVerified: true,
    createdAt: new Date().toISOString(),
  };
  
  const testToken = `test-token-${Date.now()}`;
  
  localStorage.setItem('token', testToken);
  localStorage.setItem('user', JSON.stringify(testUser));
  
  console.log('Test user data set:', testUser);
  console.log('Test token set:', testToken);
  
  // Reload the page to trigger auth context update
  window.location.reload();
};

// Clear all auth data
export const clearAllAuthData = () => {
  if (typeof window === 'undefined') return;
  
  const keys = ['token', 'user', 'authToken', 'userData', 'userRole', 'vendorId', 'userId'];
  keys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Cleared ${key}`);
  });
  
  console.log('All auth data cleared');
};

// Test API connectivity
export const testApiConnectivity = async () => {
  console.log('Testing API connectivity...');
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  console.log('Testing against:', baseUrl);
  
  // Test basic connectivity
  try {
    const response = await fetch(`${baseUrl}/health`, { 
      method: 'GET',
      timeout: 5000 
    } as RequestInit);
    
    console.log('Health check response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.text();
      console.log('Health check data:', data);
      return true;
    }
  } catch (error) {
    console.error('Health check failed:', error);
  }
  
  // Test auth endpoint
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Auth profile response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Profile data:', data);
      return true;
    } else {
      const errorData = await response.text();
      console.log('Profile error:', errorData);
    }
  } catch (error) {
    console.error('Auth profile test failed:', error);
  }
  
  return false;
};
