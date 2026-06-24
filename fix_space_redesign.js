const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Replace BG_STYLES with richer, warmer backgrounds
code = code.replace(
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-zinc-900',
  darker: 'bg-black',
  midnight: 'bg-slate-950',
  aurora: 'bg-gradient-to-br from-purple-950 to-blue-950',
  sunset: 'bg-gradient-to-br from-orange-950 to-pink-950',
  ocean: 'bg-gradient-to-br from-cyan-950 to-blue-950',
  particles: 'bg-zinc-950',
  bubbles: 'bg-zinc-950',
  net: 'bg-zinc-950',
  matrix: 'bg-black',
};`,
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-[#0f0c1a]',
  darker: 'bg-[#080608]',
  midnight: 'bg-[#0a0f1e]',
  aurora: 'bg-[#0d0b1a]',
  sunset: 'bg-[#1a0d10]',
  ocean: 'bg-[#071018]',
  particles: 'bg-[#0d0b1a]',
  bubbles: 'bg-[#0d0b1a]',
  net: 'bg-[#0d0b1a]',
  matrix: 'bg-[#040d06]',
  dawn: 'bg-[#1a0e2e]',
  dusk: 'bg-[#12081e]',
  galaxy: 'bg-[#080612]',
  fog: 'bg-[#e8e4f0]',
  sand: 'bg-[#f5efe6]',
  parchment: 'bg-[#faf6f0]',
};`
);

// 2. Replace the fixed background glow with a dynamic layered one
code = code.replace(
  `      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>`,
  `      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25' style={{ backgroundColor: color }} />
        <div className='absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10' style={{ backgroundColor: color }} />
        <div className='absolute top-1/2 left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-8' style={{ backgroundColor: color }} />
        {(profile.themeBg === 'fog' || profile.themeBg === 'sand' || profile.themeBg === 'parchment') && (
          <div className='absolute inset-0 bg-gradient-to-b from-white/40 to-transparent' />
        )}
      </div>`
);

// 3. Bigger avatar with pulse ring on load
code = code.replace(
  `          <div className='w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-white' style={{ background: profile.avatar ? undefined : color, boxShadow: '0 0 0 4px ' + color + '30' }}>
            {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName} className='w-full h-full object-cover'  width={48} height={48} /> : initials}
          </div>`,
  `          <div className='relative w-28 h-28 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full animate-ping opacity-20' style={{ backgroundColor: color }} />
            <div className='absolute inset-0 rounded-full opacity-30 scale-110' style={{ boxShadow: '0 0 40px ' + color + '60' }} />
            <div className='relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-white' style={{ background: profile.avatar ? undefined : color, boxShadow: '0 0 0 3px ' + color + '50, 0 0 0 6px ' + color + '20' }}>
              {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName} className='w-full h-full object-cover' width={112} height={112} /> : initials}
            </div>
          </div>`
);

// 4. Warmer name and username display
code = code.replace(
  `          <h1 className='text-2xl font-bold text-white mb-1'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-3 flex-wrap'>
            <p className='text-sm' style={{ color }}>{profile.username}</p>`,
  `          <h1 className='text-3xl font-bold text-white mb-1 tracking-tight'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-3 flex-wrap'>
            <p className='text-sm font-medium opacity-70' style={{ color }}>@{profile.username}</p>`
);

// 5. Social icons — replace text labels with actual SVG icons
code = code.replace(
  `            <div className='flex items-center justify-center gap-3 mb-5'>
              {social.twitter && <a href={'https://twitter.com/' + social.twitter.replace('@','')} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>X</a>}
              {social.github && <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>GH</a>}
              {social.linkedin && <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>in</a>}
              {social.website && <a href={social.website} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'><Globe className='w-3.5 h-3.5 text-white' /></a>}
            </div>`,
  `            <div className='flex items-center justify-center gap-2 mb-5'>
              {social.twitter && (
                <a href={'https://twitter.com/' + social.twitter.replace('@','')} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                  {social.twitter.replace('@','')}
                </a>
              )}
              {social.github && (
                <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                  {social.github}
                </a>
              )}
              {social.linkedin && (
                <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                  {social.linkedin}
                </a>
              )}
              {social.website && (
                <a href={social.website} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <Globe className='w-3 h-3' />
                  Website
                </a>
              )}
            </div>`
);

// 6. Warmer question input label
code = code.replace(
  `          <div className='flex items-start gap-3 mb-6 p-4 rounded-2xl' style={{ backgroundColor: color + '15', border: '1px solid ' + color + '30' }}>
            <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0' style={{ backgroundColor: color + '25' }}>
              <MessageCircle className='w-4 h-4' style={{ color }} />
            </div>
            <p className='text-sm text-white/80 leading-relaxed'>{welcomeMessage}</p>
          </div>`,
  `          <div className='mb-5'>
            <p className='text-xs font-medium mb-3 tracking-wide uppercase opacity-50 text-white'>{profile.displayName?.split(' ')[0] || username} reads every question</p>
            <div className='flex items-start gap-3 p-4 rounded-2xl' style={{ backgroundColor: color + '12', border: '1px solid ' + color + '25' }}>
              <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : initials}
              </div>
              <p className='text-sm text-white/75 leading-relaxed italic'>"{welcomeMessage}"</p>
            </div>
          </div>`
);

// 7. Replace textarea placeholder
code = code.replace(
  `placeholder={'Send ' + (profile.displayName?.split(' ')[0] || username) + ' a question...'}`,
  `placeholder={'What do you want to ask ' + (profile.displayName?.split(' ')[0] || username) + '?'}`
);

// 8. Add CTA footer after ask another question button
code = code.replace(
  `                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    ← Ask something else
                  </button>`,
  `                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    ← Ask something else
                  </button>`
);

// 9. Replace copy link button + add footer CTA
code = code.replace(
  `          <button onClick={copyLink} className='inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors'>
            {copied ? <Check className='w-3 h-3 text-green-500' /> : <Copy className='w-3 h-3' />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>`,
  `          <div className='flex items-center justify-center gap-3'>
            <button onClick={copyLink} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all'>
              {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
              {copied ? 'Copied!' : 'Share this space'}
            </button>
          </div>`
);

// 10. Add footer CTA before closing div
code = code.replace(
  `      </div>
    </div>
  );
}`,
  `        <div className='mt-12 text-center border-t border-white/5 pt-8'>
          <p className='text-xs text-zinc-600 mb-1'>Powered by</p>
          <a href='/' className='text-sm font-bold' style={{ color }}>One Question ✦</a>
          <p className='text-xs text-zinc-600 mt-3'>
            <span className='inline-flex items-center gap-1'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              Want your own space?
            </span>{' '}
            <a href='/sign-up' className='underline hover:text-zinc-400 transition-colors'>Claim yours free →</a>
          </p>
        </div>
      </div>
    </div>
  );
}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
