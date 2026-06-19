const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Only show reaction bar if it's a real answer, not the fallback
space = space.replace(
  `                {!isTyping && aiResponse && profile?._id && (`,
  `                {!isTyping && aiResponse && profile?._id && !aiResponse.includes("knowledge base content yet") && (`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Reaction bar hidden for empty knowledge base responses');
