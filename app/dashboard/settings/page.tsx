'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  User, Bell, Shield, Palette, Globe, Save, Check,
  Camera, AtSign, Type, Loader2
} from 'lucide-react';

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
      <div className="animate-pulse text-muted-foreground">Loading...</div>
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
      const res = await fetch(`/api/check-username?username=${val}`);
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        await updateProfile({ avatar: data.url });
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
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full lg:w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-card border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-8 border border-border space-y-8">

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
                  >
                    {avatarUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-primary hover:underline">
                      Upload new
                    </button>
                    {profile?.avatar && (
                      <button onClick={() => updateProfile({ avatar: '' })} className="text-xs font-medium text-red-400 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Username + Display Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
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
                      className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-8"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checking && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                      {!checking && usernameAvailable === true && <Check className="w-3.5 h-3.5 text-green-500" />}
                      {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">onequestion.space/{form.username}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-[10px] text-muted-foreground text-right">{form.bio.length}/160</p>
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-muted-foreground" />
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={form.welcomeMessage}
                  onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="Ask me anything about building in public!"
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[10px] text-muted-foreground">Shown as the AI greeting on your space.</p>
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                {showSaved && (
                  <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                    <Check className="w-3 h-3" />
                    Changes saved
                  </span>
                )}
                {!showSaved && <span />}
                <button
                  onClick={handleSave}
                  disabled={isSaving || usernameAvailable === false}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-glow-primary transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Coming soon tabs */}
          {activeTab !== 'profile' && (
            <div className="glass-card rounded-2xl p-12 border border-border text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {(() => { const T = tabs.find(t => t.id === activeTab)?.icon || Palette; return <T className="w-6 h-6 text-primary" />; })()}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">Coming soon. We are prioritizing core features first.</p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-6">Permanently delete your account and all associated data.</p>
            <button className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
