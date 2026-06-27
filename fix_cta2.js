const fs = require('fs');
let c = fs.readFileSync('components/CTASection.tsx', 'utf8');

// Fix button — black text on amber, remove wrapper div
c = c.replace(
  `          {isLoaded && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="relative inline-block px-10 py-5 bg-primary text-white font-bold text-xl rounded-full transition-all hover:-translate-y-0.5"
              >
                Claim Your Space Now
              </Link>
            </div>
          )}`,
  `          {isLoaded && (
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="inline-block px-10 py-5 bg-primary text-black font-black text-xl rounded-2xl transition-all hover:-translate-y-0.5 hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Claim your space free →
            </Link>
          )}`
);

// Fix trust badges — remove accent-yellow
c = c.replace(
  `              <Check className="w-4 h-4 text-accent-yellow shrink-0" />`,
  `              <Check className="w-4 h-4 text-primary shrink-0" />`
);

// Fix headline — more human
c = c.replace(
  `          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.05]">
          Your knowledge.
          <br />
          <span className="gradient-text">Your answers.</span>
          <br />
          Your space.
        </h2>`,
  `          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.05] tracking-tight">
          Stop answering
          <br />
          <span className="text-primary">the same questions.</span>
          <br />
          Let AI do it.
        </h2>`
);

// Fix subtext — left align, not centered paragraph
c = c.replace(
  `        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
        </p>`,
  `        <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto leading-relaxed">
          Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
        </p>`
);

fs.writeFileSync('components/CTASection.tsx', c);
console.log('done');
