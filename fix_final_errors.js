const fs = require('fs');

// ── Fix 1: founding page mismatched <a>/</Link> ──
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');
founding = founding.replace(
  `                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </Link>`,
  `                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </a>`
);
fs.writeFileSync('app/founding/page.tsx', founding);
console.log('Fix 1 done');

// ── Fix 2: AppearanceTab — move all setStates inside setTimeout ──
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');
appearance = appearance.replace(
  `    if (profile) {
      setTimeout(() => {
      setThemeColor(profile.themeColor || "#a855f7");
      setThemeBg(profile.themeBg || "dark");
      setThemeFont(profile.themeFont || "inter");
      setThemeCardStyle(profile.themeCardStyle || "glass");
      }, 0);
      if (profile.socialLinks) {
        try {
          const s = JSON.parse(profile.socialLinks);
          setXIcon(s.twitter || "");
          setGithubIcon(s.github || "");
          setWebsite(s.website || "");
          setLinkedinIcon(s.linkedin || "");
        } catch {}
      }
    }`,
  `    if (profile) {
      setTimeout(() => {
        setThemeColor(profile.themeColor || "#a855f7");
        setThemeBg(profile.themeBg || "dark");
        setThemeFont(profile.themeFont || "inter");
        setThemeCardStyle(profile.themeCardStyle || "glass");
        if (profile.socialLinks) {
          try {
            const s = JSON.parse(profile.socialLinks);
            setXIcon(s.twitter || "");
            setGithubIcon(s.github || "");
            setWebsite(s.website || "");
            setLinkedinIcon(s.linkedin || "");
          } catch {}
        }
      }, 0);
    }`
);
fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('Fix 2 done');

