'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Mail } from 'lucide-react';

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'Could not join the waitlist. Please try again.');
        return;
      }
      setJoined(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] px-4 py-20">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          {joined ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">You’re on the list</h1>
              <p className="text-sm text-zinc-400">We’ll email you when the next opportunity is available.</p>
            </div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Join the waitlist</h1>
              <p className="text-sm text-zinc-400 mb-6">
                Leave your email and we’ll let you know when the next spots open.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-zinc-300">
                  Name <span className="text-zinc-600">(optional)</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none focus:border-primary/50"
                  />
                </label>
                <label className="block text-sm text-zinc-300">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none focus:border-primary/50"
                  />
                </label>
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Joining…' : 'Join the waitlist'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
