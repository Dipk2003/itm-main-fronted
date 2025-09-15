import { API_CONFIG, apiRequest } from '@/config/api';

// ========== ANALYTICS SERVICE ==========
export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  metrics?: string[];
}

class AnalyticsService {
  /**
   * Get dashboard analytics
   */
  async getDashboardAnalytics(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin analytics
   */
  async getAdminAnalytics(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.ADMIN,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get vendor analytics
   */
  async getVendorAnalytics(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.VENDOR,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get buyer analytics
   */
  async getBuyerAnalytics(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.BUYER,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.CATEGORY_STATS,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin dashboard analytics
   */
  async getAdminDashboard(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.ADMIN_DASHBOARD,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin growth analytics
   */
  async getAdminGrowth(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.ADMIN_GROWTH,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin revenue analytics
   */
  async getAdminRevenue(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ANALYTICS.ADMIN_REVENUE,
      { method: 'GET' },
      true
    );
  }
}

// ========== ADMIN SERVICE ==========
export interface AdminSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

class AdminService {
  /**
   * Get all admins
   */
  async getAllAdmins(params: AdminSearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.ADMINS.BASE}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin by email
   */
  async getAdminByEmail(email: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.ADMINS.BY_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admin by phone
   */
  async getAdminByPhone(phone: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.ADMINS.BY_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get active admins
   */
  async getActiveAdmins(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ADMINS.ACTIVE,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get inactive admins
   */
  async getInactiveAdmins(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ADMINS.INACTIVE,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get verified admins
   */
  async getVerifiedAdmins(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ADMINS.VERIFIED,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get unverified admins
   */
  async getUnverifiedAdmins(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.ADMINS.UNVERIFIED,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get admins by department
   */
  async getAdminsByDepartment(department: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.ADMINS.BY_DEPARTMENT}/${department}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Activate admin
   */
  async activateAdmin(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMINS.ACTIVATE}/${id}/activate`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Deactivate admin
   */
  async deactivateAdmin(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMINS.DEACTIVATE}/${id}/deactivate`,
      { method: 'POST' },
      true
    );
  }

  /**
   * Get admin count
   */
  async getAdminCount(): Promise<{ count: number }> {
    return apiRequest<{ count: number }>(
      API_CONFIG.ENDPOINTS.ADMINS.COUNT,
      { method: 'GET' },
      true
    );
  }

  /**
   * Check if admin email exists
   */
  async checkAdminEmailExists(email: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>(
      `${API_CONFIG.ENDPOINTS.ADMINS.EXISTS_EMAIL}/${encodeURIComponent(email)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Check if admin phone exists
   */
  async checkAdminPhoneExists(phone: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>(
      `${API_CONFIG.ENDPOINTS.ADMINS.EXISTS_PHONE}/${encodeURIComponent(phone)}`,
      { method: 'GET' },
      true
    );
  }
}

// ========== FILE MANAGEMENT SERVICE ==========
export interface FileUploadRequest {
  file: File;
  category?: string;
  description?: string;
}

class FileService {
  /**
   * Upload file
   */
  async uploadFile(uploadData: FileUploadRequest): Promise<{ url: string; fileId: string }> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    if (uploadData.category) formData.append('category', uploadData.category);
    if (uploadData.description) formData.append('description', uploadData.description);

    return apiRequest<{ url: string; fileId: string }>(
      API_CONFIG.ENDPOINTS.FILES.UPLOAD,
      {
        method: 'POST',
        body: formData,
        headers: {} // Don't set Content-Type for FormData
      },
      true
    );
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.FILES.DELETE}/${fileId}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob> {
    return apiRequest<Blob>(
      `${API_CONFIG.ENDPOINTS.FILES.DOWNLOAD}/${fileId}`,
      { method: 'GET' },
      true
    );
  }
}

// ========== SUPPORT SERVICE ==========
export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
}

export interface UpdateTicketRequest {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  response?: string;
}

class SupportService {
  /**
   * Create support ticket
   */
  async createTicket(ticketData: CreateTicketRequest): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.SUPPORT.TICKETS,
      {
        method: 'POST',
        body: JSON.stringify(ticketData)
      },
      true
    );
  }

  /**
   * Get support tickets
   */
  async getTickets(page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.SUPPORT.TICKETS}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Update support ticket
   */
  async updateTicket(ticketId: string, updateData: UpdateTicketRequest): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.SUPPORT.TICKETS}/${ticketId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData)
      },
      true
    );
  }

  /**
   * Get chat messages
   */
  async getChatMessages(chatId: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.SUPPORT.CHAT}/${chatId}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Send chat message
   */
  async sendChatMessage(chatId: string, message: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.SUPPORT.CHAT}/${chatId}/message`,
      {
        method: 'POST',
        body: JSON.stringify({ message })
      },
      true
    );
  }

  /**
   * Get chatbot response
   */
  async getChatbotResponse(query: string): Promise<{ response: string }> {
    return apiRequest<{ response: string }>(
      API_CONFIG.ENDPOINTS.SUPPORT.CHATBOT,
      {
        method: 'POST',
        body: JSON.stringify({ query })
      },
      false
    );
  }

  /**
   * Search knowledge base
   */
  async searchKnowledgeBase(query: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.SUPPORT.KNOWLEDGE_BASE}/search?q=${encodeURIComponent(query)}`,
      { method: 'GET' },
      false
    );
  }
}

// ========== CONTENT MANAGEMENT SERVICE ==========
export interface CreateBannerRequest {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  position?: string;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience?: string;
  isActive?: boolean;
}

class ContentService {
  /**
   * Get all banners
   */
  async getBanners(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.BANNERS,
      { method: 'GET' },
      false
    );
  }

  /**
   * Create banner
   */
  async createBanner(bannerData: CreateBannerRequest): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.BANNERS,
      {
        method: 'POST',
        body: JSON.stringify(bannerData)
      },
      true
    );
  }

  /**
   * Get SEO keywords
   */
  async getSeoKeywords(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.SEO_KEYWORDS,
      { method: 'GET' },
      false
    );
  }

  /**
   * Get campaigns
   */
  async getCampaigns(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.CAMPAIGNS,
      { method: 'GET' },
      true
    );
  }

  /**
   * Create campaign
   */
  async createCampaign(campaignData: CreateCampaignRequest): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.CAMPAIGNS,
      {
        method: 'POST',
        body: JSON.stringify(campaignData)
      },
      true
    );
  }

  /**
   * Get coupons
   */
  async getCoupons(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CONTENT.COUPONS,
      { method: 'GET' },
      true
    );
  }

  /**
   * Validate coupon
   */
  async validateCoupon(couponCode: string): Promise<{ valid: boolean; discount?: number; message?: string }> {
    return apiRequest<{ valid: boolean; discount?: number; message?: string }>(
      `${API_CONFIG.ENDPOINTS.CONTENT.VALIDATE_COUPON}/${couponCode}`,
      { method: 'GET' },
      false
    );
  }
}

// ========== LEAD MANAGEMENT SERVICE ==========
export interface CreateLeadRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productInterest: string;
  message?: string;
  source?: string;
}

export interface UpdateLeadRequest {
  status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
  assignedTo?: string;
}

class LeadService {
  /**
   * Get leads for vendor
   */
  async getVendorLeads(vendorId: string, page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.BY_VENDOR}/${vendorId}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get leads by status for vendor
   */
  async getVendorLeadsByStatus(vendorId: string, status: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.BY_VENDOR_STATUS}/${vendorId}/status/${status}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get leads by priority for vendor
   */
  async getVendorLeadsByPriority(vendorId: string, priority: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.BY_VENDOR_PRIORITY}/${vendorId}/priority/${priority}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: string, status: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.UPDATE_STATUS}/${leadId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status })
      },
      true
    );
  }

  /**
   * Update lead priority
   */
  async updateLeadPriority(leadId: string, priority: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.UPDATE_PRIORITY}/${leadId}/priority`,
      {
        method: 'PUT',
        body: JSON.stringify({ priority })
      },
      true
    );
  }

  /**
   * Add notes to lead
   */
  async addLeadNotes(leadId: string, notes: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.ADD_NOTES}/${leadId}/notes`,
      {
        method: 'POST',
        body: JSON.stringify({ notes })
      },
      true
    );
  }

  /**
   * Get overdue leads for vendor
   */
  async getOverdueLeads(vendorId: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.OVERDUE}/${vendorId}/overdue`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get recent leads for vendor
   */
  async getRecentLeads(vendorId: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.RECENT}/${vendorId}/recent`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get lead statistics for vendor
   */
  async getLeadStats(vendorId: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.STATS}/${vendorId}/stats`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Search leads for vendor
   */
  async searchVendorLeads(vendorId: string, searchTerm: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.LEADS.SEARCH}/${vendorId}/search?q=${encodeURIComponent(searchTerm)}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get duplicate leads
   */
  async getDuplicateLeads(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.LEADS.DUPLICATES,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get lead statuses
   */
  async getLeadStatuses(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.LEADS.STATUSES,
      { method: 'GET' },
      false
    );
  }

  /**
   * Get lead priorities
   */
  async getLeadPriorities(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.LEADS.PRIORITIES,
      { method: 'GET' },
      false
    );
  }
}

// ========== CHATBOT ANALYTICS SERVICE ==========
class ChatbotService {
  /**
   * Get chatbot analytics
   */
  async getChatbotAnalytics(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CHATBOT.ANALYTICS,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get chatbot conversations
   */
  async getChatbotConversations(page = 0, size = 20): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.CHATBOT.CONVERSATIONS}?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get specific conversation
   */
  async getChatbotConversation(conversationId: string): Promise<any> {
    return apiRequest<any>(
      `${API_CONFIG.ENDPOINTS.CHATBOT.CONVERSATION}/${conversationId}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Get recent queries
   */
  async getRecentQueries(): Promise<any> {
    return apiRequest<any>(
      API_CONFIG.ENDPOINTS.CHATBOT.RECENT_QUERIES,
      { method: 'GET' },
      true
    );
  }
}

// Export service instances
export const analyticsService = new AnalyticsService();
export const adminService = new AdminService();
export const fileService = new FileService();
export const supportService = new SupportService();
export const contentService = new ContentService();
export const leadService = new LeadService();
export const chatbotService = new ChatbotService();

// Export service classes for testing/advanced usage
export {
  AnalyticsService,
  AdminService,
  FileService,
  SupportService,
  ContentService,
  LeadService,
  ChatbotService
};
