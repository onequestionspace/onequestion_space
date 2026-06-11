import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const fileType = file.type;
    let content = '';

    // Only parse text files with Gemini
    if (fileType === 'text/plain') {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
      }
      content = await file.text();
      // ... your Gemini processing here
    } 
    // Images/PDFs: skip Gemini, just store metadata
    else if (fileType.startsWith('image/') || fileType === 'application/pdf') {
      content = `[${fileType}] ${file.name} - ${file.size} bytes`;
    } 
    else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    await convex.mutation(api.knowledge.create, {
      userId,
      filename: file.name,
      content,
      fileType,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
