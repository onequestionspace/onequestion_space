const fs = require('fs');
let p = fs.readFileSync('components/PricingSection.tsx', 'utf8');
p = p.replace('late nights in Kaduna', 'late nights in Yobe');
fs.writeFileSync('components/PricingSection.tsx', p);
console.log('done');
