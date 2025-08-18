import { DirectoryPage } from '@/modules/directory';
import { Metadata } from 'next';

interface CityDirectoryPageProps {
  params: {
    city: string;
  };
  searchParams: {
    category?: string;
    service?: string;
  };
}

export async function generateMetadata({ params, searchParams }: CityDirectoryPageProps): Promise<Metadata> {
  const cityName = decodeURIComponent(params.city).replace(/-/g, ' ');
  const service = searchParams.service || searchParams.category;
  
  const title = service 
    ? `${service} in ${cityName} - Service Providers | Indian Trade Mart`
    : `Service Providers in ${cityName} | Indian Trade Mart`;
    
  const description = service
    ? `Find trusted ${service.toLowerCase()} service providers in ${cityName}. Compare ratings, reviews, and get quotes.`
    : `Find trusted service providers and businesses in ${cityName}. Compare ratings, reviews, and connect with local professionals.`;

  return {
    title,
    description,
    keywords: `${service || 'service providers'}, ${cityName}, local businesses, professionals, suppliers`,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default function CityDirectoryPage({ params, searchParams }: CityDirectoryPageProps) {
  const cityName = decodeURIComponent(params.city).replace(/-/g, ' ');
  const service = searchParams.service || searchParams.category || '';

  return (
    <DirectoryPage
      initialQuery={service}
      initialLocation={cityName}
      initialCategory={searchParams.category}
    />
  );
}
