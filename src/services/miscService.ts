import { API_CONFIG, apiRequest } from '@/config/api';

// Types for Miscellaneous operations
export interface FileUploadResponse {
  id: string;
  url: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface BulkFileUploadResponse {
  uploadedFiles: FileUploadResponse[];
  failedFiles: Array<{
    fileName: string;
    error: string;
  }>;
  totalFiles: number;
  successCount: number;
  failureCount: number;
}

export interface FileUploadOptions {
  isPublic?: boolean;
  folder?: string;
  tags?: string[];
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // mime types
}

export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  database: {
    status: 'UP' | 'DOWN';
    responseTime?: number;
  };
  cache: {
    status: 'UP' | 'DOWN';
    responseTime?: number;
  };
  external: {
    paymentGateway?: 'UP' | 'DOWN';
    emailService?: 'UP' | 'DOWN';
    smsService?: 'UP' | 'DOWN';
  };
  uptime: number;
  version: string;
  timestamp: string;
}

export interface SystemStats {
  totalUsers: number;
  totalVendors: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  activeUsers: number;
  onlineUsers: number;
  systemUptime: number;
  serverLoad: {
    cpu: number;
    memory: number;
    disk: number;
  };
  databaseStats: {
    connections: number;
    size: number;
    performance: number;
  };
}

export interface NotificationRequest {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  recipients?: number[]; // user IDs
  roles?: string[]; // send to all users with these roles
  immediate?: boolean;
  scheduledFor?: string; // ISO date string
  expiresAt?: string; // ISO date string
}

export interface PushNotificationRequest {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, any>;
  recipients?: number[];
  roles?: string[];
}

export interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    contentType: string;
  }>;
  templateId?: string;
  templateData?: Record<string, any>;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  scheduledFor?: string;
}

export interface SMSRequest {
  to: string | string[];
  message: string;
  templateId?: string;
  templateData?: Record<string, any>;
  scheduledFor?: string;
}

// Miscellaneous Service Class
class MiscServiceClass {
  /**
   * Upload single file
   */
  async uploadFile(
    file: File, 
    options: FileUploadOptions = {}
  ): Promise<FileUploadResponse> {
    console.log('📎 Uploading file:', file.name);
    
    // Validate file size if specified
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size ${options.maxSize}`);
    }

    // Validate file type if specified
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add options to form data
      if (options.isPublic !== undefined) {
        formData.append('isPublic', options.isPublic.toString());
      }
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', JSON.stringify(options.tags));
      }

      const endpoint = API_CONFIG.ENDPOINTS.FILES?.UPLOAD 
        || '/api/files/upload';

      const response = await apiRequest<FileUploadResponse>(
        endpoint,
        {
          method: 'POST',
          body: formData
        },
        true
      );
      console.log('✅ File uploaded successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to upload file:', error);
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[], 
    options: FileUploadOptions = {}
  ): Promise<BulkFileUploadResponse> {
    console.log(`📎 Uploading ${files.length} files`);
    try {
      const formData = new FormData();
      
      // Append all files
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      // Add options to form data
      if (options.isPublic !== undefined) {
        formData.append('isPublic', options.isPublic.toString());
      }
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', JSON.stringify(options.tags));
      }

      const endpoint = '/api/files/bulk-upload';

      const response = await apiRequest<BulkFileUploadResponse>(
        endpoint,
        {
          method: 'POST',
          body: formData
        },
        true
      );
      console.log(`✅ Files uploaded: ${response.successCount}/${response.totalFiles}`);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to upload files:', error);
      throw new Error(error.message || 'Failed to upload files');
    }
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(fileId: string): Promise<{ success: boolean }> {
    console.log('🗑️ Deleting file:', fileId);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.FILES?.DELETE 
        || `/api/files/${fileId}`;

      const response = await apiRequest<{ success: boolean }>(
        endpoint,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ File deleted successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to delete file:', error);
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  /**
   * Get file metadata
   */
  async getFileInfo(fileId: string): Promise<FileUploadResponse> {
    console.log('🔍 Getting file info:', fileId);
    try {
      const endpoint = `/api/files/${fileId}/info`;

      const response = await apiRequest<FileUploadResponse>(
        endpoint,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ File info retrieved successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get file info:', error);
      throw new Error(error.message || 'Failed to get file info');
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    console.log('🏥 Checking system health');
    try {
      const endpoint = API_CONFIG.ENDPOINTS.HEALTH || '/api/system/health';

      const response = await apiRequest<SystemHealth>(
        endpoint,
        {
          method: 'GET'
        },
        false // Health check doesn't require auth
      );
      console.log('✅ System health retrieved successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get system health:', error);
      throw new Error(error.message || 'Failed to get system health');
    }
  }

  /**
   * Get system statistics (Admin only)
   */
  async getSystemStats(): Promise<SystemStats> {
    console.log('📊 Fetching system statistics');
    try {
      const endpoint = '/api/admin/system-stats';

      const response = await apiRequest<SystemStats>(
        endpoint,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ System statistics retrieved successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get system statistics:', error);
      throw new Error(error.message || 'Failed to get system statistics');
    }
  }

  /**
   * Send notification
   */
  async sendNotification(notificationData: NotificationRequest): Promise<{
    id: string;
    status: 'SENT' | 'SCHEDULED' | 'FAILED';
    recipientCount: number;
    sentAt?: string;
    scheduledFor?: string;
  }> {
    console.log('🔔 Sending notification:', notificationData.title);
    try {
      const endpoint = '/api/notifications/send';

      const response = await apiRequest<{
        id: string;
        status: 'SENT' | 'SCHEDULED' | 'FAILED';
        recipientCount: number;
        sentAt?: string;
        scheduledFor?: string;
      }>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(notificationData)
        },
        true
      );
      console.log('✅ Notification sent successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to send notification:', error);
      throw new Error(error.message || 'Failed to send notification');
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(pushData: PushNotificationRequest): Promise<{
    success: boolean;
    sentCount: number;
    failedCount: number;
  }> {
    console.log('📱 Sending push notification:', pushData.title);
    try {
      const endpoint = '/api/notifications/push';

      const response = await apiRequest<{
        success: boolean;
        sentCount: number;
        failedCount: number;
      }>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(pushData)
        },
        true
      );
      console.log('✅ Push notification sent successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to send push notification:', error);
      throw new Error(error.message || 'Failed to send push notification');
    }
  }

  /**
   * Send email
   */
  async sendEmail(emailData: EmailRequest): Promise<{
    messageId: string;
    status: 'SENT' | 'SCHEDULED' | 'FAILED';
    sentAt?: string;
    scheduledFor?: string;
  }> {
    console.log('📧 Sending email:', emailData.subject);
    try {
      const endpoint = '/api/communications/email';

      const response = await apiRequest<{
        messageId: string;
        status: 'SENT' | 'SCHEDULED' | 'FAILED';
        sentAt?: string;
        scheduledFor?: string;
      }>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(emailData)
        },
        true
      );
      console.log('✅ Email sent successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      throw new Error(error.message || 'Failed to send email');
    }
  }

  /**
   * Send SMS
   */
  async sendSMS(smsData: SMSRequest): Promise<{
    messageId: string;
    status: 'SENT' | 'SCHEDULED' | 'FAILED';
    sentAt?: string;
    scheduledFor?: string;
  }> {
    console.log('📱 Sending SMS');
    try {
      const endpoint = '/api/communications/sms';

      const response = await apiRequest<{
        messageId: string;
        status: 'SENT' | 'SCHEDULED' | 'FAILED';
        sentAt?: string;
        scheduledFor?: string;
      }>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(smsData)
        },
        true
      );
      console.log('✅ SMS sent successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to send SMS:', error);
      throw new Error(error.message || 'Failed to send SMS');
    }
  }

  /**
   * Get application configuration/settings
   */
  async getAppConfig(): Promise<{
    siteName: string;
    siteDescription: string;
    logoUrl?: string;
    faviconUrl?: string;
    supportEmail: string;
    supportPhone?: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    features: {
      registration: boolean;
      guestCheckout: boolean;
      multiVendor: boolean;
      reviews: boolean;
      wishlist: boolean;
      coupons: boolean;
    };
    paymentMethods: string[];
    shippingMethods: string[];
    currencies: string[];
    languages: string[];
    timezone: string;
    maintenanceMode: boolean;
    version: string;
  }> {
    console.log('⚙️ Fetching application configuration');
    try {
      const endpoint = '/api/config';

      const response = await apiRequest<{
        siteName: string;
        siteDescription: string;
        logoUrl?: string;
        faviconUrl?: string;
        supportEmail: string;
        supportPhone?: string;
        socialLinks: {
          facebook?: string;
          twitter?: string;
          instagram?: string;
          linkedin?: string;
        };
        features: {
          registration: boolean;
          guestCheckout: boolean;
          multiVendor: boolean;
          reviews: boolean;
          wishlist: boolean;
          coupons: boolean;
        };
        paymentMethods: string[];
        shippingMethods: string[];
        currencies: string[];
        languages: string[];
        timezone: string;
        maintenanceMode: boolean;
        version: string;
      }>(
        endpoint,
        {
          method: 'GET'
        },
        false
      );
      console.log('✅ Application configuration retrieved successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get application configuration:', error);
      throw new Error(error.message || 'Failed to get application configuration');
    }
  }

  /**
   * Search across the platform
   */
  async globalSearch(query: string, options: {
    types?: ('products' | 'vendors' | 'categories' | 'users')[];
    limit?: number;
    includeInactive?: boolean;
  } = {}): Promise<{
    products?: Array<{
      id: number;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      categoryName?: string;
      vendorName?: string;
    }>;
    vendors?: Array<{
      id: number;
      name: string;
      description?: string;
      logoUrl?: string;
      rating?: number;
      productCount?: number;
    }>;
    categories?: Array<{
      id: number;
      name: string;
      description?: string;
      imageUrl?: string;
      productCount?: number;
    }>;
    users?: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    }>;
  }> {
    console.log('🔍 Performing global search:', query);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (options.types && options.types.length > 0) {
        queryParams.append('types', options.types.join(','));
      }
      if (options.limit) {
        queryParams.append('limit', options.limit.toString());
      }
      if (options.includeInactive) {
        queryParams.append('includeInactive', 'true');
      }

      const endpoint = '/api/search';

      const response = await apiRequest<{
        products?: Array<{
          id: number;
          name: string;
          description?: string;
          price: number;
          imageUrl?: string;
          categoryName?: string;
          vendorName?: string;
        }>;
        vendors?: Array<{
          id: number;
          name: string;
          description?: string;
          logoUrl?: string;
          rating?: number;
          productCount?: number;
        }>;
        categories?: Array<{
          id: number;
          name: string;
          description?: string;
          imageUrl?: string;
          productCount?: number;
        }>;
        users?: Array<{
          id: number;
          name: string;
          email: string;
          role: string;
          avatar?: string;
        }>;
      }>(
        `${endpoint}?${queryParams.toString()}`,
        {
          method: 'GET'
        },
        false
      );
      console.log('✅ Global search completed successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to perform global search:', error);
      throw new Error(error.message || 'Failed to perform global search');
    }
  }

  /**
   * Generate and download reports (Admin only)
   */
  async generateReport(reportType: 'sales' | 'users' | 'products' | 'orders', options: {
    format?: 'PDF' | 'CSV' | 'EXCEL';
    dateFrom?: string;
    dateTo?: string;
    filters?: Record<string, any>;
  } = {}): Promise<{
    downloadUrl: string;
    fileName: string;
    expiresAt: string;
    fileSize: number;
  }> {
    console.log('📊 Generating report:', reportType);
    try {
      const endpoint = '/api/admin/reports';

      const response = await apiRequest<{
        downloadUrl: string;
        fileName: string;
        expiresAt: string;
        fileSize: number;
      }>(
        `${endpoint}/${reportType}`,
        {
          method: 'POST',
          body: JSON.stringify(options)
        },
        true
      );
      console.log('✅ Report generated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to generate report:', error);
      throw new Error(error.message || 'Failed to generate report');
    }
  }

  /**
   * Clear application cache
   */
  async clearCache(cacheKeys?: string[]): Promise<{ success: boolean; clearedKeys: string[] }> {
    console.log('🧹 Clearing application cache');
    try {
      const endpoint = '/api/admin/cache/clear';

      const response = await apiRequest<{ success: boolean; clearedKeys: string[] }>(
        endpoint,
        {
          method: 'POST',
          body: cacheKeys ? JSON.stringify({ keys: cacheKeys }) : undefined
        },
        true
      );
      console.log('✅ Cache cleared successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to clear cache:', error);
      throw new Error(error.message || 'Failed to clear cache');
    }
  }
}

// Export singleton instance
export const miscService = new MiscServiceClass();

// Export the class for testing/advanced usage
export { MiscServiceClass };

// Convenience exports
export const {
  uploadFile,
  uploadFiles,
  deleteFile,
  getFileInfo,
  getSystemHealth,
  getSystemStats,
  sendNotification,
  sendPushNotification,
  sendEmail,
  sendSMS,
  getAppConfig,
  globalSearch,
  generateReport,
  clearCache
} = miscService;
