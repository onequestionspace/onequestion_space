import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OneQuestionBot/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const getOg = (prop: string): string => {
      const r1 = new RegExp('property=["\']og:' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
      const r2 = new RegExp('content=["\']([^"\']*)["\'][^>]*property=["\']og:' + prop + '["\']', 'i');
      const r3 = new RegExp('name=["\']' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
      return (html.match(r1) || html.match(r2) || html.match(r3))?.[1] || '';
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    return NextResponse.json({
      title: getOg('title') || titleMatch?.[1] || url,
      description: getOg('description'),
      image: getOg('image'),
      url,
    }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ title: url, description: '', image: '', url });
  }
}
