const fs = require('fs');
const path = 'lib/payments/paystack.ts';
let content = fs.readFileSync(path, 'utf8');

const oldImport = `import crypto from 'crypto';`;
const newImport = `import crypto from 'crypto';\nimport { getUsdToNgnRate } from '../exchangeRate';`;

const oldInit = `  async initialize({ email, amount, metadata, currency = 'USD' }): Promise<InitializePaymentResult> {
    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount,
        metadata,
        currency,
        channels: ['card', 'apple_pay'],
      }),
    });`;

const newInit = `  async initialize({ email, amount, metadata }): Promise<InitializePaymentResult> {
    // amount arrives as USD cents from the frontend — Paystack NG accounts settle in NGN only
    const rate = await getUsdToNgnRate();
    const usdAmount = amount / 100;
    const ngnKobo = Math.round(usdAmount * rate * 100);

    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: ngnKobo,
        metadata: { ...metadata, usdAmount, ngnRate: rate },
        currency: 'NGN',
        channels: ['card', 'apple_pay'],
      }),
    });`;

if (!content.includes(oldInit)) {
  console.error('❌ initialize() pattern not found — aborting.');
  process.exit(1);
}
content = content.replace(oldImport, newImport);
content = content.replace(oldInit, newInit);
fs.writeFileSync(path, content);
console.log('✅ PaystackAdapter now converts USD → live NGN rate before charging, currency forced to NGN.');
