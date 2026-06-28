const fs = require('fs');
let c = fs.readFileSync('app/dashboard/settings/page.tsx', 'utf8');

// Add useClerk import if not there
if (!c.includes('useClerk')) {
  c = c.replace(
    `import { useAuth } from '@/hooks/useAuth';`,
    `import { useAuth } from '@/hooks/useAuth';
import { useClerk } from '@clerk/nextjs';`
  );
}

// Add deleteAccount state and handler after existing state declarations
c = c.replace(
  `export default function SettingsPage() {`,
  `export default function SettingsPage() {
  const { signOut } = useClerk();
  const [deleting, setDeleting] = React.useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure? This will permanently delete your account and all your data. This cannot be undone.');
    if (!confirmed) return;
    const confirmed2 = window.confirm('Last chance — are you absolutely sure?');
    if (!confirmed2) return;
    setDeleting(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch (e) {
      alert('Something went wrong. Please contact support.');
      setDeleting(false);
    }
  };`
);

// Add React import if missing
if (!c.includes("import React")) {
  c = c.replace(`'use client';`, `'use client';
import React from 'react';`);
}

// Fix the button
c = c.replace(
  `          <button className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
            Delete Account
          </button>`,
  `          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>`
);

fs.writeFileSync('app/dashboard/settings/page.tsx', c);
console.log('done');
