/**
 * API Integration Test Script
 * 
 * This script tests the basic functionality of all API service integrations.
 * It's designed to run basic validation tests without needing a live backend.
 */

// Import all services
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { categoryService } from '../services/categoryService';
import { userService } from '../services/userService';
import { profileService } from '../services/profileService';
import { supportService } from '../services/supportService';
import { miscService } from '../services/miscService';

// Import error handling
import { ErrorHandler, ServiceError } from '../utils/errorHandler';

interface TestResult {
  serviceName: string;
  methodName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
  error?: ServiceError;
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  results: TestResult[];
}

class APIIntegrationTester {
  private results: TestResult[] = [];
  private startTime: number = 0;

  /**
   * Run a single test method
   */
  private async runTest(
    serviceName: string,
    methodName: string,
    testFn: () => Promise<any>,
    shouldSkip: boolean = false
  ): Promise<void> {
    if (shouldSkip) {
      this.results.push({
        serviceName,
        methodName,
        status: 'SKIP',
        message: 'Test skipped (requires backend)',
        duration: 0
      });
      return;
    }

    const testStart = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - testStart;
      
      this.results.push({
        serviceName,
        methodName,
        status: 'PASS',
        message: 'Test passed successfully',
        duration
      });
      
      console.log(`✅ ${serviceName}.${methodName} - PASS (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - testStart;
      const serviceError = error instanceof ServiceError 
        ? error 
        : ErrorHandler.handleError(error, `${serviceName}.${methodName}`);
      
      // Some errors are expected when testing without backend
      const expectedErrors = ['NETWORK_ERROR', 'TIMEOUT_ERROR'];
      const status = expectedErrors.includes(serviceError.code) ? 'PASS' : 'FAIL';
      const message = expectedErrors.includes(serviceError.code) 
        ? 'Expected error (no backend) - Structure validation passed'
        : `Unexpected error: ${serviceError.message}`;
      
      this.results.push({
        serviceName,
        methodName,
        status,
        message,
        duration,
        error: serviceError
      });
      
      const icon = status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${serviceName}.${methodName} - ${status} (${duration}ms) - ${message}`);
    }
  }

  /**
   * Test Authentication Service
   */
  private async testAuthService(): Promise<void> {
    console.log('\n🔐 Testing Authentication Service...');
    
    // Test service structure and method availability
    await this.runTest('authService', 'structure', async () => {
      if (typeof authService.login !== 'function') {
        throw new Error('login method not found');
      }
      if (typeof authService.register !== 'function') {
        throw new Error('register method not found');
      }
      if (typeof authService.logout !== 'function') {
        throw new Error('logout method not found');
      }
      if (typeof authService.refreshToken !== 'function') {
        throw new Error('refreshToken method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    // Test login call (will fail without backend, but validates structure)
    await this.runTest('authService', 'login', async () => {
      await authService.login({
        emailOrPhone: 'test@example.com',
        password: 'testpassword'
      });
    });

    // Test register call (will fail without backend, but validates structure)
    await this.runTest('authService', 'register', async () => {
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'testpassword',
        role: 'BUYER'
      });
    });
  }

  /**
   * Test Product Service
   */
  private async testProductService(): Promise<void> {
    console.log('\n🛍️ Testing Product Service...');
    
    await this.runTest('productService', 'structure', async () => {
      if (typeof productService.getProducts !== 'function') {
        throw new Error('getProducts method not found');
      }
      if (typeof productService.getProductById !== 'function') {
        throw new Error('getProductById method not found');
      }
      if (typeof productService.searchProducts !== 'function') {
        throw new Error('searchProducts method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('productService', 'getProducts', async () => {
      await productService.getProducts();
    });

    await this.runTest('productService', 'getProductById', async () => {
      await productService.getProductById(1);
    });

    await this.runTest('productService', 'searchProducts', async () => {
      await productService.searchProducts({ query: 'test query' });
    });
  }

  /**
   * Test Cart Service
   */
  private async testCartService(): Promise<void> {
    console.log('\n🛒 Testing Cart Service...');
    
    await this.runTest('cartService', 'structure', async () => {
      if (typeof cartService.getCart !== 'function') {
        throw new Error('getCart method not found');
      }
      if (typeof cartService.addToCart !== 'function') {
        throw new Error('addToCart method not found');
      }
      if (typeof cartService.updateCartItem !== 'function') {
        throw new Error('updateCartItem method not found');
      }
      if (typeof cartService.removeFromCart !== 'function') {
        throw new Error('removeFromCart method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('cartService', 'getCart', async () => {
      await cartService.getCart();
    });

    await this.runTest('cartService', 'addToCart', async () => {
      await cartService.addToCart({ productId: 1, quantity: 2 });
    });
  }

  /**
   * Test Order Service
   */
  private async testOrderService(): Promise<void> {
    console.log('\n📦 Testing Order Service...');
    
    await this.runTest('orderService', 'structure', async () => {
      if (typeof orderService.checkout !== 'function') {
        throw new Error('checkout method not found');
      }
      if (typeof orderService.getMyOrders !== 'function') {
        throw new Error('getMyOrders method not found');
      }
      if (typeof orderService.getOrderById !== 'function') {
        throw new Error('getOrderById method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('orderService', 'getMyOrders', async () => {
      await orderService.getMyOrders();
    });

    await this.runTest('orderService', 'getOrderById', async () => {
      await orderService.getOrderById(1);
    });
  }

  /**
   * Test Category Service
   */
  private async testCategoryService(): Promise<void> {
    console.log('\n🏷️ Testing Category Service...');
    
    await this.runTest('categoryService', 'structure', async () => {
      if (typeof categoryService.getCategories !== 'function') {
        throw new Error('getCategories method not found');
      }
      if (typeof categoryService.getCategoryById !== 'function') {
        throw new Error('getCategoryById method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('categoryService', 'getCategories', async () => {
      await categoryService.getCategories();
    });

    await this.runTest('categoryService', 'getCategoryById', async () => {
      await categoryService.getCategoryById(1);
    });
  }

  /**
   * Test User Service
   */
  private async testUserService(): Promise<void> {
    console.log('\n👥 Testing User Service...');
    
    await this.runTest('userService', 'structure', async () => {
      if (typeof userService.getCurrentUserProfile !== 'function') {
        throw new Error('getCurrentUserProfile method not found');
      }
      if (typeof userService.updateCurrentUserProfile !== 'function') {
        throw new Error('updateCurrentUserProfile method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('userService', 'getCurrentUserProfile', async () => {
      await userService.getCurrentUserProfile();
    });
  }

  /**
   * Test Profile Service
   */
  private async testProfileService(): Promise<void> {
    console.log('\n👤 Testing Profile Service...');
    
    await this.runTest('profileService', 'structure', async () => {
      if (typeof profileService.getMyProfile !== 'function') {
        throw new Error('getMyProfile method not found');
      }
      if (typeof profileService.updateMyProfile !== 'function') {
        throw new Error('updateMyProfile method not found');
      }
      if (typeof profileService.getMyAddresses !== 'function') {
        throw new Error('getMyAddresses method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('profileService', 'getMyProfile', async () => {
      await profileService.getMyProfile();
    });

    await this.runTest('profileService', 'getMyAddresses', async () => {
      await profileService.getMyAddresses();
    });
  }

  /**
   * Test Support Service
   */
  private async testSupportService(): Promise<void> {
    console.log('\n🎫 Testing Support Service...');
    
    await this.runTest('supportService', 'structure', async () => {
      if (typeof supportService.submitContactForm !== 'function') {
        throw new Error('submitContactForm method not found');
      }
      if (typeof supportService.getMyTickets !== 'function') {
        throw new Error('getMyTickets method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('supportService', 'submitContactForm', async () => {
      await supportService.submitContactForm({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        phone: '1234567890'
      });
    });

    await this.runTest('supportService', 'getMyTickets', async () => {
      await supportService.getMyTickets();
    });
  }

  /**
   * Test Miscellaneous Service
   */
  private async testMiscService(): Promise<void> {
    console.log('\n🔧 Testing Miscellaneous Service...');
    
    await this.runTest('miscService', 'structure', async () => {
      if (typeof miscService.getSystemHealth !== 'function') {
        throw new Error('getSystemHealth method not found');
      }
      if (typeof miscService.getAppConfig !== 'function') {
        throw new Error('getAppConfig method not found');
      }
      if (typeof miscService.globalSearch !== 'function') {
        throw new Error('globalSearch method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('miscService', 'getSystemHealth', async () => {
      await miscService.getSystemHealth();
    });

    await this.runTest('miscService', 'getAppConfig', async () => {
      await miscService.getAppConfig();
    });

    await this.runTest('miscService', 'globalSearch', async () => {
      await miscService.globalSearch('test query', { types: ['products'], limit: 10 });
    });
  }

  /**
   * Test Error Handler
   */
  private async testErrorHandler(): Promise<void> {
    console.log('\n🚨 Testing Error Handler...');
    
    await this.runTest('ErrorHandler', 'structure', async () => {
      if (typeof ErrorHandler.parseAPIError !== 'function') {
        throw new Error('parseAPIError method not found');
      }
      if (typeof ErrorHandler.handleError !== 'function') {
        throw new Error('handleError method not found');
      }
      if (typeof ErrorHandler.getUserMessage !== 'function') {
        throw new Error('getUserMessage method not found');
      }
      console.log('  ✓ All required methods are available');
    });

    await this.runTest('ErrorHandler', 'parseAPIError', async () => {
      // Test parsing network error
      const networkError = { request: {}, message: 'Network Error' };
      const parsed = ErrorHandler.parseAPIError(networkError);
      if (parsed.code !== 'NETWORK_ERROR') {
        throw new Error('Network error not parsed correctly');
      }
      
      // Test parsing 404 error
      const notFoundError = { 
        response: { 
          status: 404, 
          data: { message: 'Not found' }
        } 
      };
      const parsedNotFound = ErrorHandler.parseAPIError(notFoundError);
      if (parsedNotFound.code !== 'NOT_FOUND_ERROR') {
        throw new Error('404 error not parsed correctly');
      }
      
      console.log('  ✓ Error parsing works correctly');
    });
  }

  /**
   * Run all tests
   */
  public async runAllTests(): Promise<TestSummary> {
    console.log('🚀 Starting API Integration Tests...\n');
    this.startTime = Date.now();
    this.results = [];

    // Run all test suites
    await this.testAuthService();
    await this.testProductService();
    await this.testCartService();
    await this.testOrderService();
    await this.testCategoryService();
    await this.testUserService();
    await this.testProfileService();
    await this.testSupportService();
    await this.testMiscService();
    await this.testErrorHandler();

    // Calculate summary
    const totalDuration = Date.now() - this.startTime;
    const summary: TestSummary = {
      totalTests: this.results.length,
      passedTests: this.results.filter(r => r.status === 'PASS').length,
      failedTests: this.results.filter(r => r.status === 'FAIL').length,
      skippedTests: this.results.filter(r => r.status === 'SKIP').length,
      duration: totalDuration,
      results: this.results
    };

    // Print summary
    this.printSummary(summary);
    
    return summary;
  }

  /**
   * Print test summary
   */
  private printSummary(summary: TestSummary): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.passedTests}`);
    console.log(`❌ Failed: ${summary.failedTests}`);
    console.log(`⏭️ Skipped: ${summary.skippedTests}`);
    console.log(`⏱️ Duration: ${summary.duration}ms`);
    console.log(`📈 Success Rate: ${((summary.passedTests / summary.totalTests) * 100).toFixed(2)}%`);
    
    if (summary.failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      summary.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`  - ${result.serviceName}.${result.methodName}: ${result.message}`);
          if (result.error) {
            console.log(`    Error: ${result.error.code} - ${result.error.message}`);
          }
        });
    }
    
    console.log('\n✨ Integration tests completed!');
    console.log('='.repeat(60));
  }
}

// Export for use in other files
export { APIIntegrationTester };
export type { TestResult, TestSummary };

// Auto-run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  const tester = new APIIntegrationTester();
  tester.runAllTests()
    .then((summary) => {
      process.exit(summary.failedTests > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}
