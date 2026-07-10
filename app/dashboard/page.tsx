'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/dashboard/Button';
import { Badge } from '@/components/dashboard/Badge';
import { KnowledgeHealthCard, KnowledgeGapsCard, CoverageCard, AutoFAQCard, AICoachCard } from '@/components/KnowledgeIntelligence';
import {
  MessageSquare, Users, Zap, Brain,
  Sparkles, BarChart3, Clock,
  FileText, Settings, Layers,
  ExternalLink, Copy, CheckCircle2,
  ChevronRight, Target,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'New Chat', href: '/dashboard/chat', icon: Sparkles, color: '#F5A623', desc: 'Chat with your knowledge' },
  { label: 'Upload Knowledge', href: '/dashboard/knowledge', icon: FileText, color: '#3b82f6', desc: 'Add documents, notes, URLs' },
  { label: 'Edit Profile', href: '/dashboard/settings', icon: Settings, color: '#22c55e', desc: 'Update your bio and links' },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers, color: '#a855f7', desc: 'Customize your AI space' },
];

export default function DashboardPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [copied, setCopied] = useState(false);

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const getOrCreateSubscription = useMutation(api.subscriptions.getOrCreateSubscription);

  const analytics = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const getOrCreateAnalytics = useMutation(api.analytics.getOrCreateAnalytics);

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
      createProfile({}).catch(() => {});
    }
  }, [profile, isSignedIn, createProfile]);

  useEffect(() => {
    if (profile?._id) {
      getOrCreateAnalytics({ profileId: profile._id }).catch(() => {});
    }
  }, [profile?._id, getOrCreateAnalytics]);

  useEffect(() => {
    if (userId && subscription === null) {
      getOrCreateSubscription({ userId }).catch(() => {});
    }
  }, [userId, subscription, getOrCreateSubscription]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 animate-pulse flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <p className="text-zinc-500 text-sm">Loading your space...</p>
        </div>
      </div>
    );
  }
  if (!isSignedIn) { redirect('/'); }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const loading = !profile || analytics === undefined || knowledgeCount === undefined;
  const pendingCount = unansweredQuestions?.length ?? 0;

  return (
    <DashboardLayout
      title={`${greeting}, ${profile?.displayName || 'friend'}`}
      description={profile?.username ? `onequestion.space/${profile.username}` : undefined}
    >
      <div className="space-y-5">
        {/* Quick Actions Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(action => (
            <Link key={action.label} href={action.href}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: action.color + '15' }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{action.label}</p>
                <p className="text-[10px] text-zinc-500 truncate">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="paper-card p-5 space-y-3">
                <div className="h-9 w-9 rounded-xl skeleton-shimmer" />
                <div className="h-7 w-20 skeleton-shimmer rounded" />
                <div className="h-3 w-16 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <StatsCard label="Questions" value={analytics?.totalQuestions?.toString() ?? '0'}
                icon={<MessageSquare className="w-4 h-4" />} color="#F5A623" />
              <StatsCard label="Visitors" value={analytics?.totalVisitors?.toString() ?? '0'}
                icon={<Users className="w-4 h-4" />} color="#3b82f6" />
              <StatsCard label="AI Answers" value={analytics?.totalAnswers?.toString() ?? '0'}
                icon={<Zap className="w-4 h-4" />} color="#22c55e" />
              <StatsCard label="Knowledge" value={knowledgeCount?.toString() ?? '0'}
                icon={<Brain className="w-4 h-4" />} color="#F5A623" />
            </div>

            {/* AI Suggestions */}
            <div className="paper-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-white">AI Suggestions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {knowledgeCount === 0 && (
                  <Link href="/dashboard/knowledge" className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-all">
                    <Target className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-300">Upload your first knowledge item to activate AI answers</span>
                  </Link>
                )}
                {pendingCount > 0 && (
                  <Link href="/dashboard/inbox?tab=unanswered" className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-all">
                    <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs text-blue-300">{pendingCount} unanswered question{pendingCount !== 1 ? 's' : ''}</span>
                  </Link>
                )}
                {knowledgeCount && knowledgeCount > 0 && knowledgeCount < 5 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <Brain className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs text-zinc-400">Add {5 - knowledgeCount} more items for optimal AI</span>
                  </div>
                )}
                <Link href="/dashboard/chat" className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs text-zinc-400">Chat with your knowledge</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Activity & Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="paper-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-white">Response Rate</span>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <p className="text-3xl font-bold text-white">
                    {analytics?.totalQuestions && analytics.totalQuestions > 0
                      ? Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)
                      : 0}%
                  </p>
                  <span className="text-xs text-zinc-500 mb-1">
                    {analytics?.totalAnswers ?? 0} of {analytics?.totalQuestions ?? 0} answered
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${analytics?.totalQuestions && analytics.totalQuestions > 0
                      ? Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100) : 0}%` }} />
                </div>
              </div>

              <div className="paper-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-white">AI Credits</span>
                  </div>
                  <Badge variant={subscription?.plan === 'pro' ? 'default' : 'neutral'} className="capitalize">
                    {subscription?.plan ?? 'free'}
                  </Badge>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <p className="text-3xl font-bold text-white">
                    {subscription?.messagesUsed ?? 0}
                    <span className="text-lg text-zinc-500 font-normal">/{subscription?.messagesLimit ?? 50}</span>
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${subscription ? Math.round((subscription.messagesUsed / subscription.messagesLimit) * 100) : 0}%`,
                      backgroundColor: subscription && subscription.messagesUsed > subscription.messagesLimit * 0.8 ? '#ef4444' : '#F5A623',
                    }} />
                </div>
              </div>
            </div>

            {/* AI Coach */}
            {userId && <AICoachCard userId={userId} knowledgeCount={knowledgeCount ?? 0} />}

            {/* Knowledge Intelligence Grid */}
            {knowledgeCount && knowledgeCount > 0 && userId && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                <KnowledgeHealthCard userId={userId} />
                <KnowledgeGapsCard userId={userId} />
                <CoverageCard userId={userId} />
                <AutoFAQCard userId={userId} />
              </div>
            )}

            {/* Bottom section - recent activity or empty state */}
            {knowledgeCount === 0 && (
              <EmptyState
                icon={<Brain />}
                title="Your AI has nothing to work with yet"
                description="Upload your first knowledge item to activate your AI."
                action={
                  <Link href="/dashboard/knowledge">
                    <Button variant="primary">Upload Knowledge</Button>
                  </Link>
                }
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
