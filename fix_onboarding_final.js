const fs = require('fs');

let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

content = content.replace(
  `                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Deadline</span>
                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />
                  </div>
                <button`,
  `                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Deadline</span>
                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />
                  </div>
                </div>
                <button`
);

fs.writeFileSync('app/onboarding/page.tsx', content);
console.log('✅ Fixed');
