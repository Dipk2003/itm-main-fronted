/**
 * iTech Frontend-Backend Integration Verification
 * ==============================================
 * 
 * This script verifies that the integration between frontend and backend
 * is working correctly by testing connectivity, API endpoints, and
 * configuration alignment.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Simple console colors
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

class IntegrationVerifier {
  constructor() {
    this.frontendPath = process.cwd();
    this.backendPath = process.env.BACKEND_PATH || 'D:\\itech-backend\\itech-backend';
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async verify() {
    console.log(colors.blue(colors.bold('\n🔍 iTech Integration Verification\n')));

    // Run all verification tests
    await this.checkEnvironmentFiles();
    await this.checkApiConfiguration();
    await this.checkBackendConfiguration();
    await this.checkHealthEndpoints();
    await this.testConnectivity();

    // Display results
    this.displayResults();
  }

  async checkEnvironmentFiles() {
    console.log(colors.yellow('📋 Checking environment files...'));

    const envFiles = ['.env.local', '.env.staging', '.env.production'];
    
    for (const file of envFiles) {
      const filePath = path.join(this.frontendPath, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('NEXT_PUBLIC_API_URL') && content.includes('NEXT_PUBLIC_API_BASE_URL')) {
          this.addResult(true, `Environment file ${file} is properly configured`);
        } else {
          this.addResult(false, `Environment file ${file} is missing required API configuration`);
        }
      } else {
        this.addResult(false, `Environment file ${file} is missing`);
      }
    }
  }

  async checkApiConfiguration() {
    console.log(colors.yellow('🔗 Checking API configuration...'));

    // Check enhanced API client
    const enhancedApiPath = path.join(this.frontendPath, 'src/shared/config/enhanced-api-client.ts');
    if (fs.existsSync(enhancedApiPath)) {
      this.addResult(true, 'Enhanced API client is configured');
    } else {
      this.addResult(false, 'Enhanced API client is missing');
    }

    // Check updated API client utils
    const utilsApiPath = path.join(this.frontendPath, 'src/shared/utils/apiClient.ts');
    if (fs.existsSync(utilsApiPath)) {
      const content = fs.readFileSync(utilsApiPath, 'utf8');
      if (content.includes('enhanced-api-client')) {
        this.addResult(true, 'API client utils are updated to use enhanced client');
      } else {
        this.addResult(false, 'API client utils need to be updated');
      }
    } else {
      this.addResult(false, 'API client utils file is missing');
    }

    // Check health check API route
    const healthApiPath = path.join(this.frontendPath, 'src/app/api/health/route.ts');
    if (fs.existsSync(healthApiPath)) {
      this.addResult(true, 'Frontend health check API route is configured');
    } else {
      this.addResult(false, 'Frontend health check API route is missing');
    }
  }

  async checkBackendConfiguration() {
    console.log(colors.yellow('⚙️ Checking backend configuration...'));

    // Check backend application.properties
    const propsPath = path.join(this.backendPath, 'src/main/resources/application.properties');
    if (fs.existsSync(propsPath)) {
      const content = fs.readFileSync(propsPath, 'utf8');
      if (content.includes('spring.web.cors.allowed-origins') && 
          content.includes('management.endpoints.web.exposure.include')) {
        this.addResult(true, 'Backend application.properties is properly configured');
      } else {
        this.addResult(false, 'Backend application.properties needs CORS and actuator configuration');
      }
    } else {
      this.addResult(false, 'Backend application.properties file not found');
    }

    // Check backend health controller
    const healthControllerPath = path.join(this.backendPath, 'src/main/java/com/itech/itech_backend/modules/shared/controller/HealthController.java');
    if (fs.existsSync(healthControllerPath)) {
      const content = fs.readFileSync(healthControllerPath, 'utf8');
      if (content.includes('@GetMapping("/health")') && content.includes('checkDatabaseHealth')) {
        this.addResult(true, 'Backend health controller is enhanced');
      } else {
        this.addResult(false, 'Backend health controller needs enhancement');
      }
    } else {
      this.addResult(false, 'Backend health controller is missing');
    }
  }

  async checkHealthEndpoints() {
    console.log(colors.yellow('🏥 Checking health endpoints...'));

    try {
      // Test frontend health endpoint
      const frontendHealthResponse = await this.makeRequest('http://localhost:3001/api/health');
      if (frontendHealthResponse) {
        this.addResult(true, 'Frontend health endpoint is accessible');
      } else {
        this.addResult(false, 'Frontend health endpoint is not accessible (server may not be running)');
      }
    } catch (error) {
      this.addResult(false, 'Frontend health endpoint test failed');
    }

    try {
      // Test backend health endpoint
      const backendHealthResponse = await this.makeRequest('http://localhost:8080/api/health');
      if (backendHealthResponse) {
        this.addResult(true, 'Backend health endpoint is accessible');
      } else {
        this.addResult(false, 'Backend health endpoint is not accessible (server may not be running)');
      }
    } catch (error) {
      this.addResult(false, 'Backend health endpoint test failed');
    }
  }

  async testConnectivity() {
    console.log(colors.yellow('🌐 Testing API connectivity...'));

    try {
      // Test CORS
      const corsResponse = await this.makeRequest('http://localhost:8080/api/health', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3001',
          'Access-Control-Request-Method': 'GET'
        }
      });
      
      if (corsResponse) {
        this.addResult(true, 'CORS is properly configured');
      } else {
        this.addResult(false, 'CORS configuration issue detected');
      }
    } catch (error) {
      this.addResult(false, 'CORS connectivity test failed');
    }
  }

  async makeRequest(url, options = {}) {
    try {
      // Use fetch if available, otherwise skip the test
      if (typeof fetch === 'undefined') {
        console.log(colors.gray(`   Skipping ${url} (fetch not available in Node.js)`));
        return null;
      }

      const response = await fetch(url, {
        timeout: 5000,
        ...options
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  addResult(passed, message) {
    this.results.tests.push({ passed, message });
    if (passed) {
      this.results.passed++;
      console.log(colors.green(`   ✓ ${message}`));
    } else {
      this.results.failed++;
      console.log(colors.red(`   ✗ ${message}`));
    }
  }

  displayResults() {
    console.log(colors.blue(colors.bold('\n📊 Integration Verification Results\n')));
    
    console.log(`${colors.green('Passed:')} ${this.results.passed}`);
    console.log(`${colors.red('Failed:')} ${this.results.failed}`);
    console.log(`${colors.gray('Total:')} ${this.results.tests.length}`);

    const successRate = (this.results.passed / this.results.tests.length * 100).toFixed(1);
    console.log(`${colors.blue('Success Rate:')} ${successRate}%`);

    if (this.results.failed === 0) {
      console.log(colors.green(colors.bold('\n🎉 All integration tests passed! Your setup is ready.')));
      console.log(colors.gray('\nNext steps:'));
      console.log(colors.gray('1. Start the backend: cd to backend directory and run "mvn spring-boot:run"'));
      console.log(colors.gray('2. Start the frontend: run "npm run dev"'));
      console.log(colors.gray('3. Open http://localhost:3001 to access the application'));
    } else {
      console.log(colors.red(colors.bold('\n⚠️ Some integration tests failed.')));
      console.log(colors.gray('Please address the failed tests before proceeding.'));
    }

    // Generate quick start guide
    this.generateQuickStartGuide();
  }

  generateQuickStartGuide() {
    const quickStart = `
# iTech Quick Start Guide
========================

## Prerequisites
- Java 21+ installed
- Node.js 18+ installed
- MySQL running on localhost:3306 with database 'itech_db'
- Maven installed

## Backend Setup
1. Navigate to backend directory:
   cd "${this.backendPath}"

2. Start the backend server:
   mvn spring-boot:run

3. Verify backend is running:
   curl http://localhost:8080/api/health

## Frontend Setup
1. Navigate to frontend directory:
   cd "${this.frontendPath}"

2. Install dependencies (if not already done):
   npm install

3. Start the frontend server:
   npm run dev

4. Verify frontend is running:
   curl http://localhost:3001/api/health

## Access URLs
- Frontend: http://localhost:3001
- Backend API: http://localhost:8080/api
- Backend Health: http://localhost:8080/api/health
- Frontend Health: http://localhost:3001/api/health

## Subdomain Testing (Local)
You can test subdomain functionality by adding these entries to your hosts file:
127.0.0.1 vendor.localhost
127.0.0.1 admin.localhost
127.0.0.1 support.localhost
127.0.0.1 customer.localhost

Then access:
- http://vendor.localhost:3001
- http://admin.localhost:3001
- etc.

## Troubleshooting
- Ensure MySQL is running and accessible
- Check that ports 3001 and 8080 are not in use by other applications
- Verify environment variables in .env.local are correct
- Check console logs for any errors

## Production Deployment
Run the generated build scripts in the scripts/ directory for production deployment.
`;

    fs.writeFileSync(path.join(this.frontendPath, 'QUICK_START.md'), quickStart);
    console.log(colors.blue('\n📝 Generated QUICK_START.md guide'));
  }
}

// Run verification
const verifier = new IntegrationVerifier();
verifier.verify().catch(console.error);
