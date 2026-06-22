const fs = require('fs');

let paystack = fs.readFileSync('lib/payments/paystack.ts', 'utf8');

// Fix currency to USD and add channels
paystack = paystack.replace(
  `  async initialize({ email, amount, metadata, currency = 'NGN' }): Promise<InitializePaymentResult> {
    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, metadata, currency }),
    });`,
  `  async initialize({ email, amount, metadata, currency = 'USD' }): Promise<InitializePaymentResult> {
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
    });`
);

fs.writeFileSync('lib/payments/paystack.ts', paystack);
console.log('✓ Currency set to USD, channels: card + apple_pay');
