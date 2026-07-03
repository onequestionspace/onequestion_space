const fs = require('fs');
const path = 'app/api/paystack/subscribe/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldImport = `import { auth } from '@clerk/nextjs/server';`;
const newImport = `import { auth } from '@clerk/nextjs/server';\nimport { getUsdToNgnRate } from '@/lib/exchangeRate';`;

const oldBody = `    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });

    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: 1350000,
        currency: 'NGN',
        plan: PRO_PLAN_CODE,
        channels: ['card', 'apple_pay'],
        metadata: { userId, plan: 'pro', type: 'subscription' },
      }),
    });`;

const newBody = `    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });

    const PRO_PLAN_USD = 9;
    const rate = await getUsdToNgnRate();
    const ngnKobo = Math.round(PRO_PLAN_USD * rate * 100);

    // Keep the Plan's configured amount in sync with the live rate first —
    // Paystack rejects the transaction if amount doesn't match the plan exactly.
    await fetch(BASE + '/plan/' + PRO_PLAN_CODE, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: ngnKobo }),
    }).catch(err => console.error('Plan sync failed, proceeding with existing plan amount:', err));

    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: ngnKobo,
        currency: 'NGN',
        plan: PRO_PLAN_CODE,
        channels: ['card', 'apple_pay'],
        metadata: { userId, plan: 'pro', type: 'subscription', usdAmount: PRO_PLAN_USD, ngnRate: rate },
      }),
    });`;

if (!content.includes(oldBody)) {
  console.error('❌ Pattern not found — aborting.');
  process.exit(1);
}
content = content.replace(oldImport, newImport);
content = content.replace(oldBody, newBody);
fs.writeFileSync(path, content);
console.log('✅ Pro plan now syncs to live $9 → NGN rate before each checkout.');
