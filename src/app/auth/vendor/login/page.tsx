'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOTP, clearError, sendForgotPasswordOtp, setTempCredentials, checkEmailRole } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function VendorLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [showLoginWithOtp, setShowLoginWithOtp] = useState(false);
  const [directApiTest, setDirectApiTest] = useState('');
  
  // Direct API test function for debugging
  const testDirectApiCall = async () => {
    console.log('🧪 Testing direct API call...');
    setDirectApiTest('Testing...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: 'vendor@test.com',
          password: 'test123'
        }),
      });
      
      console.log('📋 Direct API Response Status:', response.status);
      console.log('📋 Direct API Response Headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Direct API Error Text:', errorText);
        setDirectApiTest(`Error ${response.status}: ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('✅ Direct API Success:', result);
      setDirectApiTest(`Success: ${result.message || 'Login successful'}`);
      
    } catch (error: any) {
      console.error('❌ Direct API Fetch Error:', error);
      setDirectApiTest(`Fetch Error: ${error.message}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting vendor login process with:', formData);
    
    try {
      // Clear any previous errors
      dispatch(clearError());
      
      const loginData = {...formData, userType: 'vendor'};
      console.log('📤 Dispatching vendor login with:', loginData);
      
      const result = await dispatch(login(loginData));
      console.log('📥 Vendor login result:', result);
      console.log('📊 Current Redux state after vendor login:', { loading, error, otpSent, tempCredentials });
      
      // Additional debugging
      console.log('🔍 Login result type:', result.type);
      console.log('🔍 Login result payload:', result.payload);
    
    if (login.fulfilled.match(result)) {
      console.log('✅ Vendor login fulfilled with payload:', result.payload);
      
      // Check if user is authenticated and redirect to vendor dashboard
      if (result.payload.user) {
        const userRole = result.payload.user.role;
        console.log('👤 User role from login response:', userRole);
        
        // Accept vendor role formats including SELLER
        const isVendor = userRole === 'ROLE_VENDOR' || userRole === 'SELLER';
        
        if (isVendor) {
          console.log('✅ Vendor authenticated, redirecting to vendor dashboard');
          
          // Immediate redirect with multiple approaches
          router.replace('/dashboard/vendor-panel');  // Use replace instead of push
          
          // Also set a flag to prevent further redirects
          localStorage.setItem('vendorLoginRedirect', 'true');
          
          // Backup redirect after short delay
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard/vendor-panel') {
              console.log('🔄 Backup redirect triggered');
              window.location.href = '/dashboard/vendor-panel';
            }
          }, 500);
        } else {
          console.log('⚠️ User role mismatch for vendor portal:', userRole);
          // Only show error if role is clearly not vendor
          if (userRole === 'ROLE_USER' || userRole === 'ROLE_ADMIN') {
            dispatch(clearError());
            alert('This account is not registered as a vendor. Please use the correct login portal.');
            return;
          } else {
            // For unclear roles, try to redirect anyway
            console.log('🤔 Unclear role, redirecting to vendor dashboard anyway');
            router.push('/dashboard/vendor-panel');
          }
        }
      } else {
        console.log('📧 No user in response, may require OTP');
      }
      
      console.log('🔄 Vendor login completed, waiting for Redux state update...');
    } else if (login.rejected.match(result)) {
      console.log('❌ Vendor login rejected with payload:', result.payload);
      
      // Handle specific password validation error to enable OTP option
      if (result.payload === 'Invalid email and password' && formData.emailOrPhone && formData.password) {
        console.log('🔑 Setting tempCredentials manually for vendor OTP flow');
        dispatch(setTempCredentials(formData));
      }
      
      // Just show the error, don't automatically go to OTP form
      // User can manually choose "Login with OTP instead" option
    }
    } catch (error) {
      console.error('❌ Vendor login catch error:', error);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempCredentials) {
      const result = await dispatch(verifyOTP({
        emailOrPhone: tempCredentials.emailOrPhone,
        otp: otpCode,
      }));
      
      if (verifyOTP.fulfilled.match(result)) {
        // Check user role after OTP verification
        if (result.payload.user) {
          const userRole = result.payload.user.role;
          const isVendor = userRole === 'ROLE_VENDOR' || userRole === 'SELLER';
          
          if (isVendor) {
            // Immediate redirect after OTP verification
            router.replace('/dashboard/vendor-panel');
            
            // Set flag and backup redirect
            localStorage.setItem('vendorLoginRedirect', 'true');
            setTimeout(() => {
              if (window.location.pathname !== '/dashboard/vendor-panel') {
                console.log('🔄 OTP Backup redirect triggered');
                window.location.href = '/dashboard/vendor-panel';
              }
            }, 500);
          } else {
            // Only show error for clearly non-vendor roles
            if (userRole === 'ROLE_USER' || userRole === 'ROLE_ADMIN') {
              alert('This account is not registered as a vendor. Please use the correct login portal.');
            } else {
              // For unclear roles, redirect anyway
              router.push('/dashboard/vendor-panel');
            }
          }
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Show "Login with OTP instead" button when there's an error
  React.useEffect(() => {
    if (error && !otpSent) {
      console.log('📧 Showing Login with OTP option due to vendor login error:', error);
      setShowLoginWithOtp(true);
    } else {
      setShowLoginWithOtp(false);
    }
  }, [error, otpSent]);

  // Check if user is already authenticated as vendor
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role;
      const isVendor = userRole === 'ROLE_VENDOR' || userRole === 'SELLER';
      
      if (isVendor) {
        console.log('✅ User already authenticated as vendor, redirecting to dashboard');
        
        // Immediate redirect for already authenticated vendor
        router.replace('/dashboard/vendor-panel');
        
        // Backup redirect if needed
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard/vendor-panel') {
            console.log('🔄 Already authenticated backup redirect');
            window.location.href = '/dashboard/vendor-panel';
          }
        }, 300);
      }
    }
  }, [isAuthenticated, user, router]);

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to your email/phone
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vendor Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your vendor account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                name="emailOrPhone"
                type="text"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Email or Phone"
                required
                autoComplete="username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {error && showLoginWithOtp && (
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
                onClick={async () => {
                  console.log('🔄 Vendor clicking Login with OTP instead');
                  
                  // Extract email from emailOrPhone field
                  const email = formData.emailOrPhone.includes('@') 
                    ? formData.emailOrPhone 
                    : '';
                  
                  if (!email) {
                    alert('Please enter your email to login with OTP');
                    return;
                  }
                  
                  console.log('🔍 Checking if email belongs to vendor role:', email);
                  
                  // First check if this email belongs to a vendor
                  const roleCheckResult = await dispatch(checkEmailRole(email));
                  
                  if (checkEmailRole.fulfilled.match(roleCheckResult)) {
                    const payload = roleCheckResult.payload as any;
                    
                    // Handle different response formats
                    const exists = payload?.exists !== undefined ? payload.exists : true;
                    const role = payload?.role || 'vendor';
                    
                    if (exists === false || exists === 'false') {
                      alert('Email not found. Please check your email address.');
                      return;
                    }
                    
                    // Check if email belongs to VENDOR role
                    if (role !== 'ROLE_VENDOR' && role !== 'VENDOR') {
                      const roleType = role === 'ROLE_USER' ? 'user' : 
                                     role === 'ROLE_ADMIN' ? 'admin' : 'different';
                      alert(`This email is registered as a ${roleType}. Please use the correct login portal.`);
                      return;
                    }
                    
                    // Email belongs to vendor, proceed with OTP
                    console.log('✅ Email belongs to vendor, sending OTP');
                    dispatch(sendForgotPasswordOtp(formData.emailOrPhone));
                    dispatch(setTempCredentials(formData));
                    setShowLoginWithOtp(false);
                  } else {
                    console.error('❌ Email role check failed:', roleCheckResult.payload);
                    alert('Unable to verify email. Please try again.');
                  }
                }}
              >
                Login with OTP instead
              </button>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="text-center space-y-4">
            {/* Direct API Test Button for Debugging */}
            <div className="mb-4">
              <button
                type="button"
                onClick={testDirectApiCall}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-2"
              >
                Test Direct API Call (Debug)
              </button>
              {directApiTest && (
                <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                  {directApiTest}
                </p>
              )}
            </div>
            
            {/* Temporary debug button */}
            {isAuthenticated && user && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔄 Debug: Manual navigation to dashboard');
                    window.location.href = '/dashboard/vendor-panel';
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Go to Dashboard (Debug)
                </button>
                <p className="text-xs text-gray-500 mt-1">User: {user.email} | Role: {user.role}</p>
              </div>
            )}
            
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/auth/vendor/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
