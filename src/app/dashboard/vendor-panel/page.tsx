'use client';

import { VendorDashboardTabs } from '@/modules/vendor';
import { AuthGuard } from '@/modules/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function VendorDashboard() {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  console.log('🏪 VendorDashboard Debug:');
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - loading:', loading);
  console.log('  - user:', user);
  console.log('  - user.role:', user?.role);
  
  return (
    <AuthGuard allowedRoles={['ROLE_VENDOR', 'VENDOR']}>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
        <VendorDashboardTabs />
      </section>
    </AuthGuard>
  )
}
