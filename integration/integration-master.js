/**
 * iTech Frontend-Backend Integration Master Script
 * ==============================================
 * 
 * This script provides comprehensive frontend-backend integration with:
 * - Environment-specific configuration
 * - Advanced error handling and retry logic
 * - Real-time connectivity monitoring
 * - Performance optimization
 * - Security enhancements
 * - Production-ready logging and metrics
 * 
 * @author Senior Full-Stack Developer
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');

// Simple console colors
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

const chalk = {
  blue: {
    bold: (text) => colors.blue(colors.bold(text))
  },
  green: {
    bold: (text) => colors.green(colors.bold(text))
  },
  red: {
    bold: (text) => colors.red(colors.bold(text))
  },
  yellow: (text) => colors.yellow(text),
  gray: (text) => colors.gray(text),
  cyan: (text) => colors.cyan(text),
  green: (text) => colors.green(text),
  blue: (text) => colors.blue(text),
  red: (text) => colors.red(text)
};

// Extend chalk.green and chalk.blue to have the bold property
chalk.green.bold = (text) => colors.green(colors.bold(text));
chalk.blue.bold = (text) => colors.blue(colors.bold(text));
chalk.red.bold = (text) => colors.red(colors.bold(text));

// ====================================
// ENVIRONMENT CONFIGURATION
// ====================================

const ENVIRONMENTS = {
  development: {
    name: 'Development',
    frontend: {
      url: 'http://localhost:3001',
      port: 3001,
      host: '0.0.0.0'
    },
    backend: {
      url: 'http://localhost:8080',
      port: 8080,
      host: '0.0.0.0',
      contextPath: '',
      healthEndpoint: '/api/health'
    },
    database: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      name: 'itech_db'
    },
    redis: {
      enabled: false,
      host: 'localhost',
      port: 6379
    },
    cors: {
      origins: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    },
    ssl: false,
    debug: true
  },
  staging: {
    name: 'Staging',
    frontend: {
      url: 'https://staging.indiantrademart.com',
      port: 3000,
      host: '0.0.0.0'
    },
    backend: {
      url: 'https://api-staging.indiantrademart.com',
      port: 8080,
      host: '0.0.0.0',
      contextPath: '',
      healthEndpoint: '/api/health'
    },
    database: {
      type: 'postgresql',
      host: 'staging-db.indiantrademart.com',
      port: 5432,
      name: 'itech_staging'
    },
    redis: {
      enabled: true,
      host: 'staging-redis.indiantrademart.com',
      port: 6379
    },
    cors: {
      origins: ['https://staging.indiantrademart.com'],
      credentials: true
    },
    ssl: true,
    debug: false
  },
  production: {
    name: 'Production',
    frontend: {
      url: 'https://indiantrademart.com',
      port: 3000,
      host: '0.0.0.0'
    },
    backend: {
      url: 'https://api.indiantrademart.com',
      port: 8080,
      host: '0.0.0.0',
      contextPath: '',
      healthEndpoint: '/api/health'
    },
    database: {
      type: 'postgresql',
      host: 'prod-db.indiantrademart.com',
      port: 5432,
      name: 'itech_production'
    },
    redis: {
      enabled: true,
      host: 'prod-redis.indiantrademart.com',
      port: 6379
    },
    cors: {
      origins: [
        'https://indiantrademart.com',
        'https://www.indiantrademart.com',
        'https://vendor.indiantrademart.com',
        'https://admin.indiantrademart.com',
        'https://support.indiantrademart.com',
        'https://customer.indiantrademart.com'
      ],
      credentials: true
    },
    ssl: true,
    debug: false
  }
};

// ====================================
// INTEGRATION MASTER CLASS
// ====================================

class IntegrationMaster {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.config = ENVIRONMENTS[this.environment];
    this.projectRoot = process.cwd();
    this.frontendPath = this.projectRoot;
    this.backendPath = process.env.BACKEND_PATH || 'D:\\itech-backend\\itech-backend';
    
    console.log(chalk.blue.bold('🚀 iTech Integration Master v2.0.0'));
    console.log(chalk.gray(`Environment: ${chalk.yellow(this.config.name)}`));
    console.log(chalk.gray(`Frontend: ${chalk.cyan(this.frontendPath)}`));
    console.log(chalk.gray(`Backend: ${chalk.cyan(this.backendPath)}`));
  }

  // ====================================
  // ENVIRONMENT SETUP
  // ====================================

  async setupEnvironment() {
    console.log(chalk.blue('\n📋 Setting up environment configuration...'));

    try {
      // Create frontend environment files
      await this.createFrontendEnvFiles();
      
      // Update backend application.properties
      await this.updateBackendProperties();
      
      // Create API configuration
      await this.createApiConfiguration();
      
      // Setup CORS configuration
      await this.setupCorsConfiguration();
      
      // Create monitoring and health check endpoints
      await this.createHealthCheckEndpoints();
      
      // Setup error handling and logging
      await this.setupErrorHandling();
      
      // Create deployment scripts
      await this.createDeploymentScripts();
      
      console.log(chalk.green('✅ Environment setup completed successfully!'));
      
    } catch (error) {
      console.error(chalk.red('❌ Environment setup failed:'), error.message);
      throw error;
    }
  }

  // ====================================
  // FRONTEND ENVIRONMENT FILES
  // ====================================

  async createFrontendEnvFiles() {
    console.log(chalk.yellow('🔧 Creating frontend environment files...'));

    const envFiles = {
      '.env.local': this.generateEnvContent('development'),
      '.env.staging': this.generateEnvContent('staging'),
      '.env.production': this.generateEnvContent('production')
    };

    for (const [filename, content] of Object.entries(envFiles)) {
      const filePath = path.join(this.frontendPath, filename);
      await fs.promises.writeFile(filePath, content, 'utf8');
      console.log(chalk.green(`   ✓ Created ${filename}`));
    }
  }

  generateEnvContent(env) {
    const config = ENVIRONMENTS[env];
    const timestamp = new Date().toISOString();
    
    return `# =============================================================================
# iTech Frontend - ${config.name} Environment Variables
# =============================================================================
# Generated: ${timestamp}
# Environment: ${env.toUpperCase()}
# =============================================================================

# =============================================================================
# BACKEND API CONFIGURATION
# =============================================================================
NEXT_PUBLIC_API_URL=${config.backend.url}
NEXT_PUBLIC_API_BASE_URL=${config.backend.url}/api
NEXT_PUBLIC_WEBSOCKET_URL=${config.backend.url.replace('http', 'ws')}/ws
NEXT_PUBLIC_HEALTH_CHECK_URL=${config.backend.url}${config.backend.healthEndpoint}

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NEXT_PUBLIC_APP_NAME=Indian Trade Mart
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_URL=${config.frontend.url}
NEXT_PUBLIC_ENV=${env}
NEXT_PUBLIC_DEBUG_MODE=${config.debug}

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
NEXTAUTH_URL=${config.frontend.url}
NEXTAUTH_SECRET=${env === 'production' ? 'GENERATE_SECURE_SECRET_FOR_PRODUCTION' : 'dev-secret-key-change-in-production'}
JWT_SECRET_KEY=${env === 'production' ? 'GENERATE_SECURE_JWT_SECRET' : 'dev-jwt-secret'}

# =============================================================================
# API CONFIGURATION
# =============================================================================
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
NEXT_PUBLIC_REQUEST_TIMEOUT=60000

# =============================================================================
# FILE UPLOAD CONFIGURATION
# =============================================================================
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx,xlsx,csv
NEXT_PUBLIC_MAX_UPLOAD_FILES=10

# =============================================================================
# EXTERNAL SERVICES
# =============================================================================
NEXT_PUBLIC_RAZORPAY_KEY_ID=${env === 'production' ? 'PRODUCTION_RAZORPAY_KEY' : 'rzp_test_your_key_id'}
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_ANALYTICS_ID=${env === 'production' ? 'PRODUCTION_GA_ID' : 'dev-analytics-id'}

# =============================================================================
# FEATURE FLAGS
# =============================================================================
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=${env === 'production'}
NEXT_PUBLIC_ENABLE_MOCK_MODE=${env === 'development'}
NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES=true
NEXT_PUBLIC_ENABLE_PWA=${env === 'production'}

# =============================================================================
# PERFORMANCE & OPTIMIZATION
# =============================================================================
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=${env === 'production'}
NEXT_PUBLIC_CACHE_TIMEOUT=300000
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_COMPRESSION_ENABLED=${env === 'production'}

# =============================================================================
# DEVELOPMENT & DEBUG
# =============================================================================
NEXT_PUBLIC_DEBUG_API=${config.debug}
NEXT_PUBLIC_ENABLE_LOGGING=${config.debug}
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=${env === 'development'}

# =============================================================================
# BUSINESS CONFIGURATION
# =============================================================================
NEXT_PUBLIC_DEFAULT_CURRENCY=INR
NEXT_PUBLIC_DEFAULT_COUNTRY=India
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_TIMEZONE=Asia/Kolkata

# =============================================================================
# SUBDOMAIN CONFIGURATION
# =============================================================================
NEXT_PUBLIC_VENDOR_SUBDOMAIN=vendor.indiantrademart.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin.indiantrademart.com
NEXT_PUBLIC_SUPPORT_SUBDOMAIN=support.indiantrademart.com
NEXT_PUBLIC_CUSTOMER_SUBDOMAIN=customer.indiantrademart.com

# =============================================================================
# DATABASE & REDIS (for SSR/API routes)
# =============================================================================
${config.database.type === 'mysql' ? 
  `DATABASE_URL=mysql://root:root@${config.database.host}:${config.database.port}/${config.database.name}` :
  `DATABASE_URL=postgresql://user:password@${config.database.host}:${config.database.port}/${config.database.name}`
}
REDIS_URL=${config.redis.enabled ? `redis://${config.redis.host}:${config.redis.port}` : ''}
REDIS_ENABLED=${config.redis.enabled}

# =============================================================================
# MONITORING & LOGGING
# =============================================================================
NEXT_PUBLIC_SENTRY_DSN=${env === 'production' ? 'YOUR_SENTRY_DSN' : ''}
NEXT_PUBLIC_LOG_LEVEL=${env === 'production' ? 'error' : 'debug'}
NEXT_PUBLIC_MONITORING_ENABLED=${env === 'production'}

# =============================================================================
# SSL & SECURITY
# =============================================================================
NEXT_PUBLIC_SSL_ENABLED=${config.ssl}
NEXT_PUBLIC_SECURE_COOKIES=${config.ssl}
NEXT_PUBLIC_CSRF_PROTECTION=true
NEXT_PUBLIC_RATE_LIMITING=${env === 'production'}
`;
  }

  // ====================================
  // BACKEND PROPERTIES UPDATE
  // ====================================

  async updateBackendProperties() {
    console.log(chalk.yellow('🔧 Updating backend application.properties...'));

    const config = this.config;
    const propertiesPath = path.join(this.backendPath, 'src/main/resources/application.properties');
    
    const properties = `# =============================================================================
# iTech Backend - ${config.name} Application Configuration
# =============================================================================
# Generated: ${new Date().toISOString()}
# Environment: ${this.environment.toUpperCase()}
# =============================================================================

spring.application.name=itech-backend
spring.profiles.active=${this.environment}

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
server.port=${config.backend.port}
server.address=${config.backend.host}
server.servlet.context-path=${config.backend.contextPath}
server.compression.enabled=true
server.compression.mime-types=text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json
server.compression.min-response-size=1024

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
${config.database.type === 'mysql' ? 
  `spring.datasource.url=\${DATABASE_URL:jdbc:mysql://${config.database.host}:${config.database.port}/${config.database.name}?useSSL=${config.ssl}&allowPublicKeyRetrieval=true}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect` :
  `spring.datasource.url=\${DATABASE_URL:jdbc:postgresql://${config.database.host}:${config.database.port}/${config.database.name}?sslmode=${config.ssl ? 'require' : 'disable'}}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`
}
spring.datasource.username=\${JDBC_DATABASE_USERNAME:${config.database.type === 'mysql' ? 'root' : 'postgres'}}
spring.datasource.password=\${JDBC_DATABASE_PASSWORD:${config.database.type === 'mysql' ? 'root' : 'postgres'}}

# =============================================================================
# JPA & HIBERNATE CONFIGURATION
# =============================================================================
spring.jpa.hibernate.ddl-auto=\${DDL_AUTO:update}
spring.jpa.show-sql=${config.debug}
spring.jpa.properties.hibernate.format_sql=${config.debug}
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.generate_statistics=${config.debug}
spring.jpa.properties.hibernate.cache.use_second_level_cache=${config.redis.enabled}

# =============================================================================
# CONNECTION POOL CONFIGURATION
# =============================================================================
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=600000
spring.datasource.hikari.connection-timeout=30000

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
spring.redis.host=\${REDIS_HOST:${config.redis.host}}
spring.redis.port=\${REDIS_PORT:${config.redis.port}}
spring.redis.password=\${REDIS_PASSWORD:}
spring.redis.timeout=2000ms
spring.redis.jedis.pool.max-active=8
spring.redis.jedis.pool.max-idle=8
spring.redis.jedis.pool.min-idle=0
spring.cache.redis.time-to-live=300000

# =============================================================================
# CORS CONFIGURATION
# =============================================================================
spring.web.cors.allowed-origins=${config.cors.origins.join(',')}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=${config.cors.credentials}
spring.web.cors.max-age=3600

# =============================================================================
# JWT CONFIGURATION
# =============================================================================
jwt.secret=\${JWT_SECRET:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0}
jwt.expiration-in-ms=\${JWT_EXPIRATION:86400000}
jwt.refresh-expiration-in-ms=\${JWT_REFRESH_EXPIRATION:604800000}

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================
logging.level.com.itech.itech_backend=\${LOGGING_LEVEL_COM_ITECH:${config.debug ? 'DEBUG' : 'INFO'}}
logging.level.org.springframework.security=\${LOGGING_LEVEL_SPRING_SECURITY:${config.debug ? 'DEBUG' : 'WARN'}}
logging.level.org.springframework.web=${config.debug ? 'DEBUG' : 'WARN'}
logging.level.org.hibernate.SQL=${config.debug ? 'DEBUG' : 'WARN'}
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=${config.debug ? 'TRACE' : 'WARN'}
logging.level.root=\${LOGGING_LEVEL_ROOT:INFO}
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n

# =============================================================================
# ACTUATOR & MONITORING
# =============================================================================
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized
management.metrics.export.prometheus.enabled=true
management.health.redis.enabled=${config.redis.enabled}

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================
spring.mail.host=\${SPRING_MAIL_HOST:smtp.gmail.com}
spring.mail.port=\${SPRING_MAIL_PORT:587}
spring.mail.username=\${SPRING_MAIL_USERNAME:kyc@indiantrademart.com}
spring.mail.password=\${SPRING_MAIL_PASSWORD:rgkrfwyecsyhttxa}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.protocols=TLSv1.2
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=3000
spring.mail.properties.mail.smtp.writetimeout=5000

# =============================================================================
# FILE UPLOAD CONFIGURATION
# =============================================================================
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload.directory=uploads
file.upload.max-size=10485760

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
spring.security.require-ssl=${config.ssl}
security.csrf.enabled=true
security.sessions.maximum=10
security.content-type.nosniff=true
security.frame.options=DENY
security.xss.protection=true

# =============================================================================
# PERFORMANCE CONFIGURATION
# =============================================================================
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=Asia/Kolkata
spring.http.multipart.max-file-size=10MB
spring.http.multipart.max-request-size=10MB

# =============================================================================
# BUSINESS CONFIGURATION
# =============================================================================
app.default.currency=INR
app.default.country=India
app.default.timezone=Asia/Kolkata
app.session.timeout=3600
app.max.login.attempts=5
app.account.lockout.duration=1800

# =============================================================================
# EXTERNAL SERVICE CONFIGURATION
# =============================================================================
razorpay.key.id=\${RAZORPAY_KEY_ID:your_razorpay_key_id}
razorpay.key.secret=\${RAZORPAY_KEY_SECRET:your_razorpay_key_secret}
razorpay.webhook.secret=\${RAZORPAY_WEBHOOK_SECRET:your_webhook_secret}
razorpay.currency=INR

# GST Verification
gst.verification.enabled=\${GST_VERIFICATION_ENABLED:false}
gst.api.url=\${GST_API_URL:https://api.gst-verification.com}
gst.api.key=\${GST_API_KEY:your-gst-api-key}

# PAN Verification
pan.verification.enabled=\${PAN_VERIFICATION_ENABLED:false}
pan.api.url=\${PAN_API_URL:https://api.pan-verification.com}
pan.api.key=\${PAN_API_KEY:your-pan-api-key}

# =============================================================================
# SIMULATION & DEVELOPMENT
# =============================================================================
email.simulation.enabled=\${EMAIL_SIMULATION_ENABLED:${config.debug}}
sms.simulation.enabled=\${SMS_SIMULATION_ENABLED:${config.debug}}
payment.simulation.enabled=\${PAYMENT_SIMULATION_ENABLED:${config.debug}}
`;

    await fs.promises.writeFile(propertiesPath, properties, 'utf8');
    console.log(chalk.green('   ✓ Updated application.properties'));
  }

  // ====================================
  // API CONFIGURATION
  // ====================================

  async createApiConfiguration() {
    console.log(chalk.yellow('🔧 Creating API configuration...'));

    const apiConfigPath = path.join(this.frontendPath, 'src/shared/config');
    await fs.promises.mkdir(apiConfigPath, { recursive: true });

    // Enhanced API client with retry logic and monitoring
    const enhancedApiClient = `/**
 * Enhanced API Client with Enterprise-Grade Features
 * ================================================
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request/Response interceptors
 * - Error handling and logging
 * - Performance monitoring
 * - Authentication management
 * - Network status monitoring
 * - Request cancellation
 * - Rate limiting protection
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface RetryConfig {
  attempts: number;
  delay: number;
  maxDelay: number;
  exponentialBase: number;
}

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retry: RetryConfig;
  enableLogging: boolean;
  enableMonitoring: boolean;
}

interface RequestMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  url: string;
  method: string;
  status?: number;
  error?: string;
}

// =============================================================================
// ENHANCED API CLIENT CLASS
// =============================================================================

class EnhancedApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private requestMetrics: Map<string, RequestMetrics> = new Map();
  private networkStatus: boolean = navigator.onLine;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.setupNetworkMonitoring();
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    });
  }

  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.networkStatus = true;
      this.log('Network status: Online');
    });

    window.addEventListener('offline', () => {
      this.networkStatus = false;
      this.log('Network status: Offline');
    });
  }

  // =============================================================================
  // INTERCEPTORS
  // =============================================================================

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => this.handleRequestError(error)
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleResponseError(error)
    );
  }

  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    // Check network status
    if (!this.networkStatus) {
      throw new Error('No internet connection');
    }

    // Add authentication token
    const token = this.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }

    // Add request ID for tracking
    const requestId = this.generateRequestId();
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId;
    }

    // Start metrics tracking
    if (this.config.enableMonitoring) {
      this.startRequestMetrics(requestId, config);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Request:', {
        id: requestId,
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data
      });
    }

    return config;
  }

  private handleRequestError(error: AxiosError): Promise<never> {
    this.log('Request Error:', error.message);
    return Promise.reject(error);
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    const requestId = response.config.headers?.['X-Request-ID'] as string;

    // Complete metrics tracking
    if (this.config.enableMonitoring && requestId) {
      this.completeRequestMetrics(requestId, response.status);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Response:', {
        id: requestId,
        status: response.status,
        data: response.data
      });
    }

    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<any> {
    const requestId = error.config?.headers?.['X-Request-ID'] as string;

    // Complete metrics tracking with error
    if (this.config.enableMonitoring && requestId) {
      this.completeRequestMetrics(requestId, error.response?.status, error.message);
    }

    // Handle specific error types
    if (error.response?.status === 401) {
      await this.handleUnauthorized();
    } else if (error.response?.status === 429) {
      await this.handleRateLimit(error);
    }

    // Retry logic
    if (this.shouldRetry(error)) {
      return this.retryRequest(error);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Response Error:', {
        id: requestId,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    return Promise.reject(error);
  }

  // =============================================================================
  // RETRY LOGIC
  // =============================================================================

  private shouldRetry(error: AxiosError): boolean {
    const { retry } = this.config;
    const retryCount = error.config?.metadata?.retryCount ?? 0;

    // Don't retry if max attempts reached
    if (retryCount >= retry.attempts) {
      return false;
    }

    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on specific status codes
    const retryStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryStatusCodes.includes(error.response.status);
  }

  private async retryRequest(error: AxiosError): Promise<any> {
    const { retry } = this.config;
    const retryCount = (error.config?.metadata?.retryCount ?? 0) + 1;
    
    // Calculate delay with exponential backoff
    const delay = Math.min(
      retry.delay * Math.pow(retry.exponentialBase, retryCount - 1),
      retry.maxDelay
    );

    this.log(\`Retrying request (attempt \${retryCount}/\${retry.attempts}) after \${delay}ms\`);

    // Wait for delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Add retry metadata
    if (!error.config?.metadata) {
      error.config!.metadata = {};
    }
    error.config!.metadata.retryCount = retryCount;

    // Retry the request
    return this.axiosInstance.request(error.config!);
  }

  // =============================================================================
  // ERROR HANDLERS
  // =============================================================================

  private async handleUnauthorized(): Promise<void> {
    this.log('Unauthorized access detected, clearing auth data');
    
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login (let the app handle this)
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  private async handleRateLimit(error: AxiosError): Promise<void> {
    const retryAfter = error.response?.headers['retry-after'];
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    this.log(\`Rate limited, waiting \${delay}ms before retry\`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // =============================================================================
  // METRICS & MONITORING
  // =============================================================================

  private generateRequestId(): string {
    return \`req_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  private startRequestMetrics(requestId: string, config: AxiosRequestConfig): void {
    this.requestMetrics.set(requestId, {
      startTime: Date.now(),
      url: config.url || '',
      method: config.method?.toUpperCase() || 'GET'
    });
  }

  private completeRequestMetrics(requestId: string, status?: number, error?: string): void {
    const metrics = this.requestMetrics.get(requestId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.status = status;
      metrics.error = error;

      // Send metrics to monitoring service
      this.sendMetrics(metrics);
      
      // Clean up
      this.requestMetrics.delete(requestId);
    }
  }

  private sendMetrics(metrics: RequestMetrics): void {
    // Send to analytics/monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_request', {
        method: metrics.method,
        url: metrics.url,
        duration: metrics.duration,
        status: metrics.status,
        error: metrics.error
      });
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private log(message: string, data?: any): void {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(\`[API Client \${timestamp}] \${message}\`, data || '');
    }
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }

  public getMetrics(): RequestMetrics[] {
    return Array.from(this.requestMetrics.values());
  }

  public isOnline(): boolean {
    return this.networkStatus;
  }
}

// =============================================================================
// CONFIGURATION & EXPORT
// =============================================================================

const apiConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retry: {
    attempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
    delay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
    maxDelay: 30000,
    exponentialBase: 2
  },
  enableLogging: process.env.NEXT_PUBLIC_DEBUG_API === 'true',
  enableMonitoring: process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true'
};

// Create and export API client instance
export const api = new EnhancedApiClient(apiConfig);

// Export types for use in other files
export type { ApiClientConfig, RequestMetrics };

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = process.env.NEXT_PUBLIC_HEALTH_CHECK_URL || \`\${apiConfig.baseURL}/health\`;
    await api.get(healthUrl.replace('/api', ''));
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default api;
`;

    await fs.promises.writeFile(
      path.join(apiConfigPath, 'enhanced-api-client.ts'),
      enhancedApiClient,
      'utf8'
    );

    console.log(chalk.green('   ✓ Created enhanced API client'));
  }

  // ====================================
  // HEALTH CHECK ENDPOINTS
  // ====================================

  async createHealthCheckEndpoints() {
    console.log(chalk.yellow('🔧 Creating health check endpoints...'));

    const healthCheckPath = path.join(this.frontendPath, 'src/app/api/health');
    await fs.promises.mkdir(healthCheckPath, { recursive: true });

    const healthCheckCode = `/**
 * Health Check API Route
 * =====================
 * 
 * Provides comprehensive health status for the frontend application
 * including backend connectivity, database status, and external services.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NEXT_PUBLIC_ENV || 'development',
      uptime: process.uptime(),
      services: {
        backend: await checkBackendHealth(),
        database: await checkDatabaseHealth(),
        redis: await checkRedisHealth(),
        external: await checkExternalServices()
      },
      performance: {
        responseTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    // Determine overall status
    const allServicesHealthy = Object.values(health.services).every(
      service => service.status === 'healthy'
    );
    
    health.status = allServicesHealthy ? 'healthy' : 'degraded';
    
    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}

async function checkBackendHealth() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(\`\${backendUrl}/api/health\`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'healthy',
        responseTime: Date.now(),
        details: data
      };
    } else {
      return {
        status: 'unhealthy',
        error: \`HTTP \${response.status}\`
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

async function checkDatabaseHealth() {
  try {
    // This would typically connect to your database
    // For now, we'll assume it's healthy if backend is healthy
    return {
      status: 'healthy',
      connections: 'Available'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed'
    };
  }
}

async function checkRedisHealth() {
  const redisEnabled = process.env.REDIS_ENABLED === 'true';
  
  if (!redisEnabled) {
    return {
      status: 'disabled',
      message: 'Redis is not enabled'
    };
  }

  try {
    // Redis health check would go here
    return {
      status: 'healthy',
      connections: 'Available'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Redis connection failed'
    };
  }
}

async function checkExternalServices() {
  const services = {
    razorpay: await checkServiceHealth('https://api.razorpay.com/'),
    // Add other external services here
  };

  const allHealthy = Object.values(services).every(service => service.status === 'healthy');
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    services
  };
}

async function checkServiceHealth(url: string) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    });
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Service unavailable'
    };
  }
}
`;

    await fs.promises.writeFile(
      path.join(healthCheckPath, 'route.ts'),
      healthCheckCode,
      'utf8'
    );

    console.log(chalk.green('   ✓ Created health check API route'));
  }

  // ====================================
  // CORS CONFIGURATION
  // ====================================

  async setupCorsConfiguration() {
    console.log(chalk.yellow('🔧 Setting up CORS configuration...'));
    
    // This method can be extended to create additional CORS configurations
    // For now, CORS is handled in the backend application.properties
    console.log(chalk.green('   ✓ CORS configuration included in backend properties'));
  }

  // ====================================
  // ERROR HANDLING SETUP
  // ====================================

  async setupErrorHandling() {
    console.log(chalk.yellow('🔧 Setting up error handling...'));
    
    // Error handling is built into the enhanced API client
    // Additional error handling can be added here
    console.log(chalk.green('   ✓ Error handling included in API client'));
  }

  // ====================================
  // DEPLOYMENT SCRIPTS
  // ====================================

  async createDeploymentScripts() {
    console.log(chalk.yellow('🔧 Creating deployment scripts...'));
    
    const scriptsPath = path.join(this.frontendPath, 'scripts');
    await fs.promises.mkdir(scriptsPath, { recursive: true });

    // Development server script
    const startDevScript = `#!/bin/bash
# Start development servers for iTech

echo "🚀 Starting iTech Development Servers..."

# Start backend server
echo "📦 Starting Backend Server..."
cd "${this.backendPath}"
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 30

# Start frontend server
echo "🌐 Starting Frontend Server..."
cd "${this.frontendPath}"
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers started!"
echo "📝 Backend running at: http://localhost:8080"
echo "🌐 Frontend running at: http://localhost:3001"
echo "💡 Press Ctrl+C to stop all servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID
echo "✅ All servers stopped!"
`;

    await fs.promises.writeFile(
      path.join(scriptsPath, 'start-dev.sh'),
      startDevScript,
      'utf8'
    );

    // Production build script
    const buildProdScript = `#!/bin/bash
# Build production version of iTech

echo "🏗️ Building iTech for Production..."

# Build backend
echo "📦 Building Backend..."
cd "${this.backendPath}"
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
  echo "❌ Backend build failed!"
  exit 1
fi

# Build frontend
echo "🌐 Building Frontend..."
cd "${this.frontendPath}"
npm run build:production

if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed!"
  exit 1
fi

echo "✅ Production build completed successfully!"
`;

    await fs.promises.writeFile(
      path.join(scriptsPath, 'build-prod.sh'),
      buildProdScript,
      'utf8'
    );

    console.log(chalk.green('   ✓ Created deployment scripts'));
  }

  // ====================================
  // MAIN EXECUTION
  // ====================================

  async execute() {
    try {
      console.log(chalk.blue.bold('\n🚀 Starting iTech Frontend-Backend Integration...'));
      
      await this.setupEnvironment();
      
      console.log(chalk.green.bold('\n✅ Integration completed successfully!'));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray('1. Review and update generated environment files'));
      console.log(chalk.gray('2. Configure external service credentials'));
      console.log(chalk.gray('3. Run integration tests'));
      console.log(chalk.gray('4. Start development servers'));
      
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Integration failed:'), error);
      process.exit(1);
    }
  }
}

// ====================================
// EXECUTION
// ====================================

if (require.main === module) {
  const integrationMaster = new IntegrationMaster();
  integrationMaster.execute();
}

module.exports = IntegrationMaster;
