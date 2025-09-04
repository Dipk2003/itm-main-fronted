import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Complete API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  API_BASE_URL: 'http://localhost:8080/api/v1',
  TIMEOUT: 30000,
  DEBUG: true
};

console.log('🌐 API Client Configuration:', API_CONFIG);

// Create axios instance with complete configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers
    if (config.headers) {
      config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
      config.headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    if (API_CONFIG.DEBUG) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
        hasAuth: !!token,
        headers: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with complete error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (API_CONFIG.DEBUG) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    // Handle different error types
    if (error.response?.status === 403) {
      console.error('🚨 403 Forbidden - CORS or Security issue');
      console.error('🔧 Check backend CORS configuration');
    } else if (error.response?.status === 401) {
      console.log('🔒 Authentication required, clearing tokens...');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
      }
    }

    return Promise.reject(error);
  }
);

// API Helper Functions
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(res => res.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(res => res.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(res => res.data),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(res => res.data),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;
