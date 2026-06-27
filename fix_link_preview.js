const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add LinkPreviewCard import
c = c.replace(
  `import { Send, Copy, Check, Globe, ExternalLink, Sparkles } from 'lucide-react';`,
  `import { Send, Copy, Check, Globe, ExternalLink, Sparkles } from 'lucide-react';
import { LinkPreviewCard } from '@/components/LinkPreviewCard';`
);

// Replace plain links with LinkPreviewCard
c = c.replace(
  `          {/* Links */}
          {spaceLinks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <a key={i} href={link.url} target='_blank' rel='noopener noreferrer'
                  className='flex items-center justify-between px-4 py-3 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all group'>
                  <span className='text-sm font-medium'>{link.title}</span>
                  <ExternalLink className='w-3.5 h-3.5 opacity-30 group-hover:opacity-70 transition-opacity' />
                </a>
              ))}
            </motion.div>
          )}`,
  `          {/* Links — with preview */}
          {spaceLinks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} />
              ))}
            </motion.div>
          )}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
