'use client';

import React from 'react';
import VendorStatsPanel from './VendorStatsPanel';
import VendorQuickActions from './VendorQuickActions';
import VendorRecentOrders from './VendorRecentOrders';

interface VendorOverviewProps {
  onTabChange?: (tab: string, subAction?: string) => void;
}

export default function VendorOverview({ onTabChange }: VendorOverviewProps) {
  const handleActionClick = (action: string, subAction?: string) => {
    if (onTabChange) {
      onTabChange(action, subAction);
    }
  };
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Vendor!</h2>
        <p className="text-blue-100">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Panel */}
      <VendorStatsPanel />

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <VendorQuickActions onActionClick={handleActionClick} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <VendorRecentOrders />
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New order #12345 received</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Product "Laptop Stand" updated</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Low stock alert for "Wireless Mouse"</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New customer inquiry received</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">This Month</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-sm font-medium">₹1,25,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Orders</span>
              <span className="text-sm font-medium">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-medium">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Top Products</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Laptop Stand</span>
              <span className="text-sm font-medium">25 sold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Wireless Mouse</span>
              <span className="text-sm font-medium">18 sold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">USB Hub</span>
              <span className="text-sm font-medium">15 sold</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Satisfaction</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Rating</span>
              <span className="text-sm font-medium">4.8/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Reviews</span>
              <span className="text-sm font-medium">127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium">98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
