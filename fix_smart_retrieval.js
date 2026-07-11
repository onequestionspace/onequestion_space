const fs = require('fs');

let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');

// Add smart retrieval after profile fetch, before knowledge chunks
ask = ask.replace(
  `    // 2. Fetch all knowledge chunks for this user`,
  `    // 1c. Check if this exact question was already answered (cache hit)
    const existingAnswer = await convex.query(api.questions.getAnsweredQuestionByText, {
      profileId: profile._id,
      question: question.trim(),
    });
    if (existingAnswer?.answer) {
      return NextResponse.json({
        success: true,
        data: { question, answer: existingAnswer.answer, cached: true }
      }, { status: 200 });
    }

    // 2. Fetch all knowledge chunks for this user`
);

fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('✓ Smart retrieval added to ask route');
