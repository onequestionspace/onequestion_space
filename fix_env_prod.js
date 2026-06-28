const fs = require('fs');
let c = fs.readFileSync('.env.local', 'utf8');
c = c.replace('https://adept-beagle-919.convex.cloud', 'https://confident-orca-149.convex.cloud');
c = c.replace('https://adept-beagle-919.convex.site', 'https://confident-orca-149.convex.site');
c = c.replace('dev:adept-beagle-919', 'prod:confident-orca-149');
fs.writeFileSync('.env.local', c);
console.log('done');
