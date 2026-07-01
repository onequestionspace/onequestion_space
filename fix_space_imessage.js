const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// 1. Remove "submitted" state logic — keep input always visible
// Replace the AnimatePresence form/response toggle with persistent chat

const oldAskCard = `        {/* Ask Card — iMessage style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>
          {!submitted && (
            <p className={'text-xs mb-4 text-center italic ' + textMuted}>&ldquo;{welcomeMessage}&rdquo;</p>
          )}

          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={'flex items-end gap-2 px-3 py-2 rounded-3xl border ' + (isLight ? 'border-zinc-200 bg-white/90' : 'border-zinc-700/50 bg-zinc-900/60') + ' backdrop-blur-sm shadow-sm'}>
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
                    className={'flex-1 px-3 py-2 bg-transparent focus:outline-none resize-none text-sm leading-relaxed ' + (isLight ? 'text-zinc-900 placeholder:text-zinc-400' : 'text-white placeholder:text-zinc-600')}
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:opacity-90 active:scale-95 shrink-0 mb-0.5'
                    style={{ backgroundColor: color }}>
                    <svg className='w-4 h-4 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M12 19V5M5 12l7-7 7 7'/></svg>
                  </button>
                </div>
                {suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestedQuestions.map((q, i) => (
                      <button key={i} onClick={() => { setQuestion(q); setCharCount(q.length); }}
                        className={'px-3 py-1.5 rounded-full border text-xs transition-all text-left ' + (isLight ? 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900' : 'border-white/10 bg-white/4 hover:bg-white/8 text-zinc-400 hover:text-white')}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm text-white text-sm leading-relaxed' style={{ backgroundColor: color }}>
                    <p className='text-sm leading-relaxed text-white'>{question}</p>
                  </div>
                </div>

                {isTyping && !aiResponse && (
                  <div className={'flex items-center gap-3 p-4 rounded-3xl rounded-bl-sm ' + (isLight ? 'bg-zinc-100 border border-zinc-200' : 'bg-white/5 border border-white/8')}>
                    <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || username} width={28} height={28} className='w-full h-full object-cover' />
                        : initials}
                    </div>
                    <div className='flex gap-1'>
                      {[0, 150, 300].map(d => (
                        <div key={d} className='w-1.5 h-1.5 rounded-full animate-bounce opacity-60'
                          style={{ backgroundColor: color, animationDelay: d + 'ms' }} />
                      ))}
                    </div>
                  </div>`;

const newAskCard = `        {/* Ask Card — persistent iMessage thread */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>

          {/* Welcome message — only show if no conversation yet */}
          {history.length === 0 && !submitted && (
            <p className={'text-xs mb-4 text-center italic ' + textMuted}>&ldquo;{welcomeMessage}&rdquo;</p>
          )}

          {/* Live conversation thread */}
          <div className='space-y-4 mb-4' ref={responseRef}>

            {/* Current exchange */}
            {submitted && (
              <>
                <div className='flex justify-end'>
                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm text-white text-sm leading-relaxed' style={{ backgroundColor: color }}>
                    {question}
                  </div>
                </div>

                {isTyping && !aiResponse && (
                  <div className='flex items-end gap-2'>
                    <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || username} width={28} height={28} className='w-full h-full object-cover' />
                        : initials}
                    </div>
                    <div className={'flex gap-1 px-4 py-3 rounded-3xl rounded-bl-sm ' + (isLight ? 'bg-zinc-100' : 'bg-white/8')}>
                      {[0, 150, 300].map(d => (
                        <div key={d} className='w-2 h-2 rounded-full animate-bounce'
                          style={{ backgroundColor: color, animationDelay: d + 'ms' }} />
                      ))}
                    </div>
                  </div>`;

page = page.replace(oldAskCard, newAskCard);

// 2. Fix the aiResponse section — make it a clean bubble, remove AI labels
const oldResponse = `                {aiResponse && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className='rounded-3xl rounded-tl-sm overflow-hidden'
                    style={{ backgroundColor: color + '18' }}>
                    <div className='px-4 pt-4 pb-3'>
                      <div className='flex items-center gap-2 mb-3'>
                        <div className='w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                          {profile.avatar
                            ? <Image src={profile.avatar} alt={profile.displayName || username} width={24} height={24} className='w-full h-full object-cover' />
                            : initials}
                        </div>

                        {!isTyping && responseTime && (
                          <span className='ml-auto text-xs opacity-30'>{responseTime}s</span>
                        )}
                      </div>
                      <p className={'text-sm leading-relaxed ' + (isLight ? 'text-zinc-900' : 'text-white')}>
                        {aiResponse}
                        {isTyping && <span className='inline-block w-1 h-3.5 ml-0.5 align-middle animate-pulse rounded-sm' style={{ backgroundColor: color }} />}
                      </p>
                    </div>

                    {!isTyping && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className='px-4 pb-4'>
                        <div className='flex items-center gap-2 mt-3 mb-3'>
                          <p className='text-xs opacity-30 mr-1'>React</p>
                          {['🔥', '👏', '💡', '❤️'].map(emoji => (
                            <button key={emoji} onClick={() => handleReaction(emoji)}
                              className={'px-2.5 py-1 rounded-full text-sm border transition-all ' + (reacted === emoji ? (isLight ? 'border-zinc-400 bg-zinc-100' : 'border-white/30 bg-white/10') : (isLight ? 'border-zinc-200 bg-white hover:bg-zinc-50' : 'border-white/8 bg-white/4 hover:bg-white/10'))}>
                              {emoji}
                              {reactions && (reactions as Record<string, number>)[emoji] ? <span className='ml-1 text-xs opacity-50'>{(reactions as Record<string, number>)[emoji]}</span> : null}
                            </button>
                          ))}
                        </div>
                        <button onClick={copyAnswer} className={'flex items-center gap-1.5 text-xs transition-opacity ' + (isLight ? 'text-zinc-500 hover:text-zinc-800' : 'opacity-40 hover:opacity-70')}>
                          {copiedAnswer ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
                          {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
                        </button>
                        <button onClick={shareToX} className="flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity mt-2">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          {sharedToX ? "Shared ✓" : "Share on X"}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {!isTyping && aiResponse && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className='mt-4'>
                    <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); setCharCount(0); }}
                      className={'w-full py-2.5 rounded-2xl border text-sm transition-all ' + (isLight ? 'border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50' : 'border-white/8 text-zinc-500 hover:text-white hover:bg-white/5')}>
                      Ask another question
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>`;

const newResponse = `                )}

                {aiResponse && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className='flex items-end gap-2'>
                    <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || username} width={28} height={28} className='w-full h-full object-cover' />
                        : initials}
                    </div>
                    <div className='flex-1'>
                      <div className={'max-w-[85%] px-4 py-3 rounded-3xl rounded-bl-sm text-sm leading-relaxed ' + (isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-white/8 text-white')}>
                        {aiResponse}
                        {isTyping && <span className='inline-block w-1 h-3.5 ml-0.5 align-middle animate-pulse rounded-sm' style={{ backgroundColor: color }} />}
                      </div>
                      {!isTyping && (
                        <div className='flex items-center gap-3 mt-2 ml-1'>
                          {['🔥', '👏', '💡', '❤️'].map(emoji => (
                            <button key={emoji} onClick={() => handleReaction(emoji)}
                              className={'text-base transition-all hover:scale-125 ' + (reacted === emoji ? 'opacity-100' : 'opacity-30 hover:opacity-80')}>
                              {emoji}
                            </button>
                          ))}
                          <span className={'mx-1 ' + (isLight ? 'text-zinc-200' : 'text-white/10')}>·</span>
                          <button onClick={copyAnswer} className={'text-xs transition-all ' + (isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-600 hover:text-zinc-300')}>
                            {copiedAnswer ? '✓ copied' : 'copy'}
                          </button>
                          <button onClick={shareToX} className={'text-xs transition-all ' + (isLight ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-600 hover:text-zinc-300')}>
                            {sharedToX ? '✓ shared' : 'share'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Always-visible input — like iMessage */}
          <div className={'flex items-end gap-2 px-3 py-2 rounded-3xl border ' + (isLight ? 'border-zinc-200 bg-white/90' : 'border-zinc-700/40 bg-zinc-900/50') + ' backdrop-blur-sm'}>
            <textarea
              value={question}
              onChange={e => {
                if (e.target.value.length <= MAX_CHARS) {
                  setQuestion(e.target.value);
                  setCharCount(e.target.value.length);
                }
              }}
              placeholder={'Ask ' + firstName + ' anything...'}
              rows={question.length > 60 ? 3 : 1}
              className={'flex-1 px-2 py-1.5 bg-transparent focus:outline-none resize-none text-sm leading-relaxed ' + (isLight ? 'text-zinc-900 placeholder:text-zinc-400' : 'text-white placeholder:text-zinc-500')}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              disabled={isTyping}
            />
            <button onClick={handleSubmit} disabled={!question.trim() || isTyping}
              className='w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:opacity-90 active:scale-95 shrink-0'
              style={{ backgroundColor: color }}>
              <svg className='w-3.5 h-3.5 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M12 19V5M5 12l7-7 7 7'/></svg>
            </button>
          </div>

          {/* Suggested questions — only when no conversation */}
          {history.length === 0 && !submitted && suggestedQuestions.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3'>
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => { setQuestion(q); setCharCount(q.length); }}
                  className={'px-3 py-1.5 rounded-full border text-xs transition-all ' + (isLight ? 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50' : 'border-white/10 bg-white/4 text-zinc-400 hover:text-white hover:bg-white/8')}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </motion.div>`;

page = page.replace(oldResponse, newResponse);

// 3. Fix handleSubmit — don't clear question after submit, reset for next
page = page.replace(
  "    setSubmitted(true);\n    setIsTyping(true);\n    setAiResponse('');",
  "    if (!question.trim() || isTyping) return;\n    const currentQuestion = question;\n    setQuestion('');\n    setCharCount(0);\n    setSubmitted(true);\n    setIsTyping(true);\n    setAiResponse('');"
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('space page rewritten as persistent iMessage thread');
