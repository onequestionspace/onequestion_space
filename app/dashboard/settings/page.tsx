'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

/**
 * Settings Page
 * User profile and account settings
 */
export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* TODO: Implement settings management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
          <p className="text-gray-600">Settings interface coming soon</p>
        </div>
      </div>
    </div>
  );
}
