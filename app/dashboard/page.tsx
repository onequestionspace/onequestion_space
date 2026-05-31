'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

/**
 * Dashboard Page
 * Main hub for authenticated users
 */
export default function DashboardPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* TODO: Implement dashboard sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards will go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">Coming Soon</h2>
            <p className="text-gray-600">Dashboard implementation in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
