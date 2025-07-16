'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { RootState } from '@/store';
import UserActions from "@/components/dashboard/user/UserActions"
import SearchBar from "@/components/shared/SearchBar"
import RecentOrders from "@/components/dashboard/user/RecentOrders"
import CategorySidebar from "@/components/dashboard/user/CategorySidebar"
import UserProductGrid from "@/components/dashboard/user/UserProductGrid"
import AccountActions from "@/components/dashboard/user/AccountActions"
import AuthGuard from "@/components/auth/AuthGuard"
import UserProfile from "@/components/dashboard/user/UserProfile"
import UserOrders from "@/components/dashboard/user/UserOrders"
import UserWishlist from "@/components/dashboard/user/UserWishlist"
import UserSupport from "@/components/dashboard/user/UserSupport"

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState('home');
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  // Debug logging
  console.log('Dashboard state:', { user, isAuthenticated, loading, activeView });
  
  // Handle URL parameters for navigation
  useEffect(() => {
    const view = searchParams.get('view');
    console.log('URL view parameter:', view);
    if (view && ['home', 'profile', 'orders', 'wishlist', 'support'].includes(view)) {
      console.log('Setting active view to:', view);
      setActiveView(view);
    }
  }, [searchParams]);
  
  const handleNavigate = (view: string) => {
    console.log('Navigating to view:', view);
    setActiveView(view);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <SearchBar placeholder="Search for products..." />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <RecentOrders />
                <UserProductGrid />
              </div>
              <div className="space-y-6">
                <CategorySidebar />
                <AccountActions onNavigate={handleNavigate} />
              </div>
            </div>
          </>
        );
      case 'profile':
        return <UserProfile />;
      case 'orders':
        return <UserOrders />;
      case 'wishlist':
        return <UserWishlist />;
      case 'support':
        return <UserSupport />;
      default:
        return null;
    }
  };

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {activeView === 'home' ? `Welcome back, ${user?.name || 'User'}!` : 
             activeView === 'profile' ? 'My Profile' :
             activeView === 'orders' ? 'My Orders' :
             activeView === 'wishlist' ? 'My Wishlist' :
             activeView === 'support' ? 'Support' : 'Dashboard'}
          </h1>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-1">
              Auth: {isAuthenticated ? 'Yes' : 'No'} | User: {user?.email || 'None'} | Role: {user?.role || 'None'}
            </div>
          )}
        </div>
        {activeView !== 'home' && (
          <button
            onClick={() => setActiveView('home')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>
      
      {activeView === 'home' && <UserActions onNavigate={handleNavigate} />}
      
      {renderActiveView()}
    </section>
  )
}

export default function UserDashboard() {
  return (
    <AuthGuard allowedRoles={['ROLE_USER', 'USER']}>
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
        <UserDashboardContent />
      </Suspense>
    </AuthGuard>
  )
}
