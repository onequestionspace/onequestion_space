const fs = require('fs');
const content = fs.readFileSync('public/.well-known/apple-developer-merchantid-domain-association', 'utf8');
const route = [
  "import { NextResponse } from 'next/server';",
  "",
  "const CONTENT = " + JSON.stringify(content) + ";",
  "",
  "export async function GET() {",
  "  return new NextResponse(CONTENT, {",
  "    status: 200,",
  "    headers: {",
  "      'Content-Type': 'application/text',",
  "    },",
  "  });",
  "}",
].join('\n');
fs.writeFileSync('app/api/well-known/route.ts', route);
console.log('route updated, content length:', content.length);
