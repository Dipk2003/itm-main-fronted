'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AuthDebugger() {
  const { user, isAuthenticated, loading, token, error } = useSelector((state: RootState) => state.auth);

  const debugInfo = {
    // Redux state
    isAuthenticated,
    loading,
    error,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    } : null,
    token: token ? 'exists' : 'null',
    
    // localStorage (only on client side)
    localStorage: typeof window !== 'undefined' ? {
      userToken: localStorage.getItem('userToken') ? 'exists' : 'null',
      vendorToken: localStorage.getItem('vendorToken') ? 'exists' : 'null',
      userRefreshToken: localStorage.getItem('userRefreshToken') ? 'exists' : 'null',
      vendorRefreshToken: localStorage.getItem('vendorRefreshToken') ? 'exists' : 'null',
      lastLoginSuccess: localStorage.getItem('lastLoginSuccess'),
      lastLoginUser: localStorage.getItem('lastLoginUser'),
    } : {
      userToken: 'SSR - Not Available',
      vendorToken: 'SSR - Not Available', 
      userRefreshToken: 'SSR - Not Available',
      vendorRefreshToken: 'SSR - Not Available',
      lastLoginSuccess: 'SSR - Not Available',
      lastLoginUser: 'SSR - Not Available',
    },
    
    // Current URL
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={() => {
            console.log('🔍 Full Redux State:', { user, isAuthenticated, loading, token, error });
            console.log('🔍 LocalStorage:', {
              userToken: localStorage.getItem('userToken'),
              vendorToken: localStorage.getItem('vendorToken'),
              userRefreshToken: localStorage.getItem('userRefreshToken'),
              vendorRefreshToken: localStorage.getItem('vendorRefreshToken'),
            });
          }}
          className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          Log Full State
        </button>
        
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
        >
          Clear All & Reload
        </button>
        
        <button
          onClick={() => {
            if (user?.role === 'SELLER' || user?.role === 'ROLE_VENDOR') {
              window.location.href = '/dashboard/vendor-panel';
            } else {
              window.location.href = '/dashboard';
            }
          }}
          className="w-full bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
