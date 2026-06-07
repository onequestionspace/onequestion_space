'use client';

import { useUser } from '@clerk/nextjs';

/**
 * Custom hook for authentication state
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  const isAuthenticated = isLoaded ? !!isSignedIn : false;

  return {
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated,
    userId: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
  };
}
