'use client';

import React, { useState } from 'react';
import AddProductForm from '@/components/vendor/AddProductForm';
import ProductList from '@/components/vendor/ProductList';
import ExcelImport from '@/components/vendor/ExcelImport';

interface VendorProductsProps {
  initialView?: 'list' | 'add' | 'excel';
}

export default function VendorProducts({ initialView = 'list' }: VendorProductsProps) {
  const [activeView, setActiveView] = useState(initialView);

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your products, add new items, and import bulk data</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 View Products
          </button>
          <button
            onClick={() => setActiveView('add')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'add'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => setActiveView('excel')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'excel'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Excel Import
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">124</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">98</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">8</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Based on Active View */}
      <div className="bg-white rounded-lg border border-gray-200">
        {activeView === 'list' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">All Products</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
            </div>
            <ProductList />
          </div>
        )}

        {activeView === 'add' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Add New Product</h3>
            <AddProductForm />
          </div>
        )}

        {activeView === 'excel' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Bulk Import Products</h3>
            <ExcelImport 
              onProductsUpdated={() => {
                // Force refresh by setting active view to list
                setActiveView('list');
                // You could also trigger a refresh of the ProductList component here
              }}
            />
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Product Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Product "Wireless Earbuds" was added</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Added</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Product "Laptop Stand" was updated</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Updated</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Stock updated for "USB Cable"</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Stock Update</span>
          </div>
        </div>
      </div>
    </div>
  );
}
