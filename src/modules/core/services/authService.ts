import { api } from '@/shared/utils/apiClient';
import { 
  LoginRequestDto, 
  RegisterRequestDto, 
  JwtResponse, 
  ForgotPasswordRequestDto, 
  VerifyOtpRequestDto, 
  SetPasswordDto,
  ApiResponse 
} from '@/shared/types/api';

export class AuthService {
  
  /**
   * Generic login method
   */
  async login(loginData: LoginRequestDto & { emailOrPhone?: string; userType?: string }): Promise<JwtResponse> {
    try {
      // Convert email to emailOrPhone for backend compatibility
      const loginPayload = {
        emailOrPhone: loginData.email || loginData.emailOrPhone,
        password: loginData.password,
      };
      
      // Use role-specific endpoint based on userType
      const userType = loginData.userType || 'user';
      const endpoint = `/auth/${userType}/login`;
      
      console.log('🚀 Attempting login at:', endpoint, 'with payload:', loginPayload);
      
      const response = await api.post<any>(endpoint, loginPayload);
      
      console.log('📥 Login response:', response.data);
      
      // Handle both direct login response and OTP required response
      if (response.data.token) {
        // Direct login successful
        console.log('✅ Direct login successful, storing auth data');
        this.storeAuthData(response.data);
        return response.data;
      } else if (typeof response.data === 'string' && response.data.includes('OTP sent')) {
        // OTP required - return special response
        console.log('📱 OTP required, returning OTP response');
        return {
          requiresOTP: true,
          message: response.data,
          email: loginPayload.emailOrPhone,
          userType
        } as any;
      }
      
      throw new Error('Unexpected login response format');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * User-specific login
   */
  async loginUser(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'user');
  }

  /**
   * Vendor-specific login
   */
  async loginVendor(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'vendor');
  }

  /**
   * Admin-specific login
   */
  async loginAdmin(loginData: LoginRequestDto): Promise<JwtResponse> {
    return this.roleSpecificLogin(loginData, 'admin');
  }

  /**
   * Role-specific login helper
   */
  private async roleSpecificLogin(loginData: LoginRequestDto, userType: 'user' | 'vendor' | 'admin'): Promise<JwtResponse> {
    try {
      const loginPayload = {
        emailOrPhone: loginData.email,
        password: loginData.password,
      };
      
      const endpoint = `/auth/${userType}/login`;
      const response = await api.post<any>(endpoint, loginPayload);
      
      // Handle both direct login response and OTP required response
      if (response.data.token) {
        // Direct login successful
        this.storeAuthData(response.data);
        return response.data;
      } else if (typeof response.data === 'string' && response.data.includes('OTP sent')) {
        // OTP required - return special response
        return {
          requiresOTP: true,
          message: response.data,
          email: loginPayload.emailOrPhone,
          userType
        } as any;
      }
      
      throw new Error('Unexpected login response');
    } catch (error: any) {
      console.error(`${userType} login error:`, error);
      throw new Error(error.response?.data || error.message || `${userType} login failed`);
    }
  }

  /**
   * Store authentication data
   */
  private storeAuthData(authData: JwtResponse): void {
    console.log('💾 Storing auth data:', authData);
    
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
      
      console.log('👤 User data being stored:', userToStore);
      
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      console.log('✅ Auth data stored successfully');
    } else {
      console.warn('⚠️ No token found in auth data, not storing');
    }
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterRequestDto): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/register`,
        registerData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Send forgot password OTP
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/forgot-password`,
        { email } as ForgotPasswordRequestDto
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP for forgot password
   */
  async verifyForgotPasswordOtp(otpData: VerifyOtpRequestDto): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/verify-forgot-password-otp`,
        otpData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  }

  /**
   * Set new password after OTP verification
   */
  async setPassword(passwordData: SetPasswordDto): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/set-password`,
        passwordData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Verify OTP after login (for password-less login)
   */
  async verifyOtp(otpData: VerifyOtpRequestDto): Promise<JwtResponse> {
    try {
      const response = await api.post<JwtResponse>(
        `/auth/verify-otp`,
        {
          emailOrPhone: otpData.email || otpData.emailOrPhone,
          otp: otpData.otp
        }
      );
      
      // Store auth data if verification successful
      if (response.data.token) {
        this.storeAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || error.message || 'OTP verification failed');
    }
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOtp(otpData: VerifyOtpRequestDto): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/verify-email-otp`,
        otpData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }

  /**
   * Resend email OTP
   */
  async resendEmailOtp(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/resend-email-otp`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get<any>(
        `/api/users/profile`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    console.log('🚪 Logout initiated');
    
    try {
      // Call backend logout endpoint (if exists)
      await api.post(`/auth/logout`);
      console.log('✅ Backend logout successful');
    } catch (error) {
      // Continue with local logout even if backend call fails
      console.warn('⚠️ Backend logout failed, continuing with local logout:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared');
      
      // Don't redirect automatically - let Redux handle it
      console.log('🔄 Logout completed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check email role
   */
  async checkEmailRole(email: string): Promise<{ exists: string; role: string; email?: string }> {
    try {
      const response = await api.post<any>(
        `/auth/check-email-role`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.response?.data || 'Failed to check email role');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(resetData: { email: string; newPassword: string; otp: string }): Promise<ApiResponse> {
    try {
      const response = await api.post<any>(
        `/auth/verify-forgot-password-otp`,
        {
          email: resetData.email,
          otp: resetData.otp,
          newPassword: resetData.newPassword
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
