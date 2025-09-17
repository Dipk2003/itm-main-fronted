import { API_CONFIG, apiRequest } from '@/config/api';

// Types for Support operations
export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  userId?: number;
  assignedTo?: number;
  createdAt: string;
  updatedAt?: string;
  responses?: SupportTicketResponse[];
}

export interface SupportTicketResponse {
  id: number;
  ticketId: number;
  message: string;
  isFromCustomer: boolean;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
    role: string;
  };
}

export interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  priority: TicketPriority;
  category?: string;
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// Support Service Class
class SupportServiceClass {
  /**
   * Submit contact form
   */
  async submitContactForm(request: ContactFormRequest): Promise<{
    id: number;
    ticketNumber: string;
    status: string;
  }> {
    console.log('📧 Submitting contact form:', request.subject);
    try {
      // Check if we have a specific contact endpoint, otherwise use support/contact
      const endpoint = '/api/support/contact';
      
      const response = await apiRequest<{
        id: number;
        ticketNumber: string;
        status: string;
      }>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(request)
        },
        false // No auth required for contact form
      );
      console.log('✅ Contact form submitted successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to submit contact form:', error);
      throw new Error(error.message || 'Failed to submit contact form');
    }
  }

  /**
   * Create support ticket (authenticated users)
   */
  async createSupportTicket(request: CreateSupportTicketRequest): Promise<SupportTicket> {
    console.log('🎫 Creating support ticket:', request.subject);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.TICKETS || '/api/support/tickets';
      
      const response = await apiRequest<SupportTicket>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(request)
        },
        true
      );
      console.log('✅ Support ticket created successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to create support ticket:', error);
      throw new Error(error.message || 'Failed to create support ticket');
    }
  }

  /**
   * Get user's support tickets
   */
  async getMyTickets(): Promise<SupportTicket[]> {
    console.log('🎫 Fetching user support tickets');
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.TICKETS 
        ? `${API_CONFIG.ENDPOINTS.SUPPORT.TICKETS}/my-tickets`
        : '/api/support/tickets/my-tickets';
      
      const response = await apiRequest<SupportTicket[]>(
        endpoint,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Support tickets fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch support tickets:', error);
      throw new Error(error.message || 'Failed to fetch support tickets');
    }
  }

  /**
   * Get support ticket by ID
   */
  async getTicketById(ticketId: number): Promise<SupportTicket> {
    console.log('🔍 Fetching support ticket:', ticketId);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.TICKETS || '/api/support/tickets';
      
      const response = await apiRequest<SupportTicket>(
        `${endpoint}/${ticketId}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Support ticket fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch support ticket:', error);
      throw new Error(error.message || 'Failed to fetch support ticket');
    }
  }

  /**
   * Add response to support ticket
   */
  async addTicketResponse(ticketId: number, message: string): Promise<SupportTicketResponse> {
    console.log('💬 Adding response to ticket:', ticketId);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.TICKETS || '/api/support/tickets';
      
      const response = await apiRequest<SupportTicketResponse>(
        `${endpoint}/${ticketId}/responses`,
        {
          method: 'POST',
          body: JSON.stringify({ message })
        },
        true
      );
      console.log('✅ Ticket response added successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to add ticket response:', error);
      throw new Error(error.message || 'Failed to add ticket response');
    }
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(ticketId: number, status: TicketStatus): Promise<SupportTicket> {
    console.log('🔄 Updating ticket status:', { ticketId, status });
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.TICKETS || '/api/support/tickets';
      
      const response = await apiRequest<SupportTicket>(
        `${endpoint}/${ticketId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status })
        },
        true
      );
      console.log('✅ Ticket status updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update ticket status:', error);
      throw new Error(error.message || 'Failed to update ticket status');
    }
  }

  /**
   * Close support ticket
   */
  async closeTicket(ticketId: number): Promise<SupportTicket> {
    return this.updateTicketStatus(ticketId, TicketStatus.CLOSED);
  }

  /**
   * Reopen support ticket
   */
  async reopenTicket(ticketId: number): Promise<SupportTicket> {
    return this.updateTicketStatus(ticketId, TicketStatus.OPEN);
  }

  /**
   * Get support statistics (for user dashboard)
   */
  async getSupportStats(): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResponseTime?: string;
  }> {
    console.log('📊 Fetching support statistics');
    try {
      const tickets = await this.getMyTickets();
      
      const stats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS).length,
        resolvedTickets: tickets.filter(t => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED).length,
        avgResponseTime: '24 hours' // This would typically come from backend
      };
      
      console.log('✅ Support statistics calculated');
      return stats;
    } catch (error: any) {
      console.error('❌ Failed to get support statistics:', error);
      throw new Error(error.message || 'Failed to get support statistics');
    }
  }

  /**
   * Search knowledge base (if available)
   */
  async searchKnowledgeBase(query: string): Promise<Array<{
    id: number;
    title: string;
    summary: string;
    url?: string;
    category: string;
  }>> {
    console.log('🔍 Searching knowledge base:', query);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.KNOWLEDGE_BASE || '/api/support/knowledge-base';
      
      const response = await apiRequest<Array<{
        id: number;
        title: string;
        summary: string;
        url?: string;
        category: string;
      }>>(
        `${endpoint}/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET'
        },
        false
      );
      console.log('✅ Knowledge base search completed');
      return response;
    } catch (error: any) {
      console.error('❌ Knowledge base search failed:', error);
      // Return empty array if search fails
      return [];
    }
  }

  /**
   * Get FAQ categories
   */
  async getFAQCategories(): Promise<Array<{
    id: number;
    name: string;
    description: string;
    articleCount: number;
  }>> {
    console.log('📚 Fetching FAQ categories');
    try {
      const endpoint = API_CONFIG.ENDPOINTS.SUPPORT?.KNOWLEDGE_BASE || '/api/support/knowledge-base';
      
      const response = await apiRequest<Array<{
        id: number;
        name: string;
        description: string;
        articleCount: number;
      }>>(
        `${endpoint}/categories`,
        {
          method: 'GET'
        },
        false
      );
      console.log('✅ FAQ categories fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch FAQ categories:', error);
      // Return empty array with default categories
      return [
        { id: 1, name: 'Getting Started', description: 'Basic questions about using the platform', articleCount: 5 },
        { id: 2, name: 'Account & Billing', description: 'Questions about accounts and payments', articleCount: 8 },
        { id: 3, name: 'Orders & Shipping', description: 'Questions about orders and delivery', articleCount: 12 }
      ];
    }
  }
}

// Export singleton instance
export const supportService = new SupportServiceClass();

// Export the class for testing/advanced usage
export { SupportServiceClass };

// Convenience exports
export const {
  submitContactForm,
  createSupportTicket,
  getMyTickets,
  getTicketById,
  addTicketResponse,
  updateTicketStatus,
  closeTicket,
  reopenTicket,
  getSupportStats,
  searchKnowledgeBase,
  getFAQCategories
} = supportService;
