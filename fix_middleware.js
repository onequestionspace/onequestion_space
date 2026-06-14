const fs = require('fs');

const content = `import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png).*)',
  ],
};
`;

fs.writeFileSync('middleware.ts', content);
console.log('✅ Created middleware.ts — api routes now excluded from [username] catch-all');
