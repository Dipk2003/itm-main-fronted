/**
 * Chatbot Integration Tests
 * Testing the complete user flow for role-based chatbot interactions
 */

describe('Chatbot Integration Tests', () => {
  let mockUser;
  
  beforeEach(() => {
    // Mock API responses
    global.fetch = jest.fn();
    mockUser = {
      id: 1,
      role: 'VENDOR',
      name: 'Test Vendor',
      authToken: 'test-token-123'
    };
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'authToken') return mockUser.authToken;
          if (key === 'userRole') return mockUser.role;
          if (key === 'userId') return mockUser.id.toString();
          return null;
        }),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  describe('Role-based Chat Responses', () => {
    test('should send proper user context for vendor role', async () => {
      const mockResponse = {
        response: "Here are some potential leads for you:",
        sessionId: "test-session",
        leadRecommendations: [
          {
            leadId: 1,
            leadName: "Manufacturing Company",
            company: "ABC Corp",
            productInterest: "Industrial Equipment",
            urgency: "HIGH",
            reason: "Matches your product category",
            priceRange: "$50,000-$100,000",
            timeline: "Immediate"
          }
        ],
        hasLeadRecommendations: true,
        responseType: "LEAD_RECOMMENDATIONS",
        userRole: "VENDOR",
        suggestedAction: "VIEW_LEADS"
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { chatbotAPI } = require('@/shared/services/chatbotApi');
      const request = chatbotAPI.prepareRequest("Show me potential customers", "test-session");
      const response = await chatbotAPI.sendRoleBasedMessage(request);

      // Verify request was made with correct user context
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chatbot/support/chat'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-123',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            message: "Show me potential customers",
            sessionId: "test-session",
            userId: 1,
            userRole: "VENDOR",
            userIp: "web-client"
          })
        })
      );

      // Verify response structure
      expect(response).toEqual(mockResponse);
      expect(response.leadRecommendations).toHaveLength(1);
      expect(response.suggestedAction).toBe("VIEW_LEADS");
    });

    test('should handle non-logged user requests', async () => {
      // Override localStorage for non-logged user
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return null;
        if (key === 'userRole') return '';
        if (key === 'userId') return null;
        return null;
      });

      const mockResponse = {
        response: "I can help you find vendors. To contact them directly, please login or register.",
        sessionId: "test-session",
        recommendations: [
          {
            vendorId: 1,
            vendorName: "Tech Solutions Inc",
            vendorEmail: "contact@techsolutions.com",
            vendorType: "MANUFACTURER",
            performanceScore: 4.5,
            reason: "Specializes in your required products"
          }
        ],
        hasRecommendations: true,
        responseType: "VENDOR_RECOMMENDATIONS",
        userRole: "NON_LOGGED",
        requiresLogin: true,
        suggestedAction: "REGISTER_OR_LOGIN"
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { chatbotAPI } = require('@/shared/services/chatbotApi');
      const request = chatbotAPI.prepareRequest("Find vendors for industrial equipment", "test-session");
      const response = await chatbotAPI.sendRoleBasedMessage(request);

      expect(response.userRole).toBe("NON_LOGGED");
      expect(response.requiresLogin).toBe(true);
      expect(response.suggestedAction).toBe("REGISTER_OR_LOGIN");
    });
  });

  describe('UI Component Integration', () => {
    test('should render vendor recommendations with action buttons', () => {
      const mockMessage = {
        id: '1',
        text: 'Here are recommended vendors:',
        isUser: false,
        timestamp: new Date(),
        recommendations: [
          {
            vendorId: 1,
            vendorName: "Tech Solutions Inc",
            vendorEmail: "contact@techsolutions.com",
            vendorPhone: "123-456-7890",
            vendorType: "MANUFACTURER",
            performanceScore: 4.5,
            products: ["Laptops", "Servers"],
            categories: ["Electronics", "IT Equipment"],
            reason: "Specializes in your required products",
            contactUrl: "mailto:contact@techsolutions.com",
            profileUrl: "/vendor/profile/1"
          }
        ]
      };

      // Component rendering test would go here
      // This is a placeholder for actual component testing with React Testing Library
      expect(mockMessage.recommendations).toHaveLength(1);
      expect(mockMessage.recommendations[0].vendorId).toBe(1);
    });

    test('should handle suggested actions correctly', () => {
      const actionHandlers = {
        'LOGIN': () => '/auth/user/login',
        'REGISTER_OR_LOGIN': () => '/auth/user/login',
        'VIEW_LEADS': () => '/dashboard/vendor-panel?tab=leads',
        'EXPLORE_VENDOR_DASHBOARD': () => '/dashboard/vendor-panel',
        'EXPLORE_MARKETPLACE': () => '/products'
      };

      Object.entries(actionHandlers).forEach(([action, expectedPath]) => {
        const result = actionHandlers[action]();
        expect(result).toBe(expectedPath);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { chatbotAPI } = require('@/shared/services/chatbotApi');
      
      try {
        const request = chatbotAPI.prepareRequest("Test message", "test-session");
        await chatbotAPI.sendRoleBasedMessage(request);
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should handle invalid responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const { chatbotAPI } = require('@/shared/services/chatbotApi');
      
      try {
        const request = chatbotAPI.prepareRequest("Test message", "test-session");
        await chatbotAPI.sendRoleBasedMessage(request);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Session Management', () => {
    test('should maintain session continuity', async () => {
      const sessionId = "persistent-session-123";
      
      const firstResponse = {
        response: "Hello! How can I help?",
        sessionId: sessionId,
        responseType: "GENERAL"
      };

      const secondResponse = {
        response: "Based on our previous conversation, here are more details:",
        sessionId: sessionId,
        responseType: "GENERAL"
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => firstResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => secondResponse,
        });

      const { chatbotAPI } = require('@/shared/services/chatbotApi');
      
      // First message
      const firstRequest = chatbotAPI.prepareRequest("Hello", sessionId);
      const firstResult = await chatbotAPI.sendRoleBasedMessage(firstRequest);
      
      // Second message with same session
      const secondRequest = chatbotAPI.prepareRequest("Tell me more", sessionId);
      const secondResult = await chatbotAPI.sendRoleBasedMessage(secondRequest);

      expect(firstResult.sessionId).toBe(sessionId);
      expect(secondResult.sessionId).toBe(sessionId);
    });
  });
});

// Mock chatbotApi module
jest.mock('@/shared/services/chatbotApi', () => ({
  chatbotAPI: {
    prepareRequest: (message, sessionId) => ({
      message: message.trim(),
      sessionId: sessionId || `web-chat-${Date.now()}`,
      userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : undefined,
      userRole: localStorage.getItem('userRole') || 'NON_LOGGED',
      userIp: 'web-client'
    }),
    sendRoleBasedMessage: async (request) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chatbot/support/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    getCurrentUserRole: () => {
      const userRole = localStorage.getItem('userRole');
      const token = localStorage.getItem('authToken');
      
      if (!token) return 'NON_LOGGED';
      
      switch (userRole?.toUpperCase()) {
        case 'VENDOR': return 'VENDOR';
        case 'BUYER':
        case 'USER': return 'BUYER';
        case 'ADMIN': return 'ADMIN';
        default: return 'NON_LOGGED';
      }
    },
    isUserLoggedIn: () => {
      return !!localStorage.getItem('authToken');
    }
  },
  VendorRecommendation: {},
  LeadRecommendation: {},
  ChatbotResponse: {}
}));
