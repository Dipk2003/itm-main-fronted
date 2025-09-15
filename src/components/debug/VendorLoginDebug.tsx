'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const VendorLoginDebug: React.FC = () => {
  const { isAuthenticated, user, loading, token } = useSelector((state: RootState) => state.auth);
  
  const [localStorageInfo, setLocalStorageInfo] = React.useState({
    userToken: null as string | null,
    vendorToken: null as string | null,
    userRefreshToken: null as string | null,
    vendorRefreshToken: null as string | null,
    lastLoginSuccess: null as string | null,
    lastLoginUser: null as any
  });

  React.useEffect(() => {
    // Update localStorage info
    setLocalStorageInfo({
      userToken: localStorage.getItem('userToken'),
      vendorToken: localStorage.getItem('vendorToken'),
      userRefreshToken: localStorage.getItem('userRefreshToken'),
      vendorRefreshToken: localStorage.getItem('vendorRefreshToken'),
      lastLoginSuccess: localStorage.getItem('lastLoginSuccess'),
      lastLoginUser: JSON.parse(localStorage.getItem('lastLoginUser') || 'null')
    });
  }, [isAuthenticated, user]);

  if (!isAuthenticated && !user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Vendor Login Debug</div>
      <div>
        <div><strong>Redux State:</strong></div>
        <div>- isAuthenticated: {isAuthenticated.toString()}</div>
        <div>- loading: {loading.toString()}</div>
        <div>- user.role: {user?.role || 'null'}</div>
        <div>- user.userType: {user?.userType || 'null'}</div>
        <div>- user.email: {user?.email || 'null'}</div>
        <div>- token (redux): {token ? 'exists' : 'null'}</div>
      </div>
      <div className="mt-2">
        <div><strong>LocalStorage:</strong></div>
        <div>- userToken: {localStorageInfo.userToken ? 'exists' : 'null'}</div>
        <div>- vendorToken: {localStorageInfo.vendorToken ? 'exists' : 'null'}</div>
        <div>- userRefresh: {localStorageInfo.userRefreshToken ? 'exists' : 'null'}</div>
        <div>- vendorRefresh: {localStorageInfo.vendorRefreshToken ? 'exists' : 'null'}</div>
      </div>
      {localStorageInfo.lastLoginUser && (
        <div className="mt-2">
          <div><strong>Last Login:</strong></div>
          <div>- role: {localStorageInfo.lastLoginUser.role}</div>
          <div>- userType: {localStorageInfo.lastLoginUser.userType}</div>
        </div>
      )}
      <div className="mt-2">
        <div><strong>Current Path:</strong></div>
        <div>{typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
      </div>
    </div>
  );
};

export default VendorLoginDebug;
