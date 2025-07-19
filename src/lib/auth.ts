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
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'vendor' | 'user';
  userType: 'vendor' | 'user';
  companyName?: string;
  phone?: string;
  address?: string;
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
  login: async (credentials: LoginCredentials): Promise<JwtResponse | string> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<string> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  registerVendor: async (data: RegisterData): Promise<string> => {
    const response = await api.post('/auth/vendor/register', data);
    return response.data;
  },

  registerAdmin: async (data: RegisterData): Promise<string> => {
    const response = await api.post('/auth/admin/register', data);
    return response.data;
  },

  sendLoginOtp: async (credentials: LoginCredentials): Promise<string> => {
    const response = await api.post('/auth/login-otp', credentials);
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
