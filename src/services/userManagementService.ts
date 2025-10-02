import { API_CONFIG, apiRequest } from '@/config/api';

// ========== USER MANAGEMENT TYPES ==========
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_VENDOR' | 'ROLE_SUPPORT' | 'ROLE_CTO' | 'ROLE_DATA_ENTRY';
  userType: 'user' | 'admin' | 'vendor' | 'support' | 'cto' | 'data-entry';
  active: boolean;
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  address?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export interface UserSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface UserCountResponse {
  count: number;
}

// ========== USER MANAGEMENT SERVICE CLASS ==========
class UserManagementService {
  
  // ========== BASIC USER OPERATIONS ==========
  
  /**
   * Get all users (admin only)
   */
  async getAllUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get users by specific role
   */
  async getUsersByRole(role: string, params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ROLE}/${role}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ID}/${id}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get user by phone number
   */
  async getUserByPhone(phone: string): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' },
      true
    );
  }

  // ========== USER FILTERING ==========
  
  /**
   * Get all verified users
   */
  async getVerifiedUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.VERIFIED}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get all unverified users
   */
  async getUnverifiedUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.UNVERIFIED}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get all active users
   */
  async getActiveUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.ACTIVE}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get all inactive users
   */
  async getInactiveUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.INACTIVE}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get all regular users (ROLE_USER)
   */
  async getRegularUsers(params: UserSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.USERS.REGULAR}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  // ========== USER MANAGEMENT OPERATIONS ==========
  
  /**
   * Update user information
   */
  async updateUser(id: number, updateData: UpdateUserRequest): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ID}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData)
      },
      true
    );
  }

  /**
   * Delete user account
   */
  async deleteUser(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ID}/${id}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Activate user account
   */
  async activateUser(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.ACTIVATE}/${id}/activate`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.DEACTIVATE}/${id}/deactivate`,
      { method: 'PATCH' },
      true
    );
  }

  // ========== USER STATISTICS ==========
  
  /**
   * Get total user count
   */
  async getUserCount(): Promise<UserCountResponse> {
    return apiRequest<UserCountResponse>(
      API_CONFIG.ENDPOINTS.USERS.COUNT,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get user count by specific role
   */
  async getUserCountByRole(role: string): Promise<UserCountResponse> {
    return apiRequest<UserCountResponse>(
      `${API_CONFIG.ENDPOINTS.USERS.COUNT_BY_ROLE}/${role}`,
      { method: 'GET' },
      true
    );
  }

  // ========== USER VALIDATION ==========
  
  /**
   * Check if email exists in system
   */
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>(
      `${API_CONFIG.ENDPOINTS.USERS.EXISTS_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Check if phone number exists in system
   */
  async checkPhoneExists(phone: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>(
      `${API_CONFIG.ENDPOINTS.USERS.EXISTS_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' },
      true
    );
  }
}

// Export singleton instance
export const userManagementService = new UserManagementService();

// Export the class for testing/advanced usage
export { UserManagementService };

// Convenience exports for common use cases
export const {
  getAllUsers,
  getUsersByRole,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  getVerifiedUsers,
  getUnverifiedUsers,
  getActiveUsers,
  getInactiveUsers,
  getRegularUsers,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUserCount,
  getUserCountByRole,
  checkEmailExists,
  checkPhoneExists
} = userManagementService;
