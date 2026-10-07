'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ArrowUpRight, Check, Copy, Loader2, Mail, Plus, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { isAdminUser } from '@/convex/userIds';

type ProspectSelection = {
  profileId: Id<'profiles'>;
  username: string;
  email: string;
  claimToken?: string;
};

type TestResult = {
  answer: string;
  sources: { title: string; excerpt: string; score: number }[];
};

async function readResponse(response: Response) {
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'The request could not be completed.');
  }
  return result.data;
}

export default function ProspectStudioPage() {
  const { user, isLoaded } = useUser();
  const adminId = user?.id ?? '';
  const isAdmin = isAdminUser(adminId);
  const prospects = useQuery(api.admin.getProspects, isAdmin ? { adminId } : 'skip');
  const createProspect = useMutation(api.admin.createProspect);
  const addKnowledge = useMutation(api.admin.addProspectKnowledge);
  const markInvited = useMutation(api.admin.markProspectInvited);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [knowledgeTitle, setKnowledgeTitle] = useState('');
  const [knowledgeText, setKnowledgeText] = useState('');
  const [testQuestion, setTestQuestion] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [selected, setSelected] = useState<ProspectSelection | null>(null);
  const [busy, setBusy] = useState<'create' | 'knowledge' | 'test' | 'invite' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isLoaded) {
    return <DashboardLayout title="Prospect Studio"><p className="text-sm text-zinc-500">Loading…</p></DashboardLayout>;
  }
  if (!isAdmin) {
    return (
      <DashboardLayout title="Prospect Studio" description="Set up and share a page for a new customer.">
        <p role="alert" className="rounded-xl border border-zinc-200 p-5 text-sm text-zinc-600">This workspace is available to admins only.</p>
      </DashboardLayout>
    );
  }

  const setSelectedProspect = (prospect: NonNullable<typeof prospects>[number]) => {
    if (!prospect.profile) return;
    setSelected({
      profileId: prospect.profileId,
      username: prospect.profile.username,
      email: prospect.email,
      claimToken: prospect.profile.claimToken,
    });
    setTestResult(null);
    setMessage('');
    setError('');
  };

  const clearNotices = () => {
    setMessage('');
    setError('');
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearNotices();
    setBusy('create');
    try {
      const result = await createProspect({
        adminId,
        email,
        username,
        displayName: name,
        bio: bio || undefined,
      });
      setSelected({
        profileId: result.profileId,
        username: result.username,
        email: result.email,
        claimToken: result.claimToken,
      });
      setKnowledgeTitle(`${name.trim()} — background and expertise`);
      setKnowledgeText('');
      setName('');
      setEmail('');
      setUsername('');
      setBio('');
      setTestResult(null);
      setMessage('Page created. Add the person’s knowledge, then test it before sending the invite.');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Could not create this page.');
    } finally {
      setBusy(null);
    }
  };

  const handleKnowledge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    clearNotices();
    setBusy('knowledge');
    try {
      const preparedResponse = await fetch('/api/admin/prospects/prepare-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: knowledgeTitle, content: knowledgeText }),
      });
      const prepared = await readResponse(preparedResponse);
      await addKnowledge({
        adminId,
        profileId: selected.profileId,
        title: knowledgeTitle.trim(),
        content: knowledgeText.trim(),
        embeddings: prepared.embeddings ?? [],
        chunks: prepared.chunks,
      });
      setKnowledgeText('');
      setTestResult(null);
      setMessage('Knowledge added and indexed for semantic search. Add another item or test a likely visitor question.');
    } catch (knowledgeError) {
      setError(knowledgeError instanceof Error ? knowledgeError.message : 'Could not add this knowledge.');
    } finally {
      setBusy(null);
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    clearNotices();
    if (file.size > 100_000) {
      setError('Text files must be 100 KB or smaller.');
      event.target.value = '';
      return;
    }
    try {
      const text = await file.text();
      if (!text.trim()) throw new Error('That file is empty.');
      if (text.length > 40000) throw new Error('Text files must contain 40,000 characters or fewer.');
      setKnowledgeText(text);
      setKnowledgeTitle(file.name.replace(/\.(txt|md|markdown)$/i, '').slice(0, 120));
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Could not read this text file.');
    }
    event.target.value = '';
  };

  const handleTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    clearNotices();
    setBusy('test');
    setTestResult(null);
    try {
      const response = await fetch('/api/admin/prospects/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selected.username, question: testQuestion }),
      });
      setTestResult(await readResponse(response));
    } catch (testError) {
      setError(testError instanceof Error ? testError.message : 'Could not test this page.');
    } finally {
      setBusy(null);
    }
  };

  const handleInvite = async () => {
    if (!selected?.claimToken) return;
    clearNotices();
    setBusy('invite');
    try {
      const response = await fetch('/api/admin/prospects/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selected.email, claimToken: selected.claimToken }),
      });
      await readResponse(response);
      setMessage(`Secure claim invitation sent to ${selected.email}.`);
      try {
        await markInvited({ adminId, profileId: selected.profileId });
      } catch (statusError) {
        console.error('Invitation sent, but prospect status did not update:', statusError);
        setError('The invitation was sent, but the prospect status did not update. Refresh this page.');
      }
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Could not send the invitation.');
    } finally {
      setBusy(null);
    }
  };

  const copyPageLink = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(`https://onequestion.space/${selected.username}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy the page link. Open the public page and copy its URL.');
    }
  };

  const selectedProspect = prospects?.find((prospect) => prospect.profileId === selected?.profileId);
  const canInvite = !!selected?.claimToken && (selectedProspect?.knowledgeCount ?? 0) > 0;

  return (
    <DashboardLayout title="Prospect Studio" description="Prepare a personal AI page, test it, and invite its owner.">
      <div className="mx-auto max-w-5xl space-y-6">
        {message && <p role="status" className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">{message}</p>}
        {error && <p role="alert" className="rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-700">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-xl border border-zinc-200 p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">1 · Create a page</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">Start with the person</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Their account stays theirs. They activate it securely from the invitation after you prepare the page.</p>
            </div>
            <form onSubmit={(event) => void handleCreate(event)} className="space-y-3">
              <label className="block text-xs font-medium text-zinc-600">
                Name
                <input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500" />
              </label>
              <label className="block text-xs font-medium text-zinc-600">
                Email for the invite
                <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500" />
              </label>
              <label className="block text-xs font-medium text-zinc-600">
                Public page name
                <div className="mt-1.5 flex h-10 items-center rounded-lg border border-zinc-200 px-3 focus-within:border-zinc-500">
                  <span className="shrink-0 text-sm text-zinc-400">onequestion.space/</span>
                  <input required minLength={3} maxLength={30} pattern="[a-z0-9_]+" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-zinc-950 outline-none focus:ring-0" />
                </div>
              </label>
              <label className="block text-xs font-medium text-zinc-600">
                What they do
                <textarea rows={3} maxLength={500} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="A short, factual introduction" className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500" />
              </label>
              <button disabled={busy !== null} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
                {busy === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create page
              </button>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-zinc-200 p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">2 · Add knowledge</p>
              {selected ? (
                <>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">
                    Preparing <span className="font-normal text-zinc-500">@{selected.username}</span>
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">Add useful facts, services, examples, process, pricing, and answers they often repeat. {selectedProspect?.knowledgeCount ?? 0}/20 items</p>
                  <form onSubmit={(event) => void handleKnowledge(event)} className="mt-4 space-y-3">
                    <label className="block text-xs font-medium text-zinc-600">
                      Knowledge title
                      <input required maxLength={120} value={knowledgeTitle} onChange={(event) => setKnowledgeTitle(event.target.value)} placeholder="Services and how I work" className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500" />
                    </label>
                    <label className="block text-xs font-medium text-zinc-600">
                      Source material
                      <textarea required maxLength={40000} rows={7} value={knowledgeText} onChange={(event) => setKnowledgeText(event.target.value)} placeholder="Paste approved notes, FAQs, a bio, services, examples, or a transcript. Keep private information out." className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm leading-6 text-zinc-950 outline-none focus:border-zinc-500" />
                    </label>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-600 hover:text-black">
                        <UploadCloud className="h-4 w-4" /> Add .txt or .md file
                        <input type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" onChange={(event) => void handleFile(event)} className="sr-only" />
                      </label>
                      <span className="text-xs text-zinc-400">{knowledgeText.length.toLocaleString()} / 40,000</span>
                    </div>
                    <button disabled={busy !== null || !knowledgeText.trim() || (selectedProspect?.knowledgeCount ?? 0) >= 20} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50">
                      {busy === 'knowledge' ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                      Index this knowledge
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-3 rounded-lg bg-zinc-50 px-4 py-4 text-sm text-zinc-600">Create a page or choose a prospect below to add their knowledge.</p>
              )}
            </section>

            <section className="rounded-xl border border-zinc-200 p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">3 · Test and share</p>
              {selected ? (
                <>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Ask it what a visitor would</h2>
                      <p className="mt-1 text-sm text-zinc-600">Test answers against the prepared knowledge. Tests do not count toward the person’s answer limit.</p>
                    </div>
                    <Link href={`/${selected.username}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-black">
                      Preview page <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <form onSubmit={(event) => void handleTest(event)} className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input required maxLength={500} value={testQuestion} onChange={(event) => setTestQuestion(event.target.value)} placeholder="What services do you offer?" className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500" />
                    <button disabled={busy !== null || !selectedProspect?.knowledgeCount} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
                      {busy === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Test answer
                    </button>
                  </form>
                  {testResult && (
                    <div className="mt-4 rounded-lg border border-zinc-200 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">AI answer</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{testResult.answer}</p>
                      <div className="mt-4 border-t border-zinc-100 pt-3">
                        <p className="text-xs font-medium text-zinc-500">Knowledge used</p>
                        {testResult.sources.length ? (
                          <ul className="mt-2 space-y-2">
                            {testResult.sources.map((source, index) => (
                              <li key={`${source.title}-${index}`} className="text-xs leading-5 text-zinc-600">
                                <span className="font-medium text-zinc-800">{source.title}</span> · {source.score}% match — {source.excerpt}
                              </li>
                            ))}
                          </ul>
                        ) : <p className="mt-1 text-xs text-zinc-500">No matching knowledge was found for this question.</p>}
                      </div>
                    </div>
                  )}
                  <div className="mt-5 flex flex-col gap-2 border-t border-zinc-100 pt-4 sm:flex-row">
                    <button type="button" onClick={() => void copyPageLink()} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Page link copied' : 'Copy public page link'}
                    </button>
                    <button type="button" onClick={() => void handleInvite()} disabled={busy !== null || !canInvite} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40">
                      {busy === 'invite' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      {selectedProspect?.status === 'invited' ? 'Resend secure invite' : 'Email secure claim invite'}
                    </button>
                  </div>
                  {!selected?.claimToken && (
                    <p className="mt-3 text-xs text-zinc-500">This page is already claimed. Share the public page link with its owner.</p>
                  )}
                  {selected?.claimToken && !canInvite && (
                    <p className="mt-3 text-xs text-zinc-500">Add at least one knowledge item before sending the claim invitation.</p>
                  )}
                </>
              ) : (
                <p className="mt-3 rounded-lg bg-zinc-50 px-4 py-4 text-sm text-zinc-600">Select a prospect to test the AI and share their page.</p>
              )}
            </section>
          </div>
        </div>

        <section className="rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">Recent prospects</h2>
              <p className="mt-1 text-xs text-zinc-500">Pages in setup or waiting to be claimed.</p>
            </div>
            <span className="text-xs text-zinc-500">{prospects?.length ?? 0} / 50</span>
          </div>
          {prospects === undefined ? (
            <p className="p-5 text-sm text-zinc-500">Loading prospects…</p>
          ) : prospects.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">No prospects yet. Create the first page above.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {prospects.map((prospect) => (
                <li key={prospect._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{prospect.profile?.displayName ?? 'Page unavailable'} <span className="font-normal text-zinc-500">· {prospect.email}</span></p>
                    <p className="mt-1 text-xs text-zinc-500">
                      onequestion.space/{prospect.profile?.username} · {prospect.knowledgeCount} knowledge item{prospect.knowledgeCount === 1 ? '' : 's'} · {prospect.status}
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedProspect(prospect)} disabled={!prospect.profile?.isSeeded} className="h-9 shrink-0 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40">
                    {prospect.status === 'claimed' ? 'Claimed' : 'Continue setup'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
