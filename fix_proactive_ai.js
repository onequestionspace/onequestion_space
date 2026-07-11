const fs = require('fs');

// ── 1. Create AIProactiveTip component ──────────────────────────────────────
fs.writeFileSync('components/AIProactiveTip.tsx', `'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Sparkles, X, ArrowRight, Brain } from 'lucide-react';
import Link from 'next/link';

const PROACTIVE_TIPS = [
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'how much', 'pricing', 'pay', 'charge', 'fee'],
    question: "What do you charge or cost?",
    tip: "People are asking about your pricing but I can't answer that yet.",
    cta: "Tell me your pricing →",
    href: '/dashboard/knowledge',
  },
  {
    id: 'contact',
    keywords: ['contact', 'reach', 'email', 'dm', 'hire', 'work with'],
    question: "How can I contact or hire you?",
    tip: "Visitors want to reach you but I don't know how to direct them.",
    cta: "Add contact info →",
    href: '/dashboard/knowledge',
  },
  {
    id: 'projects',
    keywords: ['project', 'built', 'portfolio', 'work', 'made', 'created'],
    question: "What projects have you built?",
    tip: "People are curious about your work but I have no projects to show.",
    cta: "Add your projects →",
    href: '/dashboard/knowledge',
  },
  {
    id: 'location',
    keywords: ['where', 'from', 'location', 'country', 'city', 'based'],
    question: "Where are you from or based?",
    tip: "Someone asked where you are but I couldn't answer.",
    cta: "Tell me where you're from →",
    href: '/dashboard/knowledge',
  },
  {
    id: 'stack',
    keywords: ['tech', 'stack', 'tools', 'use', 'language', 'framework'],
    question: "What tools or tech do you use?",
    tip: "Visitors are asking about your tech stack but I don't know it yet.",
    cta: "Share your stack →",
    href: '/dashboard/knowledge',
  },
];

export function AIProactiveTip({ profileId }: { profileId: string }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeTip, setActiveTip] = useState<typeof PROACTIVE_TIPS[0] | null>(null);

  const unanswered = useQuery(
    api.questions.getUnansweredQuestions,
    profileId ? { profileId: profileId as any } : 'skip'
  );

  const needsReview = useQuery(
    api.questions.listNeedsReview,
    profileId ? { profileId: profileId as any } : 'skip'
  );

  useEffect(() => {
    const allWeakQuestions = [
      ...(unanswered ?? []),
      ...(needsReview ?? []),
    ];

    if (allWeakQuestions.length === 0) return;

    // Find a tip that matches unanswered questions
    for (const tip of PROACTIVE_TIPS) {
      if (dismissed.includes(tip.id)) continue;
      const matched = allWeakQuestions.some(q =>
        tip.keywords.some(kw => q.question?.toLowerCase().includes(kw))
      );
      if (matched) {
        setActiveTip(tip);
        setTimeout(() => setVisible(true), 2000);
        return;
      }
    }

    // Generic tip if knowledge base is empty
    if (!dismissed.includes('generic')) {
      setActiveTip({
        id: 'generic',
        keywords: [],
        question: '',
        tip: 'I need more info about you to answer questions well. Add some knowledge so I can represent you better.',
        cta: 'Train me now →',
        href: '/dashboard/train',
      });
      setTimeout(() => setVisible(true), 2000);
    }
  }, [unanswered, needsReview, dismissed]);

  const dismiss = () => {
    if (activeTip) setDismissed(prev => [...prev, activeTip.id]);
    setVisible(false);
    setTimeout(() => setActiveTip(null), 300);
  };

  if (!visible || !activeTip) return null;

  return (
    <div
      className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto"
      style={{
        animation: 'slideUp 0.3s ease',
      }}
    >
      <style>{'.slideUp { animation: slideUp 0.3s ease; } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }'}</style>
      <div className="rounded-2xl border border-primary/20 p-4 shadow-2xl" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Your AI needs help</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mb-3">{activeTip.tip}</p>
            <Link
              href={activeTip.href}
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors"
            >
              {activeTip.cta}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <button onClick={dismiss} className="p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0">
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
`);
console.log('✓ AIProactiveTip component created');

// ── 2. Add to dashboard page ─────────────────────────────────────────────────
let dashboard = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

if (!dashboard.includes('AIProactiveTip')) {
  // Add import
  dashboard = dashboard.replace(
    `import { KnowledgeHealthCard, KnowledgeGapsCard, CoverageCard, AutoFAQCard, AICoachCard } from '@/components/KnowledgeIntelligence';`,
    `import { KnowledgeHealthCard, KnowledgeGapsCard, CoverageCard, AutoFAQCard, AICoachCard } from '@/components/KnowledgeIntelligence';
import { AIProactiveTip } from '@/components/AIProactiveTip';`
  );

  // Add component before closing return
  dashboard = dashboard.replace(
    `    </DashboardLayout>`,
    `      {profile?._id && <AIProactiveTip profileId={profile._id} />}
    </DashboardLayout>`
  );

  fs.writeFileSync('app/dashboard/page.tsx', dashboard);
  console.log('✓ AIProactiveTip added to dashboard');
}
