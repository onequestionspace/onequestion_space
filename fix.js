const fs = require('fs');
let c = fs.readFileSync('components/DashboardAI.tsx', 'utf8');

// 1. Update Mode type
c = c.replace(
  `type Mode = 'assistant' | 'interview';`,
  `type Mode = 'assistant' | 'interview' | 'brain';`
);

// 2. Add brain case to startMode
c = c.replace(
  `    if (newMode === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: 'Hey ' + (profile?.displayName || 'there') + '! I know your space inside out. Ask me anything.',
      }]);
    } else {
      sendInterview([]);
    }`,
  `    if (newMode === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: 'Hey ' + (profile?.displayName || 'there') + '! I know your space inside out. Ask me anything.',
      }]);
    } else if (newMode === 'brain') {
      setMessages([{
        role: 'assistant',
        content: 'Second Brain mode. Dump any thought, idea, note, or link — I will save it to your knowledge base and help you expand on it.',
      }]);
    } else {
      sendInterview([]);
    }`
);

// 3. Add brain handling in send()
c = c.replace(
  `    if (mode === 'interview') {
      await sendInterview(newMessages);
      return;
    }`,
  `    if (mode === 'interview') {
      await sendInterview(newMessages);
      return;
    }

    if (mode === 'brain') {
      try {
        const res = await fetch('/api/dashboard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'brain', messages: newMessages }),
        });
        const data = await res.json();
        setMessages(m => [...m, {
          role: 'assistant',
          content: (data.saved ? '💾 Saved! ' : '') + (data.content || 'Saved to your knowledge base.'),
        }]);
      } catch {
        setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
      }
      setLoading(false);
      return;
    }`
);

// 4. Add Brain button in header
c = c.replace(
  `              <button
                onClick={() => startMode('interview')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ' + (mode === 'interview' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white')}
              >
                <Brain className='w-3 h-3' /> Train
              </button>`,
  `              <button
                onClick={() => startMode('interview')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ' + (mode === 'interview' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white')}
              >
                <Brain className='w-3 h-3' /> Train
              </button>
              <button
                onClick={() => startMode('brain')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all ' + (mode === 'brain' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white')}
              >
                🧠
              </button>`
);

// 5. Update placeholder
c = c.replace(
  `placeholder={mode === 'interview' ? 'Answer the question...' : 'Ask about your space...'}`,
  `placeholder={mode === 'interview' ? 'Answer the question...' : mode === 'brain' ? 'Dump a thought, idea, or note...' : 'Ask about your space...'}`
);

fs.writeFileSync('components/DashboardAI.tsx', c);
console.log('done');
