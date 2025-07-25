# Multi-Database Authentication Integration

This document describes the integrated multi-database authentication system that routes users, vendors, and admins to separate database tables.

## Backend Integration (D:\itech-backend\itech-backend)

### 1. Updated AuthService.java
- Routes registration requests to appropriate tables based on role
- Uses single `/auth/register` endpoint that checks `role` field
- Supports `ROLE_USER`, `ROLE_VENDOR`, and `ROLE_ADMIN`
- Admin registration requires `adminCode` for security

### 2. Database Tables
- **Users Table**: For regular buyers (ROLE_USER)
- **Vendors Table**: For sellers (ROLE_VENDOR) 
- **Admins Table**: For administrators (ROLE_ADMIN)

### 3. Excel Import Integration
- **New Endpoint**: `/api/excel/import/{vendorId}`
- **Template Endpoint**: `/api/excel/template`
- Supports both CSV and Excel file formats
- Complete validation and error reporting
- Works with existing product management system

## Frontend Integration (C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main)

### 1. Role-Specific Login Pages
- **User Login**: `/auth/user/login` - Blue theme, routes to user dashboard
- **Vendor Login**: `/auth/vendor/login` - Green theme, routes to vendor dashboard  
- **Admin Login**: `/auth/admin/login` - Red theme, requires admin code

### 2. Updated Authentication Flow
- **Unified Auth API**: Uses single backend endpoints with role-based routing
- **Excel Import**: Integrated into vendor dashboard with template download
- **Role Validation**: Ensures users can only access appropriate dashboards

### 3. Excel Import Features
- **File Upload**: Supports .xlsx, .xls, and .csv files
- **Template Download**: Pre-formatted template with sample data
- **Progress Tracking**: Shows successful/failed imports with detailed errors
- **Category Management**: Automatically creates categories if they don't exist

## Testing the Integration

### 1. User Registration & Login
```
URL: http://localhost:3000/auth/user/register
- Registers to Users table
- Login redirects to /dashboard/user
```

### 2. Vendor Registration & Login  
```
URL: http://localhost:3000/auth/vendor/register
- Registers to Vendors table
- Login redirects to /dashboard/vendor
- Access to Excel import functionality
```

### 3. Admin Registration & Login
```
URL: http://localhost:3000/auth/admin/login
- Requires admin code: ADMIN2025
- Registers to Admins table
- Login redirects to /dashboard/admin
```

### 4. Excel Import Testing
```
URL: http://localhost:3000/dashboard/vendor (Products tab > Excel Import)
1. Download template from /api/excel/template
2. Fill with product data
3. Upload via /api/excel/import/{vendorId}
4. View import results and created products
```

## API Endpoints

### Authentication
- `POST /auth/register` - Unified registration (routes by role)
- `POST /auth/send-login-otp` - Unified login OTP
- `POST /auth/verify-otp` - OTP verification

### Excel Import
- `POST /api/excel/import/{vendorId}` - Import products from Excel/CSV
- `GET /api/excel/template` - Download import template

## Database Schema Changes

The backend now uses three separate tables:
1. **user** - Regular users/buyers
2. **vendors** - Sellers/vendors  
3. **admins** - System administrators

Each table has the same basic structure but allows for role-specific fields and access patterns.

## Security Features

- **Admin Code**: Required for admin registration/login
- **Role Validation**: Users can only access their designated dashboards
- **Table Isolation**: Each user type is stored in separate tables
- **JWT Tokens**: Include role information for authorization

## File Structure

### Backend Files Modified/Added:
- `AuthService.java` - Updated for multi-table routing
- `ExcelImportService.java` - New comprehensive import service
- `ExcelImportController.java` - New REST endpoints

### Frontend Files Modified/Added:
- `auth/authSlice.ts` - Updated for unified endpoints
- `auth/user/login/page.tsx` - User-specific login
- `auth/vendor/login/page.tsx` - Vendor-specific login  
- `auth/admin/login/page.tsx` - Admin-specific login (new)
- `vendor/ExcelImport.tsx` - Updated for new endpoints
- `lib/auth.ts` - Updated API functions
- `lib/vendorApi.ts` - Added Excel import functions

This integration provides a complete multi-database authentication system with Excel import functionality, ensuring proper separation of user types while maintaining a unified user experience.
