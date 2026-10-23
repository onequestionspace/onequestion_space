'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Conversation = {
  question: string;
  answer: string;
};

function getVisitorId() {
  let visitorId = localStorage.getItem('oq_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('oq_visitor_id', visitorId);
  }
  return visitorId;
}

export default function SpacePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [question, setQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const profile = useQuery(api.profiles.byUsername, { username });
  const isProPlan = useQuery(
    api.subscriptions.isProPlan,
    profile?._id ? { profileId: profile._id } : 'skip'
  );

  useEffect(() => {
    if (!profile?._id) return;

    const visitedKey = `visited_${profile._id}`;
    const lastVisit = Number(localStorage.getItem(visitedKey) || 0);
    const now = Date.now();
    if (!lastVisit || now - lastVisit > 86400000) {
      void fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile._id }),
      }).then((response) => {
        if (!response.ok) throw new Error('Visitor tracking request failed');
      }).catch((visitError) => {
        console.error('Could not record space visitor:', visitError);
      });
      localStorage.setItem(visitedKey, String(now));
    }
    void fetch('/api/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: '/' + username,
        visitorId: getVisitorId(),
        referrer: document.referrer || undefined,
      }),
    }).then((response) => {
      if (!response.ok) throw new Error('Pageview tracking request failed');
    }).catch((trackingError) => {
      console.error('Could not record space pageview:', trackingError);
    });
  }, [profile?._id, username]);

  const handleSubmit = async () => {
    const questionToAsk = question.trim();
    if (!questionToAsk || isLoading) return;

    setQuestion('');
    setCurrentQuestion(questionToAsk);
    setAnswer('');
    setError('');
    setIsLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToAsk,
          username,
          visitorId: getVisitorId(),
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        setError('This page has reached its monthly answer limit.');
        return;
      }
      if (!response.ok || !response.body) {
        setError('We could not get an answer right now. Please try again.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullAnswer += decoder.decode(value, { stream: true });
        setAnswer(fullAnswer);
      }
      fullAnswer += decoder.decode();
      setAnswer(fullAnswer);
      if (fullAnswer.trim()) {
        setConversation((previous) => [...previous, { question: questionToAsk, answer: fullAnswer.trim() }]);
      }
      setCurrentQuestion('');
      setAnswer('');
    } catch (requestError) {
      console.error('Could not submit question:', requestError);
      setError(requestError instanceof Error && requestError.name === 'AbortError'
        ? 'The answer is taking longer than expected. Please try again.'
        : 'Connection error. Please try again.');
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  if (profile === undefined) {
    return <main className="flex min-h-screen items-center justify-center bg-white px-4 text-sm text-zinc-500">Loading page…</main>;
  }
  if (profile === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-black">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-zinc-500">This OneQuestion page does not exist.</p>
          <Link href="/sign-up" className="mt-6 inline-flex h-11 items-center rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800">
            Create your page
          </Link>
        </div>
      </main>
    );
  }

  const displayName = profile.displayName || profile.username;

  return (
    <main className="nest-background relative min-h-screen overflow-hidden px-5 text-black sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
        <header className="flex h-16 items-center">
          {isProPlan === false && (
            <Link href="/" className="text-sm font-semibold tracking-tight">OneQuestion</Link>
          )}
        </header>

        <section className="relative flex flex-1 flex-col items-center pt-[12vh] pb-16 text-center sm:pt-[15vh]">
          <div className="space-avatar-orbit mb-7">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt=""
                width={104}
                height={104}
                unoptimized
                className="h-24 w-24 rounded-full border border-zinc-200 object-cover sm:h-[104px] sm:w-[104px]"
              />
            ) : (
              <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-3xl font-medium tracking-tight text-zinc-700 sm:h-[104px] sm:w-[104px]">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{displayName}</h1>

          <div className="space-askbar mt-8 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-2 text-left">
            <textarea
              id="question-input"
              value={question}
              onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              rows={2}
              maxLength={500}
              placeholder={`Ask ${displayName} anything…`}
              aria-label={`Ask ${displayName} a question`}
              disabled={isLoading}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 outline-none placeholder:text-zinc-400 disabled:opacity-60"
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-xs text-zinc-400">Ask about {displayName}&apos;s work</span>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!question.trim() || isLoading}
                aria-label="Send question"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex w-full max-w-2xl flex-wrap justify-center gap-2" aria-label="Suggested questions">
            {['What do you make?', 'How can you help?', 'What should I read first?'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
                disabled={isLoading}
                className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {error && <p role="alert" className="mt-4 max-w-lg text-sm text-zinc-600">{error}</p>}

          {(currentQuestion || conversation.length > 0) && (
            <section aria-label="Conversation" className="mt-8 w-full max-w-2xl space-y-6 text-left">
              {[...conversation, ...(currentQuestion ? [{ question: currentQuestion, answer }] : [])].map((item, index) => (
                <article key={`${index}-${item.question}`} className="border-t border-zinc-200 pt-5">
                  <h2 className="text-sm font-medium leading-6">{item.question}</h2>
                  {item.answer ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-600">{item.answer}</p>
                  ) : isLoading ? (
                    <p aria-live="polite" className="mt-3 text-sm text-zinc-500">Thinking…</p>
                  ) : null}
                </article>
              ))}
            </section>
          )}
        </section>

        {!isProPlan && (
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 py-6 text-xs text-zinc-500 sm:flex-row">
            <span>Powered by OneQuestion</span>
            <Link href="/sign-up" className="font-medium text-zinc-700 hover:text-black">Create your own page <span aria-hidden="true">→</span></Link>
          </footer>
        )}
      </div>
    </main>
  );
}
