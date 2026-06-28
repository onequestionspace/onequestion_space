'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MessageSquare, Users, TrendingUp, Brain, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2'>
        <p className='text-xs text-zinc-400'>{label}</p>
        <p className='text-sm font-bold text-white'>{payload[0].value} questions</p>
      </div>
    );
  }
  return null;
};
export default function AnalyticsPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
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

  if (!isLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
  if (!isSignedIn) { redirect('/'); }

  const totalQ = analyticsData?.totalQuestions || 0;
  const totalV = analyticsData?.totalVisitors || 0;
  const totalA = analyticsData?.totalAnswers || 0;
  const responseRate = totalQ > 0 ? Math.round((totalA / totalQ) * 100) : 0;

  const stats = [
    { label: 'Total Questions', value: totalQ, icon: MessageSquare, color: '#f59e0b' },
    { label: 'Total Visitors', value: totalV, icon: Users, color: '#3b82f6' },
    { label: 'AI Answers', value: totalA, icon: Brain, color: '#22c55e' },
    { label: 'Response Rate', value: responseRate + '%', icon: TrendingUp, color: '#f97316' },
  ];

  // Group questions by day for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      timestamp: d.setHours(0, 0, 0, 0),
      questions: 0,
    };
  });

  if (questions) {
    questions.forEach(q => {
      const qDate = new Date(q.createdAt || q._creationTime).setHours(0, 0, 0, 0);
      const day = last7Days.find(d => d.timestamp === qDate);
      if (day) day.questions++;
    });
  }

  // Pie chart data
  const pieData = [
    { name: 'Answered', value: totalA, color: '#f59e0b' },
    { name: 'Pending', value: Math.max(0, totalQ - totalA), color: '#27272a' },
  ];

  return (
    <DashboardLayout title='Analytics' description='Real-time stats for your space'>
      <div className='max-w-4xl mx-auto space-y-6'>

        {/* Stats grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map(s => (
            <div key={s.label} className='glass-card rounded-2xl p-5 border border-border'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center mb-3' style={{ backgroundColor: s.color + '20' }}>
                <s.icon className='w-4 h-4' style={{ color: s.color }} />
              </div>
              <p className='text-2xl font-bold text-foreground mb-0.5'>{s.value}</p>
              <p className='text-xs text-muted-foreground'>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

          {/* Bar chart — questions per day */}
          <div className='lg:col-span-2 glass-card rounded-2xl p-6 border border-border'>
            <h3 className='font-semibold text-foreground mb-1'>Questions This Week</h3>
            <p className='text-xs text-muted-foreground mb-4'>Daily question volume</p>
            {totalQ === 0 ? (
              <div className='flex items-center justify-center h-40 text-muted-foreground/30'>
                <p className='text-sm'>No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={160}>
                <BarChart data={last7Days} barSize={24}>
                  <XAxis dataKey='date' tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                  <Bar dataKey='questions' fill='#f59e0b' radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart — response rate */}
          <div className='glass-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center'>
            <h3 className='font-semibold text-foreground mb-1 self-start'>Response Rate</h3>
            <p className='text-xs text-muted-foreground mb-4 self-start'>Answered vs pending</p>
            {totalQ === 0 ? (
              <div className='flex items-center justify-center h-32 text-muted-foreground/30'>
                <p className='text-sm'>No data yet</p>
              </div>
            ) : (
              <div className='relative'>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx='50%' cy='50%' innerRadius={45} outerRadius={65} dataKey='value' strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <p className='text-2xl font-bold text-foreground'>{responseRate}%</p>
                  <p className='text-xs text-muted-foreground'>answered</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All questions list */}
        <div className='glass-card rounded-2xl p-6 border border-border'>
          <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
            <MessageSquare className='w-4 h-4 text-amber-500' /> All Questions
            <span className='text-xs text-muted-foreground font-normal ml-1'>({questions?.length || 0} total)</span>
          </h3>
          {!questions || questions.length === 0 ? (
            <div className='text-center py-10'>
              <MessageSquare className='w-10 h-10 text-muted-foreground/20 mx-auto mb-3' />
              <p className='text-sm text-muted-foreground'>No questions yet</p>
              <p className='text-xs text-muted-foreground/50 mt-1'>Share your space link to start receiving questions</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {questions.map(q => (
                <div key={q._id} className='p-4 rounded-xl bg-card border border-border'>
                  <div className='flex items-start justify-between gap-2 mb-1'>
                    <p className='text-foreground text-sm font-medium'>{q.question}</p>
                    <span className={'text-xs px-2 py-0.5 rounded-full shrink-0 ' + (q.isAnswered ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500')}>
                      {q.isAnswered ? 'Answered' : 'Pending'}
                    </span>
                  </div>
                  {q.answer && <p className='text-muted-foreground text-xs leading-relaxed mt-1 line-clamp-2'>{q.answer}</p>}
                  <p className='text-xs text-muted-foreground/40 flex items-center gap-1 mt-2'>
                    <Clock className='w-3 h-3' />
                    {new Date(q.createdAt || q._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      {/* Visitor Emails */}
      {visitorEmails && visitorEmails.length > 0 && (
        <div className='glass-card rounded-2xl p-6 border border-border mt-6'>
          <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
            <span>📧</span> Visitor Emails
            <span className='ml-auto text-xs text-muted-foreground'>{visitorEmails.length} collected</span>
          </h3>
          <div className='space-y-2'>
            {visitorEmails.map((email, i) => (
              <div key={i} className='flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border'>
                <span className='text-sm text-foreground'>{email}</span>
                <button onClick={() => navigator.clipboard.writeText(email)} className='text-xs text-amber-500 hover:opacity-70'>Copy</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(visitorEmails.join('\n'))}
            className='mt-4 w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground transition-colors'>
            Copy all emails
          </button>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}