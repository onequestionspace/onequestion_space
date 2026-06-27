'use client';

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    fetch('/api/og-preview?url=' + encodeURIComponent(url))
      .then(r => r.json())
      .then(data => { setOg(data); setLoading(false); })
      .catch(() => { setLoading(false); setFailed(true); });
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
            {(og?.title && !og.title.toLowerCase().includes('moment') && !og.title.toLowerCase().includes('checking') && !og.title.toLowerCase().includes('cloudflare')) ? og.title : title}
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
