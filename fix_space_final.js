const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Fix pinned answers — show full answer not truncated
c = c.replace(
  `                      <p className='text-xs opacity-65 leading-relaxed'>{q.answer}</p>`,
  `                      <p className='text-xs opacity-65 leading-relaxed'>{q.answer ? stripMarkdown(q.answer) : ''}</p>`
);

// 2. Make input compact + iMessage style bottom row
c = c.replace(
  `                  <textarea
                    value={question}
                    onChange={e => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setQuestion(e.target.value);
                        setCharCount(e.target.value.length);
                      }
                    }}
                    placeholder={'Ask ' + firstName + ' anything...'}
                    rows={3}
                    className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-zinc-500 focus:outline-none resize-none text-sm transition-colors leading-relaxed'
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <div className='absolute bottom-3 right-3 text-xs text-zinc-600'>
                    {charCount > 0 && <span className={charCount > MAX_CHARS * 0.85 ? 'text-yellow-500/70' : ''}>{charCount}/{MAX_CHARS}</span>}
                  </div>`,
  `                  <textarea
                    value={question}
                    onChange={e => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setQuestion(e.target.value);
                        setCharCount(e.target.value.length);
                      }
                    }}
                    placeholder={'Ask ' + firstName + ' anything...'}
                    rows={2}
                    className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-zinc-500 focus:outline-none resize-none text-sm transition-colors leading-relaxed'
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <div className='absolute bottom-3 right-3 text-xs text-zinc-600'>
                    {charCount > 0 && <span className={charCount > MAX_CHARS * 0.85 ? 'text-yellow-500/70' : ''}>{charCount}/{MAX_CHARS}</span>}
                  </div>`
);

// 3. Replace send button with iMessage circle button
c = c.replace(
  `                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='flex-1 py-3 px-6 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 hover:opacity-90 active:scale-[0.98]'
                    style={{ backgroundColor: color, color: '#000' }}>
                    <Send className='w-3.5 h-3.5' /> Send
                  </button>
                  <p className='text-xs text-zinc-600'>⌘↵</p>
                </div>`,
  `                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-90 active:scale-95 shrink-0'
                    style={{ backgroundColor: color }}>
                    <Send className='w-4 h-4 text-black' />
                  </button>
                </div>`
);

// 4. Capitalize question display in pinned
c = c.replace(
  `                      <p className='text-sm font-medium'>{q.question}</p>`,
  `                      <p className='text-sm font-medium'>{q.question.charAt(0).toUpperCase() + q.question.slice(1)}</p>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
