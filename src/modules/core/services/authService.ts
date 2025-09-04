// Enhanced Auth Service with better error handling
import { api } from '@/shared/utils/apiClient';

export class AuthService {
  async login(loginData: any): Promise<any> {
    try {
      console.log('🔐 AuthService: Attempting login for:', loginData.email || loginData.emailOrPhone);
      
      const loginPayload = {
        emailOrPhone: loginData.email || loginData.emailOrPhone,
        password: loginData.password,
      };
      
      const userType = loginData.userType || 'user';
      const endpoint = `/auth/${userType}/login`;
      
      console.log('📞 AuthService: Calling endpoint:', endpoint);
      
      const response = await api.post<any>(endpoint, loginPayload);
      
      console.log('📥 AuthService: Login response received:', response);
      
      if (response.token) {
        console.log('✅ Direct login successful');
        this.storeAuthData(response);
        return response;
      } else if (typeof response === 'string' && response.includes('OTP sent')) {
        console.log('📱 OTP required');
        return {
          requiresOTP: true,
          message: response,
          email: loginPayload.emailOrPhone,
          userType
        };
      }
      
      throw new Error('Unexpected login response format');
    } catch (error: any) {
      console.error('❌ AuthService: Login error:', error);
      throw new Error(error.response?.data || error.message || 'Login failed');
    }
  }

  private storeAuthData(authData: any): void {
    console.log('💾 AuthService: Storing auth data');
    
    if (authData.token) {
      const userToStore = {
        userId: authData.user?.id,
        id: authData.user?.id,
        email: authData.user?.email || authData.email,
        name: authData.user?.name,
        firstName: authData.user?.name,
        role: authData.user?.role,
        roles: authData.user?.role ? [authData.user.role] : authData.roles,
        isVerified: authData.user?.isVerified,
        type: authData.type
      };
      
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      console.log('✅ Auth data stored successfully');
    }
  }

  async verifyOtp(otpData: any): Promise<any> {
    try {
      const response = await api.post<any>('/auth/verify-otp', {
        emailOrPhone: otpData.email || otpData.emailOrPhone,
        otp: otpData.otp
      });
      
      if (response.token) {
        this.storeAuthData(response);
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data || error.message || 'OTP verification failed');
    }
  }

  async register(userData: any): Promise<any> {
    try {
      console.log('📝 AuthService: Attempting registration for:', userData.email);
      
      const userType = userData.userType || 'user';
      const endpoint = `/auth/${userType}/register`;
      
      console.log('📞 AuthService: Calling registration endpoint:', endpoint);
      
      const response = await api.post<any>(endpoint, userData);
      
      console.log('📥 AuthService: Registration response received:', response);
      
      if (response.token) {
        this.storeAuthData(response);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ AuthService: Registration error:', error);
      throw new Error(error.response?.data || error.message || 'Registration failed');
    }
  }

  async checkEmailRole(email: string): Promise<any> {
    try {
      return await api.post<any>('/auth/check-email-role', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to check email role');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed, continuing with local logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      console.log('🚑 AuthService: Sending forgot password OTP for:', email);
      
      const response = await api.post<any>('/auth/forgot-password', { email });
      
      console.log('✅ AuthService: Forgot password OTP sent:', response);
      return response;
    } catch (error: any) {
      console.error('❌ AuthService: Forgot password error:', error);
      throw new Error(error.response?.data || error.message || 'Failed to send forgot password OTP');
    }
  }

  async resetPassword(resetData: any): Promise<any> {
    try {
      console.log('🔑 AuthService: Resetting password for:', resetData.email);
      
      const response = await api.post<any>('/auth/reset-password', resetData);
      
      console.log('✅ AuthService: Password reset successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ AuthService: Password reset error:', error);
      throw new Error(error.response?.data || error.message || 'Failed to reset password');
    }
  }
}

export const authService = new AuthService();
