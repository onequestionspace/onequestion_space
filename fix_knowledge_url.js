const fs = require('fs');
let c = fs.readFileSync('app/dashboard/knowledge/page.tsx', 'utf8');

// Add Globe to imports
c = c.replace(
  `  Brain, Upload, FileText, Trash2, Plus,
  Loader2, CheckCircle2, AlertCircle, X, Lightbulb, ChevronDown, ChevronUp`,
  `  Brain, Upload, FileText, Trash2, Plus,
  Loader2, CheckCircle2, AlertCircle, X, Lightbulb, ChevronDown, ChevronUp, Globe, Link`
);

// Add URL state
c = c.replace(
  `  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');`,
  `  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlSuccess, setUrlSuccess] = useState('');`
);

// Add URL handler after handleFileSubmit
c = c.replace(
  `  const handleDelete = async (id: Id<'knowledge'>) => {`,
  `  const handleUrlSubmit = async () => {
    if (!urlInput.trim() || !userId) return;
    setUrlLoading(true);
    setUploadError('');
    setUrlSuccess('');
    try {
      const res = await fetch('/api/knowledge/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setUrlSuccess('Learned from: ' + data.title);
      setUrlInput('');
      setTimeout(() => setUrlSuccess(''), 3000);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Failed to fetch URL');
    }
    setUrlLoading(false);
  };

  const handleDelete = async (id: Id<'knowledge'>) => {`
);

// Add URL tab button next to file tab
c = c.replace(
  `              <button onClick={() => setActiveTab('file')}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (activeTab === 'file' ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-white")}>
                <Upload className="w-3.5 h-3.5 inline mr-1" /> File
              </button>`,
  `              <button onClick={() => setActiveTab('file')}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (activeTab === 'file' ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-white")}>
                <Upload className="w-3.5 h-3.5 inline mr-1" /> File
              </button>
              <button onClick={() => setActiveTab('url')}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (activeTab === 'url' ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-white")}>
                <Globe className="w-3.5 h-3.5 inline mr-1" /> URL
              </button>`
);

// Add URL tab content before closing of tab content area
c = c.replace(
  `              {activeTab === 'file' && (`,
  `              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Website or article URL</label>
                    <p className="text-xs text-zinc-600 mb-2">Your AI will read the page and learn from it. Works with articles, about pages, docs, and blog posts.</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="https://yourwebsite.com/about"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-zinc-600 transition-colors"
                        onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                      />
                      <button
                        onClick={handleUrlSubmit}
                        disabled={!urlInput.trim() || urlLoading}
                        className="px-4 py-3 rounded-xl bg-primary text-black text-sm font-black disabled:opacity-50 hover:opacity-90 transition-all flex items-center gap-2 shrink-0"
                      >
                        {urlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Globe className="w-4 h-4" /> Learn</>}
                      </button>
                    </div>
                  </div>
                  {urlSuccess && (
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle2 className="w-4 h-4" /> {urlSuccess}
                    </div>
                  )}
                  <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                    <p className="text-xs font-bold text-white mb-2">Good URLs to add:</p>
                    <ul className="space-y-1 text-xs text-zinc-500">
                      <li>• Your personal website or about page</li>
                      <li>• Your blog posts and articles</li>
                      <li>• Your LinkedIn or Twitter bio page</li>
                      <li>• Your company docs or FAQ page</li>
                      <li>• Any article you want your AI to know about</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'file' && (`
);

fs.writeFileSync('app/dashboard/knowledge/page.tsx', c);
console.log('done');
