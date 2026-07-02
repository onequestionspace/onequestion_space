'use client';

import { useState, useRef } from 'react';
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
        body: JSON.stringify({ title: form.title, content: form.content }),
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
    } catch {
      setUploadError('Upload failed. Try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (id: Id<'knowledge'>) => {
    if (!confirm('Delete this knowledge item?')) return;
    await deleteKnowledge({ id });
  };

  const fileTypeIcon = (type?: string) => (
    <FileText className={`w-5 h-5 ${type?.includes('pdf') ? 'text-red-400' : 'text-amber-500'}`} />
  );

  return (
    <DashboardLayout title="Knowledge Base" description="Train your AI with your content.">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Brain className="w-5 h-5 text-amber-500" />
            {knowledge?.length ?? 0} item{knowledge?.length !== 1 ? 's' : ''} uploaded
          </div>
          {!isAdding && (
            <Button onClick={() => { setIsAdding(true); setUploadError(''); }} icon={<Plus className="w-4 h-4" />}>
              Add Knowledge
            </Button>
          )}
        </div>

        {/* Success */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Knowledge added successfully!
          </div>
        )}

        {/* Add form */}
        {isAdding && (
          <Card className="border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Add Knowledge</h3>
              <button onClick={() => { setIsAdding(false); setUploadError(''); setSelectedFile(null); }} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'text' ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'file' ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                Upload File
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. My Background, Product FAQ, Blog Post"
                />
              </div>

              {activeTab === 'text' ? (
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Paste your content here — bio, FAQ, blog post, anything your AI should know..."
                    rows={6}
                  />
                </div>
              ) : (
                <div>
                  <Label>File</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-amber-500" />
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

              <Button
                variant="primary"
                className="w-full"
                onClick={activeTab === 'text' ? handleTextSubmit : handleFileSubmit}
                loading={uploading}
                disabled={!form.title.trim() || (activeTab === 'text' ? !form.content.trim() : !selectedFile)}
                icon={<Upload className="w-4 h-4" />}
              >
                {uploading ? 'Saving...' : 'Save to Knowledge Base'}
              </Button>
            </div>
          </Card>
        )}

        {/* Guide */}
        <Card>
          <button
            onClick={() => setShowGuide(g => !g)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">How to make your AI powerful</span>
            </div>
            {showGuide ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>
          {showGuide && (
            <div className="mt-6 space-y-4 border-t border-white/[0.06] pt-4">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your AI only knows what you upload. The more specific and structured your knowledge, the better it answers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: '1. Start with your bio', desc: 'Who you are, what you do, your background, skills, and experience.', example: '"I am a 19-year-old CS student from Nigeria..."', color: '#f59e0b' },
                  { title: '2. Add an FAQ', desc: 'Write Q&A pairs for questions you get often.', example: '"Q: How can I hire you? A: DM me on X..."', color: '#3b82f6' },
                  { title: '3. Upload your work', desc: 'Paste project descriptions, case studies, blog posts.', example: '"I built One Question in 3 weeks from my phone..."', color: '#22c55e' },
                  { title: '4. Add services or offers', desc: 'Describe consulting, coaching, or products clearly.', example: '"I offer 1-on-1 consulting at $50/hr..."', color: '#f97316' },
                  { title: '5. Include contact info', desc: 'Email, X handle, website, Calendly link.', example: '"Best way to reach me is X @yourhandle"', color: '#ec4899' },
                  { title: '6. Keep it updated', desc: 'Add new projects, change your rates, update availability.', example: 'Add a new item every time something big changes.', color: '#06b6d4' },
                ].map(tip => (
                  <div key={tip.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tip.color }} />
                      <h4 className="text-xs font-semibold text-white">{tip.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{tip.desc}</p>
                    <p className="text-xs text-zinc-600 italic leading-relaxed">{tip.example}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs text-amber-400 font-semibold mb-1">Pro tip</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Upload separate items for each topic — do not dump everything in one block. Smaller focused items = more accurate AI matching. Aim for 5-10 items.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Knowledge list */}
        {knowledge && knowledge.length > 0 ? (
          <div className="space-y-3">
            {knowledge.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  {fileTypeIcon(item.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">{item.content}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
