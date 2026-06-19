const fs = require('fs');

let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

appearance = appearance.replace(
  `const BACKGROUNDS = [
  { id: "dark", label: "Dark", preview: "#18181b" },
  { id: "darker", label: "Darker", preview: "#000000" },
  { id: "midnight", label: "Midnight", preview: "#020617" },
  { id: "aurora", label: "Aurora", preview: "linear-gradient(135deg,#3b0764,#172554)" },
  { id: "sunset", label: "Sunset", preview: "linear-gradient(135deg,#431407,#500724)" },
  { id: "ocean", label: "Ocean", preview: "linear-gradient(135deg,#083344,#172554)" },
];`,
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
];`
);

// Update grid to 5 cols to fit more options
appearance = appearance.replace(
  `<div className="grid grid-cols-3 gap-3">
          {BACKGROUNDS.map(bg => (`,
  `<div className="grid grid-cols-2 gap-3">
          {BACKGROUNDS.map(bg => (`
);

fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('✓ Appearance tab updated with new backgrounds');
