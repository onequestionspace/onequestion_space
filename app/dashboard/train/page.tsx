'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Send, Loader2, Brain, CheckCircle2 } from 'lucide-react';

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
  const createKnowledge = useMutation(api.knowledge.createKnowledge);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMessages([{ role: 'assistant', content: 'Hi! I am going to help you train your AI. I will ask you a series of questions and turn your answers into knowledge your AI can use. Ready? Here is the first question:\n\n' + QUESTIONS[0] }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
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
    if (!userId) return;
    setSaving(true);
    try {
      const userAnswers = messages
        .filter(m => m.role === 'user')
        .map((m, i) => QUESTIONS[i] + '\n' + m.content)
        .join('\n\n');

      await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'AI Training — Personal Q&A',
          content: userAnswers,
        }),
      });
      setSaved(true);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <DashboardLayout title='Train Your AI' description='Chat with our AI to build your knowledge base automatically.'>
      <div className='max-w-2xl mx-auto'>
        <div className='glass-card rounded-2xl border border-border overflow-hidden'>
          <div className='flex items-center gap-3 px-6 py-4 border-b border-border bg-card'>
            <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
              <Brain className='w-4 h-4 text-primary' />
            </div>
            <div>
              <p className='text-sm font-semibold text-foreground'>AI Trainer</p>
              <p className='text-xs text-muted-foreground'>{qIndex} of {QUESTIONS.length} questions answered</p>
            </div>
            <div className='ml-auto w-24 h-1.5 bg-card rounded-full overflow-hidden border border-border'>
              <div className='h-full bg-primary rounded-full transition-all' style={{ width: (qIndex / QUESTIONS.length * 100) + '%' }} />
            </div>
          </div>

          <div className='h-96 overflow-y-auto p-4 space-y-4'>
            {messages.map((m, i) => (
              <div key={i} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + (m.role === 'user' ? 'bg-primary text-white' : 'glass-card border border-border text-foreground')}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className='flex justify-start'>
                <div className='glass-card border border-border px-4 py-3 rounded-2xl flex gap-1'>
                  {[0,1,2].map(i => <div key={i} className='w-2 h-2 rounded-full bg-primary animate-bounce' style={{ animationDelay: i*150 + 'ms' }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!done ? (
            <div className='flex items-center gap-3 px-4 py-3 border-t border-border bg-card'>
              <input
                type='text'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder='Type your answer...'
                className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none'
                autoFocus
              />
              <button onClick={send} disabled={loading || !input.trim()} className='w-8 h-8 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40'>
                <Send className='w-3.5 h-3.5 text-white' />
              </button>
            </div>
          ) : (
            <div className='px-4 py-4 border-t border-border bg-card'>
              {saved ? (
                <div className='flex items-center gap-2 text-green-500 text-sm font-medium'>
                  <CheckCircle2 className='w-4 h-4' /> Saved to knowledge base! Your AI is now trained.
                </div>
              ) : (
                <button
                  onClick={saveToKnowledge}
                  disabled={saving}
                  className='w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink text-white text-sm font-bold flex items-center justify-center gap-2'
                >
                  {saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Brain className='w-4 h-4' />}
                  Save to Knowledge Base
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}