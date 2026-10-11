type TextExtractor = (data: unknown) => string;

async function* readEventStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  extractText: TextExtractor,
): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = '';

  const parseFrame = (frame: string) => {
    const data = frame
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).replace(/^ /, ''))
      .join('\n');
    if (!data || data === '[DONE]') return '';

    try {
      return extractText(JSON.parse(data));
    } catch {
      return '';
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      if (done) buffer += decoder.decode();

      let separator = buffer.search(/\r?\n\r?\n/);
      while (separator !== -1) {
        const frame = buffer.slice(0, separator);
        const separatorLength = buffer.slice(separator).match(/^\r?\n\r?\n/)?.[0].length ?? 2;
        buffer = buffer.slice(separator + separatorLength);
        const text = parseFrame(frame);
        if (text) yield text;
        separator = buffer.search(/\r?\n\r?\n/);
      }

      if (done) {
        const text = parseFrame(buffer);
        if (text) yield text;
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function streamFromProvider(
  url: string,
  headers: HeadersInit,
  body: string,
  extractText: TextExtractor,
  provider: string,
): Promise<ReadableStream<Uint8Array> | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    console.error(`[ai-stream] ${provider} request failed:`, error);
    return null;
  }

  if (!response.ok || !response.body) {
    console.error(`[ai-stream] ${provider} returned HTTP ${response.status}`);
    return null;
  }

  const reader = response.body.getReader();
  const iterator = readEventStream(reader, extractText);
  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await iterator.next();
  } catch (error) {
    console.error(`[ai-stream] ${provider} stream failed:`, error);
    return null;
  }
  if (firstChunk.done) return null;

  let initialText: string | undefined = firstChunk.value;
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (initialText !== undefined) {
          controller.enqueue(encoder.encode(initialText));
          initialText = undefined;
          return;
        }
        const next = await iterator.next();
        if (next.done) {
          controller.close();
        } else {
          controller.enqueue(encoder.encode(next.value));
        }
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await reader.cancel();
    },
  });
}

async function streamGeminiResponse(
  prompt: string,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array> | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  return streamFromProvider(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${geminiKey}&alt=sse`,
    { 'Content-Type': 'application/json' },
    JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
    (data) => {
      if (!data || typeof data !== 'object') return '';
      const candidate = (data as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      }).candidates?.[0];
      return candidate?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    },
    'Gemini',
  );
}

async function streamGroqResponse(
  prompt: string,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array> | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  return streamFromProvider(
    'https://api.groq.com/openai/v1/chat/completions',
    { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
      stream: true,
    }),
    (data) => {
      if (!data || typeof data !== 'object') return '';
      const choices = (data as {
        choices?: Array<{ delta?: { content?: string } }>;
      }).choices;
      return choices?.[0]?.delta?.content ?? '';
    },
    'Groq',
  );
}

export async function streamAIResponse(
  prompt: string,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array> | null> {
  return (await streamGeminiResponse(prompt, maxTokens))
    ?? streamGroqResponse(prompt, maxTokens);
}
