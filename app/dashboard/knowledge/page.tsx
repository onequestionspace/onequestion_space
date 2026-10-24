'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardHeader } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Input, Textarea, Label } from '@/components/dashboard/Input';
import { Button } from '@/components/dashboard/Button';
import { ListSkeleton } from '@/components/dashboard/Skeleton';
import { KnowledgeHealthCard, KnowledgeGapsCard, CoverageCard, AutoFAQCard } from '@/components/KnowledgeIntelligence';
import {
  Brain, Upload, FileText, Trash2, Plus,
  CheckCircle2, AlertCircle, X, Lightbulb, ChevronDown, ChevronUp,
  Link, Globe, ImageIcon, Search, Circle
} from 'lucide-react';

type CoverageItem = { id: string; label: string; covered: boolean };

const GUIDE_TIPS: Record<string, { desc: string; example: string; color: string }> = {
  bio: { desc: 'Who you are, what you do, your background.', example: '"I am a solo founder building One Question from Damaturu, Nigeria..."', color: '#F5A623' },
  pricing: { desc: 'Rates, plans, or how much things cost.', example: '"One Question costs $9/month on the founding plan..."', color: '#3b82f6' },
  contact: { desc: 'Email, X handle, website, Calendly link.', example: '"Best way to reach me is X @Asym_Alwali"', color: '#ec4899' },
  services: { desc: 'Describe consulting, coaching, or products.', example: '"I help founders build AI-powered Q&A pages..."', color: '#f97316' },
  experience: { desc: 'Projects, work history, things you have built.', example: '"I built One Question in a few weeks, entirely from my phone..."', color: '#22c55e' },
  faq: { desc: 'Write Q&A pairs for questions you get often.', example: '"Q: How can I hire you? A: DM me on X..."', color: '#a855f7' },
  testimonials: { desc: 'Reviews or feedback from clients or partners.', example: '"One client said: this saved me hours every week..."', color: '#06b6d4' },
  skills: { desc: 'Tools, technologies, and expertise you have.', example: '"I work with Next.js, Convex, Groq, and Gemini..."', color: '#eab308' },
};

export default function KnowledgePage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url' | 'image'>('text');
  const [showGuide, setShowGuide] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: '', content: '' });
  const [url, setUrl] = useState('');
  const [sourceType, setSourceType] = useState<'personal' | 'article'>('personal');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const coverage = useQuery(
    api.knowledgeHealth.getCoverageScore,
    userId ? { userId } : 'skip'
  );
  const coverageLoading = coverage === undefined;

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByUserId,
    userId ? { userId } : 'skip'
  );
  const deleteKnowledge = useMutation(api.knowledge.deleteKnowledge);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const handleTextSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !userId) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, content: form.content, sourceType }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setForm({ title: '', content: '' });
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      setUploadError('Failed to save. Try again.');
    }
    setUploading(false);
  };

  const handleUrlSubmit = async () => {
    if (!url.trim() || !form.title.trim() || !userId) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await fetch('/api/knowledge/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), sourceType: 'article', sourceUrl: url.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm({ title: '', content: '' });
      setUrl('');
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (e: any) {
      setUploadError(e.message || 'Failed to save URL. Try again.');
    }
    setUploading(false);
  };

  const handleFileSubmit = async () => {
    const file = activeTab === 'image' ? selectedImage : selectedFile;
    if (!file || !form.title.trim() || !userId) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', form.title);
      formData.append('content', form.content || file.name);
      formData.append('sourceType', activeTab === 'image' ? 'image' : sourceType);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setForm({ title: '', content: '' });
      setSelectedFile(null);
      setSelectedImage(null);
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      setUploadError('Upload failed. Try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (id: Id<'knowledge'>) => {
    if (!confirm('Delete this knowledge item?')) return;
    await deleteKnowledge({ id });
  };

  const fileTypeIcon = (type?: string, sourceType?: string) => {
    if (sourceType === 'url' || type === 'url') return <Link className="w-5 h-5 text-blue-400" />;
    if (sourceType === 'image' || type?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-purple-400" />;
    return <FileText className={`w-5 h-5 ${type?.includes('pdf') ? 'text-red-400' : 'text-primary'}`} />;
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  const loading = knowledge === undefined;
  const filteredKnowledge = (knowledge ?? []).filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout title="Knowledge Base" description="Train your AI with your content.">
      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Brain className="w-5 h-5 text-primary" />
            {loading ? 'Loading...' : `${knowledge?.length ?? 0} item${knowledge?.length !== 1 ? 's' : ''} uploaded`}
          </div>
          {!isAdding && (
            <Button onClick={() => { setIsAdding(true); setUploadError(''); }} icon={<Plus className="w-4 h-4" />}>
              Add Knowledge
            </Button>
          )}
        </div>

        {/* Keep the next activation step visible once the user has taught the AI. */}
        {!loading && (knowledge?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Knowledge added. Now test what your AI can answer.</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">Ask a real question and check that the response matches the information you provided.</p>
            </div>
            <a href="/dashboard/chat" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90">Test an answer →</a>
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Knowledge added successfully!
          </div>
        )}

        {isAdding && (
          <Card className="border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Add Knowledge</h3>
              <button onClick={() => { setIsAdding(false); setUploadError(''); setSelectedFile(null); }}
                className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(['text', 'file', 'url', 'image'] as const).map(tab => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                  }`}>
                  {tab === 'text' ? 'Text' : tab === 'file' ? 'File' : tab === 'url' ? 'URL' : 'Image'}
                </button>
              ))}
            </div>

            {(activeTab === 'text' || activeTab === 'file') && (
              <div className="mb-4">
                <Label>Source Type</Label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setSourceType('personal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sourceType === 'personal' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                    }`}>
                    My Own Content
                  </button>
                  <button onClick={() => setSourceType('article')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sourceType === 'article' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                    }`}>
                    External Article
                  </button>
                </div>
                {sourceType === 'article' && (
                  <p className="text-xs text-zinc-600 mt-1">The AI will know this is reference material, not personal info.</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. My Background, Product FAQ, Blog Post" />
              </div>

              {activeTab === 'text' ? (
                <div>
                  <Label suffix={form.content.trim() ? `${wordCount(form.content)} words` : undefined}>Content</Label>
                  <Textarea value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Paste your content here..."
                    rows={6} />
                </div>
              ) : activeTab === 'url' ? (
                <div>
                  <Label>URL</Label>
                  <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-primary/40 transition-all">
                    <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input type="url" value={url}
                      onChange={e => setUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">The AI will reference this as an external source.</p>
                </div>
              ) : activeTab === 'image' ? (
                <div>
                  <Label>Image</Label>
                  <div onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/[0.03] transition-all">
                    {selectedImage ? (
                      <div className="flex items-center justify-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm text-white">{selectedImage.name}</span>
                        <span className="text-xs text-zinc-500">({(selectedImage.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500">Click to upload image</p>
                        <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WebP — Max 10MB</p>
                      </>
                    )}
                  </div>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => setSelectedImage(e.target.files?.[0] || null)} />
                </div>
              ) : (
                <div>
                  <Label>File</Label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/[0.03] transition-all">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm text-white">{selectedFile.name}</span>
                        <span className="text-xs text-zinc-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500">Click to upload PDF, TXT, or MD</p>
                        <p className="text-xs text-zinc-600 mt-1">Max 10MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.doc,.docx" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </div>
              )}

              <Button variant="primary" className="w-full"
                onClick={activeTab === 'text' ? handleTextSubmit : activeTab === 'url' ? handleUrlSubmit : handleFileSubmit}
                loading={uploading}
                disabled={!form.title.trim() || (activeTab === 'text' ? !form.content.trim() : activeTab === 'url' ? !url.trim() : activeTab === 'image' ? !selectedImage : !selectedFile)}
                icon={<Upload className="w-4 h-4" />}>
                {uploading ? 'Saving...' : 'Save to Knowledge Base'}
              </Button>
            </div>
          </Card>
        )}

        {/* Guide with live checklist */}
        <Card>
          <button onClick={() => setShowGuide(g => !g)} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">How to make your AI powerful</span>
              {!coverageLoading && coverage && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {coverage.totalCovered}/{coverage.totalCategories} covered
                </span>
              )}
            </div>
            {showGuide ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>
          {showGuide && (
            <div className="mt-5 space-y-4 border-t border-white/[0.06] pt-4">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your AI only knows what you upload. Here is your live checklist — items are marked done automatically as your knowledge base grows.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coverageLoading ? (
                  <div className="col-span-2 animate-pulse h-32 bg-white/[0.03] rounded-xl" />
                ) : coverage?.covered.map((cat) => {
                  const tip = GUIDE_TIPS[cat.id] || { desc: '', example: '', color: '#F5A623' };
                  return (
                    <div key={cat.id} className={`p-4 rounded-xl border transition-all ${
                      cat.covered ? 'bg-green-500/[0.04] border-green-500/20' : 'bg-white/[0.02] border-white/[0.06]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {cat.covered ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                        )}
                        <h4 className={`text-xs font-semibold ${cat.covered ? 'text-green-300' : 'text-white'}`}>{cat.label}</h4>
                      </div>
                      <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{tip.desc}</p>
                      {!cat.covered && <p className="text-xs text-zinc-600 italic">{tip.example}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="p-4 rounded-xl bg-primary/[0.05] border border-primary/20">
                <p className="text-xs text-primary font-semibold mb-1">Pro tip</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Upload separate items for each topic — do not dump everything in one block. Smaller focused items = more accurate AI matching. Aim for 5-10 items covering the categories above.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Knowledge Intelligence */}
        {userId && knowledge && knowledge.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            <KnowledgeHealthCard userId={userId} />
            <KnowledgeGapsCard userId={userId} />
            <CoverageCard userId={userId} />
            <AutoFAQCard userId={userId} />
          </div>
        )}

        {/* Search */}
        {!loading && knowledge && knowledge.length > 0 && (
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-primary/40 transition-all">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your knowledge base..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {loading ? (
          <ListSkeleton rows={3} />
        ) : filteredKnowledge.length > 0 ? (
          <div className="space-y-2">
            {filteredKnowledge.map(item => (
              <div key={item._id} className="paper-card p-4 flex items-start gap-4 hover:border-white/[0.12] transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {fileTypeIcon(item.fileType, (item as any).sourceType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <p className="text-xs text-zinc-600">{new Date(item.createdAt).toLocaleDateString()}</p>
                    <span className="text-xs text-zinc-700">•</span>
                    <p className="text-xs text-zinc-600">{wordCount(item.content)} words</p>
                    {(item as any).sourceType === 'article' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium">
                        <Globe className="w-2.5 h-2.5" /> Article
                      </span>
                    )}
                    {(item as any).sourceType === 'image' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-medium">
                        <ImageIcon className="w-2.5 h-2.5" /> Image
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(item._id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : knowledge && knowledge.length > 0 && search ? (
          <EmptyState
            icon={<Search />}
            title="No matches found"
            description={`No knowledge items match "${search}".`}
          />
        ) : !isAdding ? (
          <EmptyState
            icon={<Brain />}
            title="No knowledge yet"
            description="Add content so your AI can answer visitor questions accurately."
            action={
              <Button onClick={() => setIsAdding(true)} variant="primary">
                Add your first knowledge
              </Button>
            }
          />
        ) : null}
      </div>
    </DashboardLayout>
  );
}
