/**
 * Connection Test Utility
 * Tests and validates the connection between frontend and backend
 */

import { apiClient, API_ENDPOINTS } from '@/lib/unified-api-client';

export interface ConnectionTestResult {
  timestamp: string;
  backend: {
    available: boolean;
    latency: number;
    version?: string;
    error?: string;
  };
  database: {
    connected: boolean;
    error?: string;
  };
  endpoints: {
    [key: string]: {
      available: boolean;
      latency: number;
      error?: string;
    };
  };
  overall: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    score: number;
  };
}

/**
 * Test backend connectivity and endpoints
 */
export async function testConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    timestamp: new Date().toISOString(),
    backend: {
      available: false,
      latency: 0,
    },
    database: {
      connected: false,
    },
    endpoints: {},
    overall: {
      status: 'unhealthy',
      score: 0,
    },
  };

  console.log('🔍 Testing backend connection...');

  // Test backend health endpoint
  try {
    const startTime = Date.now();
    const healthResponse = await apiClient.get<any>(API_ENDPOINTS.HEALTH);
    const latency = Date.now() - startTime;

    result.backend = {
      available: true,
      latency,
      version: healthResponse.version || 'unknown',
    };

    console.log('✅ Backend is available:', {
      latency: `${latency}ms`,
      response: healthResponse,
    });
  } catch (error: any) {
    result.backend = {
      available: false,
      latency: 0,
      error: error.message || 'Connection failed',
    };
    console.error('❌ Backend connection failed:', error);
  }

  // Test database connection through backend
  if (result.backend.available) {
    try {
      // Try to fetch categories as a database test
      await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
      result.database.connected = true;
      console.log('✅ Database connection is working');
    } catch (error: any) {
      result.database = {
        connected: false,
        error: error.message || 'Database connection failed',
      };
      console.warn('⚠️ Database connection issues:', error.message);
    }
  }

  // Test critical endpoints
  const criticalEndpoints = {
    'auth-login': API_ENDPOINTS.AUTH.LOGIN,
    'products': API_ENDPOINTS.PRODUCTS.LIST,
    'categories': API_ENDPOINTS.CATEGORIES.LIST,
    'health': API_ENDPOINTS.HEALTH,
  };

  for (const [name, endpoint] of Object.entries(criticalEndpoints)) {
    try {
      const startTime = Date.now();
      
      // For auth endpoints, just test if they're reachable (they should return 400/401)
      if (name === 'auth-login') {
        try {
          await apiClient.post(endpoint, {});
        } catch (error: any) {
          // 400/401 means endpoint is reachable
          if (error.status === 400 || error.status === 401) {
            const latency = Date.now() - startTime;
            result.endpoints[name] = {
              available: true,
              latency,
            };
            continue;
          }
          throw error;
        }
      } else {
        // For other endpoints, test normal GET request
        await apiClient.get(endpoint);
      }
      
      const latency = Date.now() - startTime;
      result.endpoints[name] = {
        available: true,
        latency,
      };
      console.log(`✅ Endpoint ${name} is available (${latency}ms)`);
    } catch (error: any) {
      result.endpoints[name] = {
        available: false,
        latency: 0,
        error: error.message || 'Endpoint failed',
      };
      console.warn(`⚠️ Endpoint ${name} failed:`, error.message);
    }
  }

  // Calculate overall health score
  let score = 0;
  let totalChecks = 0;

  // Backend availability (40% weight)
  totalChecks += 40;
  if (result.backend.available) {
    score += 40;
  }

  // Database connectivity (30% weight)
  totalChecks += 30;
  if (result.database.connected) {
    score += 30;
  }

  // Endpoint availability (30% weight)
  const endpointCount = Object.keys(result.endpoints).length;
  const availableEndpoints = Object.values(result.endpoints).filter(e => e.available).length;
  totalChecks += 30;
  if (endpointCount > 0) {
    score += Math.round((availableEndpoints / endpointCount) * 30);
  }

  result.overall.score = Math.round((score / totalChecks) * 100);

  // Determine overall status
  if (result.overall.score >= 80) {
    result.overall.status = 'healthy';
  } else if (result.overall.score >= 50) {
    result.overall.status = 'degraded';
  } else {
    result.overall.status = 'unhealthy';
  }

  console.log('📊 Connection test completed:', {
    status: result.overall.status,
    score: `${result.overall.score}%`,
  });

  return result;
}

/**
 * Run a quick health check
 */
export async function quickHealthCheck(): Promise<boolean> {
  try {
    await apiClient.healthCheck();
    return true;
  } catch {
    return false;
  }
}

/**
 * Test API connectivity with retry
 */
export async function testApiWithRetry(
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const isHealthy = await quickHealthCheck();
      if (isHealthy) {
        console.log(`✅ API connection successful on attempt ${i + 1}`);
        return true;
      }
    } catch (error) {
      console.warn(`⚠️ API connection attempt ${i + 1} failed:`, error);
    }

    if (i < maxRetries - 1) {
      console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  console.error('❌ API connection failed after all retries');
  return false;
}

/**
 * Format connection test results for display
 */
export function formatConnectionTestResults(result: ConnectionTestResult): string {
  const lines = [
    `🔍 Connection Test Results (${result.timestamp})`,
    `${'='.repeat(60)}`,
    '',
    `🖥️  Backend Status: ${result.backend.available ? '✅ Available' : '❌ Unavailable'}`,
  ];

  if (result.backend.available) {
    lines.push(`   Latency: ${result.backend.latency}ms`);
    if (result.backend.version) {
      lines.push(`   Version: ${result.backend.version}`);
    }
  } else {
    lines.push(`   Error: ${result.backend.error}`);
  }

  lines.push('');
  lines.push(`🗄️  Database: ${result.database.connected ? '✅ Connected' : '❌ Disconnected'}`);
  if (!result.database.connected && result.database.error) {
    lines.push(`   Error: ${result.database.error}`);
  }

  lines.push('');
  lines.push('🔗 Endpoints:');
  Object.entries(result.endpoints).forEach(([name, endpoint]) => {
    const status = endpoint.available ? '✅' : '❌';
    const latency = endpoint.available ? ` (${endpoint.latency}ms)` : '';
    const error = endpoint.error ? ` - ${endpoint.error}` : '';
    lines.push(`   ${status} ${name}${latency}${error}`);
  });

  lines.push('');
  lines.push(`📊 Overall Health: ${getStatusEmoji(result.overall.status)} ${result.overall.status.toUpperCase()}`);
  lines.push(`   Score: ${result.overall.score}%`);

  return lines.join('\n');
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'healthy': return '🟢';
    case 'degraded': return '🟡';
    case 'unhealthy': return '🔴';
    default: return '⚪';
  }
}

/**
 * Auto-run connection test on module load in development
 */
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Run connection test after a short delay
  setTimeout(async () => {
    if (process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
      console.log('🚀 Running automatic connection test...');
      try {
        const result = await testConnection();
        console.log(formatConnectionTestResults(result));
      } catch (error) {
        console.error('❌ Auto connection test failed:', error);
      }
    }
  }, 2000);
}
