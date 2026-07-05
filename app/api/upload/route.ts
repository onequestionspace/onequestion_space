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
    const type = formData.get('type') as string;
    const sourceType = formData.get('sourceType') as string;
    const title = formData.get('title') as string;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const fileType = file.type;

    // Handle avatar upload - convert to base64 data URL
    if (type === 'avatar' || fileType.startsWith('image/')) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = 'data:' + fileType + ';base64,' + base64;
      
      return NextResponse.json({ success: true, url: dataUrl });
    }

    // Handle image as knowledge (store as base64)
    if (fileType.startsWith('image/') && type !== 'avatar') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = 'data:' + fileType + ';base64,' + base64;
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: title || file.name,
        content: file.name,
        fileUrl: dataUrl,
        fileType,
        sourceType: sourceType || 'image',
      });
      return NextResponse.json({ success: true, data: { fileUrl: dataUrl } });
    }

    // Handle text file upload for knowledge base
    if (fileType === 'text/plain') {
      const content = await file.text();
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: title || file.name,
        content,
        fileType,
        sourceType: sourceType || 'personal',
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}