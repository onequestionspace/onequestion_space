'use client';

import { TrendingUp, MessageCircle, Users } from 'lucide-react';

export function AnalyticsSection() {
  const questions = [
    { question: 'What do you charge for consulting?', count: 47, trending: true },
    { question: 'How can I book a call with you?', count: 38, trending: true },
    { question: 'What tools do you use to build?', count: 29, trending: false },
    { question: 'Do you offer a free trial?', count: 21, trending: false },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-3xl" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Know exactly what
          <br />
          <span className="gradient-text">people want to know.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Every question your visitors ask is tracked. See what your audience actually cares about and use that to create better content, products and offers.
        </p>
        <div className="glass rounded-3xl p-6 border border-white/10 text-left">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white font-bold">Most Asked Questions</p>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <p className="text-white text-sm">{q.question}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {q.trending && <TrendingUp className="w-3 h-3 text-green-400" />}
                  <span className="text-xs text-muted-foreground">{q.count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="text-white font-bold text-lg">135</p>
              <p className="text-muted-foreground text-xs">Questions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-pink" />
              </div>
              <p className="text-white font-bold text-lg">89</p>
              <p className="text-muted-foreground text-xs">Visitors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-accent-yellow" />
              </div>
              <p className="text-white font-bold text-lg">98%</p>
              <p className="text-muted-foreground text-xs">Answered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}