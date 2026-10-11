export const ADMIN_USER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
] as const;

export const PRIMARY_FOUNDER_USER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';
export const FOUNDER_USER_IDS = [
  PRIMARY_FOUNDER_USER_ID,
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs',
] as const;
export const COFOUNDER_USER_IDS = ['user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz'] as const;

export function isAdminUser(userId: string | null | undefined): boolean {
  return !!userId && ADMIN_USER_IDS.some((id) => id === userId);
}

export function isFounderUser(userId: string): boolean {
  return FOUNDER_USER_IDS.some((id) => id === userId);
}

export function isCofounderUser(userId: string): boolean {
  return COFOUNDER_USER_IDS.some((id) => id === userId);
}
