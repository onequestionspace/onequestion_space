'use client';

import { useState, useEffect } from 'react';

const conversations = [
  { role: 'visitor', text: 'What do you do?' },
  { role: 'ai', text: 'I help founders turn their knowledge into an AI assistant that answers questions automatically.' },
  { role: 'visitor', text: 'How can I contact you?' },
  { role: 'ai', text: 'You can reach me at hello@onequestion.space.' },
  { role: 'visitor', text: "What's your pricing?" },
  { role: 'ai', text: 'Free to start. Upgrade when you need more advanced features.' },
];

export function AnimatedDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleMessages >= conversations.length) {
      setTimeout(() => {
        setVisibleMessages(0);
        setTypedText('');
      }, 3000);
      return;
    }

    const current = conversations[visibleMessages];

    if (current.role === 'visitor') {
      setTimeout(() => {
        setVisibleMessages(v => v + 1);
      }, 1000);
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
        setTimeout(() => {
          setVisibleMessages(v => v + 1);
        }, 1500);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [visibleMessages]);

  return (
    <div className="glass rounded-3xl p-6 text-left card-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">AI Conversation Demo</h3>
        <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/20 text-primary-light border border-primary/30">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-3 h-[220px] overflow-hidden flex flex-col justify-end">
        {conversations.slice(0, visibleMessages).map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'visitor'
                ? 'bg-white/5 border border-white/10'
                : 'bg-primary/10 border border-primary/20'
            }`}>
              <p className={`text-xs mb-1 ${msg.role === 'visitor' ? 'text-muted-foreground' : 'text-primary'}`}>
                {msg.role === 'visitor' ? 'Visitor' : 'AI'}
              </p>
              <p className="text-white text-sm">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && visibleMessages < conversations.length && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
              <p className="text-xs text-primary mb-1">AI</p>
              <p className="text-white text-sm">
                {typedText}
                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
