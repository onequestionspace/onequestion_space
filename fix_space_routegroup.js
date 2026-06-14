const fs = require('fs');
const path = require('path');

// Create route group directory app/(space)/[username]/
fs.mkdirSync('app/(space)/[username]', { recursive: true });

// Move page.tsx into the route group
const page = fs.readFileSync('app/[username]/page.tsx', 'utf8');
fs.writeFileSync('app/(space)/[username]/page.tsx', page);

// Create layout for (space) group — no navbar/footer
const layout = `import { cn } from '@/lib/utils';

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
`;
fs.writeFileSync('app/(space)/layout.tsx', layout);

// Remove old [username] directory
fs.rmSync('app/[username]', { recursive: true, force: true });

console.log('✅ Moved [username] into app/(space)/[username]/');
console.log('✅ Created app/(space)/layout.tsx — no navbar/footer');
