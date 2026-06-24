'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AppearanceTab } from '@/components/AppearanceTab';
import {
  User, Palette, Link as LinkIcon, Quote,
  Pin, Check, Loader2, ExternalLink,
  Plus, Trash2, Save, Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Photo, name, bio' },
  { id: 'vibe', label: 'Vibe', icon: Quote, desc: 'Quote & about block' },
  { id: 'links', label: 'Links', icon: LinkIcon, desc: 'Pin your best links' },
  { id: 'pinned', label: 'Pinned Q&A', icon: Pin, desc: 'Showcase top answers' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Colors & backgrounds' },
];

export default function StudioPage() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);
  const recentQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 20 } : 'skip'
  );

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [vibeQuote, setVibeQuote] = useState('');
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  const [pinnedQuestions, setPinnedQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || '');
    setBio(profile.bio || '');
    setWelcomeMessage(profile.welcomeMessage || '');
    setVibeQuote((profile as Record<string, unknown>).vibeQuote as string || '');
    try {
      setLinks(JSON.parse((profile as Record<string, unknown>).links as string || '[]'));
    } catch { setLinks([]); }
    setPinnedQuestions((profile as Record<string, unknown>).pinnedQuestions as string[] || []);
  }, [profile]);

  const save = async (fields: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateProfile(fields as Parameters<typeof updateProfile>[0]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const checks = [
    { label: 'Display name', done: !!profile?.displayName },
    { label: 'Profile photo', done: !!profile?.avatar },
    { label: 'Bio', done: !!(profile?.bio && profile.bio.length > 10) },
    { label: 'Welcome message', done: !!profile?.welcomeMessage },
    { label: 'Vibe quote', done: !!(profile as Record<string, unknown>)?.vibeQuote },
    { label: 'Links added', done: (() => { try { return JSON.parse((profile as Record<string, unknown>)?.links as string || '[]').length > 0; } catch { return false; } })() },
    { label: 'Pinned answer', done: ((profile as Record<string, unknown>)?.pinnedQuestions as string[] || []).length > 0 },
  ];
  const score = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  if (!profile) return (
    <DashboardLayout title="Space Studio" description="Build your perfect space">
      <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Space Studio ✦" description="Everything about your space in one place">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Completion Score */}
        <div className="glass-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-lg">Space Completion</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Complete your space to get more visitors</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-foreground">{score}%</p>
              <Link href={'/' + profile.username} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 justify-end mt-1">
                <Eye className="w-3 h-3" /> Preview
              </Link>
            </div>
          </div>
          <div className="w-full h-2 bg-card rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-pink transition-all duration-500" style={{ width: score + '%' }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {checks.map((c, i) => (
              <div key={i} className={'flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ' + (c.done ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-border text-muted-foreground')}>
                <div className={'w-4 h-4 rounded-full flex items-center justify-center shrink-0 ' + (c.done ? 'bg-green-500' : 'bg-white/10')}>
                  {c.done && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ' +
                (activeTab === tab.id ? 'bg-primary/10 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground hover:bg-white/5')}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-2xl p-6 border border-border">

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                  {profile.avatar
                    ? <Image src={profile.avatar} alt={profile.displayName} width={64} height={64} className="w-full h-full object-cover" />
                    : profile.displayName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{profile.username}</p>
                  <Link href="/dashboard/profile" className="text-xs text-primary hover:underline mt-1 block">Change photo →</Link>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 160))} rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="One line that makes people want to ask you something" />
                <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/160</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Welcome Message</label>
                <p className="text-xs text-muted-foreground mb-2">First thing visitors see on your space</p>
                <input value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Ask me anything about building in public!" />
              </div>
              <button onClick={() => save({ displayName, bio, welcomeMessage })} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-primary to-pink hover:opacity-90 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Profile'}
              </button>
            </div>
          )}

          {activeTab === 'vibe' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Vibe Quote</label>
                <p className="text-xs text-muted-foreground mb-3">One sentence that shows your personality. Shows prominently on your space.</p>
                <textarea value={vibeQuote} onChange={e => setVibeQuote(e.target.value.slice(0, 200))} rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="e.g. Building the future from a phone in Kaduna, Nigeria." />
                <p className="text-xs text-muted-foreground text-right mt-1">{vibeQuote.length}/200</p>
              </div>
              {vibeQuote && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary mb-2">Preview on your space</p>
                  <p className="text-sm text-foreground italic">&ldquo;{vibeQuote}&rdquo;</p>
                </div>
              )}
              <button onClick={() => save({ vibeQuote })} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-primary to-pink hover:opacity-90 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Vibe'}
              </button>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Your Links</h3>
                <p className="text-xs text-muted-foreground mb-4">Pin up to 5 links on your space.</p>
              </div>
              <div className="space-y-3">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input value={link.title} onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }}
                        placeholder="Label (e.g. My Project)"
                        className="px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <input value={link.url} onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }}
                        placeholder="https://..."
                        className="px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {links.length < 5 && (
                <button onClick={() => setLinks([...links, { title: '', url: '' }])}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm w-full justify-center">
                  <Plus className="w-4 h-4" /> Add Link
                </button>
              )}
              <button onClick={() => save({ links: JSON.stringify(links.filter(l => l.title && l.url)) })} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-primary to-pink hover:opacity-90 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Links'}
              </button>
            </div>
          )}

          {activeTab === 'pinned' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Pinned Answers</h3>
                <p className="text-xs text-muted-foreground mb-4">Pick up to 3 best answers to show on your space.</p>
              </div>
              {recentQuestions && recentQuestions.filter(q => q.isAnswered).length > 0 ? (
                <div className="space-y-3">
                  {recentQuestions.filter(q => q.isAnswered).map(q => {
                    const isPinned = pinnedQuestions.includes(q._id);
                    return (
                      <div key={q._id}
                        className={'p-4 rounded-xl border transition-all cursor-pointer ' + (isPinned ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20')}
                        onClick={() => {
                          if (isPinned) setPinnedQuestions(pinnedQuestions.filter(id => id !== q._id));
                          else if (pinnedQuestions.length < 3) setPinnedQuestions([...pinnedQuestions, q._id]);
                        }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{q.question}</p>
                            {q.answer && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{q.answer}</p>}
                          </div>
                          <div className={'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ' + (isPinned ? 'border-primary bg-primary' : 'border-border')}>
                            {isPinned && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Pin className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No answered questions yet</p>
                  <p className="text-xs mt-1">Share your space to get questions</p>
                </div>
              )}
              {pinnedQuestions.length > 0 && (
                <button onClick={() => save({ pinnedQuestions })} disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-primary to-pink hover:opacity-90 transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Pin ' + pinnedQuestions.length + ' answer' + (pinnedQuestions.length > 1 ? 's' : '')}
                </button>
              )}
            </div>
          )}

          {activeTab === 'appearance' && <AppearanceTab />}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Also:</span>
          <Link href="/dashboard/knowledge" className="hover:text-primary transition-colors">Knowledge Base</Link>
          <span>·</span>
          <Link href="/dashboard/analytics" className="hover:text-primary transition-colors">Analytics</Link>
          <span>·</span>
          <Link href="/dashboard/billing" className="hover:text-primary transition-colors">Billing</Link>
          <span>·</span>
          <Link href={'/' + profile.username} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
            View Space <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
