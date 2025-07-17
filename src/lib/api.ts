import axios from "axios";

// Get the backend URL from environment variables
const getBackendUrl = () => {
  // For production, use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // For development, use environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
};

const BACKEND_URL = getBackendUrl();

console.log('Backend URL:', BACKEND_URL);

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // for cookies later
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vendor Products
export const getVendorProducts = (vendorId: number, page: number = 0, size: number = 12) => {
  return api.get(`/api/products/vendor/${vendorId}`, {
    params: { page, size }
  });
};

export const addVendorProduct = (vendorId: number, productData: any) => {
  return api.post(`/api/products`, productData);
};

export const updateVendorProduct = (productId: number, productData: any) => {
  return api.put(`/api/products/${productId}`, productData);
};

export const deleteVendorProduct = (productId: number) => {
  return api.delete(`/api/products/${productId}`);
};

// Vendor Orders
export const getVendorOrders = (vendorId: number, page: number = 0, size: number = 10) => {
  return api.get(`/api/orders/vendor/my-orders/paginated`, {
    params: { page, size }
  });
};

// Vendor Leads
export const getVendorLeads = (vendorId: number) => {
  return api.get(`/api/leads/vendor/${vendorId}`);
};

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
    
    // Only handle auth errors for protected API calls
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Auth check failed:', error);
      
      // Check if this is an actual auth-related API call that requires authentication
      const url = error.config?.url || '';
      const isProtectedCall = url.includes('/auth/profile') || 
                            url.includes('/auth/refresh') ||
                            url.includes('/api/orders') ||
                            url.includes('/api/products/vendor') ||
                            url.includes('/dashboard') ||
                            url.includes('/admin/') ||
                            url.includes('/vendor/') && !url.includes('/auth/vendor/login') && !url.includes('/auth/vendor/register');
      
      // Only logout if it's a protected API call that failed authentication
      if (isProtectedCall) {
        console.log('Protected API call failed, logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Don't redirect if we're already on an auth page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth/') && !currentPath.includes('/login')) {
          window.location.href = '/auth/user/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 5000 });
    return true;
  } catch (error) {
    console.log('API health check failed:', error);
    return false;
  }
};

// Test authentication and find correct user info
export const testAuthAndGetUser = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }
    
    console.log('Testing authentication with token:', token.substring(0, 20) + '...');
    
    // Try to get user profile
    const response = await api.get('/auth/profile');
    console.log('User profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('Auth test failed:', error.response?.status, error.response?.data);
    return null;
  }
};

// Find correct bulk import endpoint
export const findBulkImportEndpoint = async (userId: string): Promise<string | null> => {
  const endpoints = [
    `/vendor/${userId}/products/bulk-import`,
    `/api/products/vendor/bulk-import`,
    `/api/vendor/products/bulk-import`,
    `/api/vendor/${userId}/products/bulk-import`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const formData = new FormData();
      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(`✅ Endpoint ${endpoint} is accessible`);
      return endpoint;
    } catch (error: any) {
      console.log(`❌ Endpoint ${endpoint} failed:`, error.response?.status);
      // 400 means endpoint exists but needs proper data
      if (error.response?.status === 400) {
        console.log(`⚠️ Endpoint ${endpoint} exists but needs file data`);
        return endpoint;
      }
    }
  }
  
  return null;
};
