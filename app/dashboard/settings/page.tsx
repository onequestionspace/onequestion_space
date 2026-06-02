'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';

/**
 * Settings Page
 * User profile and account settings with brand design
 */
export default function SettingsPage() {
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

  const settingsSections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your public profile and username',
      action: 'Edit Profile',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email and push notifications',
      action: 'Manage',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control who can see your content',
      action: 'Configure',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your profile theme and colors',
      action: 'Customize',
    },
    {
      icon: Globe,
      title: 'Domain',
      description: 'Connect a custom domain to your profile',
      action: 'Setup',
    },
  ];

  return (
    <DashboardLayout title="Settings" description="Manage your account and preferences.">
      <div className="space-y-4">
        {settingsSections.map((section) => (
          <div key={section.title} className="glass-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                  <p className="text-muted-foreground text-sm">{section.description}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-primary/10 transition-colors">
                {section.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-10 glass-card rounded-2xl p-6 border border-accent/30">
        <h2 className="text-xl font-semibold text-accent mb-4">Danger Zone</h2>
        <p className="text-muted-foreground mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl border border-accent/50 text-accent text-sm font-medium hover:bg-accent/10 transition-colors">
            Delete All Data
          </button>
          <button className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
