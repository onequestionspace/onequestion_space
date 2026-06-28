const fs = require('fs');
let c = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

// Remove the noise overlay entirely — it's causing the glitch
c = c.replace(
  `                  <div className="absolute inset-0 opacity-25" style={{
                    backgroundImage: \`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")\`,
                    backgroundSize: "100px 100px",
                  }} />`,
  ``
);

fs.writeFileSync('components/AppearanceTab.tsx', c);
console.log('noise removed');
