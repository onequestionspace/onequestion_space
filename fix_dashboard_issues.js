const fs = require('fs');

// 1. Fix ask route — add incrementAnswerCount
let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');
ask = ask.replace(
  '    await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });',
  '    await convex.mutation(api.analytics.incrementQuestionCount, { profileId: profile._id });\n    await convex.mutation(api.analytics.incrementAnswerCount, { profileId: profile._id });'
);
fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('1 ask route fixed');

// 2. Fix visitor dedup in space page
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
space = space.replace(
  "  useEffect(() => {\n    if (profile?._id) {\n      incrementVisitor({ profileId: profile._id }).catch(() => {});\n    }\n  }, [profile?._id]);",
  "  useEffect(() => {\n    if (profile?._id) {\n      const key = 'visited_' + profile._id;\n      const last = localStorage.getItem(key);\n      const now = Date.now();\n      if (!last || now - parseInt(last) > 86400000) {\n        incrementVisitor({ profileId: profile._id }).catch(() => {});\n        localStorage.setItem(key, now.toString());\n      }\n    }\n  }, [profile?._id]);"
);
fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('2 visitor dedup fixed');
