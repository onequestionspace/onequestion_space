// [unbreak alert] Local fix rules skipped. Compiler error trace:
// app/api/knowledge/route.ts(49,7): error TS2353: Object literal may only specify known properties, and 'createdAt' does not exist in type '{ embeddings?: number[] | undefined; chunkIndex?: number | undefined; fileUrl?: string | undefined; fileType?: string | undefined; content: string; userId: string; title: string; }'.
// app/api/upload/route.ts(37,41): error TS2339: Property 'create' does not exist on type '{ getKnowledgeByUserId: FunctionReference<"query", "public", { userId: string; }, { _id: Id<"knowledge">; _creationTime: number; embeddings?: number[] | undefined; chunkIndex?: number | undefined; ... 6 more ...; updatedAt: number; }[], string | undefined>; ... 4 more ...; getKnowledgeCount: FunctionReference<...>; }'.

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { createKnowledgeEmbeddings } from '@/lib/gemini';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const { embeddings, chunks } = await createKnowledgeEmbeddings(title, content);

    // Save to Convex
    const id = await convex.mutation(api.knowledge.createKnowledge, {
      userId,
      title,
      content,
      embeddings,
      chunks,
      sourceType: sourceType || undefined,
    });

    return NextResponse.json({ success: true, data: { id, title, content } }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/knowledge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await request.json();
    await convex.mutation(api.knowledge.deleteKnowledge, { id });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/knowledge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}