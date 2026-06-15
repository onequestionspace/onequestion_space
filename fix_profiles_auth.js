const fs = require('fs');

// Fix 1: ProfilesSection — real avatars, correct usernames, space links
const profiles = `'use client';

import { useRef, useEffect, useState } from 'react';

const profiles = [
  {
    initials: 'SC',
    gradient: 'from-pink-500 to-rose-500',
    type: 'Creator',
    name: 'Sarah',
    username: 'sarahcreates',
    bio: 'I make YouTube videos about design. My AI answers questions about my process, tools and courses.',
    questions: ['What camera do you use?', 'How do I start in design?'],
    xHandle: '@sarahcreates',
  },
  {
    initials: 'AA',
    gradient: 'from-purple-600 to-fuchsia-500',
    type: 'Founder',
    name: 'Asym Alwali',
    username: 'asym_alwali',
    bio: 'Building One Question from a phone in Nigeria. My AI answers questions about bootstrapping and building with constraints.',
    questions: ['How do you build without a laptop?', 'What tools do you use?'],
    xHandle: '@Asym_Alwali',
  },
  {
    initials: 'MC',
    gradient: 'from-amber-500 to-orange-500',
    type: 'Coach',
    name: 'Marcus',
    username: 'marcuscoach',
    bio: 'I help founders go from idea to first paying customer. My AI handles all the initial questions so I can focus on deep work.',
    questions: ['How much does coaching cost?', 'How do I book a call?'],
    xHandle: '@marcuscoach',
  },
];

export function ProfilesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Built for creators,
          <br />
          <span className="text-white">founders and experts.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Anyone who gets asked the same questions over and over needs a One Question space.
        </p>
        <div className="space-y-4">
          {profiles.map((p, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-5 border border-white/10 text-left hover:border-white/20 transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: \`opacity 0.6s cubic-bezier(0.22,1,0.36,1) \${i * 120}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) \${i * 120}ms\`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                {/* Real gradient avatar with initials */}
                <div className={\`w-12 h-12 rounded-full bg-gradient-to-br \${p.gradient} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10 shrink-0\`}>
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm">{p.name} — {p.type}</p>
                  {/* Both links side by side */}
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <a
                      href={\`https://onequestion.space/\${p.username}\`}
                      className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      onequestion.space/{p.username}
                    </a>
                    <span className="text-zinc-600 text-xs">·</span>
                    <span className="text-zinc-500 text-xs">{p.xHandle}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{p.bio}</p>
              <div className="space-y-2">
                {p.questions.map((q, j) => (
                  <div key={j} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 hover:bg-white/8 transition-colors">
                    <span className="text-purple-400 text-xs font-bold">Q</span>
                    <p className="text-white/80 text-xs">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('components/ProfilesSection.tsx', profiles);
console.log('✅ ProfilesSection — real avatars, asym_alwali, space + X links, scroll animation');

// Fix 2: Clerk appearance — add variables to force dark theme properly
let signUp = fs.readFileSync('app/sign-up/[[...sign-up]]/page.tsx', 'utf8');

signUp = signUp.replace(
  'const clerkAppearance = {',
  `const clerkAppearance = {
  variables: {
    colorBackground: '#0f0f0f',
    colorInputBackground: 'rgba(255,255,255,0.06)',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#a1a1aa',
    colorPrimary: '#9333ea',
    colorDanger: '#ef4444',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },`
);

fs.writeFileSync('app/sign-up/[[...sign-up]]/page.tsx', signUp);
console.log('✅ SignUp — Clerk variables added to force dark inputs');

// Fix same for sign-in
let signIn = fs.readFileSync('app/sign-in/[[...sign-in]]/page.tsx', 'utf8');

signIn = signIn.replace(
  'const clerkAppearance = {',
  `const clerkAppearance = {
  variables: {
    colorBackground: '#0f0f0f',
    colorInputBackground: 'rgba(255,255,255,0.06)',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#a1a1aa',
    colorPrimary: '#9333ea',
    colorDanger: '#ef4444',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },`
);

fs.writeFileSync('app/sign-in/[[...sign-in]]/page.tsx', signIn);
console.log('✅ SignIn — Clerk variables added to force dark inputs');

console.log('\nDone. Build and push.');
