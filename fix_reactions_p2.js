const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// ── 1. Add reactions imports ─────────────────────────────────────────────────
space = space.replace(
  `import { useQuery, useMutation } from 'convex/react';`,
  `import { useQuery, useMutation } from 'convex/react';`
);

// Add api import for reactions
space = space.replace(
  `  const createQuestion = useMutation(api.questions.createQuestion);`,
  `  const createQuestion = useMutation(api.questions.createQuestion);
  const addReaction = useMutation(api.reactions.addReaction);
  const reactions = useQuery(
    api.reactions.getReactions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const [reacted, setReacted] = useState<string | null>(null);
  const visitorId = typeof window !== 'undefined'
    ? (localStorage.getItem('visitor_id') || (() => {
        const id = Math.random().toString(36).slice(2);
        localStorage.setItem('visitor_id', id);
        return id;
      })())
    : 'anon';`
);

// ── 2. Add reaction bar after AI response, before "Ask another question" ─────
space = space.replace(
  `                {!isTyping && aiResponse && (
                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    Ask another question`,
  `                {!isTyping && aiResponse && profile?._id && (
                  <div className='mt-4 p-4 rounded-2xl bg-white/3 border border-white/8'>
                    <p className='text-xs text-zinc-500 mb-3 text-center'>Was this helpful?</p>
                    <div className='flex items-center justify-center gap-3'>
                      {[
                        { emoji: '🔥', label: 'Fire' },
                        { emoji: '❤️', label: 'Love' },
                        { emoji: '🧠', label: 'Insightful' },
                        { emoji: '👏', label: 'Clap' },
                        { emoji: '😮', label: 'Wow' },
                      ].map(({ emoji, label }) => (
                        <button
                          key={emoji}
                          onClick={async () => {
                            if (reacted) return;
                            setReacted(emoji);
                            await addReaction({ profileId: profile._id, emoji, visitorId });
                          }}
                          title={label}
                          className={'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ' + (reacted === emoji ? 'bg-white/10 scale-110' : reacted ? 'opacity-30' : 'hover:bg-white/8 hover:scale-105')}
                        >
                          <span className='text-xl'>{emoji}</span>
                          <span className='text-xs text-zinc-500'>
                            {(reactions?.[emoji] || 0) + (reacted === emoji ? 1 : 0)}
                          </span>
                        </button>
                      ))}
                    </div>
                    {reacted && (
                      <p className='text-xs text-center mt-3' style={{ color }}>
                        Thanks for the reaction!
                      </p>
                    )}
                  </div>
                )}
                {!isTyping && aiResponse && (
                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); setReacted(null); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    Ask another question`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Reaction bar added to space page');
