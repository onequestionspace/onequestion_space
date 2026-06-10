'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Settings,
  CreditCard,
  MessageSquare,
  Users,
  TrendingUp,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

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

  useEffect(() => {
    if (userId && subscription === null) {
      getOrCreateSubscription({ userId }).catch(console.error);
    }
  }, [userId, subscription, getOrCreateSubscription]);

  const copyProfileLink = () => {
    const link = `https://onequestion.space/${profile?.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/');
  }

  const isNewUser = !knowledgeCount || knowledgeCount === 0;

  const planColors: Record<string, string> = {
    free: 'text-muted-foreground',
    starter: 'text-blue-400',
    pro: 'text-primary',
    business: 'text-pink',
    enterprise: 'text-yellow',
  };

  const stats = [
    {
      label: 'Total Questions',
      value: analytics?.totalQuestions?.toString() ?? '0',
      icon: MessageSquare,
      color: 'text-primary',
    },
    {
      label: 'Profile Views',
      value: analytics?.totalVisitors?.toString() ?? '0',
      icon: Users,
      color: 'text-pink',
    },
    {
      label: 'AI Answers',
      value: analytics?.totalAnswers?.toString() ?? '0',
      icon: TrendingUp,
      color: 'text-yellow',
    },
    {
      label: 'Knowledge Items',
      value: knowledgeCount?.toString() ?? '0',
      icon: Brain,
      color: 'text-accent',
    },
  ];

  const quickLinks = [
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: Brain },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messagesLimit = subscription?.messagesLimit ?? 50;
  const messagesPercent = messagesLimit === -1 ? 0 : Math.min((messagesUsed / messagesLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-50" />
        <div className="dot-pattern" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-border p-6 hidden lg:block">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink" />
          <span className="text-xl font-bold text-foreground">OneQuestion</span>
        </Link>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Subscription badge in sidebar */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
            <p className={`text-sm font-semibold capitalize ${planColors[subscription?.plan ?? 'free']}`}>
              {subscription?.plan ?? 'Free'}
            </p>
            {messagesLimit !== -1 && (
              <>
                <div className="w-full h-1.5 bg-border rounded-full mt-2">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-primary to-pink transition-all"
                    style={{ width: `${messagesPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {messagesUsed} / {messagesLimit} messages
                </p>
              </>
            )}
            {subscription?.plan === 'free' && (
              <Link href="/dashboard/billing" className="text-xs text-primary hover:underline mt-2 block">
                Upgrade →
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Welcome back, {profile?.displayName || 'Creator'} 👋
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-primary">onequestion.space/{profile?.username}</p>
                <button onClick={copyProfileLink} className="text-muted-foreground hover:text-primary transition-colors">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <Link
                  href={`/${profile?.username}`}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Onboarding Banner — shown only if no knowledge uploaded */}
          {isNewUser && (
            <div className="mb-8 glass-card rounded-2xl p-6 border border-primary/30 bg-primary/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Finish setting up your space</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your AI has no knowledge yet. Upload content so it can start answering questions from your visitors.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/dashboard/knowledge"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-pink text-white text-sm font-medium hover:shadow-glow-primary transition-all"
                    >
                      Upload Knowledge
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-primary/10 transition-all"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Questions */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Questions</h2>
                <Link href="/dashboard/analytics" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              {recentQuestions && recentQuestions.length > 0 ? (
                <div className="space-y-4">
                  {recentQuestions.map((q) => (
                    <div key={q._id} className="p-4 rounded-xl bg-card border border-border">
                      <p className="text-foreground text-sm font-medium mb-1">{q.question}</p>
                      {q.isAnswered ? (
                        <p className="text-muted-foreground text-xs line-clamp-2">{q.answer}</p>
                      ) : (
                        <span className="text-xs text-yellow px-2 py-0.5 rounded-full bg-yellow/10">Pending</span>
                      )}
                      <p className="text-xs text-muted-foreground/50 mt-2">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No questions yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Share your profile link to start receiving questions</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={copyProfileLink}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-medium hover:shadow-glow-primary transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Profile Link'}
                  </button>
                  <Link
                    href="/dashboard/analytics"
                    className="w-full py-3 px-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </Link>
                  <Link
                    href="/dashboard/knowledge"
                    className="w-full py-3 px-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Train AI
                  </Link>
                  <Link
                    href={`/${profile?.username}`}
                    target="_blank"
                    className="w-full py-3 px-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View My Space
                  </Link>
                </div>
              </div>

              {/* Response Rate */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Response Rate</h2>
                {analytics && analytics.totalQuestions > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analytics.totalAnswers} of {analytics.totalQuestions} answered
                    </p>
                    <div className="w-full h-2 bg-border rounded-full mt-3">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-pink"
                        style={{ width: `${Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">No data yet</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
