'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const APIDocsPage = () => {
  useEffect(() => {
    // Set up Swagger UI preferences
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Documentation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete documentation for ITech B2B Platform API
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <SwaggerUI
            url={process.env.NEXT_PUBLIC_API_URL + '/v3/api-docs'}
            docExpansion="list"
            filter={true}
            persistAuthorization={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
