'use client';

import { useState } from 'react';
import AdminDashboardTabs from "@/components/dashboard/admin/AdminDashboardTabs"
import AdminStatsPanel from "@/components/dashboard/admin/AdminStatsPanel"
import TopSellingProductList from "@/components/dashboard/admin/TopSellingProductList"
import TicketList from "@/components/dashboard/admin/TicketList"
import LiveChatSupport from "@/components/dashboard/admin/LiveChatSupport"
import UserManagement from "@/components/dashboard/admin/UserManagement"
import VendorManagement from "@/components/dashboard/admin/VendorManagement"
import ProductManagement from "@/components/dashboard/admin/ProductManagement"
import AuthGuard from "@/components/auth/AuthGuard"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <AdminStatsPanel />
            <TopSellingProductList />
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <p className="text-gray-600">Order management features coming soon...</p>
          </div>
        );
      case 'support':
        return (
          <div className="space-y-8">
            <TicketList />
            <LiveChatSupport />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <AdminStatsPanel />
            <TopSellingProductList />
          </div>
        );
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN']}>
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome, Admin! 👋
          </div>
        </div>
        
        <AdminDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </section>
    </AuthGuard>
  )
}
