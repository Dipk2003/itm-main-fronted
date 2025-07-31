/**
 * API Integration Test Utility
 * This file provides functions to test all integrated APIs
 */

import {
    additionalAPI,
    analyticsApi,
    APIUtils,
    cartWishlistAPI,
    orderAPI,
    productAPI,
    supportAPI,
    userAPI
} from '@/lib';

export interface APITestResult {
  endpoint: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  responseTime?: number;
  data?: any;
}

export class APITester {
  private results: APITestResult[] = [];

  // Test User APIs
  async testUserAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get User Dashboard',
        test: () => userAPI.getDashboardData()
      },
      {
        name: 'Get User Addresses',
        test: () => userAPI.addresses.getAll()
      },
      {
        name: 'Get User Profile',
        test: () => userAPI.getProfile()
      }
    ];

    return this.runTests('User API', tests);
  }

  // Test Product APIs
  async testProductAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get Products',
        test: () => productAPI.getProducts(0, 5)
      },
      {
        name: 'Get Categories',
        test: () => productAPI.getCategories()
      },
      {
        name: 'Advanced Search',
        test: () => productAPI.advancedSearch({ query: 'test', page: 0, size: 5 })
      },
      {
        name: 'Get Featured Products',
        test: () => productAPI.getFeaturedProducts(0, 5)
      }
    ];

    return this.runTests('Product API', tests);
  }

  // Test Cart & Wishlist APIs
  async testCartWishlistAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get Cart',
        test: () => cartWishlistAPI.cart.get()
      },
      {
        name: 'Get Wishlist',
        test: () => cartWishlistAPI.wishlist.get()
      },
      {
        name: 'Get Cart Count',
        test: () => cartWishlistAPI.cart.getCount()
      }
    ];

    return this.runTests('Cart & Wishlist API', tests);
  }

  // Test Order APIs
  async testOrderAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get My Orders',
        test: () => orderAPI.getMyOrders()
      },
      {
        name: 'Get Order Analytics',
        test: () => orderAPI.analytics.getUserStats()
      }
    ];

    return this.runTests('Order API', tests);
  }

  // Test Support APIs
  async testSupportAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get Support Tickets',
        test: () => supportAPI.getTickets()
      },
      {
        name: 'Get Ticket Stats',
        test: () => supportAPI.getTicketStats()
      }
    ];

    return this.runTests('Support API', tests);
  }

  // Test Analytics APIs
  async testAnalyticsAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get Dashboard Analytics',
        test: () => analyticsApi.getDashboardAnalytics()
      },
      {
        name: 'Get System Metrics',
        test: () => analyticsApi.getSystemMetrics()
      }
    ];

    return this.runTests('Analytics API', tests);
  }

  // Test Additional APIs
  async testAdditionalAPIs(): Promise<APITestResult[]> {
    const tests = [
      {
        name: 'Get Notifications',
        test: () => additionalAPI.notifications.getAll()
      },
      {
        name: 'Get Subscription Plans',
        test: () => additionalAPI.subscriptions.getPlans()
      },
      {
        name: 'Get Banners',
        test: () => additionalAPI.content.getBanners()
      },
      {
        name: 'Health Check',
        test: () => additionalAPI.health.check()
      }
    ];

    return this.runTests('Additional API', tests);
  }

  // Run all tests
  async testAllAPIs(): Promise<{
    summary: {
      total: number;
      success: number;
      error: number;
      skipped: number;
    };
    results: APITestResult[];
  }> {
    console.log('🧪 Starting comprehensive API integration tests...');
    
    this.results = [];

    // Run all test suites
    const testSuites = [
      () => this.testUserAPIs(),
      () => this.testProductAPIs(),
      () => this.testCartWishlistAPIs(),
      () => this.testOrderAPIs(),
      () => this.testSupportAPIs(),
      () => this.testAnalyticsAPIs(),
      () => this.testAdditionalAPIs()
    ];

    for (const testSuite of testSuites) {
      try {
        const results = await testSuite();
        this.results.push(...results);
      } catch (error) {
        console.error('Test suite failed:', error);
      }
    }

    // Calculate summary
    const summary = {
      total: this.results.length,
      success: this.results.filter(r => r.status === 'success').length,
      error: this.results.filter(r => r.status === 'error').length,
      skipped: this.results.filter(r => r.status === 'skipped').length
    };

    console.log('📊 API Test Summary:', summary);
    
    return { summary, results: this.results };
  }

  // Helper method to run tests
  private async runTests(category: string, tests: Array<{ name: string; test: () => Promise<any> }>): Promise<APITestResult[]> {
    const results: APITestResult[] = [];
    
    console.log(`🔍 Testing ${category}...`);

    for (const { name, test } of tests) {
      const startTime = Date.now();
      
      try {
        const data = await test();
        const responseTime = Date.now() - startTime;
        
        results.push({
          endpoint: `${category} - ${name}`,
          status: 'success',
          message: 'Test passed successfully',
          responseTime,
          data: data ? 'Data received' : 'No data'
        });
        
        console.log(`✅ ${name}: ${responseTime}ms`);
      } catch (error: any) {
        const responseTime = Date.now() - startTime;
        
        if (APIUtils.isUnauthorized(error)) {
          results.push({
            endpoint: `${category} - ${name}`,
            status: 'skipped',
            message: 'Skipped - Authentication required',
            responseTime
          });
          console.log(`⏭️ ${name}: Skipped (Auth required)`);
        } else {
          results.push({
            endpoint: `${category} - ${name}`,
            status: 'error',
            message: APIUtils.formatError(error),
            responseTime
          });
          console.log(`❌ ${name}: ${APIUtils.formatError(error)}`);
        }
      }
    }

    return results;
  }

  // Get test results
  getResults(): APITestResult[] {
    return this.results;
  }

  // Export results as JSON
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        total: this.results.length,
        success: this.results.filter(r => r.status === 'success').length,
        error: this.results.filter(r => r.status === 'error').length,
        skipped: this.results.filter(r => r.status === 'skipped').length
      }
    }, null, 2);
  }
}

// Singleton instance
export const apiTester = new APITester();

// Quick test function for development
export const quickAPITest = async () => {
  const tester = new APITester();
  const results = await tester.testAllAPIs();
  
  console.log('\n📋 Quick API Test Results:');
  console.table(results.results.map(r => ({
    Endpoint: r.endpoint,
    Status: r.status,
    'Response Time': r.responseTime ? `${r.responseTime}ms` : 'N/A',
    Message: r.message
  })));
  
  return results;
};

// Test specific API category
export const testAPICategory = async (category: 'user' | 'product' | 'cart' | 'order' | 'support' | 'analytics' | 'additional') => {
  const tester = new APITester();
  
  switch (category) {
    case 'user':
      return await tester.testUserAPIs();
    case 'product':
      return await tester.testProductAPIs();
    case 'cart':
      return await tester.testCartWishlistAPIs();
    case 'order':
      return await tester.testOrderAPIs();
    case 'support':
      return await tester.testSupportAPIs();
    case 'analytics':
      return await tester.testAnalyticsAPIs();
    case 'additional':
      return await tester.testAdditionalAPIs();
    default:
      throw new Error(`Unknown category: ${category}`);
  }
};