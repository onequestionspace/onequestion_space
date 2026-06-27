const fs = require('fs');
let h = fs.readFileSync('components/Hero.tsx', 'utf8');

h = h.replace(
  `                <div className='flex -space-x-2'>
                {(recentProfiles ?? []).slice(0, 5).map((p, i) => (
                  <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white overflow-hidden'
                    style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                    {p.avatar
                      ? <img src={p.avatar} alt={p.displayName || ''} className='w-full h-full object-cover' />
                      : p.initials}
                  </div>
                ))}
                </div>`,
  `                <div className='flex -space-x-2'>
                {['A','P','K','M','T'].map((l, i) => (
                  <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white'
                    style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                    {l}
                  </div>
                ))}
                </div>`
);

// Also remove the unused query
h = h.replace(
  `  const recentProfiles = useQuery(api.profiles.getRecentProfiles, { limit: 5 });`,
  ``
);

fs.writeFileSync('components/Hero.tsx', h);
console.log('done');
