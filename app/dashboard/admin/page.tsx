'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Crown, Zap, Users, Trash2, Plus, Shield } from 'lucide-react';

const ADMIN_IDS = [
  'user_3EhKmuVyC1AhoBDlL7QNssllwgu',
  'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz',
];
const ADMIN_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';

export default function AdminPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<'users' | 'founding' | 'early'>('users');
  const [grantForm, setGrantForm] = useState({ userId: '', username: '', displayName: '', type: 'founding' });
  const [granting, setGranting] = useState(false);
  const [msg, setMsg] = useState('');

  const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;

  const adminId = user?.id || ADMIN_ID;
  const profiles = useQuery(api.admin.getAllProfiles, isAdmin ? { adminId } : 'skip');
  const founders = useQuery(api.admin.getAllFoundingMembers, isAdmin ? { adminId } : 'skip');
  const earlyAdopters = useQuery(api.admin.getAllEarlyAdopters, isAdmin ? { adminId } : 'skip');

  const grantFoundingBadge = useMutation(api.admin.grantFoundingBadge);
  const grantEarlyAdopterBadge = useMutation(api.admin.grantEarlyAdopterBadge);
  const removeBadge = useMutation(api.admin.removeBadge);
  const deleteProfile = useMutation(api.admin.deleteProfile);

  // Debug — remove after fixing
  console.log('Current user ID:', user?.id);

  if (!isAdmin) {
    return (
      <DashboardLayout title="Admin" description="Restricted area">
        <div className="text-center py-20">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-white font-bold text-xl mb-2">Access Denied</p>
          <p className="text-muted-foreground text-sm">You don't have permission to view this page.</p>
          <p className="text-xs text-muted-foreground mt-4 font-mono">Your ID: {user?.id}</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleGrant = async () => {
    if (!grantForm.userId || !grantForm.username || !grantForm.displayName) return;
    setGranting(true);
    setMsg('');
    try {
      const result = grantForm.type === 'founding'
        ? await grantFoundingBadge({ adminId: ADMIN_ID, ...grantForm })
        : await grantEarlyAdopterBadge({ adminId: ADMIN_ID, ...grantForm });
      setMsg(result.success ? '✓ Badge granted!' : '⚠ Already has badge');
      if (result.success) setGrantForm({ userId: '', username: '', displayName: '', type: 'founding' });
    } catch (e) { setMsg('Error granting badge'); }
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

  return (
    <DashboardLayout title="Admin Panel" description="Manage users, badges and spaces">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-4 border border-border text-center">
            <p className="text-2xl font-black text-white">{profiles?.length ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Total Spaces</p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-border text-center">
            <p className="text-2xl font-black text-white">{founders?.length ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Founders</p>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-border text-center">
            <p className="text-2xl font-black text-white">{earlyAdopters?.length ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Early Adopters</p>
          </div>
        </div>

        {/* Grant badge */}
        <div className="glass-card rounded-2xl p-5 border border-border">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Grant Badge
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGrantForm(f => ({ ...f, type: 'founding' }))}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${grantForm.type === 'founding' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}
              >
                👑 Founding
              </button>
              <button
                onClick={() => setGrantForm(f => ({ ...f, type: 'earlyAdopter' }))}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${grantForm.type === 'earlyAdopter' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}
              >
                ⚡ Early Adopter
              </button>
            </div>
            <input value={grantForm.userId} onChange={e => setGrantForm(f => ({ ...f, userId: e.target.value }))} placeholder="Clerk User ID" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            <input value={grantForm.username} onChange={e => setGrantForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            <input value={grantForm.displayName} onChange={e => setGrantForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Display Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            {msg && <p className="text-xs text-center text-primary">{msg}</p>}
            <button onClick={handleGrant} disabled={granting} className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
              {granting ? 'Granting...' : 'Grant Badge'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['users', 'founding', 'early'] as const).map(t => (
            <button key={t} onClick={() => setTab(t === 'early' ? 'early' : t)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${tab === t ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:text-white'}`}>
              {t === 'users' ? 'All Users' : t === 'founding' ? '👑 Founders' : '⚡ Early Adopters'}
            </button>
          ))}
        </div>

        {/* Users list */}
        {tab === 'users' && (
          <div className="space-y-2">
            {profiles?.map(p => (
              <div key={p._id} className="glass-card rounded-xl p-4 border border-border flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{p.displayName}</p>
                  <p className="text-muted-foreground text-xs">/{p.username} · {p.userId}</p>
                </div>
                <button onClick={() => handleDeleteProfile(p._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Founders list */}
        {tab === 'founding' && (
          <div className="space-y-2">
            {founders?.map(f => (
              <div key={f._id} className="glass-card rounded-xl p-4 border border-border flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{f.displayName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">#{f.spotNumber}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">/{f.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(f.userId, 'founding')} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Early adopters list */}
        {tab === 'early' && (
          <div className="space-y-2">
            {earlyAdopters?.map(e => (
              <div key={e._id} className="glass-card rounded-xl p-4 border border-border flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{e.displayName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">#{e.spotNumber}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">/{e.username}</p>
                </div>
                <button onClick={() => handleRemoveBadge(e.userId, 'earlyAdopter')} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
