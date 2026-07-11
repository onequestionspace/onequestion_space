const fs = require('fs');
let c = fs.readFileSync('app/api/stream/route.ts', 'utf8');

// Wrap the stream to capture full content and save to DB after done
c = c.replace(
  `    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked', 'X-Accel-Buffering': 'no', 'Cache-Control': 'no-cache' },
    });`,
  `    // Wrap stream to capture full answer and save to DB
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullAnswer = '';
    const wrappedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullAnswer += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } finally {
          controller.close();
          reader.releaseLock();
          // Save full answer to DB after stream completes
          if (fullAnswer.trim()) {
            convex.mutation(api.questions.createQuestion, {
              profileId: profile._id,
              question,
              answer: fullAnswer.trim(),
              isAnswered: true,
              createdAt: Date.now(),
              answeredAt: Date.now(),
            }).catch(() => {});
          }
        }
      },
    });

    return new Response(wrappedStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked', 'X-Accel-Buffering': 'no', 'Cache-Control': 'no-cache' },
    });`
);

// Remove the old async mutation call that saves without answer
c = c.replace(
  `    convex.mutation(api.questions.createQuestion, { profileId: profile._id, question, isAnswered: true, createdAt: Date.now() }).catch(() => {});`,
  `    // question saved after stream completes with full answer`
);

fs.writeFileSync('app/api/stream/route.ts', c);
console.log('done');
