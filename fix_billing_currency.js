const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Fix CREDIT_PRICE to NGN
billing = billing.replace(
  "const CREDIT_PRICE = 0.018; // $0.018 per credit — so 500 = $9",
  "const CREDIT_PRICE = 27; // NGN per credit — 500 credits = NGN 13,500 (~$9)\nconst USD_TO_NGN = 1500; // approximate rate for display/conversion"
);

// Fix PLANS to include priceNGN
billing = billing.replace(
  "  {\n    id: 'free',\n    name: 'Free',\n    price: 0,\n    credits: 50,",
  "  {\n    id: 'free',\n    name: 'Free',\n    price: 0,\n    priceNGN: 0,\n    credits: 50,"
);
billing = billing.replace(
  "  {\n    id: 'pro',\n    name: 'Pro',\n    price: 9,\n    credits: 500,",
  "  {\n    id: 'pro',\n    name: 'Pro',\n    price: 9,\n    priceNGN: 13500,\n    credits: 500,"
);

// Fix handleUpgrade signature and amount sent (kobo = NGN * 100)
billing = billing.replace(
  "  const handleUpgrade = async (planId: string, price: number) => {",
  "  const handleUpgrade = async (planId: string, priceNGN: number) => {"
);
billing = billing.replace(
  "          amount: price * 100,",
  "          amount: priceNGN * 100, // kobo"
);
billing = billing.replace(
  "onClick={() => handleUpgrade(p.id, p.price)}",
  "onClick={() => handleUpgrade(p.id, p.priceNGN)}"
);

// Fix credits amount — kobo
billing = billing.replace(
  "          amount: Math.round(creditCost * 100),",
  "          amount: Math.round(creditAmount * CREDIT_PRICE * 100), // kobo"
);

// Fix creditCost calculation and display (now in NGN, whole numbers)
billing = billing.replace(
  "  const creditCost = Math.round(creditAmount * CREDIT_PRICE * 100) / 100;",
  "  const creditCost = Math.round(creditAmount * CREDIT_PRICE);"
);

// Fix price display for plan cards
billing = billing.replace(
  "<span className='text-2xl font-bold text-foreground'>{p.price === 0 ? 'Free' : '$' + p.price}</span>",
  "<span className='text-2xl font-bold text-foreground'>{p.price === 0 ? 'Free' : '₦' + p.priceNGN.toLocaleString()}</span>"
);

// Fix credit pack price display
billing = billing.replace(
  "<p className='text-xs font-medium mt-1' style={{ color: '#a855f7' }}>${Math.round(pack.credits * CREDIT_PRICE * 100) / 100}</p>",
  "<p className='text-xs font-medium mt-1' style={{ color: '#a855f7' }}>₦{(pack.credits * CREDIT_PRICE).toLocaleString()}</p>"
);

// Fix the summary card showing total cost
billing = billing.replace(
  "<p className='text-2xl font-bold text-foreground'>${creditCost}</p>",
  "<p className='text-2xl font-bold text-foreground'>₦{creditCost.toLocaleString()}</p>"
);

// Fix the buy button text
billing = billing.replace(
  "Buy {creditAmount} Credits for \\${creditCost}",
  "Buy {creditAmount} Credits for ₦{creditCost.toLocaleString()}"
);

// Fix the per-credit price line
billing = billing.replace(
  "Top up anytime. Credits never expire. \\$0.018 per credit.",
  "Top up anytime. Credits never expire. ₦27 per credit."
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('1 billing page fixed — all amounts now in NGN correctly');
