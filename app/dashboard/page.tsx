'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WelcomeModal } from '@/components/WelcomeModal';
import { TourTooltip } from '@/components/TourTooltip';
import { Card, CardHeader, StatsCard, ProgressBar } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/dashboard/Button';
import {
  MessageSquare, Users, Zap, Brain,
  ExternalLink, Copy, CheckCircle2, AlertCircle,
  BookOpen, Clock, BarChart3, ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const router = useRouter();

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const getOrCreateSubscription = useMutation(api.subscriptions.getOrCreateSubscription);
  const resetMonthlyUsage = useMutation(api.subscriptions.resetMonthlyUsage);

  const analytics = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const getOrCreateAnalytics = useMutation(api.analytics.getOrCreateAnalytics);

  const recentQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 5 } : 'skip'
  );

  const subscription = useQuery(
    api.subscriptions.getSubscription,
    userId ? { userId } : 'skip'
  );

  const knowledgeCount = useQuery(
    api.knowledge.getKnowledgeCount,
    userId ? { userId } : 'skip'
  );

  useEffect(() => {
    if (profile === null && isSignedIn) {
      createProfile({}).catch(console.error);
    }
    if (profile && !localStorage.getItem('oq_welcome_seen')) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setShowWelcome(true);
    }
  }, [profile, isSignedIn, createProfile]);

  useEffect(() => {
    if (profile?._id) {
      getOrCreateAnalytics({ profileId: profile._id }).catch(console.error);
    }
  }, [profile?._id, getOrCreateAnalytics]);

  useEffect(() => {
    if (!profile || knowledgeCount === undefined) return;
    const isIncomplete = !profile.bio || !profile.welcomeMessage || !knowledgeCount;
    if (isIncomplete) {
      router.replace('/dashboard/studio');
    }
  }, [profile, knowledgeCount, router]);

  useEffect(() => {
    if (userId && subscription === null) {
      getOrCreateSubscription({ userId }).catch(console.error);
    }
    if (userId && subscription) {
      resetMonthlyUsage({ userId }).catch(() => {});
    }
  }, [userId, subscription, getOrCreateSubscription, resetMonthlyUsage]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + profile?.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const isNewUser = !knowledgeCount || knowledgeCount === 0;
  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messagesLimit = subscription?.messagesLimit ?? 50;
  const responseRate = analytics && analytics.totalQuestions > 0
    ? Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)
    : 0;

  const spaceUrl = 'onequestion.space/' + profile?.username;

  return (
    <DashboardLayout
      title={'Good to see you, ' + (profile?.displayName || 'friend')}
      description={spaceUrl}
    >
      <div className="space-y-8">

        {/* Header actions */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={copyProfileLink} icon={copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}>
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
          <Link href={'/' + profile?.username} target="_blank">
            <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              View Space
            </Button>
          </Link>
        </div>

        {/* Space completion */}
        {(() => {
          const checks = [
            !!profile?.displayName,
            !!profile?.avatar,
            !!(profile?.bio && profile.bio.length > 10),
            !!profile?.welcomeMessage,
            !!(profile as Record<string, unknown>)?.vibeQuote,
            knowledgeCount ? knowledgeCount > 0 : false,
          ];
          const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
          if (score === 100) return null;
          return (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">Your space is {score}% complete</p>
                  <p className="text-xs text-zinc-500">A complete space gets more questions. Takes 2 minutes.</p>
                </div>
                <Link href="/dashboard/studio">
                  <Button variant="primary" size="sm">Open Studio →</Button>
                </Link>
              </div>
              <ProgressBar value={score} size="sm" color="#f59e0b" />
            </Card>
          );
        })()}

        {/* Onboarding */}
        {isNewUser && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1">Your AI is waiting to learn from you</h3>
                <p className="text-zinc-500 text-sm mb-4">
                  Right now if someone visits your space, your AI has nothing to say. Upload anything — your bio, what you do, FAQs, projects.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard/knowledge">
                    <Button variant="primary">Upload Knowledge</Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button variant="secondary">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div data-tour="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Questions" value={analytics?.totalQuestions?.toString() ?? '0'} icon={<MessageSquare className="w-5 h-5" />} color="#f59e0b" />
          <StatsCard label="Profile Visitors" value={analytics?.totalVisitors?.toString() ?? '0'} icon={<Users className="w-5 h-5" />} color="#3b82f6" />
          <StatsCard label="AI Answers" value={analytics?.totalAnswers?.toString() ?? '0'} icon={<Zap className="w-5 h-5" />} color="#22c55e" />
          <StatsCard label="Knowledge Items" value={knowledgeCount?.toString() ?? '0'} icon={<Brain className="w-5 h-5" />} color="#f97316" />
        </div>

        {/* Streak */}
        {knowledgeCount && knowledgeCount > 0 && (
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl shrink-0">🔥</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">The more you teach it, the better it gets</p>
                <p className="text-xs text-zinc-500">
                  {knowledgeCount} knowledge item{knowledgeCount === 1 ? '' : 's'} — keep adding to make your AI smarter.
                </p>
              </div>
              <Link href="/dashboard/knowledge" className="ml-auto shrink-0">
                <Button variant="ghost" size="sm">Add more →</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Middle row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Response Rate" action={<BarChart3 className="w-4 h-4 text-zinc-500" />} />
            <p className="text-4xl font-bold text-white mb-2">{responseRate}%</p>
            <ProgressBar value={responseRate} color="#f59e0b" />
            <p className="text-xs text-zinc-500 mt-2">
              {analytics?.totalAnswers ?? 0} of {analytics?.totalQuestions ?? 0} questions answered
            </p>
          </Card>

          <Card>
            <CardHeader
              title="AI Usage"
              action={
                <Link href="/dashboard/billing">
                  <Button variant="ghost" size="sm">Upgrade</Button>
                </Link>
              }
            />
            <p className="text-4xl font-bold text-white mb-2">
              {messagesUsed}
              <span className="text-lg text-zinc-500 font-normal">/{messagesLimit}</span>
            </p>
            <ProgressBar value={messagesUsed} max={messagesLimit} />
            <p className="text-xs text-zinc-500 mt-2">
              {subscription?.plan ?? 'free'} plan · {messagesLimit - messagesUsed} remaining
            </p>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader
              title="Recent Questions"
              icon={<MessageSquare className="w-4 h-4 text-amber-500" />}
              action={
                <Link href="/dashboard/analytics">
                  <Button variant="ghost" size="sm" icon={<ChevronRight className="w-3 h-3" />}>View all</Button>
                </Link>
              }
            />
            {recentQuestions && recentQuestions.length > 0 ? (
              <div className="space-y-3">
                {recentQuestions.map((q) => (
                  <div key={q._id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white text-sm font-medium line-clamp-1">{q.question}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        q.isAnswered ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {q.isAnswered ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    {q.answer && <p className="text-zinc-500 text-xs line-clamp-2 mb-2">{q.answer}</p>}
                    <p className="text-xs text-zinc-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquare />}
                title="No questions yet"
                description="Your AI is ready though — share your link and the first question will land here."
              />
            )}
          </Card>

          <Card>
            <CardHeader
              title="Knowledge Base"
              icon={<BookOpen className="w-4 h-4 text-amber-500" />}
              action={
                <Link href="/dashboard/knowledge">
                  <Button variant="ghost" size="sm" icon={<ChevronRight className="w-3 h-3" />}>Manage</Button>
                </Link>
              }
            />
            {knowledgeCount && knowledgeCount > 0 ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-7 h-7 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{knowledgeCount}</p>
                <p className="text-sm text-zinc-500 mb-4">knowledge items uploaded</p>
                <Link href="/dashboard/knowledge">
                  <Button variant="ghost" size="sm">View and manage all items</Button>
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={<Brain />}
                title="Your AI has nothing to work with yet"
                description="Upload anything — a bio, your FAQs, what you do. Start there."
                action={
                  <Link href="/dashboard/knowledge">
                    <Button variant="primary" size="sm">Upload Knowledge</Button>
                  </Link>
                }
              />
            )}
          </Card>
        </div>
      </div>

      {showWelcome && (
        <WelcomeModal
          username={profile?.username}
          onDone={() => {
            setShowWelcome(false);
            localStorage.setItem('oq_welcome_seen', '1');
            setTimeout(() => setShowTour(true), 500);
          }}
        />
      )}
      {showTour && (
        <TourTooltip
          steps={[
            { target: '[data-tour="share"]', title: 'Your space link', desc: 'Share this link anywhere. Visitors ask questions, your AI answers instantly.', position: 'bottom' },
            { target: '[data-tour="knowledge"]', title: 'Upload knowledge', desc: 'Add your bio, FAQs, and expertise. The more you upload, the better your AI answers.', position: 'bottom' },
            { target: '[data-tour="stats"]', title: 'Your stats', desc: 'Track questions asked, visitors, and your AI answer rate in real time.', position: 'top' },
          ]}
          onDone={() => {
            setShowTour(false);
            localStorage.setItem('oq_tour_seen', '1');
          }}
        />
      )}
    </DashboardLayout>
  );
}
