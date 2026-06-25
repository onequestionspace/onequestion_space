const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Parse new profile fields
code = code.replace(
  `  const welcomeMessage = profile.welcomeMessage || 'Ask me anything about ' + (profile.displayName || username) + '.';`,
  `  const welcomeMessage = profile.welcomeMessage || 'Ask me anything about ' + (profile.displayName || username) + '.';
  const vibeQuote = (profile as Record<string, unknown>).vibeQuote as string || '';
  let spaceLinks: {title: string, url: string}[] = [];
  try { spaceLinks = JSON.parse((profile as Record<string, unknown>).links as string || '[]'); } catch {}
  const pinnedIds = (profile as Record<string, unknown>).pinnedQuestions as string[] || [];`
);

// Add pinned questions query after existing queries
code = code.replace(
  `  const reactions = useQuery(`,
  `  const allQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 50 } : 'skip'
  );
  const pinnedAnswers = allQuestions?.filter(q => q.isAnswered && pinnedIds.includes(q._id)) || [];
  const reactions = useQuery(`
);

// Inject new blocks after share button
code = code.replace(
  `          <div className='flex items-center justify-center gap-3'>
            <button onClick={copyLink} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all'>
              {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
              {copied ? 'Copied!' : 'Share this space'}
            </button>
          </div>`,
  `          <div className='flex items-center justify-center gap-3'>
            <button onClick={copyLink} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all'>
              {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
              {copied ? 'Copied!' : 'Share this space'}
            </button>
          </div>

          {/* Vibe Quote */}
          {vibeQuote && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='mt-6 px-4 py-4 rounded-2xl text-center' style={{ backgroundColor: color + '10', border: '1px solid ' + color + '20' }}>
              <p className='text-sm leading-relaxed italic opacity-80'>&ldquo;{vibeQuote}&rdquo;</p>
            </motion.div>
          )}

          {/* Links */}
          {spaceLinks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <a key={i} href={link.url} target='_blank' rel='noopener noreferrer'
                  className='flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group'>
                  <span className='text-sm font-medium'>{link.title}</span>
                  <ExternalLink className='w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity' />
                </a>
              ))}
            </motion.div>
          )}

          {/* Pinned Answers */}
          {pinnedAnswers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='mt-6'>
              <p className='text-xs font-medium uppercase tracking-widest opacity-40 mb-3 text-center'>Pinned answers</p>
              <div className='space-y-3'>
                {pinnedAnswers.map((q, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden border border-white/8'>
                    <div className='px-4 py-3 bg-white/5'>
                      <p className='text-sm font-medium'>{q.question}</p>
                    </div>
                    <div className='px-4 py-3' style={{ backgroundColor: color + '08' }}>
                      <div className='flex items-center gap-2 mb-1.5'>
                        <div className='w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold shrink-0' style={{ backgroundColor: color }}>
                          {profile.avatar ? <Image src={profile.avatar} alt="" width={16} height={16} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <span className='text-xs opacity-50'>{profile.displayName?.split(' ')[0] || username}</span>
                      </div>
                      <p className='text-xs opacity-70 leading-relaxed'>{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}`
);

// Add ExternalLink to imports
code = code.replace(
  `import { Send, Sparkles, Copy, Check, Globe, MessageCircle } from 'lucide-react';`,
  `import { Send, Sparkles, Copy, Check, Globe, MessageCircle, ExternalLink } from 'lucide-react';`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
