const fs = require('fs');

let page = fs.readFileSync('app/dashboard/knowledge/page.tsx', 'utf8');

// Add Lightbulb icon to imports
page = page.replace(
  '  Brain, Upload, FileText, Trash2, Plus,\n  Loader2, CheckCircle2, AlertCircle, X',
  '  Brain, Upload, FileText, Trash2, Plus,\n  Loader2, CheckCircle2, AlertCircle, X, Lightbulb, ChevronDown, ChevronUp'
);

// Add showGuide state after other states
page = page.replace(
  "  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');",
  "  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');\n  const [showGuide, setShowGuide] = useState(false);"
);

// Insert guide component before the knowledge list section
const guideBlock = `
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
                  color: '#a855f7',
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
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-primary font-semibold mb-1">Pro tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Upload separate items for each topic — do not dump everything in one block. Smaller focused items = more accurate AI matching. Aim for 5-10 items covering different areas of your life and work.</p>
            </div>
          </div>
        )}
      </div>

`;

page = page.replace(
  '      {/* Knowledge list */}',
  guideBlock + '      {/* Knowledge list */}'
);

fs.writeFileSync('app/dashboard/knowledge/page.tsx', page);
console.log('guide added to knowledge page');
