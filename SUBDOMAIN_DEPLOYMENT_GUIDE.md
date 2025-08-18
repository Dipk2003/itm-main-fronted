# AWS Subdomain Deployment Guide

## 🌐 Subdomain Architecture Overview

This guide explains how to deploy the Indian Trade Mart frontend with subdomain-based role separation on AWS Elastic Beanstalk.

### Subdomain Structure
- **Main Site**: `indiantrademart.com` - Public marketplace and buyer portal
- **Vendor Dashboard**: `vendor.indiantrademart.com` - Vendor management interface
- **Admin Panel**: `admin.indiantrademart.com` - Administrative functions
- **Customer Support**: `support.indiantrademart.com` - Support dashboard

## 📋 Prerequisites

1. **Domain Registration**: Domain registered with GoDaddy (`indiantrademart.com`)
2. **AWS Account**: Active AWS account with appropriate permissions
3. **Backend API**: Spring Boot backend deployed on AWS Elastic Beanstalk
4. **Database**: RDS MySQL/PostgreSQL instance
5. **SSL Certificate**: AWS ACM certificate for `*.indiantrademart.com`

## 🏗️ AWS Infrastructure Setup

### Step 1: Create Elastic Beanstalk Application

1. **Login to AWS Console**
   - Navigate to Elastic Beanstalk service
   - Create new application: `indian-trade-mart-frontend`

2. **Create Environment**
   ```bash
   Environment Name: itm-frontend-prod
   Platform: Node.js
   Platform Version: Node.js 18 running on 64bit Amazon Linux 2023
   ```

3. **Configuration Settings**
   - **Instance Type**: t3.medium (recommended for production)
   - **Auto Scaling**: Min 1, Max 3 instances
   - **Load Balancer**: Application Load Balancer (ALB)
   - **Health Check**: `/api/health`

### Step 2: Configure Load Balancer for SSL

1. **Upload SSL Certificate to ACM**
   ```bash
   # Request wildcard certificate
   Domain: *.indiantrademart.com
   Additional Domain: indiantrademart.com
   Validation Method: DNS validation
   ```

2. **Configure ALB Listeners**
   - **HTTP (Port 80)**: Redirect to HTTPS
   - **HTTPS (Port 443)**: Forward to target group

### Step 3: Environment Variables Configuration

Set the following environment variables in Elastic Beanstalk:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.elasticbeanstalk.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.elasticbeanstalk.com/api
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-backend-api.elasticbeanstalk.com/ws

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DEBUG_API=false

# Domain Configuration
NEXT_PUBLIC_DOMAIN=indiantrademart.com
NEXT_PUBLIC_APP_URL=https://indiantrademart.com

# Subdomain Configuration
NEXT_PUBLIC_VENDOR_SUBDOMAIN=vendor.indiantrademart.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin.indiantrademart.com
NEXT_PUBLIC_SUPPORT_SUBDOMAIN=support.indiantrademart.com

# Database (for reference)
RDS_HOSTNAME=your-rds-endpoint.amazonaws.com
RDS_PORT=3306
RDS_DB_NAME=itm_production
RDS_USERNAME=admin
RDS_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://indiantrademart.com

# Payment Gateway
RAZORPAY_KEY_ID=your-production-razorpay-key
RAZORPAY_KEY_SECRET=your-production-razorpay-secret

# File Storage (S3)
AWS_S3_BUCKET=itm-production-assets
AWS_S3_REGION=us-east-1

# Email Service (SES)
SES_FROM_EMAIL=noreply@indiantrademart.com
SES_REGION=us-east-1
```

## 🌍 GoDaddy DNS Configuration

### Step 1: Domain Management

1. **Login to GoDaddy**
   - Go to Domain Manager
   - Select `indiantrademart.com`
   - Navigate to DNS Management

### Step 2: DNS Records Configuration

Add/Update the following DNS records:

```dns
# A Records (pointing to your ELB IP)
Type: A | Name: @ | Value: [Your-ELB-IP-Address] | TTL: 600
Type: A | Name: www | Value: [Your-ELB-IP-Address] | TTL: 600
Type: A | Name: vendor | Value: [Your-ELB-IP-Address] | TTL: 600
Type: A | Name: admin | Value: [Your-ELB-IP-Address] | TTL: 600
Type: A | Name: support | Value: [Your-ELB-IP-Address] | TTL: 600

# CNAME Records (recommended alternative)
Type: CNAME | Name: www | Value: your-env-name.elasticbeanstalk.com | TTL: 600
Type: CNAME | Name: vendor | Value: your-env-name.elasticbeanstalk.com | TTL: 600
Type: CNAME | Name: admin | Value: your-env-name.elasticbeanstalk.com | TTL: 600
Type: CNAME | Name: support | Value: your-env-name.elasticbeanstalk.com | TTL: 600

# Wildcard CNAME (if supported)
Type: CNAME | Name: * | Value: your-env-name.elasticbeanstalk.com | TTL: 600
```

### Step 3: DNS Propagation

- **Wait Time**: 24-48 hours for full propagation
- **Check Status**: Use tools like `nslookup` or online DNS checkers
- **Verify**: Test each subdomain after propagation

## ⚙️ Elastic Beanstalk Configuration Files

### 1. Create `.ebextensions/01-nginx-subdomains.config`

```yaml
files:
  "/etc/nginx/conf.d/subdomain-routing.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      # Subdomain mapping
      map $host $subdomain {
          default "";
          ~^vendor\.indiantrademart\.com$ "vendor";
          ~^admin\.indiantrademart\.com$ "admin";
          ~^support\.indiantrademart\.com$ "support";
      }
      
      # Main server configuration
      server {
          listen 80;
          server_name *.indiantrademart.com indiantrademart.com;
          
          # Add subdomain header for Next.js routing
          location / {
              proxy_pass http://localhost:3000;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;
              proxy_set_header X-Subdomain $subdomain;
              
              # WebSocket support
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection "upgrade";
          }
      }

container_commands:
  01_reload_nginx:
    command: "service nginx reload"
```

### 2. Create `.ebextensions/02-environment-variables.config`

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    NEXT_PUBLIC_ENV: production
    PORT: 3000
```

### 3. Create `.ebextensions/03-https-redirect.config`

```yaml
files:
  "/etc/nginx/conf.d/https-redirect.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      server {
          listen 80;
          server_name *.indiantrademart.com indiantrademart.com;
          
          # Redirect HTTP to HTTPS
          if ($http_x_forwarded_proto != 'https') {
              return 301 https://$host$request_uri;
          }
      }
```

## 🚀 Frontend Code Configuration

### 1. Update Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable subdomain routing
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Image optimization for production
  images: {
    domains: [
      'indiantrademart.com',
      'vendor.indiantrademart.com',
      'admin.indiantrademart.com',
      'support.indiantrademart.com',
      'your-s3-bucket.s3.amazonaws.com'
    ],
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment-based configuration
  env: {
    SUBDOMAIN_ROUTING_ENABLED: 'true',
  },
};

module.exports = nextConfig;
```

### 2. Subdomain Detection Middleware (`middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const subdomain = request.headers.get('x-subdomain');
  
  // Extract subdomain from hostname
  const hostname = host?.split('.')[0];
  
  // Route based on subdomain
  if (hostname === 'vendor' || subdomain === 'vendor') {
    return NextResponse.rewrite(new URL('/dashboard/vendor-panel', request.url));
  }
  
  if (hostname === 'admin' || subdomain === 'admin') {
    return NextResponse.rewrite(new URL('/dashboard/admin', request.url));
  }
  
  if (hostname === 'support' || subdomain === 'support') {
    return NextResponse.rewrite(new URL('/dashboard/support', request.url));
  }
  
  // Default to main site
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Subdomain Detection Hook (`useSubdomain.ts`)

```typescript
import { useEffect, useState } from 'react';

export type SubdomainType = 'main' | 'vendor' | 'admin' | 'support';

export const useSubdomain = (): SubdomainType => {
  const [subdomain, setSubdomain] = useState<SubdomainType>('main');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      if (parts.length > 2) {
        const sub = parts[0];
        switch (sub) {
          case 'vendor':
            setSubdomain('vendor');
            break;
          case 'admin':
            setSubdomain('admin');
            break;
          case 'support':
            setSubdomain('support');
            break;
          default:
            setSubdomain('main');
        }
      } else {
        setSubdomain('main');
      }
    }
  }, []);
  
  return subdomain;
};
```

## 📦 Deployment Process

### Step 1: Prepare Application

1. **Build the Application**
   ```bash
   npm run build
   npm run type-check
   ```

2. **Create Deployment Package**
   ```bash
   # Include necessary files only
   zip -r deployment.zip \
     .next/ \
     public/ \
     package.json \
     package-lock.json \
     .ebextensions/ \
     node_modules/ \
     -x "*.env*" ".git/*" "src/*" "*.md"
   ```

### Step 2: Deploy to Elastic Beanstalk

1. **Upload Application**
   - Go to Elastic Beanstalk Console
   - Select your application
   - Upload `deployment.zip`

2. **Deploy and Monitor**
   - Monitor deployment logs
   - Check health dashboard
   - Verify environment variables

### Step 3: Post-Deployment Verification

1. **Test Each Subdomain**
   ```bash
   # Main site
   curl -I https://indiantrademart.com
   
   # Vendor dashboard
   curl -I https://vendor.indiantrademart.com
   
   # Admin panel
   curl -I https://admin.indiantrademart.com
   
   # Support dashboard
   curl -I https://support.indiantrademart.com
   ```

2. **Verify SSL Certificates**
   - Check SSL status for all subdomains
   - Ensure HTTPS redirect is working
   - Test certificate validity

3. **Test Application Functionality**
   - User authentication across subdomains
   - API connectivity
   - Real-time features (WebSocket)
   - File uploads and media

## 🔧 Troubleshooting

### Common Issues

1. **Subdomain Not Resolving**
   - Check DNS propagation status
   - Verify GoDaddy DNS records
   - Clear browser DNS cache

2. **SSL Certificate Issues**
   - Ensure wildcard certificate covers all subdomains
   - Check certificate installation on ALB
   - Verify domain validation

3. **Application Load Balancer Issues**
   - Check target group health
   - Verify security group rules
   - Review ALB access logs

4. **nginx Configuration Issues**
   - Check nginx error logs: `/var/log/nginx/error.log`
   - Verify configuration syntax
   - Restart nginx service if needed

### Debugging Commands

```bash
# Check DNS resolution
nslookup vendor.indiantrademart.com

# Test subdomain routing
curl -H "Host: vendor.indiantrademart.com" http://your-elb-endpoint.com

# Check nginx configuration
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📈 Monitoring and Maintenance

### CloudWatch Metrics

Monitor the following metrics:
- **Application Health**: Environment health status
- **Request Count**: Number of requests per subdomain
- **Response Time**: Average response time
- **Error Rate**: 4xx and 5xx error rates

### Log Monitoring

- **Application Logs**: `/var/log/eb-docker/containers/eb-current-app/`
- **nginx Logs**: `/var/log/nginx/`
- **System Logs**: CloudWatch Logs

### Scaling Configuration

```yaml
# Auto Scaling Configuration
option_settings:
  aws:autoscaling:asg:
    MinSize: 1
    MaxSize: 5
  aws:autoscaling:trigger:
    MeasureName: CPUUtilization
    Statistic: Average
    Unit: Percent
    UpperThreshold: 80
    LowerThreshold: 20
```

## 🔒 Security Considerations

1. **HTTPS Enforcement**: Ensure all traffic is encrypted
2. **HSTS Headers**: Implement HTTP Strict Transport Security
3. **CORS Configuration**: Properly configure cross-origin requests
4. **Rate Limiting**: Implement API rate limiting
5. **WAF Integration**: Consider AWS WAF for additional protection

## 📞 Support

For deployment issues:
- Check AWS CloudWatch logs
- Review Elastic Beanstalk health dashboard
- Contact AWS support if needed

For domain issues:
- Contact GoDaddy support
- Verify DNS configuration
- Check domain registration status

---

**Last Updated**: January 2025
**AWS Region**: us-east-1 (recommended)
**Deployment Method**: Elastic Beanstalk with ALB
