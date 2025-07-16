// Debug script to test authentication status
// Copy and paste this entire script into your browser console

console.log("🔍 Debugging Authentication Status...");

// Check local storage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
  
  console.log("📋 Local Storage:");
  console.log("  Token:", token ? `Present (${token.substring(0, 20)}...)` : "❌ Missing");
  console.log("  User:", user ? JSON.parse(user) : "❌ Missing");
  
  if (!token) {
    console.log("❌ No token found. Please log in first.");
    return;
  }
  
  // Decode JWT token (simple decode, not verification)
  try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log("🔐 JWT Token Payload:");
    console.log("  Subject:", payload.sub);
    console.log("  Role:", payload.role);
    console.log("  User ID:", payload.userId);
    console.log("  Issued At:", new Date(payload.iat * 1000));
    console.log("  Expires At:", new Date(payload.exp * 1000));
    console.log("  Is Expired:", Date.now() > payload.exp * 1000);
  } catch (error) {
    console.log("❌ Error decoding token:", error);
  }
  
  // Test API calls
  const baseUrl = 'http://localhost:8080';
  
  console.log("\n🌐 Testing API Calls:");
  
  // Test profile endpoint
  fetch(`${baseUrl}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log("  Profile API:", response.status, response.ok ? "✅" : "❌");
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Status: ${response.status}`);
  })
  .then(data => {
    console.log("    Profile Data:", data);
  })
  .catch(error => {
    console.log("    Profile Error:", error);
  });
  
  // Test product add endpoint
  const testProduct = {
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
    categoryId: 1
  };
  
  setTimeout(() => {
    fetch(`${baseUrl}/api/products/vendor/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testProduct)
    })
    .then(response => {
      console.log("  Product Add API:", response.status, response.ok ? "✅" : "❌");
      if (response.ok) {
        return response.json();
      }
      return response.text();
    })
    .then(data => {
      console.log("    Product Add Response:", data);
    })
    .catch(error => {
      console.log("    Product Add Error:", error);
    });
  }, 1000);
