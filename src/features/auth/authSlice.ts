import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userType: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  tempCredentials: {
    emailOrPhone: string;
    password: string;
  } | null;
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log('Getting initial token:', token ? 'Found' : 'Not found');
    return token;
  }
  return null;
};

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    console.log('Getting initial user:', userData ? 'Found' : 'Not found');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

// Add a token validation check
const validateToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('Token validation failed: Missing token or user data');
      return false;
    }
    
    try {
      // Basic token format check for JWT
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.warn('Invalid token format - not a valid JWT');
        return false;
      }
      
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expired');
        return false;
      }
      
      console.log('Token validation successful');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
  return false;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();
const isTokenValid = validateToken();

// If token is invalid, clear everything
if (!isTokenValid && typeof window !== 'undefined') {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' && isTokenValid ? initialUser : null,
  token: typeof window !== 'undefined' && isTokenValid ? initialToken : null,
  isAuthenticated: typeof window !== 'undefined' && isTokenValid && !!initialToken && !!initialUser,
  loading: false,
  error: null,
  otpSent: false,
  tempCredentials: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { emailOrPhone: string; password: string; adminCode?: string; userType?: 'user' | 'vendor' | 'admin' }, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login with credentials for:', credentials.emailOrPhone, 'as', credentials.userType || 'generic');
      
      let endpoint = '/auth/login'; // Default
      if (credentials.userType === 'user') {
        endpoint = '/auth/user/login';
      } else if (credentials.userType === 'vendor') {
        endpoint = '/auth/vendor/login';
      } else if (credentials.userType === 'admin') {
        endpoint = '/auth/admin/login';
      }
      
      console.log('🔎 Using endpoint:', endpoint);
      const response = await api.post(endpoint, credentials);
      console.log('✅ Login response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      console.error('🔍 Error details:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      console.error('  - Message:', error.message);
      
      // Extract error message properly
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
      console.error('  - Extracted message:', errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; phone?: string; password: string; role: string; userType: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      console.log('📝 Registration attempt for userType:', userData.userType);
      console.log('📝 Registration data:', userData);
      
      // Use unified registration endpoint - backend will route based on role
      const endpoint = '/auth/register';
      
      console.log('📝 Using unified endpoint:', endpoint);
      
      const response = await api.post(endpoint, userData);
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        return rejectWithValue(error.response.data?.message || error.response.data || 'Registration failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error.message);
        return rejectWithValue('Registration request failed');
      }
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData: { emailOrPhone: string; otp: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting OTP verification:', otpData);
      console.log('🔐 Using endpoint: /auth/verify-otp');
      
      const response = await api.post('/auth/verify-otp', otpData);
      console.log('✅ OTP verification response status:', response.status);
      console.log('✅ OTP verification response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        
        // Handle specific error cases
        if (error.response.status === 403) {
          return rejectWithValue('Access denied. Please check your OTP and try again.');
        } else if (error.response.status === 400) {
          return rejectWithValue(error.response.data?.message || 'Invalid OTP. Please try again.');
        } else if (error.response.status === 404) {
          return rejectWithValue('OTP verification endpoint not found. Please contact support.');
        }
        
        return rejectWithValue(error.response.data?.message || error.response.data || 'OTP verification failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error.message);
        return rejectWithValue('OTP verification request failed');
      }
    }
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  'auth/sendForgotPasswordOtp',
  async (emailData: { email: string }, { rejectWithValue }) => {
    try {
      console.log('📧 Sending forgot password OTP to:', emailData.email);
      
      const response = await api.post('/auth/forgot-password', emailData);
      console.log('✅ Forgot password OTP sent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to send forgot password OTP:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        return rejectWithValue(error.response.data?.message || error.response.data || 'Failed to send OTP');
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error.message);
        return rejectWithValue('Failed to send OTP');
      }
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  'auth/verifyForgotPasswordOtp',
  async (otpData: { email: string; otp: string; newPassword?: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Verifying forgot password OTP for:', otpData.email);
      
      const response = await api.post('/auth/verify-forgot-password-otp', otpData);
      console.log('✅ Forgot password OTP verification response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Forgot password OTP verification failed:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        return rejectWithValue(error.response.data?.message || error.response.data || 'OTP verification failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error.message);
        return rejectWithValue('OTP verification failed');
      }
    }
  }
);

export const checkEmailRole = createAsyncThunk(
  'auth/checkEmailRole',
  async (email: string, { rejectWithValue }) => {
    try {
      console.log('🔍 Checking email role for:', email);
      
      const response = await api.post('/auth/check-email-role', { email });
      console.log('✅ Email role check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Email role check failed:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        return rejectWithValue(error.response.data?.message || error.response.data?.error || 'Email role check failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        console.error('Request setup error:', error.message);
        return rejectWithValue('Email role check failed');
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.tempCredentials = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTempCredentials: (state, action: PayloadAction<{ emailOrPhone: string; password: string }>) => {
      state.tempCredentials = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log('🔍 Login response payload:', action.payload);
        console.log('🔍 Login action meta:', action.meta);
        
        // Check if it's a successful direct login (has token and user)
        if (action.payload && typeof action.payload === 'object' && action.payload.token && action.payload.user) {
          // Direct login success (token received)
          console.log('✅ Direct login success for user:', action.payload.user.role);
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.otpSent = false; // Reset OTP state
          state.tempCredentials = null; // Clear temp credentials
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
          }
          return; // Early return for successful login
        }
        
        // Check for OTP-related responses (both object and string formats)
        const responseMessage = (action.payload && typeof action.payload === 'object') 
          ? action.payload.message 
          : action.payload;
        
        const isOtpResponse = typeof responseMessage === 'string' && (
          responseMessage.includes('OTP sent') || 
          responseMessage.includes('Password verified') ||
          responseMessage.includes('OTP has been sent') ||
          responseMessage.includes('sent to your email') ||
          responseMessage.includes('sent to your phone')
        );
        
        if (isOtpResponse) {
          console.log('📧 OTP-related response detected:', responseMessage);
          state.otpSent = true;
          state.error = null; // Clear any previous errors
          
          // Set temp credentials from the original login request
          if (action.meta && action.meta.arg) {
            state.tempCredentials = {
              emailOrPhone: action.meta.arg.emailOrPhone,
              password: action.meta.arg.password
            };
            console.log('🔑 TempCredentials set from meta:', state.tempCredentials);
          } else {
            console.warn('⚠️ No meta data found for setting temp credentials');
          }
          return; // Early return for OTP response
        }
        
        // Handle error responses
        const errorMessage = (action.payload && typeof action.payload === 'object') 
          ? (action.payload.message || action.payload.error || 'Unknown error')
          : action.payload;
          
        if (typeof errorMessage === 'string' && (
          errorMessage.includes('User not found') ||
          errorMessage.includes('Invalid password') ||
          errorMessage.includes('Invalid email') ||
          errorMessage.includes('not registered') ||
          errorMessage.includes('correct login portal') ||
          errorMessage.includes('Invalid credentials') ||
          errorMessage.includes('Invalid email and password')
        )) {
          console.log('❌ Login error detected:', errorMessage);
          state.error = errorMessage;
          state.otpSent = false;
          state.tempCredentials = null;
        } else {
          // Unknown response format - treat as error
          console.warn('⚠️ Unexpected login response format:', action.payload);
          state.error = typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please try again.';
          state.otpSent = false;
          state.tempCredentials = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        
        console.log('❌ Login rejected with error:', errorMessage);
        
        // Check if this is an "Invalid email and password" error that should trigger OTP flow
        // This happens when credentials are wrong but user exists
        if (typeof errorMessage === 'string' && errorMessage.includes('Invalid email and password')) {
          console.log('🔄 Invalid credentials detected - this should potentially trigger OTP flow');
          // For now, just show the error. The backend should handle OTP flow properly.
          state.otpSent = false;
          state.tempCredentials = null;
        } else {
          state.otpSent = false;
          state.tempCredentials = null;
        }
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.tempCredentials = null;
        console.log('OTP verified successfully, saving user data:', action.payload.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Forgot Password OTP
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Forgot Password OTP
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.tempCredentials = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setTempCredentials } = authSlice.actions;
export default authSlice.reducer;
