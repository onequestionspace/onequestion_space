'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  Check, 
  X,
  Camera,
  AtSign,
  Type
} from 'lucide-react';

/**
 * Enhanced Settings Page
 * Detailed customization and account management with API-ready forms
 */
export default function SettingsPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Mock form state
  const [profileForm, setProfileForm] = useState({
    username: 'asym',
    displayName: 'Asym Alwali',
    bio: 'Building AI-powered products and technical architecture',
    welcomeMessage: 'Ask me anything about building AI products!',
    primaryColor: '#a855f7',
  });

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

  const handleSave = async () => {
    setIsSaving(true);
    // API Call: await updateProfile(profileForm);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'domain', label: 'Domain', icon: Globe },
  ];

  return (
    <DashboardLayout title="Settings" description="Manage your account and preferences.">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-8 border border-border space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                    {profileForm.displayName.charAt(0)}
                  </div>
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs font-medium text-primary hover:underline">Upload new</button>
                    <button className="text-xs font-medium text-accent-red hover:underline">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-[10px] text-muted-foreground">onequestion.space/{profileForm.username}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-muted-foreground" />
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={profileForm.welcomeMessage}
                  onChange={(e) => setProfileForm({...profileForm, welcomeMessage: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showSaved && (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium animate-in fade-in slide-in-from-left-2">
                      <Check className="w-3 h-3" />
                      Changes saved
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-glow-primary transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Other tabs placeholders */}
          {activeTab !== 'profile' && (
            <div className="glass-card rounded-2xl p-12 border border-border text-center">
              <Palette className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                These settings are coming soon. We&apos;re currently prioritizing core features.
              </p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="glass-card rounded-2xl p-8 border border-accent-red/20 bg-accent-red/5">
            <h3 className="text-lg font-semibold text-accent-red mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-6">Permanently delete your account and all associated knowledge.</p>
            <button className="px-6 py-2.5 rounded-xl border border-accent-red/30 text-accent-red text-sm font-bold hover:bg-accent-red hover:text-white transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
