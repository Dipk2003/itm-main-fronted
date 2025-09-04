# 🚀 iTech Marketplace - Quick Start Guide

## Issues Fixed

### 1. Vendor Login Authentication ✅
- Fixed role-based authentication flow
- Corrected dashboard routing for vendors
- Enhanced error handling and token management

### 2. Product Creation ✅  
- Fixed API endpoint integration (/api/v1/products/vendor/add)
- Enhanced authentication token handling
- Added proper error messages and validation

### 3. Static vs Dynamic Data ✅
- Disabled mock mode for production
- Fixed API client configuration
- Enhanced fallback mechanisms

## Quick Start Instructions

### 1. Backend Setup
```bash
cd "D:\itech-backend\itech-backend"

# Start MySQL database first
# Make sure MySQL is running on localhost:3306

# Start the backend server
mvn spring-boot:run

# Or use the provided script
.\start-backend.bat
```

### 2. Frontend Setup
```bash
cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"

# Install dependencies (if not already done)
npm install

# Start the frontend server
npm run dev
```

### 3. Test the Integration
```bash
# Check backend health
node check-backend-health.js

# Run integration tests
node run-integration-tests.js
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Backend Health: http://localhost:8080/actuator/health

## Testing Vendor Flow

### 1. Register a Vendor
1. Go to: http://localhost:3000/auth/vendor/register
2. Fill in vendor details
3. Complete email verification if required

### 2. Login as Vendor
1. Go to: http://localhost:3000/auth/vendor/login
2. Use vendor credentials
3. Should redirect to: http://localhost:3000/dashboard/vendor-panel

### 3. Add Products
1. In vendor dashboard, go to "Add Product" tab
2. Fill in product details
3. Submit - should save to database

## Troubleshooting

### If Backend Connection Fails:
1. Check if backend is running on port 8080
2. Verify MySQL database is accessible
3. Check application.properties configuration
4. Look for CORS issues in browser console

### If Authentication Fails:
1. Check JWT token configuration
2. Verify user roles in database
3. Clear browser localStorage and try again

### If Products Don't Save:
1. Verify vendor is authenticated
2. Check database connection
3. Look for validation errors in backend logs

## Environment Configuration

The script has created a `.env.local` file with:
- Backend API URL: http://localhost:8080
- Mock mode: DISABLED
- Debug mode: ENABLED

## Database Setup

Ensure your MySQL database has:
1. Database name: `itech_db`
2. Username: `root`
3. Password: `root` (or update in application.properties)
4. Tables created via Flyway migrations

## Support

If issues persist:
1. Check browser console for errors
2. Check backend console for logs
3. Verify network connectivity
4. Check firewall settings
