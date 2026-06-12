const fs = require('fs');

// Fix 1 - api/ask route uses wrong profile function name
let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');
ask = ask.replace(
  'const profile = await convex.query(api.profiles.getProfileByUsername, { username });',
  'const profile = await convex.query(api.profiles.byUsername, { username });'
);
ask = ask.replace(
  'await convex.mutation(api.analytics.incrementQuestions, { profileId: profile._id });',
  'await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });'
);
fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('ask route fixed');

// Fix 2 - knowledge POST route actually saves to Convex with embeddings
const knowledge = `import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateEmbeddings, chunkText } from '@/lib/gemini';

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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    // Generate embeddings for the content
    let embeddings: number[] = [];
    try {
      const chunks = chunkText(content);
      const fullText = chunks.join(' ');
      embeddings = await generateEmbeddings(fullText);
    } catch (e) {
      console.error('Embedding error:', e);
    }

    // Save to Convex
    const id = await convex.mutation(api.knowledge.createKnowledge, {
      userId,
      title,
      content,
      embeddings: embeddings.length > 0 ? embeddings : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
}`;

fs.writeFileSync('app/api/knowledge/route.ts', knowledge);
console.log('knowledge route fixed');
