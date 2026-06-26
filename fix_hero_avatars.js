const fs = require('fs');
let h = fs.readFileSync('components/Hero.tsx', 'utf8');

// Add recentProfiles query
h = h.replace(
  `  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;`,
  `  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;
  const recentProfiles = useQuery(api.profiles.getRecentProfiles, { limit: 5 });`
);

// Replace hardcoded avatar circles with real ones
h = h.replace(
  `                <div className='flex items-center gap-3'>
                  <div className='flex -space-x-2'>
                    {['A','P','K','M','T'].map((letter, i) => (
                      <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white' style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  <p className='text-zinc-500 text-xs'><span className='text-white font-semibold'>{count}+</span> spaces live</p>
                </div>`,
  `                <div className='flex items-center gap-3'>
                  <div className='flex -space-x-2'>
                    {(recentProfiles ?? []).map((p, i) => (
                      <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white overflow-hidden'
                        style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                        {p.avatar
                          ? <img src={p.avatar} alt={p.displayName || ''} className='w-full h-full object-cover' />
                          : p.initials}
                      </div>
                    ))}
                  </div>
                  <p className='text-zinc-500 text-xs'><span className='text-white font-semibold'>{count}+</span> spaces live</p>
                </div>`
);

fs.writeFileSync('components/Hero.tsx', h);
console.log('done');
