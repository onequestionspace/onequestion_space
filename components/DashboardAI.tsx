'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Bot, X, Send, Loader2, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Mode = 'assistant' | 'interview' | 'brain';

export function DashboardAI() {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('assistant');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveReady, setSaveReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const profile = useQuery(api.profiles.current);
  const analytics = useQuery(api.analytics.getAnalytics, profile?._id ? { profileId: profile._id } : 'skip');
  const questions = useQuery(api.questions.getRecentQuestions, profile?._id ? { profileId: profile._id, limit: 10 } : 'skip');
  const knowledgeCount = useQuery(api.knowledge.getKnowledgeCount, userId ? { userId } : 'skip');
  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const startMode = (newMode: Mode) => {
    setMode(newMode);
    setMessages([]);
    setSaveReady(false);
    setSaved(false);
    if (newMode === 'assistant') {
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
    }
  };

  useEffect(() => {
    if (open && messages.length === 0 && profile) {
      setMessages([{
        role: 'assistant',
        content: 'Hey ' + (profile?.displayName || 'there') + '! I know your space inside out. Ask me anything.',
      }]);
    }
  }, [open, profile, messages.length]);

  const buildContext = () => {
    const parts: string[] = [];
    if (profile) {
      parts.push('PROFILE: ' + profile.displayName + ' (@' + profile.username + ')');
      if (profile.bio) parts.push('Bio: ' + profile.bio);
    }
    if (analytics) {
      parts.push('ANALYTICS: ' + analytics.totalQuestions + ' questions, ' + analytics.totalVisitors + ' visitors');
    }
    if (subscription) {
      parts.push('PLAN: ' + subscription.plan + ' — ' + subscription.messagesUsed + '/' + subscription.messagesLimit + ' credits used');
    }
    if (knowledgeCount) parts.push('KNOWLEDGE: ' + knowledgeCount + ' items');
    if (questions && questions.length > 0) {
      parts.push('RECENT QUESTIONS:');
      questions.slice(0, 5).forEach((q: any) => parts.push('- ' + q.question));
    }
    return parts.join('\n');
  };

  const sendInterview = async (msgs: Message[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'interview', messages: msgs }),
      });
      const data = await res.json();
      let content: string = data.content || 'Tell me more about yourself.';

      if (content.includes('SAVE_READY')) {
        content = content.replace('SAVE_READY', '').trim() ||
          "Great — I've learned a lot about you! Tap Save to Knowledge Base to train your AI with everything you shared.";
        setSaveReady(true);
      }

      setMessages(m => [...m, { role: 'assistant', content }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    if (mode === 'interview') {
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
    }

    // Assistant mode
    try {
      const context = buildContext();
      const system = 'You are a smart assistant for One Question. Help this user grow their audience, improve their knowledge base, and understand their analytics. Be concise and actionable.\n\nUSER CONTEXT:\n' + context;
      const res = await fetch('/api/dashboard-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, system }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.content || 'Something went wrong.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    }
    setLoading(false);
  };

  const saveToKnowledge = async () => {
    setSaving(true);
    try {
      // Save all user answers with their preceding AI questions
      const pairs: Array<{ question: string; answer: string }> = [];
      for (let i = 0; i < messages.length - 1; i++) {
        if (messages[i].role === 'assistant' && messages[i + 1]?.role === 'user') {
          pairs.push({ question: messages[i].content, answer: messages[i + 1].content });
        }
      }

      await Promise.all(pairs.map(pair =>
        fetch('/api/dashboard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'save', question: pair.question, answer: pair.answer }),
        })
      ));

      setSaved(true);
      setMessages(m => [...m, {
        role: 'assistant',
        content: 'Your answers have been saved to your knowledge base. Your AI now knows you better!',
      }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Save failed. Try again.' }]);
    }
    setSaving(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className='fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-110 transition-all'
        title='AI Assistant'
      >
        {open ? <X className='w-5 h-5' /> : <Bot className='w-5 h-5' />}
      </button>

      {open && (
          <div className='fixed bottom-20 right-6 z-50 w-80 h-[28rem] rounded-2xl border border-white/[0.06] flex flex-col overflow-hidden shadow-2xl bg-card'>

          {/* Header */}
          <div className='flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/40'>
            <div className='w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center'>
              <Sparkles className='w-3 h-3 text-amber-500' />
            </div>
            <span className='text-sm font-semibold text-white'>AI Assistant</span>
            <div className='ml-auto flex gap-1'>
              <button
                onClick={() => startMode('assistant')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all ' + (mode === 'assistant' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white')}
              >
                Chat
              </button>
              <button
                onClick={() => startMode('interview')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ' + (mode === 'interview' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white')}
              >
                <Brain className='w-3 h-3' /> Train
              </button>
              <button
                onClick={() => startMode('brain')}
                className={'text-xs px-2 py-0.5 rounded-lg transition-all ' + (mode === 'brain' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white')}
              >
                🧠
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-3 space-y-3'>
            {messages.map((m, i) => (
              <div key={i} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={'max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ' + (m.role === 'user' ? 'bg-primary text-black' : 'bg-card border border-white/[0.06] text-white')}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className='flex justify-start'>
                <div className='px-3 py-2 rounded-xl border border-white/[0.06] flex gap-1 bg-card'>
                  {[0,1,2].map(i => <div key={i} className='w-1.5 h-1.5 rounded-full bg-primary animate-bounce' style={{ animationDelay: i*150 + 'ms' }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Bot className="w-10 h-10 text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-600 font-medium mb-1">Ask me anything about your space</p>
              <p className="text-xs text-zinc-700">I can help with analytics, content ideas, and more.</p>
            </div>
          )}
          </div>

          {/* Save button */}
          {saveReady && !saved && (
            <div className='px-3 py-2 border-t border-white/10'>
              <button
                onClick={saveToKnowledge}
                disabled={saving}
                className='w-full py-2 rounded-xl bg-primary text-black text-xs font-bold flex items-center justify-center gap-2'
              >
                {saving ? <Loader2 className='w-3 h-3 animate-spin' /> : <Brain className='w-3 h-3' />}
                {saving ? 'Saving...' : 'Save to Knowledge Base'}
              </button>
            </div>
          )}

          {saved && (
            <div className='px-3 py-2 border-t border-white/10 flex items-center gap-2 text-green-400 text-xs'>
              <CheckCircle2 className='w-3 h-3' /> Saved! Your AI knows you better now.
            </div>
          )}

          {/* Input */}
          <div className='flex items-center gap-2 px-3 py-2 border-t border-white/[0.06] bg-card'>
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={mode === 'interview' ? 'Answer the question...' : mode === 'brain' ? 'Dump a thought, idea, or note...' : 'Ask about your space...'}
              className='flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none'
            />
            <button onClick={send} disabled={loading || !input.trim()} className='text-primary hover:opacity-70 transition-opacity disabled:opacity-30'>
              {loading ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Send className='w-3.5 h-3.5' />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
