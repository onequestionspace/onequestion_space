const fs = require('fs');
let c = fs.readFileSync('app/api/stream/route.ts', 'utf8');

// Replace streamGemini with one that returns null on rate limit
c = c.replace(
  `async function streamGemini(prompt: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const res = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=\${GEMINI_API_KEY}&alt=sse\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }),
      }
    );
    if (!res.ok || !res.body) return null;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        let buffer = '';
        let tokenCount = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const json = line.slice(6).trim();
              if (json === '[DONE]') continue;
              try {
                const parsed = JSON.parse(json);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                tokenCount += parsed.usageMetadata?.candidatesTokenCount ?? 0;
                const finishReason = parsed.candidates?.[0]?.finishReason;
                if (finishReason === 'MAX_TOKENS' && tokenCount < 50) { controller.close(); reader.releaseLock(); return; }
                if (text) controller.enqueue(encoder.encode(text.replace(/\\*\\*/g, '').replace(/^#{1,6}\\s/gm, '')));
              } catch {}
            }
          }
        } finally { controller.close(); reader.releaseLock(); }
      },
    });
  } catch { return null; }
}`,
  `async function streamGemini(prompt: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const res = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=\${GEMINI_API_KEY}&alt=sse\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }),
      }
    );
    if (!res.ok || !res.body) return null;

    // Pre-read first chunk to detect rate limiting before returning stream
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const reader = res.body.getReader();
    let firstChunks = '';
    let totalText = '';
    let isRateLimited = false;

    // Read first 3 SSE events to check if we are getting real content
    let eventCount = 0;
    while (eventCount < 3) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      firstChunks += chunk;
      const lines = firstChunks.split('\\n');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (json === '[DONE]') continue;
        try {
          const parsed = JSON.parse(json);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          const tokenCount = parsed.usageMetadata?.candidatesTokenCount ?? 0;
          const finishReason = parsed.candidates?.[0]?.finishReason;
          if (finishReason === 'MAX_TOKENS' && tokenCount < 50) { isRateLimited = true; break; }
          totalText += text;
          eventCount++;
        } catch {}
      }
      if (isRateLimited) break;
    }

    if (isRateLimited || totalText.trim().length === 0) {
      reader.releaseLock();
      return null;
    }

    // Stream is good — pipe remaining content
    return new ReadableStream({
      async start(controller) {
        // First enqueue what we already read
        if (totalText) controller.enqueue(encoder.encode(totalText));
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const json = line.slice(6).trim();
              if (json === '[DONE]') continue;
              try {
                const text = JSON.parse(json).candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (text) controller.enqueue(encoder.encode(text));
              } catch {}
            }
          }
        } finally { controller.close(); reader.releaseLock(); }
      },
    });
  } catch { return null; }
}`
);

fs.writeFileSync('app/api/stream/route.ts', c);
console.log('done');
