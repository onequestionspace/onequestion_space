'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';
import { ArrowLeft, Send, MessageCircle, FileText, Sparkles } from 'lucide-react';

/**
 * Terms of Service AI Q&A Page
 * Replaces static text with interactive AI assistant
 */
export default function TermsPage() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
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
          username: 'onequestion_legal',
          context: 'terms_of_service',
        }),
      });
      setSubmitted(true);
      setQuestion('');
    } catch (err) {
      console.error('Error submitting question:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-8 pb-20">
        <div className="max-w-lg mx-auto px-4">
          {/* Back link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Page Header */}
          <div className="glass-card rounded-2xl p-8 border border-border text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-pink to-accent mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Terms Assistant</h1>
            <p className="text-muted-foreground mb-4">Ask anything about our terms of service.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <Sparkles className="w-3 h-3" />
              Simplified Agreement
            </div>
          </div>

          {/* Question Form */}
          <div className="glass-card rounded-2xl p-8 border border-border mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Ask a Question
            </h2>

            {submitted ? (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-semibold mb-1">Question received!</p>
                <p className="text-muted-foreground text-sm">Our Legal AI will answer you instantly.</p>
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
                  <label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
                    What would you like to know?
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Can I cancel anytime? What are my usage limits?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-accent text-sm bg-accent/10 px-4 py-2 rounded-lg">
                    {error.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary to-pink text-white font-semibold hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Analyzing...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get Answer
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Suggested Questions */}
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Suggested Questions</h3>
            <div className="space-y-2">
              {[
                "Who owns the AI generated content?",
                "What is your refund policy?",
                "Are there any age restrictions?",
                "How do I terminate my account?"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
