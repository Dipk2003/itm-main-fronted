import { api } from '@/lib/api';

export interface INotification {
  id: number;
  title: string;
  message: string;
  type: 'INQUIRY' | 'QUOTE' | 'QUOTE_ACCEPTED' | 'ORDER' | 'ORDER_UPDATE' | 'PAYMENT' | 'KYC_UPDATE' | 'MESSAGE' | 'SUPPORT_TICKET' | 'REVIEW' | 'SUBSCRIPTION' | 'SYSTEM';
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSummary {
  unreadCount: number;
  totalCount: number;
  unreadByType: Record<string, number>;
}

class NotificationApiService {
  // Get user notifications
  async getUserNotifications(page: number = 0, size: number = 10): Promise<{ content: INotification[]; totalElements: number; totalPages: number; }> {
    const response = await api.get('/api/notifications', {
      params: { page, size }
    });
    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await api.post(`/api/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.post('/api/notifications/read-all');
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`);
  }

  // Get notification summary
  async getNotificationSummary(): Promise<NotificationSummary> {
    const response = await api.get('/api/notifications/summary');
    return response.data;
  }
}

export const notificationApi = new NotificationApiService();
