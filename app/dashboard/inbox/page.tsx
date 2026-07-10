'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Inbox, MessageSquare, Send, Sparkles, HelpCircle } from 'lucide-react';

export default function InboxPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.current);

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'review' | 'unanswered'>('review');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'unanswered' || tab === 'review') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const needsReview = useQuery(
    api.questions.listNeedsReview,
    profile?._id ? { profileId: profile._id } : 'skip'
  );
  const unanswered = useQuery(
    api.questions.getUnansweredQuestions,
    profile?._id ? { profileId: profile._id } : 'skip'
  );

  const resolveQuestion = useMutation(api.questions.resolveQuestion);
  const answerQuestion = useMutation(api.questions.answerQuestion);
  const { toast } = useToast();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  // "Needs Review" questions are always unanswered too, so filter them
  // out of the plain "Unanswered" list to avoid duplicate cards.
  const reviewIds = new Set((needsReview ?? []).map(q => q._id));
  const plainUnanswered = (unanswered ?? []).filter(q => !reviewIds.has(q._id));

  const handleSubmitReview = async (questionId: string) => {
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

  const handleSubmitUnanswered = async (questionId: string) => {
    const answer = answers[questionId]?.trim();
    if (!answer) return;
    setSubmitting(questionId);
    try {
      await answerQuestion({
        id: questionId as any,
        answer,
      });
      toast({ type: 'success', title: 'Answered!', description: 'Your reply has been saved.' });
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

  const reviewLoading = needsReview === undefined;
  const unansweredLoading = unanswered === undefined;

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

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'review'
                ? 'bg-primary/20 text-primary border border-primary/20'
                : 'text-zinc-500 hover:text-white bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Needs Review
            <span className="text-[10px] text-zinc-500">({needsReview?.length ?? 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('unanswered')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'unanswered'
                ? 'bg-primary/20 text-primary border border-primary/20'
                : 'text-zinc-500 hover:text-white bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Unanswered
            <span className="text-[10px] text-zinc-500">({plainUnanswered.length})</span>
          </button>
        </div>

        {activeTab === 'review' && (
          <Card>
            <CardHeader
              title="Needs Your Answer"
              icon={<Inbox className="w-4 h-4 text-primary" />}
              action={<span className="text-xs text-zinc-500">{needsReview?.length || 0} waiting</span>}
            />
            {reviewLoading ? (
              <ListSkeleton rows={4} />
            ) : !needsReview || needsReview.length === 0 ? (
              <EmptyState
                icon={<Inbox />}
                title="Inbox zero!"
                description="Your AI is answering everything confidently. Nice work."
              />
            ) : (
              <div className="space-y-3">
                {needsReview.map(q => (
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
                      <Button variant="primary" size="sm" onClick={() => handleSubmitReview(q._id)}
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
        )}

        {activeTab === 'unanswered' && (
          <Card>
            <CardHeader
              title="Unanswered Questions"
              icon={<HelpCircle className="w-4 h-4 text-primary" />}
              action={<span className="text-xs text-zinc-500">{plainUnanswered.length} waiting</span>}
            />
            {unansweredLoading ? (
              <ListSkeleton rows={4} />
            ) : plainUnanswered.length === 0 ? (
              <EmptyState
                icon={<HelpCircle />}
                title="All caught up!"
                description="Every question a visitor has asked has been answered."
              />
            ) : (
              <div className="space-y-3">
                {plainUnanswered.map(q => (
                  <div key={q._id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{q.question}</p>
                      </div>
                    </div>
                    <Textarea value={answers[q._id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
                      rows={2} placeholder="Type your answer here..." />
                    <div className="flex justify-end">
                      <Button variant="primary" size="sm" onClick={() => handleSubmitUnanswered(q._id)}
                        loading={submitting === q._id} icon={<Send className="w-3 h-3" />}
                        disabled={!answers[q._id]?.trim()}>
                        Answer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
