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
        console.log('Server-side rendering, skipping auth check');
        setUser(null);
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      console.log('Checking auth status, token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
      
      if (!token) {
        console.log('No token found, user not authenticated');
        // Also clear any stale user data
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user profile...');
        const userProfile = await authAPI.getProfile();
        console.log('Profile fetched successfully:', userProfile);
        setUser(userProfile);
      } catch (profileError: any) {
        console.warn('Profile fetch failed:', profileError);
        console.warn('Error details:', profileError.response?.data || profileError.message);
        
        // Only clear token on 401 (unauthorized), not on 403 (forbidden)
        // 403 means token is valid but user doesn't have permission for this specific endpoint
        if (profileError.response?.status === 401) {
          console.log('Auth token invalid (401), clearing...');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          setUser(null);
        } else if (profileError.response?.status === 403) {
          console.log('🔒 403 Forbidden - Token valid but no permission. Using stored user data.');
          // Don't clear token on 403, try to use stored user data
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('Using stored user data for 403 error:', parsedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Failed to parse stored user data:', parseError);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          // For network errors or other issues, keep the user logged in but show they're offline
          console.log('Network or server error, keeping user logged in');
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('Using stored user data:', parsedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Failed to parse stored user data:', parseError);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed with unexpected error:', error);
      // For unexpected errors, try to use stored user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Using fallback stored user data:', parsedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Failed to parse fallback user data:', parseError);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
      console.log('Auth check completed');
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await authAPI.login({ emailOrPhone, password });
      console.log('Login response:', response);
      
      // If response is an object with token, it's a successful login
      if (typeof response === 'object' && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('Stored login data successfully');
        }
        setUser(response.user);
        return response;
      } else {
        // OTP required or other response
        console.log('OTP required or special response:', response);
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
      console.log('OTP verification response:', response);
      
      if (response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('Stored OTP verification data successfully');
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
      console.log('🔄 Updating profile with data:', data);
      const updatedUser = await authAPI.updateProfile(data);
      console.log('✅ Profile updated successfully:', updatedUser);
      
      // Update user in state
      setUser(updatedUser);
      
      // Also update localStorage to keep data in sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('📝 Updated user data in localStorage');
      }
      
      return updatedUser;
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);
      console.error('Error details:', error.response?.data || error.message);
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
