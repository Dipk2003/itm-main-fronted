import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendor' | 'user';
  userType: 'admin' | 'vendor' | 'user';
  companyName?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  adminCode?: string; // Required for admin login
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'vendor' | 'user' | 'admin';
  userType: 'vendor' | 'user' | 'admin';
  companyName?: string;
  phone?: string;
  address?: string;
  adminCode?: string; // Required for admin registration
}

export interface JwtResponse {
  token: string;
  user: User;
  tokenType: string;
}

export interface VerifyOtpRequest {
  emailOrPhone: string;
  otp: string;
}

// Auth API functions
export const authAPI = {
  // Role-specific login functions
  login: async (credentials: LoginCredentials, userType?: 'user' | 'vendor' | 'admin'): Promise<JwtResponse | string> => {
    let endpoint = '/auth/login'; // Default generic endpoint
    
    // Use role-specific endpoints if userType is specified
    if (userType === 'user') {
      endpoint = '/auth/user/login';
    } else if (userType === 'vendor') {
      endpoint = '/auth/vendor/login';
    } else if (userType === 'admin') {
      endpoint = '/auth/admin/login';
    }
    
    console.log(`🔐 Using login endpoint: ${endpoint} for userType: ${userType || 'generic'}`);
    const response = await api.post(endpoint, credentials);
    return response.data;
  },
  
  // Convenience methods for specific login types
  userLogin: async (credentials: LoginCredentials): Promise<JwtResponse | string> => {
    return authAPI.login(credentials, 'user');
  },
  
  vendorLogin: async (credentials: LoginCredentials): Promise<JwtResponse | string> => {
    return authAPI.login(credentials, 'vendor');
  },
  
  adminLogin: async (credentials: LoginCredentials): Promise<JwtResponse | string> => {
    return authAPI.login(credentials, 'admin');
  },

  // Role-specific registration functions
  register: async (data: RegisterData): Promise<string> => {
    // Route based on role
    switch (data.role.toUpperCase()) {
      case 'ADMIN':
        return authAPI.registerAdmin(data);
      case 'VENDOR':
        return authAPI.registerVendor(data);
      case 'USER':
      default:
        return authAPI.registerUser(data);
    }
  },

  registerUser: async (data: RegisterData): Promise<string> => {
    const registerData = { ...data, role: 'ROLE_USER' };
    const response = await api.post('/auth/register', registerData);
    return response.data;
  },

  registerVendor: async (data: RegisterData): Promise<string> => {
    const registerData = { ...data, role: 'ROLE_VENDOR' };
    const response = await api.post('/auth/register', registerData);
    return response.data;
  },

  registerAdmin: async (data: RegisterData): Promise<string> => {
    if (!data.adminCode) {
      throw new Error('Admin code is required for admin registration');
    }
    const registerData = { ...data, role: 'ROLE_ADMIN' };
    const response = await api.post('/auth/register', registerData);
    return response.data;
  },

  sendLoginOtp: async (credentials: LoginCredentials): Promise<string> => {
    const response = await api.post('/auth/send-login-otp', credentials);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<JwtResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  refreshToken: async (): Promise<JwtResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  setPassword: async (data: { emailOrPhone: string; newPassword: string; otp: string }): Promise<string> => {
    const response = await api.post('/auth/set-password', data);
    return response.data;
  }
};
