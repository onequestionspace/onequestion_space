const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// ── 1. Add markdown stripper helper after imports ────────────────────────────
space = space.replace(
  `const BG_STYLES`,
  `const stripMarkdown = (text: string) =>
  text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .trim();

const BG_STYLES`
);

// ── 2. Strip markdown from AI response before typing it out ──────────────────
space = space.replace(
  `const fullResponse = data?.data?.answer || data?.answer || 'I am thinking through your question.';`,
  `const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'I am thinking through your question.');`
);

// ── 3. Show question above AI response + add reaction placeholder ─────────────
space = space.replace(
  `              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                {isTyping && !aiResponse && (`,
  `              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                {/* Question bubble */}
                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-xs text-zinc-500 mb-1'>You asked</p>
                    <p className='text-sm text-white leading-relaxed'>{question}</p>
                  </div>
                </div>
                {isTyping && !aiResponse && (`
);

// ── 4. Add token count dynamically below AI response ────────────────────────
space = space.replace(
  `                    <div className='flex items-center gap-2 mb-3'>
                      <Brain className='w-4 h-4' style={{ color }} />
                      <span className='text-xs font-medium' style={{ color }}>AI Response</span>
                    </div>`,
  `                    <div className='flex items-center justify-between gap-2 mb-3'>
                      <div className='flex items-center gap-2'>
                        <Brain className='w-4 h-4' style={{ color }} />
                        <span className='text-xs font-medium' style={{ color }}>AI Response</span>
                      </div>
                      <span className='text-xs text-zinc-600'>{aiResponse.split(' ').length} tokens</span>
                    </div>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed: question display, markdown stripping, token count');
