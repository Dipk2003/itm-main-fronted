import { API_CONFIG, apiRequest } from '@/config/api';

// Types for Profile Management operations
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  profile?: UserProfileDetails;
}

export interface UserProfileDetails {
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: UserAddress;
  preferences?: UserPreferences;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  bio?: string;
  occupation?: string;
  company?: string;
}

export interface UserAddress {
  id?: number;
  type: 'HOME' | 'OFFICE' | 'BILLING' | 'SHIPPING';
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  promotionalOffers: boolean;
  language: string;
  currency: string;
  theme: 'LIGHT' | 'DARK' | 'AUTO';
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  BUYER = 'BUYER',
  EMPLOYEE = 'EMPLOYEE',
  SUPPORT = 'SUPPORT',
  CTO = 'CTO',
  DATA_ENTRY = 'DATA_ENTRY'
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profile?: Partial<UserProfileDetails>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FileUploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Profile Management Service Class
class ProfileServiceClass {
  /**
   * Get current user profile with extended details
   */
  async getMyProfile(): Promise<UserProfile> {
    console.log('👤 Fetching current user profile');
    try {
      const response = await apiRequest<UserProfile>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ User profile fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch user profile:', error);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  }

  /**
   * Update current user profile
   */
  async updateMyProfile(updateData: UpdateProfileRequest): Promise<UserProfile> {
    console.log('📝 Updating user profile');
    try {
      const response = await apiRequest<UserProfile>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE,
        {
          method: 'PUT',
          body: JSON.stringify(updateData)
        },
        true
      );
      console.log('✅ User profile updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update user profile:', error);
      throw new Error(error.message || 'Failed to update user profile');
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<FileUploadResponse> {
    console.log('📷 Uploading user avatar');
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiRequest<FileUploadResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/avatar`,
        {
          method: 'POST',
          body: formData
        },
        true
      );
      console.log('✅ Avatar uploaded successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to upload avatar:', error);
      throw new Error(error.message || 'Failed to upload avatar');
    }
  }

  /**
   * Delete profile avatar
   */
  async deleteAvatar(): Promise<{ success: boolean }> {
    console.log('🗑️ Deleting user avatar');
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/avatar`,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ Avatar deleted successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to delete avatar:', error);
      throw new Error(error.message || 'Failed to delete avatar');
    }
  }

  /**
   * Get user addresses
   */
  async getMyAddresses(): Promise<UserAddress[]> {
    console.log('🏠 Fetching user addresses');
    try {
      const response = await apiRequest<UserAddress[]>(
        API_CONFIG.ENDPOINTS.USERS.ADDRESSES,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ User addresses fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch user addresses:', error);
      throw new Error(error.message || 'Failed to fetch user addresses');
    }
  }

  /**
   * Add new address
   */
  async addAddress(address: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    console.log('➕ Adding new user address');
    try {
      const response = await apiRequest<UserAddress>(
        API_CONFIG.ENDPOINTS.USERS.ADDRESSES,
        {
          method: 'POST',
          body: JSON.stringify(address)
        },
        true
      );
      console.log('✅ Address added successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to add address:', error);
      throw new Error(error.message || 'Failed to add address');
    }
  }

  /**
   * Update address
   */
  async updateAddress(addressId: number, address: Partial<UserAddress>): Promise<UserAddress> {
    console.log('📝 Updating user address:', addressId);
    try {
      const response = await apiRequest<UserAddress>(
        `${API_CONFIG.ENDPOINTS.USERS.ADDRESSES}/${addressId}`,
        {
          method: 'PUT',
          body: JSON.stringify(address)
        },
        true
      );
      console.log('✅ Address updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update address:', error);
      throw new Error(error.message || 'Failed to update address');
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: number): Promise<{ success: boolean }> {
    console.log('🗑️ Deleting user address:', addressId);
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.ADDRESSES}/${addressId}`,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ Address deleted successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to delete address:', error);
      throw new Error(error.message || 'Failed to delete address');
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: number): Promise<UserAddress> {
    console.log('🏠 Setting default address:', addressId);
    try {
      const response = await apiRequest<UserAddress>(
        `${API_CONFIG.ENDPOINTS.USERS.ADDRESSES}/${addressId}/set-default`,
        {
          method: 'PUT'
        },
        true
      );
      console.log('✅ Default address set successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to set default address:', error);
      throw new Error(error.message || 'Failed to set default address');
    }
  }

  /**
   * Get user preferences
   */
  async getMyPreferences(): Promise<UserPreferences> {
    console.log('⚙️ Fetching user preferences');
    try {
      const response = await apiRequest<UserPreferences>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/preferences`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ User preferences fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch user preferences:', error);
      throw new Error(error.message || 'Failed to fetch user preferences');
    }
  }

  /**
   * Update user preferences
   */
  async updateMyPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    console.log('⚙️ Updating user preferences');
    try {
      const response = await apiRequest<UserPreferences>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/preferences`,
        {
          method: 'PUT',
          body: JSON.stringify(preferences)
        },
        true
      );
      console.log('✅ User preferences updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update user preferences:', error);
      throw new Error(error.message || 'Failed to update user preferences');
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ success: boolean }> {
    console.log('🔒 Changing user password');
    try {
      const response = await apiRequest<{ success: boolean }>(
        API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          method: 'PUT',
          body: JSON.stringify(passwordData)
        },
        true
      );
      console.log('✅ Password changed successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to change password:', error);
      throw new Error(error.message || 'Failed to change password');
    }
  }

  /**
   * Deactivate own account
   */
  async deactivateMyAccount(reason?: string): Promise<{ success: boolean }> {
    console.log('❌ Deactivating own account');
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/deactivate`,
        {
          method: 'PUT',
          body: JSON.stringify({ reason })
        },
        true
      );
      console.log('✅ Account deactivated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to deactivate account:', error);
      throw new Error(error.message || 'Failed to deactivate account');
    }
  }

  /**
   * Delete own account permanently
   */
  async deleteMyAccount(password: string): Promise<{ success: boolean }> {
    console.log('🗑️ Deleting own account permanently');
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/delete`,
        {
          method: 'DELETE',
          body: JSON.stringify({ password })
        },
        true
      );
      console.log('✅ Account deleted successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to delete account:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
  }

  /**
   * Get personal activity log
   */
  async getMyActivityLog(page: number = 1, limit: number = 20): Promise<{
    activities: Array<{
      id: number;
      action: string;
      description: string;
      ipAddress?: string;
      userAgent?: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    console.log('📊 Fetching personal activity log');
    try {
      const response = await apiRequest<{
        activities: Array<{
          id: number;
          action: string;
          description: string;
          ipAddress?: string;
          userAgent?: string;
          createdAt: string;
        }>;
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/activity?page=${page}&limit=${limit}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Activity log fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch activity log:', error);
      throw new Error(error.message || 'Failed to fetch activity log');
    }
  }

  /**
   * Get personal dashboard stats
   */
  async getMyDashboardStats(): Promise<{
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    recentOrdersCount: number;
    wishlistCount: number;
    cartItemsCount: number;
    supportTicketsCount: number;
  }> {
    console.log('📊 Fetching personal dashboard statistics');
    try {
      const response = await apiRequest<{
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalSpent: number;
        recentOrdersCount: number;
        wishlistCount: number;
        cartItemsCount: number;
        supportTicketsCount: number;
      }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/dashboard-stats`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Dashboard stats fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch dashboard stats:', error);
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
  }

  /**
   * Export personal data (GDPR compliance)
   */
  async exportMyData(): Promise<{ 
    downloadUrl: string; 
    expiresAt: string; 
  }> {
    console.log('📦 Requesting personal data export');
    try {
      const response = await apiRequest<{ 
        downloadUrl: string; 
        expiresAt: string; 
      }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/export-data`,
        {
          method: 'POST'
        },
        true
      );
      console.log('✅ Personal data export requested successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to request personal data export:', error);
      throw new Error(error.message || 'Failed to request personal data export');
    }
  }

  /**
   * Request email verification
   */
  async requestEmailVerification(): Promise<{ success: boolean; message: string }> {
    console.log('📧 Requesting email verification');
    try {
      const response = await apiRequest<{ success: boolean; message: string }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/verify-email`,
        {
          method: 'POST'
        },
        true
      );
      console.log('✅ Email verification requested successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to request email verification:', error);
      throw new Error(error.message || 'Failed to request email verification');
    }
  }

  /**
   * Request phone verification
   */
  async requestPhoneVerification(): Promise<{ success: boolean; message: string }> {
    console.log('📱 Requesting phone verification');
    try {
      const response = await apiRequest<{ success: boolean; message: string }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/verify-phone`,
        {
          method: 'POST'
        },
        true
      );
      console.log('✅ Phone verification requested successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to request phone verification:', error);
      throw new Error(error.message || 'Failed to request phone verification');
    }
  }

  /**
   * Verify phone with OTP
   */
  async verifyPhone(otp: string): Promise<{ success: boolean; message: string }> {
    console.log('📱 Verifying phone with OTP');
    try {
      const response = await apiRequest<{ success: boolean; message: string }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/verify-phone`,
        {
          method: 'PUT',
          body: JSON.stringify({ otp })
        },
        true
      );
      console.log('✅ Phone verified successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to verify phone:', error);
      throw new Error(error.message || 'Failed to verify phone');
    }
  }

  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<{
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    passwordLastChanged: string;
    activeSessions: number;
  }> {
    console.log('🔒 Fetching security settings');
    try {
      const response = await apiRequest<{
        twoFactorEnabled: boolean;
        loginNotifications: boolean;
        passwordLastChanged: string;
        activeSessions: number;
      }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/security`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Security settings fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch security settings:', error);
      throw new Error(error.message || 'Failed to fetch security settings');
    }
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: {
    twoFactorEnabled?: boolean;
    loginNotifications?: boolean;
  }): Promise<{ success: boolean }> {
    console.log('🔒 Updating security settings');
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/security`,
        {
          method: 'PUT',
          body: JSON.stringify(settings)
        },
        true
      );
      console.log('✅ Security settings updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update security settings:', error);
      throw new Error(error.message || 'Failed to update security settings');
    }
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<Array<{
    id: string;
    deviceInfo: string;
    location?: string;
    ipAddress: string;
    lastActivity: string;
    isCurrent: boolean;
  }>> {
    console.log('📱 Fetching active sessions');
    try {
      const response = await apiRequest<Array<{
        id: string;
        deviceInfo: string;
        location?: string;
        ipAddress: string;
        lastActivity: string;
        isCurrent: boolean;
      }>>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/sessions`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Active sessions fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch active sessions:', error);
      throw new Error(error.message || 'Failed to fetch active sessions');
    }
  }

  /**
   * Revoke session
   */
  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    console.log('🚫 Revoking session:', sessionId);
    try {
      const response = await apiRequest<{ success: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/sessions/${sessionId}`,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ Session revoked successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to revoke session:', error);
      throw new Error(error.message || 'Failed to revoke session');
    }
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllOtherSessions(): Promise<{ success: boolean; revokedCount: number }> {
    console.log('🚫 Revoking all other sessions');
    try {
      const response = await apiRequest<{ success: boolean; revokedCount: number }>(
        `${API_CONFIG.ENDPOINTS.USERS.PROFILE}/sessions/revoke-all`,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ All other sessions revoked successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to revoke all other sessions:', error);
      throw new Error(error.message || 'Failed to revoke all other sessions');
    }
  }
}

// Export singleton instance
export const profileService = new ProfileServiceClass();

// Export the class for testing/advanced usage
export { ProfileServiceClass };

// Convenience exports
export const {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  deleteAvatar,
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getMyPreferences,
  updateMyPreferences,
  changePassword,
  deactivateMyAccount,
  deleteMyAccount,
  getMyActivityLog,
  getMyDashboardStats,
  exportMyData,
  requestEmailVerification,
  requestPhoneVerification,
  verifyPhone,
  getSecuritySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions
} = profileService;
