const fs = require('fs');

let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

founding = founding.replace(
  `                <p className="text-muted-foreground text-sm mb-4">Welcome to the inner circle. We will be in touch.</p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>`,
  `                <p className="text-muted-foreground text-sm mb-4">Welcome to the inner circle. We will be in touch.</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </a>
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Discord button added to founding success state');
