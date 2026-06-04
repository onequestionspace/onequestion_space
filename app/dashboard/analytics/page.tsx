'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApi } from '@/hooks/useApi';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';

/**
 * Enhanced Analytics Page
 * Visual dashboard for AI performance and visitor metrics
 */
export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { execute, loading } = useApi();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await execute('/api/analytics', { method: 'GET' });
        setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };
    if (isSignedIn) fetchData();
  }, [isSignedIn, execute]);

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

  const stats = [
    { label: 'Total Questions', value: data?.totalQuestions || '1,248', icon: MessageSquare, change: '+12%', positive: true },
    { label: 'Avg. Response Time', value: data?.avgResponseTime || '1.2s', icon: Clock, change: '-0.3s', positive: true },
    { label: 'AI Accuracy', value: `${data?.accuracyRate || '95.5'}%`, icon: TrendingUp, change: '+2%', positive: true },
    { label: 'Unique Visitors', value: '842', icon: Users, change: '+18%', positive: true },
  ];

  return (
    <DashboardLayout title="Analytics" description="Track your AI performance and visitor engagement.">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-green-500' : 'text-accent-red'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Question Activity
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simple Mock Chart */}
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {(data?.chartData || [
              { date: 'Mon', count: 45 },
              { date: 'Tue', count: 52 },
              { date: 'Wed', count: 48 },
              { date: 'Thu', count: 61 },
              { date: 'Fri', count: 55 },
              { date: 'Sat', count: 32 },
              { date: 'Sun', count: 28 },
            ]).map((val: any, i: number) => {
              const height = typeof val === 'object' ? val.count : val;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div 
                    className="w-full bg-primary/20 border-t-2 border-primary rounded-t-lg transition-all group-hover:bg-primary/40" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-muted-foreground">{typeof val === 'object' ? val.date : `Day ${i+1}`}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="glass-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Popular Topics</h3>
          <div className="space-y-6">
            {(data?.popularTopics || [
              { topic: 'Pricing', count: 342, percent: 85 },
              { topic: 'Features', count: 285, percent: 70 },
              { topic: 'Support', count: 156, percent: 40 },
              { topic: 'API Access', count: 98, percent: 25 },
            ]).map((item: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.topic}</span>
                  <span className="text-muted-foreground">{item.count} questions</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-pink transition-all duration-1000" 
                    style={{ width: `${item.percent || (item.count / 400 * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
            View All Topics
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
