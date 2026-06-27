const fs = require('fs');
let h = fs.readFileSync('components/Hero.tsx', 'utf8');

h = h.replace(
  `  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;`,
  `  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;
  const recentProfiles = useQuery(api.profiles.getRecentProfiles, { limit: 5 });`
);

h = h.replace(
  `                {['A','P','K','M','T'].map((l, i) => (
                  <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white'
                    style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                    {l}
                  </div>
                ))}`,
  `                {(recentProfiles ?? []).slice(0, 5).map((p, i) => (
                  <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white overflow-hidden'
                    style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                    {p.avatar
                      ? <img src={p.avatar} alt={p.displayName || ''} className='w-full h-full object-cover' />
                      : p.initials}
                  </div>
                ))}`
);

fs.writeFileSync('components/Hero.tsx', h);
console.log('done');
