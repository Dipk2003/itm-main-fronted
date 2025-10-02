'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOTP, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function SupportLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting Support login process with:', formData);
    
    const loginData = {...formData, userType: 'support'};
    console.log('📤 Dispatching Support login with:', loginData);
    
    const result = await dispatch(login(loginData));
    console.log('📥 Support login result:', result);
    
    if (login.fulfilled.match(result)) {
      console.log('✅ Support login fulfilled with payload:', result.payload);
      
      if (result.payload.user) {
        const userRole = result.payload.user.role;
        console.log('👤 User role from login response:', userRole);
        
        // Accept Support role formats
        const isSupport = userRole === 'ROLE_SUPPORT' || userRole === 'SUPPORT';
        
        if (isSupport) {
          console.log('✅ Support authenticated, redirecting to Support dashboard');
          router.replace('/dashboard/support');
        } else {
          console.log('⚠️ User role mismatch for Support portal:', userRole);
          alert('This account is not registered for Support access. Please use the correct login portal.');
          return;
        }
      }
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
        if (result.payload.user) {
          const userRole = result.payload.user.role;
          const isSupport = userRole === 'ROLE_SUPPORT' || userRole === 'SUPPORT';
          
          if (isSupport) {
            router.replace('/dashboard/support');
          } else {
            alert('This account is not registered for Support access. Please use the correct login portal.');
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

  // Check if user is already authenticated as Support
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role?.toUpperCase();
      const isSupport = userRole === 'SUPPORT' || userRole === 'ROLE_SUPPORT';
      
      if (isSupport) {
        console.log('✅ User already authenticated as Support, redirecting to dashboard');
        router.replace('/dashboard/support');
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Support Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Customer Support Portal Access
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? 'Signing in...' : 'Sign in to Support'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <a href="/auth/admin/login" className="font-medium text-red-600 hover:text-red-500">
                Admin Login
              </a>
              {' | '}
              <a href="/auth/user/login" className="font-medium text-blue-600 hover:text-blue-500">
                User Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
