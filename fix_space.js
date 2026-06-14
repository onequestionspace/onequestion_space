const fs = require('fs');
let content = fs.readFileSync('app/[username]/page.tsx', 'utf8');

// Fix: save question AFTER getting AI answer with the answer included
content = content.replace(
  `      try {
        await createQuestion({ profileId: profile._id, question });
        await incrementQuestion({ profileId: profile._id });

        const res = await fetch('/api/ask', {`,
  `      try {
        const res = await fetch('/api/ask', {`
);

content = content.replace(
  `        const fullResponse = data?.data?.answer || data?.answer || 'I am thinking through your question. Please check back shortly.';`,
  `        const fullResponse = data?.data?.answer || data?.answer || 'I am thinking through your question. Please check back shortly.';
        
        // Save question with answer to Convex
        try {
          await createQuestion({ 
            profileId: profile._id, 
            question,
            answer: fullResponse,
            isAnswered: true,
          });
          await incrementQuestion({ profileId: profile._id });
        } catch (e) {
          console.error('Failed to save question:', e);
        }`
);

fs.writeFileSync('app/[username]/page.tsx', content);
console.log('Done');
