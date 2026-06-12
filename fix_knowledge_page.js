const fs = require('fs');
let content = fs.readFileSync('app/dashboard/knowledge/page.tsx', 'utf8');

// Replace the handleSubmit to use API route instead of Convex directly
content = content.replace(
  `      await createKnowledge({
          userId,
          title: form.title,
          content: form.content,
        });`,
  `      const res = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, content: form.content }),
        });
        if (!res.ok) throw new Error('Failed to save');`
);

fs.writeFileSync('app/dashboard/knowledge/page.tsx', content);
console.log('Done');
