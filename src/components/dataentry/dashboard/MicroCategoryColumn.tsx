'use client';

import React from 'react';
import { Hash } from 'lucide-react';

const MicroCategoryColumn: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4" />
          <span className="font-medium">MicroCategories</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Hash className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">MicroCategory management coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default MicroCategoryColumn;
