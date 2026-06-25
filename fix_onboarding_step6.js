const fs = require('fs');

let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

const broken = `                <div className="flex flex-wrap gap-3 mb-6">
                  {[#a855f7,#3b82f6,#06b6d4,#22c55e,#f97316,#ec4899,#ef4444,#eab308,#ffffff].map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, themeColor: c }))} className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative" style={{ backgroundColor: c, borderColor: form.themeColor === c ? c : transparent, boxShadow: form.themeColor === c ? 0 0 0 3px  + c + 40 : none }}>
                      {form.themeColor === c && <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />}
                    </button>
                  ))}`;

const fixed = `                <div className="flex flex-wrap gap-3 mb-6">
                  {['#a855f7','#3b82f6','#06b6d4','#22c55e','#f97316','#ec4899','#ef4444','#eab308','#ffffff'].map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, themeColor: c }))} className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative" style={{ backgroundColor: c, borderColor: form.themeColor === c ? c : 'transparent', boxShadow: form.themeColor === c ? '0 0 0 3px ' + c + '40' : 'none' }}>
                      {form.themeColor === c && <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />}
                    </button>
                  ))}`;

if (content.includes(broken)) {
  content = content.replace(broken, fixed);
  fs.writeFileSync('app/onboarding/page.tsx', content);
  console.log('✅ Step 6 color picker fixed');
} else {
  console.log('❌ Pattern not found — manual fix needed');
}
