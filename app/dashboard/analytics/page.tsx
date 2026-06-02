'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

/**
 * Analytics Page
 * View Q&A statistics and insights with brand design
 */
export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();

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
    { label: 'Total Questions', value: '0', icon: MessageSquare, color: 'text-primary', change: '+0%' },
    { label: 'Answered', value: '0', icon: TrendingUp, color: 'text-pink', change: '+0%' },
    { label: 'Total Visitors', value: '0', icon: Users, color: 'text-yellow', change: '+0%' },
    { label: 'Avg Response Time', value: '0s', icon: Clock, color: 'text-accent', change: '-0%' },
  ];

  return (
    <DashboardLayout title="Analytics" description="Track your Q&A performance and insights.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Questions Over Time</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Chart coming soon</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Response Rate</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Chart coming soon</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
