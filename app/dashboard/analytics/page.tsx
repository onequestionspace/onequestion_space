// [unbreak alert] Local fix rules skipped. Compiler error trace:
// app/dashboard/analytics/page.tsx(36,6): error TS2741: Property 'title' is missing in type '{ children: Element; }' but required in type 'DashboardLayoutProps'.

// [unbreak alert] Local fix rules skipped. Compiler error trace:
// app/dashboard/analytics/page.tsx(33,6): error TS2741: Property 'title' is missing in type '{ children: Element; }' but required in type 'DashboardLayoutProps'.

'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BarChart3, MessageSquare, Users, TrendingUp, Brain } from 'lucide-react';

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.current);
  const analyticsData = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const questions = useQuery(
    api.questions.getQuestionsByProfile,
    profile?._id ? { profileId: profile._id } : 'skip'
  );

  if (!isLoaded) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!isSignedIn) { redirect('/'); }

  const stats = [
    { label: 'Total Questions', value: analyticsData?.totalQuestions || 0, icon: MessageSquare, color: 'text-primary' },
    { label: 'Total Visitors', value: analyticsData?.totalVisitors || 0, icon: Users, color: 'text-pink' },
    { label: 'AI Answers', value: analyticsData?.totalAnswers || 0, icon: Brain, color: 'text-accent-yellow' },
    { label: 'Response Rate', value: analyticsData?.totalQuestions ? Math.round((analyticsData.totalAnswers / analyticsData.totalQuestions) * 100) + '%' : '0%', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-muted-foreground text-sm">Real time stats for your space</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 border border-white/10">
              <stat.icon className={"w-5 h-5 mb-3 " + stat.color} />
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="text-white font-bold mb-4">Recent Questions</h2>
          {!questions || questions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No questions yet. Share your space link to start receiving questions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.slice(0, 10).map((q) => (
                <div key={q._id} className="glass rounded-xl p-4 border border-white/5">
                  <p className="text-white text-sm font-medium mb-1">{q.question}</p>
                  {q.answer && <p className="text-muted-foreground text-xs leading-relaxed">{q.answer}</p>}
                  <p className="text-xs text-muted-foreground/50 mt-2">{new Date(q.createdAt || q._creationTime).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}