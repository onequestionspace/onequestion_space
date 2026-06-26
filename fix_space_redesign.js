const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Fix default color — kill purple default
c = c.replace(
  `const color = profile.themeColor || '#a855f7';`,
  `const color = profile.themeColor || '#f59e0b';`
);

// 2. Bigger avatar — 96px to 120px
c = c.replace(
  `          {/* Avatar */}
          <div className='relative w-24 h-24 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full' style={{ boxShadow: '0 0 0 2px ' + color + '40, 0 0 32px ' + color + '30' }} />
            <div className='relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white'
              style={{ background: profile.avatar ? undefined : color }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt={profile.displayName || username} className='w-full h-full object-cover' width={96} height={96} />
                : initials}
            </div>
          </div>`,
  `          {/* Avatar */}
          <div className='relative w-32 h-32 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full' style={{ boxShadow: '0 0 0 3px ' + color + '60, 0 0 40px ' + color + '30' }} />
            <div className='relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-white'
              style={{ background: profile.avatar ? undefined : color }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt={profile.displayName || username} className='w-full h-full object-cover' width={128} height={128} />
                : initials}
            </div>
            {/* Live indicator */}
            <div className='absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              <span className='text-[10px] text-green-400 font-medium'>Live</span>
            </div>
          </div>`
);

// 3. Bigger bolder name
c = c.replace(
  `          <h1 className='text-2xl font-bold mb-1 tracking-tight'>{profile.displayName}</h1>`,
  `          <h1 className='text-3xl font-black mb-1 tracking-tight'>{profile.displayName}</h1>`
);

// 4. Replace textarea with iMessage-style input
c = c.replace(
  `                  <textarea
                    value={question}
                    onChange={e => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setQuestion(e.target.value);
                        setCharCount(e.target.value.length);
                      }
                    }}
                    placeholder={'What do you want to ask ' + firstName + '?'}
                    rows={4}
                    className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-zinc-600 focus:outline-none resize-none text-sm transition-colors'
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
                    rows={3}
                    className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-zinc-500 focus:outline-none resize-none text-sm transition-colors leading-relaxed'
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <div className='absolute bottom-3 right-3 text-xs text-zinc-600'>
                    {charCount > 0 && <span className={charCount > MAX_CHARS * 0.85 ? 'text-yellow-500/70' : ''}>{charCount}/{MAX_CHARS}</span>}
                  </div>`
);

// 5. Replace send button with iMessage-style pill + send icon
c = c.replace(
  `                <button onClick={handleSubmit} disabled={!question.trim()}
                  className='w-full py-3 px-6 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-30 hover:opacity-90 active:scale-[0.98]'
                  style={{ backgroundColor: color }}>
                  <Send className='w-4 h-4' /> Ask {firstName}
                </button>
                <p className='text-center text-xs text-zinc-600 mt-3'>⌘ + Enter to send</p>`,
  `                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='flex-1 py-3 px-6 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 hover:opacity-90 active:scale-[0.98]'
                    style={{ backgroundColor: color, color: '#000' }}>
                    <Send className='w-3.5 h-3.5' /> Send
                  </button>
                  <p className='text-xs text-zinc-600'>⌘↵</p>
                </div>`
);

// 6. Make visitor question bubble look more like iMessage (dark pill, right aligned)
c = c.replace(
  `                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-sm leading-relaxed'>{question}</p>
                  </div>
                </div>`,
  `                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-lg bg-zinc-700 border border-white/8'>
                    <p className='text-sm leading-relaxed text-white'>{question}</p>
                  </div>
                </div>`
);

// 7. Make AI response bubble warmer — amber tint
c = c.replace(
  `                    className='rounded-2xl overflow-hidden'
                    style={{ backgroundColor: color + '0d', border: '1px solid ' + color + '22' }}>`,
  `                    className='rounded-3xl rounded-tl-lg overflow-hidden'
                    style={{ backgroundColor: color + '12', border: '1px solid ' + color + '30' }}>`
);

// 8. Add share on X button right next to copy answer (already done but make it more prominent)
// Make "Ask another question" button more inviting
c = c.replace(
  `                  className='w-full py-2.5 rounded-2xl border border-white/8 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                                                 Ask another question`,
  `                  className='w-full py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-medium'>
                    ↩ Ask another question`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('space redesign done');
