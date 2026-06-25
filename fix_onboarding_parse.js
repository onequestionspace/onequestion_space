const fs = require('fs');

let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Remove the broken duplicate incomplete line
content = content.replace(
  `                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))\n\n\n                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />`,
  `                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />`
);

fs.writeFileSync('app/onboarding/page.tsx', content);
console.log('✅ Onboarding — duplicate broken input removed');
