// Test script for debugging add product functionality
// Run this in browser console after logging in

async function testAddProduct() {
  console.log("🧪 Testing Add Product Functionality...");
  
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log("🔐 Authentication Status:");
  console.log("  Token:", token ? "✅ Present" : "❌ Missing");
  console.log("  User ID:", user.id);
  console.log("  User Role:", user.role);
  
  if (!token) {
    console.log("❌ No token found. Please log in first.");
    return;
  }
  
  // Test product data
  const testProduct = {
    name: "Test Product",
    description: "This is a test product for debugging",
    price: 99.99,
    originalPrice: 109.99,
    stock: 10,
    categoryId: 1,
    brand: "Test Brand",
    model: "Test Model",
    sku: "TEST-001",
    minOrderQuantity: 1,
    unit: "piece",
    specifications: "Test specifications",
    tags: "test, debug, product",
    weight: 1.5,
    length: 10,
    width: 5,
    height: 3,
    freeShipping: false,
    shippingCharge: 50,
    isActive: true
  };
  
  console.log("📦 Test Product Data:", testProduct);
  
  // Test different API endpoints
  const baseUrl = 'http://localhost:8080';
  const endpoints = [
    '/api/products/vendor/add',
    '/api/products',
    '/vendor/products',
    '/api/vendor/products'
  ];
  
  console.log("\n🌐 Testing Product API Endpoints:");
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint}`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testProduct)
      });
      
      const statusIcon = response.ok ? '✅' : '❌';
      console.log(`  ${statusIcon} ${endpoint} - Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  📦 Product created:`, data);
        console.log("🎉 SUCCESS! Product was added successfully!");
        return;
      } else if (response.status === 403) {
        console.log(`  🔒 Authentication/Authorization issue`);
        const errorText = await response.text();
        console.log(`  Error response:`, errorText);
      } else if (response.status === 404) {
        console.log(`  🔍 Endpoint not found - trying next endpoint`);
      } else {
        console.log(`  ❌ Error response:`, await response.text());
      }
      
    } catch (error) {
      console.log(`  ❌ ${endpoint} - Network Error: ${error.message}`);
    }
  }
  
  console.log("\n🎯 Test Results Summary:");
  console.log("1. If all endpoints returned 404: The backend doesn't have product creation endpoints configured");
  console.log("2. If endpoints returned 403: There's an authentication/authorization issue");
  console.log("3. If there were network errors: The backend server might not be running");
  console.log("4. Check the backend logs for more details about what's happening on the server side");
}

// Also test categories endpoint
async function testCategories() {
  console.log("\n📂 Testing Categories API...");
  
  const token = localStorage.getItem('token');
  const baseUrl = 'http://localhost:8080';
  
  const categoryEndpoints = [
    '/api/categories',
    '/categories',
    '/api/vendor/categories'
  ];
  
  for (const endpoint of categoryEndpoints) {
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
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  📂 Categories:`, data);
        return;
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Run both tests
console.log("🚀 Starting comprehensive API tests...");
testAddProduct();
testCategories();
