'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Crown, Zap, Users, Trash2, Plus, Shield, BarChart3, Brain, CreditCard, Search, Mail, RefreshCw } from 'lucide-react';

const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];
const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';

export default function AdminPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [tab, setTab] = useState<'overview' | 'users' | 'founding' | 'early' | 'waitlist' | 'grant'>('overview');
  const [search, setSearch] = useState('');
  const [grantForm, setGrantForm] = useState({ userId: '', username: '', displayName: '', type: 'founding' });
  const [granting, setGranting] = useState(false);
  const [msg, setMsg] = useState('');
  const [creditForm, setCreditForm] = useState({ userId: '', credits: 50 });
  const [addingCredits, setAddingCredits] = useState(false);

  const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;
  const adminId = user?.id || ADMIN_ID;

  const profiles = useQuery(api.admin.getAllProfilesWithStats, isAdmin ? { adminId } : 'skip');
  const founders = useQuery(api.admin.getAllFoundingMembers, isAdmin ? { adminId } : 'skip');
  const earlyAdopters = useQuery(api.admin.getAllEarlyAdopters, isAdmin ? { adminId } : 'skip');
  const waitlist = useQuery(api.waitlist.getWaitlist, isAdmin ? {} : 'skip');

  const grantFoundingBadge = useMutation(api.admin.grantFoundingBadge);
  const grantEarlyAdopterBadge = useMutation(api.admin.grantEarlyAdopterBadge);
  const removeBadge = useMutation(api.admin.removeBadge);
  const deleteProfile = useMutation(api.admin.deleteProfile);
  const addCredits = useMutation(api.subscriptions.addCredits);

  if (!clerkLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
  if (!isAdmin) return (
    <DashboardLayout title='Admin' description='Restricted area'>
      <div className='text-center py-20'>
        <Shield className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
        <p className='text-white font-bold text-xl mb-2'>Access Denied</p>
        <p className='text-muted-foreground text-sm'>You do not have permission to view this page.</p>
        <p className='text-xs text-muted-foreground mt-4 font-mono'>Your ID: {user?.id}</p>
      </div>
    </DashboardLayout>
  );

  const handleGrant = async () => {
    if (!grantForm.userId || !grantForm.username || !grantForm.displayName) return;
    setGranting(true); setMsg('');
    try {
      const result = grantForm.type === 'founding'
        ? await grantFoundingBadge({ adminId: ADMIN_ID, ...grantForm })
        : await grantEarlyAdopterBadge({ adminId: ADMIN_ID, ...grantForm });
      setMsg(result.success ? 'Badge granted!' : 'Already has badge');
      if (result.success) setGrantForm({ userId: '', username: '', displayName: '', type: 'founding' });
    } catch { setMsg('Error granting badge'); }
    setGranting(false);
  };

  const handleRemoveBadge = async (userId: string, type: 'founding' | 'earlyAdopter') => {
    if (!confirm('Remove this badge?')) return;
    await removeBadge({ adminId: ADMIN_ID, userId, type });
  };

  const handleDeleteProfile = async (profileId: any) => {
    if (!confirm('Delete this profile permanently?')) return;
    await deleteProfile({ adminId: ADMIN_ID, profileId });
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'founding', label: 'Founders', icon: Crown },
    { id: 'early', label: 'Early', icon: Zap },
    { id: 'waitlist', label: 'Waitlist', icon: Mail },
    { id: 'grant', label: 'Grant', icon: Plus },
  ];

  return (
    <DashboardLayout title='Admin Panel' description='Manage users, badges, credits and spaces'>
      <div className='max-w-4xl mx-auto space-y-6'>

        {/* Tab bar */}
        <div className='flex flex-wrap gap-2'>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ' + (tab === t.id ? 'bg-amber-500 text-white' : 'bg-white/5 text-muted-foreground hover:text-white')}
            >
              <t.icon className='w-3.5 h-3.5' /> {t.label}
            </button>
          ))}
        </div>

        {msg && <div className='px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm'>{msg}</div>}

        {/* Overview */}
        {tab === 'overview' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {[
                { label: 'Total Spaces', value: profiles?.length ?? 0, color: '#f59e0b' },
                { label: 'Founding Members', value: founders?.length ?? 0, color: '#f59e0b' },
                { label: 'Early Adopters', value: earlyAdopters?.length ?? 0, color: '#06b6d4' },
                { label: 'Waitlist', value: waitlist?.length ?? 0, color: '#22c55e' },
              ].map(s => (
                <div key={s.label} className='glass-card rounded-2xl p-5 border border-border text-center'>
                  <p className='text-3xl font-black text-white mb-1'>{s.value}</p>
                  <p className='text-xs text-muted-foreground'>{s.label}</p>
                </div>
              ))}
            </div>
            <div className='glass-card rounded-2xl p-6 border border-border'>
              <h3 className='font-bold text-white mb-4 flex items-center gap-2'><CreditCard className='w-4 h-4 text-amber-500' /> Add Credits to User</h3>
              <div className='space-y-3'>
                <input value={creditForm.userId} onChange={e => setCreditForm(f => ({ ...f, userId: e.target.value }))} placeholder='Clerk User ID' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50' />
                <div className='flex gap-3'>
                  <input type='number' value={creditForm.credits} onChange={e => setCreditForm(f => ({ ...f, credits: parseInt(e.target.value) || 0 }))} className='flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50' />
                  <button onClick={handleAddCredits} disabled={addingCredits} className='px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold disabled:opacity-50'>
                    {addingCredits ? 'Adding...' : 'Add Credits'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5'>
              <Search className='w-4 h-4 text-muted-foreground' />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by username or name...' className='flex-1 bg-transparent text-white text-sm placeholder:text-muted-foreground focus:outline-none' />
            </div>
            <p className='text-xs text-muted-foreground'>{filteredProfiles?.length ?? 0} of {profiles?.length ?? 0} users</p>
            {filteredProfiles?.map(p => (
              <div key={p._id} className='glass-card rounded-xl p-4 border border-border'>
                <div className='flex items-center justify-between gap-3 mb-2'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-white font-medium text-sm'>{p.displayName}</p>
                    <p className='text-muted-foreground text-xs font-mono'>/{p.username}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={'text-xs px-2 py-0.5 rounded-full font-medium ' + ((p as any).plan === 'pro' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-zinc-400')}>{(p as any).plan ?? 'free'}</span>
                    <button onClick={() => handleDeleteProfile(p._id)} className='p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors'>
                      <Trash2 className='w-3.5 h-3.5 text-muted-foreground' />
                    </button>
                  </div>
                </div>
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  <span>💬 {(p as any).totalQuestions ?? 0} questions</span>
                  <span>🧠 {(p as any).knowledgeCount ?? 0} knowledge</span>
                  <span>⚡ {(p as any).messagesUsed ?? 0}/{(p as any).messagesLimit ?? 50} credits</span>
                </div>
                <p className='text-zinc-700 text-xs font-mono mt-1'>{p.userId}</p>
              </div>
            ))}
          </div>
        )}

        {/* Founders */}
        {tab === 'founding' && (
          <div className='space-y-3'>
            <p className='text-xs text-muted-foreground'>{founders?.length ?? 0} / 5 founding members</p>
            <div className='w-full h-2 bg-white/5 rounded-full overflow-hidden'>
              <div className='h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full' style={{ width: ((founders?.length ?? 0) / 5 * 100) + '%' }} />
            </div>
            {founders?.map(f => (
              <div key={f._id} className='glass-card rounded-xl p-4 border border-border flex items-center justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <Crown className='w-3.5 h-3.5 text-yellow-400' />
                    <p className='text-white font-medium text-sm'>{f.displayName}</p>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400'>#{f.spotNumber}</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>/{f.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(f.userId, 'founding')} className='p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors'>
                  <Trash2 className='w-3.5 h-3.5 text-muted-foreground' />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Early Adopters */}
        {tab === 'early' && (
          <div className='space-y-3'>
            <p className='text-xs text-muted-foreground'>{earlyAdopters?.length ?? 0} / 50 early adopters</p>
            <div className='w-full h-2 bg-white/5 rounded-full overflow-hidden'>
              <div className='h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full' style={{ width: ((earlyAdopters?.length ?? 0) / 50 * 100) + '%' }} />
            </div>
            {earlyAdopters?.map(e => (
              <div key={e._id} className='glass-card rounded-xl p-4 border border-border flex items-center justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <Zap className='w-3.5 h-3.5 text-cyan-400' />
                    <p className='text-white font-medium text-sm'>{e.displayName}</p>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400'>#{e.spotNumber}</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>/{e.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(e.userId, 'earlyAdopter')} className='p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors'>
                  <Trash2 className='w-3.5 h-3.5 text-muted-foreground' />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Waitlist */}
        {tab === 'waitlist' && (
          <div className='space-y-3'>
            <p className='text-xs text-muted-foreground'>{waitlist?.length ?? 0} people waiting</p>
            {waitlist?.map((w: any) => (
              <div key={w._id} className='glass-card rounded-xl p-4 border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-white text-sm font-medium'>{w.name || 'Anonymous'}</p>
                    <p className='text-muted-foreground text-xs'>{w.email}</p>
                    {w.username && <p className='text-amber-500 text-xs'>@{w.username}</p>}
                  </div>
                  <p className='text-xs text-muted-foreground'>{new Date(w.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grant badge */}
        {tab === 'grant' && (
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <h2 className='text-white font-bold mb-5 flex items-center gap-2'><Plus className='w-4 h-4 text-amber-500' /> Grant Badge</h2>
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-3'>
                <button onClick={() => setGrantForm(f => ({ ...f, type: 'founding' }))} className={'py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ' + (grantForm.type === 'founding' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-muted-foreground')}>
                  <Crown className='w-3.5 h-3.5' /> Founding
                </button>
                <button onClick={() => setGrantForm(f => ({ ...f, type: 'earlyAdopter' }))} className={'py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ' + (grantForm.type === 'earlyAdopter' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-muted-foreground')}>
                  <Zap className='w-3.5 h-3.5' /> Early Adopter
                </button>
              </div>
              <input value={grantForm.userId} onChange={e => setGrantForm(f => ({ ...f, userId: e.target.value }))} placeholder='Clerk User ID (user_xxx)' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50' />
              <input value={grantForm.username} onChange={e => setGrantForm(f => ({ ...f, username: e.target.value }))} placeholder='Username' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50' />
              <input value={grantForm.displayName} onChange={e => setGrantForm(f => ({ ...f, displayName: e.target.value }))} placeholder='Display Name' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50' />
              {msg && <p className='text-xs text-center text-amber-500'>{msg}</p>}
              <button onClick={handleGrant} disabled={granting} className='w-full py-3 rounded-xl bg-amber-500 text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity'>
                {granting ? 'Granting...' : 'Grant Badge'}
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}