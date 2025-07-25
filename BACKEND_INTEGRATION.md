# Frontend-Backend Integration Guide

This document describes the integration between the Next.js frontend and the Spring Boot backend.

## Overview

The frontend has been updated to communicate with the Spring Boot backend API instead of using mock data or local API routes. The integration includes:

1. **API Configuration** - Centralized API configuration in `src/config/api.ts`
2. **Service Layer** - Type-safe service layer in `src/services/dataEntryService.ts`
3. **Updated Components** - All data entry components now use the backend API

## Components Updated

### 1. CategoryManager (`src/components/dataentry/CategoryManager.tsx`)
- Fetches categories from backend using `DataEntryService.getCategories()`
- Loads subcategories and microcategories dynamically
- Supports creating, updating, and deleting categories
- Uses proper TypeScript interfaces from the service layer

### 2. ProductManager (`src/components/dataentry/ProductManager.tsx`)
- Fetches products from backend using `DataEntryService.getProducts()`
- Displays detailed product information including category hierarchy
- Shows product status badges (Active/Inactive, Approved/Pending, Featured)

### 3. Analytics (`src/components/dataentry/Analytics.tsx`)
- Fetches dashboard analytics from backend using `DataEntryService.getDashboardAnalytics()`
- Displays comprehensive business metrics and insights
- Shows top categories, recent products, and stock status

## Configuration

### Environment Variables
The following environment variables are configured in `.env.local`:

```bash
# Backend API URL (accessible in browser)
NEXT_PUBLIC_API_URL=http://localhost:8080

# API endpoints base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Enable API debugging in development
NEXT_PUBLIC_DEBUG_API=true
```

### API Configuration
The API configuration is centralized in `src/config/api.ts`:

- **Base URL**: Configurable via environment variable
- **Endpoints**: All API endpoints are defined as constants
- **Headers**: Automatic JSON content-type and authorization headers
- **Error Handling**: Centralized error handling with detailed logging

## Testing the Integration

### Prerequisites
1. **Backend Running**: Ensure the Spring Boot backend is running on `http://localhost:8080`
2. **Database**: Backend should have a working MySQL database with sample data
3. **CORS**: Backend should allow CORS requests from `http://localhost:3000`

### Test Steps

1. **Start the Backend**:
   ```bash
   cd D:\itech-backend\itech-backend
   ./mvnw spring-boot:run
   # OR
   java -jar target/itech-backend-0.0.1-SNAPSHOT.jar
   ```

2. **Start the Frontend**:
   ```bash
   cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"
   npm run dev
   ```

3. **Access Data Entry Page**:
   - Open browser to `http://localhost:3000/dataentry`
   - Check browser dev tools for any API errors

4. **Test Category Management**:
   - Click on "Categories" tab
   - Verify categories load from backend
   - Expand categories to load subcategories
   - Try creating a new category
   - Test editing and deleting categories

5. **Test Product Management**:
   - Click on "Products" tab
   - Verify products display with proper details
   - Check that category hierarchy is shown correctly

6. **Test Analytics**:
   - Click on "Analytics" tab
   - Verify dashboard metrics load
   - Check that charts and statistics display properly

### Expected API Calls

When testing, you should see the following API calls in the browser Network tab:

1. **GET** `http://localhost:8080/api/dataentry/categories` - Load categories
2. **GET** `http://localhost:8080/api/dataentry/categories/{id}/subcategories` - Load subcategories
3. **GET** `http://localhost:8080/api/dataentry/subcategories/{id}/microcategories` - Load microcategories
4. **GET** `http://localhost:8080/api/dataentry/products` - Load products
5. **GET** `http://localhost:8080/api/dataentry/analytics/dashboard` - Load analytics
6. **POST** `http://localhost:8080/api/dataentry/categories` - Create category
7. **PUT** `http://localhost:8080/api/dataentry/categories/{id}` - Update category
8. **DELETE** `http://localhost:8080/api/dataentry/categories/{id}` - Delete category

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend has CORS configuration allowing `http://localhost:3000`
   - Check `@CrossOrigin` annotations on controllers

2. **API Endpoint Not Found (404)**:
   - Verify backend controllers are properly mapped
   - Check that Spring Boot application is running on port 8080
   - Verify API endpoints match the ones defined in `src/config/api.ts`

3. **Network Connection Refused**:
   - Ensure backend is running and accessible
   - Try accessing `http://localhost:8080/api/dataentry/categories` directly in browser

4. **Type Errors**:
   - Verify that backend API responses match the TypeScript interfaces in `src/services/dataEntryService.ts`
   - Check console for detailed error messages

5. **Environment Variables Not Working**:
   - Restart the Next.js dev server after changing `.env.local`
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access

### Debug Mode

Enable debug mode by setting `NEXT_PUBLIC_DEBUG_API=true` in `.env.local`. This will:
- Log all API requests and responses to browser console
- Show detailed error information
- Display request timing information

## Data Flow

```
Frontend Component
    ↓
DataEntryService (API Service Layer)
    ↓
API Configuration (Headers, Base URL)
    ↓
HTTP Request to Spring Boot Backend
    ↓
Backend Controller → Service → Repository → Database
    ↓
JSON Response
    ↓
Type-safe Response Parsing
    ↓
Component State Update
    ↓
UI Rendering
```

## Next Steps

1. **Authentication Integration**: Add JWT token handling to API requests
2. **Real-time Updates**: Implement WebSocket connections for live data updates
3. **Caching**: Add response caching for better performance
4. **Error Boundaries**: Implement React error boundaries for better error handling
5. **Loading States**: Add skeleton loaders and better loading indicators
6. **Pagination**: Implement proper pagination for large datasets
