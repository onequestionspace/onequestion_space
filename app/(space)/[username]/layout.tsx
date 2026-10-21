import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return { title: 'One Question Space' };
    const convex = new ConvexHttpClient(convexUrl);
    const profile = await convex.query(api.profiles.byUsername, { username });
    if (!profile) return { title: 'Space not found' };

    const name = profile.displayName || username;
    const bio = profile.bio || 'Ask me anything.';
    const ogImage = `https://onequestion.space/api/og/answer?name=${encodeURIComponent(name)}&q=Ask+${encodeURIComponent(name)}+anything&a=${encodeURIComponent(bio.slice(0, 120))}`;

    return {
      title: name + ' — One Question',
      description: bio,
      openGraph: {
        title: name + ' — AI Q&A Space',
        description: bio,
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: name + ' — One Question',
        description: bio,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'One Question Space' };
  }
}

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
