const fs = require('fs');

// Create API route to serve the file
fs.mkdirSync('app/api/well-known', { recursive: true });

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
  "        'Content-Type': 'application/json',",
  "        'Cache-Control': 'public, max-age=86400',",
  "      },",
  "    }",
  "  );",
  "}",
].join('\n');

fs.writeFileSync('app/api/well-known/route.ts', route);
console.log('API route created');

// Add rewrite in next.config.js to map .well-known to API route
let config = fs.readFileSync('next.config.js', 'utf8');
config = config.replace(
  "        {\n          source: '/api/:path*',\n          destination: '/api/:path*',\n        },",
  "        {\n          source: '/api/:path*',\n          destination: '/api/:path*',\n        },\n        {\n          source: '/.well-known/apple-developer-merchantid-domain-association',\n          destination: '/api/well-known',\n        },"
);
fs.writeFileSync('next.config.js', config);
console.log('rewrite added');
