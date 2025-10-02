'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BarChart, User, Users, ShoppingCart, Settings } from 'lucide-react';

export default function GeneralDashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    console.log('🏠 Dashboard useEffect triggered:', { isAuthenticated, user });
    
    if (!isAuthenticated) {
      console.log('🚀 Not authenticated, redirecting to login');
      router.push('/auth/user/login');
      return;
    }

    // Immediate redirect to specific dashboard based on role
    if (user?.role) {
      const userRole = user.role.toUpperCase();
      const cleanRole = userRole.replace('ROLE_', '');
      
      console.log('🔄 Dashboard role detection:', {
        originalRole: user?.role,
        upperRole: userRole,
        cleanRole: cleanRole,
        userType: user?.userType
      });
      
      // Immediate redirect without delay
      if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || cleanRole === 'ADMIN') {
        console.log('🏦️ Redirecting to admin dashboard');
        router.replace('/dashboard/admin');
        return;
      }
      
      if (userRole === 'CTO' || userRole === 'ROLE_CTO' || cleanRole === 'CTO') {
        console.log('🛠️ Redirecting to CTO dashboard');
        router.replace('/dashboard/cto');
        return;
      }
      
      if (userRole === 'EMPLOYEE' || userRole === 'ROLE_EMPLOYEE' || cleanRole === 'EMPLOYEE' || userRole === 'DATA_ENTRY') {
        console.log('💼 Redirecting to employee dashboard');
        router.replace('/dashboard/employee');
        return;
      }
      
      if (userRole === 'SUPPORT' || userRole === 'ROLE_SUPPORT' || cleanRole === 'SUPPORT') {
        console.log('🎧 Redirecting to support dashboard');
        router.replace('/dashboard/support');
        return;
      }
      
      if (userRole === 'SELLER' || userRole === 'VENDOR' || userRole === 'ROLE_VENDOR' || cleanRole === 'VENDOR' || cleanRole === 'SELLER') {
        console.log('🏪 Redirecting to vendor dashboard');
        router.replace('/dashboard/vendor-panel');
        return;
      }
      
      if (userRole === 'USER' || userRole === 'BUYER' || userRole === 'ROLE_USER' || cleanRole === 'USER' || cleanRole === 'BUYER') {
        console.log('👤 Redirecting to user dashboard');
        router.replace('/dashboard/user');
        return;
      }
      
      console.log('❓ Unknown role, staying on general dashboard:', userRole);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard, {user?.name}!
            </h1>
            <p className="text-gray-600 mb-6">
              Role: {user?.role} | Email: {user?.email}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <User className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">Profile</h3>
                    <p className="text-blue-100">Manage your account</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/profile')}
                  className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  View Profile
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">Products</h3>
                    <p className="text-green-100">Browse marketplace</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/products-you-buy')}
                  className="mt-4 bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors"
                >
                  View Products
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">Settings</h3>
                    <p className="text-purple-100">Configure preferences</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/profile')}
                  className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
                >
                  Go to Settings
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                <strong>Note:</strong> You're being redirected to your role-specific dashboard. 
                If this page persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
