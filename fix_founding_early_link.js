const fs = require('fs');

let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

founding = founding.replace(
  `          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>`,
  `          <div className="glass rounded-2xl p-4 border border-white/10 mb-6 text-center">
            <p className="text-sm text-white font-medium mb-1">Missed the founding round?</p>
            <p className="text-xs text-muted-foreground mb-3">50 early adopter spots are open — 50% off Pro forever.</p>
            <a href="/early" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors">
              Claim Early Adopter spot →
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Early adopter link added to founding page');
