const fs = require('fs');
let code = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

// Replace the BACKGROUNDS array with warmer, split options
code = code.replace(
  `const BACKGROUNDS = [
  { id: "dark", label: "Dark", preview: "#18181b" },
  { id: "darker", label: "Darker", preview: "#000000" },
  { id: "midnight", label: "Midnight", preview: "#020617" },
  { id: "aurora", label: "Aurora ✨", preview: "linear-gradient(135deg,#3b0764,#172554)" },
  { id: "sunset", label: "Sunset", preview: "linear-gradient(135deg,#431407,#500724)" },
  { id: "ocean", label: "Ocean", preview: "linear-gradient(135deg,#083344,#172554)" },
  { id: "particles", label: "Particles 🌟", preview: "linear-gradient(135deg,#0a0a0a,#1a0a2e)" },
  { id: "bubbles", label: "Bubbles 🫧", preview: "linear-gradient(135deg,#0a0a0a,#0a1628)" },
  { id: "net", label: "Net 🕸️", preview: "linear-gradient(135deg,#0a0a0a,#0d0d0d)" },
  { id: "matrix", label: "Matrix 💊", preview: "linear-gradient(135deg,#000000,#001a00)" },
];`,
  `const BACKGROUNDS = [
  { id: "dark", label: "Void", preview: "#0f0c1a" },
  { id: "midnight", label: "Midnight", preview: "linear-gradient(135deg,#0a0f1e,#0d0b1a)" },
  { id: "aurora", label: "Aurora", preview: "linear-gradient(135deg,#0d0b1a,#1a0d2e)" },
  { id: "dusk", label: "Dusk", preview: "linear-gradient(135deg,#12081e,#1a0e10)" },
  { id: "galaxy", label: "Galaxy", preview: "linear-gradient(135deg,#080612,#0d0b1a)" },
  { id: "ocean", label: "Ocean", preview: "linear-gradient(135deg,#071018,#0a1628)" },
  { id: "dawn", label: "Dawn 🌅", preview: "linear-gradient(135deg,#1a0e2e,#2e1a0e)" },
  { id: "fog", label: "Fog ☁️", preview: "linear-gradient(135deg,#e8e4f0,#f0eef8)" },
  { id: "sand", label: "Sand 🏜️", preview: "linear-gradient(135deg,#f5efe6,#ede8df)" },
  { id: "parchment", label: "Parchment 📜", preview: "linear-gradient(135deg,#faf6f0,#f5f0e8)" },
];

const FLOAT_EFFECTS = [
  { id: "none", label: "None", preview: "✦" },
  { id: "particles", label: "Particles", preview: "✦" },
  { id: "bubbles", label: "Bubbles", preview: "○" },
  { id: "net", label: "Net", preview: "⊞" },
  { id: "matrix", label: "Matrix", preview: "01" },
];`
);

// Add themeEffect state
code = code.replace(
  `  const [saving, setSaving] = useState(false);`,
  `  const [themeEffect, setThemeEffect] = useState("none");
  const [saving, setSaving] = useState(false);`
);

// Load themeEffect from profile
code = code.replace(
  `        setThemeCardStyle(profile.themeCardStyle || "glass");`,
  `        setThemeCardStyle(profile.themeCardStyle || "glass");
        setThemeEffect(profile.themeBg && ["particles","bubbles","net","matrix"].includes(profile.themeBg) ? profile.themeBg : "none");`
);

// Save themeEffect — merge with themeBg
code = code.replace(
  `      await updateProfile({
        themeColor,
        themeBg,
        themeFont,
        themeCardStyle,
        socialLinks: JSON.stringify({ twitter, github, website, linkedin }),
      });`,
  `      await updateProfile({
        themeColor,
        themeBg,
        themeFont,
        themeCardStyle,
        themeEffect,
        socialLinks: JSON.stringify({ twitter, github, website, linkedin }),
      });`
);

// Replace Background section UI with split Background + Effects
code = code.replace(
  `      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Background</h3>
        <p className="text-xs text-muted-foreground mb-4">The vibe of your space.</p>
        <div className="grid grid-cols-2 gap-3">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => setThemeBg(bg.id)}
              className={"relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 " + (themeBg === bg.id ? "border-primary" : "border-border")}
            >
              <div className="w-full h-10 rounded-lg" style={{ background: bg.preview }} />
              <span className="text-xs font-medium text-foreground">{bg.label}</span>
              {themeBg === bg.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>`,
  `      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Background</h3>
        <p className="text-xs text-muted-foreground mb-4">The canvas of your space.</p>
        <div className="grid grid-cols-2 gap-3">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => setThemeBg(bg.id)}
              className={"relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 " + (themeBg === bg.id ? "border-primary" : "border-border")}
            >
              <div className="w-full h-10 rounded-lg" style={{ background: bg.preview }} />
              <span className="text-xs font-medium text-foreground">{bg.label}</span>
              {themeBg === bg.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Floating Effects</h3>
        <p className="text-xs text-muted-foreground mb-4">Animated layer that floats above your background.</p>
        <div className="grid grid-cols-5 gap-2">
          {FLOAT_EFFECTS.map(fx => (
            <button
              key={fx.id}
              onClick={() => setThemeEffect(fx.id)}
              className={"relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 " + (themeEffect === fx.id ? "border-primary bg-primary/5" : "border-border")}
            >
              <span className="text-lg font-mono text-muted-foreground">{fx.preview}</span>
              <span className="text-xs font-medium text-foreground">{fx.label}</span>
              {themeEffect === fx.id && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>`
);

fs.writeFileSync('components/AppearanceTab.tsx', code);
console.log('Done');
