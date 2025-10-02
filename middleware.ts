import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Extract subdomain from hostname
  const hostname = host.split('.')[0];
  
  // Handle different subdomains
  const subdomainMap: Record<string, string> = {
    'dir': '/directory',
    'vendor': '/dashboard/vendor-panel',
    'admin': '/dashboard/admin',
    'support': '/dashboard/support',
    'customer': '/dashboard/user'
  };
  
  console.log('Middleware Debug:', {
    host,
    hostname,
    pathname: url.pathname,
    fullUrl: request.url
  });
  
  // Check if we're dealing with a subdomain that needs routing
  if (subdomainMap[hostname]) {
    const targetPath = subdomainMap[hostname];
    
    // Only rewrite if we're not already on the target path
    if (!url.pathname.startsWith(targetPath)) {
      console.log(`Routing ${hostname} subdomain to ${targetPath}`);
      
      // For directory subdomain, preserve any query parameters and path
      if (hostname === 'dir') {
        if (url.pathname === '/') {
          url.pathname = targetPath;
        } else {
          // Preserve existing path for directory routes
          url.pathname = targetPath + url.pathname;
        }
      } else {
        // For dashboard routes, always go to the main dashboard page
        url.pathname = targetPath;
      }
      
      return NextResponse.rewrite(url);
    }
  }
  
  // Handle localhost development with query parameter override
  if (host.includes('localhost')) {
    const subdomainParam = url.searchParams.get('subdomain');
    if (subdomainParam && subdomainMap[subdomainParam]) {
      const targetPath = subdomainMap[subdomainParam];
      console.log(`Development: Routing ${subdomainParam} subdomain to ${targetPath}`);
      url.pathname = targetPath;
      return NextResponse.rewrite(url);
    }
    
    // Handle direct localhost subdomain-style URLs like localhost:3000/vendor/dashboard
    const pathSegments = url.pathname.split('/');
    if (pathSegments.length >= 2) {
      const firstSegment = pathSegments[1];
      if (subdomainMap[firstSegment]) {
        const targetPath = subdomainMap[firstSegment];
        const remainingPath = pathSegments.slice(2).join('/');
        url.pathname = remainingPath ? `${targetPath}/${remainingPath}` : targetPath;
        console.log(`Development: Routing /${firstSegment} path to ${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    }
  }
  
  // Default to main site
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
