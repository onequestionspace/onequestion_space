const fs = require('fs');

let page = fs.readFileSync('app/dashboard/knowledge/page.tsx', 'utf8');

// Remove direct convex mutation import usage for createKnowledge
// Replace handleTextSubmit to use /api/knowledge route instead
page = page.replace(
  `  const handleTextSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !userId) return;
    setUploading(true);
    setUploadError('');
    try {
      await createKnowledge({
        userId,
        title: form.title,
        content: form.content,
      });
      setForm({ title: '', content: '' });
      setUploadSuccess(true);
      setIsAdding(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (e) {
      setUploadError('Failed to save. Please try again.');
    }
    setUploading(false);
  };`,
  `  const handleTextSubmit = async () => {
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
  };`
);

fs.writeFileSync('app/dashboard/knowledge/page.tsx', page);
console.log('1 knowledge page now uses /api/knowledge with embeddings');
