import { ClerkProvider } from '@clerk/nextjs';
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
