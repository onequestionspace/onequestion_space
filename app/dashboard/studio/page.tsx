'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TourTooltip } from '@/components/TourTooltip';
import { AppearanceTab } from '@/components/AppearanceTab';
import {
  User, Palette, Link as LinkIcon, Quote,
  Pin, Check, Loader2, Save, Eye, Code2,
  Plus, Trash2, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'vibe', label: 'Vibe', icon: Quote },
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'pinned', label: 'Pinned', icon: Pin },
  { id: 'appearance', label: 'Style', icon: Palette },
];

const checks = (profile: Record<string, unknown> | null) => [
  { label: 'Name', done: !!(profile?.displayName) },
  { label: 'Photo', done: !!(profile?.avatar) },
  { label: 'Bio', done: !!(profile?.bio && (profile.bio as string).length > 10) },
  { label: 'Welcome', done: !!(profile?.welcomeMessage) },
  { label: 'Vibe', done: !!(profile?.vibeQuote) },
  { label: 'Links', done: (() => { try { return JSON.parse(profile?.links as string || '[]').length > 0; } catch { return false; } })() },
  { label: 'Pinned', done: ((profile?.pinnedQuestions as string[]) || []).length > 0 },
];

export default function StudioPage() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);
  const recentQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 20 } : 'skip'
  );

  const [activeTab, setActiveTab] = useState('profile');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('oq_studio_tour_seen')) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [vibeQuote, setVibeQuote] = useState('');
  const [links, setLinks] = useState<{title: string, url: string, image?: string}[]>([]);
  const [pinnedQuestions, setPinnedQuestions] = useState<string[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || '');
    setBio(profile.bio || '');
    setWelcomeMessage(profile.welcomeMessage || '');
    setVibeQuote((profile as Record<string, unknown>).vibeQuote as string || '');
    try { setLinks(JSON.parse((profile as Record<string, unknown>).links as string || '[]')); } catch { setLinks([]); }
    setPinnedQuestions((profile as Record<string, unknown>).pinnedQuestions as string[] || []);
    setSuggestedQuestions((profile as Record<string, unknown>).suggestedQuestions as string[] || []);
  }, [profile]);

  const save = async (fields: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateProfile(fields as Parameters<typeof updateProfile>[0]);
      setSaved(true);
      setTimeout(() => { setSaved(false); setPreviewKey(k => k + 1); }, 1500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const spaceUrl = profile?.username ? '/' + profile.username : null;
  const completionChecks = checks(profile as Record<string, unknown> | null);
  const score = Math.round((completionChecks.filter(c => c.done).length / completionChecks.length) * 100);
  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-zinc-600 resize-none";

  const saveBtn = (fields: Record<string, unknown>) => (
    <button onClick={() => save(fields)} disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-black text-sm font-black bg-primary hover:opacity-90 transition-all disabled:opacity-50 mt-4">
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
    <DashboardLayout title="Space Studio" description="Changes go live instantly">
      <div className="max-w-2xl mx-auto lg:max-w-7xl">

        {/* Completion bar */}
        <div className="mb-4 rounded-2xl p-4 border border-white/8 bg-white/3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-black text-white">{score}% complete</span>
            </div>
            {spaceUrl && (
              <Link href={spaceUrl} target="_blank" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                <ExternalLink className="w-3 h-3" /> View live
              </Link>
            )}
          </div>
          <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: score + '%' }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {completionChecks.map((c, i) => (
              <span key={i} className={"text-[10px] px-2 py-0.5 rounded-full border " + (c.done ? "border-green-500/20 bg-green-500/8 text-green-400" : "border-white/8 text-zinc-600")}>
                {c.done ? "✓ " : ""}{c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8 mb-4 lg:hidden">
          <button onClick={() => setMode('edit')}
            className={"flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all " + (mode === 'edit' ? "bg-primary text-black" : "text-zinc-500 hover:text-white")}>
            <Code2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => { setMode('preview'); setPreviewKey(k => k + 1); }}
            className={"flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all " + (mode === 'preview' ? "bg-primary text-black" : "text-zinc-500 hover:text-white")}>
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

        <div className="flex gap-6">
          {/* Edit Panel */}
          <div className={"w-full lg:w-[400px] shrink-0 space-y-3 " + (mode === 'preview' ? "hidden lg:block" : "")}>
            <div data-tour="tabs" className="flex gap-1 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={"flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0 " + (activeTab === tab.id ? "bg-primary text-black" : "text-zinc-500 hover:text-white bg-white/3 border border-white/8")}>
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl p-5 border border-white/8 bg-white/3">

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-xl font-black text-white shrink-0">
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || ''} width={56} height={56} className="w-full h-full object-cover" />
                        : profile.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{profile.displayName}</p>
                      <p className="text-xs text-zinc-500">@{profile.username}</p>
                      <Link href="/dashboard/settings" className="text-xs text-primary hover:text-primary/80 mt-0.5 block">Change photo →</Link>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Display Name</label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Bio <span className="text-zinc-600 font-normal">{bio.length}/160</span></label>
                    <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 160))} rows={3} className={inputClass} placeholder="One line that makes people want to ask you something" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">AI Welcome Message</label>
                    <input value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} className={inputClass} placeholder="Ask me anything — I reply fast." />
                    <p className="text-xs text-zinc-600 mt-1">First thing visitors see on your space</p>
                  </div>
                  {saveBtn({ displayName, bio, welcomeMessage })}
                </div>
              )}

              {activeTab === 'vibe' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Vibe Quote <span className="text-zinc-600 font-normal">{vibeQuote.length}/200</span></label>
                    <p className="text-xs text-zinc-600 mb-2">One sentence that shows your personality.</p>
                    <textarea value={vibeQuote} onChange={e => setVibeQuote(e.target.value.slice(0, 200))} rows={3} className={inputClass} placeholder="Building from a phone. Ask me anything." />
                  </div>
                  {vibeQuote && (
                    <div className="p-4 rounded-xl bg-primary/8 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-black">Preview</p>
                      <p className="text-sm text-white italic">&ldquo;{vibeQuote}&rdquo;</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Suggested Questions</label>
                    <p className="text-xs text-zinc-600 mb-2">3 questions visitors see as prompts on your space.</p>
                    <div className="space-y-2">
                      {[0,1,2].map(i => (
                        <input key={i} value={suggestedQuestions[i] || ""} onChange={e => { const next = [...suggestedQuestions]; next[i] = e.target.value; setSuggestedQuestions(next); }} placeholder={"Question " + (i+1) + "..."} className={inputClass} />
                      ))}
                    </div>
                  </div>
                  {saveBtn({ vibeQuote, suggestedQuestions })}
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-zinc-400 mb-1">Your Links</p>
                    <p className="text-xs text-zinc-600 mb-3">Pin up to 5 links. Add a photo to make them pop.</p>
                  </div>
                  <div className="space-y-3">
                    {links.map((link, i) => (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input value={link.title} onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }} placeholder="Label" className={inputClass} />
                          <input value={link.url} onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }} placeholder="https://..." className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                          {link.image ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={link.image} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => { const next = [...links]; next[i].image = ''; setLinks(next); }}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs">x</button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-primary/40 transition-all text-xs cursor-pointer shrink-0">
                              + Photo
                              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                try {
                                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (data.url) { const next = [...links]; next[i].image = data.url; setLinks(next); }
                                } catch {}
                              }} />
                            </label>
                          )}
                          <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="ml-auto p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {links.length < 5 && (
                    <button onClick={() => setLinks([...links, { title: '', url: '' }])}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-primary/40 transition-all text-xs w-full justify-center">
                      <Plus className="w-3.5 h-3.5" /> Add Link
                    </button>
                  )}
                  {saveBtn({ links: JSON.stringify(links.filter(l => l.title || l.url)) })}
                </div>
              )}

              {activeTab === 'pinned' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-zinc-400 mb-1">Pinned Answers</p>
                    <p className="text-xs text-zinc-600 mb-3">Pick up to 3 best answers to showcase.</p>
                  </div>
                  {recentQuestions && recentQuestions.filter(q => q.isAnswered).length > 0 ? (
                    <div className="space-y-2">
                      {recentQuestions.filter(q => q.isAnswered).map(q => {
                        const isPinned = pinnedQuestions.includes(q._id);
                        return (
                          <div key={q._id}
                            className={"p-3 rounded-xl border transition-all cursor-pointer " + (isPinned ? "border-primary/40 bg-primary/8" : "border-white/8 hover:border-white/20 bg-white/3")}
                            onClick={() => {
                              if (isPinned) setPinnedQuestions(pinnedQuestions.filter(id => id !== q._id));
                              else if (pinnedQuestions.length < 3) setPinnedQuestions([...pinnedQuestions, q._id]);
                            }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white line-clamp-1">{q.question}</p>
                                {q.answer && <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{q.answer}</p>}
                              </div>
                              <div className={"w-4 h-4 rounded-full border shrink-0 flex items-center justify-center " + (isPinned ? "border-primary bg-primary" : "border-white/20")}>
                                {isPinned && <Check className="w-2.5 h-2.5 text-black" />}
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
                      <p className="text-xs mt-1 text-zinc-700">Share your space to get questions</p>
                    </div>
                  )}
                  {pinnedQuestions.length > 0 && saveBtn({ pinnedQuestions })}
                </div>
              )}

              {activeTab === 'appearance' && <AppearanceTab />}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={"flex-1 min-w-0 " + (mode === 'edit' ? "hidden lg:block" : "")}>
            <div className="sticky top-6">
              <div data-tour="preview" className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-black">Your space — live</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewKey(k => k + 1)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  {spaceUrl && (
                    <Link href={spaceUrl} target="_blank"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/10">
                      <ExternalLink className="w-3 h-3" /> Open
                    </Link>
                  )}
                </div>
              </div>

              {spaceUrl ? (
                <div className="relative mx-auto" style={{ width: '320px' }}>
                  <div className="relative rounded-[2.5rem] border-[5px] border-zinc-700 overflow-hidden shadow-2xl" style={{ height: '640px', background: '#000' }}>
                    <div className="absolute top-0 left-0 right-0 h-7 bg-black z-10 flex items-center justify-between px-5">
                      <span className="text-[10px] text-white/50 font-mono">9:41</span>
                      <div className="w-20 h-4 bg-black rounded-full border border-zinc-800" />
                      <span className="text-[10px] text-white/50">●●●</span>
                    </div>
                    <iframe key={previewKey} src={spaceUrl} className="w-full h-full pt-7" title="Space Preview" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-600 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center" style={{ height: '500px' }}>
                  <div className="text-center text-zinc-600">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Complete onboarding first</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {showTour && (
        <TourTooltip
          steps={[
            { target: '[data-tour="tabs"]', title: 'Build your space here', desc: 'Profile, Vibe, Links, Pinned answers, and Style — each tab customizes part of your space.', position: 'bottom' },
            { target: '[data-tour="preview"]', title: 'Live preview', desc: 'See exactly how your space looks to visitors. Updates instantly when you save.', position: 'left' },
            { target: '[data-tour="save"]', title: 'Save your changes', desc: 'Hit Save after editing each section. Changes go live immediately.', position: 'top' },
          ]}
          onDone={() => {
            setShowTour(false);
            localStorage.setItem('oq_studio_tour_seen', '1');
          }}
        />
      )}
    </DashboardLayout>
  );
}
