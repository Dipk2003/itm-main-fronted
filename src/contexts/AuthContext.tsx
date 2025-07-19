'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/lib/auth';
import { clearAuthData } from '@/utils/logout';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
  verifyOtp: (emailOrPhone: string, otp: string) => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  isAuthenticated: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user not authenticated');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await authAPI.getProfile();
        setUser(userProfile);
      } catch (profileError) {
        console.warn('Profile fetch failed, clearing token:', profileError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await authAPI.login({ emailOrPhone, password });
      
      // If response is an object with token, it's a successful login
      if (typeof response === 'object' && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
        setUser(response.user);
        return response;
      } else {
        // OTP required or other response
        return response;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const verifyOtp = async (emailOrPhone: string, otp: string) => {
    try {
      const response = await authAPI.verifyOtp({ emailOrPhone, otp });
      
      if (response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isVendor = user?.role === 'vendor';
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    verifyOtp,
    updateProfile,
    isAuthenticated,
    isVendor,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
