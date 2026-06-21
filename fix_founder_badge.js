const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Update COFOUNDER_IDS to only Paraja
space = space.replace(
  `const COFOUNDER_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];`,
  `const COFOUNDER_IDS = ['user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz'];
const FOUNDER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';`
);

// Add Asym founder badge — shows above everything
space = space.replace(
  `            {foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold' style={{ backgroundColor: color + '20', color, border: '1px solid ' + color + '40' }}>
                👑 Founder
              </span>
            )}`,
  `            {profile.userId === FOUNDER_ID && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'>
                👑 Founder
              </span>
            )}
            {profile.userId !== FOUNDER_ID && foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold' style={{ backgroundColor: color + '20', color, border: '1px solid ' + color + '40' }}>
                👑 Founding Member
              </span>
            )}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Founder/Co-Founder badges fixed');
