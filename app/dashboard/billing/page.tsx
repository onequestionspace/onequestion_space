'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

/**
 * Billing Page
 * Manage subscription and payment
 */
export default function BillingPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>

        {/* TODO: Implement billing management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
          <p className="text-gray-600">Billing interface coming soon</p>
        </div>
      </div>
    </div>
  );
}
