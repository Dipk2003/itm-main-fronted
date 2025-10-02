'use client';

import React from 'react';

interface SupportDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SupportDashboardTabs: React.FC<SupportDashboardTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'sla', label: 'SLA Tracking', icon: '⏱️' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SupportDashboardTabs;
