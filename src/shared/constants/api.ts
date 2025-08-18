// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || localStorage.getItem('token')
    : null;
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const API_ENDPOINTS = {
  // Core/Auth endpoints
  CORE: {
    AUTH: '/api/auth',
  },
  // Auth endpoints (backward compatibility)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register', 
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  
  // Product endpoints
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  
  // Order endpoints
  ORDERS: '/api/orders',
  
  // User endpoints
  USERS: '/api/users',
  PROFILE: '/api/users/profile',
  
  // Additional endpoints
  HEALTH: '/api/health',
};
