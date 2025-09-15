'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '@/store';
import { checkAuthStatus as initializeAuth } from '@/features/auth/authSlice';
import { initAuthCleanup } from '@/utils/auth-cleanup';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

// AuthInitializer component to dispatch auth initialization
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    if (!initialized) {
      console.log('🚀 Initializing authentication...');
      
      // First clean up any expired/invalid tokens
      initAuthCleanup();
      
      // Then initialize authentication state on app load
      dispatch(initializeAuth()).finally(() => {
        console.log('✅ Authentication initialization completed');
        setInitialized(true);
      });
    }
  }, [dispatch, initialized]);

  return <>{children}</>;
};

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </AuthProvider>
    </Provider>
  );
};

export default ClientProviders;
