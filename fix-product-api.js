// Complete fix script for product API issues
// Run this in browser console after logging in as a vendor

const baseUrl = 'http://localhost:8080';

async function fixProductAPI() {
    console.log('🔧 Fixing Product API Issues...');
    
    // Step 1: Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found. Please log in first.');
        return;
    }
    
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    
    // Step 2: Decode token to check user ID
    try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔐 JWT Token Payload:');
        console.log('  Subject:', payload.sub);
        console.log('  Role:', payload.role);
        console.log('  User ID:', payload.userId);
        
        if (!payload.userId) {
            console.error('❌ PROBLEM: userId is missing from token!');
            console.error('Backend needs to be restarted with JWT fixes.');
            return;
        } else {
            console.log('✅ userId is present in token');
        }
    } catch (error) {
        console.error('❌ Error decoding token:', error);
        return;
    }
    
    // Step 3: Create a test category
    try {
        console.log('📝 Creating test category...');
        const categoryResponse = await fetch(`${baseUrl}/api/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Electronics"
            })
        });
        
        if (categoryResponse.ok) {
            const category = await categoryResponse.json();
            console.log('✅ Category created:', category);
        } else {
            console.log('⚠️ Category creation failed (might already exist):', categoryResponse.status);
        }
    } catch (error) {
        console.log('⚠️ Category creation error:', error);
    }
    
    // Step 4: Get all categories to find a valid categoryId
    let categoryId = 1; // Default fallback
    try {
        console.log('📝 Getting categories...');
        const categoriesResponse = await fetch(`${baseUrl}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            console.log('✅ Categories found:', categories);
            if (categories.length > 0) {
                categoryId = categories[0].id;
                console.log('✅ Using category ID:', categoryId);
            }
        } else {
            console.log('⚠️ Categories fetch failed:', categoriesResponse.status);
        }
    } catch (error) {
        console.log('⚠️ Categories fetch error:', error);
    }
    
    // Step 5: Test product creation with complete data
    const testProduct = {
        name: "Test Product",
        description: "This is a test product created via API",
        price: 100.0,
        originalPrice: 120.0,
        stock: 50,
        categoryId: categoryId,
        brand: "Test Brand",
        model: "Test Model",
        sku: "TEST001",
        minOrderQuantity: 1,
        unit: "piece",
        specifications: "Test specifications",
        tags: "test,product",
        gstRate: 18.0,
        weight: 1.0,
        length: 10.0,
        width: 5.0,
        height: 3.0,
        freeShipping: false,
        shippingCharge: 50.0,
        isActive: true
    };
    
    try {
        console.log('📝 Testing product creation...');
        console.log('Product data:', testProduct);
        
        const productResponse = await fetch(`${baseUrl}/api/products/vendor/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProduct)
        });
        
        console.log('📊 Product API Response Status:', productResponse.status);
        console.log('📊 Product API Response Headers:', [...productResponse.headers.entries()]);
        
        const responseText = await productResponse.text();
        console.log('📊 Product API Response Body:', responseText);
        
        if (productResponse.ok) {
            console.log('🎉 SUCCESS: Product created successfully!');
            console.log('✅ The product API is now working correctly.');
        } else {
            console.error('❌ Product creation failed:', productResponse.status);
            console.error('Error details:', responseText);
        }
    } catch (error) {
        console.error('❌ Product API error:', error);
    }
    
    // Step 6: Test getting vendor products
    try {
        console.log('📝 Testing get vendor products...');
        const vendorProductsResponse = await fetch(`${baseUrl}/api/products/vendor/my-products`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (vendorProductsResponse.ok) {
            const products = await vendorProductsResponse.json();
            console.log('✅ Vendor products:', products);
        } else {
            console.log('⚠️ Vendor products fetch failed:', vendorProductsResponse.status);
        }
    } catch (error) {
        console.log('⚠️ Vendor products fetch error:', error);
    }
    
    console.log('🔧 Fix script completed!');
}

// Run the fix
fixProductAPI();
