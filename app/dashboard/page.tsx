'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState, useMemo } from 'react';
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
import { Badge } from '@/components/dashboard/Badge';
import { Skeleton, CardSkeleton, StatsCardSkeleton, ListSkeleton } from '@/components/dashboard/Skeleton';
import { useToast } from '@/components/dashboard/Toast';
import {
  MessageSquare, Users, Zap, Brain,
  ExternalLink, Copy, CheckCircle2, AlertCircle,
  BookOpen, Clock, BarChart3, ChevronRight,
  TrendingUp, Sparkles, Target, Activity,
  ArrowUp, ArrowDown, FileText,
  Settings, Layers, Send,
} from 'lucide-react';

type Period = '7d' | '30d' | 'all';

const QUICK_ACTIONS = [
  { label: 'Upload Knowledge', href: '/dashboard/knowledge', icon: FileText, color: '#F5A623' },
  { label: 'Edit Profile', href: '/dashboard/settings', icon: Settings, color: '#3b82f6' },
  { label: 'View Analytics', href: '/dashboard/analytics', icon: TrendingUp, color: '#22c55e' },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers, color: '#a855f7' },
];

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [period, setPeriod] = useState<Period>('7d');
  const router = useRouter();
  const { toast } = useToast();

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const getOrCreateSubscription = useMutation(api.subscriptions.getOrCreateSubscription);
  const resetMonthlyUsage = useMutation(api.subscriptions.resetMonthlyUsage);
  const answerQuestion = useMutation(api.questions.answerQuestion);

  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState<string | null>(null);

  const analytics = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const getOrCreateAnalytics = useMutation(api.analytics.getOrCreateAnalytics);

  const recentQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 5 } : 'skip'
  );

  const unansweredQuestions = useQuery(
    api.questions.getUnansweredQuestions,
    profile?._id ? { profileId: profile._id } : 'skip'
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
    toast({ type: 'success', title: 'Link copied!', description: 'Share it with anyone to get questions.' });
    setTimeout(() => setCopied(false), 2000);
  };
  const loading = !profile || analytics === undefined || knowledgeCount === undefined || subscription === undefined;
  const isNewUser = !knowledgeCount || knowledgeCount === 0;
  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messagesLimit = subscription?.messagesLimit ?? 50;
  const pendingCount = unansweredQuestions?.length ?? 0;

  const insights: string[] = useMemo(() => {
    const tips: string[] = [];
    if (isNewUser) {
      tips.push('Upload your first knowledge item to get started');
    } else if (knowledgeCount && knowledgeCount < 3) {
      tips.push('Add more knowledge — 5+ items makes your AI 3x more accurate');
    }
    if (pendingCount > 0) {
      tips.push(`You have ${pendingCount} unanswered question${pendingCount === 1 ? '' : 's'} waiting`);
    }
    if (messagesUsed > messagesLimit * 0.8) {
      tips.push(`You have used ${Math.round((messagesUsed / messagesLimit) * 100)}% of your monthly credits`);
    }
    if (!profile?.avatar) {
      tips.push('Add a profile photo — spaces with photos get 2x more questions');
    }
    if (!profile?.vibeQuote) {
      tips.push('Add a vibe quote to make your space feel more personal');
    }
    if (tips.length === 0) {
      tips.push('Your space is looking great! Keep adding knowledge to improve answers.');
      tips.push('Share your space link to start getting questions');
    }
    return tips.slice(0, 3);
  }, [isNewUser, knowledgeCount, pendingCount, messagesUsed, messagesLimit, profile?.avatar, profile?.vibeQuote]);

  const responseRate = analytics && analytics.totalQuestions > 0
    ? Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)
    : 0;

  const spaceUrl = 'onequestion.space/' + profile?.username;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const completionChecks = [
    !!profile?.displayName,
    !!profile?.avatar,
    !!(profile?.bio && profile.bio.length > 10),
    !!profile?.welcomeMessage,
    !!(profile as Record<string, unknown>)?.vibeQuote,
    knowledgeCount ? knowledgeCount > 0 : false,
  ];
  const completionScore = Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  return (
    <DashboardLayout title={`${greeting}, ${profile?.displayName || 'friend'}`} description={spaceUrl}>
      <div className="space-y-5">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(['7d', '30d', 'all'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'
                }`}>
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : 'All time'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={copyProfileLink}
              icon={copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}>
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
            <Link href={'/' + profile?.username} target="_blank">
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Space
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Space completion banner */}
            {completionScore < 100 && (
              <Card className="border-primary/20 bg-gradient-to-r from-primary/[0.04] to-transparent">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Target className="w-4 h-4 text-primary" />
                      <p className="text-sm font-semibold text-white">Space setup {completionScore}% complete</p>
                    </div>
                    <p className="text-xs text-zinc-500">Complete all steps to unlock your full potential</p>
                  </div>
                  <Link href="/dashboard/studio" className="shrink-0">
                    <Button variant="primary" size="sm">Continue</Button>
                  </Link>
                </div>
                <div className="mt-3"><ProgressBar value={completionScore} size="sm" color="#F5A623" /></div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['Name', 'Photo', 'Bio', 'Welcome', 'Vibe', 'Links'].map((label, i) => (
                    <span key={label} className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      completionChecks[i] ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-600'
                    }`}>
                      {completionChecks[i] ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Insights banner */}
            {insights.length > 0 && (
              <Card>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    {insights.map((tip, i) => (
                      <p key={i} className="text-sm text-zinc-400">{tip}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatsCard
                label="Questions"
                value={analytics?.totalQuestions?.toString() ?? '0'}
                icon={<MessageSquare className="w-4 h-4" />}
                color="#F5A623"
              />
              <StatsCard
                label="Visitors"
                value={analytics?.totalVisitors?.toString() ?? '0'}
                icon={<Users className="w-4 h-4" />}
                color="#3b82f6"
                trend={analytics?.totalVisitors ? { value: '+12%', positive: true } : undefined}
              />
              <StatsCard
                label="AI Answers"
                value={analytics?.totalAnswers?.toString() ?? '0'}
                icon={<Zap className="w-4 h-4" />}
                color="#22c55e"
              />
              <StatsCard
                label="Knowledge Items"
                value={knowledgeCount?.toString() ?? '0'}
                icon={<Brain className="w-4 h-4" />}
                color="#F5A623"
              />
            </div>

            {/* Quick actions */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {QUICK_ACTIONS.map(action => (
                  <Link key={action.label} href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: action.color + '15', color: action.color }}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card hover>
                <CardHeader title="Response Rate" action={<BarChart3 className="w-4 h-4 text-zinc-500" />} />
                <div className="flex items-end gap-3 mb-3">
                  <p className="text-3xl font-bold text-white">{responseRate}%</p>
                  <span className="text-sm text-zinc-500 mb-1">
                    {analytics?.totalAnswers ?? 0} of {analytics?.totalQuestions ?? 0} answered
                  </span>
                </div>
                <ProgressBar value={responseRate} color="#F5A623" />
                {pendingCount > 0 && (
                  <Link href="/dashboard/analytics" className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 mt-3 transition-colors">
                    <AlertCircle className="w-3 h-3" />
                    {pendingCount} pending question{pendingCount === 1 ? '' : 's'} — answer them to boost your rate
                  </Link>
                )}
              </Card>

              <Card hover>
                <CardHeader
                  title="AI Usage"
                  action={
                    <Link href="/dashboard/billing">
                      <Button variant="ghost" size="sm">Upgrade</Button>
                    </Link>
                  }
                />
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-3xl font-bold text-white">
                    {messagesUsed}
                    <span className="text-lg text-zinc-500 font-normal">/{messagesLimit}</span>
                  </p>
                  <Badge variant={subscription?.plan === 'pro' ? 'default' : 'neutral'} className="mb-1 capitalize">
                    {subscription?.plan ?? 'free'}
                  </Badge>
                </div>
                <ProgressBar value={messagesUsed} max={messagesLimit} color={messagesUsed > messagesLimit * 0.8 ? '#ef4444' : '#F5A623'} />
                <p className="text-xs text-zinc-500 mt-2">
                  {messagesLimit - messagesUsed} credits remaining
                </p>
              </Card>
            </div>

            {/* Unanswered questions */}
            {unansweredQuestions && unansweredQuestions.length > 0 && (
              <Card>
                <CardHeader
                  title="Unanswered Questions"
                  icon={<AlertCircle className="w-4 h-4 text-primary" />}
                  description="These visitors are waiting for a response."
                />
                <div className="space-y-2">
                  {unansweredQuestions.map((q) => (
                    <div key={q._id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium">{q.question}</p>
                          <p className="text-xs text-zinc-600 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(q.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {answeringId === q._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Write your answer..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary/40 resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <Button variant="primary" size="sm" icon={<Send className="w-3 h-3" />}
                              disabled={!answerText.trim() || submittingAnswer === q._id}
                              onClick={async () => {
                                if (!answerText.trim()) return;
                                setSubmittingAnswer(q._id);
                                try {
                                  await answerQuestion({ id: q._id, answer: answerText.trim() });
                                  setAnswerText('');
                                  setAnsweringId(null);
                                  toast({ type: 'success', title: 'Answered!', description: 'Your answer is now live.' });
                                } catch {
                                  toast({ type: 'error', title: 'Failed', description: 'Could not save your answer.' });
                                }
                                setSubmittingAnswer(null);
                              }}
                            >
                              {submittingAnswer === q._id ? 'Saving...' : 'Send Answer'}
                            </Button>
                            <Button variant="ghost" size="sm"
                              onClick={() => { setAnsweringId(null); setAnswerText(''); }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm"
                          onClick={() => { setAnsweringId(q._id); setAnswerText(''); }}>
                          Answer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <CardHeader
                  title="Recent Questions"
                  icon={<MessageSquare className="w-4 h-4 text-primary" />}
                  action={
                    <Link href="/dashboard/analytics">
                      <Button variant="ghost" size="sm" icon={<ChevronRight className="w-3 h-3" />}>View all</Button>
                    </Link>
                  }
                />
                {recentQuestions && recentQuestions.length > 0 ? (
                  <div className="space-y-2">
                    {recentQuestions.map((q) => (
                      <div key={q._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] transition-all hover:bg-white/[0.04]">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-white text-sm font-medium line-clamp-1">{q.question}</p>
                          <Badge variant={q.isAnswered ? 'success' : 'warning'} className="shrink-0">
                            {q.isAnswered ? 'Answered' : 'Pending'}
                          </Badge>
                        </div>
                        {q.answer && <p className="text-zinc-500 text-xs line-clamp-2 mb-1.5">{q.answer}</p>}
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
                    description="Your AI is ready — share your link and the first question will land here."
                  />
                )}
              </Card>

              <Card>
                <CardHeader
                  title="Knowledge Base"
                  icon={<BookOpen className="w-4 h-4 text-primary" />}
                  action={
                    <Link href="/dashboard/knowledge">
                      <Button variant="ghost" size="sm" icon={<ChevronRight className="w-3 h-3" />}>Manage</Button>
                    </Link>
                  }
                />
                {knowledgeCount && knowledgeCount > 0 ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 ring-2 ring-primary/10">
                      <Brain className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{knowledgeCount}</p>
                    <p className="text-sm text-zinc-500">knowledge items uploaded</p>
                    {knowledgeCount < 5 && (
                      <p className="text-xs text-primary mt-2">Add {5 - knowledgeCount} more for optimal AI performance</p>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Brain />}
                    title="Your AI has nothing to work with yet"
                    description="Upload anything — a bio, your FAQs, what you do."
                    action={
                      <Link href="/dashboard/knowledge">
                        <Button variant="primary" size="sm">Upload Knowledge</Button>
                      </Link>
                    }
                  />
                )}
              </Card>
            </div>
          </>
        )}

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
      </div>
    </DashboardLayout>
  );
}
