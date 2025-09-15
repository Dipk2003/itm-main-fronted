'use client';

import { useState, useEffect } from 'react';
import {
  SupportDashboardTabs,
  SupportStatsPanel,
  SLATrackingPanel,
  KnowledgeBasePanel,
  TicketManagement,
  SupportAnalytics
} from '@/modules/support';
import { AuthGuard } from '@/modules/core';

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <SupportStatsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SLATrackingPanel />
              <SupportAnalytics />
            </div>
          </div>
        );
      case 'tickets':
        return <TicketManagement />;
      case 'sla':
        return <SLATrackingPanel detailed={true} />;
      case 'knowledge-base':
        return <KnowledgeBasePanel />;
      case 'analytics':
        return <SupportAnalytics detailed={true} />;
      default:
        return (
          <div className="space-y-8">
            <SupportStatsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SLATrackingPanel />
              <SupportAnalytics />
            </div>
          </div>
        );
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN', 'ROLE_SUPPORT', 'SUPPORT']}>
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome to the Support Center! 🎧
          </div>
        </div>
        
        <SupportDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </section>
    </AuthGuard>
  )
}
