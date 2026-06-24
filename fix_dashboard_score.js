const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// Add completion score after the header row
code = code.replace(
  `        {/* Onboarding Banner */}`,
  `        {/* Space Completion Score */}
        {(() => {
          const checks = [
            !!profile?.displayName,
            !!profile?.avatar,
            !!(profile?.bio && profile.bio.length > 10),
            !!profile?.welcomeMessage,
            !!(profile as Record<string, unknown>)?.vibeQuote,
            knowledgeCount ? knowledgeCount > 0 : false,
          ];
          const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
          if (score === 100) return null;
          return (
            <div className='glass-card rounded-2xl p-5 border border-border'>
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>Your space is {score}% complete</p>
                  <p className='text-xs text-muted-foreground'>Finish your space to attract more visitors</p>
                </div>
                <Link href='/dashboard/studio' className='text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-pink hover:opacity-90 transition-all'>
                  Open Studio →
                </Link>
              </div>
              <div className='w-full h-1.5 bg-card rounded-full overflow-hidden'>
                <div className='h-full rounded-full bg-gradient-to-r from-primary to-pink transition-all' style={{ width: score + \`%\` }} />
              </div>
            </div>
          );
        })()}

        {/* Onboarding Banner */}`
);

fs.writeFileSync('app/dashboard/page.tsx', code);
console.log('Done');
