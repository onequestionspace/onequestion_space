const fs = require('fs');
let c = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// Fix stats colors — remove purple
c = c.replace(
  `{ label: 'Total Questions', value: analytics?.totalQuestions?.toString() ?? '0', icon: MessageSquare, color: '#a855f7' }`,
  `{ label: 'Total Questions', value: analytics?.totalQuestions?.toString() ?? '0', icon: MessageSquare, color: '#f59e0b' }`
);

// Fix AI usage bar purple
c = c.replace(
  `backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#a855f7'`,
  `backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#f59e0b'`
);

// Add streak card after stats grid
c = c.replace(
  `        {/* Middle row: Response Rate + Usage */}`,
  `        {/* Streak card */}
        {knowledgeCount && knowledgeCount > 0 && (
          <div className='glass-card rounded-2xl p-5 border border-border flex items-center gap-4'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0'>🔥</div>
            <div>
              <p className='text-sm font-bold text-foreground'>Keep uploading knowledge</p>
              <p className='text-xs text-muted-foreground'>You have {knowledgeCount} knowledge item{knowledgeCount === 1 ? '' : 's'} — the more you add, the smarter your AI gets.</p>
            </div>
            <Link href='/dashboard/knowledge' className='ml-auto text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0'>Add more →</Link>
          </div>
        )}

        {/* Middle row: Response Rate + Usage */}`
);

fs.writeFileSync('app/dashboard/page.tsx', c);
console.log('done');
