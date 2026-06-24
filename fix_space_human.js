const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Remove Brain import since we're replacing it
code = code.replace(`import { Send, Brain, Sparkles, Copy, Check, XIcon, GitBranch, Globe, ExternalLink } from 'lucide-react';`,
  `import { Send, Sparkles, Copy, Check, Globe, MessageCircle } from 'lucide-react';`);

// 2. Remove "Press Cmd+Enter to submit" 
code = code.replace(
  `                <p className='text-center text-xs text-zinc-600 mt-3'>Press Cmd+Enter to submit</p>`,
  ``
);

// 3. Replace cold textarea placeholder and Ask Question button label
code = code.replace(
  `placeholder='What would you like to know?'`,
  `placeholder={'Send ' + (profile.displayName?.split(' ')[0] || username) + ' a question...'}`
);

code = code.replace(
  `<Send className='w-4 h-4' /> Ask Question`,
  `<Send className='w-4 h-4' /> Send`
);

// 4. Replace "You asked" bubble with cleaner version
code = code.replace(
  `                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-xs text-zinc-500 mb-1'>You asked</p>
                    <p className='text-sm text-white leading-relaxed'>{question}</p>
                  </div>
                </div>`,
  `                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-sm text-white leading-relaxed'>{question}</p>
                  </div>
                </div>`
);

// 5. Replace Brain icon in typing indicator with avatar initial
code = code.replace(
  `                    <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: color + '25' }}>
                      <Brain className='w-4 h-4' style={{ color }} />
                    </div>`,
  `                    <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0' style={{ backgroundColor: color }}>
                      {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : initials}
                    </div>`
);

// 6. Replace Brain icon in response header with avatar
code = code.replace(
  `                      <div className='flex items-center gap-2'>
                        <Brain className='w-4 h-4' style={{ color }} />
                        <span className='text-xs font-medium' style={{ color }}>{profile.displayName || username} replied</span>
                      </div>`,
  `                      <div className='flex items-center gap-2'>
                        <div className='w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                          {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : initials}
                        </div>
                        <span className='text-xs font-medium text-zinc-400'>{profile.displayName?.split(' ')[0] || username}</span>
                      </div>`
);

// 7. Remove entire reaction bar
code = code.replace(
  `                {!isTyping && aiResponse && profile?._id && !aiResponse.includes("knowledge base content yet") && (
                  <div className='mt-4 p-4 rounded-2xl bg-white/3 border border-white/8'>
                    <p className='text-xs text-zinc-500 mb-3 text-center'>Was this helpful?</p>
                    <div className='flex items-center justify-center gap-3'>
                      {[
                        { emoji: '🔥', key: 'fire', label: 'Fire' },
                        { emoji: '❤️', key: 'love', label: 'Love' },
                        { emoji: '🧠', key: 'brain', label: 'Insightful' },
                        { emoji: '👏', key: 'clap', label: 'Clap' },
                        { emoji: '😮', key: 'wow', label: 'Wow' },
                      ].map(({ emoji, key, label }) => (
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
                        </button>
                      ))}
                    </div>
                    {reacted && (
                      <p className='text-xs text-center mt-3' style={{ color }}>
                        Thanks for the reaction!
                      </p>
                    )}
                  </div>
                )}`,
  ``
);

// 8. Replace "Ask another question" with warmer copy
code = code.replace(
  `onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); setReacted(null); }}`,
  `onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }}`
);
code = code.replace(
  `                    Ask another question`,
  `                    ← Ask something else`
);

// 9. Replace Sparkles icon in welcome box with MessageCircle — feels more like a person
code = code.replace(
  `              <Sparkles className='w-4 h-4' style={{ color }} />`,
  `              <MessageCircle className='w-4 h-4' style={{ color }} />`
);

// 10. Better error handling for AI not responding
code = code.replace(
  `      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username }),
      });
      const data = await res.json();
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'I am thinking through your question.');`,
  `      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'Give me a moment — try asking again.');`
);

code = code.replace(
  `    } catch {
      setAiResponse('Something went wrong. Please try again.');
    }`,
  `    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        setAiResponse('Taking longer than usual. Please try again.');
      } else {
        setAiResponse('Something went wrong. Please try again.');
      }
    }`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
