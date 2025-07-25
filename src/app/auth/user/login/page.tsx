'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOtp, clearError, sendForgotPasswordOtp, setTempCredentials, checkEmailRole } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AuthRedirect from '@/components/auth/AuthRedirect';
import ForgotPassword from '@/components/auth/ForgotPassword';

export default function UserLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLoginWithOtp, setShowLoginWithOtp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting login process with:', formData);
    
    const loginData = {...formData, userType: 'user'};
    console.log('📤 Dispatching login with:', loginData);
    
    const result = await dispatch(login(loginData));
    console.log('📥 Login result:', result);
    console.log('📊 Current Redux state after login:', { loading, error, otpSent, tempCredentials });
    
    if (login.fulfilled.match(result)) {
      console.log('✅ Login fulfilled with payload:', result.payload);
      
      // Check if user is authenticated and redirect to user dashboard
      if (result.payload.user && (result.payload.user.role === 'USER' || result.payload.user.role === 'ROLE_USER')) {
        console.log('User authenticated, redirecting to user dashboard');
        router.push('/dashboard/user');
      } else if (result.payload.user && result.payload.user.role !== 'USER' && result.payload.user.role !== 'ROLE_USER') {
        // If user has wrong role, show error
        dispatch(clearError());
        alert('This account is not registered as a user. Please use the correct login portal.');
        return;
      }
      // For regular users, OTP form will be shown automatically based on Redux state
      console.log('🔄 Login completed, waiting for Redux state update...');
    } else if (login.rejected.match(result)) {
      console.log('❌ Login rejected with payload:', result.payload);
      // Just show the error, don't automatically go to OTP form
      // User can manually choose "Login with OTP instead" option
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 OTP Verification Debug:');
    console.log('  - tempCredentials:', tempCredentials);
    console.log('  - otpCode:', otpCode);
    console.log('  - loading:', loading);
    
    if (!tempCredentials) {
      console.error('❌ No temp credentials found!');
      alert('Session expired. Please try logging in again.');
      return;
    }
    
    if (!otpCode || otpCode.trim().length === 0) {
      console.error('❌ No OTP code entered!');
      alert('Please enter the OTP code.');
      return;
    }
    
    try {
      console.log('🚀 Dispatching verifyOtp with:', {
        emailOrPhone: tempCredentials.emailOrPhone,
        otp: otpCode,
      });
      
      const result = await dispatch(verifyOtp({
        emailOrPhone: tempCredentials.emailOrPhone,
        otp: otpCode,
      }));
      
      console.log('📨 verifyOtp result:', result);
      
      if (verifyOtp.fulfilled.match(result)) {
        console.log('✅ OTP verification successful!');
        // Check user role after OTP verification
        if (result.payload.user && (result.payload.user.role === 'USER' || result.payload.user.role === 'ROLE_USER')) {
          console.log('🎯 Redirecting to user dashboard');
          router.push('/dashboard/user');
        } else {
          console.error('❌ User role mismatch:', result.payload.user?.role);
          alert('This account is not registered as a user. Please use the correct login portal.');
        }
      } else if (verifyOtp.rejected.match(result)) {
        console.error('❌ OTP verification rejected:', result.payload);
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginWithOtp = async () => {
    if (formData.emailOrPhone) {
      // Extract email if it's email/phone field
      const email = formData.emailOrPhone.includes('@') 
        ? formData.emailOrPhone 
        : ''; // If it's phone, you might need to handle differently
      
      if (email) {
        console.log('🔍 Checking if email belongs to user role before showing OTP option:', email);
        
        // First check if this email belongs to a user
        const roleCheckResult = await dispatch(checkEmailRole(email));
        
        if (checkEmailRole.fulfilled.match(roleCheckResult)) {
          const { exists, role } = roleCheckResult.payload;
          
          if (!exists || exists === 'false') {
            alert('Email not found. Please check your email address.');
            return;
          }
          
          // Check if email belongs to USER role
          if (role !== 'ROLE_USER' && role !== 'USER') {
            const roleType = role === 'ROLE_VENDOR' ? 'vendor' : 
                           role === 'ROLE_ADMIN' ? 'admin' : 'different';
            alert(`This email is registered as a ${roleType}. Please use the correct login portal.`);
            return;
          }
          
          // Email belongs to user, proceed with OTP
          console.log('✅ Email belongs to user, sending OTP');
          const result = await dispatch(sendForgotPasswordOtp({ email }));
          if (sendForgotPasswordOtp.fulfilled.match(result)) {
            dispatch(setTempCredentials(formData));
            setShowLoginWithOtp(true);
          }
        } else {
          console.error('❌ Email role check failed:', roleCheckResult.payload);
          alert('Unable to verify email. Please try again.');
        }
      } else {
        alert('Please enter your email to login with OTP');
      }
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowLoginWithOtp(false);
    dispatch(clearError());
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Debug Redux state changes
  React.useEffect(() => {
    console.log('🔄 Redux state changed:');
    console.log('  - otpSent:', otpSent);
    console.log('  - tempCredentials:', tempCredentials);
    console.log('  - loading:', loading);
    console.log('  - error:', error);
  }, [otpSent, tempCredentials, loading, error]);

  if (otpSent || showLoginWithOtp) {
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

  // Show forgot password component
  if (showForgotPassword) {
    return (
      <>
        <AuthRedirect />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <ForgotPassword onBackToLogin={handleBackToLogin} />
        </div>
      </>
    );
  }

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              User Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your buyer account
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

            {/* Show error and login with OTP option if password is wrong */}
            {error && (
              <div className="space-y-3">
                <div className="text-red-600 text-sm text-center">{error}</div>
                {error.toLowerCase().includes('password') || error.toLowerCase().includes('invalid') ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Wrong password?</p>
                    <button
                      type="button"
                      onClick={handleLoginWithOtp}
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Login with OTP instead
                    </button>
                  </div>
                ) : null}
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
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="/auth/user/register" className="font-medium text-indigo-600 hover:text-indigo-500">
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
