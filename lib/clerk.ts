/**
 * Clerk Authentication Integration
 * Handles user authentication and session management
 */

import { auth } from '@clerk/nextjs/server';

/**
 * Get current authenticated user
 * @returns User session or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const { userId, sessionId } = await auth();
    return {
      userId,
      sessionId,
      isAuthenticated: !!userId,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      userId: null,
      sessionId: null,
      isAuthenticated: false,
    };
  }
}

/**
 * Check if user is authenticated
 * @returns Whether user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { userId } = await auth();
    return !!userId;
  } catch (error) {
    return false;
  }
}

/**
 * Get user ID
 * @returns User ID or null
 */
export async function getUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    return null;
  }
}

/**
 * TODO: Implement additional Clerk utilities
 * - Get user profile
 * - Update user profile
 * - Sign out user
 * - Refresh session
 * - Handle authentication errors
 */
