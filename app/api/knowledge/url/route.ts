import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { createKnowledgeEmbeddings } from '@/lib/gemini';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { url, sourceType, sourceUrl } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // Fetch the page
    let html = '';
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OneQuestionBot/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.status);
      html = await res.text();
    } catch (e) {
      return NextResponse.json({ error: 'Could not fetch URL. Make sure it is public.' }, { status: 422 });
    }

    // Strip HTML tags — keep readable text
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 12000); // cap at 12k chars

    if (text.length < 100) {
      return NextResponse.json({ error: 'Not enough readable content found at this URL.' }, { status: 422 });
    }

    // Extract title from <title> tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().slice(0, 100) : url;

    const { embeddings, chunks } = await createKnowledgeEmbeddings(title, text);

    // Save to knowledge base
    const id = await convex.mutation(api.knowledge.createKnowledge, {
      userId,
      title,
      content: text,
      embeddings,
      chunks,
      fileUrl: url,
      fileType: 'url',
      sourceType: sourceType || 'article',
      sourceUrl: sourceUrl || url,
    });

    return NextResponse.json({ success: true, data: { id, title, chars: text.length } });
  } catch (error) {
    console.error('URL knowledge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
