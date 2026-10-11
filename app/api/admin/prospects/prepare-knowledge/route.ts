import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdminUser } from '@/convex/userIds';
import { createKnowledgeEmbeddings } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !isAdminUser(userId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    const { title, content } = body as { title?: unknown; content?: unknown };
    if (typeof title !== 'string' || !title.trim() || title.length > 120) {
      return NextResponse.json({ success: false, error: 'Enter a title under 120 characters' }, { status: 400 });
    }
    if (typeof content !== 'string' || !content.trim() || content.length > 40000) {
      return NextResponse.json({ success: false, error: 'Knowledge must be between 1 and 40,000 characters' }, { status: 400 });
    }

    const prepared = await createKnowledgeEmbeddings(title.trim(), content.trim());
    if (!prepared.chunks.length || prepared.chunks.some((chunk) => chunk.embedding?.length !== 768)) {
      return NextResponse.json({
        success: false,
        error: 'Could not prepare all knowledge embeddings. Check the Gemini configuration and try again.',
      }, { status: 503 });
    }

    return NextResponse.json({ success: true, data: prepared });
  } catch (error) {
    console.error('Prospect knowledge preparation failed:', error);
    return NextResponse.json({ success: false, error: 'Could not prepare this knowledge right now.' }, { status: 500 });
  }
}
