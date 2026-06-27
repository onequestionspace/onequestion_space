const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Add new state variables after existing ones
c = c.replace(
  `  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const responseRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 300;`,
  `  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [visitorEmail, setVisitorEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [sharedToX, setSharedToX] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 300;`
);

// 2. Add suggested questions fetch after profile loads
c = c.replace(
  `  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);`,
  `  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  useEffect(() => {
    if (profile?.displayName && suggestedQuestions.length === 0) {
      const name = profile.displayName.split(' ')[0];
      setSuggestedQuestions([
        'Who is ' + name + ' and what do they do?',
        'How can I work with ' + name + '?',
        'What is ' + name + ' currently building?',
      ]);
    }
  }, [profile?.displayName, suggestedQuestions.length]);`
);

// 3. Add shareToX function after copyAnswer
c = c.replace(
  `  const handleReaction = async (emoji: string) => {`,
  `  const shareToX = () => {
    const text = 'Just asked @' + (social.twitter?.replace('@','') || username) + ' a question on their AI space and got this answer:\\n\\n"' + aiResponse.slice(0, 200) + (aiResponse.length > 200 ? '...' : '') + '"\\n\\nonequestion.space/' + username;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
    setSharedToX(true);
  };

  const handleReaction = async (emoji: string) => {`
);

// 4. Replace the ask form with email capture + suggested questions
c = c.replace(
  `        {/* Ask Card — iMessage style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>                 {!submitted && (
            <p className='text-xs text-zinc-600 mb-3 text-center'>&ldquo;{welcomeMessage}&rdquo;</p>
          )}
                                                       <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className='flex items-end gap-2 px-2 py-2 rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm'>
                  <textarea
                    value={question}
                    onChange={e => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setQuestion(e.target.value);
                        setCharCount(e.target.value.length);
                      }                                          }}
                    placeholder={'Ask ' + firstName + ' anything...'}
                    rows={2}                                     className='flex-1 px-3 py-2 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none text-sm leading-relaxed'                                             onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <button onClick={handleSubmit} disabled={!question.trim()}                                  className='w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:opacity-90 active:scale-95 shrink-0 mb-0.5'
                    style={{ backgroundColor: color }}>
                    <Send className='w-4 h-4 text-black' />
                  </button>
                </div>
              </motion.div>`,
  `        {/* Ask Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>
          {!submitted && (
            <p className='text-xs text-zinc-600 mb-3 text-center'>&ldquo;{welcomeMessage}&rdquo;</p>
          )}

          {/* Suggested questions */}
          {!submitted && suggestedQuestions.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-3 justify-center'>
              {suggestedQuestions.map((sq, i) => (
                <button key={i} onClick={() => setQuestion(sq)}
                  className='px-3 py-1.5 rounded-full text-xs border transition-all hover:opacity-90 active:scale-95'
                  style={{ borderColor: color + '40', backgroundColor: color + '10', color: color }}>
                  {sq}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Email capture */}
                {!emailCaptured && (
                  <div className='mb-2'>
                    <input
                      type='email'
                      value={visitorEmail}
                      onChange={e => setVisitorEmail(e.target.value)}
                      placeholder='Your email (optional — get notified of replies)'
                      className='w-full px-4 py-2.5 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 text-white placeholder:text-zinc-600 focus:outline-none text-xs'
                    />
                  </div>
                )}
                <div className='flex items-end gap-2 px-2 py-2 rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm'>
                  <textarea
                    value={question}
                    onChange={e => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setQuestion(e.target.value);
                        setCharCount(e.target.value.length);
                      }
                    }}
                    placeholder={'Ask ' + firstName + ' anything...'}
                    rows={2}
                    className='flex-1 px-3 py-2 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none text-sm leading-relaxed'
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:opacity-90 active:scale-95 shrink-0 mb-0.5'
                    style={{ backgroundColor: color }}>
                    <Send className='w-4 h-4 text-black' />
                  </button>
                </div>
                {charCount > 0 && (
                  <p className='text-xs text-zinc-700 mt-1 text-right'>{charCount}/{MAX_CHARS}</p>
                )}
              </motion.div>`
);

// 5. Add share to X and WhatsApp buttons after copy answer button
c = c.replace(
  `                        <button onClick={copyAnswer} className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>
                          {copiedAnswer ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}                                           {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
                        </button>`,
  `                        <div className='flex items-center gap-3 flex-wrap'>
                          <button onClick={copyAnswer} className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>
                            {copiedAnswer ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
                            {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
                          </button>
                          <button onClick={shareToX}
                            className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>
                            <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                            {sharedToX ? 'Shared ✓' : 'Share on X'}
                          </button>
                          {social.twitter && (
                            <a href={'https://twitter.com/' + social.twitter.replace('@','')} target='_blank' rel='noopener noreferrer'
                              className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>
                              <ExternalLink className='w-3 h-3' /> DM {firstName}
                            </a>
                          )}
                        </div>`
);

// 6. Pass visitorEmail to handleSubmit API call
c = c.replace(
  `        body: JSON.stringify({ question, username }),`,
  `        body: JSON.stringify({ question, username, visitorEmail: visitorEmail || undefined }),`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
