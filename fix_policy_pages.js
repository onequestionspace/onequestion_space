const fs = require('fs');

const PRIVACY_KNOWLEDGE = `
One Question Privacy Policy:

DATA WE COLLECT:
- Account info: name, email, username via Clerk authentication
- Knowledge base content you upload (text, files)
- Questions asked to your AI space by visitors
- Analytics: visitor counts, question counts, response rates
- Payment info processed securely via Paystack (we never store card details)

HOW WE USE YOUR DATA:
- To power your AI space and answer visitor questions
- To show you analytics about your space performance
- To process payments for credits and subscriptions
- We never sell your data to third parties
- We never use your knowledge base to train our models

DATA STORAGE:
- All data stored in Convex (real-time database) with encryption at rest
- Authentication handled by Clerk with industry-standard security
- Files and knowledge stored securely on our servers

YOUR RIGHTS:
- You can delete your account and all data at any time from Settings
- You can delete individual knowledge items from your dashboard
- You can export your data by contacting us at support@onequestion.space

COOKIES:
- We use minimal cookies for authentication only
- No advertising cookies or third-party trackers

CONTACT:
- Email: support@onequestion.space
- X: @OneQuestion_Spa
`;

const TERMS_KNOWLEDGE = `
One Question Terms of Service:

ACCEPTABLE USE:
- You must be 13 or older to use One Question
- Do not upload illegal, harmful, or misleading content to your knowledge base
- Do not use One Question to impersonate others
- Do not attempt to reverse engineer or abuse our AI systems
- Commercial use is allowed on Pro and above plans

YOUR CONTENT:
- You own all content you upload to your knowledge base
- By uploading, you grant us license to process it to power your AI
- We do not claim ownership of your knowledge base content
- You are responsible for ensuring your content does not violate others rights

PAYMENTS AND REFUNDS:
- Free plan: 50 AI credits per month, no payment required
- Pro plan: dollar 9 per month for 500 credits, billed monthly via Paystack
- Credits purchased are non-refundable once used
- Unused subscription credits do not roll over to next month
- Cancel anytime from your billing page

ACCOUNT TERMINATION:
- You can delete your account at any time from Settings
- We may suspend accounts that violate these terms
- On deletion, all your data including knowledge base and questions is permanently removed

LIMITATIONS:
- One Question is provided as-is without warranty
- We are not responsible for AI answers generated from your knowledge base
- Service uptime target is 99.9% but not guaranteed

CONTACT:
- Email: support@onequestion.space
- X: @OneQuestion_Spa
- For urgent issues: contact us on X
`;

// Fix privacy page
let privacy = fs.readFileSync('app/privacy/page.tsx', 'utf8');
privacy = privacy.replace(
  "      const res = await fetch('/api/ask', {",
  "      const res = await fetch('/api/explore', {"
);
privacy = privacy.replace(
  /body: JSON\.stringify\({[^}]*}\),\s*\}\);\s*const data = await res\.json\(\);\s*setMessages\(prev => \[\.\.\.prev, \{ role: 'ai', text: data\.answer[^}]*\}\]\);/,
  "body: JSON.stringify({ question: q, history: messages, knowledgeOverride: " + JSON.stringify(PRIVACY_KNOWLEDGE) + " }),\n      });\n      const data = await res.json();\n      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'I could not answer that. Try rephrasing.' }]);"
);
fs.writeFileSync('app/privacy/page.tsx', privacy);
console.log('1 privacy page fixed');

// Fix terms page
let terms = fs.readFileSync('app/terms/page.tsx', 'utf8');
terms = terms.replace(
  "      const res = await fetch('/api/ask', {",
  "      const res = await fetch('/api/explore', {"
);
terms = terms.replace(
  /body: JSON\.stringify\({[^}]*}\),\s*\}\);\s*const data = await res\.json\(\);\s*setMessages\(prev => \[\.\.\.prev, \{ role: 'ai', text: data\.answer[^}]*\}\]\);/,
  "body: JSON.stringify({ question: q, history: messages, knowledgeOverride: " + JSON.stringify(TERMS_KNOWLEDGE) + " }),\n      });\n      const data = await res.json();\n      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'I could not answer that. Try rephrasing.' }]);"
);
fs.writeFileSync('app/terms/page.tsx', terms);
console.log('2 terms page fixed');

// Update explore route to support knowledgeOverride
let explore = fs.readFileSync('app/api/explore/route.ts', 'utf8');
explore = explore.replace(
  "    const { question, history } = await req.json();",
  "    const { question, history, knowledgeOverride } = await req.json();"
);
explore = explore.replace(
  "    const systemPrompt = `You are the Knowledge Explorer AI for One Question.",
  "    const activeKnowledge = knowledgeOverride || KNOWLEDGE;\n    const systemPrompt = `You are the Knowledge Explorer AI for One Question."
);
explore = explore.replace(
  "KNOWLEDGE BASE:\\n${KNOWLEDGE}`",
  "KNOWLEDGE BASE:\\n${activeKnowledge}`"
);
fs.writeFileSync('app/api/explore/route.ts', explore);
console.log('3 explore route supports knowledgeOverride');
