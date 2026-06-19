const fs = require('fs');

let train = fs.readFileSync('app/dashboard/train/page.tsx', 'utf8');

train = train.replace(
  `  const saveToKnowledge = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const userAnswers = messages
        .filter(m => m.role === 'user')
        .map((m, i) => QUESTIONS[i] + '\\n' + m.content)
        .join('\\n\\n');

      await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'AI Training — Personal Q&A',
          content: userAnswers,
        }),
      });
      setSaved(true);
    } catch (e) { console.error(e); }
    setSaving(false);
  };`,
  `  const saveToKnowledge = async () => {
    if (!userId) { alert('Not signed in'); return; }
    setSaving(true);
    try {
      const userAnswers = messages
        .filter(m => m.role === 'user')
        .map((m, i) => QUESTIONS[i] + '\\n' + m.content)
        .join('\\n\\n');

      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'AI Training — Personal Q&A',
          content: userAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Save failed: ' + (data.error || res.status));
        setSaving(false);
        return;
      }
      setSaved(true);
    } catch (e) {
      alert('Network error: ' + e);
      console.error(e);
    }
    setSaving(false);
  };`
);

fs.writeFileSync('app/dashboard/train/page.tsx', train);
console.log('✓ Fixed train save with error feedback');
