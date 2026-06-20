const fs = require('fs');

// Simple API route to get current user's profile username
fs.mkdirSync('app/api/profile', { recursive: true });
fs.writeFileSync('app/api/profile/route.ts', `import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await convex.query(api.profiles.current);
    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);
console.log('✓ app/api/profile/route.ts created');
