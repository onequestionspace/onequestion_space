'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TourTooltip } from '@/components/TourTooltip';
import { AppearanceTab } from '@/components/AppearanceTab';
import { Input, Textarea, Label } from '@/components/dashboard/Input';
import { Button } from '@/components/dashboard/Button';
import { Skeleton } from '@/components/dashboard/Skeleton';
import { Badge } from '@/components/dashboard/Badge';
import { useToast } from '@/components/dashboard/Toast';
import {
  User, Palette, Link as LinkIcon, Quote,
  Pin, Check, Save, Eye, Code2,
  Plus, Trash2, Sparkles, ExternalLink, RefreshCw,
  AlertCircle, Image as ImageIcon, Undo2, Layout,
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

type StudioForm = {
  displayName: string;
  bio: string;
  welcomeMessage: string;
  vibeQuote: string;
  links: { title: string; url: string; image?: string }[];
  pinnedQuestions: string[];
  suggestedQuestions: string[];
};

const emptyForm: StudioForm = {
  displayName: '',
  bio: '',
  welcomeMessage: '',
  vibeQuote: '',
  links: [],
  pinnedQuestions: [],
  suggestedQuestions: [],
};

export default function StudioPage() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);
  const { toast } = useToast();

  const [form, setForm] = useState<StudioForm>(emptyForm);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [previewKey, setPreviewKey] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const recentQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 20 } : 'skip'
  );

  useEffect(() => {
    if (!localStorage.getItem('oq_studio_tour_seen')) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (!profile || initialized) return;
    setForm({
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      welcomeMessage: profile.welcomeMessage || '',
      vibeQuote: (profile as Record<string, unknown>).vibeQuote as string || '',
      links: (() => { try { return JSON.parse((profile as Record<string, unknown>).links as string || '[]'); } catch { return []; } })(),
      pinnedQuestions: (profile as Record<string, unknown>).pinnedQuestions as string[] || [],
      suggestedQuestions: (profile as Record<string, unknown>).suggestedQuestions as string[] || [],
    });
    setDirty(false);
    setInitialized(true);
  }, [profile, initialized]);

  const updateField = useCallback(<K extends keyof StudioForm>(key: K, value: StudioForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        displayName: form.displayName,
        bio: form.bio,
        welcomeMessage: form.welcomeMessage,
        vibeQuote: form.vibeQuote,
        links: JSON.stringify(form.links.filter(l => l.title || l.url)),
        pinnedQuestions: form.pinnedQuestions,
        suggestedQuestions: form.suggestedQuestions,
      } as any);
      setDirty(false);
      setPreviewKey(k => k + 1);
      toast({ type: 'success', title: 'Saved!', description: 'Your space is live with the latest changes.' });
    } catch (e) {
      console.error(e);
      toast({ type: 'error', title: 'Failed to save', description: 'Something went wrong. Please try again.' });
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!profile) return;
    setForm({
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      welcomeMessage: profile.welcomeMessage || '',
      vibeQuote: (profile as Record<string, unknown>).vibeQuote as string || '',
      links: (() => { try { return JSON.parse((profile as Record<string, unknown>).links as string || '[]'); } catch { return []; } })(),
      pinnedQuestions: (profile as Record<string, unknown>).pinnedQuestions as string[] || [],
      suggestedQuestions: (profile as Record<string, unknown>).suggestedQuestions as string[] || [],
    });
    setDirty(false);
    toast({ type: 'info', title: 'Reset', description: 'Reverted to last saved state.' });
  };

  const spaceUrl = profile?.username ? '/' + profile.username : null;
  const initials = form.displayName?.charAt(0)?.toUpperCase() || profile?.username?.charAt(0)?.toUpperCase() || '?';

  const completionChecks = [
    { label: 'Name', done: !!form.displayName },
    { label: 'Photo', done: !!profile?.avatar },
    { label: 'Bio', done: form.bio.length > 10 },
    { label: 'Welcome', done: !!form.welcomeMessage },
    { label: 'Vibe', done: !!form.vibeQuote },
    { label: 'Links', done: form.links.filter(l => l.title || l.url).length > 0 },
    { label: 'Pinned', done: form.pinnedQuestions.length > 0 },
  ];
  const score = Math.round((completionChecks.filter(c => c.done).length / completionChecks.length) * 100);

  if (!profile) return (
    <DashboardLayout title="Space Studio" description="Build your perfect space">
      <div className="flex items-center justify-center h-64">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Space Studio" description="Changes go live instantly">
      <div className="space-y-4">

        {/* Completion bar */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Layout className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-white">{score}% complete</span>
            </div>
            <div className="flex items-center gap-3">
              {spaceUrl && (
                <Link href={spaceUrl} target="_blank" className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-500/80 transition-colors">
                  <ExternalLink className="w-3 h-3" /> View live
                </Link>
              )}
              <Badge variant={dirty ? 'warning' : 'success'}>{dirty ? 'Unsaved' : 'Saved'}</Badge>
            </div>
          </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-gradient transition-all duration-700" style={{ width: `${score}%`, backgroundSize: '200% 100%' }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {completionChecks.map((c, i) => (
              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                c.done ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-white/[0.06] text-zinc-600'
              }`}>
                {c.done ? '✓' : '○'} {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Save bar */}
        {dirty && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] to-transparent backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm text-zinc-400 flex-1">You have unsaved changes</p>
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<Undo2 className="w-3 h-3" />}>Reset</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<Save className="w-3 h-3" />}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/[0.06] lg:hidden">
          <button onClick={() => setMode('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'edit' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black' : 'text-zinc-500 hover:text-white'
            }`}>
            <Code2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => setMode('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'preview' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black' : 'text-zinc-500 hover:text-white'
            }`}>
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

        <div className="flex gap-6">
          <div className={`w-full lg:w-[420px] shrink-0 space-y-3 ${mode === 'preview' ? 'hidden lg:block' : ''}`}>
            <div data-tour="tabs" className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
                    activeTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm' : 'text-zinc-500 hover:text-white'
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/[0.06]">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl font-bold text-white shrink-0 ring-2 ring-amber-500/30 shadow-lg">
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={form.displayName || ''} width={56} height={56} className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{form.displayName || 'Your Name'}</p>
                      <p className="text-xs text-zinc-500">@{profile.username}</p>
                      <Link href="/dashboard/settings" className="text-xs text-amber-500 hover:text-amber-500/80 mt-0.5 block transition-colors">Change photo →</Link>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={form.displayName} onChange={e => updateField('displayName', e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label suffix={`${form.bio.length}/160`}>Bio</Label>
                    <Textarea value={form.bio} onChange={e => updateField('bio', e.target.value.slice(0, 160))} rows={3} placeholder="One line that makes people want to ask you something" />
                  </div>
                  <div className="space-y-2">
                    <Label>AI Welcome Message</Label>
                    <Input value={form.welcomeMessage} onChange={e => updateField('welcomeMessage', e.target.value)} placeholder="Ask me anything — I reply fast." />
                    <p className="text-xs text-zinc-600">First thing visitors see on your space</p>
                  </div>
                </div>
              )}

              {activeTab === 'vibe' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label suffix={`${form.vibeQuote.length}/200`}>Vibe Quote</Label>
                    <p className="text-xs text-zinc-500 mb-2">One sentence that shows your personality.</p>
                    <Textarea value={form.vibeQuote} onChange={e => updateField('vibeQuote', e.target.value.slice(0, 200))} rows={3} placeholder="Building from a phone. Ask me anything." />
                  </div>
                  {form.vibeQuote && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-400 mb-1 font-medium">Preview</p>
                      <p className="text-sm text-white italic">&ldquo;{form.vibeQuote}&rdquo;</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Suggested Questions</Label>
                    <p className="text-xs text-zinc-500 mb-2">3 questions visitors see as prompts on your space.</p>
                    <div className="space-y-2">
                      {[0,1,2].map(i => (
                        <Input key={i} value={form.suggestedQuestions[i] || ""} onChange={e => {
                          const next = [...form.suggestedQuestions];
                          next[i] = e.target.value;
                          updateField('suggestedQuestions', next);
                        }} placeholder={"Question " + (i+1) + "..."} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-300 mb-1">Your Links</p>
                    <p className="text-xs text-zinc-500 mb-3">Pin up to 5 links. Add a photo to make them pop.</p>
                  </div>
                  <div className="space-y-3">
                    {form.links.map((link, i) => (
                      <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2 hover:border-white/15 transition-all">
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <Input value={link.title} onChange={e => {
                              const next = [...form.links];
                              next[i] = { ...next[i], title: e.target.value };
                              updateField('links', next);
                            }} placeholder="Label" />
                            <Input value={link.url} onChange={e => {
                              const next = [...form.links];
                              next[i] = { ...next[i], url: e.target.value };
                              updateField('links', next);
                            }} placeholder="https://..." />
                          </div>
                          <button onClick={() => updateField('links', form.links.filter((_, j) => j !== i))}
                            className="self-start p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {link.image ? (
                          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10">
                            <Image src={link.image} alt="" width={400} height={96} className="w-full h-full object-cover" />
                            <button onClick={() => {
                              const next = [...form.links];
                              next[i] = { ...next[i], image: '' };
                              updateField('links', next);
                            }} className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-amber-500/40 transition-all text-xs cursor-pointer">
                            <ImageIcon className="w-4 h-4" />
                            Add cover image
                            <input type="file" accept="image/*" className="hidden" onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('file', file);
                              try {
                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                const data = await res.json();
                                if (data.url) {
                                  const next = [...form.links];
                                  next[i] = { ...next[i], image: data.url };
                                  updateField('links', next);
                                }
                              } catch {}
                            }} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  {form.links.length < 5 && (
                    <button onClick={() => updateField('links', [...form.links, { title: '', url: '' }])}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-amber-500/40 transition-all text-xs w-full justify-center">
                      <Plus className="w-3.5 h-3.5" /> Add Link
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'pinned' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-300 mb-1">Pinned Answers</p>
                    <p className="text-xs text-zinc-500 mb-3">Pick up to 3 best answers to showcase.</p>
                  </div>
                  {recentQuestions && recentQuestions.filter(q => q.isAnswered).length > 0 ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {recentQuestions.filter(q => q.isAnswered).map(q => {
                        const isPinned = form.pinnedQuestions.includes(q._id);
                        return (
                          <div key={q._id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              isPinned ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-transparent' : 'border-white/[0.06] hover:border-white/20 bg-white/[0.02]'
                            }`}
                            onClick={() => {
                              if (isPinned) {
                                updateField('pinnedQuestions', form.pinnedQuestions.filter(id => id !== q._id));
                              } else if (form.pinnedQuestions.length < 3) {
                                updateField('pinnedQuestions', [...form.pinnedQuestions, q._id]);
                              }
                            }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white line-clamp-1">{q.question}</p>
                                {q.answer && <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{q.answer}</p>}
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                isPinned ? 'border-amber-500 bg-gradient-to-br from-amber-500 to-orange-500' : 'border-white/20'
                              }`}>
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
                </div>
              )}

              {activeTab === 'appearance' && <AppearanceTab />}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`flex-1 min-w-0 ${mode === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-6">
              <div data-tour="preview" className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-medium">Live Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewKey(k => k + 1)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  {spaceUrl && (
                    <Link href={spaceUrl} target="_blank"
                      className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-500/80 transition-colors px-2 py-1 rounded-lg hover:bg-amber-500/10">
                      <ExternalLink className="w-3 h-3" /> Open
                    </Link>
                  )}
                </div>
              </div>

              {spaceUrl ? (
                <div className="rounded-2xl border border-white/[0.06] bg-black/40 overflow-hidden shadow-xl">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] text-zinc-600 mx-auto font-mono">{spaceUrl}</span>
                  </div>
                  <iframe key={previewKey} src={spaceUrl} className="w-full h-[600px]" title="Space Preview" />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center h-96">
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
