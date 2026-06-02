'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Upload, FileText, Brain, Trash2 } from 'lucide-react';

/**
 * Knowledge Management Page
 * Upload and manage knowledge base with brand design
 */
export default function KnowledgePage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/');
  }

  return (
    <DashboardLayout title="Knowledge Base" description="Train your AI with custom knowledge.">
      {/* Upload Section */}
      <div className="glass-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Train Your AI
        </h2>
        <p className="text-muted-foreground mb-6">
          Upload documents, add text, or connect sources to train your AI assistant.
        </p>

        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Drop files here or click to upload</p>
          <p className="text-muted-foreground text-sm">Supports PDF, TXT, DOC, and more</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm hover:bg-primary/10 transition-colors">
            Add Text
          </button>
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm hover:bg-primary/10 transition-colors">
            Import from URL
          </button>
          <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm hover:bg-primary/10 transition-colors">
            Connect Notion
          </button>
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="glass-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">Your Knowledge</h2>
        
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No knowledge added yet</p>
          <p className="text-muted-foreground/70 text-sm">Upload content above to train your AI</p>
        </div>

        {/* Example item (hidden for now) */}
        <div className="hidden">
          <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">document.pdf</p>
                <p className="text-muted-foreground text-sm">Uploaded 2 days ago</p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
