const fs = require('fs');

let inbox = fs.readFileSync('app/dashboard/inbox/page.tsx', 'utf8');

// Add state for bulk answering
inbox = inbox.replace(
  `  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);`,
  `  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [bulkAnswering, setBulkAnswering] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkDone, setBulkDone] = useState(false);

  const MAGIC_MESSAGES = [
    "🪄 Doing my magic...",
    "🔍 Searching your knowledge base...",
    "🧠 Thinking hard about this one...",
    "✨ Almost there...",
    "🚀 Sending answers to your visitors...",
  ];

  const handleBulkAnswer = async () => {
    if (!plainUnanswered.length) return;
    setBulkAnswering(true);
    setBulkDone(false);
    let msgIdx = 0;
    setBulkStatus(MAGIC_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % MAGIC_MESSAGES.length;
      setBulkStatus(MAGIC_MESSAGES[msgIdx]);
    }, 1800);
    try {
      const res = await fetch('/api/inbox/answer-all', { method: 'POST' });
      const data = await res.json();
      clearInterval(interval);
      if (data.success) {
        setBulkStatus('✅ Answered ' + data.processed + ' questions!');
        setBulkDone(true);
        toast({ type: 'success', title: 'Magic done!', description: 'Answered ' + data.processed + ' questions.' });
      } else {
        setBulkStatus('Something went wrong. Try again.');
        toast({ type: 'error', title: 'Failed', description: 'Could not answer all questions.' });
      }
    } catch (e) {
      clearInterval(interval);
      setBulkStatus('Connection error. Try again.');
    }
    setBulkAnswering(false);
  };`
);

// Add bulk answer button to unanswered tab header
inbox = inbox.replace(
  `            <CardHeader
              title="Unanswered Questions"
              icon={<HelpCircle className="w-4 h-4 text-primary" />}
              action={<span className="text-xs text-zinc-500">{plainUnanswered.length} waiting</span>}
            />`,
  `            <CardHeader
              title="Unanswered Questions"
              icon={<HelpCircle className="w-4 h-4 text-primary" />}
              action={
                plainUnanswered.length > 0 ? (
                  <button
                    onClick={handleBulkAnswer}
                    disabled={bulkAnswering}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    {bulkAnswering ? bulkStatus : 'Answer all with AI 🪄'}
                  </button>
                ) : (
                  <span className="text-xs text-zinc-500">{plainUnanswered.length} waiting</span>
                )
              }
            />`
);

// Add bulk status message below header when active
inbox = inbox.replace(
  `            {unansweredLoading ? (`,
  `            {bulkAnswering && (
              <div className="mx-4 mb-3 p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-primary animate-pulse">{bulkStatus}</p>
              </div>
            )}
            {bulkDone && !bulkAnswering && (
              <div className="mx-4 mb-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-sm text-green-400">{bulkStatus}</p>
              </div>
            )}
            {unansweredLoading ? (`
);

fs.writeFileSync('app/dashboard/inbox/page.tsx', inbox);
console.log('✓ Inbox bulk AI answer added');
