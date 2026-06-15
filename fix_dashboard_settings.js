const fs = require('fs');

const dashboardLayout = `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Brain, BarChart3,
  Settings, Menu, X, ArrowLeft,
  MessageSquare, CreditCard, User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: Brain },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.08),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-zinc-900 border border-white/10 rounded-xl shadow-lg"
      >
        {isOpen
          ? <X className="w-5 h-5 text-white" />
          : <Menu className="w-5 h-5 text-white" />
        }
      </button>

      {/* Sidebar */}
      <aside className={\`fixed left-0 top-0 h-full w-64 bg-zinc-950/95 border-r border-white/8 backdrop-blur-xl p-6 z-40 transform transition-transform duration-200 \${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0\`}>

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">One Question</span>
        </Link>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all \${
                  isActive
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }\`}
              >
                <item.icon className={\`w-4 h-4 \${isActive ? 'text-purple-400' : 'text-zinc-500'}\`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-px bg-white/8" />
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={closeMenu} />
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 p-4 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-zinc-400 text-sm">{description}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('components/DashboardLayout.tsx', dashboardLayout);
console.log('✅ DashboardLayout — full nav, real colors, mobile fixed');

const settings = `'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppearanceTab } from '@/components/AppearanceTab';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  User, Bell, Shield, Palette, Globe, Save, Check,
  Camera, AtSign, Type, Loader2
} from 'lucide-react';

const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all placeholder:text-zinc-600";
const labelClass = "text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2";
const cardClass = "rounded-2xl p-6 border border-white/8 bg-white/3 backdrop-blur-sm space-y-6";

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    welcomeMessage: '',
  });

  useEffect(() => {
    if (profile) {
      setTimeout(() => setForm({
        username: profile.username || '',
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        welcomeMessage: profile.welcomeMessage || '',
      }), 0);
    }
  }, [profile]);

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-zinc-500">Loading...</div>
    </div>
  );

  if (!isSignedIn) { redirect('/'); }

  const checkUsername = async (val: string) => {
    if (!val || val.length < 3 || val === profile?.username) {
      setUsernameAvailable(null);
      return;
    }
    setChecking(true);
    try {
      const res = await fetch('/api/check-username?username=' + val);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch { setUsernameAvailable(null); }
    setChecking(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mimeType: file.type }),
      });
      const data = await res.json();
      if (data.dataUrl) {
        await updateProfile({ avatar: data.dataUrl });
      }
    } catch (e) { console.error(e); }
    setAvatarUploading(false);
  };

  const handleSave = async () => {
    if (usernameAvailable === false) return;
    setIsSaving(true);
    try {
      await updateProfile({
        username: form.username,
        displayName: form.displayName,
        bio: form.bio,
        welcomeMessage: form.welcomeMessage,
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (e) { console.error(e); }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'domain', label: 'Domain', icon: Globe },
  ];

  const initials = form.displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <DashboardLayout title="Settings" description="Manage your account and space.">
      <div className="flex flex-col gap-6">

        {/* Tab bar — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 \${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                  : 'text-zinc-500 hover:text-white bg-white/3 border border-white/8'
              }\`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className={cardClass}>

            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-rose-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden ring-2 ring-purple-500/30">
                  {profile?.avatar
                    ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    : initials
                  }
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
                >
                  {avatarUploading
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <Camera className="w-5 h-5" />
                  }
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div>
                <p className="text-white font-semibold">{form.displayName || 'Your Name'}</p>
                <p className="text-zinc-500 text-xs mb-3">onequestion.space/{form.username}</p>
                <div className="flex gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    Upload photo
                  </button>
                  {profile?.avatar && (
                    <button onClick={() => updateProfile({ avatar: '' })} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            {/* Username + Display Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <AtSign className="w-3.5 h-3.5 text-zinc-500" />
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      setForm(f => ({ ...f, username: val }));
                      checkUsername(val);
                    }}
                    className={inputClass}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />}
                    {!checking && usernameAvailable === true && <Check className="w-3.5 h-3.5 text-green-400" />}
                    {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 mt-1">onequestion.space/{form.username}</p>
              </div>

              <div>
                <label className={labelClass}>
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                maxLength={160}
                className={inputClass + ' resize-none'}
                placeholder="Tell visitors who you are and what you do..."
              />
              <p className="text-xs text-zinc-600 mt-1 text-right">{form.bio.length}/160</p>
            </div>

            {/* Welcome Message */}
            <div>
              <label className={labelClass}>
                <Type className="w-3.5 h-3.5 text-zinc-500" />
                AI Welcome Message
              </label>
              <input
                type="text"
                value={form.welcomeMessage}
                onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                placeholder="Ask me anything about building in public!"
                className={inputClass}
              />
              <p className="text-xs text-zinc-600 mt-1">First thing visitors see on your space.</p>
            </div>

            {/* Save */}
            <div className="pt-2 flex items-center justify-between">
              {showSaved && (
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Saved successfully
                </span>
              )}
              {!showSaved && <span />}
              <button
                onClick={handleSave}
                disabled={isSaving || usernameAvailable === false}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && <AppearanceTab />}

        {/* Coming soon */}
        {activeTab !== 'profile' && activeTab !== 'appearance' && (
          <div className="rounded-2xl p-12 border border-white/8 bg-white/3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
              {(() => { const T = tabs.find(t => t.id === activeTab)?.icon || Palette; return <T className="w-6 h-6 text-purple-400" />; })()}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Coming soon. We are building this next.
            </p>
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-2xl p-6 border border-red-500/15 bg-red-500/5">
          <h3 className="text-base font-semibold text-red-400 mb-1">Danger Zone</h3>
          <p className="text-sm text-zinc-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
          <button className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
`;

fs.writeFileSync('app/dashboard/settings/page.tsx', settings);
console.log('✅ Settings — mobile tabs, visible inputs, real colors');

console.log('\nDone. Build and push.');
