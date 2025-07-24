'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function AuthGuard({ children, allowedRoles, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !loading) {
      // Check if user has token and user data
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!isAuthenticated || !token || !userData) {
        console.log('User not authenticated, redirecting to login');
        router.push(redirectTo);
        return;
      }

      if (allowedRoles && user && Array.isArray(allowedRoles)) {
        const userRole = user.role.replace('ROLE_', '');
        const userRoleWithPrefix = user.role;
        
        // Check if user role matches any allowed role (with or without ROLE_ prefix)
        const hasAccess = allowedRoles.some(allowedRole => 
          allowedRole === userRole || 
          allowedRole === userRoleWithPrefix ||
          allowedRole.replace('ROLE_', '') === userRole
        );
        
        if (!hasAccess) {
          console.log('User role not authorized, redirecting to appropriate dashboard');
          // Redirect to appropriate dashboard based on user role
          const dashboardMap: { [key: string]: string } = {
            'USER': '/dashboard/user',
            'VENDOR': '/dashboard/vendor', 
            'ADMIN': '/dashboard/admin'
          };
          
          const dashboardPath = dashboardMap[userRole] || '/';
          router.push(dashboardPath);
          return;
        }
      }
    }
  }, [isHydrated, isAuthenticated, user, loading, router, allowedRoles, redirectTo]);

  // Show loading during hydration or when auth is loading
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && Array.isArray(allowedRoles)) {
    const userRole = user.role.replace('ROLE_', '');
    const userRoleWithPrefix = user.role;
    
    // Check if user role matches any allowed role (with or without ROLE_ prefix)
    const hasAccess = allowedRoles.some(allowedRole => 
      allowedRole === userRole || 
      allowedRole === userRoleWithPrefix ||
      allowedRole.replace('ROLE_', '') === userRole
    );
    
    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}
