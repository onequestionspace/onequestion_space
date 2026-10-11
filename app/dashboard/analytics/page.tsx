'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, StatsCard } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatsCardSkeleton, CardSkeleton, ListSkeleton } from '@/components/dashboard/Skeleton';
import { MessageSquare, Users, Brain, TrendingUp, Clock, ChevronDown, ChevronUp, Download, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 shadow-xl">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} questions</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const profile = useQuery(api.profiles.current);
  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');
  const hasPro = subscription?.plan === 'pro' && subscription.status === 'active';
  const analyticsArgs = hasPro && profile?._id ? { profileId: profile._id } : 'skip';
  const analyticsData = useQuery(api.analytics.getAnalytics, analyticsArgs);
  const visitorEmails = useQuery(api.questions.getVisitorEmails, analyticsArgs);
  const questions = useQuery(api.questions.getQuestionsByProfile, analyticsArgs);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loading = subscription === undefined || (hasPro && (analyticsData === undefined || questions === undefined));

  const totalQ = analyticsData?.totalQuestions || 0;
  const totalV = analyticsData?.totalVisitors || 0;
  const totalA = analyticsData?.totalAnswers || 0;
  const responseRate = totalQ > 0 ? Math.round((totalA / totalQ) * 100) : 0;
  const unanswered = totalQ - totalA;

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), timestamp: d.setHours(0, 0, 0, 0), questions: 0 };
    });
    if (questions) {
      for (const q of questions) {
        const qDate = new Date(q.createdAt || q._creationTime).setHours(0, 0, 0, 0);
        const day = days.find(d => d.timestamp === qDate);
        if (day) day.questions++;
      }
    }
    return days;
  }, [questions]);

  const pieData = useMemo(() => [
    { name: 'Answered', value: totalA, color: '#18181b' },
    { name: 'Pending', value: Math.max(0, unanswered), color: '#e4e4e7' },
  ], [totalA, unanswered]);

  // Top questions (grouped by text)
  const topQuestions = useMemo(() => {
    if (!questions) return [];
    const counts: Record<string, number> = {};
    for (const q of questions) {
      const key = q.question.toLowerCase().trim();
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([q, count]) => ({ question: q, count }));
  }, [questions]);

  const exportCSV = () => {
    if (!questions) return;
    const rows = [['Question', 'Status', 'Answer', 'Date']];
    for (const q of questions) {
      rows.push([
        q.question,
        q.isAnswered ? 'Answered' : 'Pending',
        q.answer || '',
        new Date(q.createdAt || q._creationTime).toLocaleDateString(),
      ]);
    }
    const csv = rows.map(r => r.map(c => '"' + c.replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.csv';
    a.click();
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-zinc-500 text-sm">Loading...</div></div>;
  if (!isSignedIn) { redirect('/'); }

  if (subscription === undefined || profile === undefined) {
    return (
      <DashboardLayout title="Analytics" description="Understand what visitors ask about you.">
        <div className="rounded-xl border border-zinc-200 p-6 text-sm text-zinc-500">Loading your plan…</div>
      </DashboardLayout>
    );
  }

  if (!hasPro) {
    return (
      <DashboardLayout title="Analytics" description="Understand what visitors ask about you.">
        <section className="max-w-xl rounded-xl border border-zinc-200 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Pro feature</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">See what people ask most.</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Pro includes question trends, response rates, and visitor insights, plus 500 answers each month and a clean page without OneQuestion branding.
          </p>
          <Link href="/dashboard/billing" className="mt-6 inline-flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800">
            Upgrade to Pro — $9/month
          </Link>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics" description="Understand what visitors ask about you.">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Low response rate warning */}
        {!loading && responseRate < 70 && totalQ > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-400">{unanswered} questions unanswered</p>
              <p className="text-xs text-zinc-500 mt-0.5">Your AI may need more knowledge to answer these. Upload more content to improve your response rate.</p>
            </div>
            <Link href="/dashboard/knowledge" className="text-xs font-bold text-amber-500 hover:opacity-80 shrink-0">Add knowledge →</Link>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading ? Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />) : (
            <>
              <StatsCard label="Total Questions" value={totalQ} icon={<MessageSquare className="w-4 h-4" />} color="#18181b" />
              <StatsCard label="Total Visitors" value={totalV} icon={<Users className="w-4 h-4" />} color="#18181b" />
              <StatsCard label="AI Answers" value={totalA} icon={<Brain className="w-4 h-4" />} color="#18181b" />
              <StatsCard label="Response Rate" value={responseRate + '%'} icon={<TrendingUp className="w-4 h-4" />} color="#18181b" />
            </>
          )}
        </div>

        {/* Top questions */}
        {!loading && topQuestions.length > 0 && (
          <Card>
            <CardHeader title="Most Asked Questions" description="Questions people ask most often" />
            <div className="space-y-2">
              {topQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm text-white capitalize">{q.question}</p>
                  <span className="text-xs font-bold text-primary shrink-0 ml-3">{q.count}x</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {loading ? <CardSkeleton /> : (
            <Card className="lg:col-span-2">
              <CardHeader title="Questions This Week" description="Daily question volume" />
              {totalQ === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-600"><p className="text-sm">No data yet</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barSize={24}>
                    <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                    <Bar dataKey="questions" fill="#18181b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}

          {loading ? <CardSkeleton /> : (
            <Card className="flex flex-col items-center justify-center">
              <CardHeader title="Response Rate" description="Answered vs pending" />
              {totalQ === 0 ? (
                <div className="flex items-center justify-center h-28 text-zinc-600"><p className="text-sm">No data yet</p></div>
              ) : (
                <div className="relative">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-white">{responseRate}%</p>
                    <p className="text-xs text-zinc-500">answered</p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* All Questions with expand + export */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardHeader
              title="All Questions"
              icon={<MessageSquare className="w-4 h-4 text-primary" />}
              action={<span className="text-xs text-zinc-500">({questions?.length || 0} total)</span>}
            />
            {questions && questions.length > 0 && (
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all shrink-0">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            )}
          </div>
          {loading ? <ListSkeleton rows={5} /> : !questions || questions.length === 0 ? (
            <EmptyState icon={<MessageSquare />} title="No questions yet" description="Share your space link to start receiving questions" />
          ) : (
            <div className="space-y-2">
              {questions.map(q => (
                <div key={q._id} className="rounded-xl border border-white/[0.06] overflow-hidden transition-all hover:border-white/10">
                  <div
                    className="flex items-start justify-between gap-2 p-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{q.question}</p>
                      <p className="text-xs text-zinc-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(q.createdAt || q._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${q.isAnswered ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {q.isAnswered ? 'Answered' : 'Pending'}
                      </span>
                      {q.answer && (expandedId === q._id ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />)}
                    </div>
                  </div>
                  {expandedId === q._id && q.answer && (
                    <div className="px-4 pb-4 pt-0 border-t border-white/[0.06] bg-white/[0.02]">
                      <p className="text-xs text-zinc-400 leading-relaxed mt-3">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Visitor emails */}
        {visitorEmails && visitorEmails.length > 0 && (
          <Card>
            <CardHeader title="Visitor Emails" action={<span className="text-xs text-zinc-500">{visitorEmails.length} collected</span>} />
            <div className="space-y-2">
              {visitorEmails.map((email, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-sm text-white">{email}</span>
                  <button onClick={() => navigator.clipboard.writeText(email)} className="text-xs text-primary hover:opacity-70">Copy</button>
                </div>
              ))}
            </div>
            <button onClick={() => navigator.clipboard.writeText(visitorEmails.join('\n'))} className="mt-4 w-full py-2 rounded-xl border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors">
              Copy all emails
            </button>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
