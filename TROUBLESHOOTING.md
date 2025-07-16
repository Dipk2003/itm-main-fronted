# Troubleshooting Network Issues

## Analysis of Current Issue

Based on the backend logs, the issue is NOT a network connectivity problem. The backend server is running correctly on port 8080, but there are **authentication/authorization issues**:

### Backend Log Analysis:
- ✅ Server is running on port 8080
- ✅ Login is working (JWT tokens are generated)
- ❌ **403 Forbidden** errors on bulk import endpoint
- ❌ User trying to access `/vendor/11/products/bulk-import` but authentication is failing

## Root Cause: Authentication Issues

### 1. JWT Token Not Being Sent Properly

**Problem**: The JWT token might not be included in the request headers or is malformed.

**Solution**:
- Check if token is stored in localStorage: `localStorage.getItem('token')`
- Verify token format: Should start with `Bearer `
- Ensure Authorization header is properly set

### 2. User ID Mismatch

**Problem**: Frontend trying to access `/vendor/11/products/bulk-import` but user ID might be different.

**Solution**:
- Get actual user ID from authenticated session
- Use correct user ID in API endpoints
- Check user role and permissions

### 3. Endpoint Configuration Issues

**Problem**: The bulk import endpoint might not be properly configured or have different path.

**Solution**:
- Try different endpoint variations:
  - `/vendor/{userId}/products/bulk-import`
  - `/api/products/vendor/bulk-import`
  - `/api/vendor/products/bulk-import`

## Common Network Errors

### AxiosError: Network Error

This error typically occurs when the frontend cannot connect to the backend server. Here are the most common causes and solutions:

## 1. Backend Server Not Running

**Problem**: The backend server is not started or has crashed.

**Solution**:
- Check if the backend server is running on `http://localhost:8080`
- Start the backend server if it's not running
- Check the console for backend server logs

**Verification**:
```bash
# Check if port 8080 is listening
netstat -an | findstr ":8080"

# Or test the health endpoint
curl http://localhost:8080/health
```

## 2. CORS Issues

**Problem**: Cross-Origin Resource Sharing (CORS) configuration is preventing frontend from accessing backend.

**Solution**:
- Ensure backend CORS is configured to allow `http://localhost:3000` (or your frontend URL)
- Check if credentials are being sent properly

## 3. Authentication Issues

**Problem**: 403 Forbidden errors due to authentication problems.

**Solution**:
- Check if JWT token is present in localStorage
- Verify token is not expired
- Ensure proper Authorization header is being sent

## 4. Network Timeout

**Problem**: Request takes too long and times out.

**Solution**:
- Increase timeout in api.ts (currently set to 30 seconds)
- Check backend server performance
- Verify network connectivity

## 5. Port Conflicts

**Problem**: Another application is using port 8080.

**Solution**:
- Stop other applications using port 8080
- Or configure backend to use a different port and update `baseURL` in api.ts

## Debugging Steps

1. **Check Browser Developer Tools**:
   - Open Network tab
   - Look for failed requests
   - Check request headers and response

2. **Check Console Logs**:
   - Look for error messages in browser console
   - Check backend server logs

3. **Test API Endpoints**:
   ```bash
   # Test if backend is responding
   curl -v http://localhost:8080/health
   
   # Test with authentication
   curl -v -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/endpoint
   ```

4. **Verify Environment Configuration**:
   - Check if `baseURL` in `src/lib/api.ts` matches your backend URL
   - Verify all environment variables are set correctly

## Current Error Handling

The ExcelImport component now includes enhanced error handling for:
- Network connectivity issues
- Authentication errors (403)
- Not found errors (404)
- Server errors (500+)
- Timeout errors

Error messages will provide specific guidance based on the type of error encountered.

## Environment-Specific Solutions

### Development Environment
- Ensure both frontend (usually :3000) and backend (:8080) are running
- Check if Windows Defender or antivirus is blocking connections
- Verify firewall settings

### Production Environment
- Check if backend server is accessible from frontend server
- Verify SSL certificates if using HTTPS
- Check reverse proxy configuration if applicable

## Getting Help

If you continue experiencing issues:
1. Check the browser console for specific error messages
2. Verify the backend server logs
3. Test API endpoints directly using curl or Postman
4. Check network configuration and firewall settings
