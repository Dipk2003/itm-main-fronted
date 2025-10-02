'use client';

import React, { useState } from 'react';
import DataManagementOverview from './DataManagementOverview';
import CategoryManagement from './CategoryManagement';
import LocationManagement from './LocationManagement';

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊', color: 'blue' },
  { id: 'categories', label: 'Categories', icon: '📋', color: 'green' },
  { id: 'locations', label: 'Locations', icon: '📍', color: 'purple' },
];

export default function EmployeeDashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DataManagementOverview onTabChange={setActiveTab} />;
      case 'categories':
        return <CategoryManagement />;
      case 'locations':
        return <LocationManagement />;
      default:
        return <DataManagementOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Employee Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage website data</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                  <span className="text-sm text-gray-700">Help</span>
                  <span className="text-blue-600">❓</span>
                </button>
              </div>
              
              <div className="relative">
                <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <span className="text-sm">🔔</span>
                  <span className="text-sm">Notifications</span>
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 border-${tab.color}-600 bg-${tab.color}-50`
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
