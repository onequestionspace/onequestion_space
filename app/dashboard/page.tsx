'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Brain,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    redirect('/');
  }

  const isNewUser = !knowledgeCount || knowledgeCount === 0;
  const messagesUsed = subscription?.messagesUsed ?? 0;
  const messagesLimit = subscription?.messagesLimit ?? 50;

  const stats = [
    { label: 'Total Questions', value: analytics?.totalQuestions?.toString() ?? '0', icon: MessageSquare },
    { label: 'Profile Views', value: analytics?.totalVisitors?.toString() ?? '0', icon: Users },
    { label: 'AI Answers', value: analytics?.totalAnswers?.toString() ?? '0', icon: TrendingUp },
    { label: 'Knowledge Items', value: knowledgeCount?.toString() ?? '0', icon: Brain },
  ];

  return (
    <DashboardLayout 
      title={`Welcome back, ${profile?.displayName || 'Creator'} 👋`}
      description={`onequestion.space/${profile?.username}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Copy link row */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={copyProfileLink} className="text-muted-foreground hover:text-primary transition-colors">
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <Link href={`/${profile?.username}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Onboarding Banner */}
        {isNewUser && (
          <div className="mb-8 glass-card rounded-2xl p-6 border-primary/30 bg-primary/5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-foreground font-semibold mb-1">Finish setting up your space</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your AI has no knowledge yet. Upload content so it can start answering questions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard/knowledge" className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-pink text-white text-sm font-medium">
                    Upload Knowledge
                  </Link>
                  <Link href="/dashboard/settings" className="px-4 py-2 rounded-xl bg-card border-border text-foreground text-sm font-medium">
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
            <div key={stat.label} className="glass-card rounded-2xl p-6 border-border">
              <stat.icon className="w-6 h-6 mb-4" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Questions */}
        <div className="glass-card rounded-2xl p-6 border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Questions</h2>
            <Link href="/dashboard/analytics" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentQuestions && recentQuestions.length > 0 ? (
            <div className="space-y-4">
              {recentQuestions.map((q) => (
                <div key={q._id} className="p-4 rounded-xl bg-card border-border">
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
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
