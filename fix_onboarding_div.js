const fs = require('fs');

let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

content = content.replace(
  `                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />
                <button`,
  `                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />
                  </div>
                <button`
);

fs.writeFileSync('app/onboarding/page.tsx', content);
console.log('✅ Onboarding — missing </div> added');
