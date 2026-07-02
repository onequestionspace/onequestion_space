'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useClerk } from '@clerk/nextjs';
import { AppearanceTab } from '@/components/AppearanceTab';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/dashboard/Card';
import { Input, Textarea, Label } from '@/components/dashboard/Input';
import { Button } from '@/components/dashboard/Button';
import {
  User, Palette, Bell, Shield, Globe,
  Save, Check, Camera, AtSign, Type, Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const { signOut } = useClerk();
  const [deleting, setDeleting] = React.useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure? This will permanently delete your account and all your data.');
    if (!confirmed) return;
    const confirmed2 = window.confirm('Last chance — are you absolutely sure?');
    if (!confirmed2) return;
    setDeleting(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch {
      alert('Something went wrong. Please contact support.');
      setDeleting(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
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
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                  : 'text-zinc-500 hover:text-white bg-white/[0.03] border border-white/[0.06]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <div className="space-y-6">

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden ring-2 ring-amber-500/30">
                    {profile?.avatar
                      ? <Image src={profile.avatar} alt="avatar" width={80} height={80} className="w-full h-full object-cover" />
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
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-amber-500 hover:text-amber-500/80 transition-colors">
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

              <div className="h-px bg-white/[0.06]" />

              {/* Username + Display Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    <AtSign className="w-3.5 h-3.5 text-zinc-500" />
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      value={form.username}
                      onChange={e => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setForm(f => ({ ...f, username: val }));
                        checkUsername(val);
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checking && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />}
                      {!checking && usernameAvailable === true && <Check className="w-3.5 h-3.5 text-green-400" />}
                      {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600">onequestion.space/{form.username}</p>
                </div>

                <div className="space-y-2">
                  <Label>
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    Display Name
                  </Label>
                  <Input
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label suffix={`${form.bio.length}/160`}>Bio</Label>
                <Textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={160}
                  placeholder="Tell visitors who you are and what you do..."
                />
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <Label>
                  <Type className="w-3.5 h-3.5 text-zinc-500" />
                  AI Welcome Message
                </Label>
                <Input
                  value={form.welcomeMessage}
                  onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="Ask me anything about building in public!"
                />
                <p className="text-xs text-zinc-600">First thing visitors see on your space.</p>
              </div>

              {/* Save */}
              <div className="flex items-center justify-between pt-2">
                {showSaved && (
                  <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Saved successfully
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={usernameAvailable === false}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'appearance' && <AppearanceTab />}

        {/* Coming soon */}
        {activeTab !== 'profile' && activeTab !== 'appearance' && (
          <Card className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              {(() => { const T = tabs.find(t => t.id === activeTab)?.icon || Palette; return <T className="w-6 h-6 text-amber-500" />; })()}
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Coming soon. We&apos;re building this next.
            </p>
          </Card>
        )}

        {/* Danger Zone */}
        <div className="rounded-2xl p-6 border border-red-500/15 bg-red-500/5">
          <h3 className="text-base font-semibold text-red-400 mb-1">Danger Zone</h3>
          <p className="text-sm text-zinc-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            loading={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
