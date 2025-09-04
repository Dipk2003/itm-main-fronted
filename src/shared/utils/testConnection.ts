import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { api } from './apiClient';

export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('🔍 Testing backend connection...');
    console.log('Backend URL:', API_BASE_URL);
    
    // Test health endpoint
    const response = await api.get(API_ENDPOINTS.SHARED.HEALTH);
    
    if (200 === 200) {
      return {
        success: true,
        message: 'Backend connection successful!',
        details: {
          status: 200,
          data: response,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        message: `Backend responded with status: ${200}`,
        details: response
      };
    }
  } catch (error: any) {
    console.error('❌ Backend connection failed:', error);
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        success: false,
        message: 'Cannot connect to backend. Please ensure backend is running on ' + API_BASE_URL,
        details: {
          error: error.message,
          code: error.code,
          config: {
            baseURL: error.config?.baseURL,
            url: error.config?.url
          }
        }
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }
    };
  }
};

// Test specific module endpoints
export const testModuleEndpoints = async () => {
  const endpoints = [
    { name: 'Health Check', url: API_ENDPOINTS.SHARED.HEALTH },
    { name: 'Auth Login', url: `${API_ENDPOINTS.CORE.AUTH}/login` },
    { name: 'Buyer Products', url: API_ENDPOINTS.BUYER.PRODUCTS },
    { name: 'Vendor Dashboard', url: API_ENDPOINTS.VENDOR.DASHBOARD },
    { name: 'Admin Users', url: API_ENDPOINTS.ADMIN.USERS },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint.url);
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: 200,
        success: true
      });
    } catch (error: any) {
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: error.response?.status || 'ERROR',
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

// Test authentication flow
export const testAuthFlow = async () => {
  try {
    // Test registration endpoint
    const regResponse = await api.post(`${API_ENDPOINTS.CORE.AUTH}/register`, {
      email: 'test@example.com',
      password: 'testpassword',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '1234567890',
      userType: 'BUYER'
    });
    
    console.log('Registration test:', regResponse);
    
    // Test login endpoint  
    const loginResponse = await api.post(`${API_ENDPOINTS.CORE.AUTH}/login`, {
      email: 'test@example.com',
      password: 'testpassword',
      userType: 'BUYER'
    });
    
    console.log('Login test:', loginResponse);
    
    return {
      success: true,
      message: 'Authentication endpoints are working',
      details: {
        registration: regResponse,
        login: loginResponse
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Authentication test failed',
      error: error.response?.data || error.message
    };
  }
};
