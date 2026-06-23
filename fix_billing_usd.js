const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Fix plan price display — ₦ to $
billing = billing.replace(
  `<span className='text-2xl font-bold text-foreground'>{p.price === 0 ? 'Free' : '₦' + p.priceNGN.toLocaleString()}</span>`,
  `<span className='text-2xl font-bold text-foreground'>{p.price === 0 ? 'Free' : '$' + p.price}</span>`
);

// Fix upgrade button — priceNGN to price
billing = billing.replace(
  `onClick={() => handleUpgrade(p.id, p.priceNGN)}`,
  `onClick={() => handleUpgrade(p.id, p.price)}`
);

// Fix credit pack prices — ₦ to $
billing = billing.replace(
  `<p className='text-xs font-medium mt-1' style={{ color: '#a855f7' }}>₦{(pack.credits * CREDIT_PRICE).toLocaleString()}</p>`,
  `<p className='text-xs font-medium mt-1' style={{ color: '#a855f7' }}>${'$'}{(pack.credits * CREDIT_PRICE_USD).toFixed(2)}</p>`
);

// Fix summary price display — ₦ to $
billing = billing.replace(
  `<p className='text-2xl font-bold text-foreground'>₦{creditCost.toLocaleString()}</p>`,
  `<p className='text-2xl font-bold text-foreground'>${'$'}{creditCostUSD}</p>`
);

// Fix buy button text
billing = billing.replace(
  /Buy \{creditAmount\} Credits for \$\{.*?\}/g,
  `Buy {creditAmount} Credits for $\{creditCostUSD}`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✓ All NGN replaced with USD');
