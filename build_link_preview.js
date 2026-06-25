const fs = require('fs');

// Fix 1: Create OG preview API route
const ogRoute = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OneQuestionBot/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const get = (prop: string) => {
      const match =
        html.match(new RegExp('<meta[^>]*property=["\']og:' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i')) ||
        html.match(new RegExp('<meta[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:' + prop + '["\']', 'i')) ||
        html.match(new RegExp('<meta[^>]*name=["\']' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i'));
      return match?.[1] || '';
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\\/title>/i);

    const data = {
      title: get('title') || titleMatch?.[1] || url,
      description: get('description'),
      image: get('image'),
      url,
    };

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ title: url, description: '', image: '', url });
  }
}
`;

fs.mkdirSync('app/api/og-preview', { recursive: true });
fs.writeFileSync('app/api/og-preview/route.ts', ogRoute);
console.log('✅ OG preview API route created');

// Fix 2: LinkPreviewCard component
const linkPreview = `'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface Props {
  title: string;
  url: string;
  color: string;
}

export function LinkPreviewCard({ title, url, color }: Props) {
  const [og, setOg] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    fetch('/api/og-preview?url=' + encodeURIComponent(url))
      .then(r => r.json())
      .then(data => { setOg(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);

  const domain = (() => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group bg-white/5 hover:bg-white/8"
    >
      {/* OG Image */}
      {!loading && og?.image && (
        <div className="w-full h-32 overflow-hidden bg-white/5">
          <img
            src={og.image}
            alt={og.title || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {og?.title || title}
          </p>
          {og?.description && (
            <p className="text-xs text-white/50 mt-0.5 line-clamp-2 leading-relaxed">
              {og.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: color + '60' }}
            />
            <p className="text-xs text-white/40 truncate">{domain}</p>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0 mt-0.5" />
      </div>
    </a>
  );
}
`;

fs.writeFileSync('components/LinkPreviewCard.tsx', linkPreview);
console.log('✅ LinkPreviewCard component created');

// Fix 3: Update space page to use LinkPreviewCard
let spacePage = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add import
if (!spacePage.includes('LinkPreviewCard')) {
  spacePage = spacePage.replace(
    "import { Send, Sparkles, Copy, Check, Globe, MessageCircle, ExternalLink } from 'lucide-react';",
    "import { Send, Sparkles, Copy, Check, Globe, MessageCircle, ExternalLink } from 'lucide-react';\nimport { LinkPreviewCard } from '@/components/LinkPreviewCard';"
  );
}

// Replace simple link rendering with preview card
spacePage = spacePage.replace(
  `{spaceLinks.map((link, i) => (
                <a key={i} href={link.url} target='_blank' rel='noopener noreferrer'
                  className='flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group'>
                  <span className='text-sm font-medium'>{link.title}</span>
                  <ExternalLink className='w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity' />
                </a>
              ))}`,
  `{spaceLinks.map((link, i) => (
                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} />
              ))}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', spacePage);
console.log('✅ Space page — links now show OG preview cards');

console.log('\nDone. Build and push.');
