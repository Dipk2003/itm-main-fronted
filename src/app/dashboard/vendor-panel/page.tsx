'use client';

import { VendorDashboardTabs } from '@/modules/vendor';
import { AuthGuard } from '@/modules/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import VendorLoginDebug from '@/components/debug/VendorLoginDebug';

export default function VendorDashboard() {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  console.log('🏦 VendorDashboard Debug:');
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - loading:', loading);
  console.log('  - user:', user);
  console.log('  - user.role:', user?.role);
  console.log('  - user.userType:', user?.userType);
  console.log('  - localStorage vendorToken:', localStorage.getItem('vendorToken') ? 'exists' : 'null');
  console.log('  - localStorage userToken:', localStorage.getItem('userToken') ? 'exists' : 'null');
  
  return (
    <>
      <AuthGuard allowedRoles={['ROLE_VENDOR', 'VENDOR', 'SELLER']}>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
          <VendorDashboardTabs />
        </section>
      </AuthGuard>
      <VendorLoginDebug />
    </>
  )
}
