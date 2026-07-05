'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, StatsCard } from '@/components/dashboard/Card';
import { Badge } from '@/components/dashboard/Badge';
import { Input } from '@/components/dashboard/Input';
import { Button } from '@/components/dashboard/Button';
import { Crown, Zap, Users, Trash2, Plus, Shield, BarChart3, Search, Mail, CreditCard } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
  'user_3Fmuk2jHEa5seXKEzewhWlA9yQs',
];
const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';

export default function AdminPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [tab, setTab] = useState<'overview' | 'users' | 'founding' | 'early' | 'waitlist' | 'grant' | 'seed'>('overview');
  const [search, setSearch] = useState('');
  const [grantForm, setGrantForm] = useState<{ userId: string; username: string; displayName: string; type: 'founding' | 'earlyAdopter' }>({ userId: '', username: '', displayName: '', type: 'founding' });
  const [granting, setGranting] = useState(false);
  const [msg, setMsg] = useState('');
  const [creditForm, setCreditForm] = useState({ userId: '', credits: 50 });
  const [addingCredits, setAddingCredits] = useState(false);
  const [seedForm, setSeedForm] = useState({ username: '', displayName: '', bio: '' });
  const [seeding, setSeeding] = useState(false);
  const [claimUrl, setClaimUrl] = useState('');
  const [seedForm, setSeedForm] = useState({ username: '', displayName: '', bio: '' });
  const [seeding, setSeeding] = useState(false);
  const [claimUrl, setClaimUrl] = useState('');

  const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;
  const adminId = user?.id || ADMIN_ID;

  const profiles = useQuery(api.admin.getAllProfiles, isAdmin ? { adminId } : 'skip');
  const founders = useQuery(api.admin.getAllFoundingMembers, isAdmin ? { adminId } : 'skip');
  const earlyAdopters = useQuery(api.admin.getAllEarlyAdopters, isAdmin ? { adminId } : 'skip');
  const waitlist = useQuery(api.waitlist.getWaitlist, isAdmin ? {} : 'skip');

  const grantFoundingBadge = useMutation(api.admin.grantFoundingBadge);
  const grantEarlyAdopterBadge = useMutation(api.admin.grantEarlyAdopterBadge);
  const removeBadge = useMutation(api.admin.removeBadge);
  const deleteProfile = useMutation(api.admin.deleteProfile);
  const addCredits = useMutation(api.subscriptions.addCredits);
  const seedProfile = useMutation(api.profiles.seedProfile);
  const seedProfile = useMutation(api.profiles.seedProfile);

  if (!clerkLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );

  if (!isAdmin) return (
    <DashboardLayout title="Admin" description="Restricted area">
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-white font-bold text-xl mb-2">Access Denied</p>
        <p className="text-zinc-500 text-sm">You do not have permission to view this page.</p>
        <p className="text-xs text-zinc-700 mt-4 font-mono">Your ID: {user?.id}</p>
      </div>
    </DashboardLayout>
  );

  const handleGrant = async () => {
    if (!grantForm.userId || !grantForm.username || !grantForm.displayName) return;
    setGranting(true); setMsg('');
    try {
      const result: any = grantForm.type === 'founding'
        ? await grantFoundingBadge({ adminId: adminId, ...grantForm })
        : await grantEarlyAdopterBadge({ adminId: adminId, ...grantForm });
      setMsg(result?.success ? 'Badge granted!' : 'Already has badge');
      if (result?.success) setGrantForm({ userId: '', username: '', displayName: '', type: 'founding' });
    } catch { setMsg('Error granting badge'); }
    setGranting(false);
  };

  const handleRemoveBadge = async (userId: string, type: 'founding' | 'earlyAdopter') => {
    if (!confirm('Remove this badge?')) return;
    await removeBadge({ adminId: adminId, userId, type });
  };

  const handleDeleteProfile = async (profileId: any) => {
    if (!confirm('Delete this profile permanently?')) return;
    await deleteProfile({ adminId: adminId, profileId });
  };

  const handleSeedProfile = async () => {
    if (!seedForm.username || !seedForm.displayName) return;
    setSeeding(true); setMsg(''); setClaimUrl('');
    try {
      const result: any = await seedProfile({ adminId, ...seedForm });
      setClaimUrl(`https://onequestion.space${result.claimUrl}`);
      setMsg('Profile seeded!');
      setSeedForm({ username: '', displayName: '', bio: '' });
    } catch (e: any) { setMsg(e.message || 'Error seeding profile'); }
    setSeeding(false);
  };

  const handleSeedProfile = async () => {
    if (!seedForm.username || !seedForm.displayName) return;
    setSeeding(true); setMsg(''); setClaimUrl('');
    try {
      const result: any = await seedProfile({ adminId, ...seedForm });
      setClaimUrl(`https://onequestion.space${result.claimUrl}`);
      setMsg('Profile seeded!');
      setSeedForm({ username: '', displayName: '', bio: '' });
    } catch (e: any) { setMsg(e.message || 'Error seeding profile'); }
    setSeeding(false);
  };

  const handleAddCredits = async () => {
    if (!creditForm.userId || !creditForm.credits) return;
    setAddingCredits(true);
    try {
      await addCredits({ userId: creditForm.userId, credits: creditForm.credits });
      setMsg('Credits added!');
      setCreditForm({ userId: '', credits: 50 });
    } catch { setMsg('Error adding credits'); }
    setAddingCredits(false);
  };

  const filteredProfiles = profiles?.filter(p =>
    !search || p.username?.toLowerCase().includes(search.toLowerCase()) || p.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'founding', label: 'Founders', icon: Crown },
    { id: 'early', label: 'Early', icon: Zap },
    { id: 'waitlist', label: 'Waitlist', icon: Mail },
    { id: 'grant', label: 'Grant', icon: Plus },
    { id: 'seed', label: 'Seed', icon: Users },
    { id: 'seed', label: 'Seed', icon: Users },
  ];

  return (
    <DashboardLayout title="Admin Panel" description="Manage users, badges, credits and spaces">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">

        <motion.div variants={item} className="flex flex-wrap gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                tab === t.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </motion.div>

        {msg && (
          <motion.div variants={item}>
            <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">{msg}</div>
          </motion.div>
        )}

        {tab === 'overview' && (
          <motion.div variants={item} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard label="Total Spaces" value={profiles?.length ?? 0} color="#f59e0b" />
              <StatsCard label="Founding Members" value={founders?.length ?? 0} color="#f59e0b" />
              <StatsCard label="Early Adopters" value={earlyAdopters?.length ?? 0} color="#06b6d4" />
              <StatsCard label="Waitlist" value={waitlist?.length ?? 0} color="#22c55e" />
            </div>
            <Card>
              <CardHeader title="Add Credits to User" icon={<CreditCard className="w-4 h-4 text-amber-500" />} />
              <div className="space-y-3">
                <Input
                  value={creditForm.userId}
                  onChange={e => setCreditForm(f => ({ ...f, userId: e.target.value }))}
                  placeholder="Clerk User ID"
                />
                <div className="flex gap-3">
                  <Input
                    type="number"
                    value={creditForm.credits}
                    onChange={e => setCreditForm(f => ({ ...f, credits: parseInt(e.target.value) || 0 }))}
                  />
                  <Button onClick={handleAddCredits} loading={addingCredits}>
                    {addingCredits ? 'Adding...' : 'Add Credits'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'users' && (
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by username or name..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-500">{filteredProfiles?.length ?? 0} of {profiles?.length ?? 0} users</p>
            {filteredProfiles?.map(p => (
              <div key={p._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{p.displayName}</p>
                    <p className="text-zinc-500 text-xs font-mono">/{p.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={(p as any).plan === 'pro' ? 'default' : 'neutral'} className="capitalize">{(p as any).plan ?? 'free'}</Badge>
                    <button onClick={() => handleDeleteProfile(p._id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>💬 {(p as any).totalQuestions ?? 0} questions</span>
                  <span>🧠 {(p as any).knowledgeCount ?? 0} knowledge</span>
                  <span>⚡ {(p as any).messagesUsed ?? 0}/{(p as any).messagesLimit ?? 50} credits</span>
                </div>
                <p className="text-zinc-700 text-xs font-mono mt-1">{p.userId}</p>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'founding' && (
          <motion.div variants={item} className="space-y-3">
            <p className="text-xs text-zinc-500">{founders?.length ?? 0} / 5 founding members</p>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" style={{ width: ((founders?.length ?? 0) / 5 * 100) + '%' }} />
            </div>
            {founders?.map(f => (
              <div key={f._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <p className="text-white font-medium text-sm">{f.displayName}</p>
                    <Badge variant="default">#{f.spotNumber}</Badge>
                  </div>
                  <p className="text-zinc-500 text-xs">/{f.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(f.userId, 'founding')} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'early' && (
          <motion.div variants={item} className="space-y-3">
            <p className="text-xs text-zinc-500">{earlyAdopters?.length ?? 0} / 50 early adopters</p>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: ((earlyAdopters?.length ?? 0) / 50 * 100) + '%' }} />
            </div>
            {earlyAdopters?.map(e => (
              <div key={e._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <p className="text-white font-medium text-sm">{e.displayName}</p>
                    <Badge variant="info">#{e.spotNumber}</Badge>
                  </div>
                  <p className="text-zinc-500 text-xs">/{e.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(e.userId, 'earlyAdopter')} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'waitlist' && (
          <motion.div variants={item} className="space-y-3">
            <p className="text-xs text-zinc-500">{waitlist?.length ?? 0} people waiting</p>
            {waitlist?.map((w: any) => (
              <div key={w._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{w.name || 'Anonymous'}</p>
                    <p className="text-zinc-500 text-xs">{w.email}</p>
                    {w.username && <p className="text-amber-500 text-xs">@{w.username}</p>}
                  </div>
                  <p className="text-xs text-zinc-500">{new Date(w.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'grant' && (
          <motion.div variants={item}>
            <Card>
              <CardHeader title="Grant Badge" icon={<Plus className="w-4 h-4 text-amber-500" />} />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGrantForm(f => ({ ...f, type: 'founding' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      grantForm.type === 'founding' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" /> Founding
                  </button>
                  <button
                    onClick={() => setGrantForm(f => ({ ...f, type: 'earlyAdopter' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      grantForm.type === 'earlyAdopter' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" /> Early Adopter
                  </button>
                </div>
                <Input value={grantForm.userId} onChange={e => setGrantForm(f => ({ ...f, userId: e.target.value }))} placeholder="Clerk User ID (user_xxx)" />
                <Input value={grantForm.username} onChange={e => setGrantForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" />
                <Input value={grantForm.displayName} onChange={e => setGrantForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Display Name" />
                {msg && <p className="text-xs text-center text-amber-500">{msg}</p>}
                <Button variant="primary" className="w-full" onClick={handleGrant} loading={granting}>
                  {granting ? 'Granting...' : 'Grant Badge'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'seed' && (
          <motion.div variants={item}>
            <Card>
              <CardHeader title="Seed a Prospect Page" icon={<Users className="w-4 h-4 text-amber-500" />} />
              <div className="space-y-3">
                <Input value={seedForm.username} onChange={e => setSeedForm(f => ({ ...f, username: e.target.value }))} placeholder="Username (e.g. alexey)" />
                <Input value={seedForm.displayName} onChange={e => setSeedForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Display Name" />
                <Input value={seedForm.bio} onChange={e => setSeedForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio (optional)" />
                <Button variant="primary" className="w-full" onClick={handleSeedProfile} loading={seeding}>
                  {seeding ? 'Seeding...' : 'Create Claim Link'}
                </Button>
                {claimUrl && (
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-400 break-all select-all">
                    {claimUrl}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'seed' && (
          <motion.div variants={item}>
            <Card>
              <CardHeader title="Seed a Prospect Page" icon={<Users className="w-4 h-4 text-amber-500" />} />
              <div className="space-y-3">
                <Input value={seedForm.username} onChange={e => setSeedForm(f => ({ ...f, username: e.target.value }))} placeholder="Username (e.g. alexey)" />
                <Input value={seedForm.displayName} onChange={e => setSeedForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Display Name" />
                <Input value={seedForm.bio} onChange={e => setSeedForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio (optional)" />
                <Button variant="primary" className="w-full" onClick={handleSeedProfile} loading={seeding}>
                  {seeding ? 'Seeding...' : 'Create Claim Link'}
                </Button>
                {claimUrl && (
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-400 break-all select-all">
                    {claimUrl}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

      </motion.div>
    </DashboardLayout>
  );
}
