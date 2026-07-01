const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Fix bio text
page = page.replace(
  "          {profile.bio && <p className='text-zinc-400 text-sm max-w-xs mx-auto mb-3 leading-relaxed'>{profile.bio}</p>}",
  "          {profile.bio && <p className={'text-sm max-w-xs mx-auto mb-3 leading-relaxed ' + textSub}>{profile.bio}</p>}"
);

// Fix joined date and questions count
page = page.replace(
  "            <span className='text-xs text-zinc-600'>",
  "            <span className={'text-xs ' + textMuted}>"
);

// Fix stats numbers
page = page.replace(
  "              <p className='text-xl font-bold'>{analytics.totalQuestions}</p>\n                <p className='text-xs opacity-40 mt-0.5'>questions</p>",
  "              <p className={'text-xl font-bold ' + textMain}>{analytics.totalQuestions}</p>\n                <p className={'text-xs mt-0.5 ' + textMuted}>questions</p>"
);
page = page.replace(
  "              <p className='text-xl font-bold'>{analytics.totalVisitors}</p>\n                <p className='text-xs opacity-40 mt-0.5'>visitors</p>",
  "              <p className={'text-xl font-bold ' + textMain}>{analytics.totalVisitors}</p>\n                <p className={'text-xs mt-0.5 ' + textMuted}>visitors</p>"
);
page = page.replace(
  "                  <p className='text-xl font-bold'>{Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%</p>\n                  <p className='text-xs opacity-40 mt-0.5'>answered</p>",
  "                  <p className={'text-xl font-bold ' + textMain}>{Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%</p>\n                  <p className={'text-xs mt-0.5 ' + textMuted}>answered</p>"
);

// Fix stats dividers
page = page.replace(
  /className='w-px h-6 bg-white\/10'/g,
  "className={'w-px h-6 ' + (isLight ? 'bg-zinc-300' : 'bg-white/10')}"
);

// Fix social links for light themes
page = page.replace(
  /className='flex items-center gap-1\.5 px-3 py-1\.5 rounded-full bg-white\/5 hover:bg-white\/10 transition-all text-white\/70 hover:text-white text-xs font-medium border border-white\/8'/g,
  "className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ' + (isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/8')}"
);

// Fix share button
page = page.replace(
  "className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-zinc-400 hover:text-white transition-all'",
  "className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ' + (isLight ? 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-900' : 'bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-400 hover:text-white')}"
);

// Fix name text
page = page.replace(
  "          <h1 className='text-3xl font-black mb-1 tracking-tight'>{profile.displayName}</h1>",
  "          <h1 className={'text-3xl font-black mb-1 tracking-tight ' + textMain}>{profile.displayName}</h1>"
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('space page text fixed for light and dark themes');
