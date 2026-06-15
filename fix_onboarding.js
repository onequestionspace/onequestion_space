const fs = require('fs');

let page = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// 1. Add useRef and useCallback imports
page = page.replace(
  "import { useState, useEffect, Suspense } from 'react';",
  "import { useState, useEffect, Suspense, useRef, useCallback } from 'react';"
);

// 2. Add debounced username check
page = page.replace(
  "  const checkUsername = async (val) => {\n    if (!val || val.length < 3) { setUsernameAvailable(null); return; }\n    setChecking(true);\n    try {\n      const res = await fetch('/api/check-username?username=' + val);\n      const data = await res.json();\n      setUsernameAvailable(data.available);\n    } catch { setUsernameAvailable(null); }\n    setChecking(false);\n  };",
  "  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);\n\n  const checkUsername = useCallback((val: string) => {\n    if (!val || val.length < 3) { setUsernameAvailable(null); return; }\n    if (debounceRef.current) clearTimeout(debounceRef.current);\n    setChecking(true);\n    debounceRef.current = setTimeout(async () => {\n      try {\n        const res = await fetch('/api/check-username?username=' + val);\n        const data = await res.json();\n        setUsernameAvailable(data.available);\n      } catch { setUsernameAvailable(null); }\n      setChecking(false);\n    }, 400);\n  }, []);"
);

// 3. Add live preview card after step 3 welcome input — insert before the Continue button
page = page.replace(
  "            <button\n              onClick={handleNext}\n              disabled={!canNext() || saving}",
  "            {/* Live space preview — shown on last step */}\n            {step === steps.length - 1 && (\n              <div className='mt-6 p-4 rounded-2xl bg-white/5 border border-white/10'>\n                <p className='text-xs text-muted-foreground mb-3 flex items-center gap-1'><Sparkles className='w-3 h-3 text-primary' /> Live preview</p>\n                <div className='flex items-center gap-3'>\n                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-white font-bold text-sm shrink-0'>\n                    {form.displayName?.charAt(0)?.toUpperCase() || '?'}\n                  </div>\n                  <div>\n                    <p className='text-sm font-bold text-white'>{form.displayName || 'Your Name'}</p>\n                    <p className='text-xs text-primary'>@{form.username || 'yourname'}</p>\n                  </div>\n                </div>\n                {form.bio && <p className='text-xs text-zinc-400 mt-2 leading-relaxed'>{form.bio}</p>}\n                <div className='mt-3 p-3 rounded-xl bg-primary/10 border border-primary/20'>\n                  <p className='text-xs text-white/70'>{form.welcomeMessage || 'Ask me anything!'}</p>\n                </div>\n                <p className='text-xs text-zinc-600 mt-3 text-center'>onequestion.space/{form.username}</p>\n              </div>\n            )}\n\n            <button\n              onClick={handleNext}\n              disabled={!canNext() || saving}"
);

fs.writeFileSync('app/onboarding/page.tsx', page);
console.log('onboarding fixed — debounce + live preview');
