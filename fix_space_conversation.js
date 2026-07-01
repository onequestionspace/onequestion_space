const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Fix answer bubble text for light themes
page = page.replace(
  "                      <p className='text-sm text-white leading-relaxed'>",
  "                      <p className={'text-sm leading-relaxed ' + (isLight ? 'text-zinc-900' : 'text-white')}>"
);

// 2. Fix reaction buttons for light themes
page = page.replace(
  "              className={'px-2.5 py-1 rounded-full text-sm border transition-all ' + (reacted === emoji ? 'border-white/30 bg-white/10' : 'border-white/8 bg-white/4 hover:bg-white/10')}>",
  "              className={'px-2.5 py-1 rounded-full text-sm border transition-all ' + (reacted === emoji ? (isLight ? 'border-zinc-400 bg-zinc-100' : 'border-white/30 bg-white/10') : (isLight ? 'border-zinc-200 bg-white hover:bg-zinc-50' : 'border-white/8 bg-white/4 hover:bg-white/10'))}>"
);

// 3. Fix copy/share buttons for light themes
page = page.replace(
  "                        <button onClick={copyAnswer} className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>",
  "                        <button onClick={copyAnswer} className={'flex items-center gap-1.5 text-xs transition-opacity ' + (isLight ? 'text-zinc-500 hover:text-zinc-800' : 'opacity-40 hover:opacity-70')}>"
);

// 4. Fix ask another question button for light themes
page = page.replace(
  "                    className='w-full py-2.5 rounded-2xl border border-white/8 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>",
  "                    className={'w-full py-2.5 rounded-2xl border text-sm transition-all ' + (isLight ? 'border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50' : 'border-white/8 text-zinc-500 hover:text-white hover:bg-white/5')}>"
);

// 5. Fix footer for light themes
page = page.replace(
  "          className='mt-10 text-center border-t border-white/5 pt-8'>",
  "          className={'mt-10 text-center pt-8 border-t ' + (isLight ? 'border-zinc-200' : 'border-white/5')}>"
);

// 6. Add persistent conversation — load from localStorage on mount
// Find the useState declarations and add conversation history state
page = page.replace(
  "  const [copied, setCopied] = useState(false);",
  "  const [copied, setCopied] = useState(false);\n  const [history, setHistory] = useState<{q: string; a: string}[]>([]);"
);

// Load history from localStorage on mount
page = page.replace(
  "  useEffect(() => {\n    if (profile?._id) {\n      const key = 'visited_' + profile._id;",
  "  // Load conversation history from localStorage\n  useEffect(() => {\n    try {\n      const stored = localStorage.getItem('convo_' + username);\n      if (stored) setHistory(JSON.parse(stored));\n    } catch {}\n  }, [username]);\n\n  useEffect(() => {\n    if (profile?._id) {\n      const key = 'visited_' + profile._id;"
);

// Save to history when answer is complete
page = page.replace(
  "    setIsTyping(false);\n  };",
  "    setIsTyping(false);\n  };\n\n  const saveToHistory = (q: string, a: string) => {\n    const newHistory = [...history, { q, a }].slice(-20); // keep last 20\n    setHistory(newHistory);\n    try { localStorage.setItem('convo_' + username, JSON.stringify(newHistory)); } catch {}\n  };"
);

// Call saveToHistory when typing completes
page = page.replace(
  "      for (let i = 0; i < words.length; i++) {\n        current += (i > 0 ? ' ' : '') + words[i];\n        setAiResponse(current);\n        await new Promise(r => setTimeout(r, 30 + Math.random() * 20));\n      }",
  "      let finalAnswer = '';\n      for (let i = 0; i < words.length; i++) {\n        current += (i > 0 ? ' ' : '') + words[i];\n        finalAnswer = current;\n        setAiResponse(current);\n        await new Promise(r => setTimeout(r, 30 + Math.random() * 20));\n      }\n      saveToHistory(question, finalAnswer);"
);

// Add history display above the ask form
page = page.replace(
  "        {/* Ask Card — iMessage style */}",
  "        {/* Conversation History */}\n        {history.length > 0 && (\n          <div className='mb-4 space-y-4'>\n            <p className={'text-xs uppercase tracking-widest mb-3 text-center ' + textMuted}>Previous conversation</p>\n            {history.map((item, i) => (\n              <div key={i} className='space-y-2'>\n                <div className='flex justify-end'>\n                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm text-white text-sm leading-relaxed' style={{ backgroundColor: color }}>\n                    {item.q}\n                  </div>\n                </div>\n                <div className='flex justify-start'>\n                  <div className={'max-w-[85%] px-4 py-3 rounded-3xl rounded-tl-sm text-sm leading-relaxed ' + (isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-white/8 text-white')}>\n                    {item.a}\n                  </div>\n                </div>\n              </div>\n            ))}\n            <button onClick={() => { setHistory([]); try { localStorage.removeItem('convo_' + username); } catch {} }} className={'text-xs text-center w-full mt-2 ' + textMuted + ' hover:opacity-80 transition-opacity'}>\n              Clear history\n            </button>\n          </div>\n        )}\n\n        {/* Ask Card — iMessage style */}"
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('1 persistent conversation history added');
console.log('2 light theme fixes applied to answer bubble, reactions, buttons');
