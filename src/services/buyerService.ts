import { API_CONFIG, apiRequest } from '@/config/api';

// ========== BUYER TYPES ==========
export interface CreateBuyerRequest {
  email: string;
  phone: string;
  businessName: string;
  contactPersonName: string;
  buyerType: 'BUSINESS' | 'INDIVIDUAL' | 'ENTERPRISE';
  businessType: 'RETAILER' | 'WHOLESALER' | 'DISTRIBUTOR' | 'MANUFACTURER';
  companySize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
}

export interface UpdateBuyerRequest {
  businessName?: string;
  contactPersonName?: string;
  buyerType?: 'BUSINESS' | 'INDIVIDUAL' | 'ENTERPRISE';
  companySize?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
}

export interface BuyerProfile {
  id: number;
  email: string;
  phone: string;
  businessName: string;
  contactPersonName: string;
  buyerType: string;
  businessType: string;
  companySize: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface BuyerSearchParams {
  searchTerm?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface BuyerFilterParams {
  buyerType?: string;
  status?: string;
  isVerified?: boolean;
  page?: number;
  size?: number;
}

export interface KycSubmissionRequest {
  documentType: 'PAN_CARD' | 'AADHAAR_CARD' | 'GST_CERTIFICATE' | 'BUSINESS_LICENSE';
  documentNumber: string;
  documentUrl: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetTokenRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface VerificationRequest {
  token?: string;
  otp?: string;
}

export interface UpdateKycStatusRequest {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export interface BulkStatusUpdateRequest {
  buyerIds: number[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  reason?: string;
}

export interface BulkNotificationRequest {
  buyerIds: number[];
  subject: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
}

export interface ExportBuyersRequest {
  buyerIds: number[];
  format: 'CSV' | 'EXCEL' | 'PDF';
}

// ========== BUYER SERVICE CLASS ==========
class BuyerService {
  
  // ========== CRUD OPERATIONS ==========
  
  /**
   * Create new buyer account
   */
  async createBuyer(buyerData: CreateBuyerRequest): Promise<BuyerProfile> {
    return apiRequest<BuyerProfile>(
      API_CONFIG.ENDPOINTS.BUYERS.BASE,
      {
        method: 'POST',
        body: JSON.stringify(buyerData)
      },
      true
    );
  }

  /**
   * Get buyer details by ID
   */
  async getBuyerById(id: number): Promise<BuyerProfile> {
    return apiRequest<BuyerProfile>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Update buyer information
   */
  async updateBuyer(id: number, updateData: UpdateBuyerRequest): Promise<BuyerProfile> {
    return apiRequest<BuyerProfile>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData)
      },
      true
    );
  }

  /**
   * Soft delete buyer account
   */
  async deleteBuyer(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Hard delete buyer account (permanent)
   */
  async hardDeleteBuyer(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/hard`,
      { method: 'DELETE' },
      true
    );
  }

  // ========== AUTHENTICATION ==========
  
  /**
   * Authenticate buyer with email and password
   */
  async authenticateBuyer(email: string, password: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/authenticate`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      },
      false
    );
  }

  /**
   * Update buyer password
   */
  async updatePassword(id: number, passwordData: UpdatePasswordRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/password`,
      {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      },
      true
    );
  }

  /**
   * Generate password reset token
   */
  async generatePasswordResetToken(request: PasswordResetTokenRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/password-reset/token`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
  }

  /**
   * Reset buyer password with token
   */
  async resetPassword(request: PasswordResetRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/password-reset`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      false
    );
  }

  // ========== VERIFICATION ==========
  
  /**
   * Send email verification
   */
  async sendEmailVerification(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/email/send`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Verify email with token
   */
  async verifyEmail(id: number, request: VerificationRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/email`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      true
    );
  }

  /**
   * Send phone verification OTP
   */
  async sendPhoneVerification(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/phone/send`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Verify phone with OTP
   */
  async verifyPhone(id: number, request: VerificationRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/phone`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      true
    );
  }

  /**
   * Submit KYC verification documents
   */
  async submitKyc(id: number, kycData: KycSubmissionRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/kyc`,
      {
        method: 'POST',
        body: JSON.stringify(kycData)
      },
      true
    );
  }

  /**
   * Update KYC verification status (Admin only)
   */
  async updateKycStatus(id: number, statusData: UpdateKycStatusRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verify/kyc/status`,
      {
        method: 'PUT',
        body: JSON.stringify(statusData)
      },
      true
    );
  }

  /**
   * Get buyer verification details
   */
  async getVerificationDetails(id: number): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/verification`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Upload verification document
   */
  async uploadVerificationDocument(id: number, documentData: KycSubmissionRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/documents`,
      {
        method: 'POST',
        body: JSON.stringify(documentData)
      },
      true
    );
  }

  // ========== STATUS MANAGEMENT ==========
  
  /**
   * Activate buyer account
   */
  async activateBuyer(id: number, reason?: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/activate`,
      {
        method: 'POST',
        body: JSON.stringify({ reason })
      },
      true
    );
  }

  /**
   * Deactivate buyer account
   */
  async deactivateBuyer(id: number, reason?: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/deactivate`,
      {
        method: 'POST',
        body: JSON.stringify({ reason })
      },
      true
    );
  }

  /**
   * Suspend buyer account temporarily
   */
  async suspendBuyer(id: number, reason: string, suspensionEndDate: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/suspend`,
      {
        method: 'POST',
        body: JSON.stringify({ reason, suspensionEndDate })
      },
      true
    );
  }

  // ========== SEARCH & FILTERING ==========
  
  /**
   * Get paginated list of all buyers
   */
  async getAllBuyers(params: BuyerSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Search buyers by name, email, or business name
   */
  async searchBuyers(params: BuyerSearchParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/search?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Filter buyers by various criteria
   */
  async filterBuyers(params: BuyerFilterParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.buyerType) queryParams.append('buyerType', params.buyerType);
    if (params.status) queryParams.append('status', params.status);
    if (params.isVerified !== undefined) queryParams.append('isVerified', params.isVerified.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/filter?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyers by status
   */
  async getBuyersByStatus(status: string, page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/status/${status}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyers by type
   */
  async getBuyersByType(type: string, page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/type/${type}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyers associated with a company
   */
  async getBuyersByCompany(companyId: number, page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/company/${companyId}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get all verified buyers
   */
  async getVerifiedBuyers(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/verified`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get premium buyers
   */
  async getPremiumBuyers(page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/premium?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  // ========== ANALYTICS & INSIGHTS ==========
  
  /**
   * Get buyer dashboard statistics
   */
  async getBuyerDashboardStats(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/dashboard`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer count grouped by status
   */
  async getBuyerCountByStatus(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/count/status`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer count grouped by type
   */
  async getBuyerCountByType(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/count/type`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer count grouped by verification status
   */
  async getBuyerCountByVerification(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/count/verification`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer count grouped by state
   */
  async getBuyerCountByState(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/count/state`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer registration statistics for date range
   */
  async getBuyerRegistrationStats(startDate: string, endDate: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/registration?startDate=${startDate}&endDate=${endDate}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get premium buyer statistics
   */
  async getPremiumBuyerStats(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/premium`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer engagement metrics
   */
  async getBuyerEngagementMetrics(): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/analytics/engagement`,
      { method: 'GET' },
      true
    );
  }

  // ========== INSIGHTS ==========
  
  /**
   * Get high value buyers based on order value
   */
  async getHighValueBuyers(minOrderValue = 50000): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/insights/high-value?minOrderValue=${minOrderValue}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get frequent buyers based on order count
   */
  async getFrequentBuyers(minOrders = 10, page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/insights/frequent?minOrders=${minOrders}&page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get inactive buyers for re-engagement campaigns
   */
  async getInactiveBuyers(daysSinceLastLogin = 30): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/insights/inactive?daysSinceLastLogin=${daysSinceLastLogin}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyers eligible for premium offers
   */
  async getBuyersEligibleForPremium(minOrderValue = 25000): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/insights/premium-eligible?minOrderValue=${minOrderValue}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyers with pending KYC verification
   */
  async getBuyersWithPendingKyc(daysSinceRegistration = 7): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/insights/pending-kyc?daysSinceRegistration=${daysSinceRegistration}`,
      { method: 'GET' },
      true
    );
  }

  // ========== VALIDATION ==========
  
  /**
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return apiRequest<{ available: boolean }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/check/email?email=${encodeURIComponent(email)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Check if phone number is available for registration
   */
  async checkPhoneAvailability(phone: string): Promise<{ available: boolean }> {
    return apiRequest<{ available: boolean }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/check/phone?phone=${encodeURIComponent(phone)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer summary information
   */
  async getBuyerSummary(id: number): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/summary`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Check if buyer is eligible for specific feature
   */
  async checkFeatureEligibility(id: number, feature: string): Promise<{ eligible: boolean }> {
    return apiRequest<{ eligible: boolean }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/${id}/features/${feature}/eligible`,
      { method: 'GET' },
      true
    );
  }

  // ========== BULK OPERATIONS ==========
  
  /**
   * Bulk update buyer status
   */
  async bulkUpdateStatus(request: BulkStatusUpdateRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/bulk/status`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      true
    );
  }

  /**
   * Send bulk notification to buyers
   */
  async bulkSendNotification(request: BulkNotificationRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/bulk/notification`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      true
    );
  }

  /**
   * Export buyer data in specified format
   */
  async exportBuyers(request: ExportBuyersRequest): Promise<Blob> {
    return apiRequest<Blob>(
      `${API_CONFIG.ENDPOINTS.BUYERS.BASE}/export`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      true
    );
  }
}

// Export singleton instance
export const buyerService = new BuyerService();

// Export the class for testing/advanced usage
export { BuyerService };

// Convenience exports for common use cases
export const {
  createBuyer,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
  getAllBuyers,
  searchBuyers,
  filterBuyers,
  activateBuyer,
  deactivateBuyer,
  submitKyc,
  verifyEmail,
  verifyPhone,
  getBuyerDashboardStats,
  checkEmailAvailability,
  checkPhoneAvailability
} = buyerService;
