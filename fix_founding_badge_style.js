const fs = require('fs');

let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

// Update the "Only 5 spots" badge to match the gold style already there
// Update the spot number badges to gold crown style
founding = founding.replace(
  `                    <div className="text-center">
                      <p className="text-xs font-bold text-primary">#{number}</p>
                      <p className="text-xs text-white/60 truncate px-1">{member.displayName.split(' ')[0]}</p>
                    </div>`,
  `                    <div className="text-center">
                      <p className="text-xs font-bold text-yellow-400">👑 #{number}</p>
                      <p className="text-xs text-white/60 truncate px-1">{member.displayName.split(' ')[0]}</p>
                    </div>`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Founding badge style updated');

// Update space page founding member badge to gold
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `            {profile.userId === FOUNDER_ID && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'>
                👑 Founder
              </span>
            )}
            {profile.userId !== FOUNDER_ID && foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold' style={{ backgroundColor: color + '20', color, border: '1px solid ' + color + '40' }}>
                👑 Founding Member
              </span>
            )}`,
  `            {profile.userId === FOUNDER_ID && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'>
                👑 Founder
              </span>
            )}
            {profile.userId !== FOUNDER_ID && foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'>
                👑 Founding Member
              </span>
            )}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Space page badges updated to gold style');
