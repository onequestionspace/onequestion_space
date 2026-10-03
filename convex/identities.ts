/**
 * Canonical identity lists — Convex copy.
 *
 * MUST stay byte-identical in content to `lib/identities.ts`.
 * The Convex bundler only includes files under `convex/`, so it cannot import
 * from `lib/`. `scripts/check-identities.mjs` enforces parity in CI.
 *
 * Keep the exported constant names and values in the same order.
 */

export const ASYM_DEV_USER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';
export const ASYM_PROD_USER_ID = 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs';
export const PARAJA_USER_ID = 'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz';

export const ADMIN_USER_IDS: readonly string[] = [
  ASYM_DEV_USER_ID,
  ASYM_PROD_USER_ID,
  PARAJA_USER_ID,
];

export const FOUNDER_USER_IDS: readonly string[] = [ASYM_DEV_USER_ID, ASYM_PROD_USER_ID];
export const COFOUNDER_USER_IDS: readonly string[] = [PARAJA_USER_ID];

export const FOUNDER_USER_ID = ASYM_DEV_USER_ID;

export const isAdmin = (userId: string | null | undefined): boolean =>
  !!userId && ADMIN_USER_IDS.includes(userId);

export const isFounder = (userId: string | null | undefined): boolean =>
  !!userId && FOUNDER_USER_IDS.includes(userId);

export const isCofounder = (userId: string | null | undefined): boolean =>
  !!userId && COFOUNDER_USER_IDS.includes(userId);