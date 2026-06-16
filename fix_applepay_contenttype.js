const fs = require('fs');

const content = fs.readFileSync('public/.well-known/apple-developer-merchantid-domain-association', 'utf8');

const route = [
  "import { NextResponse } from 'next/server';",
  "",
  "export async function GET() {",
  "  return new NextResponse(",
  "    " + JSON.stringify(content) + ",",
  "    {",
  "      status: 200,",
  "      headers: {",
  "        'Content-Type': 'application/text',",
  "        'Cache-Control': 'public, max-age=86400',",
  "      },",
  "    }",
  "  );",
  "}",
].join('\n');

fs.writeFileSync('app/api/well-known/route.ts', route);
console.log('content-type fixed to application/text');
