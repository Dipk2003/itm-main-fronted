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
  async (credentials: { emailOrPhone: string; password: string; adminCode?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; phone?: string; password: string; userType: string }, { rejectWithValue }) => {
    try {
      // Determine the correct endpoint based on userType
      let endpoint = '/auth/register'; // default for 'user'
      if (userData.userType === 'vendor') {
        endpoint = '/auth/vendor/register';
      } else if (userData.userType === 'admin') {
        endpoint = '/auth/admin/register';
      }
      
      const response = await api.post(endpoint, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData: { emailOrPhone: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'OTP verification failed');
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
        if (action.payload.token) {
          // Direct login success
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
          }
        } else {
          // Check if it's an OTP message (password verified)
          if (typeof action.payload === 'string' && action.payload.includes('OTP sent')) {
            // Regular user - OTP required
            state.otpSent = true;
            // Get credentials from meta arg (passed in login thunk)
            if (action.meta && action.meta.arg) {
              state.tempCredentials = action.meta.arg;
            }
          } else if (action.payload.user && (action.payload.user.role === 'ADMIN' || action.payload.user.role === 'ROLE_ADMIN')) {
            // Admin user - direct login without OTP
            state.token = action.payload.token || 'temp-admin-token';
            state.user = action.payload.user;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', action.payload.token || 'temp-admin-token');
              localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
          } else {
            // Regular user - OTP required
            state.otpSent = true;
            // Get credentials from meta arg (passed in login thunk)
            if (action.meta && action.meta.arg) {
              state.tempCredentials = action.meta.arg;
            }
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      });
  },
});

export const { logout, clearError, setTempCredentials } = authSlice.actions;
export default authSlice.reducer;
