'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, BookOpen, Sparkles, Brain, Zap, Users, Code } from 'lucide-react';

const TOPICS = [
  { icon: Brain, label: 'AI & Knowledge', q: 'How does One Question use AI to answer questions?' },
  { icon: Code, label: 'Building in Public', q: 'How is One Question being built?' },
  { icon: Zap, label: 'Bootstrapping', q: 'What does it mean to bootstrap a startup?' },
  { icon: Users, label: 'For Creators', q: 'How can creators use One Question?' },
];

const SUGGESTED = [
  'How does One Question work?',
  'What is building in public?',
  'How to bootstrap a startup with no money?',
  'What is a personal AI knowledge space?',
  'How to grow an audience as a founder?',
  'What tools do you use to build One Question?',
];

export default function BlogPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to the One Question Knowledge Explorer. Ask me anything about AI, building in public, bootstrapping, or how One Question works.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (q) => {
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, username: 'onequestion_team', context: 'blog_knowledge_base' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Great question. I am still learning. Try asking something else.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="glass rounded-2xl p-6 border border-white/10 text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Knowledge Explorer</h1>
            <p className="text-muted-foreground text-sm mb-3">Ask anything about One Question, AI, building in public and bootstrapping.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {TOPICS.map((t, i) => {
              const Icon = t.icon;
              return (
                <button key={i} onClick={() => handleSubmit(t.q)} className="glass rounded-xl p-3 border border-white/10 text-left hover:border-primary/30 transition-all group">
                  <Icon className="w-4 h-4 text-primary mb-2" />
                  <p className="text-white text-xs font-medium">{t.label}</p>
                </button>
              );
            })}
          </div>

          <div className="glass rounded-2xl border border-white/10 mb-4 overflow-hidden">
            <div className="p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user' ? 'max-w-[80%] bg-primary/20 border border-primary/20 rounded-2xl px-4 py-2' : 'max-w-[80%] bg-white/5 border border-white/10 rounded-2xl px-4 py-2'}>
                    <p className={'text-xs mb-1 ' + (msg.role === 'user' ? 'text-primary' : 'text-muted-foreground')}>{msg.role === 'user' ? 'You' : 'Knowledge AI'}</p>
                    <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-muted-foreground text-xs mb-1">Knowledge AI</p>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'0ms'}} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'150ms'}} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'300ms'}} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3 flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(question)}
                placeholder="Ask anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={() => handleSubmit(question)}
                disabled={loading || !question.trim()}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-pink flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-muted-foreground mb-3">Popular questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => handleSubmit(q)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}