'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, StatsCard } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatsCardSkeleton, CardSkeleton, ListSkeleton } from '@/components/dashboard/Skeleton';
import { MessageSquare, Users, Brain, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} questions</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.current);
  const analyticsData = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const visitorEmails = useQuery(api.questions.getVisitorEmails, profile?._id ? { profileId: profile._id } : 'skip');
  const questions = useQuery(
    api.questions.getQuestionsByProfile,
    profile?._id ? { profileId: profile._id } : 'skip'
  );

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const loading = analyticsData === undefined || questions === undefined;

  const totalQ = analyticsData?.totalQuestions || 0;
  const totalV = analyticsData?.totalVisitors || 0;
  const totalA = analyticsData?.totalAnswers || 0;
  const responseRate = totalQ > 0 ? Math.round((totalA / totalQ) * 100) : 0;

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        timestamp: d.setHours(0, 0, 0, 0),
        questions: 0,
      };
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
    { name: 'Answered', value: totalA, color: '#f59e0b' },
    { name: 'Pending', value: Math.max(0, totalQ - totalA), color: '#27272a' },
  ], [totalA, totalQ]);

  return (
    <DashboardLayout title="Analytics" description="Real-time stats for your space">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">

        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
          ) : (
            <>
              <StatsCard label="Total Questions" value={totalQ} icon={<MessageSquare className="w-4 h-4" />} color="#f59e0b" />
              <StatsCard label="Total Visitors" value={totalV} icon={<Users className="w-4 h-4" />} color="#3b82f6" />
              <StatsCard label="AI Answers" value={totalA} icon={<Brain className="w-4 h-4" />} color="#22c55e" />
              <StatsCard label="Response Rate" value={responseRate + '%'} icon={<TrendingUp className="w-4 h-4" />} color="#f97316" />
            </>
          )}
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {loading ? (
            <CardSkeleton />
          ) : (
            <Card className="lg:col-span-2">
              <CardHeader title="Questions This Week" description="Daily question volume" />
              {totalQ === 0 ? (
                <div className="flex items-center justify-center h-40 text-zinc-600">
                  <p className="text-sm">No data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barSize={24}>
                    <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                    <Bar dataKey="questions" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card className="flex flex-col items-center justify-center">
              <CardHeader title="Response Rate" description="Answered vs pending" />
              {totalQ === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-600">
                  <p className="text-sm">No data yet</p>
                </div>
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
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader
              title="All Questions"
              icon={<MessageSquare className="w-4 h-4 text-amber-500" />}
              action={<span className="text-xs text-zinc-500">({questions?.length || 0} total)</span>}
            />
            {loading ? (
              <ListSkeleton rows={5} />
            ) : !questions || questions.length === 0 ? (
              <EmptyState
                icon={<MessageSquare />}
                title="No questions yet"
                description="Share your space link to start receiving questions"
              />
            ) : (
              <div className="space-y-3">
                {questions.map(q => (
                  <div key={q._id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] transition-all duration-150 hover:bg-white/[0.04]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{q.question}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        q.isAnswered ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {q.isAnswered ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    {q.answer && <p className="text-zinc-500 text-xs leading-relaxed mt-1 line-clamp-2">{q.answer}</p>}
                    <p className="text-xs text-zinc-600 flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3" />
                      {new Date(q.createdAt || q._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {visitorEmails && visitorEmails.length > 0 && (
          <motion.div variants={item}>
            <Card>
              <CardHeader
                title="Visitor Emails"
                icon={<span className="text-lg">📧</span>}
                action={<span className="text-xs text-zinc-500">{visitorEmails.length} collected</span>}
              />
              <div className="space-y-2">
                {visitorEmails.map((email, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-sm text-white">{email}</span>
                    <button onClick={() => navigator.clipboard.writeText(email)} className="text-xs text-amber-500 hover:opacity-70">
                      Copy
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(visitorEmails.join('\n'))}
                className="mt-4 w-full py-2 rounded-xl border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                Copy all emails
              </button>
            </Card>
          </motion.div>
        )}

      </motion.div>
    </DashboardLayout>
  );
}
