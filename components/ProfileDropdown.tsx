'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useClerk } from '@clerk/nextjs';
import { ChevronDown, Settings, LayoutDashboard, LogOut } from 'lucide-react';

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();

  const profile = useQuery(api.profiles.current);

  const displayName = profile?.displayName || 'User';
  const username = profile?.username || 'user';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-white font-bold">
          {displayName?.charAt(0)}
        </div>
        <span>{displayName}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
          
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
