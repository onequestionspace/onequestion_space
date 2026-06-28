const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

c = c.replace(
  `      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username, visitorEmail: visitorEmail || undefined }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      setResponseTime(Math.round((Date.now() - t0) / 100) / 10);
      const fullResponse = stripMarkdown(data?.data?.answer || data?.answer || 'Give me a moment — try asking again.');
      let current = '';
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        current += words[i] + ' ';
        setAiResponse(current);
        await new Promise(r => setTimeout(r, 35 + Math.random() * 25));
      }`,
  `      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, username, visitorEmail: visitorEmail || undefined }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) {
        setAiResponse('Monthly AI answer limit reached. Upgrade your plan to continue.');
        setIsTyping(false);
        return;
      }

      if (!res.ok || !res.body) {
        setAiResponse('Something went wrong. Please try again.');
        setIsTyping(false);
        return;
      }

      // Stream tokens as they arrive
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setAiResponse(stripMarkdown(full));
      }

      setResponseTime(Math.round((Date.now() - t0) / 100) / 10);`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
