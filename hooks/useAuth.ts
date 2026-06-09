'use client';

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

/**
 * Unified auth hook (session + user)
 * - useClerkAuth = source of truth for session state
 * - useUser = profile data only
 */
export function useAuth() {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();

  return {
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated: !!isSignedIn,
    userId,
    email: user?.emailAddresses?.[0]?.emailAddress,
  };
}
