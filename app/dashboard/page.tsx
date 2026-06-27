'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  MessageSquare, Users, TrendingUp, Brain,
  ExternalLink, Copy, CheckCircle2, AlertCircle,
  BookOpen, Clock, Zap, BarChart3, ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const getOrCreateSubscription = useMutation(api.subscriptions.getOrCreateSubscription);

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
  }, [profile, isSignedIn, createProfile]);

  useEffect(() => {
    if (profile?._id) {
      getOrCreateAnalytics({ profileId: profile._id }).catch(console.error);
    }
  }, [profile?._id, getOrCreateAnalytics]);

  // Redirect incomplete spaces to Studio
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
  }, [userId, subscription, getOrCreateSubscription]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + profile?.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
  if (!isSignedIn) { redirect('/'); }

  const isNewUser = !knowledgeCount || knowledgeCount === 0;
  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messagesLimit = subscription?.messagesLimit ?? 50;
  const usagePercent = Math.min(Math.round((messagesUsed / messagesLimit) * 100), 100);
  const responseRate = analytics && analytics.totalQuestions > 0
    ? Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)
    : 0;

  const stats = [
    { label: 'Total Questions', value: analytics?.totalQuestions?.toString() ?? '0', icon: MessageSquare, color: '#f59e0b' },
    { label: 'Profile Visitors', value: analytics?.totalVisitors?.toString() ?? '0', icon: Users, color: '#3b82f6' },
    { label: 'AI Answers', value: analytics?.totalAnswers?.toString() ?? '0', icon: Zap, color: '#22c55e' },
    { label: 'Knowledge Items', value: knowledgeCount?.toString() ?? '0', icon: Brain, color: '#f97316' },
  ];

  return (
    <DashboardLayout
      title={'Good to see you, ' + (profile?.displayName || 'friend') + ' 👋'}
      description={'onequestion.space/' + profile?.username}
    >
      <div className='max-w-6xl mx-auto space-y-8'>

        {/* Header row */}
        <div className='flex items-center gap-3'>
          <button onClick={copyProfileLink} className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-primary transition-colors'>
            {copied ? <CheckCircle2 className='w-3.5 h-3.5 text-green-500' /> : <Copy className='w-3.5 h-3.5' />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <Link href={'/' + profile?.username} target='_blank' className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-primary transition-colors'>
            <ExternalLink className='w-3.5 h-3.5' /> View Space
          </Link>
        </div>

        {/* Space Completion Score */}
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
            <div className='glass-card rounded-2xl p-5 border border-border'>
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>Your space is {score}% complete</p>
                  <p className='text-xs text-muted-foreground'>A complete space gets more questions. Takes 2 minutes.</p>
                </div>
                <Link href='/dashboard/studio' className='text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r bg-primary hover:opacity-90 transition-all'>
                  Open Studio →
                </Link>
              </div>
              <div className='w-full h-1.5 bg-card rounded-full overflow-hidden'>
                <div className='h-full rounded-full bg-gradient-to-r bg-primary transition-all' style={{ width: score + `%` }} />
              </div>
            </div>
          );
        })()}


        {/* Onboarding Banner */}
        {isNewUser && (
          <div className='glass-card rounded-2xl p-6 border border-primary/30 bg-primary/5'>
            <div className='flex items-start gap-4'>
              <AlertCircle className='w-6 h-6 text-primary shrink-0 mt-0.5' />
              <div>
                <h3 className='text-foreground font-semibold mb-1'>Your AI is waiting to learn from you</h3>
                <p className='text-muted-foreground text-sm mb-4'>Right now if someone visits your space, your AI has nothing to say. Upload anything — your bio, what you do, FAQs, projects. The more you give it, the more it sounds like you.</p>
                <div className='flex flex-wrap gap-3'>
                  <Link href='/dashboard/knowledge' className='px-4 py-2 rounded-xl bg-gradient-to-r bg-primary text-white text-sm font-medium'>Upload Knowledge</Link>
                  <Link href='/dashboard/settings' className='px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium'>Edit Profile</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='glass-card rounded-2xl p-6 border border-border'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-4' style={{ backgroundColor: stat.color + '20' }}>
                <stat.icon className='w-5 h-5' style={{ color: stat.color }} />
              </div>
              <p className='text-3xl font-bold text-foreground mb-1'>{stat.value}</p>
              <p className='text-xs text-muted-foreground'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Streak card */}
        {knowledgeCount && knowledgeCount > 0 && (
          <div className='glass-card rounded-2xl p-5 border border-border flex items-center gap-4'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0'>🔥</div>
            <div>
              <p className='text-sm font-bold text-foreground'>The more you teach it, the better it gets</p>
              <p className='text-xs text-muted-foreground'>You have {knowledgeCount} knowledge item{knowledgeCount === 1 ? '' : 's'} — the more you add, the smarter your AI gets.</p>
            </div>
            <Link href='/dashboard/knowledge' className='ml-auto text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0'>Add more →</Link>
          </div>
        )}

        {/* Middle row: Response Rate + Usage */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

          {/* Response Rate */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-foreground'>Response Rate</h3>
              <BarChart3 className='w-4 h-4 text-muted-foreground' />
            </div>
            <p className='text-4xl font-bold text-foreground mb-2'>{responseRate}%</p>
            <div className='w-full h-2 bg-card rounded-full overflow-hidden'>
              <div className='h-full rounded-full bg-gradient-to-r bg-primary transition-all' style={{ width: responseRate + '%' }} />
            </div>
            <p className='text-xs text-muted-foreground mt-2'>{analytics?.totalAnswers ?? 0} of {analytics?.totalQuestions ?? 0} questions answered</p>
          </div>

          {/* AI Usage */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-foreground'>AI Usage</h3>
              <Link href='/dashboard/billing' className='text-xs text-primary hover:underline'>Upgrade</Link>
            </div>
            <p className='text-4xl font-bold text-foreground mb-2'>{messagesUsed}<span className='text-lg text-muted-foreground font-normal'>/{messagesLimit}</span></p>
            <div className='w-full h-2 bg-card rounded-full overflow-hidden'>
              <div className='h-full rounded-full transition-all' style={{ width: usagePercent + '%', backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#f59e0b' }} />
            </div>
            <p className='text-xs text-muted-foreground mt-2'>{subscription?.plan ?? 'free'} plan · {messagesLimit - messagesUsed} remaining</p>
          </div>
        </div>

        {/* Bottom row: Recent Questions + Knowledge */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>

          {/* Recent Questions */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-semibold text-foreground flex items-center gap-2'><MessageSquare className='w-4 h-4 text-primary' /> Recent Questions</h2>
              <Link href='/dashboard/analytics' className='text-xs text-primary hover:underline flex items-center gap-1'>View all <ChevronRight className='w-3 h-3' /></Link>
            </div>
            {recentQuestions && recentQuestions.length > 0 ? (
              <div className='space-y-3'>
                {recentQuestions.map((q) => (
                  <div key={q._id} className='p-4 rounded-xl bg-card border border-border'>
                    <div className='flex items-start justify-between gap-2 mb-1'>
                      <p className='text-foreground text-sm font-medium line-clamp-1'>{q.question}</p>
                      <span className={'text-xs px-2 py-0.5 rounded-full shrink-0 ' + (q.isAnswered ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500')}>
                        {q.isAnswered ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    {q.answer && <p className='text-muted-foreground text-xs line-clamp-2 mb-2'>{q.answer}</p>}
                    <p className='text-xs text-muted-foreground/50 flex items-center gap-1'><Clock className='w-3 h-3' />{new Date(q.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-10'>
                <MessageSquare className='w-10 h-10 text-muted-foreground/20 mx-auto mb-3' />
                <p className='text-sm text-muted-foreground'>No questions yet — your AI is ready though</p>
                <p className='text-xs text-muted-foreground/50 mt-1'>Share your link and the first question will land here.</p>
              </div>
            )}
          </div>

          {/* Knowledge Base */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-semibold text-foreground flex items-center gap-2'><BookOpen className='w-4 h-4 text-primary' /> Knowledge Base</h2>
              <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline flex items-center gap-1'>Manage <ChevronRight className='w-3 h-3' /></Link>
            </div>
            {knowledgeCount && knowledgeCount > 0 ? (
              <div className='text-center py-6'>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3'>
                  <Brain className='w-7 h-7 text-primary' />
                </div>
                <p className='text-3xl font-bold text-foreground mb-1'>{knowledgeCount}</p>
                <p className='text-sm text-muted-foreground mb-4'>knowledge items uploaded</p>
                <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline'>View and manage all items</Link>
              </div>
            ) : (
              <div className='text-center py-10'>
                <Brain className='w-10 h-10 text-muted-foreground/20 mx-auto mb-3' />
                <p className='text-sm text-muted-foreground'>Your AI has nothing to work with yet</p>
                <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline mt-1 block'>Upload anything — a bio, your FAQs, what you do. Start there.</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}