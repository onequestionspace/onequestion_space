export const ADMIN_USER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu', // Asym Alwali @Asym_Alwali
];

export const isAdmin = (userId: string) => ADMIN_USER_IDS.includes(userId);
