const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Fix constants
billing = billing.replace(
  `const CREDIT_PRICE = 27; // NGN per credit — 500 credits = NGN 13,500 (~$9)
const USD_TO_NGN = 1500; // approximate rate for display/conversion`,
  `const CREDIT_PRICE_USD = 0.018;`
);

// Fix plan price display
billing = billing.replace(
  `{p.price === 0 ? 'Free' : '₦' + p.priceNGN.toLocaleString()}`,
  `{p.price === 0 ? 'Free' : '$' + p.price}`
);

// Fix upgrade button call
billing = billing.replace(
  `handleUpgrade(p.id, p.priceNGN)`,
  `handleUpgrade(p.id, p.price)`
);

// Fix handleUpgrade param and amount
billing = billing.replace(
  `const handleUpgrade = async (planId: string, priceNGN: number) => {`,
  `const handleUpgrade = async (planId: string, priceUSD: number) => {`
);
billing = billing.replace(
  `amount: priceNGN * 100, // kobo`,
  `amount: priceUSD * 100,`
);

// Fix credit pack price display
billing = billing.replace(
  `₦{(pack.credits * CREDIT_PRICE).toLocaleString()}`,
  `$${'{'}(pack.credits * CREDIT_PRICE_USD).toFixed(2){'}'}`
);

// Fix summary price
billing = billing.replace(
  `₦{creditCost.toLocaleString()}`,
  `$${'{'}(creditAmount * CREDIT_PRICE_USD).toFixed(2){'}'}`
);

// Fix creditCost variable
billing = billing.replace(
  `const creditCost = Math.round(creditAmount * CREDIT_PRICE);`,
  ``
);

// Fix handleBuyCredits amount
billing = billing.replace(
  `amount: Math.round(creditAmount * CREDIT_PRICE * 100),`,
  `amount: Math.round(creditAmount * CREDIT_PRICE_USD * 100),`
);

// Fix buy button text if present
billing = billing.replace(
  /Buy \{creditAmount\} Credits for ₦\{creditCost\.toLocaleString\(\)\}/g,
  `Buy {creditAmount} Credits for ${'{'}(creditAmount * CREDIT_PRICE_USD).toFixed(2){'}'}`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✓ Billing fixed cleanly');
