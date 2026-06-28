const fs = require('fs');
const c = `'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
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
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [vibeQuote, setVibeQuote] = useState('');
  const [links, setLinks] = useState<{title: string, url: string, image?: string}[]>([]);
  const [pinnedQuestions, setPinnedQuestions] = useState<string[]>([]);

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
`;
fs.writeFileSync('app/dashboard/studio/page.tsx', c);
console.log('Part 1 done');
