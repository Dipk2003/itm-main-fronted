'use client';

import React from 'react';
import CategoryColumn from './dashboard/CategoryColumn';
import SubCategoryColumn from './dashboard/SubCategoryColumn';
import MicroCategoryColumn from './dashboard/MicroCategoryColumn';
import ProductColumn from './dashboard/ProductColumn';

export default function DataEntryDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Data Entry Dashboard</h1>
            <p className="text-gray-600">Manage categories, subcategories, microcategories, and products</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Categories Column */}
          <div className="bg-white rounded-lg shadow-sm border">
            <CategoryColumn />
          </div>

          {/* SubCategories Column */}
          <div className="bg-white rounded-lg shadow-sm border">
            <SubCategoryColumn />
          </div>

          {/* MicroCategories Column */}
          <div className="bg-white rounded-lg shadow-sm border">
            <MicroCategoryColumn />
          </div>

          {/* Products Column */}
          <div className="bg-white rounded-lg shadow-sm border">
            <ProductColumn />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              <span>Data Entry Management System</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span>Select items to manage hierarchy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
