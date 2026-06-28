'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Brain, Upload, FileText, Trash2, Plus,
  Loader2, CheckCircle2, AlertCircle, X, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';

export default function KnowledgePage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByUserId,
    userId ? { userId } : 'skip'
  );
  const createKnowledge = useMutation(api.knowledge.createKnowledge);
  const deleteKnowledge = useMutation(api.knowledge.deleteKnowledge);

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
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
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setForm({ title: '', content: '' });
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (e) {
      setUploadError('Failed to save. Please try again.');
    }
    setUploading(false);
  };

  const handleFileSubmit = async () => {
    if (!selectedFile || !form.title.trim() || !userId) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', form.title);
      formData.append('content', form.content || ' ');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      await createKnowledge({
        userId,
        title: form.title,
        content: form.content || selectedFile.name,
        fileUrl: data.data?.fileUrl,
        fileType: selectedFile.type,
      });

      setForm({ title: '', content: '' });
      setSelectedFile(null);
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (e) {
      setUploadError('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (id: Id<'knowledge'>) => {
    if (!confirm('Delete this knowledge item?')) return;
    await deleteKnowledge({ id });
  };

  const fileTypeIcon = (type?: string) => {
    if (!type) return <FileText className="w-5 h-5 text-amber-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (type.includes('image')) return <FileText className="w-5 h-5 text-blue-400" />;
    return <FileText className="w-5 h-5 text-amber-500" />;
  };

  return (
    <DashboardLayout title="Knowledge Base" description="Train your AI with your content.">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-500" />
          <span className="text-sm text-muted-foreground">
            {knowledge?.length ?? 0} item{knowledge?.length !== 1 ? 's' : ''} uploaded
          </span>
        </div>
        <button
          onClick={() => { setIsAdding(true); setUploadError(''); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r bg-amber-500 text-white text-sm font-bold hover:shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Knowledge
        </button>
      </div>

      {/* Success banner */}
      {uploadSuccess && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Knowledge added successfully!
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="glass-card rounded-2xl p-6 border border-amber-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Add Knowledge</h3>
            <button onClick={() => { setIsAdding(false); setUploadError(''); setSelectedFile(null); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-amber-500 text-white' : 'bg-card text-muted-foreground border border-border hover:text-foreground'}`}
            >
              Text / URL
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'file' ? 'bg-amber-500 text-white' : 'bg-card text-muted-foreground border border-border hover:text-foreground'}`}
            >
              Upload File
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. My Background, Product FAQ, Blog Post"
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {activeTab === 'text' ? (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Paste your content here — bio, FAQ, blog post, anything your AI should know..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">File</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-foreground">{selectedFile.name}</span>
                      <span className="text-xs text-muted-foreground">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload PDF, TXT, or MD</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Max 10MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  className="hidden"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}

            <button
              onClick={activeTab === 'text' ? handleTextSubmit : handleFileSubmit}
              disabled={uploading || !form.title.trim() || (activeTab === 'text' ? !form.content.trim() : !selectedFile)}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Saving...' : 'Save to Knowledge Base'}
            </button>
          </div>
        </div>
      )}


      {/* How to use guide */}
      <div className="glass-card rounded-2xl border border-border mb-6 overflow-hidden">
        <button
          onClick={() => setShowGuide(g => !g)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-foreground">How to make your AI powerful</span>
          </div>
          {showGuide ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showGuide && (
          <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground leading-relaxed">Your AI only knows what you upload. The more specific and structured your knowledge, the better it answers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: '1. Start with your bio',
                  desc: 'Who you are, what you do, your background, skills, and experience. This is the foundation.',
                  example: 'Example: "I am a 19-year-old CS student from Nigeria. I build startups from my phone using Termux..."',
                  color: '#f59e0b',
                },
                {
                  title: '2. Add an FAQ',
                  desc: 'Write Q&A pairs for questions you get often. The AI will match and answer them precisely.',
                  example: 'Example: "Q: How can I hire you? A: DM me on X at @yourhandle..."',
                  color: '#3b82f6',
                },
                {
                  title: '3. Upload your work',
                  desc: 'Paste project descriptions, case studies, blog posts, or anything that shows what you have built.',
                  example: 'Example: "I built One Question — an AI Q&A platform — in 3 weeks from my Android phone..."',
                  color: '#22c55e',
                },
                {
                  title: '4. Add your services or offers',
                  desc: 'If you offer consulting, coaching, or products — describe them clearly so visitors can learn and reach out.',
                  example: 'Example: "I offer 1-on-1 consulting for early-stage founders at $50/hr. Book via Calendly..."',
                  color: '#f97316',
                },
                {
                  title: '5. Include contact info',
                  desc: 'Email, X handle, website, Calendly link. The AI will share this when visitors ask how to reach you.',
                  example: 'Example: "Best way to reach me is X @yourhandle or email you@domain.com"',
                  color: '#ec4899',
                },
                {
                  title: '6. Keep it updated',
                  desc: 'Add new projects, change your rates, update your availability. Fresh knowledge = accurate answers.',
                  example: 'Tip: Add a new item every time something big changes in your work or life.',
                  color: '#06b6d4',
                },
              ].map(tip => (
                <div key={tip.title} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tip.color }} />
                    <h4 className="text-xs font-bold text-foreground">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{tip.desc}</p>
                  <p className="text-xs text-muted-foreground/50 italic leading-relaxed">{tip.example}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-500 font-semibold mb-1">Pro tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Upload separate items for each topic — do not dump everything in one block. Smaller focused items = more accurate AI matching. Aim for 5-10 items covering different areas of your life and work.</p>
            </div>
          </div>
        )}
      </div>

      {/* Knowledge list */}
      {knowledge && knowledge.length > 0 ? (
        <div className="space-y-3">
          {knowledge.map((item) => (
            <div key={item._id} className="glass-card rounded-2xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                {fileTypeIcon(item.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                <p className="text-xs text-muted-foreground/50 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 border border-border text-center">
          <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No knowledge yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Add content so your AI can answer visitor questions accurately.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r bg-amber-500 text-white text-sm font-bold hover:shadow-amber-500/20 transition-all"
          >
            Add your first knowledge
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
