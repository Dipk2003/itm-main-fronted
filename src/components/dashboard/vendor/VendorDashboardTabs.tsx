'use client';

import React, { useState } from 'react';
import VendorOverview from './VendorOverview';
import VendorProducts from './VendorProducts';
import VendorOrders from './VendorOrders';
import VendorAnalytics from './VendorAnalytics';
import VendorLeads from './VendorLeads';
import VendorProfile from './VendorProfile';

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'leads', label: 'Leads', icon: '🎯' },
  { id: 'profile', label: 'Profile', icon: '👤' }
];

export default function VendorDashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState<'list' | 'add' | 'excel'>('list');

  const handleTabChange = (tab: string, subAction?: string) => {
    setActiveTab(tab);
    if (tab === 'products' && subAction) {
      setProductView(subAction as 'list' | 'add' | 'excel');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <VendorOverview onTabChange={handleTabChange} />;
      case 'products':
        return <VendorProducts initialView={productView} />;
      case 'orders':
        return <VendorOrders />;
      case 'analytics':
        return <VendorAnalytics />;
      case 'leads':
        return <VendorLeads />;
      case 'profile':
        return <VendorProfile />;
      default:
        return <VendorOverview onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
