import { api } from './apiClient';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/health');
    return response !== null; // If we get any response, backend is healthy
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const response = await api.get('/api/health');
    return {
      success: true,
      message: 'Backend connection successful',
      details: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Backend connection failed',
      details: {
        error: error.message,
        status: error.response?.status,
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        timestamp: new Date().toISOString()
      }
    };
  }
};

/**
 * Test specific API endpoints
 */
export const testApiEndpoints = async () => {
  const endpoints = [
    { name: 'Health Check', url: '/api/health', method: 'GET' },
    { name: 'Auth Check', url: '/auth/check', method: 'GET' },
    { name: 'Categories', url: '/api/buyer/categories', method: 'GET' },
  ];

  const results: any = {};

  for (const endpoint of endpoints) {
    try {
      let response;
      if (endpoint.method === 'GET') {
        response = await api.get(endpoint.url);
      } else if (endpoint.method === 'POST') {
        response = await api.post(endpoint.url, {});
      }
      
      results[endpoint.name] = {
        success: true,
        status: 200, // Assume success if no error thrown
        data: response
      };
    } catch (error: any) {
      results[endpoint.name] = {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }

  return results;
};
