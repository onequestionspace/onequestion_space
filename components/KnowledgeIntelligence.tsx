'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Brain, AlertTriangle, CheckCircle2, FileText, Sparkles,
  Lightbulb, Target, ChevronRight, RefreshCw, Quote,
  Layers, BarChart3, Clock
} from 'lucide-react';

type FAQItem = { question: string; answer: string };

export function KnowledgeHealthCard({ userId }: { userId: string }) {
  const health = useQuery(api.knowledgeHealth.getKnowledgeHealth, { userId });

  if (health === undefined) return <div className="paper-card p-4"><div className="animate-pulse h-20 bg-white/[0.03] rounded-xl" /></div>;
  if (!health || health.items === 0) return null;

  const scoreColor = health.score >= 80 ? '#22c55e' : health.score >= 50 ? '#F5A623' : '#ef4444';
  const scoreLabel = health.score >= 80 ? 'Great' : health.score >= 50 ? 'Needs work' : 'Poor';

  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-white">Knowledge Health</span>
        </div>
        <span className="text-[10px] text-zinc-500">{health.items} items</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${health.score} ${100 - health.score}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white" style={{ color: scoreColor }}>{health.score}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Freshness</span>
            <span className="text-white font-medium">{health.freshness}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${health.freshness}%` }} /></div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Completeness</span>
            <span className="text-white font-medium">{health.completeness}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${health.completeness}%` }} /></div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Coverage</span>
            <span className="text-white font-medium">{health.coverage}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${health.coverage}%` }} /></div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: scoreColor + '12', border: `1px solid ${scoreColor}25` }}>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: scoreColor }} />
        <span className="text-xs" style={{ color: scoreColor }}>{scoreLabel} — {health.score >= 80 ? 'Your knowledge is healthy and comprehensive.' : health.score >= 50 ? 'Add more content and fill gaps to improve.' : 'Your knowledge needs significant improvement.'}</span>
      </div>
    </div>
  );
}

export function KnowledgeGapsCard({ userId }: { userId: string }) {
  const gaps = useQuery(api.knowledgeHealth.getKnowledgeGaps, { userId });

  if (gaps === undefined) return <div className="paper-card p-4"><div className="animate-pulse h-20 bg-white/[0.03] rounded-xl" /></div>;
  if (!gaps || gaps.gaps.length === 0) return null;

  const severityColor = (s: string) => s === 'high' ? '#ef4444' : s === 'medium' ? '#F5A623' : '#3b82f6';

  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">Knowledge Gaps ({gaps.total})</span>
        </div>
      </div>
      <div className="space-y-2">
        {gaps.gaps.map((gap, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: severityColor(gap.severity) }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-white">{gap.category}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor: severityColor(gap.severity) + '20', color: severityColor(gap.severity) }}>{gap.severity}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{gap.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoverageCard({ userId }: { userId: string }) {
  const coverage = useQuery(api.knowledgeHealth.getCoverageScore, { userId });

  if (coverage === undefined) return <div className="paper-card p-4"><div className="animate-pulse h-20 bg-white/[0.03] rounded-xl" /></div>;
  if (!coverage) return null;

  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-white">Coverage Score</span>
        </div>
        <span className="text-lg font-bold text-white">{coverage.score}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/[0.06] mb-3">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${coverage.score}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {coverage.covered.map((cat) => (
          <div key={cat.id} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] ${cat.covered ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-500'}`}>
            {cat.covered ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <Target className="w-3 h-3 shrink-0" />}
            {cat.label}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-600 mt-2">{coverage.totalCovered} of {coverage.totalCategories} categories covered</p>
    </div>
  );
}

export function AutoFAQCard({ userId }: { userId: string }) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ save: false }) });
      const d = await res.json();
      if (d.success) { setFaqs(d.data.faqs); setGenerated(true); }
    } catch {}
    setLoading(false);
  };

  const saveToKnowledge = async () => {
    setSaving(true);
    try {
      await fetch('/api/knowledge/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ save: true }) });
      setSaved(true);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-white">Auto FAQ Generator</span>
        </div>
        {!generated && (
          <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50">
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Generate
          </button>
        )}
      </div>
      {!generated ? (
        <p className="text-xs text-zinc-500">AI will analyze your knowledge and generate suggested FAQ pairs. Review and publish with one click.</p>
      ) : faqs.length === 0 ? (
        <p className="text-xs text-zinc-500">No FAQs could be generated from your current knowledge. Add more content first.</p>
      ) : (
        <div className="space-y-2">
          {faqs.slice(0, 5).map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] text-xs text-white font-medium">
                {faq.question}
                <ChevronRight className="w-3 h-3 text-zinc-500 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-3 py-2 text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
          {faqs.length > 5 && <p className="text-[10px] text-zinc-600 text-center">+{faqs.length - 5} more</p>}
          {!saved && (
            <button onClick={saveToKnowledge} disabled={saving} className="w-full mt-2 py-2 rounded-lg border border-primary/30 text-primary text-xs font-medium hover:bg-primary/10 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save all as Knowledge'}
            </button>
          )}
          {saved && <p className="text-xs text-green-400 text-center">Saved to knowledge base!</p>}
        </div>
      )}
    </div>
  );
}

export function AICoachCard({ userId, knowledgeCount }: { userId: string; knowledgeCount: number }) {
  const insights: string[] = [];
  if (knowledgeCount === 0) insights.push('Upload your first knowledge item to activate your AI.');
  if (knowledgeCount > 0 && knowledgeCount < 5) insights.push(`Add ${5 - knowledgeCount} more items for optimal AI performance.`);
  const day = new Date().getDay();
  if (day < 2) insights.push('Start of the week — review your unanswered questions in the inbox.');
  if (day === 4) insights.push('Tip: Update any outdated knowledge items to keep your AI fresh.');

  return (
    <div className="paper-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-semibold text-white">AI Coach</span>
      </div>
      {insights.length === 0 ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-xs text-green-300">Your AI is in good shape! Keep adding knowledge regularly.</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {insights.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-300">{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
