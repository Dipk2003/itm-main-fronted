'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Map user roles to their respective dashboards
      const dashboardMap: { [key: string]: string } = {
        'user': '/dashboard/user',
        'vendor': '/dashboard/vendor-panel',
        'admin': '/dashboard/admin'
      };
      
      // Handle both role formats safely
      let userRole = '';
      if (typeof user.role === 'string') {
        userRole = user.role.toLowerCase().replace('role_', '');
      } else if (user.userType) {
        userRole = user.userType.toLowerCase();
      }
      
      const dashboardPath = dashboardMap[userRole];
      
      if (dashboardPath) {
        router.push(dashboardPath);
      } else {
        // Fallback to home if role not recognized
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  return null;
}
