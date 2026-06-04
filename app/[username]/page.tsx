'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';
import { ArrowLeft, Send, MessageCircle, Sparkles, Heart, Share2, TrendingUp } from 'lucide-react';

/**
 * Public Q&A Page
 * Visitor-facing page for asking questions with full profile showcase
 */
export default function PublicQAPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [question, setQuestion] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionError = validateQuestion(question);
    if (questionError) {
      alert(questionError.message);
      return;
    }

    try {
      await execute('/api/ask', {
        method: 'POST',
        body: JSON.stringify({
          question,
          username: username,
          visitorName: visitorName || 'Anonymous',
          visitorEmail: visitorEmail || undefined,
        }),
      });
      setSubmitted(true);
      setQuestion('');
      setVisitorName('');
      setVisitorEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting question:', err);
    }
  };

  // Mock profile data - will be replaced with API data
  const mockProfile = {
    username,
    displayName: `@${username}`,
    bio: 'Expert in their field, ready to answer your questions',
    avatar: '👤',
    totalQuestions: 234,
    totalAnswers: 198,
    responseRate: 85,
  };

  const mockAnswers = [
    {
      id: '1',
      question: 'How do I get started?',
      answer: 'Getting started is simple. Just upload your knowledge and share your link. Your AI will start answering questions immediately.',
      likes: 45,
      date: '2 days ago',
    },
    {
      id: '2',
      question: 'What formats do you support?',
      answer: 'We support PDF, TXT, Markdown, and direct text input for your knowledge base. You can also import from URLs.',
      likes: 32,
      date: '1 week ago',
    },
    {
      id: '3',
      question: 'Can I customize my page?',
      answer: 'Yes! You can customize colors, domains, branding, and more with our premium plans. Full customization coming soon.',
      likes: 28,
      date: '2 weeks ago',
    },
  ];

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

                {submitted ? (
                  <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                      <Send className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white font-semibold mb-1">Question submitted!</p>
                    <p className="text-muted-foreground text-sm">You&apos;ll receive an answer soon.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-primary hover:underline text-sm"
                    >
                      Ask another question
                    </button>
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
              {mockAnswers.map((answer) => (
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
                      {answer.question}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {answer.date}
                    </span>
                  </div>

                  {selectedAnswer === answer.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {answer.answer}
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
