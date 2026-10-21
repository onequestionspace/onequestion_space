import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { createKnowledgeEmbeddings } from '@/lib/gemini';

async function getAuthenticatedConvexClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Could not obtain Convex authentication token');
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  client.setAuth(token);
  return client;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const convex = await getAuthenticatedConvexClient();
    const items = await convex.query(api.knowledge.getKnowledgeByUserId, { userId });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/knowledge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, sourceType } = body;
    if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const { embeddings, chunks } = await createKnowledgeEmbeddings(title, content);
    const convex = await getAuthenticatedConvexClient();
    const id = await convex.mutation(api.knowledge.createKnowledge, {
      userId, title: title.trim(), content, embeddings, chunks,
      sourceType: typeof sourceType === 'string' ? sourceType : undefined,
    });
    return NextResponse.json({ success: true, data: { id, title: title.trim(), content } }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/knowledge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (typeof body?.id !== 'string' || !body.id.trim()) {
      return NextResponse.json({ success: false, error: 'Knowledge item ID is required' }, { status: 400 });
    }
    const convex = await getAuthenticatedConvexClient();
    await convex.mutation(api.knowledge.deleteKnowledge, { id: body.id });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/knowledge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
