# AWS Elastic Beanstalk HTTPS Setup Instructions

## Current Issue:
Your Vercel frontend (HTTPS) cannot connect to AWS backend (HTTP only) due to Mixed Content Security Policy.

## Solution: Enable HTTPS on AWS Elastic Beanstalk

### Option 1: Load Balancer with SSL Certificate (Recommended)

1. **Go to AWS Elastic Beanstalk Console:**
   - Navigate to your `indianmart` application
   - Go to Configuration → Load Balancer

2. **Add HTTPS Listener:**
   - Click "Add Listener"
   - Protocol: HTTPS
   - Port: 443
   - SSL Certificate: Request or import SSL certificate

3. **Request SSL Certificate (AWS Certificate Manager):**
   - Go to AWS Certificate Manager
   - Request public certificate for `indianmart.ap-south-1.elasticbeanstalk.com`
   - Add domain validation

### Option 2: Application Load Balancer Configuration

1. **Enable Load Balancer:**
   ```yaml
   # .ebextensions/https-redirect.config
   Resources:
     AWSEBV2LoadBalancerListener443:
       Type: AWS::ElasticLoadBalancingV2::Listener
       Properties:
         DefaultActions:
           - Type: forward
             TargetGroupArn:
               Ref: AWSEBV2LoadBalancerTargetGroup
         LoadBalancerArn:
           Ref: AWSEBV2LoadBalancer
         Port: 443
         Protocol: HTTPS
         Certificates:
           - CertificateArn: arn:aws:acm:region:account:certificate/certificate-id
   ```

### Option 3: Environment Configuration (Temporary Fix)

If you cannot enable HTTPS immediately, you can temporarily allow mixed content:

#### Next.js Configuration Update:
```typescript
// next.config.ts - Add to headers function
{
  key: 'Content-Security-Policy',
  value: 'upgrade-insecure-requests'
}
```

## Quick Steps to Enable HTTPS:

1. **Go to AWS Console → Elastic Beanstalk**
2. **Select your application: `indianmart`**
3. **Configuration → Load Balancer**
4. **Add HTTPS Listener on port 443**
5. **Get SSL Certificate from AWS Certificate Manager**
6. **Update application to redirect HTTP to HTTPS**

## Backend URL After HTTPS Setup:
- Current: `http://indianmart.ap-south-1.elasticbeanstalk.com`
- Target: `https://indianmart.ap-south-1.elasticbeanstalk.com`

## Verification:
Once HTTPS is enabled, test with:
```bash
curl -I https://indianmart.ap-south-1.elasticbeanstalk.com
```

Should return `200 OK` instead of connection error.
