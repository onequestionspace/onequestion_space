'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Custom hook for authentication state
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!isSignedIn);
    }
  }, [isLoaded, isSignedIn]);

  return {
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated,
    userId: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
  };
}
