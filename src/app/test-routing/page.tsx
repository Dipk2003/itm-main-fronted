'use client';

import { useEffect, useState } from 'react';

export default function TestRouting() {
  const [routingInfo, setRoutingInfo] = useState({
    currentURL: '',
    hostname: '',
    pathname: '',
    searchParams: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRoutingInfo({
        currentURL: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        searchParams: window.location.search,
      });
    }
  }, []);

  const testUrls = [
    {
      url: '/?subdomain=dir',
      description: 'Directory via query param',
      expected: 'Should route to /directory'
    },
    {
      url: '/?subdomain=vendor',
      description: 'Vendor via query param',
      expected: 'Should route to /dashboard/vendor-panel'
    },
    {
      url: '/?subdomain=admin',
      description: 'Admin via query param',
      expected: 'Should route to /dashboard/admin'
    },
    {
      url: '/?subdomain=support',
      description: 'Support via query param',
      expected: 'Should route to /dashboard/support'
    },
    {
      url: '/?subdomain=customer',
      description: 'Customer via query param',
      expected: 'Should route to /dashboard/user'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Subdomain Routing Test Page
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Page Info</h2>
          <div className="space-y-2">
            <p><strong>Current URL:</strong> {routingInfo.currentURL}</p>
            <p><strong>Hostname:</strong> {routingInfo.hostname}</p>
            <p><strong>Pathname:</strong> {routingInfo.pathname}</p>
            <p><strong>Search Params:</strong> {routingInfo.searchParams}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Subdomain Routing</h2>
          <p className="text-gray-600 mb-6">
            Click the links below to test subdomain routing via query parameters:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {testUrls.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {test.description}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{test.expected}</p>
                <a
                  href={test.url}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Test {test.url}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">
            Production Subdomain Setup
          </h2>
          <p className="text-yellow-700 mb-4">
            For production subdomain testing, add these entries to your hosts file:
          </p>
          <pre className="bg-yellow-100 p-3 rounded text-sm overflow-x-auto">
{`127.0.0.1 dir.localhost
127.0.0.1 vendor.localhost
127.0.0.1 admin.localhost
127.0.0.1 support.localhost
127.0.0.1 customer.localhost`}
          </pre>
          <p className="text-yellow-700 mt-4">
            Then access: http://dir.localhost:3000, http://vendor.localhost:3000, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
