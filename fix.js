const fs = require('fs');
let c = fs.readFileSync('app/api/ask/route.ts', 'utf8');

// Add streaming support at the end of the try block, before saving to DB
c = c.replace(
  `    // 3. Embed question + find top 3 most similar chunks`,
  `    // 2b. Check if streaming requested
    const wantsStream = body.stream === true;

    // 3. Embed question + find top 3 most similar chunks`
);

c = c.replace(
  `    // 4. Generate answer with Gemini using context + profile personality
    const profileContext: ProfileContext = {
      displayName: profile.displayName,
      bio: profile.bio,
      welcomeMessage: profile.welcomeMessage,
      username: profile.username,
    };
    const answer = await generateAnswer(question, topChunks, profileContext);

    // 5. Save question + answer to DB`,
  `    // 4. Generate answer
    const profileContext: ProfileContext = {
      displayName: profile.displayName,
      bio: profile.bio,
      welcomeMessage: profile.welcomeMessage,
      username: profile.username,
    };

    // 4b. Streaming path
    if (wantsStream) {
      const streamRes = await streamGemini(question, topChunks, profileContext);
      if (streamRes) {
        // Save question async (don't await — don't block stream)
        createQuestion({ profileId: profile._id, question }).catch(() => {});
        return new Response(streamRes, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
    }

    const answer = await generateAnswer(question, topChunks, profileContext);

    // 5. Save question + answer to DB`
);

fs.writeFileSync('app/api/ask/route.ts', c);
console.log('done');
