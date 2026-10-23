import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { isAdminUser } from '@/convex/userIds';
import { generateAnswer, generateEmbeddings, rankKnowledge } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return NextResponse.json({ success: false, error: 'Database connection is not configured.' }, { status: 503 });
    const convex = new ConvexHttpClient(convexUrl);
    const { userId } = await auth();
    if (!userId || !isAdminUser(userId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: 'AI answer generation is not configured.' }, { status: 503 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    const { username, question } = body as { username?: unknown; question?: unknown };
    if (typeof username !== 'string' || !/^[a-z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json({ success: false, error: 'Invalid public page name' }, { status: 400 });
    }
    if (typeof question !== 'string' || !question.trim() || question.length > 500) {
      return NextResponse.json({ success: false, error: 'Enter a question under 500 characters' }, { status: 400 });
    }

    const secret = process.env.ONEQUESTION_STREAM_SECRET;
    if (!secret) return NextResponse.json({ success: false, error: 'Service temporarily unavailable' }, { status: 503 });
    const profile = await convex.query(api.profiles.getProfileForServer, { secret, username });
    if (!profile?.isSeeded) {
      return NextResponse.json({ success: false, error: 'Prospect page not found or already claimed' }, { status: 404 });
    }
    const knowledge = await convex.query(api.knowledge.getPublicKnowledgeByUsername, { secret, username: profile.username });
    if (!knowledge.length) {
      return NextResponse.json({ success: false, error: 'Add at least one knowledge item before testing.' }, { status: 400 });
    }

    const queryEmbedding = await generateEmbeddings(question.trim(), 'RETRIEVAL_QUERY');
    if (queryEmbedding.length !== 768) {
      return NextResponse.json({ success: false, error: 'Could not embed the test question. Check the Gemini configuration.' }, { status: 503 });
    }
    const sources = rankKnowledge(question.trim(), queryEmbedding, knowledge, 5);
    if (!sources.length) {
      return NextResponse.json({
        success: true,
        data: {
          answer: 'I don’t have enough matching knowledge to answer that yet. Add more detail or try another question.',
          sources: [],
        },
      });
    }

    const answer = await generateAnswer(
      question.trim(),
      sources.map((source) => `${source.title}: ${source.content}`),
      {
        displayName: profile.displayName,
        bio: profile.bio,
        welcomeMessage: profile.welcomeMessage,
        username: profile.username,
      },
    );
    if (answer === 'AI is not configured yet.') {
      return NextResponse.json({ success: false, error: answer }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      data: {
        answer,
        sources: sources.map(({ title, content, score }) => ({
          title,
          excerpt: content.slice(0, 260),
          score: Math.round(score * 100),
        })),
      },
    });
  } catch (error) {
    console.error('Prospect AI test failed:', error);
    return NextResponse.json({ success: false, error: 'Could not test this page right now.' }, { status: 500 });
  }
}
