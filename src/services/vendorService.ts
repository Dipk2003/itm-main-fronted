import { API_CONFIG, apiRequest } from '@/config/api';

// Vendor types
export interface VendorDto {
  id?: number;
  vendorName: string;
  businessName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  businessType?: string;
  establishedYear?: number;
  description?: string;
  website?: string;
  logoUrl?: string;
  gstNumber?: string;
  panNumber?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  kycStatus?: string;
  isActive?: boolean;
  rating?: number;
  totalProducts?: number;
  totalOrders?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorDto {
  vendorName: string;
  businessName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  businessType?: string;
  description?: string;
  website?: string;
}

export interface UpdateVendorDto {
  vendorName?: string;
  businessName?: string;
  phone?: string;
  address?: string;
  city?: string;
  businessType?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface VendorVerificationDto {
  vendorId: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  comments?: string;
}

export interface VendorSearchFilters {
  searchTerm?: string;
  city?: string;
  businessType?: string;
  verificationStatus?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface VendorsResponse {
  content: VendorDto[];
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

class VendorService {
  /**
   * Create new vendor
   */
  async createVendor(vendorData: CreateVendorDto): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      API_CONFIG.ENDPOINTS.VENDORS.BASE,
      {
        method: 'POST',
        body: JSON.stringify(vendorData)
      },
      true
    );
  }

  /**
   * Get vendor by ID
   */
  async getVendorById(vendorId: number | string): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.BASE}/${vendorId}`,
      { method: 'GET' }
    );
  }

  /**
   * Update vendor
   */
  async updateVendor(vendorId: number | string, vendorData: UpdateVendorDto): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.BASE}/${vendorId}`,
      {
        method: 'PUT',
        body: JSON.stringify(vendorData)
      },
      true
    );
  }

  /**
   * Delete vendor
   */
  async deleteVendor(vendorId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.VENDORS.BASE}/${vendorId}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Get all vendors with pagination
   */
  async getVendors(filters: VendorSearchFilters = {}): Promise<VendorsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.VENDORS.BASE}?${queryParams.toString()}`;
    return await apiRequest<VendorsResponse>(endpoint, { method: 'GET' });
  }

  /**
   * Search vendors
   */
  async searchVendors(filters: VendorSearchFilters): Promise<VendorsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<VendorsResponse>(
      `${API_CONFIG.ENDPOINTS.VENDORS.SEARCH}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Filter vendors
   */
  async filterVendors(filters: VendorSearchFilters): Promise<VendorsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<VendorsResponse>(
      `${API_CONFIG.ENDPOINTS.VENDORS.FILTER}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Verify vendor
   */
  async verifyVendor(verificationData: VendorVerificationDto): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      API_CONFIG.ENDPOINTS.VENDORS.VERIFY,
      {
        method: 'POST',
        body: JSON.stringify(verificationData)
      },
      true
    );
  }

  /**
   * Submit KYC documents
   */
  async submitKYC(vendorId: number | string, documentUrls: string[]): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.KYC}/${vendorId}/kyc`,
      {
        method: 'POST',
        body: JSON.stringify(documentUrls)
      },
      true
    );
  }

  /**
   * Get pending KYC vendors
   */
  async getPendingKYCVendors(page = 0, size = 20): Promise<VendorsResponse> {
    return await apiRequest<VendorsResponse>(
      `${API_CONFIG.ENDPOINTS.VENDORS.KYC_PENDING}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get pending approval vendors
   */
  async getPendingApprovalVendors(page = 0, size = 20): Promise<VendorsResponse> {
    return await apiRequest<VendorsResponse>(
      `${API_CONFIG.ENDPOINTS.VENDORS.APPROVAL_PENDING}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get vendors by status
   */
  async getVendorsByStatus(status: string, page = 0, size = 20): Promise<VendorsResponse> {
    return await apiRequest<VendorsResponse>(
      `${API_CONFIG.ENDPOINTS.VENDORS.BY_STATUS}/${status}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Update vendor status
   */
  async updateVendorStatus(vendorId: number | string, status: string, reason?: string): Promise<VendorDto> {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    if (reason) {
      queryParams.append('reason', reason);
    }

    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.UPDATE_STATUS}/${vendorId}/status?${queryParams.toString()}`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Activate vendor
   */
  async activateVendor(vendorId: number | string): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.ACTIVATE}/${vendorId}/activate`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Deactivate vendor
   */
  async deactivateVendor(vendorId: number | string): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.DEACTIVATE}/${vendorId}/deactivate`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Suspend vendor
   */
  async suspendVendor(vendorId: number | string, reason: string): Promise<VendorDto> {
    return await apiRequest<VendorDto>(
      `${API_CONFIG.ENDPOINTS.VENDORS.SUSPEND}/${vendorId}/suspend?reason=${encodeURIComponent(reason)}`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Get vendor dashboard data
   */
  async getVendorDashboard(vendorId: number | string): Promise<any> {
    return await apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.VENDORS.DASHBOARD}/${vendorId}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get vendor analytics
   */
  async getVendorAnalytics(vendorId: number | string): Promise<any> {
    return await apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.VENDORS.ANALYTICS}/${vendorId}`,
      { method: 'GET' },
      true
    );
  }
}

// Export singleton instance
export const vendorService = new VendorService();

// Export the class for testing/advanced usage
export { VendorService };

// Convenience exports
export const {
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendors,
  searchVendors,
  filterVendors,
  verifyVendor,
  submitKYC,
  getPendingKYCVendors,
  getPendingApprovalVendors,
  getVendorsByStatus,
  updateVendorStatus,
  activateVendor,
  deactivateVendor,
  suspendVendor,
  getVendorDashboard,
  getVendorAnalytics
} = vendorService;
