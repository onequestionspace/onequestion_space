const fs = require('fs');
let c = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Add error boundary — fall back to basic profiles if stats query fails
c = c.replace(
  `  const profiles = useQuery(api.admin.getAllProfilesWithStats, isAdmin ? { adminId } : 'skip');`,
  `  const profilesWithStats = useQuery(api.admin.getAllProfilesWithStats, isAdmin ? { adminId } : 'skip');
  const profilesBasic = useQuery(api.admin.getAllProfiles, isAdmin ? { adminId } : 'skip');
  const profiles = profilesWithStats ?? profilesBasic;`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', c);
console.log('done');
