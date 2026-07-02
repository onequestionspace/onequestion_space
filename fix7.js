const fs = require('fs');
const path = 'app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = [
  { name: 'loading', regex: /^\s*const loading = !profile \|\| analytics === undefined \|\| knowledgeCount === undefined \|\| subscription === undefined;\s*$/m },
  { name: 'isNewUser', regex: /^\s*const isNewUser = !knowledgeCount \|\| knowledgeCount === 0;\s*$/m },
  { name: 'messagesUsed', regex: /^\s*const messagesUsed = subscription\?\.messagesUsed \?\? 0;\s*$/m },
  { name: 'messagesLimit', regex: /^\s*const messagesLimit = subscription\?\.messagesLimit \?\? 50;\s*$/m },
  { name: 'pendingCount', regex: /^\s*const pendingCount = unansweredQuestions\?\.length \?\? 0;\s*$/m },
];

let extracted = [];
for (const { name, regex } of lines) {
  const match = content.match(regex);
  if (!match) {
    console.error(`❌ Could not find: ${name}`);
    process.exit(1);
  }
  extracted.push(match[0].trim());
  content = content.replace(match[0] + '\n', '');
}

const memoRegex = /^\s*const insights: string\[\] = useMemo\(\(\) => \{/m;
const memoMatch = content.match(memoRegex);
if (!memoMatch) {
  console.error('❌ Could not find useMemo start.');
  process.exit(1);
}

const insertion = '  ' + extracted.join('\n  ') + '\n\n' + memoMatch[0];
content = content.replace(memoMatch[0], insertion);

fs.writeFileSync(path, content);
console.log('✅ Derived consts relocated above useMemo (regex-based, whitespace-safe).');
