'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApi } from '@/hooks/useApi';
import { validateEmail } from '@/lib/validations';
import { Sparkles, ArrowLeft, Check } from 'lucide-react';

/**
 * Waitlist Page
 * Early access signup with brand design
 */
export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      alert(emailError.message);
      return;
    }

    try {
      await execute('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
      setSubmitted(true);
      setEmail('');
      setName('');
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-auto px-4">
          {/* Back link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Waitlist Card */}
          <div className="glass-card rounded-2xl p-8 border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Join the Waitlist</h1>
              <p className="text-muted-foreground">
                Be the first to experience One Question when we launch
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-semibold mb-1">You&apos;re on the list!</p>
                <p className="text-muted-foreground text-sm">We&apos;ll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                  className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary to-pink text-white font-semibold hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6">
              By joining, you agree to our{' '}
              <Link href="#" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
