'use client';

import { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Sparkles, 
  Share2, 
  ExternalLink,
  Brain,
  CheckCircle2
} from 'lucide-react';

/**
 * Enhanced Public Q&A Page
 * Visitor-facing page with AI streaming simulation and interactive feed
 */
export default function PublicQAPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [question, setQuestion] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { execute, loading, error } = useApi();
  const responseRef = useRef<HTMLDivElement>(null);

  // Mock answers for the feed
  const [recentAnswers, setRecentAnswers] = useState([
    { id: '1', q: 'How do you stay productive?', a: 'I use a combination of time-blocking and AI automation to handle repetitive tasks.', date: '2h ago' },
    { id: '2', q: 'What tools do you use for building?', a: 'Next.js, Convex, and Tailwind are my current go-to stack for rapid MVP development.', date: '5h ago' },
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
          visitorName,
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
        date: 'Just now'
      }, ...prev]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-8 pb-20">
        <div className="max-w-lg mx-auto px-4">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <button className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-8 border border-border text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-16 h-16" />
            </div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent mx-auto mb-6 p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">@{username}</h1>
              <p className="text-muted-foreground mb-6">Ask me anything! I&apos;ve trained an AI on my knowledge to answer you 24/7.</p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <Brain className="w-3 h-3" />
                  Expert AI
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Question Flow */}
          <div className="space-y-6">
            {!submitted ? (
              <div className="glass-card rounded-3xl p-8 border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground ml-1">Your Question</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What would you like to know?"
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-inner"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground ml-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full px-5 py-3 rounded-2xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-pink text-white font-bold hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    Ask AI Assistant
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* User Question Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-primary text-white px-6 py-4 rounded-3xl rounded-tr-none shadow-lg">
                    <p className="text-sm font-medium opacity-70 mb-1">{visitorName || 'You'} asked:</p>
                    <p className="font-medium">{question}</p>
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div className="flex justify-start" ref={responseRef}>
                  <div className="max-w-[90%] glass-card border border-primary/30 px-6 py-6 rounded-3xl rounded-tl-none shadow-glow-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Response</span>
                    </div>
                    
                    <div className="text-foreground leading-relaxed">
                      {aiResponse}
                      {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle"></span>}
                    </div>

                    {!isTyping && (
                      <button 
                        onClick={() => {
                          setSubmitted(false);
                          setQuestion('');
                        }}
                        className="mt-6 text-xs font-bold text-primary hover:text-pink transition-colors flex items-center gap-2"
                      >
                        Ask another question
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Feed */}
            <div className="pt-10">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Recent Answers
              </h2>
              
              <div className="space-y-4">
                {recentAnswers.map((item) => (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-bold text-foreground leading-tight pr-8">{item.q}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">&quot;{item.a}&quot;</p>
                    <button className="mt-3 text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                      Read full answer <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-20 text-center">
            <Link href="/" className="inline-flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-xs font-medium text-muted-foreground">Powered by</span>
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-[10px] font-bold">Q</div>
              <span className="text-sm font-bold text-foreground">One Question</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
