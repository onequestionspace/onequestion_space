'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/dashboard/Button';
import { Textarea } from '@/components/dashboard/Input';
import { ListSkeleton } from '@/components/dashboard/Skeleton';
import { useToast } from '@/components/dashboard/Toast';
import { Inbox, MessageSquare, Send, Sparkles } from 'lucide-react';

export default function InboxPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.current);
  const pending = useQuery(
    api.questions.listNeedsReview,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const resolveQuestion = useMutation(api.questions.resolveQuestion);
  const { toast } = useToast();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleSubmit = async (questionId: string) => {
    const answer = answers[questionId]?.trim();
    if (!answer || !profile?.userId) return;
    setSubmitting(questionId);
    try {
      await resolveQuestion({
        id: questionId as any,
        correctedAnswer: answer,
        userId: profile.userId,
      });
      toast({ type: 'success', title: 'Added to knowledge base!', description: 'Your Space just got smarter.' });
      setAnswers(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    } catch (e) {
      console.error(e);
      toast({ type: 'error', title: 'Failed to save', description: 'Please try again.' });
    }
    setSubmitting(null);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const loading = pending === undefined;

  return (
    <DashboardLayout title="Inbox" description="Questions your AI couldn't answer well">
      <div className="max-w-3xl mx-auto space-y-5">

        <Card>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-zinc-400">
              Every time your AI gives a weak or generic answer, it lands here. Answer it once and it is added straight to your knowledge base — so it never happens again.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Needs Your Answer"
            icon={<Inbox className="w-4 h-4 text-primary" />}
            action={<span className="text-xs text-zinc-500">{pending?.length || 0} waiting</span>}
          />
          {loading ? (
            <ListSkeleton rows={4} />
          ) : !pending || pending.length === 0 ? (
            <EmptyState
              icon={<Inbox />}
              title="Inbox zero!"
              description="Your AI is answering everything confidently. Nice work."
            />
          ) : (
            <div className="space-y-3">
              {pending.map(q => (
                <div key={q._id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{q.question}</p>
                      {q.answer && (
                        <p className="text-xs text-zinc-600 mt-1 italic line-clamp-2">
                          AI said: &ldquo;{q.answer}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <Textarea value={answers[q._id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
                    rows={2} placeholder="Type the real answer here..." />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" onClick={() => handleSubmit(q._id)}
                      loading={submitting === q._id} icon={<Send className="w-3 h-3" />}
                      disabled={!answers[q._id]?.trim()}>
                      Save to Knowledge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
}
