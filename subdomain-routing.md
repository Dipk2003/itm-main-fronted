# Subdomain Routing Configuration

This project supports subdomain-based routing for different user roles and modules.

## Supported Subdomains

- **dir.indiantrademart.com** → Routes to `/directory` (Business Directory)
- **vendor.indiantrademart.com** → Routes to `/dashboard/vendor-panel` (Vendor Dashboard)  
- **admin.indiantrademart.com** → Routes to `/dashboard/admin` (Admin Dashboard)
- **support.indiantrademart.com** → Routes to `/dashboard/support` (Support Dashboard)
- **customer.indiantrademart.com** → Routes to `/dashboard/user` (Customer Dashboard)

## How It Works

1. **Middleware**: `middleware.ts` intercepts requests and checks the hostname
2. **Next.js Config**: `next.config.js` provides rewrites for proper subdomain handling
3. **Route Mapping**: Each subdomain maps to a specific app route

## Local Development

For local development, you can test subdomain routing by:

1. **Using Query Parameters**: 
   - `http://localhost:3000/?subdomain=dir` → Directory
   - `http://localhost:3000/?subdomain=vendor` → Vendor Dashboard
   - `http://localhost:3000/?subdomain=admin` → Admin Dashboard

2. **Using Local Subdomains** (requires hosts file modification):
   Add these entries to your hosts file (`/etc/hosts` on Unix, `C:\Windows\System32\drivers\etc\hosts` on Windows):
   ```
   127.0.0.1 dir.localhost
   127.0.0.1 vendor.localhost  
   127.0.0.1 admin.localhost
   127.0.0.1 support.localhost
   127.0.0.1 customer.localhost
   ```
   Then access: `http://dir.localhost:3000`, `http://vendor.localhost:3000`, etc.

## Production Setup

In production, ensure your DNS is configured to point all subdomains to your Next.js application:

```
dir.indiantrademart.com     → Your server IP
vendor.indiantrademart.com  → Your server IP
admin.indiantrademart.com   → Your server IP
support.indiantrademart.com → Your server IP  
customer.indiantrademart.com → Your server IP
```

## Debugging

The middleware logs debugging information to the console, including:
- Detected hostname
- Target routing path  
- Full URL being processed

Check your server logs to troubleshoot routing issues.
