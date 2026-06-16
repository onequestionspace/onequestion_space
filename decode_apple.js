const fs = require('fs');
const hex = fs.readFileSync('/mnt/user-data/uploads/apple-developer-merchantid-domain-association-copy', 'utf8').trim();
const decoded = Buffer.from(hex, 'hex').toString('utf8');
fs.writeFileSync('public/.well-known/apple-developer-merchantid-domain-association', decoded);
fs.writeFileSync('app/api/well-known/route.ts', [
  "import { NextResponse } from 'next/server';",
  "import { readFileSync } from 'fs';",
  "import { join } from 'path';",
  "export async function GET() {",
  "  const content = readFileSync(join(process.cwd(), 'public/.well-known/apple-developer-merchantid-domain-association'), 'utf8');",
  "  return new NextResponse(content, {",
  "    status: 200,",
  "    headers: { 'Content-Type': 'application/text' },",
  "  });",
  "}",
].join('\n'));
console.log('done, first 100:', decoded.slice(0, 100));
