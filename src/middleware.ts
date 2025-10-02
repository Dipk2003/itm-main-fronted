/**
 * Enterprise Next.js Middleware
 * 
 * Production-grade middleware with security, monitoring,
 * rate limiting, and advanced request processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGlobalMonitoringSystem } from './lib/monitoring';

// ========== MIDDLEWARE CONFIGURATION ==========
const MIDDLEWARE_CONFIG = {
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSS: true,
    enableFrameOptions: true,
    enableNoSniff: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
    enableCOEP: true,
    enableCOOP: true,
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  monitoring: {
    enabled: true,
    trackPerformance: true,
    trackSecurity: true,
    trackBusinessMetrics: true,
  },
  geolocation: {
    enabled: true,
    allowedCountries: ['IN', 'US', 'GB', 'CA', 'AU'], // Indian Trade Mart - primarily India
    blockedCountries: ['CN', 'RU'], // Security consideration
  },
  compression: {
    enabled: true,
    minSize: 1024,
  },
  cache: {
    staticAssets: 'public, max-age=31536000, immutable',
    apiResponses: 'private, no-cache, no-store, must-revalidate',
    htmlPages: 'public, max-age=300, stale-while-revalidate=60',
  },
};

// ========== RATE LIMITING STORE ==========
class MemoryRateLimitStore {
  private store = new Map<string, { count: number; resetTime: number; blocked: boolean }>();

  hit(key: string, windowMs: number, maxRequests: number): {
    totalHits: number;
    timeUntilReset: number;
    isBlocked: boolean;
    remaining: number;
  } {
    const now = Date.now();
    const current = this.store.get(key);

    if (!current || now >= current.resetTime) {
      // Reset window
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
      });

      return {
        totalHits: 1,
        timeUntilReset: windowMs,
        isBlocked: false,
        remaining: maxRequests - 1,
      };
    }

    current.count++;
    const isBlocked = current.count > maxRequests;
    current.blocked = isBlocked;

    return {
      totalHits: current.count,
      timeUntilReset: current.resetTime - now,
      isBlocked,
      remaining: Math.max(0, maxRequests - current.count),
    };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now >= value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// ========== SECURITY UTILITIES ==========
class SecurityManager {
  private monitoring = getGlobalMonitoringSystem();

  generateCSPHeader(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "object-src 'none'",
      "frame-src 'self' https://www.google.com",
      "connect-src 'self' https: wss: ws:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    return csp.join('; ');
  }

  detectSuspiciousActivity(request: NextRequest): {
    isSuspicious: boolean;
    reasons: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for') || '';
    const url = request.nextUrl.pathname + request.nextUrl.search;

    // Check for common attack patterns
    const suspiciousPatterns = [
      /(\.\.\/)|(\.\.\\)/gi, // Directory traversal
      /<script[^>]*>.*?<\/script>/gi, // XSS attempts
      /union.*select/gi, // SQL injection
      /javascript:/gi, // JavaScript protocol
      /vbscript:/gi, // VBScript protocol
      /on\w+\s*=/gi, // Event handlers
      /eval\s*\(/gi, // eval() calls
      /document\.cookie/gi, // Cookie access
      /window\.location/gi, // Location manipulation
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        reasons.push(`Suspicious URL pattern detected: ${pattern}`);
        riskLevel = 'high';
      }
    }

    // Check User-Agent
    if (!userAgent || userAgent.length < 10) {
      reasons.push('Missing or suspicious User-Agent');
      if (riskLevel === 'low') {
        riskLevel = 'medium';
      }
    }

    // Check for bot patterns
    const botPatterns = /bot|crawl|spider|scrape|curl|wget|httpclient/gi;
    if (botPatterns.test(userAgent) && !request.nextUrl.pathname.startsWith('/api/health')) {
      reasons.push('Bot traffic detected');
      if (riskLevel === 'low') {
        riskLevel = 'medium';
      }
    }

    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-real-ip',
      'x-originating-ip',
      'x-remote-ip',
      'x-cluster-client-ip',
    ];

    for (const header of suspiciousHeaders) {
      if (request.headers.has(header)) {
        reasons.push(`Suspicious header detected: ${header}`);
        if (riskLevel === 'low') {
          riskLevel = 'medium';
        }
      }
    }

    // Check request size
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB
      reasons.push('Unusually large request body');
      riskLevel = 'high';
    }

    // Check for rapid requests (would need more sophisticated tracking in production)
    const clientId = this.getClientIdentifier(request);
    // This would connect to a more persistent store in production

    return {
      isSuspicious: reasons.length > 0,
      reasons,
      riskLevel
    };
  }

  private getClientIdentifier(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || '';
    
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return `${ip}_${this.hashString(userAgent)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

// ========== GEOLOCATION MANAGER ==========
class GeolocationManager {
  private monitoring = getGlobalMonitoringSystem();

  getCountryFromRequest(request: NextRequest): string | null {
    // Cloudflare
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry) return cfCountry;

    // Vercel
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    if (vercelCountry) return vercelCountry;

    // CloudFront
    const cfrontCountry = request.headers.get('cloudfront-viewer-country');
    if (cfrontCountry) return cfrontCountry;

    // Fastly
    const fastlyCountry = request.headers.get('fastly-client-geo-country-code');
    if (fastlyCountry) return fastlyCountry;

    return null;
  }

  isAllowedCountry(country: string | null): boolean {
    if (!country || !MIDDLEWARE_CONFIG.geolocation.enabled) return true;

    const { allowedCountries, blockedCountries } = MIDDLEWARE_CONFIG.geolocation;

    // Check blocked list first
    if (blockedCountries.includes(country.toUpperCase())) {
      this.monitoring.warn('Blocked country access attempt', {
        country,
        component: 'geolocation',
        action: 'country-blocked'
      });
      return false;
    }

    // If allowed list exists, check it
    if (allowedCountries.length > 0) {
      return allowedCountries.includes(country.toUpperCase());
    }

    return true;
  }
}

// ========== REQUEST PROCESSOR ==========
class RequestProcessor {
  private monitoring = getGlobalMonitoringSystem();
  private rateLimitStore = new MemoryRateLimitStore();
  private securityManager = new SecurityManager();
  private geolocationManager = new GeolocationManager();

  async processRequest(request: NextRequest): Promise<NextResponse | null> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    const pathname = request.nextUrl.pathname;
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = this.getClientIP(request);
    const country = this.geolocationManager.getCountryFromRequest(request);

    // Set monitoring context
    this.monitoring.setContext({
      requestId,
      endpoint: pathname,
      method,
      ip,
      country,
      userAgent
    });

    this.monitoring.debug('Middleware processing request', {
      pathname,
      method,
      ip,
      country,
      requestId
    });

    try {
      // 1. Geolocation Check
      if (!this.geolocationManager.isAllowedCountry(country)) {
        this.monitoring.warn('Request blocked - country not allowed', {
          country,
          ip,
          pathname
        });

        return new NextResponse('Access denied', {
          status: 403,
          headers: this.getSecurityHeaders()
        });
      }

      // 2. Security Analysis
      const securityAnalysis = this.securityManager.detectSuspiciousActivity(request);
      if (securityAnalysis.isSuspicious && securityAnalysis.riskLevel === 'critical') {
        this.monitoring.error('Critical security threat detected', {
          reasons: securityAnalysis.reasons,
          riskLevel: securityAnalysis.riskLevel,
          ip,
          pathname
        });

        return new NextResponse('Security violation detected', {
          status: 403,
          headers: this.getSecurityHeaders()
        });
      }

      // 3. Rate Limiting (skip for static assets)
      if (!this.isStaticAsset(pathname)) {
        const rateLimitResult = this.checkRateLimit(ip, pathname);
        if (rateLimitResult.isBlocked) {
          this.monitoring.warn('Rate limit exceeded', {
            ip,
            pathname,
            totalHits: rateLimitResult.totalHits
          });

          return new NextResponse('Rate limit exceeded', {
            status: 429,
            headers: {
              ...this.getSecurityHeaders(),
              'Retry-After': Math.ceil(rateLimitResult.timeUntilReset / 1000).toString(),
              'X-RateLimit-Limit': MIDDLEWARE_CONFIG.rateLimit.maxRequests.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': new Date(Date.now() + rateLimitResult.timeUntilReset).toISOString(),
            }
          });
        }

        // Add rate limit headers to successful requests
        request.headers.set('X-RateLimit-Limit', MIDDLEWARE_CONFIG.rateLimit.maxRequests.toString());
        request.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      }

      // 4. Business Logic Processing
      await this.processBusinessLogic(request, pathname, method);

      // 5. Performance Tracking
      const processingTime = Date.now() - startTime;
      this.monitoring.recordMetric('middleware_processing_time', processingTime, 'ms');

      if (processingTime > 100) {
        this.monitoring.warn('Slow middleware processing', {
          processingTime,
          pathname,
          requestId
        });
      }

      this.monitoring.info('Request processed successfully', {
        pathname,
        method,
        processingTime,
        requestId
      });

      return null; // Continue to next middleware/page

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      this.monitoring.error('Middleware processing error', {
        pathname,
        method,
        processingTime,
        requestId
      }, error as Error);

      // Don't block request on middleware errors in production
      if (process.env.NODE_ENV === 'production') {
        return null;
      }

      return new NextResponse('Internal server error', {
        status: 500,
        headers: this.getSecurityHeaders()
      });
    }
  }

  private checkRateLimit(ip: string, pathname: string) {
    const key = `${ip}_${this.getEndpointCategory(pathname)}`;
    return this.rateLimitStore.hit(
      key,
      MIDDLEWARE_CONFIG.rateLimit.windowMs,
      MIDDLEWARE_CONFIG.rateLimit.maxRequests
    );
  }

  private async processBusinessLogic(request: NextRequest, pathname: string, method: string): Promise<void> {
    // Track business metrics
    if (MIDDLEWARE_CONFIG.monitoring.trackBusinessMetrics) {
      
      // Track API usage by category
      if (pathname.startsWith('/api/')) {
        const apiCategory = this.getApiCategory(pathname);
        this.monitoring.recordMetric(`api_requests_${apiCategory}`, 1, 'count');
        
        // Track authentication status
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
          this.monitoring.recordMetric('authenticated_requests', 1, 'count');
        } else {
          this.monitoring.recordMetric('unauthenticated_requests', 1, 'count');
        }
      }

      // Track page views
      if (method === 'GET' && !pathname.startsWith('/api/') && !this.isStaticAsset(pathname)) {
        const pageCategory = this.getPageCategory(pathname);
        this.monitoring.recordMetric(`page_views_${pageCategory}`, 1, 'count');
      }

      // Track user journey
      const referer = request.headers.get('referer');
      if (referer && referer.includes(request.nextUrl.origin)) {
        this.monitoring.recordMetric('internal_navigation', 1, 'count');
      } else if (referer) {
        this.monitoring.recordMetric('external_referral', 1, 'count');
      } else {
        this.monitoring.recordMetric('direct_access', 1, 'count');
      }
    }

    // Enhanced logging for critical paths
    if (this.isCriticalPath(pathname)) {
      this.monitoring.info('Critical path access', {
        pathname,
        method,
        component: 'critical-path'
      });
    }
  }

  private getApiCategory(pathname: string): string {
    if (pathname.includes('/buyers')) return 'buyers';
    if (pathname.includes('/vendors')) return 'vendors';
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/auth')) return 'auth';
    if (pathname.includes('/search')) return 'search';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/upload')) return 'upload';
    if (pathname.includes('/health')) return 'health';
    return 'other';
  }

  private getPageCategory(pathname: string): string {
    if (pathname === '/' || pathname === '/home') return 'home';
    if (pathname.startsWith('/buyers')) return 'buyers';
    if (pathname.startsWith('/vendors')) return 'vendors';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/auth')) return 'auth';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    return 'other';
  }

  private getEndpointCategory(pathname: string): string {
    if (pathname.startsWith('/api/')) {
      return this.getApiCategory(pathname);
    }
    return this.getPageCategory(pathname);
  }

  private isCriticalPath(pathname: string): boolean {
    const criticalPaths = [
      '/api/auth/',
      '/api/buyers/create',
      '/api/vendors/create',
      '/api/admin/',
      '/api/payment/',
      '/api/orders/'
    ];

    return criticalPaths.some(path => pathname.startsWith(path));
  }

  private isStaticAsset(pathname: string): boolean {
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.ico', '.woff', '.woff2', '.ttf', '.otf', '.eot', '.mp4', '.webm',
      '.pdf', '.zip', '.json', '.xml', '.txt'
    ];

    return staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext)) ||
           pathname.startsWith('/_next/static/') ||
           pathname.startsWith('/static/') ||
           pathname.startsWith('/images/') ||
           pathname.startsWith('/favicon');
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const xVercelForwardedFor = request.headers.get('x-vercel-forwarded-for');

    return (
      cfConnectingIp ||
      xVercelForwardedFor ||
      forwarded?.split(',')[0]?.trim() ||
      realIp ||
      'unknown'
    );
  }

  private getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (MIDDLEWARE_CONFIG.security.enableCSP) {
      headers['Content-Security-Policy'] = this.securityManager.generateCSPHeader();
    }

    if (MIDDLEWARE_CONFIG.security.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    if (MIDDLEWARE_CONFIG.security.enableXSS) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (MIDDLEWARE_CONFIG.security.enableFrameOptions) {
      headers['X-Frame-Options'] = 'DENY';
    }

    if (MIDDLEWARE_CONFIG.security.enableNoSniff) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (MIDDLEWARE_CONFIG.security.enableReferrerPolicy) {
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    }

    if (MIDDLEWARE_CONFIG.security.enablePermissionsPolicy) {
      headers['Permissions-Policy'] = [
        'camera=()',
        'microphone=()',
        'geolocation=(self)',
        'interest-cohort=()'
      ].join(', ');
    }

    if (MIDDLEWARE_CONFIG.security.enableCOEP) {
      headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    }

    if (MIDDLEWARE_CONFIG.security.enableCOOP) {
      headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    }

    // Additional security headers
    headers['X-DNS-Prefetch-Control'] = 'off';
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['Cross-Origin-Resource-Policy'] = 'cross-origin';

    return headers;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ========== RESPONSE PROCESSOR ==========
class ResponseProcessor {
  private monitoring = getGlobalMonitoringSystem();

  processResponse(request: NextRequest, response: NextResponse): NextResponse {
    const pathname = request.nextUrl.pathname;
    
    // Add security headers
    const securityHeaders = this.getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Cache Control
    if (this.isStaticAsset(pathname)) {
      response.headers.set('Cache-Control', MIDDLEWARE_CONFIG.cache.staticAssets);
    } else if (pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', MIDDLEWARE_CONFIG.cache.apiResponses);
    } else {
      response.headers.set('Cache-Control', MIDDLEWARE_CONFIG.cache.htmlPages);
    }

    // CORS for API routes
    if (pathname.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      response.headers.set('Access-Control-Allow-Headers', 
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
      );
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Add custom headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Powered-By', 'Indian Trade Mart Platform');
    response.headers.set('X-Request-ID', request.headers.get('X-Request-ID') || 'unknown');

    // Compression hints
    if (MIDDLEWARE_CONFIG.compression.enabled) {
      response.headers.set('Vary', 'Accept-Encoding');
    }

    return response;
  }

  private isStaticAsset(pathname: string): boolean {
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.ico', '.woff', '.woff2', '.ttf', '.otf', '.eot'
    ];

    return staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext)) ||
           pathname.startsWith('/_next/static/');
  }

  private getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (MIDDLEWARE_CONFIG.security.enableCSP) {
      // Simple CSP for production
      headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
    }

    if (MIDDLEWARE_CONFIG.security.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    if (MIDDLEWARE_CONFIG.security.enableXSS) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (MIDDLEWARE_CONFIG.security.enableFrameOptions) {
      headers['X-Frame-Options'] = 'DENY';
    }

    if (MIDDLEWARE_CONFIG.security.enableNoSniff) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (MIDDLEWARE_CONFIG.security.enableReferrerPolicy) {
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    }

    if (MIDDLEWARE_CONFIG.security.enablePermissionsPolicy) {
      headers['Permissions-Policy'] = [
        'camera=()',
        'microphone=()',
        'geolocation=(self)',
        'interest-cohort=()'
      ].join(', ');
    }

    if (MIDDLEWARE_CONFIG.security.enableCOEP) {
      headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    }

    if (MIDDLEWARE_CONFIG.security.enableCOOP) {
      headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    }

    // Additional security headers
    headers['X-DNS-Prefetch-Control'] = 'off';
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['Cross-Origin-Resource-Policy'] = 'cross-origin';

    return headers;
  }
}

// ========== MAIN MIDDLEWARE FUNCTION ==========
const requestProcessor = new RequestProcessor();
const responseProcessor = new ResponseProcessor();

export async function middleware(request: NextRequest) {
  // Process request
  const blockingResponse = await requestProcessor.processRequest(request);
  if (blockingResponse) {
    return blockingResponse;
  }

  // Continue with the request
  const response = NextResponse.next();
  
  // Process response
  return responseProcessor.processResponse(request, response);
}

// ========== MIDDLEWARE CONFIGURATION ==========
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

// ========== CLEANUP UTILITIES ==========
// Periodic cleanup for rate limiting store (server-side only)
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  try {
    const rateLimitStore = new MemoryRateLimitStore();
    
    setInterval(() => {
      rateLimitStore.cleanup();
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
  } catch (error) {
    console.warn('Could not setup rate limit cleanup:', error);
  }
}

export default middleware;
