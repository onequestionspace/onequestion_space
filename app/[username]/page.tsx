'use client';

import { useState, use, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, MessageCircle, Sparkles, Brain,
  CheckCircle2, Share2, Copy, Check, TrendingUp
} from 'lucide-react';

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
  const incrementVisitor = useMutation(api.analytics.incrementVisitorCount);
  const incrementQuestion = useMutation(api.analytics.incrementQuestionCount);

  useEffect(() => {
    if (profile?._id) {
      incrementVisitor({ profileId: profile._id }).catch(() => {});
    }
  }, [profile?._id]);

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
      const fullResponse = data.answer || 'I am thinking through your question. Please check back shortly.';

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
    navigator.clipboard.writeText(`https://onequestion.space/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Space not found</h1>
          <p className="text-muted-foreground">This space does not exist yet.</p>
        </div>
      </div>
    );
  }

  const initials = profile.displayName?.charAt(0)?.toUpperCase() || username.charAt(0).toUpperCase();
  const welcomeMessage = profile.welcomeMessage || `Ask me anything about ${profile.displayName || username}.`;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-30" />
        <div className="dot-pattern" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 overflow-hidden ring-4 ring-primary/20">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : initials}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">{profile.displayName}</h1>
          <p className="text-sm text-primary mb-3">@{profile.username}</p>
          {profile.bio && <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">{profile.bio}</p>}

          {/* Stats */}
          {analytics && (
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{analytics.totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{analytics.totalVisitors}</p>
                <p className="text-xs text-muted-foreground">Visitors</p>
              </div>
              {analytics.totalQuestions > 0 && (
                <>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {Math.round((analytics.totalAnswers / analytics.totalQuestions) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Response Rate</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Share */}
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 border border-border mb-6"
        >
          {/* Welcome message */}
          <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{welcomeMessage}</p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="What would you like to know?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4 text-sm"
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!question.trim()}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Ask Question
                </button>
                <p className="text-center text-xs text-muted-foreground mt-3">Press ⌘+Enter to submit</p>
              </motion.div>
            ) : (
              <motion.div key="response" initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={responseRef}>
                {isTyping && !aiResponse && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {aiResponse && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Response</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResponse}
                      {isTyping && <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse rounded-sm" />}
                    </p>
                  </div>
                )}
                {!isTyping && aiResponse && (
                  <button
                    onClick={() => { setSubmitted(false); setAiResponse(''); setQuestion(''); }}
                    className="w-full mt-4 py-2.5 rounded-2xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all"
                  >
                    Ask another question
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Powered by */}
        <p className="text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a href="https://onequestion.space" className="text-primary hover:underline font-medium">
            One Question
          </a>
        </p>
      </div>
    </div>
  );
}
