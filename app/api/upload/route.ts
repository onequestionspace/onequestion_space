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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type');
    const sourceType = formData.get('sourceType');
    const title = formData.get('title');

    if (!(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds the 5 MB limit' }, { status: 413 });
    }

    const fileType = file.type || '';
    const isImage = fileType.startsWith('image/');
    if (type === 'avatar') {
      if (!isImage) return NextResponse.json({ error: 'Avatar must be an image' }, { status: 400 });
      const bytes = await file.arrayBuffer();
      const dataUrl = 'data:' + fileType + ';base64,' + Buffer.from(bytes).toString('base64');
      return NextResponse.json({ success: true, url: dataUrl });
    }

    const convex = await getAuthenticatedConvexClient();

    if (isImage) {
      const bytes = await file.arrayBuffer();
      const dataUrl = 'data:' + fileType + ';base64,' + Buffer.from(bytes).toString('base64');
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: typeof title === 'string' && title.trim() ? title.trim() : file.name,
        content: file.name,
        fileUrl: dataUrl,
        fileType,
        sourceType: typeof sourceType === 'string' ? sourceType : 'image',
      });
      return NextResponse.json({ success: true, data: { fileUrl: dataUrl } });
    }

    const textMimeTypes = ['text/plain', 'text/markdown', 'text/x-markdown', 'application/octet-stream', ''];
    const textExtensions = ['.txt', '.md', '.markdown', '.csv'];
    const lowerName = (file.name || '').toLowerCase();
    const looksLikeText = textMimeTypes.includes(fileType) || textExtensions.some(ext => lowerName.endsWith(ext));

    if (looksLikeText) {
      const content = await file.text();
      const knowledgeTitle = typeof title === 'string' && title.trim() ? title.trim() : file.name;
      const { embeddings, chunks } = await createKnowledgeEmbeddings(knowledgeTitle, content);
      await convex.mutation(api.knowledge.createKnowledge, {
        userId,
        title: knowledgeTitle,
        content,
        embeddings,
        chunks,
        fileType: fileType || 'text/plain',
        sourceType: typeof sourceType === 'string' ? sourceType : 'personal',
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({
      error: 'Unsupported file type: ' + (fileType || 'unknown') + '. Supported: .txt, .md, images. PDF support coming soon.',
    }, { status: 400 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
