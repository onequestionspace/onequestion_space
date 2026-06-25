const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

code = code.replace(
  `  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];`,
  `  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];`
);

code = code.replace(
  `  const pinnedIds = (profile as Record<string, unknown>).pinnedQuestions as string[] || [];`,
  `  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];`
);

code = code.replace(
  `  const vibeQuote = (profile as Record<string, unknown>).vibeQuote as string || '';
  let spaceLinks: {title: string, url: string}[] = [];
  try { spaceLinks = JSON.parse((profile as Record<string, unknown>).links as string || '[]'); } catch {}`,
  `  const vibeQuote = profile ? ((profile as Record<string, unknown>).vibeQuote as string || '') : '';
  let spaceLinks: {title: string, url: string}[] = [];
  try { spaceLinks = profile ? JSON.parse((profile as Record<string, unknown>).links as string || '[]') : []; } catch {}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
