const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add expandedPin state after reacted state
c = c.replace(
  `  const [reacted, setReacted] = useState<string | null>(null);`,
  `  const [reacted, setReacted] = useState<string | null>(null);
  const [expandedPin, setExpandedPin] = useState<number | null>(null);`
);

// Replace pinned section with accordion
c = c.replace(
  `          {/* Pinned answers */}
          {pinnedAnswers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='mt-8'>
              <p className='text-xs font-medium uppercase tracking-widest opacity-30 mb-3'>Pinned</p>
              <div className='space-y-3'>
                {pinnedAnswers.map((q, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden border border-white/8 text-left'>
                    <div className='px-4 py-3 bg-white/4'>
                      <p className='text-sm font-medium'>{q.question.charAt(0).toUpperCase() + q.question.slice(1)}</p>
                    </div>
                    <div className='px-4 py-3' style={{ backgroundColor: color + '08' }}>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold shrink-0 text-white' style={{ backgroundColor: color }}>
                          {profile.avatar ? <Image src={profile.avatar} alt='' width={16} height={16} className='w-full h-full object-cover' /> : initials}
                        </div>
                        <span className='text-xs opacity-40'>{firstName}</span>
                      </div>
                      <p className='text-xs opacity-65 leading-relaxed'>{q.answer ? stripMarkdown(q.answer) : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}`,
  `          {/* Pinned answers — accordion */}
          {pinnedAnswers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='mt-8'>
              <p className='text-xs font-medium uppercase tracking-widest opacity-30 mb-3'>Pinned</p>
              <div className='space-y-2'>
                {pinnedAnswers.map((q, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden border border-white/8 text-left cursor-pointer'
                    onClick={() => setExpandedPin(expandedPin === i ? null : i)}>
                    <div className='px-4 py-3 bg-white/4 flex items-center justify-between gap-3'>
                      <p className='text-sm font-medium'>{q.question.charAt(0).toUpperCase() + q.question.slice(1)}</p>
                      <span className='text-xs opacity-30 shrink-0 transition-transform duration-200'
                        style={{ transform: expandedPin === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                    <AnimatePresence>
                      {expandedPin === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className='overflow-hidden'
                        >
                          <div className='px-4 py-3 border-t border-white/5' style={{ backgroundColor: color + '08' }}>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold shrink-0 text-white' style={{ backgroundColor: color }}>
                                {profile.avatar ? <Image src={profile.avatar} alt='' width={16} height={16} className='w-full h-full object-cover' /> : initials}
                              </div>
                              <span className='text-xs opacity-40'>{firstName}</span>
                            </div>
                            <p className='text-sm opacity-80 leading-relaxed'>{q.answer ? stripMarkdown(q.answer) : ''}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
