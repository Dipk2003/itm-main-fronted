'use client';

import { ReactNode } from 'react';
import ReduxProvider from '@/components/providers/ReduxProvider';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ReduxProvider>
  );
}
