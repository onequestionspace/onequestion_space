const fs = require('fs');

let proxy = fs.readFileSync('proxy.ts', 'utf8');

proxy = proxy.replace(
  `export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};`,
  `export const config = {
  matcher: [
    '/((?!_next|.well-known|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};`
);

fs.writeFileSync('proxy.ts', proxy);
console.log('✓ .well-known excluded from proxy matcher');
