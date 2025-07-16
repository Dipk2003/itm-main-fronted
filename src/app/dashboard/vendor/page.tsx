'use client';

import VendorDashboardTabs from "@/components/dashboard/vendor/VendorDashboardTabs"
import AuthGuard from "@/components/auth/AuthGuard"

export default function VendorDashboard() {
  return (
    <AuthGuard allowedRoles={['ROLE_VENDOR', 'VENDOR']}>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
        <VendorDashboardTabs />
      </section>
    </AuthGuard>
  )
}
