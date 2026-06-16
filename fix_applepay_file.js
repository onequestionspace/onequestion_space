const fs = require('fs');

const hexContent = fs.readFileSync('public/.well-known/apple-developer-merchantid-domain-association', 'utf8').trim();

let decoded;
try {
  decoded = Buffer.from(hexContent, 'hex').toString('utf8');
  console.log('decoded from hex, first 100:', decoded.slice(0, 100));
} catch(e) {
  decoded = hexContent;
  console.log('already plain text, first 100:', decoded.slice(0, 100));
}

const route = [
  "import { NextResponse } from 'next/server';",
  "",
  "const FILE_CONTENT = " + JSON.stringify(decoded) + ";",
  "",
  "export async function GET() {",
  "  return new NextResponse(FILE_CONTENT, {",
  "    status: 200,",
  "    headers: {",
  "      'Content-Type': 'application/text',",
  "      'Cache-Control': 'public, max-age=86400',",
  "    },",
  "  });",
  "}",
].join('\n');

fs.writeFileSync('app/api/well-known/route.ts', route);

// Also write decoded file to public
fs.writeFileSync('public/.well-known/apple-developer-merchantid-domain-association', decoded);
console.log('done');
