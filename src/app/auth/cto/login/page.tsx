'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOTP, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function CTOLoginPage() {
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
    console.log('🚀 Starting CTO login process with:', formData);
    
    const loginData = {...formData, userType: 'cto'};
    console.log('📤 Dispatching CTO login with:', loginData);
    
    const result = await dispatch(login(loginData));
    console.log('📥 CTO login result:', result);
    
    if (login.fulfilled.match(result)) {
      console.log('✅ CTO login fulfilled with payload:', result.payload);
      
      if (result.payload.user) {
        const userRole = result.payload.user.role;
        console.log('👤 User role from login response:', userRole);
        
        // Accept CTO role formats
        const isCTO = userRole === 'ROLE_CTO' || userRole === 'CTO' || userRole === 'ROLE_ADMIN';
        
        if (isCTO) {
          console.log('✅ CTO authenticated, redirecting to CTO dashboard');
          router.replace('/dashboard/cto');
        } else {
          console.log('⚠️ User role mismatch for CTO portal:', userRole);
          alert('This account is not registered as a CTO. Please use the correct login portal.');
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
          const isCTO = userRole === 'ROLE_CTO' || userRole === 'CTO' || userRole === 'ROLE_ADMIN';
          
          if (isCTO) {
            router.replace('/dashboard/cto');
          } else {
            alert('This account is not registered as a CTO. Please use the correct login portal.');
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

  // Check if user is already authenticated as CTO
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role?.toUpperCase();
      const isCTO = userRole === 'CTO' || userRole === 'ROLE_CTO' || userRole === 'ROLE_ADMIN';
      
      if (isCTO) {
        console.log('✅ User already authenticated as CTO, redirecting to dashboard');
        router.replace('/dashboard/cto');
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CTO Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chief Technology Officer Access Portal
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Signing in...' : 'Sign in as CTO'}
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
