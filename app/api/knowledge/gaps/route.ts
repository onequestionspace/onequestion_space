import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const gaps = await convex.query(api.knowledgeHealth.getKnowledgeGaps, { userId });
    return NextResponse.json({ success: true, data: gaps });
  } catch (error) {
    console.error('Knowledge gaps error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
