const fs = require('fs');

// Create a layout.tsx inside app/[username]/
const content = `import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { cn } from '@/lib/utils';

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ConvexClientProvider>
  );
}
`;

fs.writeFileSync('app/[username]/layout.tsx', content);
console.log('✅ Created app/[username]/layout.tsx — no navbar/footer');
