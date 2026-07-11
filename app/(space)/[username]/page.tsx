'use client';

import { useState, use, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
// framer-motion removed for mobile stability
import Link from 'next/link';
import { Send, Copy, Check, Globe, ExternalLink, Sparkles, ChevronDown, Heart, Zap, MessageSquare, Clock, CheckCheck } from 'lucide-react';
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
  dark: "bg-zinc-950", darker: "bg-black", midnight: "bg-slate-950",
  aurora: "bg-[#060312]", dusk: "bg-[#0d0518]", galaxy: "bg-[#04020d]",
  ocean: "bg-[#020c12]", dawn: "bg-[#12050a]", sunset: "bg-[#120808]",
  milky: "bg-[#020312]", bloodmoon: "bg-[#0a0204]", neon: "bg-[#05020a]",
  toxin: "bg-[#020a04]", royal: "bg-[#080210]", lava: "bg-[#0a0302]",
  fog: "bg-[#f0eef8]", sand: "bg-[#f5efe6]", parchment: "bg-[#faf6f0]",
  rose: "bg-[#f7e5e4]", mint: "bg-[#e8f5ee]", slate: "bg-[#e8eaf2]",
  chalkwhite: "bg-white", chalkgreen: "bg-emerald-50", chalkblack: "bg-zinc-900",
};

const BG_GRADIENTS: Record<string, string> = {
  dark: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,166,35,0.12), transparent)',
  darker: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(80,20,160,0.12), transparent)',
  midnight: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,60,200,0.15), transparent)',
  aurora: 'radial-gradient(ellipse 100% 60% at 30% 0%, rgba(20,180,80,0.12), transparent), radial-gradient(ellipse 80% 50% at 70% 100%, rgba(100,20,200,0.10), transparent)',
  dusk: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(150,30,200,0.18), transparent)',
  galaxy: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,20,255,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,20,200,0.10), transparent)',
  ocean: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,120,200,0.18), transparent)',
  dawn: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,60,20,0.15), transparent)',
  sunset: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220,80,20,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,20,80,0.10), transparent)',
  milky: 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(80,40,200,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,60,150,0.08), transparent), radial-gradient(ellipse 50% 50% at 20% 60%, rgba(40,120,255,0.10), transparent)',
  bloodmoon: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(220,30,30,0.18), transparent), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200,50,20,0.08), transparent)',
  neon: 'radial-gradient(ellipse 80% 50% at 30% -10%, rgba(0,200,255,0.14), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,0,200,0.10), transparent)',
  toxin: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(100,255,50,0.10), transparent), radial-gradient(ellipse 60% 40% at 70% 70%, rgba(50,200,100,0.08), transparent)',
  royal: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(150,50,255,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,100,255,0.08), transparent)',
  lava: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,80,20,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,50,10,0.10), transparent)',
  fog: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,80,220,0.08), transparent)',
  sand: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(180,120,40,0.08), transparent)',
  parchment: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(160,100,40,0.06), transparent)',
  rose: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220,80,80,0.08), transparent)',
  mint: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(40,180,100,0.08), transparent)',
  slate: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(80,100,200,0.08), transparent)',
  chalkwhite: 'none',
  chalkgreen: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(40,180,100,0.06), transparent)',
  chalkblack: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,40,200,0.12), transparent)',
};

const FONT_STYLES: Record<string, string> = {
  inter: 'font-sans', mono: 'font-mono', serif: 'font-serif',
};

const CARD_STYLES: Record<string, string> = {
  glass: 'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800',
  solid: 'bg-zinc-900 border border-zinc-800',
  minimal: 'bg-transparent',
};

const FLOATING_PARTICLES = Array.from({ length: 100 }).map(() => ({
  size: 1 + Math.random() * 4,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 8 + Math.random() * 20,
  delay: Math.random() * 10,
  opacity: 0.15 + Math.random() * 0.5,
  shadow: Math.random() > 0.66,
  twinkleDur: 1.5 + Math.random() * 3,
  twinkleDelay: Math.random() * 5,
}));

function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 opacity-[0.15]' style={{
        background: 'radial-gradient(circle at 30% 40%, '+color+'30 0%, transparent 50%), radial-gradient(circle at 70% 60%, '+color+'20 0%, transparent 40%)',
      }} />
      {FLOATING_PARTICLES.map((p, i) => (
        <div key={i} className='absolute rounded-full' style={{
          width: p.size+'px', height: p.size+'px',
          left: p.left+'%', top: p.top+'%',
          backgroundColor: i % 5 === 0 ? '#fff' : color,
          opacity: p.opacity,
          boxShadow: p.shadow ? '0 0 '+(p.size*3)+'px '+color : 'none',
          animation: `drift-particle ${p.duration}s ease-in-out ${p.delay}s infinite, twinkle ${p.twinkleDur}s ease-in-out ${p.twinkleDelay}s infinite alternate`,
        }} />
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

const SHAPES = [
  { type: "circle", w: 60, h: 60, left: 10, top: 20, duration: 14, delay: 0 },
  { type: "square", w: 40, h: 40, left: 75, top: 15, duration: 18, delay: 1 },
  { type: "circle", w: 30, h: 30, left: 85, top: 55, duration: 16, delay: 0.5 },
  { type: "square", w: 55, h: 55, left: 20, top: 60, duration: 20, delay: 3 },
  { type: "circle", w: 45, h: 45, left: 60, top: 30, duration: 11, delay: 1.5 },
  { type: "square", w: 35, h: 35, left: 5, top: 80, duration: 15, delay: 4 },
];

function ShapesBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {SHAPES.map((s, i) => (
        <div key={i} className="absolute animate-float"
          style={{ width: s.w+"px", height: s.h+"px", left: s.left+"%", top: s.top+"%", animationDuration: s.duration+"s", animationDelay: s.delay+"s", opacity: 0.12, border: "1.5px solid "+color, backgroundColor: color+"08", borderRadius: s.type==="circle" ? "50%" : "8px" }} />
      ))}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-15" style={{ backgroundColor: color }} />
    </div>
  );
}

const ORBS = [
  { w: 300, h: 300, left: -10, top: -10, duration: 12, delay: 0, opacity: 0.15 },
  { w: 200, h: 200, left: 60, top: 50, duration: 16, delay: 2, opacity: 0.10 },
  { w: 250, h: 250, left: 30, top: 70, duration: 14, delay: 1, opacity: 0.12 },
  { w: 180, h: 180, left: 80, top: 10, duration: 18, delay: 3, opacity: 0.08 },
];

function OrbsBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {ORBS.map((o, i) => (
        <div key={i} className="absolute rounded-full animate-aurora-1"
          style={{ width: o.w+"px", height: o.h+"px", left: o.left+"%", top: o.top+"%", backgroundColor: color, opacity: o.opacity, filter: "blur(60px)", animationDuration: o.duration+"s", animationDelay: o.delay+"s" }} />
      ))}
    </div>
  );
}

function HexBackground({ color }: { color: string }) {
  return (
    <svg className="fixed inset-0 -z-10 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,4 52,16 52,40 28,52 4,40 4,16" fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" />
        </pattern>
        <radialGradient id="hexfade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
      <rect width="100%" height="100%" fill="url(#hexfade)" />
    </svg>
  );
}

function StarsBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: color }} />
      {[10,25,40,55,70,85,15,65,80,30].map((left, i) => (
        <div key={i} className="absolute animate-float"
          style={{ left: left+"%", top: (10+i*8)+"%", animationDuration: (3+i*0.4)+"s", animationDelay: (i*0.5)+"s" }}>
          <div className="w-0.5 h-10 rounded-full opacity-30"
            style={{ background: "linear-gradient(to bottom, transparent, "+color+", transparent)", transform: "rotate(-45deg)" }} />
        </div>
      ))}
    </div>
  );
}

const NEBULA_CLOUDS = [
  { w: 400, h: 300, left: 10, top: 20, duration: 25, delay: 0, opacity: 0.12 },
  { w: 350, h: 250, left: 55, top: 40, duration: 30, delay: 5, opacity: 0.10 },
  { w: 300, h: 400, left: 30, top: 55, duration: 22, delay: 2, opacity: 0.08 },
  { w: 250, h: 200, left: 75, top: 15, duration: 28, delay: 8, opacity: 0.10 },
  { w: 450, h: 280, left: 5, top: 60, duration: 35, delay: 3, opacity: 0.06 },
];

const NEBULA_STARS = Array.from({ length: 40 }).map(() => ({
  size: 1 + Math.random() * 2, left: Math.random() * 100, top: Math.random() * 100,
  opacity: 0.2 + Math.random() * 0.5, dur: 5 + Math.random() * 10, delay: Math.random() * 5,
}));

function NebulaBackground({ color }: { color: string }) {
  const colors = [color, '#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4'];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {NEBULA_CLOUDS.map((c, i) => (
        <div key={i} className="absolute rounded-full animate-aurora-1 mix-blend-screen"
          style={{ width: c.w+"px", height: c.h+"px", left: c.left+"%", top: c.top+"%",
            background: 'radial-gradient(ellipse, '+colors[i % colors.length]+'80, transparent 70%)',
            opacity: c.opacity, filter: 'blur(40px)',
            animationDuration: c.duration+"s", animationDelay: c.delay+"s" }} />
      ))}
      {NEBULA_STARS.map((s, i) => (
        <div key={'s'+i} className="absolute rounded-full animate-float"
          style={{ width: s.size+'px', height: s.size+'px', left: s.left+'%', top: s.top+'%',
            backgroundColor: '#fff', opacity: s.opacity,
            animationDuration: s.dur+'s', animationDelay: s.delay+'s' }} />
      ))}
    </div>
  );
}

const PORTAL_RINGS = 5;

function PortalBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none flex items-center justify-center">
      <div className="absolute w-[500px] h-[500px] rounded-full animate-aurora-1" style={{
        background: 'radial-gradient(circle, '+color+'40 0%, transparent 70%)',
        filter: 'blur(60px)', animationDuration: '8s',
      }} />
      {Array.from({ length: PORTAL_RINGS }).map((_, i) => {
        const size = 200 + i * 60;
        return (
          <div key={i} className="absolute rounded-full animate-float-slow" style={{
            width: size+'px', height: size+'px',
            border: '1.5px solid '+color+`${30 - i * 5}`,
            opacity: 0.3 - i * 0.04,
            animationDuration: (6 + i * 2)+'s',
            animationDelay: (i * 0.5)+'s',
            transform: `rotate(${i * 15}deg)`,
          }} />
        );
      })}
      <div className="absolute w-32 h-1 rounded-full blur-xl" style={{
        background: 'linear-gradient(90deg, transparent, '+color+', transparent)',
        animation: 'pulse-glow 3s ease-in-out infinite',
        boxShadow: '0 0 40px '+color+', 0 0 80px '+color+'40',
      }} />
    </div>
  );
}

function RainBackground({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    const layers = [
      { count: 80, speed: 8, len: 20, width: 1, opacity: 0.4, wind: 0.8 },
      { count: 50, speed: 5, len: 14, width: 0.8, opacity: 0.25, wind: 0.5 },
      { count: 120, speed: 12, len: 28, width: 1.2, opacity: 0.5, wind: 1.2 },
    ];
    const drops = layers.map(l => Array.from({ length: l.count }).map(() => ({
      x: Math.random() * w, y: Math.random() * h, l, ...l
    }))).flat();

    interface Splash { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }
    const splashes: Splash[] = [];
    let windAngle = 0;

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);
      windAngle = Math.sin(frame * 0.0005) * 0.3;

      for (const d of drops) {
        d.y += d.speed;
        d.x += Math.sin(windAngle + d.wind) * 0.5;
        if (d.y > h) {
          if (frame % 3 === 0) {
            for (let s = 0; s < 3; s++) {
              splashes.push({
                x: d.x + (Math.random() - 0.5) * 6, y: h - 2,
                vx: (Math.random() - 0.5) * 2, vy: -(2 + Math.random() * 3),
                life: 0, maxLife: 10 + Math.random() * 15, size: 1 + Math.random() * 2,
              });
            }
          }
          d.y = -20;
          d.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + Math.sin(windAngle + d.wind) * 3, d.y + d.len);
        ctx.strokeStyle = color + Math.round(d.opacity * 80).toString(16).padStart(2, '0');
        ctx.lineWidth = d.width;
        ctx.stroke();
      }

      for (let s = splashes.length - 1; s >= 0; s--) {
        const sp = splashes[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.15;
        sp.life++;
        const alpha = 1 - sp.life / sp.maxLife;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(alpha * 50).toString(16).padStart(2, '0');
        ctx.fill();
        if (sp.life > sp.maxLife) splashes.splice(s, 1);
      }

      ctx.fillStyle = 'rgba(100,130,200,0.015)';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
      requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); };
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}

function FirefliesBackground({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    const fireflies = Array.from({ length: 35 }).map(() => {
      const baseX = Math.random() * w;
      const baseY = h * 0.4 + Math.random() * h * 0.55; // cluster lower half
      return {
        x: baseX, y: baseY, baseX, baseY,
        vx: 0, vy: 0,
        glow: 0,
        glowTarget: 0.1 + Math.random() * 0.9,
        glowSpeed: 0.02 + Math.random() * 0.06,
        flashTimer: 0,
        flashInterval: 60 + Math.random() * 180,
        flashDuration: 10 + Math.random() * 30,
        isFlashing: false,
        size: 1.5 + Math.random() * 2,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: 0.01 + Math.random() * 0.03,
        trail: [] as {x: number, y: number, a: number}[],
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const f of fireflies) {
        f.wanderAngle += f.wanderSpeed + (Math.random() - 0.5) * 0.1;
        const targetX = f.baseX + Math.cos(f.wanderAngle) * 80;
        const targetY = f.baseY + Math.sin(f.wanderAngle * 0.7) * 60;
        f.vx += (targetX - f.x) * 0.002 + (Math.random() - 0.5) * 0.3;
        f.vy += (targetY - f.y) * 0.002 + (Math.random() - 0.5) * 0.3;
        f.vx *= 0.96;
        f.vy *= 0.96;
        f.x += f.vx;
        f.y += f.vy;
        f.x = Math.max(10, Math.min(w - 10, f.x));
        f.y = Math.max(h * 0.2, Math.min(h - 10, f.y));

        f.flashTimer++;
        if (!f.isFlashing && f.flashTimer > f.flashInterval) {
          f.isFlashing = true;
          f.flashTimer = 0;
        }
        if (f.isFlashing && f.flashTimer > f.flashDuration) {
          f.isFlashing = false;
        }
        f.glowTarget = f.isFlashing ? 0.8 + Math.random() * 0.2 : 0.1 + Math.random() * 0.2;
        f.glow += (f.glowTarget - f.glow) * f.glowSpeed;

        if (f.glow > 0.15) {
          f.trail.push({ x: f.x, y: f.y, a: f.glow * 0.3 });
          if (f.trail.length > 8) f.trail.shift();
        }
      }

      for (const f of fireflies) {
        for (const t of f.trail) {
          t.a *= 0.85;
          if (t.a > 0.01) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, f.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = color + Math.round(t.a * 40).toString(16).padStart(2, '0');
            ctx.fill();
          }
        }
      }

      for (const f of fireflies) {
        if (f.glow > 0.1) {
          const glowRadius = f.size * 2 + f.glow * 12;
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRadius);
          grad.addColorStop(0, color + Math.round(f.glow * 120).toString(16).padStart(2, '0'));
          grad.addColorStop(0.3, color + Math.round(f.glow * 60).toString(16).padStart(2, '0'));
          grad.addColorStop(1, color + '00');
          ctx.beginPath();
          ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fffbe6';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); };
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}

const AURORA_BANDS = 4;

function NorthernBackground({ color }: { color: string }) {
  const auroraColors = ['rgba(20,255,100,0.15)', 'rgba(100,200,255,0.12)', 'rgba(200,100,255,0.10)', 'rgba(255,100,200,0.08)'];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: AURORA_BANDS }).map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: (80 - i * 10)+'%', height: (30 - i * 5)+'%',
          left: (10 + i * 5)+'%', top: (5 + i * 8)+'%',
          background: 'linear-gradient(90deg, transparent, '+auroraColors[i]+', transparent)',
          filter: 'blur(30px)',
          animation: 'aurora-sweep '+(8 + i * 4)+'s ease-in-out '+(i * 2)+'s infinite alternate',
        }} />
      ))}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(20,255,100,0.04), transparent 70%)' }} />
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={'s'+i} className="absolute rounded-full" style={{
          width: '1px', height: '1px',
          left: Math.random()*100+'%', top: Math.random()*60+'%',
          backgroundColor: '#fff', opacity: 0.2+Math.random()*0.4,
          animation: 'twinkle '+(2+Math.random()*3)+'s ease-in-out '+(Math.random()*2)+'s infinite alternate',
        }} />
      ))}
    </div>
  );
}

function FireBackground({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    interface Ember { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number; color: string }
    const embers: Ember[] = [];

    const spawnEmber = () => {
      const maxLife = 60 + Math.random() * 80;
      const t = Math.random();
      const colors = [
        `hsl(${45 + Math.random() * 15}, 100%, ${70 + Math.random() * 30}%)`,
        `hsl(${30 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`,
        `hsl(${10 + Math.random() * 15}, 100%, ${40 + Math.random() * 20}%)`,
      ];
      embers.push({
        x: w * (0.2 + Math.random() * 0.6),
        y: h * (0.7 + Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(1.5 + Math.random() * 4),
        size: 2 + Math.random() * 6,
        life: 0, maxLife,
        color: colors[Math.floor(t * 3)],
      });
    };

    let spawnTimer = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      spawnTimer++;
      if (spawnTimer % 2 === 0) {
        spawnEmber();
        if (Math.random() < 0.3) spawnEmber();
      }

      for (let e = embers.length - 1; e >= 0; e--) {
        const em = embers[e];
        em.x += em.vx + (Math.random() - 0.5) * 0.4;
        em.y += em.vy;
        em.vy += 0.02;
        em.vx += (Math.random() - 0.5) * 0.1;
        em.vx *= 0.99;
        em.life++;
        const progress = em.life / em.maxLife;
        const alpha = 1 - progress;

        const grad = ctx.createRadialGradient(em.x, em.y, 0, em.x, em.y, em.size * (1 + progress * 2));
        grad.addColorStop(0, em.color + Math.round(alpha * 200).toString(16).padStart(2, '0'));
        grad.addColorStop(0.5, em.color + Math.round(alpha * 80).toString(16).padStart(2, '0'));
        grad.addColorStop(1, em.color + '00');
        ctx.beginPath();
        ctx.arc(em.x, em.y, em.size * (1 + progress * 2), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (em.size > 3 && em.life % 3 === 0 && progress < 0.3) {
          ctx.beginPath();
          ctx.arc(em.x - 2, em.y - 2, em.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#fff' + Math.round(alpha * 80).toString(16).padStart(2, '0');
          ctx.fill();
        }

        if (em.life > em.maxLife) embers.splice(e, 1);
      }

      const bottomGrad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      bottomGrad.addColorStop(0, 'transparent');
      bottomGrad.addColorStop(0.3, color + '15');
      bottomGrad.addColorStop(0.7, color + '30');
      bottomGrad.addColorStop(1, color + '40');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, h * 0.85, w, h * 0.15);

      const heatGrad = ctx.createRadialGradient(w * 0.5, h * 0.9, 0, w * 0.5, h * 0.9, w * 0.4);
      heatGrad.addColorStop(0, color + '10');
      heatGrad.addColorStop(0.5, color + '08');
      heatGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(0, 0, w, h);

      requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); };
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}

function OilyBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-30" style={{
        background: `
          repeating-conic-gradient(from 0deg, ${color}80 0deg 10deg, transparent 10deg 20deg,
          #8b5cf680 20deg 30deg, transparent 30deg 40deg,
          #06b6d480 40deg 50deg, transparent 50deg 60deg,
          #ec489980 60deg 70deg, transparent 70deg 80deg)
        `,
        filter: 'blur(40px)',
        animation: 'nebula-drift 20s linear infinite',
      }} />
      <div className="absolute inset-0 opacity-20" style={{
        background: `
          repeating-conic-gradient(from 45deg, transparent 0deg 15deg, ${color}60 15deg 25deg,
          #F5A62360 25deg 35deg, transparent 35deg 50deg)
        `,
        filter: 'blur(50px)',
        animation: 'nebula-drift 25s linear infinite reverse',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(100,200,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255,100,200,0.04) 0%, transparent 50%)',
      }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute rounded-full animate-aurora-1" style={{
          width: (100 + i * 40)+'px', height: (60 + i * 20)+'px',
          left: (10 + i * 10)+'%', top: (30 + Math.sin(i) * 20)+'%',
          border: '1px solid '+color+`${20 - i * 2}`,
          borderRadius: '50%',
          opacity: 0.08,
          filter: 'blur(3px)',
          animationDuration: (12 + i * 3)+'s',
          animationDelay: (i * 1.5)+'s',
        }} />
      ))}
    </div>
  );
}

const GLASS_SPARKLES = Array.from({ length: 20 }).map(() => ({
  size: 1 + Math.random() * 2, left: Math.random() * 100, top: Math.random() * 100,
  opacity: 0.1 + Math.random() * 0.3, dur: 2 + Math.random() * 4, delay: Math.random() * 3,
}));

function GlassyBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${color}08 0%, transparent 30%, ${color}04 50%, transparent 70%, ${color}06 100%)`,
      }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)',
      }} />
      <div className="absolute w-[200px] h-[400px] top-[-20%] left-[-10%] rotate-[30deg] animate-float-slow" style={{
        background: 'linear-gradient(180deg, transparent, '+color+'20, transparent)',
        filter: 'blur(60px)', animationDuration: '15s',
      }} />
      <div className="absolute w-[150px] h-[300px] top-[30%] right-[-5%] rotate-[-20deg] animate-float-slow" style={{
        background: 'linear-gradient(180deg, transparent, '+color+'15, transparent)',
        filter: 'blur(50px)', animationDuration: '18s', animationDelay: '3s',
      }} />
      {GLASS_SPARKLES.map((s, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s.size+'px', height: s.size+'px',
          left: s.left+'%', top: s.top+'%',
          backgroundColor: '#fff', opacity: s.opacity,
          animation: 'twinkle '+s.dur+'s ease-in-out '+s.delay+'s infinite alternate',
        }} />
      ))}
    </div>
  );
}

function SpaceBackground({ themeEffect, color }: { themeEffect: string; color: string }) {
  if (themeEffect.startsWith("custom:")) {
    const url = themeEffect.replace("custom:", "");
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url("+url+")" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.65))" }} />
      </div>
    );
  }
  switch (themeEffect) {
    case "particles": return <ParticlesBackground color={color} />;
    case "bubbles": return <BubblesBackground color={color} />;
    case "net": return <NetBackground color={color} />;
    case "matrix": return <MatrixBackground color={color} />;
    case "shapes": return <ShapesBackground color={color} />;
    case "orbs": return <OrbsBackground color={color} />;
    case "stars": return <StarsBackground color={color} />;
    case "hex": return <HexBackground color={color} />;
    case "nebula": return <NebulaBackground color={color} />;
    case "portal": return <PortalBackground color={color} />;
    case "rain": return <RainBackground color={color} />;
    case "fireflies": return <FirefliesBackground color={color} />;
    case "northern": return <NorthernBackground color={color} />;
    case "fire": return <FireBackground color={color} />;
    case "oily": return <OilyBackground color={color} />;
    case "glassy": return <GlassyBackground color={color} />;
    default: return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25" style={{ backgroundColor: color }} />
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10" style={{ backgroundColor: color }} />
        <div className="absolute top-1/2 left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-8" style={{ backgroundColor: color }} />
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
  const [history, setHistory] = useState<{q: string; a: string; ts: number}[]>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('convo_' + username) : null;
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [reacted, setReacted] = useState<string | null>(null);
  const [expandedPin, setExpandedPin] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [visitorEmail, setVisitorEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sharedToX, setSharedToX] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 300;

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 400);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const profile = useQuery(api.profiles.byUsername, { username });
  const analytics = useQuery(api.analytics.getAnalytics, profile?._id ? { profileId: profile._id } : 'skip');
  const addReaction = useMutation(api.reactions.addReaction);
  const foundingMember = useQuery(api.founding.isFoundingMember, profile?._id ? { userId: profile.userId } : 'skip');
  const earlyAdopter = useQuery(api.earlyAdopters.isEarlyAdopter, profile?._id ? { userId: profile.userId } : 'skip');
  const pinnedIds: string[] = profile ? ((profile as Record<string, unknown>).pinnedQuestions as string[] || []) : [];
  const allQuestions = useQuery(api.questions.getRecentQuestions, profile?._id ? { profileId: profile._id, limit: 50 } : 'skip');
  const pinnedAnswers = allQuestions?.filter(q => q.isAnswered && pinnedIds.includes(q._id)) || [];
  const reactions = useQuery(api.reactions.getReactions, profile?._id ? { profileId: profile._id } : 'skip');
  const blogs = useQuery(api.blogs.getPublishedBlogs, {});
  const incrementVisitor = useMutation(api.analytics.incrementVisitorCount);
  const trackPageview = useMutation(api.siteAnalytics.trackPageview);

  useEffect(() => {
    if (profile?._id) {
      const key = 'visited_' + profile._id;
      const last = localStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last) > 86400000) {
        incrementVisitor({ profileId: profile._id }).catch(() => {});
        localStorage.setItem(key, now.toString());
      }
      // Track sitewide pageview
      trackPageview({
        page: '/' + username,
        visitorId: visitorId || 'anon',
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?._id, incrementVisitor, trackPageview, username]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  const creatorQuestions = useMemo(() => {
    return ((profile ? (profile as Record<string, unknown>).suggestedQuestions as string[] : []) || []).filter((q: string) => q.trim());
  }, [profile]);

  useEffect(() => {
    if (!profile?.displayName || creatorQuestions.length >= 2 || suggestedQuestions.length > 0) return;
    const name = profile.displayName.split(' ')[0];
    const defaults = [
      "What are you currently building?",
      "How can I work with you?",
      "What's the one thing people misunderstand about your work?",
    ];
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
        setSuggestedQuestions(parts.length >= 2 ? parts.slice(0, 3) : defaults);
      })
      .catch(() => setSuggestedQuestions(defaults));
  }, [profile?.displayName, profile?.bio, creatorQuestions.length, suggestedQuestions.length]);

  const handleSubmit = async () => {
    if (!question.trim() || !profile?._id) return;
    if (!question.trim() || isTyping) return;
    const currentQuestion = question;
    setLastQuestion(currentQuestion);
    setQuestion('');
    setCharCount(0);
    setSubmitted(true);
    setIsTyping(true);
    setAiResponse('');
    setResponseTime(null);
    const t0 = Date.now();
    setStartTime(t0);
    try {
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

      const finalAnswer = stripMarkdown(full);
      setResponseTime(Math.round((Date.now() - t0) / 100) / 10);
      saveToHistory(currentQuestion, finalAnswer);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        setAiResponse('Taking longer than usual. Please try again.');
      } else {
        setAiResponse('Something went wrong. Please try again.');
      }
    }
    setIsTyping(false);
  };

  const saveToHistory = (q: string, a: string) => {
    const newHistory = [...history, { q, a, ts: Date.now() }].slice(-50);
    setHistory(newHistory);
    try { localStorage.setItem('convo_' + username, JSON.stringify(newHistory)); } catch {}
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
    const vid = localStorage.getItem('visitorId') || 'anon_' + crypto.randomUUID().slice(0, 8);
    if (!localStorage.getItem('visitorId')) localStorage.setItem('visitorId', vid);
    try { await addReaction({ profileId: profile._id, emoji, visitorId: vid }); } catch {}
  };

  if (profile === undefined) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin' />
        <p className='text-zinc-600 text-sm'>Loading space...</p>
      </div>
    </div>
  );

  if (profile === null) return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-5xl mb-4 animate-float-slow inline-block'>✦</div>
        <h1 className='text-2xl font-bold text-white mb-2'>Space not found</h1>
        <p className='text-zinc-500 mb-6'>This space doesn&apos;t exist yet.</p>
        <Link href='/sign-up' className='px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-amber-500/20'>
          Claim it →
        </Link>
      </div>
    </div>
  );

  const color = profile.themeColor || '#F5A623';
  const bgClass = BG_STYLES[profile.themeBg || 'dark'];
  const bgGradient = BG_GRADIENTS[profile.themeBg || 'dark'] || 'none';
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
  const isLight = ['fog', 'sand', 'parchment', 'rose', 'mint', 'slate', 'chalkwhite', 'chalkgreen'].includes(profile.themeBg || '');
  const textMain = isLight ? 'text-zinc-900' : 'text-white';
  const textSub = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const textMuted = isLight ? 'text-zinc-500' : 'text-zinc-500';
  const borderStyle = isLight ? 'border-zinc-200' : 'border-white/10';
  const cardBg = isLight ? 'bg-white/80 backdrop-blur-xl border border-zinc-200 shadow-sm' : 'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800';
  const firstName = profile.displayName?.split(' ')[0] || username;

  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-800' : ' text-white')} style={{ position: 'relative' }}>
      {bgGradient !== 'none' && <div style={{ position: 'fixed', inset: 0, background: bgGradient, zIndex: 0, pointerEvents: 'none' }} />}
      <SpaceBackground themeEffect={themeEffect} color={color} />

      <div className='max-w-xl mx-auto px-4 py-10 pb-8'>

        {/* Profile Header */}
        <div className='text-center mb-10'>
          <div className='relative w-32 h-32 mx-auto mb-5'>
            <div className='absolute inset-0 rounded-full animate-pulse-glow' style={{ boxShadow: '0 0 0 3px ' + color + '60, 0 0 40px ' + color + '30' }} />
            <div className='relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-white ring-2 ring-white/10'
              style={{ background: profile.avatar ? undefined : color }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt={profile.displayName || username} className='w-full h-full object-cover' width={128} height={128} />
                : initials}
            </div>
            <div className='absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              <span className='text-[10px] text-green-400 font-medium'>Live</span>
            </div>
          </div>

          <h1 className='text-3xl font-black mb-1 tracking-tight'>{profile.displayName}</h1>
          <div className='flex items-center justify-center gap-2 mb-4 flex-wrap'>
            <p className='text-sm font-medium opacity-60' style={{ color }}>@{profile.username}</p>
            {FOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 backdrop-blur-sm'>👑 Founder</span>
            )}
            {foundingMember === true && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'>👑 Founding Member</span>
            )}
            {foundingMember === false && earlyAdopter === true && profile.userId !== FOUNDER_ID && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20'>⚡ Early Adopter</span>
            )}
            {COFOUNDER_IDS.includes(profile.userId) && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30'>🤝 Co-Founder</span>
            )}
          </div>

          {profile.bio && <p className={'text-sm max-w-xs mx-auto mb-3 leading-relaxed ' + textSub}>{profile.bio}</p>}
          <div className='flex items-center justify-center gap-3 mb-5 flex-wrap'>
            <span className='text-xs text-zinc-600'>
              Joined {new Date(profile._creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            {analytics && analytics.totalQuestions > 0 && (
              <>
                <span className='text-xs text-zinc-600'>·</span>
                <span className='text-xs text-zinc-600'>{analytics.totalQuestions} questions answered</span>
              </>
            )}
          </div>

          {/* Socials */}
          {(social.twitter || social.github || social.website || social.linkedin) && (
            <div className='flex items-center justify-center gap-2 mb-5 flex-wrap'>
              {social.twitter && (
                <a href={'https://twitter.com/' + social.twitter.replace('@', '')} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8 backdrop-blur-sm'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                  {social.twitter.replace('@', '')}
                </a>
              )}
              {social.github && (
                <a href={'https://github.com/' + social.github} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8 backdrop-blur-sm'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                  {social.github}
                </a>
              )}
              {social.linkedin && (
                <a href={'https://linkedin.com/in/' + social.linkedin} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8 backdrop-blur-sm'>
                  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                  {social.linkedin}
                </a>
              )}
              {social.website && (
                <a href={social.website} target='_blank' rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white text-xs font-medium border border-white/8 backdrop-blur-sm'>
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

          <button onClick={copyLink}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-zinc-400 hover:text-white transition-all backdrop-blur-sm'>
            {copied ? <Check className='w-3 h-3 text-green-400' /> : <Copy className='w-3 h-3' />}
            {copied ? 'Copied!' : 'Share this space'}
          </button>

          {/* Vibe quote */}
          {vibeQuote && (
            <div
              className='mt-6 px-5 py-4 rounded-2xl text-center backdrop-blur-sm'
              style={{ backgroundColor: color + '0d', border: '1px solid ' + color + '20' }}>
              <p className='text-sm leading-relaxed italic opacity-75'>&ldquo;{vibeQuote}&rdquo;</p>
            </div>
          )}

          {/* Links */}
          {spaceLinks.length > 0 && (
            <div className='mt-4 space-y-2'>
              {spaceLinks.map((link, i) => (
                <LinkPreviewCard key={i} title={link.title} url={link.url} color={color} />
              ))}
            </div>
          )}

          {/* Pinned answers */}
          {pinnedAnswers.length > 0 && (
            <div className='mt-8'>
              <p className='text-xs font-medium uppercase tracking-widest opacity-30 mb-3'>Pinned</p>
              <div className='space-y-2'>
                {pinnedAnswers.map((q, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden border border-white/8 text-left cursor-pointer backdrop-blur-sm'
                    onClick={() => setExpandedPin(expandedPin === i ? null : i)}>
                    <div className='px-4 py-3 bg-white/4 flex items-center justify-between gap-3'>
                      <p className='text-sm font-medium'>{q.question.charAt(0).toUpperCase() + q.question.slice(1)}</p>
                      <span className='text-xs opacity-30 shrink-0 transition-transform duration-200'
                        style={{ transform: expandedPin === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                      {expandedPin === i && (
                        <div className='overflow-hidden'>
                          <div className='px-4 py-3 border-t border-white/5' style={{ backgroundColor: color + '08' }}>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold shrink-0 text-white' style={{ backgroundColor: color }}>
                                {profile.avatar ? <Image src={profile.avatar} alt='' width={16} height={16} className='w-full h-full object-cover' /> : initials}
                              </div>
                              <span className='text-xs opacity-40'>{firstName}</span>
                            </div>
                            <p className='text-sm opacity-80 leading-relaxed'>{q.answer ? stripMarkdown(q.answer) : ''}</p>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conversation thread */}
        <div className="space-y-4 mb-4">
          {/* Welcome bubble */}
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-1 flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: color }}>
              {profile.avatar ? <Image src={profile.avatar} alt="" width={28} height={28} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className={"px-4 py-3 rounded-3xl rounded-tl-sm text-sm leading-relaxed max-w-[85%] shadow-sm " + (isLight ? "bg-zinc-100 text-zinc-800" : "bg-white/8 text-white/90")}>
              {welcomeMessage}
            </div>
          </div>

          {/* Suggested question chips */}
          {history.length === 0 && !submitted && suggestedQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-9">
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => { setQuestion(q); setCharCount(q.length); }}
                  className={"px-3 py-1.5 rounded-full border text-xs transition-all active:scale-95 backdrop-blur-sm " + (isLight ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-sm" : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10")}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Quick suggestions row */}
          {history.length === 0 && !submitted && suggestedQuestions.length === 0 && creatorQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-9">
              {creatorQuestions.slice(0, 3).map((q, i) => (
                <button key={i} onClick={() => { setQuestion(q); setCharCount(q.length); }}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs transition-all hover:text-white hover:bg-white/10 active:scale-95 backdrop-blur-sm">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* History thread — collapsible */}
          {history.map((item, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={i}>
                {/* Collapsed: question badge */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className={"flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all border " + (isExpanded ? "border-white/20 bg-white/8" : "border-white/5 bg-white/4 hover:bg-white/8")}
                  style={{ borderColor: isExpanded ? color + '60' : undefined }}
                >
                  <span className={"text-xs font-medium truncate flex-1 " + (isLight ? "text-zinc-800" : "text-white/90")}>
                    {item.q}
                  </span>
                  <span className="text-[9px] opacity-30 shrink-0">
                    {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div>
                    <ChevronDown className="w-3 h-3 opacity-30 shrink-0" />
                  </div>
                </div>
                {/* Expanded: answer */}
                  {isExpanded && (
                    <div className="overflow-hidden">
                      <div className="flex items-end gap-2 pt-2 pb-1 pl-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow" style={{ backgroundColor: color }}>
                          {profile.avatar ? <Image src={profile.avatar} alt="" width={24} height={24} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <div className={"px-3.5 py-2 rounded-3xl rounded-tl-sm text-sm leading-relaxed shadow-sm max-w-[85%] " + (isLight ? "bg-zinc-100 text-zinc-900" : "bg-white/8 text-white/90")}>
                          {item.a}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}

          {/* Current question */}
          {submitted && lastQuestion && (
            <div className="flex justify-end">
              <div className="max-w-[80%] group relative">
                <div className="px-4 py-2.5 rounded-3xl rounded-br-sm text-white text-sm leading-relaxed shadow-md" style={{ backgroundColor: color }}>
                  {lastQuestion}
                </div>
                <div className="flex justify-end gap-1 mt-0.5 pr-1">
                  <span className="text-[9px] opacity-30">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && !aiResponse && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-1 flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: color }}>
                {profile.avatar ? <Image src={profile.avatar} alt="" width={28} height={28} className="w-full h-full object-cover" /> : initials}
              </div>
              <div className={"px-4 py-3 rounded-3xl rounded-tl-sm shadow-sm " + (isLight ? "bg-zinc-100" : "bg-white/8")}>
                <div className="flex gap-1">
                  {[0,150,300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce opacity-60" style={{ backgroundColor: color, animationDelay: d + "ms" }} />)}
                </div>
              </div>
            </div>
          )}

          {/* AI response */}
          {aiResponse && (
            <div className="flex items-end gap-2" ref={responseRef}>
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-1 flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: color }}>
                {profile.avatar ? <Image src={profile.avatar} alt="" width={28} height={28} className="w-full h-full object-cover" /> : initials}
              </div>
              <div className="max-w-[80%] group relative">
                <div className={"px-4 py-2.5 rounded-3xl rounded-tl-sm text-sm leading-relaxed shadow-sm " + (isLight ? "bg-zinc-100 text-zinc-900" : "bg-white/8 text-white/90")}>
                  {aiResponse}{isTyping && <span className="inline-block w-0.5 h-3.5 ml-0.5 align-middle animate-pulse rounded-sm" style={{ backgroundColor: color }} />}
                </div>
                <div className="flex justify-start gap-1 mt-0.5 pl-1">
                  {!isTyping && responseTime && <span className="text-[9px] opacity-30">{responseTime}s</span>}
                </div>
              </div>
            </div>
          )}

          {/* Post-answer actions */}
          {!isTyping && aiResponse && (
            <div className="flex items-center gap-3 pl-9">
              {["🔥","👏","💡","❤️"].map(emoji => (
                <button key={emoji} onClick={() => handleReaction(emoji)}
                  className={"text-sm px-2 py-1 rounded-full border transition-all backdrop-blur-sm " + (reacted === emoji ? "border-white/30 bg-white/10" : "border-white/8 bg-white/4 hover:bg-white/10")}>
                  {emoji}
                </button>
              ))}
              <button onClick={copyAnswer} className="text-xs opacity-40 hover:opacity-70 transition-opacity ml-1">copy</button>
              <button onClick={shareToX} className="text-xs opacity-40 hover:opacity-70 transition-opacity">share</button>
            </div>
          )}

          {/* Clear history */}
          {history.length > 0 && !submitted && (
            <button onClick={() => { setHistory([]); try { localStorage.removeItem("convo_" + username); } catch {} }}
              className={"text-xs text-center w-full pt-2 " + textMuted + " hover:opacity-80 transition-opacity"}>
              Clear conversation
            </button>
          )}
        </div>

        {/* Input bar */}
        <div className="mb-6">
          <div className={"flex items-end gap-2 px-3 py-2 rounded-3xl border shadow-lg backdrop-blur-sm " + (isLight ? "border-zinc-200 bg-white/90" : "border-zinc-700/40 bg-zinc-900/50")}>
            <textarea
              value={question}
              onChange={e => { if (e.target.value.length <= MAX_CHARS) { setQuestion(e.target.value); setCharCount(e.target.value.length); } }}
              placeholder={"Ask " + firstName + " anything..."}
              rows={question.length > 60 ? 3 : 1}
              className={"flex-1 px-2 py-1.5 bg-transparent focus:outline-none resize-none text-sm leading-relaxed " + (isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500")}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              disabled={isTyping}
            />
            <button onClick={handleSubmit} disabled={!question.trim() || isTyping}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:opacity-90 active:scale-95 shrink-0 shadow-md"
              style={{ backgroundColor: color }}>
              <Send className="w-3.5 h-3.5 text-white" fill="white" />
            </button>
          </div>
          {question.length > 0 && (
            <div className="flex justify-end mt-1 mr-1">
              <span className={'text-[10px] ' + (charCount > MAX_CHARS * 0.8 ? 'text-amber-500' : 'text-zinc-600')}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={'mt-10 text-center pt-8 border-t ' + (isLight ? 'border-zinc-200' : 'border-white/5')}>
          <Link href='/' className='inline-flex items-center gap-1.5 text-sm font-bold' style={{ color }}>
            <span className="opacity-60 text-xs font-normal text-zinc-500">Powered by</span>
            <Sparkles className='w-3.5 h-3.5' /> One Question ✦
          </Link>
          <p className='text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block' />
            <Link href='/sign-up' className='hover:text-zinc-400 transition-colors'>
              Create your own AI space — free →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
