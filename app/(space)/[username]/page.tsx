'use client';

import { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Send, Copy, Check, Globe, ExternalLink, Sparkles } from 'lucide-react';
import { LinkPreviewCard } from '@/components/LinkPreviewCard';

const COFOUNDER_IDS = ['user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz'];
const FOUNDER_ID = 'user_3EhKmuVyC1AhoBDlL7QNssllwgu';
const FOUNDER_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu', 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs'];

const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .trim();
};

const BG_STYLES: Record<string, string> = {
  dark: 'bg-[#0f0c1a]', darker: 'bg-[#06040f]', midnight: 'bg-[#080c18]',
  aurora: 'bg-[#0a0818]', dusk: 'bg-[#130818]', galaxy: 'bg-[#06040e]',
  ocean: 'bg-[#04111a]', dawn: 'bg-[#1a0e1a]', fog: 'bg-[#eeeaf6]',
  sand: 'bg-[#f5efe6]', parchment: 'bg-[#faf6f0]', sunset: 'bg-[#180810]',
  rose: 'bg-[#f7e5e4]', mint: 'bg-[#e4f5ee]', slate: 'bg-[#e8eaf2]',
};

const FONT_STYLES: Record<string, string> = {
  inter: 'font-sans', mono: 'font-mono', serif: 'font-serif',
};

const CARD_STYLES: Record<string, string> = {
  glass: 'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800',
  solid: 'bg-zinc-900 border border-zinc-800',
  minimal: 'bg-transparent',
};

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
];

function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {PARTICLES.map((p, i) => (
        <div key={i} className='absolute rounded-full opacity-20 animate-float'
          style={{ width: p.width + 'px', height: p.height + 'px', backgroundColor: color,
            left: p.left + '%', top: p.top + '%', animationDuration: p.duration + 's', animationDelay: p.delay + 's' }} />
      ))}
    </div>
  );
}

const BUBBLES = [
  { width: 40, height: 40, left: 10, duration: 14, delay: 0 },
  { width: 25, height: 25, left: 25, duration: 18, delay: 2 },
  { width: 60, height: 60, left: 40, duration: 12, delay: 1 },
  { width: 35, height: 35, left: 60, duration: 16, delay: 3 },
  { width: 50, height: 50, left: 75, duration: 20, delay: 0.5 },
  { width: 30, height: 30, left: 88, duration: 14, delay: 4 },
];

function BubblesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {BUBBLES.map((b, i) => (
        <div key={i} className='absolute rounded-full animate-rise'
          style={{ width: b.width + 'px', height: b.height + 'px',
            border: '1px solid ' + color + '30', backgroundColor: color + '08',
            left: b.left + '%', bottom: '-100px',
            animationDuration: b.duration + 's', animationDelay: b.delay + 's' }} />
      ))}
    </div>
  );
}

const NET_CIRCLES = [
  { cx: 10, cy: 20 }, { cx: 30, cy: 50 }, { cx: 50, cy: 15 },
  { cx: 70, cy: 70 }, { cx: 85, cy: 35 }, { cx: 20, cy: 80 },
  { cx: 60, cy: 45 }, { cx: 90, cy: 60 },
];

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
        <circle key={i} cx={c.cx + '%'} cy={c.cy + '%'} r='3' fill={color} opacity='0.4' />
      ))}
    </svg>
  );
}

const MATRIX_COLS = [
  { duration: 8, delay: 0, chars: ['0','1','ア','イ','ウ','エ','オ','カ','キ','ク','0','1','ア','イ','ウ','エ','オ','カ','キ','ク'] },
  { duration: 10, delay: 1, chars: ['1','0','ケ','コ','サ','シ','ス','セ','ソ','ア','1','0','ケ','コ','サ','シ','ス','セ','ソ','ア'] },
  { duration: 7, delay: 2, chars: ['ア','イ','0','1','ウ','エ','オ','カ','キ','ク','ア','イ','0','1','ウ','エ','オ','カ','キ','ク'] },
  { duration: 9, delay: 0.5, chars: ['0','ケ','1','コ','0','サ','1','シ','0','ス','0','ケ','1','コ','0','サ','1','シ','0','ス'] },
  { duration: 11, delay: 3, chars: ['イ','ウ','エ','0','1','オ','カ','キ','ク','ケ','イ','ウ','エ','0','1','オ','カ','キ','ク','ケ'] },
  { duration: 8, delay: 1.5, chars: ['1','0','1','0','コ','サ','シ','ス','セ','ソ','1','0','1','0','コ','サ','シ','ス','セ','ソ'] },
  { duration: 10, delay: 4, chars: ['ア','0','イ','1','ウ','0','エ','1','オ','0','ア','0','イ','1','ウ','0','エ','1','オ','0'] },
  { duration: 7, delay: 2.5, chars: ['カ','キ','ク','ケ','コ','0','1','サ','シ','ス','カ','キ','ク','ケ','コ','0','1','サ','シ','ス'] },
  { duration: 9, delay: 0.8, chars: ['0','1','セ','ソ','ア','イ','ウ','エ','オ','カ','0','1','セ','ソ','ア','イ','ウ','エ','オ','カ'] },
  { duration: 12, delay: 3.5, chars: ['キ','ク','0','ケ','1','コ','0','サ','1','シ','キ','ク','0','ケ','1','コ','0','サ','1','シ'] },
  { duration: 8, delay: 1.2, chars: ['ス','セ','ソ','0','1','ア','イ','ウ','エ','オ','ス','セ','ソ','0','1','ア','イ','ウ','エ','オ'] },
  { duration: 10, delay: 4.5, chars: ['カ','0','キ','1','ク','0','ケ','1','コ','0','カ','0','キ','1','ク','0','ケ','1','コ','0'] },
  { duration: 7, delay: 0.3, chars: ['サ','シ','ス','セ','ソ','0','1','ア','イ','ウ','サ','シ','ス','セ','ソ','0','1','ア','イ','ウ'] },
  { duration: 9, delay: 2.8, chars: ['エ','オ','カ','0','キ','1','ク','0','ケ','1','エ','オ','カ','0','キ','1','ク','0','ケ','1'] },
  { duration: 11, delay: 1.8, chars: ['コ','サ','0','シ','1','ス','0','セ','1','ソ','コ','サ','0','シ','1','ス','0','セ','1','ソ'] },
];

function MatrixBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className='absolute top-0 text-xs font-mono animate-matrix flex flex-col gap-2'
          style={{ color, opacity: 0.15, left: (i * 7) + '%',
            animationDuration: MATRIX_COLS[i].duration + 's', animationDelay: MATRIX_COLS[i].delay + 's' }}>
          {MATRIX_COLS[i].chars.map((ch: string, j: number) => <span key={j}>{ch}</span>)}
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
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [reacted, setReacted] = useState<string | null>(null);
  const [expandedPin, setExpandedPin] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [visitorEmail, setVisitorEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [sharedToX, setSharedToX] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 300;

  const profile = useQuery(api.profiles.byUsername, { username });
  const analytics = useQuery(api.analytics.getAnalytics, profile?._id ? { profileId: profile._id } : 'skip');
  const createQuestion = useMutation(api.questions.createQuestion);
  const addReaction = useMutation(api.reactions.addReaction);
  const foundingMember = useQuery(api.founding.isFoundingMember, profile?._id ? { userId: profile.userId } : 'skip');
  const earlyAdopter = useQuery(api.earlyAdopters.isEarlyAdopter, profile?._id ? { userId: profile.userId } : 'skip');
  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];
  const allQuestions = useQuery(api.questions.getRecentQuestions, profile?._id ? { profileId: profile._id, limit: 50 } : 'skip');
  const pinnedAnswers = allQuestions?.filter(q => q.isAnswered && pinnedIds.includes(q._id)) || [];
  const reactions = useQuery(api.reactions.getReactions, profile?._id ? { profileId: profile._id } : 'skip');
  const blogs = useQuery(api.blogs.getPublishedBlogs, {});
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

  useEffect(() => {
    if (profile?.displayName && suggestedQuestions.length === 0) {
      const name = profile.displayName.split(' ')[0];
      const defaults = [
        'Who is ' + name + ' and what do they do?',
        'How can I work with ' + name + '?',
        'What is ' + name + ' currently building?',
      ];
      // Try to generate smarter questions from knowledge
      fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Generate exactly 3 short questions a visitor might ask ' + name + ' based on their knowledge base. Return only the 3 questions separated by | character. No numbering, no extra text.',
          knowledgeOverride: profile.bio || '',
          demoMode: true,
        }),
      })
        .then(r => r.json())
        .then(data => {
          const raw = data.answer || '';
          const parts = raw.split('|').map((q: string) => q.trim()).filter((q: string) => q.length > 5 && q.length < 100);
          if (parts.length >= 2) {
            setSuggestedQuestions(parts.slice(0, 3));
          } else {
            setSuggestedQuestions(defaults);
          }
        })
        .catch(() => setSuggestedQuestions(defaults));
    }
  }, [profile?.displayName, profile?.bio, suggestedQuestions.length]);

  const handleSubmit = async () => {
    if (!question.trim() || !profile?._id) return;
    setSubmitted(true);
    setIsTyping(true);
    setAiResponse('');
    setResponseTime(null);
    const t0 = Date.now();
    setStartTime(t0);
    try {
      await createQuestion({ profileId: profile._id, question });
      await incrementQuestion({ profileId: profile._id });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username, visitorEmail: visitorEmail || undefined }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) {
        setAiResponse('Monthly AI answer limit reached. Upgrade your plan to continue.');
        setIsTyping(false);
        return;
      }

      if (!res.ok || !res.body) {
        setAiResponse('Something went wrong. Please try again.');
        setIsTyping(false);
        return;
      }

      // Stream tokens as they arrive
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setAiResponse(stripMarkdown(full));
      }

      setResponseTime(Math.round((Date.now() - t0) / 100) / 10);
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
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(aiResponse);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const shareToX = () => {
    const text = 'Just asked @' + (social.twitter?.replace('@','') || username) + ' a question on their AI space and got this answer:\n\n"' + aiResponse.slice(0, 200) + (aiResponse.length > 200 ? '...' : '') + '"\n\nonequestion.space/' + username;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
    setSharedToX(true);
  };

  const handleReaction = async (emoji: string) => {
    if (!profile?._id || reacted) return;
    setReacted(emoji);
    try { await addReaction({ profileId: profile._id, emoji }); } catch {}
  };

  if (profile === undefined) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
        <p className='text-zinc-600 text-sm'>Loading space...</p>
      </div>
    </div>
  );

  if (profile === null) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-5xl mb-4'>✦</p>
        <h1 className='text-2xl font-bold text-white mb-2'>Space not found</h1>
        <p className='text-zinc-500 mb-6'>This space doesn&apos;t exist yet.</p>
        <Link href='/sign-up' className='px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'>
          Claim it →
        </Link>
      </div>
    </div>
  );

  const color = profile.themeColor || '#f59e0b';
  const bgClass = BG_STYLES[profile.themeBg || 'dark'];
  const themeEffect = (profile as Record<string, unknown>).themeEffect as string || 'none';
  const fontClass = FONT_STYLES[profile.themeFont || 'inter'];
  const cardClass = CARD_STYLES[profile.themeCardStyle || 'glass'];
  let social: Record<string, string> = {};
  if (profile.socialLinks) { try { social = JSON.parse(profile.socialLinks); } catch {} }
  const whatsappUrl = social.whatsapp ? 'https://wa.me/' + social.whatsapp.replace(/[^0-9]/g, '') : null;
  const initials = profile.displayName?.charAt(0)?.toUpperCase() || username.charAt(0).toUpperCase();
  const welcomeMessage = profile.welcomeMessage || 'Ask me anything about ' + (profile.displayName || username) + '.';
  const vibeQuote = profile ? ((profile as Record<string, unknown>).vibeQuote as string || '') : '';
  let spaceLinks: { title: string; url: string }[] = [];
  try { spaceLinks = profile ? JSON.parse((profile as Record<string, unknown>).links as string || '[]') : []; } catch {}
  const isLight = ['fog', 'sand', 'parchment', 'rose', 'mint', 'slate'].includes(profile.themeBg || '');
  const firstName = profile.displayName?.split(' ')[0] || username;

  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-800' : ' text-white')}>
      <SpaceBackground themeEffect={themeEffect} color={color} />
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>

      <div className='max-w-xl mx-auto px-4 py-12 pb-8'>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-10'>

          {/* Avatar */}
          <div className='relative w-32 h-32 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full' style={{ boxShadow: '0 0 0 3px ' + color + '60, 0 0 40px ' + color + '30' }} />
            <div className='relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-white'
              style={{ background: profile.avatar ? undefined : color }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt={profile.displayName || username} className='w-full h-full object-cover' width={128} height={128} />
                : initials}
            </div>
            {/* Live indicator */}
            <div className='absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              <span className='text-[10px] text-green-400 font-medium'>Live</span>
            </div>
          </div>

          {/* Name + badges */}
          <h1 className='text-3xl font-black mb-1 tracking-tight'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-4 flex-wrap'>
            <p className='text-sm font-medium opacity-60' style={{ color }}>@{profile.username}</p>
            {FOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'>👑 Founder</span>
            )}
            {profile.userId !== FOUNDER_ID && foundingMember && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'>👑 Founding Member</span>
            )}
            {!foundingMember && earlyAdopter && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>⚡ Early Adopter</span>
            )}
            {COFOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30'>🤝 Co-Founder</span>
            )}
          </div>

          {profile.bio && <p className='text-zinc-400 text-sm max-w-xs mx-auto mb-3 leading-relaxed'>{profile.bio}</p>}
          <div className='flex items-center justify-center gap-3 mb-5 flex-wrap'>
            <span className='text-xs text-zinc-600'>
              Joined {new Date(profile._creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            {analytics && analytics.totalQuestions > 0 && (
              <span className='text-xs text-zinc-600'>·</span>
            )}
            {analytics && analytics.totalQuestions > 0 && (
              <span className='text-xs text-zinc-600'>{analytics.totalQuestions} questions answered</span>
            )}
          </div>

          {/* Socials */}
          {(social.twitter || social.github || social.website || social.linkedin) && (
            <div className='flex items-center justify-center gap-2 mb-5 flex-wrap'>
              {social.twitter && (
                <a href={'https://twitter.com/' + social.twitter.replace('@', '')} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                  {social.twitter.replace('@', '')}
                </a>
              )}
              {social.github && (
                <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                  {social.github}
                </a>
              )}
              {social.linkedin && (
                <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                  {social.linkedin}
                </a>
              )}
              {social.website && (
                <a href={social.website} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8'>
                  <Globe className='w-3 h-3' /> Website
                </a>
              )}
            </div>
          )}

          {/* Stats */}
          {analytics && (
            <div className='flex items-center justify-center gap-6 mb-5'>
              <div className='text-center'>
                <p className='text-xl font-bold'>{analytics.totalQuestions}</p>
                <p className='text-xs opacity-40 mt-0.5'>questions</p>
              </div>
              <div className='w-px h-6 bg-white/10' />
              <div className='text-center'>
                <p className='text-xl font-bold'>{analytics.totalVisitors}</p>
                <p className='text-xs opacity-40 mt-0.5'>visitors</p>
              </div>
              {analytics.totalQuestions > 0 && (<>
                <div className='w-px h-6 bg-white/10' />
                <div className='text-center'>
                  <p className='text-xl font-bold'>{Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%</p>
                  <p className='text-xs opacity-40 mt-0.5'>answered</p>
                </div>
              </>)}
            </div>
          )}

          {/* Share */}
          <button onClick={copyLink}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-zinc-400 hover:text-white transition-all'>
            {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
            {copied ? 'Copied!' : 'Share this space'}
          </button>

          {/* Vibe quote */}
          {vibeQuote && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className='mt-6 px-5 py-4 rounded-2xl text-center'
              style={{ backgroundColor: color + '0d', border: '1px solid ' + color + '20' }}>
              <p className='text-sm leading-relaxed italic opacity-75'>&ldquo;{vibeQuote}&rdquo;</p>
            </motion.div>
          )}

          {/* Links — with preview */}
          {spaceLinks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} image={link.image} />
              ))}
            </motion.div>
          )}

          {/* Pinned answers — accordion */}
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
          )}
        </motion.div>

        {/* Ask Card — iMessage style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-6'>
          {!submitted && (
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
              </motion.div>
            ) : (
              <motion.div key='response' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                <div className='flex justify-end mb-4'>
                  <div className='max-w-[85%] px-4 py-3 rounded-3xl rounded-br-sm' style={{ backgroundColor: '#3a3a3c' }}>
                    <p className='text-sm leading-relaxed text-white'>{question}</p>
                  </div>
                </div>

                {isTyping && !aiResponse && (
                  <div className='flex items-center gap-3 p-4 rounded-2xl bg-white/4 border border-white/8'>
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
                  </div>
                )}

                {aiResponse && (
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
                      <p className='text-sm text-white leading-relaxed'>
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
                              className={'px-2.5 py-1 rounded-full text-sm border transition-all ' + (reacted === emoji ? 'border-white/30 bg-white/10' : 'border-white/8 bg-white/4 hover:bg-white/10')}>
                              {emoji}
                              {reactions && (reactions as Record<string, number>)[emoji] ? <span className='ml-1 text-xs opacity-50'>{(reactions as Record<string, number>)[emoji]}</span> : null}
                            </button>
                          ))}
                        </div>
                        <button onClick={copyAnswer} className='flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity'>
                          {copiedAnswer ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
                          {copiedAnswer ? 'Copied ✓' : 'Copy answer'}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {!isTyping && aiResponse && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className='mt-4'>
                    <button onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); setCharCount(0); }}
                      className='w-full py-2.5 rounded-2xl border border-white/8 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all'>
                      Ask another question
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className='mt-10 text-center border-t border-white/5 pt-8'>
          <Link href='/' className='inline-flex items-center gap-1.5 text-sm font-bold' style={{ color }}>
            <span className='opacity-60 text-xs font-normal text-zinc-500'>Power

red by</span> One Question ✦
          </Link>
          <p className='text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block' />
            <Link href='/sign-up' className='hover:text-zinc-400 transition-colors'>
              Create your own AI space — free →
            </Link>
          </p>
        </motion.div>

      </div>
    </div>
  );
}
