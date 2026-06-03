'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Upload, 
  FileText, 
  Brain, 
  Trash2, 
  Plus, 
  Link as LinkIcon, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  Search,
  AlertCircle,
  Sparkles
} from 'lucide-react';

/**
 * Enhanced Knowledge Management Page
 * API-ready UI for uploading and managing knowledge sources
 */
export default function KnowledgePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for API-ready UI
  const [knowledgeItems, setKnowledgeItems] = useState([
    { id: '1', name: 'Product_FAQ.pdf', type: 'file', size: '1.2 MB', status: 'trained', date: '2024-05-20' },
    { id: '2', name: 'Company_Vision.txt', type: 'text', size: '4 KB', status: 'trained', date: '2024-05-21' },
    { id: '3', name: 'https://onequestion.space/blog', type: 'url', size: '-', status: 'processing', date: '2024-05-22' },
  ]);

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

  const handleDelete = (id: string) => {
    // API Call would go here: await deleteKnowledge(id);
    setKnowledgeItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = knowledgeItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Knowledge Base" description="Train your AI with custom knowledge.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Knowledge Management Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{knowledgeItems.length} Sources</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{knowledgeItems.filter(i => i.status === 'trained').length} Trained</span>
            </div>
          </div>

          {/* Knowledge List */}
          <div className="glass-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-semibold text-foreground">Active Sources</h3>
            </div>
            
            <div className="divide-y divide-border">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.type === 'file' ? 'bg-blue-500/10 text-blue-500' :
                        item.type === 'url' ? 'bg-green-500/10 text-green-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {item.type === 'file' ? <FileText className="w-5 h-5" /> :
                         item.type === 'url' ? <LinkIcon className="w-5 h-5" /> :
                         <Brain className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.size}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-border"></span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.status === 'trained' ? (
                        <div className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Trained
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full animate-pulse">
                          <Clock className="w-3 h-3" />
                          Processing
                        </div>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-muted-foreground hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No sources found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Upload Card */}
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Knowledge
            </h3>
            
            <div 
              className={`border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer bg-muted/10 group ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={() => setIsUploading(true)}
            >
              <Upload className={`w-10 h-10 text-muted-foreground/30 mx-auto mb-3 group-hover:text-primary transition-colors ${
                isUploading ? 'animate-bounce text-primary' : ''
              }`} />
              <p className="text-sm font-medium text-foreground mb-1">
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </p>
              <p className="text-xs text-muted-foreground">PDF, TXT, DOC up to 10MB</p>
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground hover:bg-primary/10 transition-colors">
                <LinkIcon className="w-4 h-4 text-primary" />
                Import from URL
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground hover:bg-primary/10 transition-colors">
                <Brain className="w-4 h-4 text-primary" />
                Add Raw Text
              </button>
            </div>
          </div>

          {/* AI Status Card */}
          <div className="glass-card rounded-2xl p-6 border border-border bg-primary/5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Training Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Knowledge Density</span>
                  <span className="text-primary font-medium">85%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]"></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your AI is highly trained and ready to answer complex questions about your expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
