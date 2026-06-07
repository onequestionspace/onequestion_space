'use client';
import FadeIn from '@/components/motion/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Sparkles, 
  Heart, 
  Share2, 
  TrendingUp,
  CheckCircle2,
  Brain
} from 'lucide-react';

/**
 * Enhanced Public Q&A Page
 * Visitor-facing page with AI streaming simulation and full profile showcase
 */
export default function PublicQAPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;
  
  const [question, setQuestion] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { execute, loading, error } = useApi();
  const responseRef = useRef<HTMLDivElement>(null);

  // Mock answers for the feed
  const [recentAnswers, setRecentAnswers] = useState([
    { id: '1', q: 'How do you stay productive?', a: 'I use a combination of time-blocking and AI automation to handle repetitive tasks.', date: '2h ago', likes: 45 },
    { id: '2', q: 'What tools do you use for building?', a: 'Next.js, Convex, and Tailwind are my current go-to stack for rapid MVP development.', date: '5h ago', likes: 32 },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionError = validateQuestion(question);
    if (questionError) {
      alert(questionError.message);
      return;
    }

    try {
      setSubmitted(true);
      setIsTyping(true);
      setAiResponse('');

      // API Call
      await execute('/api/ask', {
        method: 'POST',
        body: JSON.stringify({
          question,
          username: username,
          visitorName: visitorName || 'Anonymous',
          visitorEmail: visitorEmail || undefined,
        }),
      });

      // Simulate streaming response for premium feel
      const fullResponse = "That's a great question! Based on the knowledge provided, I can tell you that we prioritize speed and quality. Our approach involves building modular components that can be reused across different projects while maintaining a high standard of design.";
      
      let currentText = "";
      const words = fullResponse.split(" ");
      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + " ";
        setAiResponse(currentText);
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      }

      setIsTyping(false);
      
      // Add to recent answers
      setRecentAnswers(prev => [{
        id: Date.now().toString(),
        q: question,
        a: fullResponse,
        date: 'Just now',
        likes: 0
      }, ...prev]);

      setQuestion('');
      setVisitorName('');
      setVisitorEmail('');
    } catch (err) {
      console.error('Error submitting question:', err);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  // Mock profile data - will be replaced with API data
  const mockProfile = {
    username,
    displayName: `@${username}`,
    bio: 'Expert in their field, ready to answer your questions',
    avatar: `/founders/${username}.png`,
    totalQuestions: 234,
    totalAnswers: 198,
    responseRate: 85,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20">
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-glow mb-12">
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-5xl ring-4 ring-primary/20 flex-shrink-0">
                {mockProfile.avatar}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {mockProfile.displayName}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">{mockProfile.bio}</p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span className="text-white font-semibold">{mockProfile.totalQuestions}</span>
                    <span className="text-muted-foreground text-sm">Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-yellow" />
                    <span className="text-white font-semibold">{mockProfile.responseRate}%</span>
                    <span className="text-muted-foreground text-sm">Response Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-primary font-medium transition-all">
                <Heart className="w-4 h-4" />
                Follow
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Ask Question Section */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8 border border-primary/20 shadow-glow">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Ask a Question
                </h2>

                {submitted && !isTyping && !aiResponse ? (
                  <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white font-semibold mb-1">Question submitted!</p>
                    <p className="text-muted-foreground text-sm">AI is preparing your answer...</p>
                  </div>
                ) : isTyping || aiResponse ? (
                  <div className="space-y-4" ref={responseRef}>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Response
                      </p>
                      <p className="text-white leading-relaxed">
                        {aiResponse}
                        {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
                      </p>
                    </div>
                    {!isTyping && (
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setAiResponse('');
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Ask another question
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-white mb-2">
                        Your Question
                      </label>
                      <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to know?"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Optional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                          Your Name <span className="text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder="Anonymous"
                          className="w-full px-4 py-2 rounded-xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                          Your Email <span className="text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 rounded-xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                        Error: {typeof error === 'string' ? error : 'An error occurred'}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !question.trim()}
                      className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary to-pink text-white font-semibold hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Question
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar - Knowledge Summary */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Knowledge Topics
                </h3>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-white font-medium">AI & Machine Learning</p>
                  </div>
                  <div className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-white font-medium">Web Development</p>
                  </div>
                  <div className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-white font-medium">Startup Growth</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-4">Response Time</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">~2 hours</p>
                  <p className="text-sm text-muted-foreground">Average response time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Answers Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Answers</h2>
            <div className="space-y-4">
              {recentAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() =>
                    setSelectedAnswer(
                      selectedAnswer === answer.id ? null : answer.id
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors flex-1">
                      {answer.q}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {answer.date}
                    </span>
                  </div>

                  {selectedAnswer === answer.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {answer.a}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{answer.likes}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Powered by */}
          <p className="text-center text-xs text-muted-foreground mt-12">
            Powered by{' '}
            <Link href="/" className="text-primary hover:underline">
              One Question
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
