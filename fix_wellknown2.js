const fs = require('fs');

// Remove the well-known rewrite from next.config.js entirely
// Next.js serves public/ files automatically — no rewrite needed
let config = fs.readFileSync('next.config.js', 'utf8');

config = config.replace(
  `        {
          source: '/.well-known/apple-developer-merchantid-domain-association',
          destination: '/api/well-known',
        },`,
  ``
);

fs.writeFileSync('next.config.js', config);
console.log('✓ Removed well-known rewrite — public/ serves it directly');
