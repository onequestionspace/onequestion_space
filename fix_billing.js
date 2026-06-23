const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Fix constants — USD only
billing = billing.replace(
  `const CREDIT_PRICE = 27; // NGN per credit — 500 credits = NGN 13,500 (~$9)
const USD_TO_NGN = 1500; // approximate rate for display/conversion`,
  `const CREDIT_PRICE_USD = 0.018; // $0.018 per credit — 500 credits = $9`
);

// Fix PLANS — remove priceNGN, use USD only
billing = billing.replace(
  `const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceNGN: 0,
    credits: 50,
    color: '#71717a',
    features: ['50 AI answers/month', 'Basic analytics', 'Space customization', 'Knowledge base'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    priceNGN: 13500,
    credits: 500,
    color: '#a855f7',
    features: ['500 AI answers/month', 'Advanced analytics', 'Priority AI processing', 'Remove One Question branding', 'Custom welcome message'],
    recommended: true,
  },
];`,
  `const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 50,
    color: '#71717a',
    features: ['50 AI answers/month', 'Basic analytics', 'Space customization', 'Knowledge base'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    credits: 500,
    color: '#a855f7',
    features: ['500 AI answers/month', 'Advanced analytics', 'Priority AI processing', 'Remove One Question branding', 'Custom welcome message'],
    recommended: true,
  },
];`
);

// Fix creditCost calculation — USD in cents for Paystack
billing = billing.replace(
  `  const creditCost = Math.round(creditAmount * CREDIT_PRICE);`,
  `  const creditCostUSD = (creditAmount * CREDIT_PRICE_USD).toFixed(2);`
);

// Fix handleUpgrade — send USD amount in cents
billing = billing.replace(
  `  const handleUpgrade = async (planId: string, priceNGN: number) => {
    if (!userId) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceNGN * 100, // kobo
          email: '',
          metadata: { userId, plan: planId, type: 'subscription' },
        }),
      });`,
  `  const handleUpgrade = async (planId: string, priceUSD: number) => {
    if (!userId) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceUSD * 100, // cents
          metadata: { userId, plan: planId, type: 'subscription' },
        }),
      });`
);

// Fix handleBuyCredits — USD cents
billing = billing.replace(
  `          amount: Math.round(creditAmount * CREDIT_PRICE * 100),`,
  `          amount: Math.round(creditAmount * CREDIT_PRICE_USD * 100),`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✓ Fixed billing constants and payment amounts to USD');
