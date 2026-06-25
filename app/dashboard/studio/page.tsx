'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AppearanceTab } from '@/components/AppearanceTab';
import {
  User, Palette, Link as LinkIcon, Quote,
  Pin, Check, Loader2, Save, Eye, EyeOff,
  Plus, Trash2, RefreshCw, Sparkles, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'vibe', label: 'Vibe', icon: Quote },
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'pinned', label: 'Pinned Q&A', icon: Pin },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const checks = (profile: Record<string, unknown> | null) => [
  { label: 'Display name', done: !!(profile?.displayName) },
  { label: 'Photo', done: !!(profile?.avatar) },
  { label: 'Bio', done: !!(profile?.bio && (profile.bio as string).length > 10) },
  { label: 'Welcome message', done: !!(profile?.welcomeMessage) },
  { label: 'Vibe quote', done: !!(profile?.vibeQuote) },
  { label: 'Links', done: (() => { try { return JSON.parse(profile?.links as string || '[]').length > 0; } catch { return false; } })() },
  { label: 'Pinned Q&A', done: ((profile?.pinnedQuestions as string[]) || []).length > 0 },
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
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [vibeQuote, setVibeQuote] = useState('');
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  const [pinnedQuestions, setPinnedQuestions] = useState<string[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || '');
    setBio(profile.bio || '');
    setWelcomeMessage(profile.welcomeMessage || '');
    setVibeQuote((profile as Record<string, unknown>).vibeQuote as string || '');
    try { setLinks(JSON.parse((profile as Record<string, unknown>).links as string || '[]')); } catch { setLinks([]); }
    setPinnedQuestions((profile as Record<string, unknown>).pinnedQuestions as string[] || []);
  }, [profile]);

  const save = async (fields: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateProfile(fields as Parameters<typeof updateProfile>[0]);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setPreviewKey(k => k + 1);
      }, 1500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const spaceUrl = profile?.username ? '/' + profile.username : null;
  const completionChecks = checks(profile as Record<string, unknown> | null);
  const score = Math.round((completionChecks.filter(c => c.done).length / completionChecks.length) * 100);

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all placeholder:text-zinc-600 resize-none";
  const saveBtn = (fields: Record<string, unknown>) => (
    <button
      onClick={() => save(fields)}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-purple-600 to-rose-500 hover:opacity-90 transition-all disabled:opacity-50 mt-4"
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved ? 'Saved!' : 'Save'}
    </button>
  );

  if (!profile) return (
    <DashboardLayout title="Space Studio" description="Build your perfect space">
      <div className="flex items-center justify-center h-64 text-zinc-500">Loading...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Space Studio ✦" description="Your space updates as you build">
      <div className="max-w-7xl mx-auto">

        {/* Completion bar */}
        <div className="mb-6 rounded-2xl p-4 border border-white/8 bg-white/3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">Space Completion</span>
              <span className="text-xs text-zinc-500">· {score}%</span>
            </div>
            {spaceUrl && (
              <Link href={spaceUrl} target="_blank" className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                <ExternalLink className="w-3 h-3" /> View live
              </Link>
            )}
          </div>
          <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-rose-500 transition-all duration-700"
              style={{ width: score + '%' }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {completionChecks.map((c, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${c.done ? 'border-green-500/20 bg-green-500/8 text-green-400' : 'border-white/8 text-zinc-600'}`}>
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${c.done ? 'bg-green-500' : 'bg-white/10'}`}>
                  {c.done && <Check className="w-2 h-2 text-white" />}
                </div>
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left — Edit Panel */}
          <div className="w-full lg:w-[420px] shrink-0 space-y-4">

            {/* Tab nav */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 border ${
                    activeTab === tab.id
                      ? 'bg-purple-600/20 text-purple-400 border-purple-500/20'
                      : 'text-zinc-500 hover:text-white bg-white/3 border-white/8'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Edit card */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 backdrop-blur-sm">

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-purple-600/20 flex items-center justify-center text-xl font-bold text-white shrink-0">
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || ''} width={56} height={56} className="w-full h-full object-cover" />
                        : profile.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{profile.displayName}</p>
                      <p className="text-xs text-zinc-500">@{profile.username}</p>
                      <Link href="/dashboard/settings" className="text-xs text-purple-400 hover:text-purple-300 mt-0.5 block">Change photo →</Link>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Display Name</label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Bio <span className="text-zinc-600">{bio.length}/160</span></label>
                    <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 160))} rows={3} className={inputClass} placeholder="One line that makes people want to ask you something" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">AI Welcome Message</label>
                    <input value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} className={inputClass} placeholder="Ask me anything about building in public!" />
                    <p className="text-xs text-zinc-600 mt-1">First thing visitors see on your space</p>
                  </div>
                  {saveBtn({ displayName, bio, welcomeMessage })}
                </div>
              )}

              {activeTab === 'vibe' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Vibe Quote <span className="text-zinc-600">{vibeQuote.length}/200</span></label>
                    <p className="text-xs text-zinc-600 mb-2">One sentence that shows your personality. Shows prominently on your space.</p>
                    <textarea value={vibeQuote} onChange={e => setVibeQuote(e.target.value.slice(0, 200))} rows={3} className={inputClass} placeholder="Building the future from a phone in Nigeria." />
                  </div>
                  {vibeQuote && (
                    <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/20">
                      <p className="text-xs text-purple-400 mb-1">Preview</p>
                      <p className="text-sm text-white italic">&ldquo;{vibeQuote}&rdquo;</p>
                    </div>
                  )}
                  {saveBtn({ vibeQuote })}
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-400 mb-1">Your Links</p>
                    <p className="text-xs text-zinc-600 mb-3">Pin up to 5 links on your space.</p>
                  </div>
                  <div className="space-y-2">
                    {links.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            value={link.title}
                            onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }}
                            placeholder="Label"
                            className={inputClass}
                          />
                          <input
                            value={link.url}
                            onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }}
                            placeholder="https://..."
                            className={inputClass}
                          />
                        </div>
                        <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {links.length < 5 && (
                    <button onClick={() => setLinks([...links, { title: '', url: '' }])} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-purple-500/40 transition-all text-xs w-full justify-center">
                      <Plus className="w-3.5 h-3.5" /> Add Link
                    </button>
                  )}
                  {saveBtn({ links: JSON.stringify(links.filter(l => l.title && l.url)) })}
                </div>
              )}

              {activeTab === 'pinned' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-400 mb-1">Pinned Answers</p>
                    <p className="text-xs text-zinc-600 mb-3">Pick up to 3 best answers to showcase.</p>
                  </div>
                  {recentQuestions && recentQuestions.filter(q => q.isAnswered).length > 0 ? (
                    <div className="space-y-2">
                      {recentQuestions.filter(q => q.isAnswered).map(q => {
                        const isPinned = pinnedQuestions.includes(q._id);
                        return (
                          <div
                            key={q._id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${isPinned ? 'border-purple-500/40 bg-purple-500/8' : 'border-white/8 hover:border-purple-500/20 bg-white/3'}`}
                            onClick={() => {
                              if (isPinned) setPinnedQuestions(pinnedQuestions.filter(id => id !== q._id));
                              else if (pinnedQuestions.length < 3) setPinnedQuestions([...pinnedQuestions, q._id]);
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white line-clamp-1">{q.question}</p>
                                {q.answer && <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{q.answer}</p>}
                              </div>
                              <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isPinned ? 'border-purple-500 bg-purple-500' : 'border-white/20'}`}>
                                {isPinned && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-600">
                      <Pin className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No answered questions yet</p>
                      <p className="text-xs mt-1">Share your space to get questions</p>
                    </div>
                  )}
                  {pinnedQuestions.length > 0 && saveBtn({ pinnedQuestions })}
                </div>
              )}

              {activeTab === 'appearance' && <AppearanceTab />}
            </div>
          </div>

          {/* Right — Live Preview */}
          <div className="flex-1 min-w-0">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-medium">Live Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewKey(k => k + 1)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  <button
                    onClick={() => setShowPreview(v => !v)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5 lg:hidden"
                  >
                    {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPreview ? 'Hide' : 'Show'}
                  </button>
                  {spaceUrl && (
                    <Link href={spaceUrl} target="_blank" className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded-lg hover:bg-purple-500/10">
                      <ExternalLink className="w-3 h-3" /> Open
                    </Link>
                  )}
                </div>
              </div>

              {showPreview && spaceUrl ? (
                <div className="rounded-2xl border border-white/8 overflow-hidden bg-zinc-950" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
                  <iframe
                    key={previewKey}
                    ref={iframeRef}
                    src={spaceUrl}
                    className="w-full h-full"
                    title="Space Preview"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
                  <div className="text-center text-zinc-600">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">
                      {!spaceUrl ? 'Complete onboarding to see your space' : 'Preview hidden'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
