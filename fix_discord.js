const fs = require('fs');

// ── 1. Add Discord to founding page perks + footer ───────────────────────────
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

// Add MessageSquare import already there, add Discord link in perks
founding = founding.replace(
  `  { icon: Users, text: 'Private founders community on GitHub' },`,
  `  { icon: Users, text: 'Private Discord community — founders only' },`
);

// Add Discord button after claim button section footer
founding = founding.replace(
  `          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>`,
  `          <div className="glass rounded-2xl p-4 border border-white/10 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Join the Discord</p>
              <p className="text-xs text-muted-foreground">Founders + community. Building in public together.</p>
            </div>
            <a
              href="https://discord.gg/6bPCJtgXm"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-indigo-500 text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              Join
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Discord added to founding page');

// ── 2. Add Discord link to contact/navbar ────────────────────────────────────
let footer = fs.readFileSync('components/Footer.tsx', 'utf8').toString();
if (!footer.includes('discord')) {
  footer = footer.replace(
    /(<a[^>]*>.*?GitHub.*?<\/a>)/s,
    `$1
            <a href="https://discord.gg/6bPCJtgXm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors text-sm">Discord</a>`
  );
  fs.writeFileSync('components/Footer.tsx', footer);
  console.log('✓ Discord added to footer');
} else {
  console.log('- Discord already in footer');
}
