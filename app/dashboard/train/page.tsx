'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Send, Loader2, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/dashboard/Button';

interface Message { role: 'user' | 'assistant'; content: string; }

const QUESTIONS = [
  'What is your full name and what do you do?',
  'Where are you based and what is your background?',
  'What are you currently building or working on?',
  'What problems do you solve for people?',
  'How can people contact you or work with you?',
  'What are your top skills or expertise areas?',
  'What are some frequently asked questions you get?',
  'What makes you unique or different from others in your field?',
];



export default function TrainPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setMessages([{ role: 'assistant', content: 'Hi! I am going to help you train your AI. I will ask you a series of questions and turn your answers into knowledge your AI can use. Ready? Here is the first question:\n\n' + QUESTIONS[0] }]), 0);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const nextIndex = qIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      setTimeout(() => {
        setMessages(m => [...m, { role: 'assistant', content: 'Got it! Next question:\n\n' + QUESTIONS[nextIndex] }]);
        setQIndex(nextIndex);
        setLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        setMessages(m => [...m, { role: 'assistant', content: 'Amazing! I have collected all your answers. Tap Save to Knowledge Base to train your AI now.' }]);
        setDone(true);
        setLoading(false);
      }, 800);
    }
  };

  const saveToKnowledge = async () => {
    if (!userId) { alert('Not signed in'); return; }
    setSaving(true);
    try {
      const userAnswers = messages
        .filter(m => m.role === 'user')
        .map((m, i) => QUESTIONS[i] + '\n' + m.content)
        .join('\n\n');

      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'AI Training — Personal Q&A',
          content: userAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Save failed: ' + (data.error || res.status));
        setSaving(false);
        return;
      }
      setSaved(true);
    } catch (e) {
      alert('Network error: ' + e);
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="Train Your AI" description="Chat with our AI to build your knowledge base automatically.">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">AI Trainer</p>
              <p className="text-xs text-zinc-500">{qIndex} of {QUESTIONS.length} questions answered</p>
            </div>
            <div className="ml-auto w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: (qIndex / QUESTIONS.length * 100) + '%' }} />
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + (
                  m.role === 'user'
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/[0.03] border border-white/[0.06] text-zinc-300'
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.03] border border-white/[0.06] px-4 py-3 rounded-2xl flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: i*150 + 'ms' }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!done ? (
            <div className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type your answer..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                autoFocus
              />
              <button onClick={send} disabled={loading || !input.trim()} className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center disabled:opacity-40 transition-opacity active:scale-95">
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 border-t border-white/[0.06] bg-white/[0.02]">
              {saved ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Saved to knowledge base! Your AI is now trained.
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={saveToKnowledge}
                  loading={saving}
                  icon={<Brain className="w-4 h-4" />}
                >
                  Save to Knowledge Base
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
