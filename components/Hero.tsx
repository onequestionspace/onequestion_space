'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Check, MessageCircleQuestion, Sparkles } from 'lucide-react';

const examples = [
  { question: 'What do you help people with?', answer: 'I help people turn ideas into clear, useful outcomes. Add your own bio, services, projects, and FAQs so your page can answer with your real experience.' },
  { question: 'How can we work together?', answer: 'Share your services, ideal projects, process, and booking link in your knowledge. Visitors can get the basics first, then follow your preferred next step.' },
  { question: 'What makes your approach different?', answer: 'Teach your page what you believe, how you work, and examples of your work. Answers should reflect the information you provide—not invented credentials.' },
];

export function Hero() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [activeExample, setActiveExample] = useState(0);

  const createPage = () => {
    if (isSignedIn) { router.push('/dashboard'); return; }
    const requestedUsername = username.trim().toLowerCase();
    router.push('/sign-up' + (requestedUsername ? '?username=' + encodeURIComponent(requestedUsername) : ''));
  };

  return (
    <section className="relative px-4 pb-20 pt-28 text-black sm:pb-28 sm:pt-36">
      <div className="nest-lines pointer-events-none absolute right-0 top-0 h-[34rem] w-[46%] opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 border border-zinc-200 bg-white/80 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Your knowledge, ready to answer
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-7xl">
              Stop repeating yourself.
              <br />
              <span className="editorial-underline">Share one smart link.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Build a personal AI page that answers questions about your work, services, projects, and expertise using knowledge you provide. Share it with clients, followers, or your community.
            </p>
            <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="flex h-12 min-w-0 flex-1 items-center rounded-lg border border-zinc-200 bg-white px-4 text-left focus-within:border-zinc-500">
                <span className="shrink-0 text-sm text-zinc-500">onequestion.space/</span>
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') createPage(); }} aria-label="Choose your page username" placeholder="yourname" className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-zinc-400" />
              </div>
              <button onClick={createPage} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                Create your page <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
              {['Start free', 'No credit card to start', 'You control the knowledge'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />{item}</span>
              ))}
            </div>
          </div>

          <div className="home-card overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-[0_24px_80px_rgba(0,0,0,0.07)]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white"><Sparkles className="h-4 w-4" /></div>
                <div><p className="text-sm font-semibold">A page that knows your work</p><p className="text-xs text-zinc-500">Illustrative product example</p></div>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-800">Sample</span>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Try a sample question</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button key={example.question} onClick={() => setActiveExample(index)} aria-pressed={activeExample === index} className={(activeExample === index ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400') + ' rounded-full border px-3 py-2 text-xs transition-colors'}>
                    {example.question}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2 text-sm font-medium text-zinc-900"><MessageCircleQuestion className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />{examples[activeExample].question}</div>
                <div className="mt-3 rounded-lg bg-white p-4 text-sm leading-6 text-zinc-600">{examples[activeExample].answer}</div>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-zinc-500">This is sample copy, not a live AI response. Your own page uses the knowledge you add; test it before you share it.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
