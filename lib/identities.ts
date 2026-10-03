/**
 * Canonical identity lists.
 *
 * These Clerk user IDs grant admin access and founder/co-founder perks.
 * They were previously duplicated across 8 files and had already drifted
 * apart: `billing/page.tsx` and `api/stream/route.ts` were missing Paraja,
 * and `DashboardLayout.tsx` was missing Asym's production account.
 *
 * NOTE: `convex/identities.ts` holds an identical copy because the Convex
 * bundler only includes files under `convex/`. `scripts/check-identities.mjs`
 * (run in CI) fails the build if the two ever diverge again.
 */

export const ASYM_DEV_USER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';
export const ASYM_PROD_USER_ID = 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs';
export const PARAJA_USER_ID = 'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz';

/** Full access to the admin panel. */
export const ADMIN_USER_IDS: readonly string[] = [
  ASYM_DEV_USER_ID,
  ASYM_PROD_USER_ID,
  PARAJA_USER_ID,
];

/** Founders and co-founders see private perks badges on public spaces. */
export const FOUNDER_USER_IDS: readonly string[] = [ASYM_DEV_USER_ID, ASYM_PROD_USER_ID];
export const COFOUNDER_USER_IDS: readonly string[] = [PARAJA_USER_ID];

/** Primary founder account — the one whose knowledge backs `/api/explore`. */
export const FOUNDER_USER_ID = ASYM_DEV_USER_ID;

export const isAdmin = (userId: string | null | undefined): boolean =>
  !!userId && ADMIN_USER_IDS.includes(userId);

export const isFounder = (userId: string | null | undefined): boolean =>
  !!userId && FOUNDER_USER_IDS.includes(userId);

export const isCofounder = (userId: string | null | undefined): boolean =>
  !!userId && COFOUNDER_USER_IDS.includes(userId);