#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS_FILE = 'frontend-test-results.json';

// All pages to test based on the app directory structure
const PAGES_TO_TEST = [
  '/',
  '/about-us',
  '/api-docs',
  '/auth/admin/login',
  '/auth/employee/login',
  '/auth/forgot-password',
  '/auth/user/login',
  '/auth/user/register',
  '/auth/vendor/login',
  '/auth/vendor/register',
  '/cart',
  '/categories',
  '/chat',
  '/cities',
  '/complaints',
  '/contact-us',
  '/customer-care',
  '/dashboard',
  '/dashboard/admin',
  '/dashboard/analytics',
  '/dashboard/cto',
  '/dashboard/employee',
  '/dashboard/finance',
  '/dashboard/support',
  '/dashboard/user',
  '/dashboard/vendor-panel',
  '/directory',
  '/help',
  '/integration-test',
  '/orders',
  '/post-requirement',
  '/privacy-policy',
  '/products',
  '/products-you-buy',
  '/profile',
  '/search',
  '/search-suppliers',
  '/settings',
  '/terms-of-use',
  '/unauthorized'
];

class FrontendTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Frontend Validation',
      summary: {
        totalPages: PAGES_TO_TEST.length,
        passedPages: 0,
        failedPages: 0,
        totalErrors: 0,
        overallStatus: 'UNKNOWN'
      },
      pages: [],
      errors: [],
      recommendations: []
    };
  }

  async testPage(pagePath) {
    return new Promise((resolve) => {
      const url = `${BASE_URL}${pagePath}`;
      const startTime = Date.now();
      
      console.log(`🔍 Testing: ${pagePath}`);
      
      const req = http.get(url, (res) => {
        const loadTime = Date.now() - startTime;
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          const result = {
            path: pagePath,
            url: url,
            status: res.statusCode,
            loadTime: loadTime,
            success: res.statusCode >= 200 && res.statusCode < 400,
            contentLength: body.length,
            hasContent: body.length > 0,
            hasTitle: body.includes('<title>'),
            hasReactRoot: body.includes('__next') || body.includes('root'),
            hasJavaScript: body.includes('<script'),
            hasCSS: body.includes('<style') || body.includes('.css'),
            errors: []
          };

          // Check for common error patterns in HTML
          if (body.includes('Application error') || body.includes('500') || body.includes('Error:')) {
            result.errors.push('Server/Application error detected in page content');
          }
          
          if (body.includes('404') || body.includes('Not Found')) {
            result.errors.push('404 Not Found error detected');
          }
          
          if (!result.hasReactRoot && result.success) {
            result.errors.push('Missing React root element - page may not be rendering properly');
          }

          if (result.success && result.errors.length === 0) {
            console.log(`✅ PASS: ${pagePath} (${loadTime}ms)`);
            this.results.summary.passedPages++;
          } else {
            console.log(`❌ FAIL: ${pagePath} - Status: ${res.statusCode}, Errors: ${result.errors.length}`);
            this.results.summary.failedPages++;
            this.results.summary.totalErrors += result.errors.length;
          }

          this.results.pages.push(result);
          resolve(result);
        });
      });

      req.on('error', (error) => {
        const result = {
          path: pagePath,
          url: url,
          status: 0,
          loadTime: Date.now() - startTime,
          success: false,
          error: error.message,
          errors: [error.message]
        };
        
        console.log(`❌ ERROR: ${pagePath} - ${error.message}`);
        this.results.summary.failedPages++;
        this.results.summary.totalErrors++;
        this.results.pages.push(result);
        resolve(result);
      });

      // Set timeout for slow pages
      req.setTimeout(30000, () => {
        req.destroy();
        const result = {
          path: pagePath,
          url: url,
          status: 0,
          loadTime: 30000,
          success: false,
          error: 'Request timeout (30s)',
          errors: ['Request timeout after 30 seconds']
        };
        
        console.log(`⏰ TIMEOUT: ${pagePath}`);
        this.results.summary.failedPages++;
        this.results.summary.totalErrors++;
        this.results.pages.push(result);
        resolve(result);
      });
    });
  }

  async testAllPages() {
    console.log(`🚀 Starting frontend validation for ${PAGES_TO_TEST.length} pages...\n`);
    
    // Test pages in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < PAGES_TO_TEST.length; i += batchSize) {
      const batch = PAGES_TO_TEST.slice(i, i + batchSize);
      const promises = batch.map(page => this.testPage(page));
      await Promise.all(promises);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async checkServerHealth() {
    console.log('\n🔍 Checking server health...');
    
    try {
      await this.testPage('/health');
      await this.testPage('/api/health');
      console.log('✅ Health endpoints accessible');
    } catch (error) {
      console.log('⚠️ Health endpoints may not be available');
      this.results.errors.push('Health endpoints not accessible');
    }
  }

  generateReport() {
    // Calculate overall status
    const successRate = this.results.summary.passedPages / this.results.summary.totalPages;
    
    if (successRate >= 0.95 && this.results.summary.totalErrors === 0) {
      this.results.summary.overallStatus = 'EXCELLENT';
    } else if (successRate >= 0.90) {
      this.results.summary.overallStatus = 'GOOD';
    } else if (successRate >= 0.75) {
      this.results.summary.overallStatus = 'ACCEPTABLE';
    } else {
      this.results.summary.overallStatus = 'NEEDS_ATTENTION';
    }

    // Generate recommendations
    if (this.results.summary.totalErrors > 0) {
      this.results.recommendations.push('Fix identified errors to improve frontend reliability');
    }
    
    const slowPages = this.results.pages.filter(p => p.loadTime > 3000);
    if (slowPages.length > 0) {
      this.results.recommendations.push(`Optimize ${slowPages.length} slow-loading pages (>3s load time)`);
    }

    const failedPages = this.results.pages.filter(p => !p.success);
    if (failedPages.length > 0) {
      this.results.recommendations.push(`Fix ${failedPages.length} failing pages to achieve 100% success rate`);
    }

    // Save results to file
    fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Test results saved to: ${TEST_RESULTS_FILE}`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 FRONTEND VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`📊 Overall Status: ${this.results.summary.overallStatus}`);
    console.log(`📄 Total Pages: ${this.results.summary.totalPages}`);
    console.log(`✅ Passed Pages: ${this.results.summary.passedPages}`);
    console.log(`❌ Failed Pages: ${this.results.summary.failedPages}`);
    console.log(`🐛 Total Errors: ${this.results.summary.totalErrors}`);
    console.log(`📈 Success Rate: ${((this.results.summary.passedPages / this.results.summary.totalPages) * 100).toFixed(1)}%`);
    
    if (this.results.summary.failedPages > 0) {
      console.log('\n❌ FAILED PAGES:');
      this.results.pages
        .filter(p => !p.success)
        .forEach(p => {
          console.log(`   • ${p.path} - Status: ${p.status}, Errors: ${p.errors?.length || 0}`);
        });
    }

    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }

    console.log('='.repeat(80));
    
    if (this.results.summary.overallStatus === 'EXCELLENT' && this.results.summary.totalErrors === 0) {
      console.log('🎉 FRONTEND VALIDATION PASSED: All pages working properly with zero errors!');
    } else {
      console.log('⚠️ FRONTEND NEEDS ATTENTION: Some issues found that need to be addressed.');
    }
    console.log('='.repeat(80));
  }

  async run() {
    try {
      await this.checkServerHealth();
      await this.testAllPages();
      this.generateReport();
      this.printSummary();
      
      return this.results.summary.overallStatus === 'EXCELLENT' && this.results.summary.totalErrors === 0;
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      return false;
    }
  }
}

// Run the test suite
async function main() {
  console.log('🔧 ITM Frontend Validation Test Suite');
  console.log('=====================================\n');
  
  const tester = new FrontendTester();
  const success = await tester.run();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = FrontendTester;
