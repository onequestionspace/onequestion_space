const fs = require('fs');

// ── 1. Fix convex/reactions.ts — use string keys not emojis ─────────────────
fs.writeFileSync('convex/reactions.ts', `import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getReactions = query({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query('reactions')
      .withIndex('by_profileId', (q) => q.eq('profileId', args.profileId))
      .collect();

    const counts: Record<string, number> = {
      fire: 0,
      love: 0,
      brain: 0,
      clap: 0,
      wow: 0,
    };
    for (const r of reactions) {
      if (r.emoji in counts) counts[r.emoji]++;
    }
    return counts;
  },
});

export const addReaction = mutation({
  args: {
    profileId: v.id('profiles'),
    emoji: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_profileId_emoji', (q) =>
        q.eq('profileId', args.profileId).eq('emoji', args.emoji)
      )
      .filter((q) => q.eq(q.field('visitorId'), args.visitorId))
      .first();

    if (existing) return { alreadyReacted: true };

    await ctx.db.insert('reactions', {
      profileId: args.profileId,
      emoji: args.emoji,
      visitorId: args.visitorId,
      createdAt: Date.now(),
    });
    return { alreadyReacted: false };
  },
});
`);
console.log('✓ Fixed reactions.ts — string keys instead of emojis');

// ── 2. Fix space page — use string keys to look up counts ────────────────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `        { emoji: '🔥', label: 'Fire' },
                        { emoji: '❤️', label: 'Love' },
                        { emoji: '🧠', label: 'Insightful' },
                        { emoji: '👏', label: 'Clap' },
                        { emoji: '😮', label: 'Wow' },`,
  `        { emoji: '🔥', key: 'fire', label: 'Fire' },
                        { emoji: '❤️', key: 'love', label: 'Love' },
                        { emoji: '🧠', key: 'brain', label: 'Insightful' },
                        { emoji: '👏', key: 'clap', label: 'Clap' },
                        { emoji: '😮', key: 'wow', label: 'Wow' },`
);

space = space.replace(
  `].map(({ emoji, label }) => (
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
                        </button>`,
  `].map(({ emoji, key, label }) => (
                        <button
                          key={key}
                          onClick={async () => {
                            if (reacted) return;
                            setReacted(key);
                            await addReaction({ profileId: profile._id, emoji: key, visitorId });
                          }}
                          title={label}
                          className={'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ' + (reacted === key ? 'bg-white/10 scale-110' : reacted ? 'opacity-30' : 'hover:bg-white/8 hover:scale-105')}
                        >
                          <span className='text-xl'>{emoji}</span>
                          <span className='text-xs text-zinc-500'>
                            {(reactions?.[key] || 0) + (reacted === key ? 1 : 0)}
                          </span>
                        </button>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed space page reaction keys');
