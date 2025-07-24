'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOtp, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AuthRedirect from './AuthRedirect';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    adminCode: '', // Add admin code field
  });
  
  const [showAdminCode, setShowAdminCode] = useState(false);
  
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Starting login process for:', formData.emailOrPhone);
    
    const result = await dispatch(login(formData));
    console.log('📝 Login result:', result);
    
    if (login.fulfilled.match(result)) {
      console.log('✅ Login action fulfilled');
      
      // Check if user is authenticated (means admin bypassed OTP or direct login)
      if (result.payload.user && result.payload.token) {
        console.log('🚀 User authenticated directly, redirecting...');
        const userRole = result.payload.user.role || result.payload.user.userType;
        
        if (userRole === 'ADMIN' || userRole === 'admin' || userRole === 'ROLE_ADMIN') {
          console.log('Admin user detected, redirecting to admin dashboard');
          router.push('/dashboard/admin');
        } else if (userRole === 'VENDOR' || userRole === 'vendor' || userRole === 'ROLE_VENDOR') {
          console.log('Vendor user detected, redirecting to vendor dashboard');
          router.push('/dashboard/vendor');
        } else {
          console.log('Regular user detected, redirecting to user dashboard');
          router.push('/dashboard/user');
        }
      } else if (result.payload.message && (
        result.payload.message.includes('OTP sent') || 
        result.payload.message.includes('OTP has been sent')
      )) {
        console.log('📧 OTP sent to user, showing OTP verification form');
        // OTP form will be shown automatically by Redux state change
      } else if (typeof result.payload === 'string' && (
        result.payload.includes('OTP sent') || 
        result.payload.includes('OTP has been sent')
      )) {
        console.log('📧 OTP sent (string response), showing OTP verification form');
        // OTP form will be shown automatically by Redux state change
      } else {
        console.warn('⚠️ Unexpected login response, staying on login form');
      }
    } else if (login.rejected.match(result)) {
      console.log('❌ Login rejected:', result.payload);
      // Error will be displayed by Redux state, user stays on login form
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔘 OTP Verification Button Clicked!');
    console.log('🔐 OTP Verification - Debug Info:');
    console.log('- Event:', e);
    console.log('- OTP Code:', otpCode);
    console.log('- OTP Code Length:', otpCode.length);
    console.log('- Temp Credentials:', tempCredentials);
    console.log('- Loading:', loading);
    console.log('- Button should be disabled:', (loading || otpCode.length < 4));
    
    // Alert first to confirm button is working
    alert(`🔘 Button clicked! OTP: "${otpCode}" (length: ${otpCode.length})`);
    
    if (!otpCode || otpCode.length < 4) {
      console.log('❌ OTP too short or empty');
      alert('Please enter at least 4 digits for OTP');
      return;
    }
    
    if (!tempCredentials) {
      console.log('❌ No temp credentials found');
      alert('Session expired. Please login again.');
      window.location.reload();
      return;
    }
    
    console.log('🚀 Attempting OTP verification...');
    alert('🚀 Starting OTP verification process...');
    
    try {
      const result = await dispatch(verifyOtp({
        emailOrPhone: tempCredentials.emailOrPhone,
        otp: otpCode,
      }));
      
      console.log('📝 OTP Verification Result:', result);
      alert('📝 Got response: ' + JSON.stringify(result.type));
      
      if (verifyOtp.fulfilled.match(result)) {
        console.log('✅ OTP verification successful!');
        console.log('User data:', result.payload.user);
        alert('✅ OTP verification successful!');
        
        // Navigate based on user role
        const userRole = result.payload.user?.role || result.payload.user?.userType;
        console.log('User role for navigation:', userRole);
        
        if (userRole === 'ADMIN' || userRole === 'admin' || userRole === 'ROLE_ADMIN') {
          console.log('🚀 Redirecting to admin dashboard...');
          alert('🚀 Redirecting to admin dashboard...');
          router.push('/dashboard/admin');
        } else if (userRole === 'VENDOR' || userRole === 'vendor' || userRole === 'ROLE_VENDOR') {
          console.log('🚀 Redirecting to vendor dashboard...');
          alert('🚀 Redirecting to vendor dashboard...');
          router.push('/dashboard/vendor');
        } else {
          console.log('🚀 Redirecting to user dashboard...');
          alert('🚀 Redirecting to user dashboard...');
          router.push('/dashboard/user');
        }
      } else if (verifyOtp.rejected.match(result)) {
        console.log('❌ OTP verification rejected:', result.payload);
        alert('❌ OTP verification failed: ' + JSON.stringify(result.payload));
        // Error will be shown by Redux state, but let's also clear OTP
        setOtpCode('');
      }
    } catch (error) {
      console.log('💥 OTP verification error:', error);
      alert('💥 Error: ' + (error as Error).message);
      setOtpCode('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Show admin code field if email contains 'admin'
    if (name === 'emailOrPhone' && value.toLowerCase().includes('admin')) {
      setShowAdminCode(true);
      // Auto-fill admin code
      setFormData(prev => ({ ...prev, adminCode: 'ADMIN2025' }));
    } else if (name === 'emailOrPhone' && !value.toLowerCase().includes('admin')) {
      setShowAdminCode(false);
      setFormData(prev => ({ ...prev, adminCode: '' }));
    }
  };

  // Handle navigation when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, navigating to dashboard...');
      console.log('User:', user);
      
      const userRole = user.role || user.userType;
      console.log('Navigation - User role:', userRole);
      
      if (userRole === 'ADMIN' || userRole === 'admin' || userRole === 'ROLE_ADMIN') {
        console.log('🚀 Auto-navigating to admin dashboard');
        router.push('/dashboard/admin');
      } else if (userRole === 'VENDOR' || userRole === 'vendor' || userRole === 'ROLE_VENDOR') {
        console.log('🚀 Auto-navigating to vendor dashboard');
        router.push('/dashboard/vendor');
      } else {
        console.log('🚀 Auto-navigating to user dashboard');
        router.push('/dashboard/user');
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
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center font-mono text-lg"
              />
            </div>
            
            {/* OTP Input Feedback */}
            <div className="text-center text-xs text-gray-500">
              {otpCode.length === 0 && "Enter your OTP"}
              {otpCode.length > 0 && otpCode.length < 4 && `${otpCode.length} digits - need at least 4`}
              {otpCode.length >= 4 && otpCode.length < 6 && `${otpCode.length} digits - button enabled`}
              {otpCode.length === 6 && "✅ Ready to verify!"}
              {otpCode.length > 6 && "Too many digits"}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div>
              {/* EMERGENCY FIX - Super simple button */}
              <button
                onClick={() => {
                  alert('🔘 BUTTON CLICKED! OTP: ' + otpCode);
                  console.log('🔘 EMERGENCY BUTTON CLICKED!');
                  console.log('OTP Code:', otpCode);
                  console.log('Loading:', loading);
                  console.log('Temp Credentials:', tempCredentials);
                  
                  // Call the handler
                  handleOtpVerification({ 
                    preventDefault: () => console.log('preventDefault called'),
                    stopPropagation: () => console.log('stopPropagation called')
                  } as any);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: (loading || otpCode.length < 4) ? '#9ca3af' : '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: (loading || otpCode.length < 4) ? 'not-allowed' : 'pointer',
                  opacity: (loading || otpCode.length < 4) ? 0.6 : 1
                }}
                disabled={loading || otpCode.length < 4}
              >
                {loading ? '⏳ Verifying...' : `🔐 Verify OTP ${otpCode.length >= 4 ? '✓' : '(' + otpCode.length + '/4)'}`}
              </button>
              
              {/* TEST BUTTON - Always enabled */}
              <button
                onClick={() => {
                  alert('🧪 TEST BUTTON WORKS! JavaScript is working fine.');
                  console.log('🧪 TEST BUTTON CLICKED - JavaScript working!');
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginTop: '8px',
                  cursor: 'pointer'
                }}
              >
                🧪 TEST - Click Me (Always Works)
              </button>
              
              {/* MANUAL TRIGGER BUTTON */}
              <button
                onClick={async () => {
                  alert('🚀 MANUAL TRIGGER - Starting OTP verification...');
                  try {
                    const result = await dispatch(verifyOtp({
                      emailOrPhone: tempCredentials?.emailOrPhone || 'test',
                      otp: otpCode,
                    }));
                    alert('📝 Manual result: ' + JSON.stringify(result.type));
                  } catch (error) {
                    alert('❌ Manual error: ' + error);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginTop: '4px',
                  cursor: 'pointer'
                }}
                disabled={!tempCredentials || !otpCode}
              >
                🚀 MANUAL OTP VERIFY (Direct API Call)
              </button>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <div><strong>Debug Info:</strong></div>
              <div>OTP: {otpCode} (length: {otpCode.length})</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Button enabled: {(!loading && otpCode.length >= 4) ? 'Yes' : 'No'}</div>
              <div>Temp Credentials: {tempCredentials ? 'Available' : 'Missing'}</div>
              {tempCredentials && <div>Email/Phone: {tempCredentials.emailOrPhone}</div>}
              {error && <div className="text-red-600">Error: {error}</div>}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your B2B marketplace
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
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                    showAdminCode ? '' : 'rounded-b-md'
                  }`}
                />
              </div>
              {showAdminCode && (
                <div>
                  <Input
                    name="adminCode"
                    type="text"
                    value={formData.adminCode}
                    onChange={handleChange}
                    placeholder="Admin Access Code"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Admin access code is required for admin accounts</p>
                </div>
              )}
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
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
