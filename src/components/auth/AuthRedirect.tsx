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
        'USER': '/dashboard/user',
        'VENDOR': '/dashboard/vendor', 
        'ADMIN': '/dashboard/admin'
      };
      
      const userRole = user.role.replace('ROLE_', '');
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
