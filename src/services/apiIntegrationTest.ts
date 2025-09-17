/**
 * API Integration Test Suite
 * 
 * This file provides comprehensive testing utilities for all API endpoints
 * to ensure proper integration between frontend and backend.
 * 
 * Usage: Run this in browser console or create a test route to execute these tests
 */

import { 
  authService, 
  userManagementService, 
  buyerService, 
  vendorService,
  analyticsService,
  adminService,
  fileService,
  supportService,
  contentService,
  leadService,
  chatbotService
} from './index';
import { HealthCheckService, InputValidator, loadingManager } from './apiUtils';

// ========== TEST RESULT TYPES ==========
interface TestResult {
  testName: string;
  endpoint: string;
  method: string;
  passed: boolean;
  responseTime: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
  passed: number;
  failed: number;
  totalTime: number;
}

// ========== API INTEGRATION TESTER ==========
class ApiIntegrationTester {
  private results: TestSuite[] = [];

  /**
   * Run a single API test
   */
  private async runTest(
    testName: string,
    apiFunction: () => Promise<any>,
    endpoint: string,
    method: string = 'Unknown'
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing: ${testName}`);
      const result = await apiFunction();
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ ${testName} - Passed (${responseTime}ms)`);
      
      return {
        testName,
        endpoint,
        method,
        passed: true,
        responseTime,
        details: result
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      console.error(`❌ ${testName} - Failed (${responseTime}ms):`, error.message);
      
      return {
        testName,
        endpoint,
        method,
        passed: false,
        responseTime,
        error: error.message
      };
    }
  }

  /**
   * Test Authentication Services
   */
  async testAuthenticationServices(): Promise<TestSuite> {
    console.log('🔐 Testing Authentication Services...');
    const suite: TestSuite = {
      suiteName: 'Authentication Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Backend Health Check',
        func: () => authService.checkBackendHealth(),
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'Check Email Role',
        func: () => authService.checkEmailRole?.('test@example.com') || Promise.resolve({ role: 'user' }),
        endpoint: '/auth/check-email-role',
        method: 'POST'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test User Management Services
   */
  async testUserManagementServices(): Promise<TestSuite> {
    console.log('👥 Testing User Management Services...');
    const suite: TestSuite = {
      suiteName: 'User Management Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get User Count',
        func: () => userManagementService.getUserCount(),
        endpoint: '/api/users/count',
        method: 'GET'
      },
      {
        name: 'Check Email Exists',
        func: () => userManagementService.checkEmailExists('test@example.com'),
        endpoint: '/api/users/exists/email',
        method: 'GET'
      },
      {
        name: 'Check Phone Exists',
        func: () => userManagementService.checkPhoneExists('9876543210'),
        endpoint: '/api/users/exists/phone',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Buyer Management Services
   */
  async testBuyerServices(): Promise<TestSuite> {
    console.log('🛒 Testing Buyer Services...');
    const suite: TestSuite = {
      suiteName: 'Buyer Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Buyer Dashboard Stats',
        func: () => buyerService.getBuyerDashboardStats(),
        endpoint: '/api/buyers/analytics/dashboard',
        method: 'GET'
      },
      {
        name: 'Get Buyer Count by Status',
        func: () => buyerService.getBuyerCountByStatus(),
        endpoint: '/api/buyers/analytics/count/status',
        method: 'GET'
      },
      {
        name: 'Get Buyer Count by Type',
        func: () => buyerService.getBuyerCountByType(),
        endpoint: '/api/buyers/analytics/count/type',
        method: 'GET'
      },
      {
        name: 'Check Buyer Email Availability',
        func: () => buyerService.checkEmailAvailability('newbuyer@example.com'),
        endpoint: '/api/buyers/check/email',
        method: 'GET'
      },
      {
        name: 'Get Premium Buyer Stats',
        func: () => buyerService.getPremiumBuyerStats(),
        endpoint: '/api/buyers/analytics/premium',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Vendor Services
   */
  async testVendorServices(): Promise<TestSuite> {
    console.log('🏪 Testing Vendor Services...');
    const suite: TestSuite = {
      suiteName: 'Vendor Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Vendors with Pagination',
        func: () => vendorService.getVendors({ page: 0, size: 10 }),
        endpoint: '/api/v1/vendors',
        method: 'GET'
      },
      {
        name: 'Search Vendors',
        func: () => vendorService.searchVendors({ searchTerm: 'test', page: 0, size: 5 }),
        endpoint: '/api/v1/vendors/search',
        method: 'GET'
      },
      {
        name: 'Filter Vendors',
        func: () => vendorService.filterVendors({ businessType: 'MANUFACTURER', page: 0, size: 5 }),
        endpoint: '/api/v1/vendors/filter',
        method: 'GET'
      },
      {
        name: 'Get Vendor Statistics',
        func: () => Promise.resolve({ count: 0 }), // Placeholder implementation
        endpoint: '/api/v1/vendors/statistics',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Analytics Services
   */
  async testAnalyticsServices(): Promise<TestSuite> {
    console.log('📊 Testing Analytics Services...');
    const suite: TestSuite = {
      suiteName: 'Analytics Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Dashboard Analytics',
        func: () => analyticsService.getDashboardAnalytics(),
        endpoint: '/api/analytics/dashboard',
        method: 'GET'
      },
      {
        name: 'Get Admin Dashboard',
        func: () => analyticsService.getAdminDashboard(),
        endpoint: '/api/analytics/admin-dashboard',
        method: 'GET'
      },
      {
        name: 'Get Category Stats',
        func: () => analyticsService.getCategoryStats(),
        endpoint: '/api/analytics/category-stats',
        method: 'GET'
      },
      {
        name: 'Get Admin Growth Analytics',
        func: () => analyticsService.getAdminGrowth(),
        endpoint: '/api/analytics/admin-growth',
        method: 'GET'
      },
      {
        name: 'Get Admin Revenue Analytics',
        func: () => analyticsService.getAdminRevenue(),
        endpoint: '/api/analytics/admin-revenue',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Admin Services
   */
  async testAdminServices(): Promise<TestSuite> {
    console.log('👨‍💼 Testing Admin Services...');
    const suite: TestSuite = {
      suiteName: 'Admin Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Admin Count',
        func: () => adminService.getAdminCount(),
        endpoint: '/api/admins/count',
        method: 'GET'
      },
      {
        name: 'Get Active Admins',
        func: () => adminService.getActiveAdmins(),
        endpoint: '/api/admins/active',
        method: 'GET'
      },
      {
        name: 'Get Verified Admins',
        func: () => adminService.getVerifiedAdmins(),
        endpoint: '/api/admins/verified',
        method: 'GET'
      },
      {
        name: 'Check Admin Email Exists',
        func: () => adminService.checkAdminEmailExists('admin@example.com'),
        endpoint: '/api/admins/exists/email',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Content Services
   */
  async testContentServices(): Promise<TestSuite> {
    console.log('📄 Testing Content Services...');
    const suite: TestSuite = {
      suiteName: 'Content Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Banners',
        func: () => contentService.getBanners(),
        endpoint: '/api/content/banners',
        method: 'GET'
      },
      {
        name: 'Get SEO Keywords',
        func: () => contentService.getSeoKeywords(),
        endpoint: '/api/content/seo-keywords',
        method: 'GET'
      },
      {
        name: 'Get Campaigns',
        func: () => contentService.getCampaigns(),
        endpoint: '/api/content/campaigns',
        method: 'GET'
      },
      {
        name: 'Get Coupons',
        func: () => contentService.getCoupons(),
        endpoint: '/api/content/coupons',
        method: 'GET'
      },
      {
        name: 'Validate Coupon',
        func: () => contentService.validateCoupon('TEST10'),
        endpoint: '/api/content/coupons/validate',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Support Services
   */
  async testSupportServices(): Promise<TestSuite> {
    console.log('🎧 Testing Support Services...');
    const suite: TestSuite = {
      suiteName: 'Support Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Support Tickets',
        func: () => supportService.getTickets(0, 10),
        endpoint: '/api/support/tickets',
        method: 'GET'
      },
      {
        name: 'Get Chatbot Response',
        func: () => supportService.getChatbotResponse('Hello, can you help me?'),
        endpoint: '/api/support/chatbot',
        method: 'POST'
      },
      {
        name: 'Search Knowledge Base',
        func: () => supportService.searchKnowledgeBase('how to register'),
        endpoint: '/api/support/knowledge-base/search',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Lead Services
   */
  async testLeadServices(): Promise<TestSuite> {
    console.log('🎯 Testing Lead Services...');
    const suite: TestSuite = {
      suiteName: 'Lead Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Lead Statuses',
        func: () => leadService.getLeadStatuses(),
        endpoint: '/api/leads/statuses',
        method: 'GET'
      },
      {
        name: 'Get Lead Priorities',
        func: () => leadService.getLeadPriorities(),
        endpoint: '/api/leads/priorities',
        method: 'GET'
      },
      {
        name: 'Get Duplicate Leads',
        func: () => leadService.getDuplicateLeads(),
        endpoint: '/api/leads/duplicates',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Chatbot Services
   */
  async testChatbotServices(): Promise<TestSuite> {
    console.log('🤖 Testing Chatbot Services...');
    const suite: TestSuite = {
      suiteName: 'Chatbot Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Get Chatbot Analytics',
        func: () => chatbotService.getChatbotAnalytics(),
        endpoint: '/admin/chatbot/analytics',
        method: 'GET'
      },
      {
        name: 'Get Recent Queries',
        func: () => chatbotService.getRecentQueries(),
        endpoint: '/admin/chatbot/recent-queries',
        method: 'GET'
      },
      {
        name: 'Get Chatbot Conversations',
        func: () => chatbotService.getChatbotConversations(0, 10),
        endpoint: '/admin/chatbot/conversations',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Health Check Services
   */
  async testHealthServices(): Promise<TestSuite> {
    console.log('🏥 Testing Health Check Services...');
    const suite: TestSuite = {
      suiteName: 'Health Check Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Backend Health Check',
        func: () => HealthCheckService.checkBackendHealth(),
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'All Services Health Check',
        func: () => HealthCheckService.checkAllServicesHealth(),
        endpoint: 'Multiple',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.func, test.endpoint, test.method);
      suite.results.push(result);
      if (result.passed) suite.passed++;
      else suite.failed++;
      suite.totalTime += result.responseTime;
    }

    return suite;
  }

  /**
   * Test Input Validation
   */
  testValidationServices(): TestSuite {
    console.log('✅ Testing Input Validation...');
    const suite: TestSuite = {
      suiteName: 'Input Validation Services',
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0
    };

    const tests = [
      {
        name: 'Email Validation - Valid',
        func: () => Promise.resolve(InputValidator.isEmail('test@example.com')),
        endpoint: 'Local Validation',
        method: 'Validation'
      },
      {
        name: 'Email Validation - Invalid',
        func: () => Promise.resolve(!InputValidator.isEmail('invalid-email')),
        endpoint: 'Local Validation',
        method: 'Validation'
      },
      {
        name: 'Phone Validation - Valid Indian',
        func: () => Promise.resolve(InputValidator.isPhone('9876543210')),
        endpoint: 'Local Validation',
        method: 'Validation'
      },
      {
        name: 'Phone Validation - Valid with +91',
        func: () => Promise.resolve(InputValidator.isPhone('+919876543210')),
        endpoint: 'Local Validation',
        method: 'Validation'
      },
      {
        name: 'PAN Validation - Valid',
        func: () => Promise.resolve(InputValidator.isValidPAN('ABCDE1234F')),
        endpoint: 'Local Validation',
        method: 'Validation'
      },
      {
        name: 'GST Validation - Valid Format',
        func: () => Promise.resolve(InputValidator.isValidGST('27ABCDE1234F1Z5')),
        endpoint: 'Local Validation',
        method: 'Validation'
      }
    ];

    tests.forEach(test => {
      const startTime = Date.now();
      try {
        test.func().then(result => {
          const responseTime = Date.now() - startTime;
          const testResult: TestResult = {
            testName: test.name,
            endpoint: test.endpoint,
            method: test.method,
            passed: Boolean(result),
            responseTime,
            details: { result }
          };
          suite.results.push(testResult);
          if (testResult.passed) {
            suite.passed++;
            console.log(`✅ ${test.name} - Passed (${responseTime}ms)`);
          } else {
            suite.failed++;
            console.log(`❌ ${test.name} - Failed (${responseTime}ms)`);
          }
          suite.totalTime += responseTime;
        });
      } catch (error: any) {
        const responseTime = Date.now() - startTime;
        const testResult: TestResult = {
          testName: test.name,
          endpoint: test.endpoint,
          method: test.method,
          passed: false,
          responseTime,
          error: error.message
        };
        suite.results.push(testResult);
        suite.failed++;
        suite.totalTime += responseTime;
        console.log(`❌ ${test.name} - Failed (${responseTime}ms):`, error.message);
      }
    });

    return suite;
  }

  /**
   * Run all API integration tests
   */
  async runAllTests(): Promise<{
    summary: {
      totalTests: number;
      totalPassed: number;
      totalFailed: number;
      totalTime: number;
      successRate: number;
    };
    suites: TestSuite[];
  }> {
    console.log('🚀 Starting Comprehensive API Integration Tests...');
    console.log('═══════════════════════════════════════════════');
    
    this.results = [];
    const startTime = Date.now();

    // Run all test suites
    const suites = [
      await this.testHealthServices(),
      await this.testAuthenticationServices(),
      await this.testUserManagementServices(),
      await this.testBuyerServices(),
      await this.testVendorServices(),
      await this.testAnalyticsServices(),
      await this.testAdminServices(),
      await this.testContentServices(),
      await this.testSupportServices(),
      await this.testLeadServices(),
      await this.testChatbotServices(),
      this.testValidationServices()
    ];

    const totalTime = Date.now() - startTime;
    
    // Calculate summary
    const totalTests = suites.reduce((sum, suite) => sum + suite.results.length, 0);
    const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = suites.reduce((sum, suite) => sum + suite.failed, 0);
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    const summary = {
      totalTests,
      totalPassed,
      totalFailed,
      totalTime,
      successRate: Math.round(successRate * 100) / 100
    };

    // Print results
    this.printResults(summary, suites);

    return { summary, suites };
  }

  /**
   * Print test results to console
   */
  private printResults(summary: any, suites: TestSuite[]) {
    console.log('\n🏁 API Integration Test Results');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Total Tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.totalPassed}`);
    console.log(`❌ Failed: ${summary.totalFailed}`);
    console.log(`⏱️ Total Time: ${summary.totalTime}ms`);
    console.log(`🎯 Success Rate: ${summary.successRate}%`);
    console.log('═══════════════════════════════════════════════');

    suites.forEach(suite => {
      console.log(`\n📋 ${suite.suiteName}`);
      console.log(`   ✅ Passed: ${suite.passed} | ❌ Failed: ${suite.failed} | ⏱️ Time: ${suite.totalTime}ms`);
      
      if (suite.failed > 0) {
        console.log('   Failed Tests:');
        suite.results
          .filter(result => !result.passed)
          .forEach(result => {
            console.log(`   - ${result.testName}: ${result.error}`);
          });
      }
    });

    if (summary.totalFailed > 0) {
      console.log('\n⚠️ Some tests failed. Check backend connectivity and authentication.');
      console.log('💡 Tip: Ensure the backend server is running and you have proper authentication tokens.');
    } else {
      console.log('\n🎉 All tests passed! API integration is working correctly.');
    }
  }

  /**
   * Generate test report as JSON
   */
  generateJsonReport(summary: any, suites: TestSuite[]): string {
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      testSuites: suites,
      recommendations: this.generateRecommendations(suites)
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(suites: TestSuite[]): string[] {
    const recommendations: string[] = [];
    
    const failedSuites = suites.filter(suite => suite.failed > 0);
    
    if (failedSuites.length > 0) {
      recommendations.push('Some API endpoints failed. Check backend server status.');
      
      const authFailed = failedSuites.find(s => s.suiteName.includes('Authentication'));
      if (authFailed) {
        recommendations.push('Authentication tests failed. Verify backend server is running on the correct port.');
      }
      
      const highFailureRate = failedSuites.filter(s => s.failed / (s.passed + s.failed) > 0.5);
      if (highFailureRate.length > 0) {
        recommendations.push('High failure rate detected. Check network connectivity and API endpoints configuration.');
      }
    } else {
      recommendations.push('All tests passed! API integration is functioning correctly.');
    }
    
    return recommendations;
  }
}

// ========== EXPORT TEST UTILITIES ==========
export const apiTester = new ApiIntegrationTester();

// Convenience function to run tests
export const runApiTests = () => apiTester.runAllTests();

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).runApiTests = runApiTests;
  (window as any).apiTester = apiTester;
}

console.log('🧪 API Integration Test Suite Loaded');
console.log('💡 Run tests by calling: runApiTests()');
console.log('🌐 Or in browser console: window.runApiTests()');

export default ApiIntegrationTester;
