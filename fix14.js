const fs = require('fs');
const path = 'components/DashboardLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

const old = `              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-600 cursor-not-allowed">
                <div className='w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600'>
                  <Inbox className="w-4 h-4" />
                </div>
                <span className="text-xs">Inbox</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Soon</span>
              </div>
`;

if (!content.includes(old)) {
  console.error('❌ Disabled Inbox stub not found — aborting.');
  process.exit(1);
}
content = content.replace(old, '');
fs.writeFileSync(path, content);
console.log('✅ Disabled "Coming Soon" Inbox stub removed — Inbox is now live and active in the main nav.');
