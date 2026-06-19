'use client';

import { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Sparkles, Copy, Check, XIcon, GitBranch, Globe, ExternalLink } from 'lucide-react';

const stripMarkdown = (text: string) => {
  return text
    .split('**').join('')
    .split('##').join('')
    .split('# ').join('')
    .split('* ').join('')
    .split('__').join('')
    .replace(/^[#]+\s/gm, '')
    .trim();
};

const BG_STYLES: Record<string, string> = {
  dark: 'bg-zinc-900',
  darker: 'bg-black',
  midnight: 'bg-slate-950',
  aurora: 'bg-gradient-to-br from-purple-950 to-blue-950',
  sunset: 'bg-gradient-to-br from-orange-950 to-pink-950',
  ocean: 'bg-gradient-to-br from-cyan-950 to-blue-950',
  particles: 'bg-zinc-950',
  bubbles: 'bg-zinc-950',
  net: 'bg-zinc-950',
  matrix: 'bg-black',
};

const FONT_STYLES: Record<string, string> = {
  inter: 'font-sans',
  mono: 'font-mono',
  serif: 'font-serif',
};

const CARD_STYLES: Record<string, string> = {
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  solid: 'bg-zinc-900 border border-zinc-800',
  minimal: 'bg-transparent',
};


// ── Animated Background Components ──────────────────────────────────────────
function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full opacity-20 animate-float'
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            backgroundColor: color,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 8 + 's',
            animationDelay: Math.random() * 5 + 's',
          }}
        />
      ))}
    </div>
  );
}

function BubblesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full animate-rise'
          style={{
            width: Math.random() * 60 + 20 + 'px',
            height: Math.random() * 60 + 20 + 'px',
            border: '1px solid ' + color + '30',
            backgroundColor: color + '08',
            left: Math.random() * 100 + '%',
            bottom: '-100px',
            animationDuration: Math.random() * 12 + 10 + 's',
            animationDelay: Math.random() * 8 + 's',
          }}
        />
      ))}
    </div>
  );
}

function NetBackground({ color }: { color: string }) {
  return (
    <svg className='fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-20' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='net' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'>
          <path d='M 60 0 L 0 0 0 60' fill='none' stroke={color} strokeWidth='0.5' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#net)' />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 100 + '%'}
          r='3'
          fill={color}
          opacity='0.4'
        />
      ))}
    </svg>
  );
}

function AuroraBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      <div className='absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-30 animate-aurora-1' style={{ backgroundColor: color }} />
      <div className='absolute top-1/2 -right-40 w-80 h-80 rounded-full blur-[100px] opacity-20 animate-aurora-2' style={{ backgroundColor: color }} />
      <div className='absolute -bottom-40 left-1/3 w-72 h-72 rounded-full blur-[80px] opacity-25 animate-aurora-3' style={{ backgroundColor: color }} />
    </div>
  );
}

function MatrixBackground({ color }: { color: string }) {
  const chars = '01アイウエオカキクケコサシスセソ';
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className='absolute top-0 text-xs font-mono animate-matrix flex flex-col gap-2'
          style={{
            color: color,
            opacity: 0.15,
            left: (i * 7) + '%',
            animationDuration: Math.random() * 8 + 6 + 's',
            animationDelay: Math.random() * 4 + 's',
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <span key={j}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpaceBackground({ themeBg, color }: { themeBg: string; color: string }) {
  switch (themeBg) {
    case 'particles': return <ParticlesBackground color={color} />;
    case 'bubbles': return <BubblesBackground color={color} />;
    case 'net': return <NetBackground color={color} />;
    case 'aurora': return <AuroraBackground color={color} />;
    case 'matrix': return <MatrixBackground color={color} />;
    default: return (
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>
    );
  }
}

export default function SpacePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const profile = useQuery(api.profiles.byUsername, { username });
  const analytics = useQuery(
    api.analytics.getAnalytics,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const createQuestion = useMutation(api.questions.createQuestion);
  const addReaction = useMutation(api.reactions.addReaction);
  const reactions = useQuery(
    api.reactions.getReactions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const [reacted, setReacted] = useState<string | null>(null);
  const visitorId = typeof window !== 'undefined'
    ? (localStorage.getItem('visitor_id') || (() => {
        const id = Math.random().toString(36).slice(2);
        localStorage.setItem('visitor_id', id);
        return id;
      })())
    : 'anon';
  const incrementVisitor = useMutation(api.analytics.incrementVisitorCount);
  const incrementQuestion = useMutation(api.analytics.incrementQuestionCount);

  useEffect(() => {
    if (profile?._id) {
      const key = 'visited_' + profile._id;
      const last = localStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last) > 86400000) {
        incrementVisitor({ profileId: profile._id }).catch(() => {});
        localStorage.setItem(key, now.toString());
      }
    }
  }, [profile?._id, incrementVisitor]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  const handleSubmit = async () => {
    if (!question.trim() || !profile?._id) return;
    setSubmitted(true);
    setIsTyping(true);
    setAiResponse('');
    try {
      await createQuestion({ profileId: profile._id, question });
      await incrementQuestion({ profileId: profile._id });
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username }),
      });
      const data = await res.json();
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'I am thinking through your question.');
      let current = '';
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        current += words[i] + ' ';
        setAiResponse(current);
        await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
      }
    } catch {
      setAiResponse('Something went wrong. Please try again.');
    }
    setIsTyping(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profile === undefined) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='animate-pulse text-zinc-500'>Loading...</div>
    </div>
  );

  if (profile === null) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-white mb-2'>Space not found</h1>
        <p className='text-zinc-500'>This space does not exist yet.</p>
      </div>
    </div>
  );

  const color = profile.themeColor || '#a855f7';
  const bgClass = BG_STYLES[profile.themeBg || 'dark'];
  const fontClass = FONT_STYLES[profile.themeFont || 'inter'];
  const cardClass = CARD_STYLES[profile.themeCardStyle || 'glass'];
  let social: Record<string, string> = {};
  if (profile.socialLinks) { try { social = JSON.parse(profile.socialLinks); } catch {} }
  const initials = profile.displayName?.charAt(0)?.toUpperCase() || username.charAt(0).toUpperCase();
  const welcomeMessage = profile.welcomeMessage || 'Ask me anything about ' + (profile.displayName || username) + '.';

  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass}>
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>
      <div className='max-w-xl mx-auto px-4 py-16'>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-10'>
          <div className='w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-white' style={{ background: profile.avatar ? undefined : color, boxShadow: '0 0 0 4px ' + color + '30' }}>
            {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName} className='w-full h-full object-cover'  width={48} height={48} /> : initials}
          </div>
          <h1 className='text-2xl font-bold text-white mb-1'>{profile.displayName}</h1>
          <p className='text-sm mb-3' style={{ color }}>{profile.username}</p>
          {profile.bio && <p className='text-zinc-400 text-sm max-w-sm mx-auto mb-5 leading-relaxed'>{profile.bio}</p>}
          {(social.twitter || social.github || social.website || social.linkedin) && (
            <div className='flex items-center justify-center gap-3 mb-5'>
              {social.twitter && <a href={'https://twitter.com/' + social.twitter.replace('@','')} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>X</a>}
              {social.github && <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>GH</a>}
              {social.linkedin && <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold'>in</a>}
              {social.website && <a href={social.website} target='_blank' rel='noopener noreferrer' className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'><Globe className='w-3.5 h-3.5 text-white' /></a>}
            </div>
          )}
          {analytics && (
            <div className='flex items-center justify-center gap-6 mb-5'>
              <div className='text-center'><p className='text-lg font-bold text-white'>{analytics.totalQuestions}</p><p className='text-xs text-zinc-500'>Questions</p></div>
              <div className='w-px h-8 bg-white/10' />
              <div className='text-center'><p className='text-lg font-bold text-white'>{analytics.totalVisitors}</p><p className='text-xs text-zinc-500'>Visitors</p></div>
              {analytics.totalQuestions > 0 && (<>
                <div className='w-px h-8 bg-white/10' />
                <div className='text-center'><p className='text-lg font-bold text-white'>{Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%</p><p className='text-xs text-zinc-500'>Response Rate</p></div>
              </>)}
            </div>
          )}
          <button onClick={copyLink} className='inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors'>
            {copied ? <Check className='w-3 h-3 text-green-500' /> : <Copy className='w-3 h-3' />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={'rounded-3xl p-8 mb-6 ' + cardClass}>
          <div className='flex items-start gap-3 mb-6 p-4 rounded-2xl' style={{ backgroundColor: color + '15', border: '1px solid ' + color + '30' }}>
            <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0' style={{ backgroundColor: color + '25' }}>
              <Sparkles className='w-4 h-4' style={{ color }} />
            </div>
            <p className='text-sm text-white/80 leading-relaxed'>{welcomeMessage}</p>
          </div>
          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder='What would you like to know?' rows={4} className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none resize-none mb-4 text-sm' onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }} />
                <button onClick={handleSubmit} disabled={!question.trim()} className='w-full py-3 px-6 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 hover:opacity-90' style={{ backgroundColor: color }}>
                  <Send className='w-4 h-4' /> Ask Question
                </button>
                <p className='text-center text-xs text-zinc-600 mt-3'>Press Cmd+Enter to submit</p>
              </motion.div>
            ) : (
              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                {/* Question bubble */}
                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-xs text-zinc-500 mb-1'>You asked</p>
                    <p className='text-sm text-white leading-relaxed'>{question}</p>
                  </div>
                </div>
                {isTyping && !aiResponse && (
                  <div className='flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10'>
                    <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: color + '25' }}>
                      <Brain className='w-4 h-4' style={{ color }} />
                    </div>
                    <div className='flex gap-1'>
                      {[0,150,300].map(d => <div key={d} className='w-2 h-2 rounded-full animate-bounce' style={{ backgroundColor: color, animationDelay: d + 'ms' }} />)}
                    </div>
                  </div>
                )}
                {aiResponse && (
                  <div className='p-4 rounded-2xl' style={{ backgroundColor: color + '10', border: '1px solid ' + color + '25' }}>
                    <div className='flex items-center justify-between gap-2 mb-3'>
                      <div className='flex items-center gap-2'>
                        <Brain className='w-4 h-4' style={{ color }} />
                        <span className='text-xs font-medium' style={{ color }}>AI Response</span>
                      </div>
                      <span className='text-xs text-zinc-600'>{aiResponse.split(' ').length} tokens</span>
                    </div>
                    <p className='text-sm text-white/80 leading-relaxed'>
                      {aiResponse}
                      {isTyping && <span className='inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm' style={{ backgroundColor: color }} />}
                    </p>
                  </div>
                )}
                {!isTyping && aiResponse && profile?._id && (
                  <div className='mt-4 p-4 rounded-2xl bg-white/3 border border-white/8'>
                    <p className='text-xs text-zinc-500 mb-3 text-center'>Was this helpful?</p>
                    <div className='flex items-center justify-center gap-3'>
                      {[
                        { emoji: '🔥', label: 'Fire' },
                        { emoji: '❤️', label: 'Love' },
                        { emoji: '🧠', label: 'Insightful' },
                        { emoji: '👏', label: 'Clap' },
                        { emoji: '😮', label: 'Wow' },
                      ].map(({ emoji, label }) => (
                        <button
                          key={emoji}
                          onClick={async () => {
                            if (reacted) return;
                            setReacted(emoji);
                            await addReaction({ profileId: profile._id, emoji, visitorId });
                          }}
                          title={label}
                          className={'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ' + (reacted === emoji ? 'bg-white/10 scale-110' : reacted ? 'opacity-30' : 'hover:bg-white/8 hover:scale-105')}
                        >
                          <span className='text-xl'>{emoji}</span>
                          <span className='text-xs text-zinc-500'>
                            {(reactions?.[emoji] || 0) + (reacted === emoji ? 1 : 0)}
                          </span>
                        </button>
                      ))}
                    </div>
                    {reacted && (
                      <p className='text-xs text-center mt-3' style={{ color }}>
                        Thanks for the reaction!
                      </p>
                    )}
                  </div>
                )}
                {!isTyping && aiResponse && (
                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); setReacted(null); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    Ask another question
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <p className='text-center text-xs text-zinc-600'>
          Powered by{' '}
          <a href='https://onequestion.space' className='hover:text-zinc-400 transition-colors font-medium' style={{ color }}>One Question</a>
        </p>
      </div>
    </div>
  );
}