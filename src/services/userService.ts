import { API_CONFIG, apiRequest } from '@/config/api';

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  profileImageUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImageUrl?: string;
}

export interface UserSearchFilters {
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface UsersResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  first: boolean;
  last: boolean;
}

class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(filters: UserSearchFilters = {}): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.USERS.BASE}?${queryParams.toString()}`;
    return await apiRequest<UsersResponse>(endpoint, { method: 'GET' }, true);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string, page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ROLE}/${role}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number | string): Promise<User> {
    return await apiRequest<User>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_ID}/${userId}`,
      { method: 'GET' }
    );
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    return await apiRequest<User>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' }
    );
  }

  /**
   * Get user by phone
   */
  async getUserByPhone(phone: string): Promise<User> {
    return await apiRequest<User>(
      `${API_CONFIG.ENDPOINTS.USERS.BY_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' }
    );
  }

  /**
   * Get verified users
   */
  async getVerifiedUsers(page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.VERIFIED}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get unverified users
   */
  async getUnverifiedUsers(page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.UNVERIFIED}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get active users
   */
  async getActiveUsers(page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.ACTIVE}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get inactive users
   */
  async getInactiveUsers(page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.INACTIVE}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Update user
   */
  async updateUser(userId: number | string, userData: UpdateUserDto): Promise<User> {
    return await apiRequest<User>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(userData)
      },
      true
    );
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: number | string): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Activate user
   */
  async activateUser(userId: number | string): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.ACTIVATE}/${userId}/activate`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: number | string): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.DEACTIVATE}/${userId}/deactivate`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Get user count
   */
  async getUserCount(): Promise<number> {
    return await apiRequest<number>(
      API_CONFIG.ENDPOINTS.USERS.COUNT,
      { method: 'GET' }
    );
  }

  /**
   * Get user count by role
   */
  async getUserCountByRole(role: string): Promise<number> {
    return await apiRequest<number>(
      `${API_CONFIG.ENDPOINTS.USERS.COUNT_BY_ROLE}/${role}`,
      { method: 'GET' }
    );
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return await apiRequest<boolean>(
      `${API_CONFIG.ENDPOINTS.USERS.EXISTS_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' }
    );
  }

  /**
   * Check if phone exists
   */
  async phoneExists(phone: string): Promise<boolean> {
    return await apiRequest<boolean>(
      `${API_CONFIG.ENDPOINTS.USERS.EXISTS_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' }
    );
  }

  /**
   * Get regular users (non-admin)
   */
  async getRegularUsers(page = 0, size = 20): Promise<User[]> {
    return await apiRequest<User[]>(
      `${API_CONFIG.ENDPOINTS.USERS.REGULAR}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<User> {
    return await apiRequest<User>(
      '/api/auth/profile',
      { method: 'GET' },
      true
    );
  }

  /**
   * Update current user profile
   */
  async updateCurrentUserProfile(userData: UpdateUserDto): Promise<User> {
    return await apiRequest<User>(
      '/api/auth/profile',
      {
        method: 'PUT',
        body: JSON.stringify(userData)
      },
      true
    );
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(userId: number | string, imageFile: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await apiRequest<{ imageUrl: string }>(
      `/api/users/${userId}/profile-image`,
      {
        method: 'POST',
        body: formData,
        // Remove Content-Type header to let browser set it with boundary for FormData
        headers: {}
      },
      true
    );
  }

  /**
   * Search users
   */
  async searchUsers(searchTerm: string, filters: UserSearchFilters = {}): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('search', searchTerm);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'search') {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<UsersResponse>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/search?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }
}

// Export singleton instance
export const userService = new UserService();

// Export the class for testing/advanced usage
export { UserService };

// Convenience exports
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
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUserCount,
  getUserCountByRole,
  emailExists,
  phoneExists,
  getRegularUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  uploadProfileImage,
  searchUsers
} = userService;
