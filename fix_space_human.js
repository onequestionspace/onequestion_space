const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Add "Joined" + "questions answered" after bio
c = c.replace(
  `          {profile.bio && <p className='text-zinc-400 text-sm max-w-xs mx-auto mb-5 leading-relaxed'>{profile.bio}</p>}`,
  `          {profile.bio && <p className='text-zinc-400 text-sm max-w-xs mx-auto mb-3 leading-relaxed'>{profile.bio}</p>}
          <div className='flex items-center justify-center gap-3 mb-5 flex-wrap'>
            <span className='text-xs text-zinc-600'>
              Joined {new Date(profile._creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            {analytics && analytics.totalQuestions > 0 && (
              <span className='text-xs text-zinc-600'>·</span>
            )}
            {analytics && analytics.totalQuestions > 0 && (
              <span className='text-xs text-zinc-600'>{analytics.totalQuestions} questions answered</span>
            )}
          </div>`
);

// 2. Add share answer row after AI response appears
// Find the copy answer button area and add X share next to it
c = c.replace(
  `              {copiedAnswer ? 'Copied' : 'Copy answer'}`,
  `              {copiedAnswer ? 'Copied ✓' : 'Copy answer'}`
);

// Add X share button next to copy answer button
c = c.replace(
  `              {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
            </button>`,
  `              {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
            </button>
            <a
              href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent('I just asked @' + username + '\\'s AI and got this answer in under 2 seconds. Try it: onequestion.space/' + username)}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all'
            >
              <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
              Share on X
            </a>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
