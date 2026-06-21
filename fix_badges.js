const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add earlyAdopter query after foundingMember query
if (!space.includes('isEarlyAdopter')) {
  space = space.replace(
    `  const foundingMember = useQuery(
    api.founding.isFoundingMember,
    profile?._id ? { userId: profile.userId } : 'skip'
  );`,
    `  const foundingMember = useQuery(
    api.founding.isFoundingMember,
    profile?._id ? { userId: profile.userId } : 'skip'
  );
  const earlyAdopter = useQuery(
    api.earlyAdopters.isEarlyAdopter,
    profile?._id ? { userId: profile.userId } : 'skip'
  );`
  );
}

// Replace username line with badge row
space = space.replace(
  `          <h1 className='text-2xl font-bold text-white mb-1'>{profile.displayName}</h1>
          <p className='text-sm mb-3' style={{ color }}>{profile.username}</p>`,
  `          <h1 className='text-2xl font-bold text-white mb-1'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-3 flex-wrap'>
            <p className='text-sm' style={{ color }}>{profile.username}</p>
            {foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold' style={{ backgroundColor: color + '20', color, border: '1px solid ' + color + '40' }}>
                👑 Founder
              </span>
            )}
            {!foundingMember && earlyAdopter && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>
                ⚡ Early Adopter
              </span>
            )}
          </div>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Founding + Early Adopter badges added');
