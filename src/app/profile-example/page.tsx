'use client';

import React from 'react';
import ProfileSettings from '@/components/profile/ProfileSettings';

export default function ProfileExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
}
