const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add queries after reactions query
space = space.replace(
  `  const reactions = useQuery(`,
  `  const foundingMember = useQuery(
    api.founding.isFoundingMember,
    profile?._id ? { userId: profile.userId } : 'skip'
  );
  const earlyAdopter = useQuery(
    api.earlyAdopters.isEarlyAdopter,
    profile?._id ? { userId: profile.userId } : 'skip'
  );
  const reactions = useQuery(`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Queries added');
