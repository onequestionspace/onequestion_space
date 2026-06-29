export const ADMIN_USER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu', // Asym Alwali @Asym_Alwali (dev)
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs', // Asym Alwali @Asym_Alwali (prod)
];

export const isAdmin = (userId: string) => ADMIN_USER_IDS.includes(userId);
