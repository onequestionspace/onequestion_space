'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ArrowUpRight, Check, Copy, MessageSquare, Users, Zap, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const ensureSubscription = useMutation(api.subscriptions.getOrCreateSubscription);
  const ensureAnalytics = useMutation(api.analytics.getOrCreateAnalytics);
  const analytics = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const mostAsked = useQuery(
    api.questions.getMostAskedQuestions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const unanswered = useQuery(
    api.questions.getUnansweredQuestions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const knowledgeCount = useQuery(
    api.knowledge.getKnowledgeCount,
    userId ? { userId } : 'skip'
  );
  const subscription = useQuery(
    api.subscriptions.getSubscription,
    userId ? { userId } : 'skip'
  );

  useEffect(() => {
    if (profile === null && isSignedIn) {
      void createProfile({}).catch((error) => console.error('Could not create profile:', error));
    }
  }, [profile, isSignedIn, createProfile]);

  useEffect(() => {
    if (profile?._id && analytics === null) {
      void ensureAnalytics({ profileId: profile._id }).catch((error) => console.error('Could not create analytics:', error));
    }
  }, [profile?._id, analytics, ensureAnalytics]);

  useEffect(() => {
    if (userId && subscription === null) {
      void ensureSubscription({ userId }).catch((error) => console.error('Could not create subscription:', error));
    }
  }, [userId, subscription, ensureSubscription]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-white p-8 text-sm text-zinc-500">Loading your page…</div>;
  }
  if (!isSignedIn) redirect('/');

  const username = profile?.username;
  const pageUrl = username ? `https://onequestion.space/${username}` : '';
  const isLoading = profile === undefined || analytics === undefined || mostAsked === undefined
    || knowledgeCount === undefined || subscription === undefined;
  const planLimit = subscription?.messagesLimit ?? 50;
  const used = subscription?.messagesUsed ?? 0;
  const remaining = Math.max(0, planLimit - used);
  const pendingCount = unanswered?.length ?? 0;

  const copyPageLink = async () => {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Could not copy page link:', error);
    }
  };

  return (
    <DashboardLayout
      title={profile?.displayName ? `Your page, ${profile.displayName}` : 'Your page'}
      description="Share one link. Let your knowledge answer."
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {(() => {
          const hasProfile = Boolean(profile?.bio?.trim());
          const hasKnowledge = (knowledgeCount ?? 0) > 0;
          // Visitor activity is not proof that the owner has tested the public page.
          // Keep this step actionable until we have explicit test-completion tracking.
          const hasQuestionActivity = false;
          const completed = [hasProfile, hasKnowledge, hasQuestionActivity, Boolean(pageUrl)].filter(Boolean).length;
          const steps = [
            { done: hasProfile, title: 'Complete your introduction', detail: 'Tell visitors who you help and what you do.', href: '/dashboard/settings', action: 'Edit profile' },
            { done: hasKnowledge, title: 'Add your knowledge', detail: 'Add services, FAQs, examples, or project details.', href: '/dashboard/knowledge', action: 'Add knowledge' },
            { done: hasQuestionActivity, title: 'Test with a real question', detail: 'Ask a question on your public page and check the answer before sharing it widely.', href: pageUrl || '/dashboard/chat', action: 'Test page' },
            { done: Boolean(pageUrl), title: 'Share your page', detail: 'Put your link where clients or followers can find it.', href: pageUrl || '/dashboard/settings', action: 'Open page' },
          ];
          return (
            <section className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6" aria-labelledby="setup-checklist-title">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Your next steps</p>
                  <h2 id="setup-checklist-title" className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">Make your page useful</h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">Complete the basics, test the answers, then share your link.</p>
                </div>
                <span className="w-fit rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">{completed} of {steps.length} steps</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: (completed / steps.length * 100) + '%' }} /></div>
              <ol className="mt-3 divide-y divide-zinc-100">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex items-center gap-3 py-3">
                    <span className={'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ' + (step.done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-zinc-200 text-zinc-500')}>{step.done ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">{step.detail}</p>
                    </div>
                    <Link href={step.href} target={step.href.startsWith('https://') ? '_blank' : undefined} rel={step.href.startsWith('https://') ? 'noopener noreferrer' : undefined} className="shrink-0 text-xs font-medium text-zinc-700 underline underline-offset-4 hover:text-black">{step.action}</Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })()}
        <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Your public page</p>
            {pageUrl ? (
              <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate text-lg font-medium tracking-tight text-zinc-950 hover:underline">
                onequestion.space/{username}<ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">Setting up your page…</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => void copyPageLink()}
            disabled={!pageUrl}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy page link'}
          </button>
        </section>

        {!isLoading ? (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Questions', value: analytics?.totalQuestions ?? 0, icon: MessageSquare },
                { label: 'Visitors', value: analytics?.totalVisitors ?? 0, icon: Users },
                { label: 'AI answers', value: analytics?.totalAnswers ?? 0, icon: Zap },
                { label: 'Knowledge items', value: knowledgeCount ?? 0, icon: BookOpen },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="group rounded-xl border border-zinc-200 bg-white/75 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_14px_35px_rgba(0,0,0,0.07)]">
                  <Icon className="h-4 w-4 text-zinc-500" />
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{label}</p>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-zinc-200 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">Most asked questions</h2>
                  <p className="mt-1 text-sm text-zinc-500">Use these to keep your page useful.</p>
                </div>
                <Link href="/dashboard/analytics" className="shrink-0 text-sm text-zinc-600 underline-offset-4 hover:text-black hover:underline">
                  Analytics
                </Link>
              </div>
              {mostAsked?.length ? (
                <ol className="mt-4 divide-y divide-zinc-100">
                  {mostAsked.map((item) => (
                    <li key={item.question.toLowerCase()} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="text-zinc-800">{item.question}</span>
                      <span className="shrink-0 text-xs text-zinc-500">{item.count}×</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-lg bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
                  No questions yet — share your link to see what people ask.
                </p>
              )}
            </section>

            <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  {remaining} of {planLimit} answers left this month
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {pendingCount ? `${pendingCount} visitor question${pendingCount === 1 ? '' : 's'} need your attention.` : 'Your page answers visitors from your uploaded knowledge.'}
                </p>
              </div>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <Link href="/dashboard/inbox" className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm text-zinc-700 hover:bg-zinc-50">
                    Open inbox
                  </Link>
                )}
                <Link href="/dashboard/knowledge" className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm text-zinc-700 hover:bg-zinc-50">
                  Manage knowledge
                </Link>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-xl border border-zinc-200 p-6 text-sm text-zinc-500">Loading page activity…</div>
        )}
      </div>
    </DashboardLayout>
  );
}
