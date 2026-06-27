const fs = require('fs');
let c = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');

// 1. Update links state type
c = c.replace(
  `  const [links, setLinks] = useState<{title: string, url: string}[]>([]);`,
  `  const [links, setLinks] = useState<{title: string, url: string, image?: string}[]>([]);`
);

// 2. Add image upload per link in the links tab
c = c.replace(
  `                  <div className="space-y-2">
                    {links.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            value={link.title}
                            onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }}
                            placeholder="Label"
                            className={inputClass}
                          />
                          <input
                            value={link.url}
                            onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }}
                            placeholder="https://..."
                            className={inputClass}
                          />
                        </div>
                        <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>`,
  `                  <div className="space-y-3">
                    {links.map((link, i) => (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={link.title}
                            onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }}
                            placeholder="Label"
                            className={inputClass}
                          />
                          <input
                            value={link.url}
                            onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }}
                            placeholder="https://..."
                            className={inputClass}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {link.image ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={link.image} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => { const next = [...links]; next[i].image = ''; setLinks(next); }}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs">✕</button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-primary/40 transition-all text-xs cursor-pointer shrink-0">
                              <span>+ Photo</span>
                              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                try {
                                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (data.url) {
                                    const next = [...links];
                                    next[i].image = data.url;
                                    setLinks(next);
                                  }
                                } catch {}
                              }} />
                            </label>
                          )}
                          <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="ml-auto p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>`
);

fs.writeFileSync('app/dashboard/studio/page.tsx', c);
console.log('studio done');

// 3. Update LinkPreviewCard to use custom image if provided
let lp = fs.readFileSync('components/LinkPreviewCard.tsx', 'utf8');

lp = lp.replace(
  `interface Props {
  title: string;
  url: string;
  color: string;
}`,
  `interface Props {
  title: string;
  url: string;
  color: string;
  image?: string;
}`
);

lp = lp.replace(
  `export function LinkPreviewCard({ title, url, color }: Props) {`,
  `export function LinkPreviewCard({ title, url, color, image }: Props) {`
);

// Use custom image if provided, fallback to OG
lp = lp.replace(
  `      {!loading && og?.image && (
        <div className="w-full h-32 overflow-hidden bg-white/5">
          <img
            src={og.image}
            alt={og.title || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}`,
  `      {(image || (!loading && og?.image)) && (
        <div className="w-full h-32 overflow-hidden bg-white/5">
          <img
            src={image || og?.image || ''}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}`
);

fs.writeFileSync('components/LinkPreviewCard.tsx', lp);
console.log('LinkPreviewCard done');

// 4. Pass image to LinkPreviewCard in space page
let sp = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
sp = sp.replace(
  `                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} />`,
  `                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} image={link.image} />`
);
fs.writeFileSync('app/(space)/[username]/page.tsx', sp);
console.log('space page done');
