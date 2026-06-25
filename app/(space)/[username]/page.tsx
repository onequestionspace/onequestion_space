'use client';

import { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Send, Sparkles, Copy, Check, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { LinkPreviewCard } from '@/components/LinkPreviewCard';

const COFOUNDER_IDS = ['user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz'];
const FOUNDER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';

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
  dark: 'bg-[#0f0c1a]',
  darker: 'bg-[#06040f]',
  midnight: 'bg-[#080c18]',
  aurora: 'bg-[#0a0818]',
  dusk: 'bg-[#130818]',
  galaxy: 'bg-[#06040e]',
  ocean: 'bg-[#04111a]',
  dawn: 'bg-[#1a0e1a]',
  fog: 'bg-[#eeeaf6]',
  sand: 'bg-[#f5efe6]',
  parchment: 'bg-[#faf6f0]',
  sunset: 'bg-[#180810]',
  rose: 'bg-[#f7e5e4]',
  mint: 'bg-[#e4f5ee]',
  slate: 'bg-[#e8eaf2]',
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
// Static particles — deterministic to avoid hydration mismatch
const PARTICLES = [
  { width: 3, height: 3, left: 10, top: 15, duration: 12, delay: 0 },
  { width: 5, height: 5, left: 25, top: 40, duration: 16, delay: 1 },
  { width: 2, height: 2, left: 40, top: 70, duration: 10, delay: 2 },
  { width: 4, height: 4, left: 55, top: 20, duration: 14, delay: 0.5 },
  { width: 3, height: 3, left: 70, top: 55, duration: 18, delay: 3 },
  { width: 6, height: 6, left: 85, top: 30, duration: 11, delay: 1.5 },
  { width: 2, height: 2, left: 15, top: 80, duration: 15, delay: 4 },
  { width: 4, height: 4, left: 30, top: 10, duration: 13, delay: 2.5 },
  { width: 3, height: 3, left: 60, top: 85, duration: 17, delay: 0.8 },
  { width: 5, height: 5, left: 80, top: 65, duration: 12, delay: 3.5 },
  { width: 2, height: 2, left: 90, top: 45, duration: 16, delay: 1.2 },
  { width: 4, height: 4, left: 45, top: 50, duration: 10, delay: 4.5 },
  { width: 3, height: 3, left: 5, top: 60, duration: 14, delay: 0.3 },
  { width: 5, height: 5, left: 35, top: 90, duration: 18, delay: 2.8 },
  { width: 2, height: 2, left: 75, top: 5, duration: 11, delay: 1.8 },
  { width: 4, height: 4, left: 20, top: 35, duration: 15, delay: 3.2 },
  { width: 3, height: 3, left: 50, top: 75, duration: 13, delay: 0.6 },
  { width: 6, height: 6, left: 65, top: 25, duration: 17, delay: 4.2 },
  { width: 2, height: 2, left: 92, top: 80, duration: 12, delay: 2.2 },
  { width: 4, height: 4, left: 8, top: 95, duration: 16, delay: 1.6 },
];

function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className='absolute rounded-full opacity-20 animate-float'
          style={{
            width: p.width + 'px',
            height: p.height + 'px',
            backgroundColor: color,
            left: p.left + '%',
            top: p.top + '%',
            '--duration': p.duration + 's',
            '--delay': p.delay + 's',
          }}
        />
      ))}
    </div>
  );
}

const BUBBLES = Array.from({ length: 12 }).map(() => ({
  width: Math.random() * 60 + 20,
  height: Math.random() * 60 + 20,
  left: Math.random() * 100,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 8,
}));

function BubblesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className='absolute rounded-full animate-rise'
          style={{
            width: b.width + 'px',
            height: b.height + 'px',
            border: '1px solid ' + color + '30',
            backgroundColor: color + '08',
            left: b.left + '%',
            bottom: '-100px',
            animationDuration: b.duration + 's',
            animationDelay: b.delay + 's',
          }}
        />
      ))}
    </div>
  );
}

const NET_CIRCLES = Array.from({ length: 8 }).map(() => ({
  cx: Math.random() * 100,
  cy: Math.random() * 100,
}));

function NetBackground({ color }: { color: string }) {
  return (
    <svg className='fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-20' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='net' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'>
          <path d='M 60 0 L 0 0 0 60' fill='none' stroke={color} strokeWidth='0.5' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#net)' />
      {NET_CIRCLES.map((c, i) => (
        <circle
          key={i}
          cx={c.cx + '%'}
          cy={c.cy + '%'}
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

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソ';
const MATRIX_COLS = Array.from({ length: 15 }).map(() => ({
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
  chars: Array.from({ length: 20 }).map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
}));

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
            animationDuration: MATRIX_COLS[i].duration + 's',
            animationDelay: MATRIX_COLS[i].delay + 's',
          }}
        >
          {MATRIX_COLS[i].chars.map((ch: string, j: number) => (
            <span key={j}>{ch}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpaceBackground({ themeEffect, color }: { themeEffect: string; color: string }) {
  switch (themeEffect) {
    case 'particles': return <ParticlesBackground color={color} />;
    case 'bubbles': return <BubblesBackground color={color} />;
    case 'net': return <NetBackground color={color} />;
    case 'matrix': return <MatrixBackground color={color} />;
    default: return (
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25' style={{ backgroundColor: color }} />
        <div className='absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10' style={{ backgroundColor: color }} />
        <div className='absolute top-1/2 left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-8' style={{ backgroundColor: color }} />
        <div className='absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0' />
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
  const foundingMember = useQuery(
    api.founding.isFoundingMember,
    profile?._id ? { userId: profile.userId } : 'skip'
  );
  const earlyAdopter = useQuery(
    api.earlyAdopters.isEarlyAdopter,
    profile?._id ? { userId: profile.userId } : 'skip'
  );

  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];
  const allQuestions = useQuery(
    api.questions.getRecentQuestions,
    profile?._id ? { profileId: profile._id, limit: 50 } : 'skip'
  );
  const pinnedAnswers = allQuestions?.filter(q => q.isAnswered && pinnedIds.includes(q._id)) || [];
  const reactions = useQuery(
    api.reactions.getReactions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const [reacted, setReacted] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState('');

  const _visitorId = visitorId || 'anon';
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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'Give me a moment — try asking again.');
      let current = '';
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        current += words[i] + ' ';
        setAiResponse(current);
        await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        setAiResponse('Taking longer than usual. Please try again.');
      } else {
        setAiResponse('Something went wrong. Please try again.');
      }
    }
    setIsTyping(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + username);
    setCopied(true);
    toast.success("✨ Link copied! Share the knowledge.");
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
  const themeEffect = (profile as Record<string, unknown>).themeEffect as string || 'none';
  const fontClass = FONT_STYLES[profile.themeFont || 'inter'];
  const cardClass = CARD_STYLES[profile.themeCardStyle || 'glass'];
  let social: Record<string, string> = {};
  if (profile.socialLinks) { try { social = JSON.parse(profile.socialLinks); } catch {} }
  const initials = profile.displayName?.charAt(0)?.toUpperCase() || username.charAt(0).toUpperCase();
  const welcomeMessage = profile.welcomeMessage || 'Ask me anything about ' + (profile.displayName || username) + '.';
  const vibeQuote = profile ? ((profile as Record<string, unknown>).vibeQuote as string || '') : '';
  let spaceLinks: {title: string, url: string}[] = [];
  try { spaceLinks = profile ? JSON.parse((profile as Record<string, unknown>).links as string || '[]') : []; } catch {}


  const isLight = ['fog','sand','parchment','rose','mint','slate'].includes(profile.themeBg || '');
  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-800' : ' text-white')}>
      <SpaceBackground themeEffect={themeEffect} color={color} />
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>
      <div className='max-w-xl mx-auto px-4 py-16'>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-10'>
          <div className='relative w-28 h-28 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full animate-ping opacity-20' style={{ backgroundColor: color }} />
            <div className='absolute inset-0 rounded-full opacity-30 scale-110' style={{ boxShadow: '0 0 40px ' + color + '60' }} />
            <div className='relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-white' style={{ background: profile.avatar ? undefined : color, boxShadow: '0 0 0 3px ' + color + '50, 0 0 0 6px ' + color + '20' }}>
              {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName} className='w-full h-full object-cover' width={112} height={112} /> : initials}
            </div>
          </div>
          <h1 className='text-3xl font-bold text-white mb-1 tracking-tight'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-3 flex-wrap'>
            <p className='text-sm font-medium opacity-70' style={{ color }}>@{profile.username}</p>
            {profile.userId === FOUNDER_ID && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'>
                👑 Founder
              </span>
            )}
            {profile.userId !== FOUNDER_ID && foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'>
                👑 Founding Member
              </span>
            )}
            {!foundingMember && earlyAdopter && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>
                ⚡ Early Adopter
              </span>
            )}
            {COFOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30'>
                🤝 Co-Founder
              </span>
            )}
          </div>
          {profile.bio && <p className='text-zinc-400 text-sm max-w-sm mx-auto mb-5 leading-relaxed'>{profile.bio}</p>}
          {(social.twitter || social.github || social.website || social.linkedin) && (
            <div className='flex items-center justify-center gap-2 mb-5'>
              {social.twitter && (
                <a href={'https://twitter.com/' + social.twitter.replace('@','')} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                  {social.twitter.replace('@','')}
                </a>
              )}
              {social.github && (
                <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                  {social.github}
                </a>
              )}
              {social.linkedin && (
                <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                  {social.linkedin}
                </a>
              )}
              {social.website && (
                <a href={social.website} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all text-white text-xs font-medium border border-white/10'>
                  <Globe className='w-3 h-3' />
                  Website
                </a>
              )}
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
          <div className='flex items-center justify-center gap-3'>
            <button onClick={copyLink} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all'>
              {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
              {copied ? 'Copied!' : 'Share this space'}
            </button>
          </div>

          {/* Vibe Quote */}
          {vibeQuote && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='mt-6 px-4 py-4 rounded-2xl text-center' style={{ backgroundColor: color + '10', border: '1px solid ' + color + '20' }}>
              <p className='text-sm leading-relaxed italic opacity-80'>&ldquo;{vibeQuote}&rdquo;</p>
            </motion.div>
          )}

          {/* Links */}
          {spaceLinks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} />
              ))}
            </motion.div>
          )}

          {/* Pinned Answers */}
          {pinnedAnswers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='mt-6'>
              <p className='text-xs font-medium uppercase tracking-widest opacity-40 mb-3 text-center'>Pinned answers</p>
              <div className='space-y-3'>
                {pinnedAnswers.map((q, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden border border-white/8'>
                    <div className='px-4 py-3 bg-white/5'>
                      <p className='text-sm font-medium'>{q.question}</p>
                    </div>
                    <div className='px-4 py-3' style={{ backgroundColor: color + '08' }}>
                      <div className='flex items-center gap-2 mb-1.5'>
                        <div className='w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold shrink-0' style={{ backgroundColor: color }}>
                          {profile.avatar ? <Image src={profile.avatar} alt="" width={16} height={16} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <span className='text-xs opacity-50'>{profile.displayName?.split(' ')[0] || username}</span>
                      </div>
                      <p className='text-xs opacity-70 leading-relaxed'>{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={'rounded-3xl p-8 mb-6 ' + cardClass}>
          <div className='mb-5'>
            <p className='text-xs font-medium mb-3 tracking-wide uppercase opacity-50 text-white'>{profile.displayName?.split(' ')[0] || username} reads every question</p>
            <div className='flex items-start gap-3 p-4 rounded-2xl' style={{ backgroundColor: color + '12', border: '1px solid ' + color + '25' }}>
              <div className='w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName || username} width={32} height={32} className="w-full h-full object-cover" /> : initials}
              </div>
              <p className='text-sm text-white/75 leading-relaxed italic'>&ldquo;{welcomeMessage}&rdquo;</p>
            </div>
          </div>
          <AnimatePresence mode='wait'>
            {!submitted ? (
              <motion.div key='form' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea autoFocus  value={question} onChange={e => setQuestion(e.target.value)} placeholder={'What do you want to ask ' + (profile.displayName?.split(' ')[0] || username) + '?'} rows={4} className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none resize-none mb-4 text-sm' onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }} />
                <button onClick={handleSubmit} disabled={!question.trim()} className='w-full py-3 px-6 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 hover:opacity-90' style={{ backgroundColor: color }}>
                  <Send className='w-4 h-4' /> Send
                </button>

              </motion.div>
            ) : (
              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                {/* Question bubble */}
                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-2xl bg-white/8 border border-white/10'>
                    <p className='text-sm text-white leading-relaxed'>{question}</p>
                  </div>
                </div>
                {isTyping && !aiResponse && (
                  <div className='flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10'>
                    <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0' style={{ backgroundColor: color }}>
                      {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName || username} width={32} height={32} className="w-full h-full object-cover" /> : initials}
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
                        <div className='w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0' style={{ backgroundColor: color }}>
                          {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName || username} width={32} height={32} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <span className='text-xs font-medium text-zinc-400'>{profile.displayName?.split(' ')[0] || username}</span>
                      </div>
                      
                    </div>
                    <p className='text-sm text-white/80 leading-relaxed'>
                      {aiResponse}
                      {isTyping && <span className='inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm' style={{ backgroundColor: color }} />}
                    </p>
                  </div>
                )}

                {!isTyping && aiResponse && (
                  <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }} className='w-full mt-4 py-2.5 rounded-2xl border border-white/10 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                    ← Ask something else
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className='mt-12 text-center border-t border-white/5 pt-8'>
          <p className='text-xs text-zinc-600 mb-1'>Powered by</p>
          <Link href='/' className='text-sm font-bold' style={{ color }}>One Question ✦</Link>
          <p className='text-xs text-zinc-600 mt-3'>
            <span className='inline-flex items-center gap-1'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              Want your own space?
            </span>{' '}
            <Link href='/sign-up' className='underline hover:text-zinc-400 transition-colors'>Claim yours free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}