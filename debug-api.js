// Debug script to test API authentication and find correct endpoints
// Run this in the browser console after logging in

async function debugApi() {
  console.log("🔍 Starting API Debug...");
  
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log("🔐 Authentication Status:");
  console.log("  Token:", token ? "✅ Present" : "❌ Missing");
  console.log("  User:", user);
  
  if (!token) {
    console.log("❌ No token found. Please log in first.");
    return;
  }
  
  // Test different endpoints
  const baseUrl = 'http://localhost:8080';
  const testEndpoints = [
    '/auth/profile',
    '/api/products/vendor/my-products',
    '/vendor/11/products/bulk-import',
    '/api/vendor/products/bulk-import',
    '/health'
  ];
  
  console.log("\n🌐 Testing API Endpoints:");
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const statusIcon = response.ok ? '✅' : '❌';
      console.log(`  ${statusIcon} ${endpoint} - Status: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        console.log(`    Response:`, data);
      }
      
    } catch (error) {
      console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  // Test file upload endpoint specifically
  console.log("\n📤 Testing File Upload Endpoints:");
  
  const fileEndpoints = [
    `/vendor/${user.id}/products/bulk-import`,
    `/api/products/vendor/bulk-import`,
    `/api/vendor/products/bulk-import`
  ];
  
  for (const endpoint of fileEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: new FormData() // Empty form data for testing
      });
      
      const statusIcon = response.status === 400 ? '⚠️' : (response.ok ? '✅' : '❌');
      console.log(`  ${statusIcon} ${endpoint} - Status: ${response.status}`);
      
      if (response.status === 400) {
        console.log(`    This endpoint exists but requires file data`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  console.log("\n🎯 Recommendations:");
  console.log("1. Check which endpoints return 200 or 400 (400 means endpoint exists but needs data)");
  console.log("2. Use the working endpoint in your application");
  console.log("3. Ensure the user ID matches your authenticated user");
  console.log("4. Make sure JWT token is properly formatted");
}

// Run the debug function
debugApi();
