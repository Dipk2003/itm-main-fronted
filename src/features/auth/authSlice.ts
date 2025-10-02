/**
 * FIXED Redux Auth Slice - Buyer-Vendor Separation
 * 
 * This file contains the corrected Redux auth slice that properly handles
 * separate buyer and vendor registration, login, and authentication flows.
 * 
 * Key Changes:
 * 1. Separate registration thunks for buyers and vendors
 * 2. Proper login flow that detects user type
 * 3. Fixed token management with role-based storage
 * 4. Corrected OTP verification for both user types
 * 
 * Replace your existing authSlice.js with this fixed version.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'ROLE_USER' | 'ROLE_VENDOR' | 'ROLE_ADMIN' | 'SELLER' | 'VENDOR' | 'ROLE_CTO' | 'CTO' | 'ROLE_SUPPORT' | 'SUPPORT' | 'ROLE_EMPLOYEE' | 'EMPLOYEE' | 'DATA_ENTRY';
  userType: 'user' | 'vendor' | 'admin' | 'cto' | 'support' | 'employee';
  isVerified: boolean;
  
  // Buyer-specific fields
  aadharCard?: string;
  
  // Vendor-specific fields  
  businessName?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  gstNumber?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tempCredentials: {
    emailOrPhone: string;
    password: string;
  } | null;
  otpSent: boolean;
  registrationStep: 'form' | 'otp' | 'completed';
}

// =============================================================================
// ASYNC THUNKS
// =============================================================================

// FIXED: Buyer Registration - calls /auth/register
export const registerBuyer = createAsyncThunk(
  'auth/registerBuyer',
  async (buyerData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    aadharCard?: string;
  }, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting buyer registration...', { email: buyerData.email });
      
      // FIXED: Buyer registration payload with proper role
      const registrationPayload = {
        name: buyerData.name,
        email: buyerData.email,
        phone: buyerData.phone,
        password: buyerData.password,
        role: "ROLE_USER", // This is critical - tells backend it's a buyer
        userType: "user",
        aadharCard: buyerData.aadharCard || '',
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      const result = await response.text();

      if (!response.ok) {
        console.error('❌ Buyer registration failed:', result);
        throw new Error(result || 'Registration failed');
      }

      console.log('✅ Buyer registration successful:', result);
      
      // Try to parse JSON response, fallback to text
      let responseData;
      try {
        responseData = JSON.parse(result);
      } catch {
        responseData = { message: result };
      }
      
      return {
        message: responseData.message || result,
        userType: 'user',
        email: buyerData.email,
        success: true,
        otpSent: true
      };
    } catch (error: any) {
      console.error('❌ Buyer registration error:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// FIXED: Vendor Registration - calls /auth/vendor/register
export const registerVendor = createAsyncThunk(
  'auth/registerVendor',
  async (vendorData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    businessName: string;
    businessAddress: string;
    city: string;
    state: string;
    pincode: string;
    panNumber: string;
    gstNumber?: string;
  }, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting vendor registration...', { email: vendorData.email });
      
      // FIXED: Vendor registration payload with proper role
      const registrationPayload = {
        name: vendorData.name,
        email: vendorData.email,
        phone: vendorData.phone,
        password: vendorData.password,
        role: "ROLE_VENDOR", // This is critical - tells backend it's a vendor
        userType: "vendor",
        businessName: vendorData.businessName,
        businessAddress: vendorData.businessAddress,
        city: vendorData.city,
        state: vendorData.state,
        pincode: vendorData.pincode,
        panNumber: vendorData.panNumber,
        gstNumber: vendorData.gstNumber || undefined,
      };

      // FIXED: Call vendor-specific endpoint
      const response = await fetch('/api/auth/vendor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      const result = await response.text();

      if (!response.ok) {
        console.error('❌ Vendor registration failed:', result);
        throw new Error(result || 'Vendor registration failed');
      }

      console.log('✅ Vendor registration successful:', result);
      return {
        message: result,
        userType: 'vendor',
        email: vendorData.email,
      };
    } catch (error: any) {
      console.error('❌ Vendor registration error:', error);
      return rejectWithValue(error.message || 'Vendor registration failed');
    }
  }
);

// FIXED: Unified Login - detects user type from response
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { emailOrPhone: string; password: string; userType?: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting login...', { emailOrPhone: credentials.emailOrPhone, userType: credentials.userType });

      // Use the unified login endpoint - backend handles role detection
      const loginEndpoint = '/api/auth/login';

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: credentials.emailOrPhone,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Login failed:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const loginResult = await response.json();
      
      // Infer userType from role if not provided by backend
      if (!loginResult.userType && loginResult.role) {
        if (loginResult.role === 'SELLER' || loginResult.role === 'ROLE_VENDOR' || loginResult.role === 'VENDOR') {
          loginResult.userType = 'vendor';
        } else if (loginResult.role === 'ROLE_USER') {
          loginResult.userType = 'user';
        } else if (loginResult.role === 'ROLE_ADMIN') {
          loginResult.userType = 'admin';
        }
        console.log('🔄 Inferred userType from role:', loginResult.userType, 'from role:', loginResult.role);
      }
      
      console.log('✅ Login successful:', { 
        userType: loginResult.userType, 
        role: loginResult.role 
      });

      // FIXED: Store tokens in localStorage based on user type or role
      const isVendorLogin = loginResult.userType === 'vendor' || 
                           loginResult.role === 'SELLER' || 
                           loginResult.role === 'ROLE_VENDOR' || 
                           loginResult.role === 'VENDOR';
      const tokenKey = isVendorLogin ? 'vendorToken' : 'userToken';
      const refreshTokenKey = isVendorLogin ? 'vendorRefreshToken' : 'userRefreshToken';
      
      console.log('🔍 Detailed role check for token storage:', {
        'loginResult.userType': loginResult.userType,
        'loginResult.role': loginResult.role,
        'loginResult.user?.role': loginResult.user?.role,
        'isVendorLogin': isVendorLogin
      });
      
      console.log('💾 Token storage decision:', {
        userType: loginResult.userType,
        role: loginResult.role,
        isVendorLogin,
        tokenKey,
        refreshTokenKey
      });
      
      if (loginResult.token) {
        localStorage.setItem(tokenKey, loginResult.token);
        console.log('✅ Token stored successfully:', tokenKey);
      }
      if (loginResult.refreshToken) {
        localStorage.setItem(refreshTokenKey, loginResult.refreshToken);
        console.log('✅ Refresh token stored successfully:', refreshTokenKey);
      }
      
      // Store user data for debugging
      localStorage.setItem('lastLoginSuccess', Date.now().toString());
      localStorage.setItem('lastLoginUser', JSON.stringify({
        role: loginResult.role,
        userType: loginResult.userType,
        email: loginResult.user?.email
      }));

      return {
        user: loginResult.user,
        token: loginResult.token,
        refreshToken: loginResult.refreshToken,
        userType: loginResult.userType,
        role: loginResult.role,
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// FIXED: OTP Verification - works for both buyers and vendors
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: { emailOrPhone: string; otp: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Verifying OTP...', { emailOrPhone: otpData.emailOrPhone });

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OTP verification failed:', errorText);
        throw new Error('Invalid OTP. Please try again.');
      }

      const result = await response.json();
      console.log('✅ OTP verification successful:', { 
        userType: result.userType, 
        role: result.role 
      });

      // FIXED: Store tokens after OTP verification based on user type or role
      const isVendorOTP = result.userType === 'vendor' || 
                         result.role === 'SELLER' || 
                         result.role === 'ROLE_VENDOR' || 
                         result.role === 'VENDOR';
      const tokenKey = isVendorOTP ? 'vendorToken' : 'userToken';
      const refreshTokenKey = isVendorOTP ? 'vendorRefreshToken' : 'userRefreshToken';
      
      console.log('💾 OTP Token storage decision:', {
        userType: result.userType,
        role: result.role,
        isVendorOTP,
        tokenKey,
        refreshTokenKey
      });
      
      if (result.token) {
        localStorage.setItem(tokenKey, result.token);
      }
      if (result.refreshToken) {
        localStorage.setItem(refreshTokenKey, result.refreshToken);
      }

      return {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
        userType: result.userType,
        role: result.role,
      };
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

// FIXED: Logout - clears appropriate tokens
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userType = state.auth.user?.userType || 'user';

      console.log('🔄 Logging out...', { userType });

      // FIXED: Clear tokens based on user type
      const tokenKey = userType === 'vendor' ? 'vendorToken' : 'userToken';
      const refreshTokenKey = userType === 'vendor' ? 'vendorRefreshToken' : 'userRefreshToken';
      
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(refreshTokenKey);
      
      // Also clear any other stored user data
      localStorage.removeItem('userData');
      
      console.log('✅ Logout successful');
      
      return true;
    } catch (error) {
      console.error('❌ Logout error:', error);
      return true; // Always succeed logout
    }
  }
);

// FIXED: Check Auth - loads appropriate token on app startup
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Checking auth status...');
      
      // FIXED: Check for both user types
      const userToken = localStorage.getItem('userToken');
      const vendorToken = localStorage.getItem('vendorToken');
      const userRefreshToken = localStorage.getItem('userRefreshToken');
      const vendorRefreshToken = localStorage.getItem('vendorRefreshToken');
      
      console.log('🔍 Auth check - localStorage tokens:', {
        userToken: userToken ? 'exists' : 'null',
        vendorToken: vendorToken ? 'exists' : 'null',
        userRefreshToken: userRefreshToken ? 'exists' : 'null',
        vendorRefreshToken: vendorRefreshToken ? 'exists' : 'null'
      });
      
      let token = null;
      let refreshToken = null;
      let userType = 'user';
      
      if (vendorToken) {
        token = vendorToken;
        refreshToken = vendorRefreshToken;
        userType = 'vendor';
        console.log('✅ Using vendor token for auth check');
      } else if (userToken) {
        token = userToken;
        refreshToken = userRefreshToken;
        userType = 'user';
        console.log('✅ Using user token for auth check');
      }

      if (!token) {
        console.log('ℹ️ No token found');
        throw new Error('No token found');
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('⚠️ Token invalid, clearing storage');
        
        // Clear invalid tokens
        localStorage.removeItem('userToken');
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('userRefreshToken');
        localStorage.removeItem('vendorRefreshToken');
        localStorage.removeItem('userData');
        
        throw new Error('Invalid token');
      }

      const userData = await response.json();
      
      // Infer userType from role if not provided by backend
      if (!userData.userType && userData.role) {
        if (userData.role === 'SELLER' || userData.role === 'ROLE_VENDOR' || userData.role === 'VENDOR') {
          userData.userType = 'vendor';
        } else if (userData.role === 'ROLE_USER') {
          userData.userType = 'user';
        } else if (userData.role === 'ROLE_ADMIN') {
          userData.userType = 'admin';
        }
        console.log('🔄 Inferred userType from role in auth check:', userData.userType, 'from role:', userData.role);
      }
      
      console.log('✅ Auth status verified:', { 
        userType: userData.userType, 
        role: userData.role 
      });

      return {
        user: userData,
        token,
        refreshToken,
        userType: userData.userType || userType,
        role: userData.role,
      };
    } catch (error: any) {
      console.log('❌ Auth check failed:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  tempCredentials: null,
  otpSent: false,
  registrationStep: 'form',
};

// =============================================================================
// AUTH SLICE
// =============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Store temporary credentials for OTP verification
    setTempCredentials: (state, action: PayloadAction<{ emailOrPhone: string; password: string }>) => {
      state.tempCredentials = action.payload;
    },
    
    // Clear temporary credentials
    clearTempCredentials: (state) => {
      state.tempCredentials = null;
    },
    
    // Set OTP sent status
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
    
    // Set registration step
    setRegistrationStep: (state, action: PayloadAction<'form' | 'otp' | 'completed'>) => {
      state.registrationStep = action.payload;
    },
    
    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // BUYER REGISTRATION
    builder
      .addCase(registerBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpSent = true;
        state.registrationStep = 'otp';
        console.log('✅ Buyer registration completed, OTP sent');
      })
      .addCase(registerBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.otpSent = false;
        console.log('❌ Buyer registration failed:', action.payload);
      });

    // VENDOR REGISTRATION
    builder
      .addCase(registerVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpSent = true;
        state.registrationStep = 'otp';
        console.log('✅ Vendor registration completed, OTP sent');
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.otpSent = false;
        console.log('❌ Vendor registration failed:', action.payload);
      });

    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        console.log('✅ Login completed successfully');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        console.log('❌ Login failed:', action.payload);
      });

    // OTP VERIFICATION
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.registrationStep = 'completed';
        state.tempCredentials = null;
        console.log('✅ OTP verification completed successfully');
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log('❌ OTP verification failed:', action.payload);
      });

    // LOGOUT
    builder
      .addCase(logout.fulfilled, (state) => {
        // Reset to initial state
        Object.assign(state, initialState);
        console.log('✅ Logout completed');
      });

    // CHECK AUTH STATUS
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        console.log('✅ Auth status check completed');
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.error = null; // Don't show error for auth check failure
        state.isAuthenticated = false;
        console.log('ℹ️ Auth status check failed - user not authenticated');
      });
  },
});

// =============================================================================
// EXPORTS
// =============================================================================

export const {
  clearError,
  setTempCredentials,
  clearTempCredentials,
  setOtpSent,
  setRegistrationStep,
  updateUserProfile,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserType = (state: { auth: AuthState }) => state.auth.user?.userType;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;

// Additional exports for compatibility
export const initializeAuth = checkAuthStatus;

// Legacy exports for backward compatibility
export const register = registerBuyer; // For existing buyer registration calls
export const verifyOtp = verifyOTP; // For existing OTP verification calls

// Additional missing functions that the frontend is expecting
export const sendForgotPasswordOtp = createAsyncThunk(
  'auth/sendForgotPasswordOtp',
  async (emailOrPhone: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Sending forgot password OTP...', emailOrPhone);
      const response = await fetch('/api/auth/forgot-password-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send OTP');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send forgot password OTP');
    }
  }
);

export const checkEmailRole = createAsyncThunk(
  'auth/checkEmailRole',
  async (email: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Checking email role...', email);
      const response = await fetch(`/api/auth/check-email-role?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to check email role');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check email role');
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  'auth/verifyForgotPasswordOtp',
  async (otpData: { emailOrPhone: string; otp: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Verifying forgot password OTP...', otpData.emailOrPhone);
      const response = await fetch('/api/auth/verify-forgot-password-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to verify OTP');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify forgot password OTP');
    }
  }
);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// FIXED: Helper to get appropriate token based on user type
export const getAuthToken = (userType: 'user' | 'vendor' = 'user'): string | null => {
  const tokenKey = userType === 'vendor' ? 'vendorToken' : 'userToken';
  return localStorage.getItem(tokenKey);
};

// FIXED: Helper to clear all auth data
export const clearAllAuthData = (): void => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('vendorToken');
  localStorage.removeItem('userRefreshToken');
  localStorage.removeItem('vendorRefreshToken');
  localStorage.removeItem('userData');
};

// FIXED: Helper to check if user is buyer
export const isBuyer = (user: User | null): boolean => {
  return user?.userType === 'user' && user?.role === 'ROLE_USER';
};

// FIXED: Helper to check if user is vendor
export const isVendor = (user: User | null): boolean => {
  return (user?.userType === 'vendor' || 
          user?.role === 'ROLE_VENDOR' || 
          user?.role === 'SELLER' || 
          user?.role === 'VENDOR');
};

// FIXED: Helper to check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.userType === 'admin' && user?.role === 'ROLE_ADMIN';
};

console.log('📦 FIXED Auth slice loaded - Buyer-Vendor separation implemented');
