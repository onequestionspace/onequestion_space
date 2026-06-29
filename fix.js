const fs = require('fs');
const PROD_ID = 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs';
const DEV_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';

let c = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Add prod ID to ADMIN_IDS array
c = c.replace(
  `const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];`,
  `const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
  '${PROD_ID}',
];`
);

// Make ADMIN_ID dynamic — use current user's ID if they are admin
c = c.replace(
  `const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';`,
  `const ADMIN_ID = '${DEV_ID}';`
);

// Fix mutation calls to use adminId (which is user?.id) instead of ADMIN_ID
c = c.replace(
  `? await grantFoundingBadge({ adminId: ADMIN_ID, ...grantForm })`,
  `? await grantFoundingBadge({ adminId: adminId, ...grantForm })`
);
c = c.replace(
  `: await grantEarlyAdopterBadge({ adminId: ADMIN_ID, ...grantForm })`,
  `: await grantEarlyAdopterBadge({ adminId: adminId, ...grantForm })`
);
c = c.replace(
  `await removeBadge({ adminId: ADMIN_ID, userId, type });`,
  `await removeBadge({ adminId: adminId, userId, type });`
);
c = c.replace(
  `await deleteProfile({ adminId: ADMIN_ID, profileId });`,
  `await deleteProfile({ adminId: adminId, profileId });`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', c);
console.log('done');
