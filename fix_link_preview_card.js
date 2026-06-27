const fs = require('fs');
let c = fs.readFileSync('components/LinkPreviewCard.tsx', 'utf8');

c = c.replace(
  `          {og?.title || title}`,
  `          {(og?.title && !og.title.toLowerCase().includes('moment') && !og.title.toLowerCase().includes('checking') && !og.title.toLowerCase().includes('cloudflare')) ? og.title : title}`
);

// Also show title immediately while loading — don't wait
c = c.replace(
  `  const [loading, setLoading] = useState(true);`,
  `  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);`
);

c = c.replace(
  `      .catch(() => setLoading(false));`,
  `      .catch(() => { setLoading(false); setFailed(true); });`
);

fs.writeFileSync('components/LinkPreviewCard.tsx', c);
console.log('done');
