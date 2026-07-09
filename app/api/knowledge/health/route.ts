import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const health = await convex.query(api.knowledgeHealth.getKnowledgeHealth, { userId });
    return NextResponse.json({ success: true, data: health });
  } catch (error) {
    console.error('Health score error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
