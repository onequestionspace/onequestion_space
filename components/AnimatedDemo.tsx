'use client';

import { useState, useEffect } from 'react';

const conversations = [
  { role: 'visitor', text: 'What services do you offer?' },
  { role: 'ai', text: 'I offer 1-on-1 coaching, online courses, and consulting for early-stage founders.' },
  { role: 'visitor', text: 'How much does coaching cost?' },
  { role: 'ai', text: 'Coaching starts at $200/month. I also offer a free 30-min discovery call.' },
  { role: 'visitor', text: 'How do I book a call?' },
  { role: 'ai', text: 'Head to onequestion.space/asym and submit your question. I respond within 24hrs.' },
];

export function AnimatedDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleMessages >= conversations.length) {
      setTimeout(() => { setVisibleMessages(0); setTypedText(''); }, 3000);
      return;
    }
    const current = conversations[visibleMessages];
    if (current.role === 'visitor') {
      setTimeout(() => setVisibleMessages(v => v + 1), 1200);
      return;
    }
    setIsTyping(true);
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      i++;
      setTypedText(current.text.slice(0, i));
      if (i >= current.text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setVisibleMessages(v => v + 1), 1500);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [visibleMessages]);

  return (
    <div className="glass rounded-2xl p-4 text-left border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-white">Live Demo</p>
        <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          AI Active
        </span>
      </div>
      <div className="h-[200px] overflow-hidden flex flex-col justify-end space-y-2">
        {conversations.slice(0, visibleMessages).map((msg, i) => (
          <div key={i} className={msg.role === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={msg.role === 'visitor' ? 'max-w-[80%] rounded-2xl px-3 py-2 bg-white/10 border border-white/10' : 'max-w-[80%] rounded-2xl px-3 py-2 bg-primary/20 border border-primary/20'}>
              <p className={msg.role === 'visitor' ? 'text-xs mb-0.5 text-muted-foreground' : 'text-xs mb-0.5 text-primary'}>
                {msg.role === 'visitor' ? 'Visitor' : 'AI'}
              </p>
              <p className="text-white text-xs leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-primary/20 border border-primary/20 rounded-2xl px-3 py-2">
              <p className="text-xs text-primary mb-0.5">AI</p>
              <p className="text-white text-xs leading-relaxed">
                {typedText}
                <span className="inline-block w-0.5 h-3 bg-primary ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}