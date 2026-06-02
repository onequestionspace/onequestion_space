'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BarChart3, 
  Brain, 
  Settings, 
  CreditCard,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react';

/**
 * Dashboard Page
 * Main hub for authenticated users with brand design
 */
export default function DashboardPage() {
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
    { label: 'Total Questions', value: '0', icon: MessageSquare, color: 'text-primary' },
    { label: 'Profile Views', value: '0', icon: Users, color: 'text-pink' },
    { label: 'Response Rate', value: '0%', icon: TrendingUp, color: 'text-yellow' },
    { label: 'AI Answers', value: '0', icon: Brain, color: 'text-accent' },
  ];

  const quickLinks = [
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: Brain },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background mesh */}
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
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

          {/* Main Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Questions</h2>
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No questions yet</p>
                <p className="text-sm text-muted-foreground/70">Share your profile link to start receiving questions</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-medium hover:shadow-glow-primary transition-all">
                  Share Profile
                </button>
                <button className="w-full py-3 px-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-primary/10 transition-all">
                  View Analytics
                </button>
                <button className="w-full py-3 px-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-primary/10 transition-all">
                  Train AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
