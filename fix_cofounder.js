const fs = require('fs');

// ── 1. Add Paraja to admin ───────────────────────────────────────────────────
let admin = fs.readFileSync('convex/admin.ts', 'utf8');
admin = admin.replace(
  `const ADMIN_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu'];`,
  `const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu', // Asym Alwali @Asym_Alwali
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz', // Paraja @MuhammadParaja
];`
);
fs.writeFileSync('convex/admin.ts', admin);
console.log('✓ Paraja added to admin');

// ── 2. Add Paraja to admin page ──────────────────────────────────────────────
let adminPage = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');
adminPage = adminPage.replace(
  `const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';`,
  `const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];
const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';`
);
adminPage = adminPage.replace(
  `const isAdmin = user?.id === ADMIN_ID;`,
  `const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;`
);
adminPage = adminPage.replace(
  `const profiles = useQuery(api.admin.getAllProfiles, isAdmin ? { adminId: ADMIN_ID } : 'skip');
  const founders = useQuery(api.admin.getAllFoundingMembers, isAdmin ? { adminId: ADMIN_ID } : 'skip');
  const earlyAdopters = useQuery(api.admin.getAllEarlyAdopters, isAdmin ? { adminId: ADMIN_ID } : 'skip');`,
  `const adminId = user?.id || ADMIN_ID;
  const profiles = useQuery(api.admin.getAllProfiles, isAdmin ? { adminId } : 'skip');
  const founders = useQuery(api.admin.getAllFoundingMembers, isAdmin ? { adminId } : 'skip');
  const earlyAdopters = useQuery(api.admin.getAllEarlyAdopters, isAdmin ? { adminId } : 'skip');`
);
fs.writeFileSync('app/dashboard/admin/page.tsx', adminPage);
console.log('✓ Admin page updated for both admins');

// ── 3. Update admin.ts to accept both admin IDs ──────────────────────────────
let adminTs = fs.readFileSync('convex/admin.ts', 'utf8');
adminTs = adminTs.replace(
  `const checkAdmin = (userId: string) => {
  if (!ADMIN_IDS.includes(userId)) throw new Error('Unauthorized');
};`,
  `const checkAdmin = (userId: string) => {
  if (!ADMIN_IDS.includes(userId)) throw new Error('Unauthorized');
};`
);
fs.writeFileSync('convex/admin.ts', adminTs);

// ── 4. Add co-founder badge to space page ────────────────────────────────────
const COFOUNDER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add cofounder check constant
space = space.replace(
  `const stripMarkdown`,
  `const COFOUNDER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];

const stripMarkdown`
);

// Add cofounder badge after early adopter badge
space = space.replace(
  `            {!foundingMember && earlyAdopter && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>
                ⚡ Early Adopter
              </span>
            )}`,
  `            {!foundingMember && earlyAdopter && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>
                ⚡ Early Adopter
              </span>
            )}
            {COFOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30'>
                🤝 Co-Founder
              </span>
            )}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Co-founder badge added to space page');
