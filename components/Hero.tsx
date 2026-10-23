'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';
import { MessageCircleQuestion } from 'lucide-react';

export function Hero() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');

  const createPage = () => {
    if (isSignedIn) {
      router.push('/dashboard');
      return;
    }

    const requestedUsername = username.trim().toLowerCase();
    router.push('/sign-up' + (requestedUsername
      ? '?username=' + encodeURIComponent(requestedUsername)
      : ''));
  };

  return (
    <section className="relative px-4 pb-24 pt-32 text-black sm:pb-32 sm:pt-40">
      <div className="nest-lines pointer-events-none absolute right-0 top-0 h-[34rem] w-[46%] opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl text-left">
        <div className="mb-8 inline-flex items-center gap-2 border border-zinc-200 bg-white/70 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-fuchsia-500" aria-hidden="true" />
          OneQuestion / personal knowledge pages
        </div>
        <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl md:text-[6.5rem]">
          Make your work
          <br />
          <span className="editorial-underline">easy to find.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Turn your knowledge into a personal AI page that answers questions about you, your work and your expertise — 24/7.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 sm:flex-row">
          <div className="flex h-12 w-full items-center rounded-lg border border-zinc-200 bg-white px-4 text-left focus-within:border-zinc-500">
            <span className="shrink-0 text-sm text-zinc-500">onequestion.space/</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') createPage();
              }}
              aria-label="Choose your page username"
              placeholder="yourname"
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-zinc-400"
            />
          </div>
          <button
            onClick={createPage}
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:w-auto"
          >
            Create your page
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="home-card mt-20 grid max-w-5xl overflow-hidden rounded-[1.25rem] text-left sm:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center border-b border-zinc-200 p-7 sm:border-b-0 sm:border-r sm:p-10">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">A better way to answer</p>
            <p className="mt-3 text-xl font-medium leading-8 tracking-tight text-zinc-900 sm:text-2xl">
              Instead of explaining your work in DMs, send your OneQuestion.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              One link gives people a place to ask, and your knowledge does the answering.
            </p>
          </div>
          <div className="bg-zinc-50 p-5 sm:p-7">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold">Y</div>
                <div>
                  <p className="text-sm font-medium">Your name</p>
                  <p className="text-xs text-zinc-500">Personal page · onequestion.space/yourname</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-zinc-500">ASK ABOUT MY WORK</p>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-3 text-sm text-zinc-400">
                <MessageCircleQuestion className="h-4 w-4 shrink-0" />
                What would you like to know?
              </div>
              <div className="mt-3 flex justify-end">
                <span className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white">Ask</span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-500">A simple page, ready whenever they are.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
