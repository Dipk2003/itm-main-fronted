import { DirectoryPage } from '@/modules/directory';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Directory - Find Service Providers | Indian Trade Mart',
  description: 'Find and connect with trusted service providers, businesses, and professionals in your area. Search by service type, location, and ratings.',
  keywords: 'business directory, service providers, professionals, suppliers, contractors, consultants, local businesses',
  openGraph: {
    title: 'Business Directory - Find Service Providers | Indian Trade Mart',
    description: 'Find and connect with trusted service providers, businesses, and professionals in your area.',
    type: 'website',
  },
};

interface DirectoryPageProps {
  searchParams: {
    q?: string;
    location?: string;
    category?: string;
  };
}

export default function Directory({ searchParams }: DirectoryPageProps) {
  return (
    <DirectoryPage
      initialQuery={searchParams.q || ''}
      initialLocation={searchParams.location || ''}
      initialCategory={searchParams.category || ''}
    />
  );
}
