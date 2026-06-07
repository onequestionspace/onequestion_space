'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApi } from '@/hooks/useApi';
import { validateEmail } from '@/lib/validations';
import { Sparkles, ArrowLeft, Check } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [position, setPosition] = useState<number | null>(null);
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
      const result = await execute('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email, role, name, username }),
      });
      setPosition(result?.position ?? null);
      setSubmitted(true);
      setEmail('');
      setRole('');
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="glass-card rounded-2xl p-8 border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Join the Waitlist</h1>
              <p className="text-muted-foreground">
                Reserve your username before anyone else takes it
              </p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink mb-2">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">🎉 You are In</h2>
                {position && (
                  <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <p className="text-primary font-bold text-lg">#{position} on the waitlist</p>
                  </div>
                )}
                <p className="text-muted-foreground">Welcome to One Question, {name}. Your username is reserved.</p>
                <div className="px-4 py-3 rounded-xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Your future profile</p>
                  <p className="text-primary font-medium">onequestion.space/{username}</p>
                </div>
                <Link href="/" className="inline-block mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    Claim Your Username
                  </label>
                  <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                    <span className="px-4 text-muted-foreground whitespace-nowrap text-sm">
                      onequestion.space/
                    </span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="yourname"
                      className="flex-1 bg-transparent px-2 py-3 text-foreground focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                    What do you do?
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select one</option>
                    <option value="Creator">Creator</option>
                    <option value="Founder">Founder</option>
                    <option value="Student">Student</option>
                    <option value="Coach">Coach</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Other">Other</option>
                  </select>
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
                  {loading ? 'Reserving...' : 'Claim Early Access'}
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
