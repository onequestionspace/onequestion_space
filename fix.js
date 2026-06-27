const fs = require('fs');
let c = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Fix 1: Add admin detection
c = c.replace(
  `  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const plan = subscription?.plan ?? 'free';
  const usagePercent = Math.min(Math.round((used / limit) * 100), 100);`,
  `  const ADMIN_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu'];
  const isAdmin = userId ? ADMIN_IDS.includes(userId) : false;
  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const plan = subscription?.plan ?? 'free';
  const usagePercent = isAdmin ? 0 : Math.min(Math.round((used / limit) * 100), 100);`
);

// Fix 2: Replace all purple with amber
c = c.split('#a855f7').join('#f59e0b');
c = c.split('#a855f720').join('#f59e0b20');

// Fix 3: Replace usage bar with admin unlimited UI
c = c.replace(
  `          <div className='flex items-end gap-2 mb-3'>
            <span className='text-4xl font-bold text-foreground'>{used}</span>
            <span className='text-lg text-muted-foreground mb-1'>/ {limit} credits</span>
          </div>
          <div className='w-full h-3 bg-card rounded-full overflow-hidden mb-2'>
            <div className='h-full rounded-full transition-all' style={{ width: usagePercent + '%', backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#a855f7' }} />
          </div>
          <p className='text-xs text-muted-foreground'>{limit - used} credits left this month · every question your AI answers uses one</p>`,
  `          {isAdmin ? (
            <div className='flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20'>
              <span className='text-2xl'>∞</span>
              <div>
                <p className='text-amber-400 font-bold text-sm'>Admin — Unlimited Access</p>
                <p className='text-zinc-500 text-xs'>No limits apply to your account</p>
              </div>
            </div>
          ) : (
            <>
              <div className='flex items-end gap-2 mb-3'>
                <span className='text-4xl font-bold text-foreground'>{used}</span>
                <span className='text-lg text-muted-foreground mb-1'>/ {limit} credits</span>
              </div>
              <div className='w-full h-3 bg-card rounded-full overflow-hidden mb-2'>
                <div className='h-full rounded-full transition-all' style={{ width: usagePercent + '%', backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#f59e0b' }} />
              </div>
              <p className='text-xs text-muted-foreground'>{Math.max(0, limit - used)} credits left this month · every question your AI answers uses one</p>
            </>
          )}`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', c);
console.log('done');
