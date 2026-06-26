const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Add response timer state
c = c.replace(
  `  const [reacted, setReacted] = useState<string | null>(null);`,
  `  const [reacted, setReacted] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);`
);

// 2. Track start time and response time in handleSubmit
c = c.replace(
  `    setSubmitted(true);
    setIsTyping(true);
    setAiResponse('');`,
  `    setSubmitted(true);
    setIsTyping(true);
    setAiResponse('');
    setResponseTime(null);
    const t0 = Date.now();
    setStartTime(t0);`
);

// 3. Set response time when answer arrives
c = c.replace(
  `      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'Give me a moment — try asking again.');`,
  `      setResponseTime(Math.round((Date.now() - t0) / 100) / 10);
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'Give me a moment — try asking again.');`
);

// 4. Remove the welcome message widget — too formal
c = c.replace(
  `          <div className='flex items-start gap-3 p-4 rounded-2xl mb-5'
            style={{ backgroundColor: color + '10', border: '1px solid ' + color + '20' }}>
            <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt={profile.displayName || username} width={28} height={28} className='w-full h-full object-cover' />
                : initials}
            </div>
            <p className='text-sm text-white/70 leading-relaxed italic'>&ldquo;{welcomeMessage}&rdquo;</p>
          </div>`,
  `          {!submitted && (
            <p className='text-xs text-zinc-500 mb-4 leading-relaxed'>&ldquo;{welcomeMessage}&rdquo;</p>
          )}`
);

// 5. Remove "AI" label from response — feels robotic
c = c.replace(
  `                        {!isTyping && (
                          <span className='ml-auto flex items-center gap-1 text-xs opacity-30'>
                            <Sparkles className='w-3 h-3' /> AI
                          </span>
                        )}`,
  `                        {!isTyping && responseTime && (
                          <span className='ml-auto text-xs opacity-30'>{responseTime}s</span>
                        )}`
);

// 6. Make visitor bubble more iMessage — blue-ish dark
c = c.replace(
  `                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-lg bg-zinc-700 border border-white/8'>
                    <p className='text-sm leading-relaxed text-white'>{question}</p>
                  </div>`,
  `                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm' style={{ backgroundColor: '#3a3a3c' }}>
                    <p className='text-sm leading-relaxed text-white'>{question}</p>
                  </div>`
);

// 7. Make AI response bubble feel like a person typed it — remove border, warmer
c = c.replace(
  `                    className='rounded-3xl rounded-tl-lg overflow-hidden'
                    style={{ backgroundColor: color + '12', border: '1px solid ' + color + '30' }}>`,
  `                    className='rounded-3xl rounded-tl-sm overflow-hidden'
                    style={{ backgroundColor: color + '18' }}>`
);

// 8. Remove firstName label from AI bubble — just show avatar, feels more human
c = c.replace(
  `                        <span className='text-xs font-medium opacity-50'>{firstName}</span>`,
  ``
);

// 9. Make response text warmer — full white not 80%
c = c.replace(
  `                      <p className='text-sm text-white/80 leading-relaxed'>`,
  `                      <p className='text-sm text-white leading-relaxed'>`
);

// 10. Change "Ask another question" to feel more casual
c = c.replace(
  `                    ↩ Ask another question`,
  `                    ↩ Ask something else`
);

// 11. Make the outer container full screen on mobile — no padding bottom (for sticky input)
c = c.replace(
  `      <div className='max-w-xl mx-auto px-4 py-16'>`,
  `      <div className='max-w-xl mx-auto px-4 py-12 pb-8'>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
