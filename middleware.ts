import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = request.headers.get('x-subdomain') || '';
  
  // Extract subdomain from hostname
  const hostname = host.split('.')[0];
  
  console.log('Middleware Debug:', {
    host,
    hostname,
    subdomain,
    url: request.url
  });
  
  // Route based on subdomain
  if (hostname === 'vendor' || subdomain === 'vendor') {
    console.log('Routing to vendor dashboard');
    return NextResponse.rewrite(new URL('/dashboard/vendor-panel', request.url));
  }
  
  if (hostname === 'admin' || subdomain === 'admin') {
    console.log('Routing to admin dashboard');
    return NextResponse.rewrite(new URL('/dashboard/admin', request.url));
  }
  
  if (hostname === 'support' || subdomain === 'support') {
    console.log('Routing to support dashboard');
    return NextResponse.rewrite(new URL('/dashboard/support', request.url));
  }
  
  if (hostname === 'customer' || subdomain === 'customer') {
    console.log('Routing to customer dashboard');
    return NextResponse.rewrite(new URL('/dashboard/user', request.url));
  }
  
  // Default to main site
  console.log('Routing to main site');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - health (health check endpoint)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|health).*)',
  ],
};
