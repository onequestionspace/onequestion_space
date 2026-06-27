const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

c = c.replace(
  `        {/* Ask Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={'rounded-3xl p-6 mb-6 ' + cardClass}>
          {!submitted && (
            <p className='text-xs text-zinc-500 mb-4 leading-relaxed'>&ldquo;{welcomeMessage}&rdquo;</p>
          )}

          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className='relative mb-3'>
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
                    className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-zinc-500 focus:outline-none resize-none text-sm transition-colors leading-relaxed'
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                  />
                  <div className='absolute bottom-3 right-3 text-xs text-zinc-600'>
                    {charCount > 0 && <span className={charCount > MAX_CHARS * 0.85 ? 'text-yellow-500/70' : ''}>{charCount}/{MAX_CHARS}</span>}
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <button onClick={handleSubmit} disabled={!question.trim()}
                    className='ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-90 active:scale-95 shrink-0'
                    style={{ backgroundColor: color }}>
                    <Send className='w-4 h-4 text-black' />`,
  `        {/* Ask Card — iMessage style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>
          {!submitted && (
            <p className='text-xs text-zinc-600 mb-3 text-center'>&ldquo;{welcomeMessage}&rdquo;</p>
          )}

          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className='flex items-end gap-2 px-2 py-2 rounded-3xl border border-white/10 bg-white/3'>
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
                    <Send className='w-4 h-4 text-black' />`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
