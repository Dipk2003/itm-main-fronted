'use client';

import { ReactNode } from 'react';
import ReduxProvider from '@/components/providers/ReduxProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
