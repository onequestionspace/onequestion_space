const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Fix the input area — more iMessage feel
page = page.replace(
  "                <div className='flex items-end gap-2 px-2 py-2 rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm'>",
  "                <div className={'flex items-end gap-2 px-3 py-2 rounded-3xl border ' + (isLight ? 'border-zinc-200 bg-white/90' : 'border-zinc-700/50 bg-zinc-900/60') + ' backdrop-blur-sm shadow-sm'}>"
);

// 2. Fix textarea text color for light themes
page = page.replace(
  "                    className='flex-1 px-3 py-2 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none text-sm leading-relaxed'",
  "                    className={'flex-1 px-3 py-2 bg-transparent focus:outline-none resize-none text-sm leading-relaxed ' + (isLight ? 'text-zinc-900 placeholder:text-zinc-400' : 'text-white placeholder:text-zinc-600')}"
);

// 3. Fix send button icon — use ArrowUp instead of Send (more iMessage)
page = page.replace(
  "                    <Send className='w-4 h-4 text-black' />",
  "                    <svg className='w-4 h-4 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M12 19V5M5 12l7-7 7 7'/></svg>"
);

// 4. Fix suggested questions for light themes
page = page.replace(
  "                        className=\"px-3 py-1.5 rounded-full border border-white/10 bg-white/4 hover:bg-white/8 text-xs text-zinc-400 hover:text-white transition-all text-left\">",
  "                        className={'px-3 py-1.5 rounded-full border text-xs transition-all text-left ' + (isLight ? 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900' : 'border-white/10 bg-white/4 hover:bg-white/8 text-zinc-400 hover:text-white')}>"
);

// 5. Fix typing indicator — remove the AI card feel
page = page.replace(
  "                  <div className='flex items-center gap-3 p-4 rounded-2xl bg-white/4 border border-white/8'>",
  "                  <div className={'flex items-center gap-3 p-4 rounded-3xl rounded-bl-sm ' + (isLight ? 'bg-zinc-100 border border-zinc-200' : 'bg-white/5 border border-white/8')}>"
);

// 6. Fix the welcome message
page = page.replace(
  "          {!submitted && (\n            <p className='text-xs text-zinc-600 mb-3 text-center'>&ldquo;{welcomeMessage}&rdquo;</p>\n          )}",
  "          {!submitted && (\n            <p className={'text-xs mb-4 text-center italic ' + textMuted}>&ldquo;{welcomeMessage}&rdquo;</p>\n          )}"
);

// 7. Fix question bubble (user message) for light themes
page = page.replace(
  "                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm' style={{ backgroundColor: '#3a3a3c' }}>",
  "                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm' style={{ backgroundColor: color }}>"
);
page = page.replace(
  "                    <p className='text-sm leading-relaxed text-white'>{question}</p>",
  "                    <p className='text-sm leading-relaxed text-white'>{question}</p>"
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('1 space page feels more personal — iMessage style polished');
